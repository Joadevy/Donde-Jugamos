import type {Reservation} from "@prisma/client";

import {timeInStringFromMinutes} from "@/lib/utils/utils";
import handleSendEmail from "@/backend/email/nodemailer";
import {compileNewReservationTemplate} from "@/backend/email/templates/NewReservation";

import {db} from "../db";

import {getUserByEmail} from "./users";
import {getAppointmentFullInformation} from "./appointments";

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

  const create = db.reservation.create({
    data: {
      observation,
      paymentConfirmation,
      appointmentId,
      userId: user.id,
    },
  });

  const getAppointmentInfo = getAppointmentFullInformation(appointmentId);

  const [reservation, appointmentInfo] = await Promise.all([create, getAppointmentInfo]);

  await handleSendEmail(
    user.email!,
    "Nueva reserva",
    compileNewReservationTemplate(
      appointmentInfo?.court.sportCenter.name ?? "",
      appointmentInfo?.court.sportCenter.address ?? "",
      appointmentInfo?.date
        ? new Date(appointmentInfo.date).toLocaleString("es-AR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "",

      appointmentInfo?.court.sportCenter.city.name ?? "",
      timeInStringFromMinutes(String(appointmentInfo?.startTime)),
      timeInStringFromMinutes(String(appointmentInfo?.endTime)),
      String(appointmentInfo?.courtId),
      String("$" + appointmentInfo?.court.price),
    ),
  );

  return reservation;
};
