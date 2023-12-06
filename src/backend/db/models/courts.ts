import type {Prisma} from "@prisma/client";

import {db} from "../db";

export type CourtFullInfo = Prisma.CourtGetPayload<{
  include: {
    sport: true;
  };
}>;

export const getSportCenterCourts = async (sportCenterId: number): Promise<CourtFullInfo[]> => {
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

export const getCourtById = async (courtId: number): Promise<CourtFullInfo | null> => {
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
