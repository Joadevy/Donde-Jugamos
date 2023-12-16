import type {CourtSchedule} from "@/lib/types/importables/types";

import Link from "next/link";

import {findWithDays, findWithDaysSport} from "@/backend/db/models/courts";
import PageWrapper from "@/components/Layout/PageWrapper";
import {buttonVariants} from "@/components/ui/button";

import ScheduleForm from "../components/ScheduleForm";

export interface DayInfo {
  name: string;
}

export const DAYS_OF_WEEK: Record<string, DayInfo> = {
  ["monday"]: {name: "Lunes"},
  ["tuesday"]: {name: "Martes"},
  ["wednesday"]: {name: "Miércoles"},
  ["thursday"]: {name: "Jueves"},
  ["friday"]: {name: "Viernes"},
  ["saturday"]: {name: "Sábado"},
  ["sunday"]: {name: "Domingo"},
};

async function HorariosPage({params}: {params: {sportCenterId: string; courtId: string}}) {
  const curt = await findWithDaysSport(params.sportCenterId, params.courtId);
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
            href={`/establecimientos/${params.sportCenterId}/canchas/${params.courtId}/turnos`}
          >
            Generar Turnos
          </Link>
          <Link
            className={buttonVariants({variant: "default"})}
            href={`/establecimientos/${params.sportCenterId}/canchas/${params.courtId}/turnos/modificar`}
          >
            Editar Turnos
          </Link>
          <Link
            className={buttonVariants({variant: "default"})}
            href={`/establecimientos/${params.sportCenterId}/canchas/${params.courtId}/modificar`}
          >
            Editar Datos
          </Link>
        </>
      }
      main={
        <ScheduleForm
          court={curt!}
          courtId={Number(params.courtId)}
          courts={[Number(params.courtId)]}
          schedule={curtSchedule}
        />
      }
    />
  );
}

export default HorariosPage;
