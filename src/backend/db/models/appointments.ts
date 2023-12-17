import type {Appointment, Prisma} from "@prisma/client";

import {db} from "../db";

interface ReponseType {
  data: unknown;
  status: number;
  message: string;
}

export type AppointmentWithCourtAndSportcenter = Prisma.AppointmentGetPayload<{
  include: {
    court: {
      include: {
        sport: true;
        sportCenter: {
          include: {
            city: true;
          };
        };
      };
    };
  };
}>;

export type AppointmentReservation = Prisma.AppointmentGetPayload<{
  include: {
    reservations: {
      select: {
        state: true;
      };
    };
  };
}>;

export const getAppointmentFullInformation = async (
  id: number,
): Promise<AppointmentWithCourtAndSportcenter | null> => {
  const appointment = await db.appointment.findUnique({
    where: {
      id,
    },
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
  });

  return appointment;
};

export const saveAppointments = async (
  appointments: Omit<Appointment, "id">[],
): Promise<boolean> => {
  const appointmentsQuery = [];

  for (const appointment of appointments) {
    appointmentsQuery.push(
      db.appointment.create({
        data: appointment,
      }),
    );
  }

  try {
    if (!appointmentsQuery.length) {
      throw new Error();
    }

    await db.$transaction(appointmentsQuery).catch((error) => {
      throw error;
    });

    return true;
  } catch (error) {
    return false;
  }
};

export const updateAppointments = async (appointments: Appointment[]): Promise<boolean> => {
  const appointmentsQuery = [];

  for (const appointment of appointments) {
    appointmentsQuery.push(
      db.appointment.update({
        where: {
          id: appointment.id,
        },
        data: {
          active: appointment.active,
        },
      }),
    );
  }

  try {
    if (!appointmentsQuery.length) {
      throw new Error();
    }

    await db.$transaction(appointmentsQuery).catch((error) => {
      throw error;
    });

    return true;
  } catch (error) {
    return false;
  }
};

export const deleteAppointments = async (
  appointments: Omit<Appointment, "id">[],
): Promise<ReponseType> => {
  const appointmentsQuery = [];
  let appointmentsToDeleteArray: number[] = [];

  for (const appointment of appointments) {
    const appointmentsToDelete = await db.appointment.findMany({
      where: {
        date: appointment.date,
        courtId: appointment.courtId,
      },
      select: {
        id: true,
      },
    });

    appointmentsToDeleteArray = [
      ...appointmentsToDeleteArray,
      ...appointmentsToDelete.map((a) => a.id),
    ];
  }

  if (appointmentsToDeleteArray.length) {
    for (const appointmentId of appointmentsToDeleteArray) {
      appointmentsQuery.push(
        db.appointment.delete({
          where: {
            id: appointmentId,
          },
        }),
      );
    }
  }

  try {
    if (!appointmentsQuery.length) {
      throw new Error("No se pudieron generar los turnos.");
    }

    await db.$transaction(appointmentsQuery).catch((error) => {
      return {
        data: error,
        status: 500,
        message: "Error al generar los turnos",
      };
    });

    return {
      data: null,
      status: 200,
      message: "Los turnos se generaron correctamente",
    };
  } catch (error) {
    return {
      data: error,
      status: 500,
      message: "Error al generar los turnos",
    };
  }
};

export const getAllCourtAppointments = async (courtId: number) => {
  const currentDate = new Date();

  currentDate.setHours(0, 0, 0, 0);
  const appointments = await db.appointment.findMany({
    where: {
      date: {
        gte: currentDate,
      },
      courtId: courtId,
    },
  });

  return appointments;
};
