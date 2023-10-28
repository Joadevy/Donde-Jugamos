import {type Sport} from "@prisma/client";

import {db} from "../db";

export const getSports = async (): Promise<Sport[]> => {
  return await db.sport.findMany();
};
