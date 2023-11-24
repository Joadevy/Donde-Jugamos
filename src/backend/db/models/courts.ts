import type {Prisma} from "@prisma/client";

import {db} from "../db";

export type CourtWithDays = Prisma.CourtGetPayload<{
  include: {
    days: true;
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
