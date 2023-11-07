/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type {City, User} from "@prisma/client";

import {NextResponse, type NextRequest} from "next/server";

import {db} from "@/backend/db/db";

export async function POST(request: NextRequest) {
  const response = {
    data: {},
    status: 200,
    message: "",
  };

  const body = await request.json();

  console.log(body);
  try {
    const city = await findOrCreateCity(body.cityName, body.cityPostalCode);
    const user = await findUser(body.email);

    if (!city || !user) {
      return {
        data: {},
        status: 500,
        message: "No se encontro Ciudad o Usuario",
      };
    }

    const sportCenter = await db.sportCenter.create({
      data: {
        name: body.name,
        address: `${body.addressName} ${body.addressNumber}`,
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
  } catch (error) {
    console.log(error);
    response.status = 500;
    response.message = "Ocurrio un error al querer insertar el Establecimiento";
  }

  return NextResponse.json(response);
}

async function findOrCreateCity(name: string, postCode: string): Promise<City | null> {
  const city = await db.city.findUnique({
    where: {
      postCode,
    },
  });

  if (city) {
    return city;
  }

  return await db.city
    .create({
      data: {
        name: name,
        postCode: postCode,
      },
    })
    .catch((err) => {
      console.log(err);

      return null;
    });
}

async function findUser(email: string): Promise<User | null> {
  return await db.user
    .findUnique({
      where: {
        email,
      },
    })
    .catch((err) => {
      console.log(err);

      return err;
    });
}
