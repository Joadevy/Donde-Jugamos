import type {NextRequest} from "next/server";
import type {SportCenter} from "@prisma/client";

import {NextResponse} from "next/server";

import {db} from "@/backend/db/db";

export async function GET(request: NextRequest) {
  const {searchParams} = new URL(request.url);

  const postCode = searchParams.get("city");
  const sport = searchParams.get("sport");
  const date = searchParams.get("date")?.toString();
  const time = parseInt(searchParams.get("time") || "0");

  let sportCenters: SportCenter[] = [];
  let message = "";
  let status = 200;

  try {
    sportCenters = await db.sportCenter.findMany({
      where: {
        city: {
          postCode: postCode!,
        },
        active: true, // de los que estan activos
        courts: {
          some: {
            sport: {
              name: sport!,
            },
            appointments: {
              some: {
                date: {
                  // gte: date,
                  equals: date, // tendria que matchear exacto o no? Si te pide para el 31/10 y hay para el 1/11 lo mostramos?
                },
                startTime: {
                  // gte: time,
                  equals: time, // lo mismo que para date pero con la hora aunque aca es un poquito mas flexible segun mi parecer
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
    });

    if (sportCenters.length === 0) {
      message = "No hay establecimientos con canchas disponibles en el horario seleccionado.";
    }
  } catch (error) {
    console.log(error);
    message = `Ocurrio un error al obtener los establecimientos. Error: ${String(error)}`;
    status = 500;
  }

  return NextResponse.json({data: sportCenters, status, message});
}
