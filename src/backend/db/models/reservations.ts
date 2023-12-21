import type {Prisma, Reservation} from "@prisma/client";

import {timeInStringFromMinutes, turnStateToSpanish} from "@/lib/utils/utils";
import handleSendEmail from "@/backend/email/nodemailer";
import {compileNewReservationTemplate} from "@/backend/email/templates/NewReservation";
import {compilePropietaryChangeStatusTemplate} from "@/backend/email/templates/PropietaryChangeStateReservation";
import {compileUpdateStatusReservationTemplate} from "@/backend/email/templates/UpdateStatusReservation";

import {db} from "../db";

import {getUserByEmail} from "./users";
import {getAppointmentFullInformation} from "./appointments";

export const RESERVATION_PENDING = "pending";

export const RESERVATION_APPROVED = "approved";

export const RESERVATION_REJECTED = "rejected";

export const RESERVATION_CANCELED = "canceled";

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
    include: {
      user: true,
    },
  });

  const getAppointmentInfo = getAppointmentFullInformation(appointmentId);

  const [reservation, appointmentInfo] = await Promise.all([create, getAppointmentInfo]);

  if (!appointmentInfo) throw new Error("Error el encontrar el appointment asociado");

  const sendEmailToUser = handleSendEmail(
    user.email!,
    "Nueva reserva",
    compileNewReservationTemplate(
      appointmentInfo.court.sportCenter.name,
      appointmentInfo.court.sportCenter.address,

      new Date(appointmentInfo.date).toLocaleString("es-AR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      appointmentInfo.court.sportCenter.city.name,
      timeInStringFromMinutes(String(appointmentInfo.startTime)),
      timeInStringFromMinutes(String(appointmentInfo.endTime)),
      String(appointmentInfo.courtId),
      String("$" + appointmentInfo.court.price),
    ),
  );

  const sendEmailToPropietary = handleSendEmail(
    appointmentInfo.court.sportCenter.email,
    "Solicitud nueva reserva",
    compilePropietaryChangeStatusTemplate(
      "pendiente",
      `Una reserva previamente ha sido creada.`,
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
      String(appointmentInfo.court.name),
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
      observation,
      reservation.user.name ?? "",
      reservation.user.email ?? "",
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
      state: "canceled",
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
      String(appointmentInfo.court.name),
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

export const getReservationFullInfo = async (id: number): Promise<ReservationFullInfo | null> => {
  const reservation = await db.reservation.findUnique({
    where: {
      id,
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
  });

  return reservation;
};

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

export const getUserReservationsByEmailAndState = async (
  email: string,
  state?: Reservation["state"],
) => {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new Error("El usuario no existe");
  }

  const reservations = await db.reservation.findMany({
    where: {
      userId: user.id,
      state: {
        in: state ? [state] : ["pending", "approved"],
      },
      appointment: {
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
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

  return reservations;
};

export type ReservationFullInfoWithUser = Prisma.ReservationGetPayload<{
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
    user: true;
  };
}>;

interface ReservationsResponse {
  data: {
    reservations: ReservationFullInfoWithUser[];
  };
  pagination: {
    total: number;
    pageSize: number;
    page: number;
    totalPages: number;
  };
}

// se podria reformar la query para devolver la cnatidad de resultados total, el numero de pagina y el total de paginas.
export const getSportCenterReservations = async (
  sportCenterId: number,
  page?: number,
  state?: Reservation["state"],
): Promise<ReservationsResponse> => {
  const take = 5;
  const skip = page ? (page - 1) * take : 0;
  // Obtener el total de reservas
  const totalReservations = await db.reservation.count({
    where: {
      state: {
        in: state ? [state] : ["pending"],
      },
      appointment: {
        date: {
          gte: state === "pending" || !state ? new Date() : undefined,
        },
        court: {
          sportCenterId,
        },
      },
    },
  });

  // Calcular el total de páginas
  const totalPages = Math.ceil(totalReservations / take);

  const reservations = await db.reservation.findMany({
    skip, // (page - 1) * take,
    take: page && page >= 0 ? take : undefined,
    where: {
      state: {
        in: state ? [state] : ["pending"],
      },
      appointment: {
        date: {
          gte: state === "pending" || !state ? new Date() : undefined,
        },
        court: {
          sportCenterId,
        },
      },
    },
    include: {
      user: true,
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

  const response = {
    data: {
      reservations,
    },
    pagination: {
      total: totalReservations,
      pageSize: take,
      page: page ? page : 1,
      totalPages,
    },
  };

  return response;
};

export const getSportCenterHistoricReservations = async (sportCenterId: number) => {
  const allReservations = await db.reservation.findMany({
    where: {
      appointment: {
        court: {
          sportCenterId,
        },
      },
    },

    include: {
      appointment: {},
    },
  });

  return allReservations.filter(
    (reservation) =>
      reservation.state !== "pending" ||
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      (reservation.state == "pending" && reservation.appointment.date >= new Date()),
  );
};

export const updateReservationState = async (reservationId: string, newState: string) => {
  if (
    newState != RESERVATION_APPROVED &&
    newState != RESERVATION_REJECTED &&
    newState != RESERVATION_PENDING &&
    newState != RESERVATION_CANCELED
  )
    return null;

  const updatedReservation = await db.reservation.update({
    where: {
      id: Number(reservationId),
    },
    data: {
      state: newState.toLocaleLowerCase(),
    },
  });

  const getReservationInfo = getReservationFullInfo(Number(reservationId));
  const getUserInfo = getUserByEmail("");

  const [reservationInfo, user] = await Promise.all([getReservationInfo, getUserInfo]);

  if (!reservationInfo || !user)
    throw new Error("Error el encontrar la reserva asociada o el usuario activo");

  await handleSendEmail(
    user.email!,
    newState === RESERVATION_APPROVED
      ? "Solicitud de reserva aprobada"
      : "Solicitud de reserva rechazada",
    compileUpdateStatusReservationTemplate(
      newState === RESERVATION_APPROVED ? "aprobada" : "rechazada",
      "Ante cualquier duda, comuniquese con el establecimiento.",
      reservationInfo.appointment.court.sportCenter.name,
      reservationInfo.appointment.court.sportCenter.address,
      new Date(reservationInfo.appointment.date).toLocaleString("es-AR", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      reservationInfo.appointment.court.sportCenter.city.name,
      timeInStringFromMinutes(String(reservationInfo.appointment.startTime)),
      timeInStringFromMinutes(String(reservationInfo.appointment.endTime)),
      String(reservationInfo.appointment.court.name),
      reservationInfo.appointment.court.price.toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      }),
    ),
  );

  return updatedReservation;
};
