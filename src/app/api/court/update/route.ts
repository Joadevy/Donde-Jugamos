/* eslint-disable @typescript-eslint/require-await */
import type {NextRequest} from "next/server";

import {NextResponse} from "next/server";

import {generateApiResponse} from "@/lib/utils/utils";
import {db} from "@/backend/db/db";
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
    name: string;
    description: string;
    sportCenterId: number;
    sportId: string;
    price: number;
    capacity: number;
  } = await request.json();
  let court = null;

  try {
    court = await db.court.create({
      data: {
        name: body.name,
        description: body.description,
        sportCenterId: Number(body.sportCenterId),
        sportId: Number(body.sportId),
        price: body.price,
        capacity: body.capacity,
      },
    });
  } catch (error) {
    return NextResponse.json(
      generateApiResponse(null, 500, "Ocurrio un error al crear una cancha"),
    );
  }

  return NextResponse.json(generateApiResponse(court, 200, ""));
}

export async function PUT(request: NextRequest) {
  const body: {
    id: string;
    name: string;
    description: string;
    sportCenterId: number;
    sportId: string;
    price: number;
    capacity: number;
  } = await request.json();
  let court = null;

  try {
    court = await db.court.update({
      where: {
        id: Number(body.id),
      },
      data: {
        name: body.name,
        description: body.description,
        sportCenterId: Number(body.sportCenterId),
        sportId: Number(body.sportId),
        price: body.price,
        capacity: body.capacity,
      },
    });
  } catch (error) {
    return NextResponse.json(
      generateApiResponse(null, 500, "Ocurrio un error al actualizar una cancha"),
    );
  }

  return NextResponse.json(generateApiResponse(court, 200, ""));
}
