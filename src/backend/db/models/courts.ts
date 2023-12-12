import type {Court, Prisma} from "@prisma/client";

import {db} from "../db";

export type CourtFullInfo = Prisma.CourtGetPayload<{
  include: {
    sport: {
     select: {
      name: true,
     } 
    },
    days: true,
    sportCenter: {
      select: {
        name: true,
      }
    },
    appointments: true,
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

export const findWithDays = async (
  sportCenterId: string | number,
  courtId: string | number,
): Promise<CourtFullInfo | null> => {
  const limitDate = new Date();
  limitDate.setDate( limitDate.getDate() + 10);

  return await db.court.findUnique({
    where: {
      id: Number(courtId),
      sportCenterId: Number(sportCenterId),
    },
    include: {
      sport: {
       select: {
        name: true,
       } 
      },
      days: true,
      sportCenter: {
        select: {
          name: true,
        }
      },
      appointments: {
        where: {
          date: {
            lte: limitDate
          }
        }
      }
    }
  });
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
      }
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
