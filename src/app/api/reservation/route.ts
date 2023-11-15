/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/require-await */
import type {NextRequest} from "next/server";
import type {UploadApiResponse} from "cloudinary";

import {v2 as cloudinary} from "cloudinary";
import {NextResponse} from "next/server";

import {cancelReservation, updateReservation} from "@/backend/db/models/reservations";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://dondejugamos.vercel.app/",
];

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

cloudinary.config({
  cloud_name: "dkjkgri6x",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PATCH(request: NextRequest) {
  const {reservationId} = await request.json();

  if (!reservationId) {
    return NextResponse.json({
      data: "",
      status: 400,
      message: "Faltan parametros",
    });
  }

  try {
    const reservation = await cancelReservation(Number(reservationId));

    return NextResponse.json({
      data: reservation,
      status: 200,
      message: "Exito al cancelar la reserva",
    });
  } catch (error) {
    return NextResponse.json({
      data: "",
      status: 500,
      message: `Ocurrio un error al cancelar la reserva.Error: ${String(error)}`,
    });
  }
}

export async function PUT(request: NextRequest) {
  const formData = await request.formData();

  const observation = formData.get("observation") as string;
  const file: File | "" = formData.get("paymentFile") as File;
  const reservationId = Number(formData.get("reservationId") as string);

  if (!reservationId) {
    return NextResponse.json({
      data: "",
      status: 400,
      message: "Faltan parametros",
    });
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
    const reservation = await updateReservation({
      id: reservationId,
      observation,
      paymentConfirmation: paymentConfirmation ?? "",
    });

    return NextResponse.json({
      data: reservation,
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
