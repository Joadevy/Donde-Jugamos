import type {NextRequest} from "next/server";
import type {SportCentersWithCourtsAndAppointments} from "./../../../backend/db/models/sportsCenters";

import {NextResponse} from "next/server";

import {getSportCentersWithCourtsByFilters} from "@/backend/db/models/sportsCenters";

export async function GET(request: NextRequest) {
  const {searchParams} = new URL(request.url);

  const postCode = searchParams.get("city");
  const sport = searchParams.get("sport");
  const date = new Date(searchParams.get("date") ?? "");
  const time = Number(searchParams.get("time"));

  if (!postCode || !sport || !date.getDay() || !time) {
    return NextResponse.json({
      data: [],
      status: 400,
      message: "Faltan parametros",
    });
  }

  let sportCenters: SportCentersWithCourtsAndAppointments[] = [];
  let message = "";
  let status = 200;

  try {
    sportCenters = await getSportCentersWithCourtsByFilters(postCode, sport, date, time);

    if (sportCenters.length === 0) {
      message = "No hay establecimientos con canchas disponibles en el horario seleccionado..";
    }
  } catch (error) {
    message = `Ocurrio un error al obtener los establecimientos. Error: ${String(error)}`;
    status = 500;
  }

  return NextResponse.json({data: sportCenters, status, message});
}
