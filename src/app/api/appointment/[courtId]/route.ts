import type {NextRequest} from "next/server";
import type {Appointment} from "@prisma/client";

import {NextResponse} from "next/server";

import {saveAppointments, updateAppointments} from "@/backend/db/models/appointments";

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
