import type {Court, Prisma} from "@prisma/client";

import {db} from "../db";

export type CourtWithDays = Prisma.CourtGetPayload<{
  include: {
    days: true;
  };
}>;

export type CourtWithDaysSport = Prisma.CourtGetPayload<{
  include: {
    days: true;
    sport: true;
  };
}>;

export const findWithDays = async (
  sportCenterId: string | number,
  courtId: string | number,
): Promise<CourtWithDays | null> => {
  return await db.court.findUnique({
    where: {
      id: Number(courtId),
      sportCenterId: Number(sportCenterId),
    },
    include: {
      days: true,
    },
  });
};

export const findWithDaysSport = async (
  sportCenterId: string | number,
  courtId: string | number,
): Promise<CourtWithDaysSport | null> => {
  return await db.court.findUnique({
    where: {
      id: Number(courtId),
      sportCenterId: Number(sportCenterId),
    },
    include: {
      days: true,
      sport: true,
      appointments: {
        where: {
          date: await db.appointment.aggregate({
            _max: {
              date: true,
            },
            where: {
              courtId: Number(courtId),
            },
            take: 1,
          }),
        },
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
