import type {NextRequest} from "next/server";

import {NextResponse} from "next/server";

import {db} from "@/backend/db/db";

export async function GET(request: NextRequest) {
  const {searchParams} = new URL(request.url);

  const location = searchParams.get("location");
  const sport = searchParams.get("sport");
  const date = searchParams.get("date")?.toString(); //
  const time = searchParams.get("time") || "0";

  let sportCenters = undefined;

  try {
    sportCenters = await db.sportCenter.findMany({
      where: {
        postcode: location!,
        courts: {
          some: {
            sport: {
              name: sport!,
            },
            appointments: {
              some: {
                date: {
                  gte: date,
                },
                startTime: {
                  gte: parseInt(time),
                },
              },
            },
          },
        },
      },
    });
  } catch (error) {
    sportCenters = "Ocurrio un error al realizar la operación.";
  }

  return NextResponse.json(sportCenters);
}
