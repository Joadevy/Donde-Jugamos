import type {Reservation} from "@prisma/client";

import handleSendEmail from "@/backend/email/nodemailer";

import {db} from "../db";

import {getUserByEmail} from "./users";

export const createReservation = async ({
  observation,
  paymentConfirmation,
  appointmentId,
}: {
  observation: string;
  paymentConfirmation: string;
  appointmentId: number;
}): Promise<Reservation> => {
  const user = await getUserByEmail("");

  if (!user) {
    throw new Error("El usuario no existe");
  }

  const reservation: Reservation = await db.reservation.create({
    data: {
      observation,
      paymentConfirmation,
      appointmentId,
      userId: user.id,
    },
  });

  await handleSendEmail(user.email!, "Nueva reserva", "Nueva reserva");

  return reservation;
};
