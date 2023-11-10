import type {Prisma} from "@prisma/client";

import {db} from "../db";

export type SportCentersWithCourtsAndAppointments = Prisma.SportCenterGetPayload<{
  include: {
    user: true;
    courts: {
      include: {
        appointments: true;
      };
    };
  };
}>;

export const getSportCentersWithCourtsByFilters = async (
  postCode: string,
  sport: string,
  date: Date,
  time: number,
): Promise<SportCentersWithCourtsAndAppointments[]> => {
  return await db.sportCenter.findMany({
    where: {
      city: {
        postCode: postCode,
      },
      active: true, // de los que estan activos
      courts: {
        some: {
          sport: {
            name: sport,
          },
          appointments: {
            some: {
              date: {
                equals: date,
              },
              startTime: {
                gte: time,
              },
            },
          },
        },
      },
    },
    include: {
      courts: {
        include: {
          appointments: {
            where: {
              reservations: {
                none: {
                  state: {
                    in: ["approved", "pending"],
                  },
                },
              },
            },
          },
        },
      },
      user: true,
    },
  });
};
