import type {Prisma, Reservation} from "@prisma/client";

import {timeInStringFromMinutes, turnStateToSpanish} from "@/lib/utils/utils";
import handleSendEmail from "@/backend/email/nodemailer";
import {compileNewReservationTemplate} from "@/backend/email/templates/NewReservation";
import {compilePropietaryChangeStatusTemplate} from "@/backend/email/templates/PropietaryChangeStateReservation";

import {db} from "../db";

import {getUserByEmail} from "./users";
import {getAppointmentFullInformation} from "./appointments";

export const createReservation = async ({
  observation,
  paymentConfirmation,
  appointmentId,
}: {
  observation: string;
  paymentConfirmation: string;
  appointmentId: number;
}): Promise<Reservation> => {
  const user = await getUserByEmail("");

  if (!user) {
    throw new Error("El usuario no existe");
  }

  const create = db.reservation.create({
    data: {
      observation,
      paymentConfirmation,
      appointmentId,
      userId: user.id,
    },
  });

  const getAppointmentInfo = getAppointmentFullInformation(appointmentId);

  const [reservation, appointmentInfo] = await Promise.all([create, getAppointmentInfo]);

  const sendEmailToUser = handleSendEmail(
    user.email!,
    "Nueva reserva",
    compileNewReservationTemplate(
      appointmentInfo?.court.sportCenter.name ?? "",
      appointmentInfo?.court.sportCenter.address ?? "",
      appointmentInfo?.date
        ? new Date(appointmentInfo.date).toLocaleString("es-AR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "",

      appointmentInfo?.court.sportCenter.city.name ?? "",
      timeInStringFromMinutes(String(appointmentInfo?.startTime)),
      timeInStringFromMinutes(String(appointmentInfo?.endTime)),
      String(appointmentInfo?.courtId),
      String("$" + appointmentInfo?.court.price),
    ),
  );

  const sendEmailToPropietary = handleSendEmail(
    appointmentInfo?.court.sportCenter.email ?? "",
    "Solicitud nueva reserva",
    compileNewReservationTemplate(
      appointmentInfo?.court.sportCenter.name ?? "",
      appointmentInfo?.court.sportCenter.address ?? "",
      appointmentInfo?.date
        ? new Date(appointmentInfo.date).toLocaleString("es-AR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "",

      appointmentInfo?.court.sportCenter.city.name ?? "",
      timeInStringFromMinutes(String(appointmentInfo?.startTime)),
      timeInStringFromMinutes(String(appointmentInfo?.endTime)),
      String(appointmentInfo?.courtId),
      String("$" + appointmentInfo?.court.price),
    ),
  );

  await Promise.all([sendEmailToUser, sendEmailToPropietary]);

  return reservation;
};

export const updateReservation = async ({
  id,
  observation,
  paymentConfirmation,
}: {
  id: number;
  observation: string;
  paymentConfirmation: string;
}): Promise<Reservation> => {
  if (!observation && !paymentConfirmation) return {} as Reservation;

  const reservation = await db.reservation.update({
    where: {
      id,
    },
    data: {
      observation: observation ? observation : undefined,
      paymentConfirmation,
    },
  });

  return reservation;
};

export const getReservationState = async (id: number): Promise<Reservation["state"]> => {
  const reservation = await db.reservation.findUnique({
    where: {
      id,
    },
    select: {
      state: true,
    },
  });

  return reservation?.state ?? "pending";
};

export const cancelReservation = async (id: number, observation?: string): Promise<Reservation> => {
  const prevReservationStatus = await getReservationState(id);
  const prevReservationStatusInSpanish = turnStateToSpanish(prevReservationStatus);

  const reservation = await db.reservation.update({
    where: {
      id,
    },
    data: {
      state: "cancelled",
      observation: observation ? observation : undefined,
    },
    include: {
      user: true,
    },
  });

  const appointmentInfo = await getAppointmentFullInformation(reservation.appointmentId);

  if (!appointmentInfo) throw new Error("Error el encontrar el appointment asociado");

  await handleSendEmail(
    appointmentInfo.court.sportCenter.email,
    "Reserva cancelada",
    compilePropietaryChangeStatusTemplate(
      "cancelada",
      `Una reserva previamente en estado ${prevReservationStatusInSpanish} ha sido cancelada.`,
      reservation.id,
      appointmentInfo.court.sportCenter.name,
      appointmentInfo.court.sportCenter.address,
      appointmentInfo.court.sportCenter.city.name,
      new Date(appointmentInfo.date).toLocaleString("es-AR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      timeInStringFromMinutes(String(appointmentInfo.startTime)),
      timeInStringFromMinutes(String(appointmentInfo.endTime)),
      String(appointmentInfo.courtId),
      appointmentInfo.court.price.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      }),
      appointmentInfo.court.sportCenter.acceptPartialPayment
        ? (
            (appointmentInfo.court.price *
              appointmentInfo.court.sportCenter.partialPaymentPercentage) /
            100
          ).toLocaleString("es-AR", {
            style: "currency",
            currency: "ARS",
          })
        : "-",
      observation ?? "-",
      reservation.user.name ?? "",
      reservation.user.email ?? "",
    ),
  );

  return reservation;
};

export type ReservationFullInfo = Prisma.ReservationGetPayload<{
  include: {
    appointment: {
      include: {
        court: {
          include: {
            sportCenter: {
              include: {
                city: true;
              };
            };
            sport: true;
          };
        };
      };
    };
  };
}>;

export const getUpcomingUserReservations = async (userId: string) => {
  const appointments = await db.reservation.findMany({
    where: {
      userId,
      appointment: {
        date: {
          gte: new Date(),
        },
      },
      // state: {
      //   in: ["pending", "approved"],
      // },
    },
    include: {
      appointment: {
        include: {
          court: {
            include: {
              sportCenter: {
                include: {
                  city: true,
                },
              },
              sport: true,
            },
          },
        },
      },
    },
    orderBy: [
      {
        appointment: {
          date: "asc",
        },
      },
      {
        appointment: {
          startTime: "asc",
        },
      },
    ],
  });

  return appointments;
};

export const getUpcomingUserReservationsByEmail = async (email: string) => {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error("El usuario no existe");
  }

  return await getUpcomingUserReservations(user.id);
};

export const getCancelledUserReservations = async (userId: string) => {
  const appointments = await db.reservation.findMany({
    where: {
      userId,
      appointment: {
        date: {
          gte: new Date(),
        },
      },
      state: "cancelled",
    },
    include: {
      appointment: {
        include: {
          court: {
            include: {
              sportCenter: {
                include: {
                  city: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return appointments;
};
