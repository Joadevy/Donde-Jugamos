import type {CourtSchedule} from "@/lib/types/importables/types";
import type {Appointment} from "@prisma/client";

import {Clock3Icon, CalendarClockIcon, DollarSignIcon, ChevronDownIcon, ChevronUpIcon} from "lucide-react";
import Link from "next/link";

import {Button} from "@/components/ui/button";
import {findWithDays} from "@/backend/db/models/courts";
import {formatNumber, getPartOfDate, timeInStringFromMinutes} from "@/lib/utils/utils";

import {DAYS_OF_WEEK} from "./horarios/page";
import AppointmentDay from "./turnos/components/AppointmentDay";

async function CourtPage({params}: {params: {sportCenterId: string; courtId: string}}) {
  const court = await findWithDays(params.sportCenterId, params.courtId);

  if (court == null) {
    return <div>No se encontro la Cancha</div>;
  }

  const {days, sportCenter, appointments, sport} = {...court};
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
    <div className="container mx-auto flex gap-4">
      <div className="w-1/2 flex-1 flex flex-col gap-4">
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
          <div className="flex flex-col md:flex-row md:justify-between items-center gap-2 mt-2">
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
            <div className="flex flex-col items-center gap-2">
              <h3 className="w-full my-4 bg-primary text-white p-2 flex items-center gap-2 text-xl">
                <CalendarClockIcon /> Turnos
              </h3>
              {appointmentsMapped.map((app, index) => (
                <div key={index}>
                  <h4 className="text-lg">
                    {getPartOfDate(app.date, "dayFull", true, true)} de {" "}
                    {getPartOfDate(app.date, "monthName", true, true)}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2">
                    {app.schedule.map((appointment, i) => (
                      <AppointmentDay key={i} appointment={appointment} />
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-2">
                <div className="w-4 h-4 bg-green-400/40 rounded-full" /> Disponible
              </div>
            </div>
          ) : (
            <>
              <h3 className="my-4 bg-primary text-white p-2 flex items-center gap-2 text-xl">
                <CalendarClockIcon /> Turnos
              </h3>
              <div> No hay turnos registrados en la cancha.</div>
            </>
          )}
        </section>
      </div>

      <aside className="hidden sm:flex flex-initial flex-col gap-2 py-2 px-4">
        <Button>
          <Link href={`${params.courtId}/horarios`}>Gestion de Horarios</Link>
        </Button>
        <Button>
          <Link href={`${params.courtId}/turnos`}>Generar Turnos</Link>
        </Button>
        <Button>
          <Link href={`${params.courtId}/turnos/modificar`}>Editar Turnos</Link>
        </Button>
        <Button>
          <Link href={`${params.courtId}/modificar`}>Editar Datos</Link>
        </Button>
      </aside>
    </div>
  );
}

export default CourtPage;

interface AppointmentView {
  date: Date;
  schedule: {
    startTime: number;
    endTime: number;
    active: boolean;
  }[];
}

function mapAppointments(appointments: Appointment[]): AppointmentView[] {
  const appointmentsMapped: AppointmentView[] = [];

  appointments.forEach((appointment) => {
    const current = appointmentsMapped.find((a) => a.date.getDate() == appointment.date.getDate());

    const schedule = {
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      active: appointment.active,
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
