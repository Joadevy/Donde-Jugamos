import type {CourtSchedule} from "@/lib/types/importables/types";

import React from "react";

import {findWithDaysSport, lastAppointmentDate} from "@/backend/db/models/courts";

import GenerateAppointmentsClient from "./components/GenerateAppointmentsClient";

const GenerateAppointmentsPage = async ({
  params,
}: {
  params: {sportCenterId: string; courtId: string};
}) => {
  const court = await findWithDaysSport(params.sportCenterId, params.courtId);
  const maxDate = await lastAppointmentDate(params.courtId);

  if (!court) {
    return <div>La cancha seleccionada no existe</div>;
  }

  let curtSchedule: CourtSchedule[] = [];

  if (court.days.length) {
    curtSchedule = court.days.map((day) => {
      return {
        name: day.name,
        openTime: day.openTime,
        closeTime: day.closeTime,
      };
    });
  }

  return (
    <GenerateAppointmentsClient
      appointmentTime={court.sport.duration}
      courtId={Number(params.courtId)}
      maxDate={maxDate}
      schedule={curtSchedule}
    />
  );
};

export default GenerateAppointmentsPage;
