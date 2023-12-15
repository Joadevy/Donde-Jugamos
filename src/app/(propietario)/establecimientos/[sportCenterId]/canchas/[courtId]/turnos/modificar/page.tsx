/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type {Appointment} from "@prisma/client";

import {getAllAppointments} from "@/backend/db/models/appointments";

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
    <div>
      <AppointmentEdit appointments={appointments} courtId={Number(params.courtId)} />
    </div>
  );
};

export default ModificarTurnoPage;
