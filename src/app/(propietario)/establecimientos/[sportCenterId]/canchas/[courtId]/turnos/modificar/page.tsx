/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type {Appointment} from "@prisma/client";

import Link from "next/link";

import {getAllAppointments} from "@/backend/db/models/appointments";
import PageWrapper from "@/components/Layout/PageWrapper";
import {buttonVariants} from "@/components/ui/button";

import AppointmentEdit from "../components/AppointmentEdit";

/* eslint-disable react/function-component-definition */
const ModificarTurnoPage = async ({params}: {params: {sportCenterId: string; courtId: string}}) => {
  const appointmentsPersisted = await getAllAppointments();
  const appointments: Record<number, Appointment[]> = {};

  if (!appointmentsPersisted.length) {
    return <div>No hay turnos registrados en la cancha.</div>;
  }

  appointmentsPersisted.forEach((appointment) => {
    const dateTime = appointment.date.getTime();

    if (appointments[dateTime]) {
      appointments[dateTime].push(appointment);
    } else {
      appointments[dateTime] = [appointment];
    }
  });

  return (
    <PageWrapper
      aside={
        <>
          <Link
            className={buttonVariants({variant: "default"})}
            href={`/establecimientos/${params.sportCenterId}/canchas/${params.courtId}`}
          >
            Gestionar cancha
          </Link>

          <Link
            className={buttonVariants({variant: "default"})}
            href={`/establecimientos/${params.sportCenterId}/canchas/${params.courtId}/horarios`}
          >
            Gestionar Horarios
          </Link>

          <Link
            className={buttonVariants({variant: "default"})}
            href={`/establecimientos/${params.sportCenterId}/canchas/${params.courtId}/turnos`}
          >
            Generar Turnos
          </Link>

          <Link
            className={buttonVariants({variant: "default"})}
            href={`/establecimientos/${params.sportCenterId}/canchas/${params.courtId}/modificar`}
          >
            Editar Datos
          </Link>
        </>
      }
      main={<AppointmentEdit appointments={appointments} courtId={Number(params.courtId)} />}
    />
  );
};

export default ModificarTurnoPage;
