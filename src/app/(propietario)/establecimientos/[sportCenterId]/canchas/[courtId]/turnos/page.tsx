import type {CourtSchedule} from "@/lib/types/importables/types";

import React from "react";

import {findCourtsWithSameDuration, findWithDaysSport} from "@/backend/db/models/courts";

import GenerateAppointmentsClient from "./components/GenerateAppointmentsClient";

const GenerateAppointmentsPage = async ({
  params,
}: {
  params: {sportCenterId: string; courtId: string};
}) => {
  const court = await findWithDaysSport(params.sportCenterId, params.courtId);

  console.log(court);
  if (!court) {
    return <div>No se encontro la cancha seleccionada</div>;
  }

  const similarlyCourts = await findCourtsWithSameDuration(
    params.sportCenterId,
    params.courtId,
    court.sport.duration,
  );

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
      courts={similarlyCourts || []}
      schedule={curtSchedule}
    />
  );
};

export default GenerateAppointmentsPage;
