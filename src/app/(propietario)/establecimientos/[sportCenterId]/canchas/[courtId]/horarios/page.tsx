import type {CourtSchedule} from "@/lib/types/importables/types";

import {findWithDays} from "@/backend/db/models/courts";

import ScheduleForm from "../components/ScheduleForm";

export interface DayInfo {
  name: string;
}

export const DAYS_OF_WEEK: Record<string, DayInfo> = {
  ["monday"]: {name: "Lunes"},
  ["tuesday"]: {name: "Martes"},
  ["wednesday"]: {name: "Miércoles"},
  ["thursday"]: {name: "Jueves"},
  ["friday"]: {name: "Viérnes"},
  ["saturday"]: {name: "Sabado"},
  ["sunday"]: {name: "Domingo"},
};

async function HorariosPage({params}: {params: {sportCenterId: string; courtId: string}}) {
  const curt = await findWithDays(params.sportCenterId, params.courtId);
  let curtSchedule: CourtSchedule[] = [];
  let openDays: string[] = [];

  if (curt?.days.length) {
    curtSchedule = curt.days.map((day) => {
      return {
        name: day.name,
        openTime: day.openTime,
        closeTime: day.closeTime,
      };
    });
  }
  openDays = curtSchedule.map((day) => day.name);

  Object.keys(DAYS_OF_WEEK).forEach((day) => {
    if (!openDays.includes(day)) {
      curtSchedule.push({name: day, openTime: null, closeTime: null});
    }
  });

  return (
    <ScheduleForm
      courtId={Number(params.courtId)}
      courts={[Number(params.courtId)]}
      schedule={curtSchedule}
    />
  );
}

export default HorariosPage;
