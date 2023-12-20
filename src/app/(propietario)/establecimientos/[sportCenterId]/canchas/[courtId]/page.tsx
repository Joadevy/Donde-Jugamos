/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type {CourtSchedule} from "@/lib/types/importables/types";
import type {AppointmentReservation} from "@/backend/db/models/appointments";

import {Clock3Icon, CalendarClockIcon, DollarSignIcon} from "lucide-react";
import Link from "next/link";

import {buttonVariants} from "@/components/ui/button";
import {findWithDays} from "@/backend/db/models/courts";
import {formatNumber, getPartOfDate, timeInStringFromMinutes} from "@/lib/utils/utils";
import PageWrapper from "@/components/Layout/PageWrapper";

import {DAYS_OF_WEEK} from "./horarios/page";
import AppointmentDay from "./turnos/components/AppointmentDay";

async function CourtPage({params}: {params: {sportCenterId: string; courtId: string}}) {
  const court = await findWithDays(params.sportCenterId, params.courtId);

  if (court == null) {
    return <div className="text-center text-slate-400 italic">No se encontro la Cancha</div>;
  }

  const {days, sportCenter, appointments, sport} = {...court};
  const hasSchedule = days.length > 0;
  const appointmentsMapped = mapAppointments(appointments);
  let courtSchedule: CourtSchedule[] = [];

  if (days.length) {
    courtSchedule = days.map((day) => {
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
          <Link className={buttonVariants({variant: "secondary"})} href="../canchas">
            volver
          </Link>
          <Link
            className={buttonVariants({variant: "default"})}
            href={`${params.courtId}/modificar`}
          >
            Editar Datos
          </Link>

          <Link
            className={buttonVariants({variant: "default"})}
            href={`${params.courtId}/horarios`}
            replace={false}
          >
            Gestionar Horarios
          </Link>

          {hasSchedule ? (
            <>
              <Link
                className={buttonVariants({variant: "default"})}
                href={`${params.courtId}/turnos`}
              >
                Generar Turnos
              </Link>

              <Link
                className={buttonVariants({variant: "default"})}
                href={`${params.courtId}/turnos/modificar`}
              >
                Editar Turnos
              </Link>
            </>
          ) : null}
        </>
      }
      main={
        <div className="lg:w-1/2 flex-1 flex flex-col gap-4 mb-5">
          <header>
            <div className="flex items-center justify-between my-1">
              <h2 className="text-3xl font-semibold text-green-600">
                {sportCenter.name} - {court.name}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xl text-neutral-400">{sport.name}</p>
              <span>-</span>
              <p className="flex items-center text-xl text-neutral-400">
                <DollarSignIcon /> {formatNumber(court.price)}
              </p>
            </div>
            <p className="my-4 text-base">{court.description}</p>
          </header>

          <section>
            <h3 className="w-full mb-4 bg-primary text-white p-2 flex items-center gap-2 text-xl">
              <Clock3Icon /> Horarios
            </h3>
            <div className="flex flex-wrap flex-col md:flex-row md:justify-between items-center gap-2 mt-2 px-4">
              {courtSchedule.length > 0 ? (
                courtSchedule.map((day, index) => (
                  <div key={index} className="w-fit flex flex-col items-center">
                    <div>{DAYS_OF_WEEK[`${day.name}`].name}</div>
                    {day.openTime ? (
                      <div className="text-green-600">
                        {timeInStringFromMinutes(day.openTime.toString())} -{" "}
                        {timeInStringFromMinutes(day.closeTime!.toString())}
                      </div>
                    ) : (
                      <div className="text-rose-600">Cerrado</div>
                    )}
                  </div>
                ))
              ) : (
                <div>No se establecieron los horarios de la cancha.</div>
              )}
            </div>
          </section>

          <section>
            {appointmentsMapped.length ? (
              <div className="flex flex-col items-center sm:items-start gap-2">
                <h3 className="w-full my-4 bg-primary text-white p-2 flex items-center gap-2 text-xl">
                  <CalendarClockIcon /> Turnos - Próximos 3 días
                </h3>
                {appointmentsMapped.map((app, index) => (
                  <div key={index} className="px-4">
                    <h4 className="text-lg">
                      {getPartOfDate(app.date, "dayFull", true, true)} de{" "}
                      {getPartOfDate(app.date, "monthName", true, true)}
                    </h4>
                    <div className="flex flex-wrap gap-2 items-center justify-start">
                      {app.schedule.map((appointment, i) => (
                        <AppointmentDay key={i} appointment={appointment} />
                      ))}
                    </div>
                  </div>
                ))}
                <div className="w-full flex flex-wrap items-center gap-2 mt-2 p-2 bg-neutral-100 shadow">
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-4 h-4 bg-green-400/40 rounded-full border-2 border-green-400" />
                    Disponible
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-4 h-4 bg-blue-400/40 rounded-full border-2 border-blue-400" />{" "}
                    Aprobada
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-4 h-4 bg-yellow-400/40 rounded-full border-2 border-yellow-400" />{" "}
                    Pendiente
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-4 h-4 bg-neutral-400/40 rounded-full border-2 border-neutral-400" />{" "}
                    Inactivo
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h3 className="my-4 bg-primary text-white p-2 flex items-center gap-2 text-xl">
                  <CalendarClockIcon /> Turnos
                </h3>
                {hasSchedule ? (
                  <div> No hay turnos registrados en la cancha.</div>
                ) : (
                  <div>Debe definir los horarios de la cancha para poder gestionar los turnos</div>
                )}
              </>
            )}
          </section>
        </div>
      }
    />
  );
}

export default CourtPage;

export interface AppointmentViewSchedule {
  startTime: number;
  endTime: number;
  active: boolean;
  reservationState: string | null;
}

export interface AppointmentView {
  date: Date;
  schedule: AppointmentViewSchedule[];
}

function mapAppointments(appointments: AppointmentReservation[]): AppointmentView[] {
  const appointmentsMapped: AppointmentView[] = [];

  appointments.forEach((appointment: AppointmentReservation) => {
    const current = appointmentsMapped.find((a) => a.date.getDate() == appointment.date.getDate());

    const schedule = {
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      active: appointment.active,
      reservationState: appointment.reservations.length ? appointment.reservations[0].state : null,
    };

    if (current) {
      current.schedule.push(schedule);
    } else {
      const newDate = {
        date: appointment.date,
        schedule: [schedule],
      };

      appointmentsMapped.push(newDate);
    }
  });

  return appointmentsMapped;
}
