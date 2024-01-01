/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/require-await */
import type {NextRequest} from "next/server";

import {NextResponse} from "next/server";

import {updateReservationState} from "@/backend/db/models/reservations";
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

export async function PUT(request: NextRequest) {
  const body: {
    reservationId: string;
    state: string;
  } = await request.json();
  const reservationId = body.reservationId;
  const newState = body.state;

  if (!reservationId || !newState) {
    return NextResponse.json({
      data: "",
      status: 400,
      message: "Faltan parametros",
    });
  }

  try {
    const updatedReservation = await updateReservationState(reservationId, newState);

    if (!updatedReservation) {
      return NextResponse.json({
        data: "",
        status: 400,
        message: "No pudo actualziar la reserva, el nuevo estado probablemente no es valido",
      });
    }

    return NextResponse.json({
      data: updatedReservation,
      status: 200,
      message: "Exito al actualizar la reserva",
    });
  } catch (error) {
    return NextResponse.json({
      data: "",
      status: 500,
      message: `Ocurrio un error al actualizar la reserva.Error: ${String(error)}`,
    });
  }
}
