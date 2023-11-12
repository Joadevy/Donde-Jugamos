import type {Prisma} from "@prisma/client";

import {db} from "../db";

export type AppointmentWithCourtAndSportcenter = Prisma.AppointmentGetPayload<{
  include: {
    court: {
      include: {
        sport: true;
        sportCenter: {
          include: {
            city: true;
          };
        };
      };
    };
  };
}>;

export const getAppointmentFullInformation = async (
  id: number,
): Promise<AppointmentWithCourtAndSportcenter | null> => {
  const appointment = await db.appointment.findUnique({
    where: {
      id,
    },
    include: {
      court: {
        include: {
          sportCenter: {
            include: {
              city: true,
            },
          },
          sport: true,
        },
      },
    },
  });

  return appointment;
};
