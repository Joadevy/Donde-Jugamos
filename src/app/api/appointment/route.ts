import type {NextRequest} from "next/server";
// import type {SportCenter} from "@prisma/client";

import type {SportCenter} from "@/lib/types/importables/types";

import {NextResponse} from "next/server";

import {db} from "@/backend/db/db";

export function GET(request: NextRequest) {
  return NextResponse.json("GET Request");
}

export async function POST(request: NextRequest) {
  const {city: postCode, sport, date, time} = await request.json();
  let sportCenters: SportCenter[] = [];
  let message = "";
  let status = 200;

  try {
    sportCenters = await db.sportCenter.findMany({
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
                  gte: 0,
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

    if (sportCenters.length === 0) {
      message = "No hay establecimientos con canchas disponibles en el horario seleccionado..";
    }
  } catch (error) {
    message = `Ocurrio un error al obtener los establecimientos. Error: ${String(error)}`;
    status = 500;
  }

  return NextResponse.json({data: sportCenters, status, message});
}
