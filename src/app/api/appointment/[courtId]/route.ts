/* eslint-disable @typescript-eslint/require-await */
import type {NextRequest} from "next/server";
import type {Appointment} from "@prisma/client";

import {NextResponse} from "next/server";

import {allowedOrigins} from "@/lib/utils/utils";
import {saveAppointments, updateAppointments} from "@/backend/db/models/appointments";

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

export async function POST(request: NextRequest) {
  const appointments: Omit<Appointment, "id">[] = await request.json();

  try {
    const result = await saveAppointments(appointments);

    if (result) {
      return NextResponse.json({
        data: result,
        status: 200,
        message: "Exito al generar los turnos",
      });
    } else {
      throw new Error("No se pudieron generar los turnos (Clave Compuesta)");
    }
  } catch (error) {
    return NextResponse.json({
      data: error,
      status: 500,
      message: `Ocurrio un error al generar la reserva.Error: ${String(error)}`,
    });
  }
}

export async function PUT(request: NextRequest) {
  const appointments: Appointment[] = await request.json();

  try {
    const result = await updateAppointments(appointments);

    if (result) {
      return NextResponse.json({
        data: result,
        status: 200,
        message: "Exito al generar los turnos",
      });
    } else {
      throw new Error("No se pudieron generar los turnos (Clave Compuesta)");
    }
  } catch (error) {
    return NextResponse.json({
      data: error,
      status: 500,
      message: `Ocurrio un error al generar la reserva.Error: ${String(error)}`,
    });
  }
}
