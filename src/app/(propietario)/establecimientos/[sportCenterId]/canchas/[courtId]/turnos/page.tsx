import type {CourtSchedule} from "@/lib/types/importables/types";

import React from "react";
import Link from "next/link";

import {findWithDaysSport, lastAppointmentDate} from "@/backend/db/models/courts";
import PageWrapper from "@/components/Layout/PageWrapper";
import {buttonVariants} from "@/components/ui/button";

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
            Gestionar horarios
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
        <GenerateAppointmentsClient
          appointmentTime={court.sport.duration}
          courtId={Number(params.courtId)}
          maxDate={maxDate}
          schedule={curtSchedule}
        />
      }
    />
  );
};

export default GenerateAppointmentsPage;
