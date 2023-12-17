import type {NextRequest} from "next/server";
import type {ApiResponse} from "@/lib/types/importables/types";

import {NextResponse} from "next/server";

import {db} from "@/backend/db/db";
import {generateApiResponse} from "@/lib/utils/utils";

interface RequestType {
  days: {name: string; openTime: number; closeTime: number}[];
  courts: number[];
}

export async function POST(request: NextRequest) {
  const {days, courts} = (await request.json()) as RequestType;
  const daysToCreate = [];
  let response: ApiResponse = generateApiResponse(
    {},
    200,
    "Se actualizaron los horarios de la cancha correctamente",
  );

  for (const court of courts) {
    for (const day of days) {
      daysToCreate.push(
        //El upsert se utiliza para hacer un update en caso de que exista.
        db.day.upsert({
          where: {
            name_courtId: {name: day.name, courtId: court},
          },
          update: {
            openTime: day.openTime,
            closeTime: day.closeTime,
          },
          create: {
            openTime: day.openTime,
            closeTime: day.closeTime,
            name: day.name,
            courtId: court,
          },
        }),
      );
    }
  }

  //Se inserta todo o nada.
  await db.$transaction(daysToCreate).catch((error) => {
    response = generateApiResponse(
      {...error},
      500,
      "Error al crear horarios en las canchas solicitadas",
    );
  });

  return NextResponse.json(response);
}
