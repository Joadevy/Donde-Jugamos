import type {City} from "@prisma/client";

import {db} from "../db";

export const getCities = async (): Promise<Pick<City, "name" | "postCode">[]> => {
  return await db.city.findMany({
    select: {
      name: true,
      postCode: true,
    },
  });
};
