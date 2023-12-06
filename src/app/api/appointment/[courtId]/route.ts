import type {NextRequest} from "next/server";
import type {Appointment} from "@prisma/client";

import {NextResponse} from "next/server";

import {saveAppointments} from "@/backend/db/models/appointments";

export async function POST(request: NextRequest) {
  const appointmets: Omit<Appointment, "id">[] = await request.json();

  try {
    const result = await saveAppointments(appointmets);

    return NextResponse.json({
      data: result,
      status: 200,
      message: "Exito al generar la reserva",
    });
  } catch (error) {
    return NextResponse.json({
      data: "",
      status: 500,
      message: `Ocurrio un error al generar la reserva.Error: ${String(error)}`,
    });
  }
}
