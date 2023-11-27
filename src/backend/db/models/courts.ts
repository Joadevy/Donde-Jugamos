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
