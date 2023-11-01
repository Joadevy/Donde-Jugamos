import type {Prisma} from "@prisma/client";

import {db} from "../db";

export type SportCentersWithCourtsAndAppointments = Prisma.SportCenterGetPayload<{
  include: {
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
                gte: date,
                // equals: date, // tendria que matchear exacto o no? Si te pide para el 31/10 y hay para el 1/11 lo mostramos?
              },
              startTime: {
                gte: time,
                // equals: time, // lo mismo que para date pero con la hora aunque aca es un poquito mas flexible segun mi parecer
              },
            },
            none: {
              reservations: {
                some: {
                  state: {
                    in: ["approved", "pending"],
                    // Si hay alguna reserva aprobada o pendiente en ese horario no lo mostramos
                  },
                },
              },
            },
          },
        },
      },
    },
    include: {
      courts: {
        include: {
          appointments: true,
        },
      },
    },
  });
};
