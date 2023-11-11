/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type {City, User} from "@prisma/client";

import {NextResponse, type NextRequest} from "next/server";

import {db} from "@/backend/db/db";
import {createCity, getCityByPostcode} from "@/backend/db/models/cities";
import {getUserByEmail, updateUserRoleById} from "@/backend/db/models/users";

export async function POST(request: NextRequest) {
  const response = {
    data: {},
    status: 200,
    message: "",
  };

  const body = await request.json();
  let user = null;
  let city = null;

  try {
    user = await getUserByEmail(body.userEmail);
    city = await findOrCreateCity(body.cityName, body.cityPostalCode);

    if (!city || !user) {
      return {
        data: {},
        status: 500,
        message: "No se encontro Ciudad o Usuario",
      };
    }
    console.log("Se va a guardar el sport center");
    const sportCenter = await db.sportCenter.create({
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

    response.data = sportCenter;

    await updateUserRoleById(user.id, "propietary");
  } catch (error) {
    console.log(error);
    response.status = 500;
    response.message = "Ocurrio un error al querer insertar el Establecimiento";
  }

  return NextResponse.json(response);
}

async function findOrCreateCity(name: string, postCode: string): Promise<City | null> {
  let city = await getCityByPostcode(postCode);

  if (!city) {
    city = await createCity(name, postCode);
  }

  return city;
}
