/* eslint-disable @typescript-eslint/require-await */
import type {NextRequest} from "next/server";

import {NextResponse} from "next/server";

import {db} from "@/backend/db/db";
import {generateApiResponse} from "@/lib/utils/utils";

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

export async function POST(request: NextRequest) {
  const body: {
    name?: string;
    postCode?: string;
  } = await request.json();
  const name = body.name;
  const postCode = body.postCode;
  let city = null;

  if (!name || !postCode)
    return NextResponse.json(generateApiResponse(null, 400, "Faltan parametros"));

  try {
    city = await db.city.create({
      data: {
        name,
        postCode,
      },
    });
  } catch (error) {
    return NextResponse.json(
      generateApiResponse(null, 500, `Ocurrio un error al crear la ciudad ${name}`),
    );
  }

  return NextResponse.json(generateApiResponse(city, 200, ""));
}

export async function PUT(request: NextRequest) {
  const body: {
    name?: string;
    postCode?: string;
    id: number;
  } = await request.json();
  const name = body.name;
  const postCode = body.postCode;
  const id = body.id;
  let city = null;

  if (!postCode && !name)
    return NextResponse.json(generateApiResponse(null, 400, "Faltan parametros"));

  try {
    city = await db.city.update({
      where: {
        id,
      },
      data: {
        name,
        postCode,
      },
    });
  } catch (error) {
    return NextResponse.json(
      generateApiResponse(null, 500, `Ocurrio un error al querer actualizar la ciudad ${name}`),
    );
  }

  return NextResponse.json(generateApiResponse(city, 200, ""));
}
