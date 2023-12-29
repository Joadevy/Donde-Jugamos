/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type {NextRequest} from "next/server";
import type {ApiResponse} from "@/lib/types/importables/types";

import {NextResponse} from "next/server";

import {
  deleteAppointments,
  type AppointmentReservation,
  deleteAppointmentsQuerys,
  getLastAppointment,
} from "@/backend/db/models/appointments";
import {db} from "@/backend/db/db";
import {
  generateApiResponse,
  generateAppointments,
  timeInStringFromMinutes,
  turnStateToSpanish,
} from "@/lib/utils/utils";
import {CancelReservationQuery, cancelReservation} from "@/backend/db/models/reservations";
import {compilePropietaryChangeStatusTemplate} from "@/backend/email/templates/PropietaryChangeStateReservation";
import handleSendEmail from "@/backend/email/nodemailer";
import {findSportDuration} from "@/backend/db/models/courts";

interface RequestType {
  days: {name: string; openTime: number; closeTime: number}[];
  courts: number[];
  appointments?: AppointmentReservation[] | null;
}

export async function POST(request: NextRequest) {
  const {days, courts} = (await request.json()) as RequestType;
  const daysToCreate = [];
  let response: ApiResponse = generateApiResponse(
    {},
    200,
    "Se actualizaron los horarios de la cancha correctamente",
  );

  for (const court of courts) {
    for (const day of days) {
      daysToCreate.push(
        //El upsert se utiliza para hacer un update en caso de que exista.
        db.day.upsert({
          where: {
            name_courtId: {name: day.name, courtId: court},
          },
          update: {
            openTime: day.openTime,
            closeTime: day.closeTime,
          },
          create: {
            openTime: day.openTime,
            closeTime: day.closeTime,
            name: day.name,
            courtId: court,
          },
        }),
      );
    }
  }

  //Se inserta todo o nada.
  await db.$transaction(daysToCreate).catch((error) => {
    response = generateApiResponse(
      {...error},
      500,
      "Error al crear horarios en las canchas solicitadas",
    );
  });

  return NextResponse.json(response);
}

export async function PUT(request: NextRequest) {
  const {days, courts, appointments} = (await request.json()) as RequestType;

  console.log("Esto es el put");
  if (appointments) {
    //UPDATE con eliminacion de turnos y reservas. (avisar el cliente)
    //Regenerar turnos (eliminar turnos y crear nuevamente)
    //cancelReservation
    try {
      const cancellationEmailsInformation = [];
      const anularTurnosQuerys = [];

      for (const court of courts) {
        const dateTo = (await getLastAppointment(court)) || new Date();

        console.log(dateTo);
        // for (const appointment of appointments) {
        //   const reservation = appointment.reservations.length ? appointment.reservations[0] : null;

        //   if (reservation) {
        //     const prevReservationStatusInSpanish = turnStateToSpanish(reservation.state);
        //     const cancellInfor = compilePropietaryChangeStatusTemplate(
        //       "cancelada",
        //       `Una reserva previamente en estado ${prevReservationStatusInSpanish} ha sido cancelada.`,
        //       reservation.id,
        //       appointment.court.sportCenter.name,
        //       appointment.court.sportCenter.address,
        //       appointment.court.sportCenter.city.name,
        //       new Date(appointment.date).toLocaleString("es-AR", {
        //         weekday: "long",
        //         year: "numeric",
        //         month: "long",
        //         day: "numeric",
        //       }),
        //       timeInStringFromMinutes(String(appointment.startTime)),
        //       timeInStringFromMinutes(String(appointment.endTime)),
        //       String(appointment.court.name),
        //       appointment.court.price.toLocaleString("es-AR", {
        //         style: "currency",
        //         currency: "ARS",
        //       }),
        //       appointment.court.sportCenter.acceptPartialPayment
        //         ? (
        //             (appointment.court.price *
        //               appointment.court.sportCenter.partialPaymentPercentage) /
        //             100
        //           ).toLocaleString("es-AR", {
        //             style: "currency",
        //             currency: "ARS",
        //           })
        //         : "-",
        //       "Cambio de horario de la cancha",
        //       reservation.user.name ?? "",
        //       reservation.user.email ?? "",
        //     );

        //     cancellationEmailsInformation.push(cancellInfor);
        //   }
        // }

        //Borrar turnos
        // const appointmentsToDelete = deleteAppointmentsQuerys(appointments);

        // for (const email of cancellationEmailsInformation) {
        //   await handleSendEmail(
        //     appointments[0].court.sportCenter.email,
        //     "Reserva cancelada",
        //     email,
        //   );
        // }

        //En otra seccion
        //Rehacer turnos nuevos
        const sportDuration = await findSportDuration(court);
        const dateFrom = new Date();

        dateFrom.setHours(0, 0, 0, 0);
        dateTo.setHours(0, 0, 0, 0);

        console.log(dateFrom, dateTo, days, court);
        console.log(sportDuration?.sport.duration);

        const newAppointments = generateAppointments(
          dateFrom,
          dateTo,
          days,
          sportDuration?.sport.duration!,
          court,
        );

        console.log(newAppointments);
        //Crear turnos nuevos
      }
    } catch (error) {}
  } else {
    //UPDATE con regeneracion de turnos (eliminar turnos y crear nuevamente)
  }

  return NextResponse.json("");
}
