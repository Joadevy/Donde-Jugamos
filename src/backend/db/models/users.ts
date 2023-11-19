import type {User} from "@prisma/client";

import {getServerSession} from "next-auth";

import {authOptions} from "@/app/api/auth/[...nextauth]/route";

import {db} from "../db";

const getUserEmail = async (): Promise<string> => {
  const session = await getServerSession(authOptions);

  return session?.user.email ?? "";
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  if (!email) {
    email = await getUserEmail();
  }

  const user = await db.user.findUnique({
    where: {
      email,
    },
  });

  return user;
};

export const updateUserRoleById = async (
  userId: string,
  role: "customer" | "propietary" | "admin",
): Promise<boolean> => {
  return !!(await db.user
    .update({
      where: {
        id: userId,
      },
      data: {
        role,
      },
    })
    .catch((err) => {
      return false;
    }));
};
