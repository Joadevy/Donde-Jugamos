/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/require-await */
import type {NextRequest} from "next/server";
import type {SportCentersWithCourtsAndAppointments} from "./../../../backend/db/models/sportsCenters";
import type {UploadApiResponse} from "cloudinary";

import {v2 as cloudinary} from "cloudinary";
import {NextResponse} from "next/server";

import {getSportCentersWithCourtsByFilters} from "@/backend/db/models/sportsCenters";
import {createReservation} from "@/backend/db/models/reservations";
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
    sportCenters = await getSportCentersWithCourtsByFilters(
      postCode,
      sport,
      date.toDateString(),
      time,
    );

    if (sportCenters.length === 0) {
      message = "No hay establecimientos con canchas disponibles en el horario seleccionado..";
    }
  } catch (error) {
    message = `Ocurrio un error al obtener los establecimientos. Error: ${String(error)}`;
    status = 500;
  }

  return NextResponse.json({data: sportCenters, status, message});
}

cloudinary.config({
  cloud_name: "dkjkgri6x",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const observation = formData.get("observation") as string;
  const file: File | "" = formData.get("paymentFile") as File;
  const appointmentId = Number(formData.get("appointmentId") as string);

  if (!appointmentId) {
    return NextResponse.json({data: "", status: 400, message: "Faltan parametros"});
  }

  let paymentConfirmation: string | undefined = "";

  if (file && file.type.startsWith("image/")) {
    const bytes = await file.arrayBuffer();

    const buffer = Buffer.from(bytes);

    const cloudinaryResponse: UploadApiResponse | undefined = await new Promise(
      (resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            public_id: `payment_confirmation/${file.name}`,
            overwrite: true,
            format: file.type.split("/")[1],
          },
          (error, result) => {
            if (error) {
              reject(error);
            }

            resolve(result);
          },
        );

        uploadStream.write(buffer);
        uploadStream.end();
      },
    );

    paymentConfirmation = cloudinaryResponse?.secure_url;
  }

  try {
    const reservation = await createReservation({
      observation,
      paymentConfirmation: paymentConfirmation ?? "",
      appointmentId,
    });

    return NextResponse.json({
      data: reservation,
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
