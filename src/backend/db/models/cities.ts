import type {City} from "@prisma/client";

import {db} from "../db";

export const getCities = async (): Promise<Pick<City, "name" | "postCode">[]> => {
  return await db.city.findMany({
    where: {
      active: true,
    },
    select: {
      name: true,
      postCode: true,
    },
  });
};

export const getFullCities = async (): Promise<City[]> => await db.city.findMany();

export const getCityByPostcode = async (postCode: string): Promise<City | null> => {
  return await db.city.findUnique({
    where: {
      postCode,
    },
  });
};

export const createCity = async (name: string, postCode: string): Promise<City | null> => {
  return await db.city
    .create({
      data: {
        name,
        postCode,
      },
    })
    .catch(() => null);
};

export const activateCity = async (id: number): Promise<City | null> => {
  return await db.city
    .update({
      where: {
        id,
      },
      data: {
        active: true,
      },
    })
    .catch(() => null);
};
