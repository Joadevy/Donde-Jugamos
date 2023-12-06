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
