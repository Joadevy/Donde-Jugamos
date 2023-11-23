/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type {City} from "@prisma/client";

import {NextResponse, type NextRequest} from "next/server";

import {db} from "@/backend/db/db";
import {createCity, getCityByPostcode} from "@/backend/db/models/cities";
import {getUserByEmail} from "@/backend/db/models/users";
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
  const body = await request.json();
  let user = null;
  let city = null;
  let sportcenter = null;

  try {
    user = await getUserByEmail(body.userEmail);
    city = await findOrCreateCity(body.cityName, body.cityPostalCode);

    if (!city) {
      return NextResponse.json(
        generateApiResponse(null, 500, "No pudimos asociar la ciudad ingresada.."),
      );
    }

    if (!user) {
      return NextResponse.next(
        generateApiResponse(
          null,
          500,
          "No pudimos encontrar el usuario. Por favor, vuelva a loguearse e intente nuevamente",
        ),
      );
    }

    sportcenter = await db.sportCenter.create({
      data: {
        name: body.name,
        address: body.address,
        cityId: city.id,
        userId: user.id,
        email: body.email,
        phone: body.phone,
        description: body.description,
        cancelTimeLimit: body.cancelTimeLimit,
        acceptPartialPayment: body.acceptPartialPayment,
        partialPaymentPercentage: body.partialPaymentPercentage,
        paymentTimeLimit: body.paymentTimeLimit,
      },
    });
  } catch (error) {
    return NextResponse.json(
      generateApiResponse(null, 500, "Ocurrio un error al querer insertar el Establecimiento"),
    );
  }

  return NextResponse.json(generateApiResponse(sportcenter, 200, ""));
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  let user = null;
  let city = null;
  let sportcenter = null;

  console.log(body);

  try {
    user = await getUserByEmail(body.userEmail);
    city = await findOrCreateCity(body.cityName, body.cityPostalCode);

    if (!city) {
      return NextResponse.json(
        generateApiResponse(null, 500, "No pudimos asociar la ciudad ingresada.."),
      );
    }

    if (!user) {
      return NextResponse.next(
        generateApiResponse(
          null,
          500,
          "No pudimos encontrar el usuario. Por favor, vuelva a loguearse e intente nuevamente",
        ),
      );
    }

    sportcenter = await db.sportCenter.update({
      where: {
        id: body.sportCenterId,
      },
      data: {
        name: body.name,
        address: body.address,
        cityId: city.id,
        userId: user.id,
        email: body.email,
        phone: body.phone,
        description: body.description,
        cancelTimeLimit: body.cancelTimeLimit,
        acceptPartialPayment: body.acceptPartialPayment,
        partialPaymentPercentage: body.partialPaymentPercentage,
        paymentTimeLimit: body.paymentTimeLimit,
      },
    });
  } catch (error) {
    return NextResponse.json(
      generateApiResponse(null, 500, "Ocurrio un error al querer actualizar el Establecimiento"),
    );
  }

  return NextResponse.json(generateApiResponse(sportcenter, 200, ""));
}

async function findOrCreateCity(name: string, postCode: string): Promise<City | null> {
  let city = await getCityByPostcode(postCode);

  if (!city) {
    city = await createCity(name, postCode);
  }

  return city;
}
