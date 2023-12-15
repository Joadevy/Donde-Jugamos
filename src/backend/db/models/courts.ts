/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type {Court, Prisma} from "@prisma/client";

import {changeDateTime} from "@/lib/utils/utils";

import {db} from "../db";

export type CourtFullInfo = Prisma.CourtGetPayload<{
  include: {
    sport: {
      select: {
        id: true;
        name: true;
        duration: true;
      };
    };
    days: true;
    sportCenter: {
      select: {
        name: true;
      };
    };
    appointments: true;
  };
}>;

export type CourtWithDays = Prisma.CourtGetPayload<{
  include: {
    days: true;
  };
}>;

export type CourtWithSport = Prisma.CourtGetPayload<{
  include: {
    sport: true;
  };
}>;

export const getSportCenterCourts = async (sportCenterId: number): Promise<CourtWithSport[]> => {
  const courts = await db.court.findMany({
    where: {
      sportCenterId,
    },
    include: {
      sport: true,
    },
  });

  return courts;
};

export const getCourtById = async (courtId: number): Promise<CourtWithSport | null> => {
  const court = await db.court.findUnique({
    where: {
      id: courtId,
    },
    include: {
      sport: true,
    },
  });

  return court;
};

export const getFullCourtById = async (courtId: number): Promise<CourtFullInfo | null> => {
  const court = await db.court.findUnique({
    where: {
      id: courtId,
    },
    include: {
      sport: {
        select: {
          id: true,
          name: true,
          duration: true,
        },
      },
      days: true,
      sportCenter: {
        select: {
          name: true,
        },
      },
      appointments: true,
    },
  });

  return court;
};

export const findWithDays = async (
  sportCenterId: string | number,
  courtId: string | number,
): Promise<CourtFullInfo | null> => {
  const currentDate = new Date();
  const limitDate = new Date();

  currentDate.setHours(0, 0, 0, 0);
  limitDate.setDate(limitDate.getDate() + 10);

  return await db.court.findUnique({
    where: {
      id: Number(courtId),
      sportCenterId: Number(sportCenterId),
    },
    include: {
      sport: {
        select: {
          id: true,
          name: true,
          duration: true,
        },
      },
      days: true,
      sportCenter: {
        select: {
          name: true,
        },
      },
      appointments: {
        where: {
          date: {
            gte: currentDate,
            lte: limitDate,
          },
        },
      },
    },
  });
};

export const lastAppointmentDate = async (courtId: string | number): Promise<Date | null> => {
  const currentDate = changeDateTime(new Date());

  try {
    const result = await db.appointment.aggregate({
      _max: {
        date: true,
      },
      where: {
        courtId: Number(courtId),
        date: {
          gte: currentDate,
        },
      },
    });

    if (result) {
      const maxDate = new Date(result._max.date!);

      return maxDate; // Devuelve la fecha obtenida como un objeto Date
    } else {
      return null; // Devuelve null si no se encuentra la fecha máxima
    }
  } catch (error) {
    throw error; // Relanza el error para manejarlo fuera de esta función si es necesario
  }
};

export const findWithDaysSport = async (
  sportCenterId: string | number,
  courtId: string | number,
): Promise<CourtFullInfo | null> => {
  return await db.court.findUnique({
    where: {
      id: Number(courtId),
      sportCenterId: Number(sportCenterId),
    },
    include: {
      days: true,
      sport: true,
      sportCenter: true,
      appointments: {
        take: 0,
      },
    },
  });
};

export const findCourtsWithSameDuration = async (
  sportCenterId: string | number,
  courtId: string | number,
  duration: number,
): Promise<Court[] | null> => {
  return await db.court.findMany({
    where: {
      sportCenterId: Number(sportCenterId),
      sport: {
        duration,
      },
      NOT: {
        id: Number(courtId),
      },
    },
  });
};
