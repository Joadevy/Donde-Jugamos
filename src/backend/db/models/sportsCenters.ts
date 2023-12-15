/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
import type {Prisma, SportCenter} from "@prisma/client";

import {timeToMinutes} from "@/lib/utils/utils";

import {db} from "../db";

import {getUserByEmail} from "./users";

export const SPORT_CENTER_PENDING = "pending";

export const SPORT_CENTER_APPROVED = "approved";

export const SPORT_CENTER_REJECTED = "rejected";

export const SPORT_CENTER_CANCELED = "canceled";

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
  date: string,
  time: number,
): Promise<SportCentersWithCourtsAndAppointments[]> => {
  const isToday =
    new Date(date).toLocaleDateString("es-AR") === new Date().toLocaleDateString("es-AR");

  // Para no devolver turnos que ya se haya pasado la hora de inicio
  const timeToCompare = isToday
    ? timeToMinutes(
        new Date().toLocaleTimeString("es-AR", {
          timeZone: "America/Argentina/Buenos_Aires",
        }),
      )
    : time;

  const sportCenters = await db.sportCenter.findMany({
    where: {
      city: {
        postCode: postCode,
      },
      active: true, // de los que estan activos
    },
    include: {
      city: true,
      courts: {
        where: {
          sport: {
            name: sport,
          },
          appointments: {
            some: {},
          },
        },
        include: {
          appointments: {
            orderBy: {
              startTime: "asc",
            },
            where: {
              active: true,
              date: {
                equals: date,
              },
              startTime: {
                gte: timeToCompare,
              },
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

export const getSportCenterByIdWithReservations = async (
  id: number,
): Promise<SportCentersWithCourtsAndAppointments | null> => {
  return await db.sportCenter.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      city: true,
      courts: {
        include: {
          appointments: {
            include: {
              reservations: true,
            },
          },
        },
      },
    },
  });
};

export type SportCentersWithUserAndCity = Prisma.SportCenterGetPayload<{
  include: {
    city: true;
    user: true;
  };
}>;

export const getSportCentersWithUserAndCity = async (
  name?: string,
  postCode?: string,
): Promise<SportCentersWithUserAndCity[]> => {
  return await db.sportCenter.findMany({
    where: {
      state: "approved",
      name: {
        contains: name,
      },
      city: {
        postCode: {
          equals: postCode,
        },
      },
    },
    include: {
      user: true,
      city: true,
    },
  });
};

export const getSportCenterByIdWithUserAndCity = async (
  id: number,
): Promise<SportCentersWithUserAndCity | null> => {
  return await db.sportCenter.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      city: true,
    },
  });
};

export const getUserPendingSportCenters = async (
  userEmail: string,
): Promise<SportCenter[] | null> => {
  const user = await getUserByEmail(userEmail);

  if (user) {
    return await db.sportCenter.findMany({
      where: {
        userId: user.id,
      },
    });
  }

  return null;
};

export const getSportCentersByState = async (state: string): Promise<SportCenter[] | null> => {
  return await db.sportCenter
    .findMany({
      where: {
        state,
      },
    })
    .catch(() => null);
};

export const getFullSportCentersByState = async (
  state: string,
): Promise<SportCentersWithUserAndCity[] | null> => {
  return await db.sportCenter
    .findMany({
      where: {
        state,
      },
      include: {
        user: true,
        city: true,
      },
    })
    .catch(() => null);
};
