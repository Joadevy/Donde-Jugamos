/* eslint-disable @typescript-eslint/require-await */
import type {NextRequest} from "next/server";
import type {ApiResponse} from "@/lib/types/importables/types";

import {NextResponse} from "next/server";

import {db} from "@/backend/db/db";
import {generateApiResponse} from "@/lib/utils/utils";
import {updateUserRoleById} from "@/backend/db/models/users";
import {compileGenericTemplate} from "@/backend/email/templates/GenericTemplate";
import handleSendEmail from "@/backend/email/nodemailer";
import {activateCity} from "@/backend/db/models/cities";
import {allowedOrigins} from "@/lib/utils/utils";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get("origin") ?? "";

  if (!allowedOrigins.includes(origin)) {
    return NextResponse.error();
  }

  corsHeaders["Access-Control-Allow-Origin"] = origin;

  return NextResponse.json({}, {headers: corsHeaders});
}

export async function PUT(request: NextRequest, {params}: {params: {id: string}}) {
  const sportCenterId = Number(params.id);
  const data: {state: string; reason: string} = await request.json();
  let response: ApiResponse;

  const sportCenter = await db.sportCenter
    .update({
      where: {
        id: sportCenterId,
      },
      data: {
        state: data.state,
        active: true,
      },
    })
    .catch((error) => {
      response = generateApiResponse(
        {...error},
        500,
        "Error al cambiar de estado al establecimiento",
      );
    });

  if (sportCenter) {
    await updateUserRoleById(sportCenter.userId, "propietary");

    const turnCityActive = activateCity(sportCenter.id);
    //Envio de Mail informando al usuario el estado del Establecimiento
    const sendEmailPropietary = handleSendEmail(
      sportCenter.email,
      `Solicitud de alta ${data.state === "approved" ? "aprobada" : "rechazada"}`,
      compileGenericTemplate(
        `Solicitud de registro ${data.state === "approved" ? "aprobada" : "rechazada"}`,
        `Su solicitud para dar de alta al establecimiento "${sportCenter.name}" ha sido ${
          data.state === "approved" ? "aprobada" : "rechazada"
        }`,
        `${
          data.state === "approved"
            ? "Primeros pasos a partir de ahora"
            : "Motivo o mensaje por parte de la administracion"
        }`,
        `${
          data.state === "approved"
            ? "Necesitaras ingresar con tu cuenta con la que realizaste la solicitud y verificar que ahora eres propietario!"
            : data.reason
        }`,
        "dondejugamos.vercel.app",
      ),
    );

    await Promise.all([turnCityActive, sendEmailPropietary]);
  }

  response = generateApiResponse(
    {},
    200,
    "Se va a enviar un correo electrónico al propietario informando la resolución",
  );

  return NextResponse.json(response);
}

export async function PATCH(request: NextRequest, {params}: {params: {id: string}}) {
  const sportCenterId = Number(params.id);
  const data: {active: boolean} = await request.json();
  let response: ApiResponse;

  const sportCenter = await db.sportCenter
    .update({
      where: {
        id: sportCenterId,
      },
      data: {
        active: data.active,
      },
    })
    .catch((error) => {
      response = generateApiResponse(
        {...error},
        500,
        "Error al activar/desactivar al establecimiento",
      );
    });

  //TODO: Envio de Mail informando al usuario el estado del Establecimiento
  //TODO: Revocar la propiedad del establecimiento?

  response = generateApiResponse(
    sportCenter,
    200,
    "Se va a enviar un correo electrónico al propietario informando la resolución",
  );

  return NextResponse.json(response);
}
