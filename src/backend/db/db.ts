// Es una instancia de PrismaClient que se exporta para que pueda ser usada en otros archivos
// y que se inicializa una sola vez, de esta manera se evita que se cree una nueva instancia cada vez
// que te queres conectar a la base de datos.
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = global as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const db = prisma;