/* eslint-disable @typescript-eslint/require-await */
import type {NextRequest} from "next/server";

import {NextResponse} from "next/server";

import {db} from "@/backend/db/db";
import {generateApiResponse} from "@/lib/utils/utils";
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

export async function POST(request: NextRequest) {
  const body: {
    name?: string;
    duration?: string;
  } = await request.json();
  const name = body.name;
  const duration = body.duration ? +body.duration : null;
  let sport = null;

  if (!name || !duration)
    return NextResponse.json(generateApiResponse(null, 400, "Faltan parametros"));

  try {
    sport = await db.sport.create({
      data: {
        name,
        duration,
      },
    });
  } catch (error) {
    return NextResponse.json(
      generateApiResponse(null, 500, `Ocurrio un error al crear el deporte ${name}`),
    );
  }

  return NextResponse.json(generateApiResponse(sport, 200, ""));
}

export async function PUT(request: NextRequest) {
  const body: {
    id: string;
    name: string;
    duration: string;
  } = await request.json();
  const id = body.id ? Number(body.id) : null;
  const name = body.name;
  const duration = body.duration ? Number(body.duration) : undefined;
  let sport = null;

  if (!id || (!name && !duration))
    return NextResponse.json(generateApiResponse(null, 400, "Faltan parametros"));

  try {
    sport = await db.sport.update({
      where: {
        id,
      },
      data: {
        name,
        duration,
      },
    });
  } catch (error) {
    return NextResponse.json(
      generateApiResponse(null, 500, `Ocurrio un error al querer actualizar el deporte ${name}`),
    );
  }

  return NextResponse.json(generateApiResponse(sport, 200, ""));
}
