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
      include: {
        user: true;
      };
    };
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

export const deleteAppointmentsQuerys = (appointments: Appointment[]) => {
  const appointmentsQuery = [];

  if (appointments.length) {
    for (const appointment of appointments) {
      appointmentsQuery.push(
        db.appointment.delete({
          where: {
            id: appointment.id,
          },
        }),
      );
    }
  }

  return appointmentsQuery;
};

export const deleteAppointments = async (appointments: Appointment[]): Promise<ReponseType> => {
  const appointmentsQuery = deleteAppointmentsQuerys(appointments);

  try {
    if (appointmentsQuery.length) {
      await db.$transaction(appointmentsQuery).catch((error) => {
        return {
          data: error,
          status: 500,
          message: "Error al generar los turnos",
        };
      });
    }

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

export const getLastAppointment = async (courtId: number) => {
  const maxDate = await db.appointment.aggregate({
    _max: {
      date: true,
    },
    where: {
      courtId,
      active: true,
    },
  });

  return maxDate ? maxDate._max.date : null;
};
