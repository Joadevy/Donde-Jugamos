import type {Prisma} from "@prisma/client";

import {db} from "../db";

import {Appointment} from "./../../../lib/types/importables/types";

export type SportCentersWithCourtsAndAppointments = Prisma.SportCenterGetPayload<{
  include: {
    city: true;
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
  const sportCenters = await db.sportCenter.findMany({
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
      city: true,
      courts: {
        include: {
          appointments: {
            orderBy: {
              startTime: "asc",
            },
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

  // Como no se puede chequear inicialmente si tiene o no appointments disponibles ya que se chequea esta condicion
  // en el include, se filtran ahora (sino devuelve por mas que no tenga ningun turno disponible ya que el filtro de la query inicial lo pasa)
  return sportCenters.filter((sportCenter) =>
    sportCenter.courts.some((court) => court.appointments.length > 0),
  );
};
