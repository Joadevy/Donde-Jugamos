import type {NextRequest} from "next/server";
import type {ApiResponse} from "@/lib/types/importables/types";

import {NextResponse} from "next/server";

import {db} from "@/backend/db/db";
import {generateApiResponse} from "@/lib/utils/utils";

export async function PUT(request: NextRequest, {params}: {params: {id: string}}) {
  const sportCenterId = Number(params.id);
  const data: {state: string; reason: string} = await request.json();
  let response: ApiResponse;

  await db.sportCenter
    .update({
      where: {
        id: sportCenterId,
      },
      data: {
        state: data.state,
      },
    })
    .catch((error) => {
      response = generateApiResponse(
        {...error},
        500,
        "Error al cambiar de estado al establecimiento",
      );
    });

  //Envio de Mail informando al usuario el estado del Establecimiento

  response = generateApiResponse(
    {},
    200,
    "Se va a enviar un correo electrónico al propietario informando la resolución",
  );

  return NextResponse.json(response);
}
