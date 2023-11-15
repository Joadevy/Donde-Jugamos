import type {Prisma, Reservation} from "@prisma/client";

import {timeInStringFromMinutes} from "@/lib/utils/utils";
import handleSendEmail from "@/backend/email/nodemailer";
import {compileNewReservationTemplate} from "@/backend/email/templates/NewReservation";

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

  await handleSendEmail(
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

export const getUpcomingUserReservationsByEmail = async (email: string) => {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error("El usuario no existe");
  }

  return await getUpcomingUserReservations(user.id);
};
