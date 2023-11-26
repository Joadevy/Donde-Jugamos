import type {CourtSchedule} from "@/lib/types/importables/types";

import React from "react";

import {findWithDaysSport} from "@/backend/db/models/courts";

import GenerateAppointmentsClient from "./components/GenerateAppointmentsClient";

const GenerateAppointmentsPage = async ({
  params,
}: {
  params: {sportCenterId: string; courtId: string};
}) => {
  const curt = await findWithDaysSport(params.sportCenterId, params.courtId);
  let curtSchedule: CourtSchedule[] = [];

  if (curt?.days.length) {
    curtSchedule = curt.days.map((day) => {
      return {
        name: day.name,
        openTime: day.firstHalfStartTime,
        closeTime: day.secondHalfEndTime,
      };
    });
  }
  if (!curt) {
    return false;
  }

  return (
    <GenerateAppointmentsClient appointmentTime={curt.sport.duration} schedule={curtSchedule} />
  );
};

export default GenerateAppointmentsPage;
