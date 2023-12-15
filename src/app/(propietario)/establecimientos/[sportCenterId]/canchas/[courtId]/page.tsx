import type {CourtSchedule} from "@/lib/types/importables/types";
import type {Appointment} from "@prisma/client";

import {Clock3Icon, CalendarClockIcon, DollarSignIcon} from "lucide-react";
import Link from "next/link";

import {Button} from "@/components/ui/button";
import {findWithDays} from "@/backend/db/models/courts";
import {formatNumber, getPartOfDate, timeInStringFromMinutes} from "@/lib/utils/utils";

import {DAYS_OF_WEEK} from "./horarios/page";
import AppointmentDay from "./turnos/components/AppointmentDay";

async function CurtPage({params}: {params: {sportCenterId: string; courtId: string}}) {
  const curt = await findWithDays(params.sportCenterId, params.courtId);

  if (curt == null) {
    return <div>No se encontro la Cancha</div>;
  }

  const {days, sportCenter, appointments, sport} = {...curt};
  const appointmentsMapped = mapAppointments(appointments);

  let curtSchedule: CourtSchedule[] = [];

  if (days.length) {
    curtSchedule = days.map((day) => {
      return {
        name: day.name,
        openTime: day.openTime,
        closeTime: day.closeTime,
      };
    });
  }

  return (
    <div className="container mx-auto w-full flex gap-4">
      <div className="flex-auto flex flex-col gap-4">
        <header>
          <div className="flex items-center justify-between my-1">
            <h2 className="text-3xl font-semibold">
              {sportCenter.name} - {curt.name}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xl text-neutral-400">{sport.name}</p>
            <span>-</span>
            <p className="flex items-center text-xl text-neutral-400">
              <DollarSignIcon /> {formatNumber(curt.price)}
            </p>
          </div>
          <p className="my-4 text-base">{curt.description}</p>
        </header>
        <section className="w-full">
          <h3 className="w-full mb-4 bg-primary text-white p-2 flex items-center gap-2 text-xl">
            <Clock3Icon /> Horarios
          </h3>
          <div className="flex items-center gap-2 mt-2">
            {curtSchedule.length > 0 ? (
              curtSchedule.map((day, index) => (
                <div key={index} className="flex-auto flex flex-col items-center">
                  <div>{DAYS_OF_WEEK[`${day.name}`].name}</div>
                  {day.openTime ? (
                    <div>
                      {timeInStringFromMinutes(day.openTime.toString())} -{" "}
                      {timeInStringFromMinutes(day.closeTime!.toString())}
                    </div>
                  ) : (
                    <div>Cerrado</div>
                  )}
                </div>
              ))
            ) : (
              <div>No se establecieron los horarios de la cancha.</div>
            )}
          </div>
        </section>

        <section className="w-full">
          {appointmentsMapped.length ? (
            <div className="flex flex-col gap-2">
              <h3 className="w-full my-4 bg-primary text-white p-2 flex items-center gap-2 text-xl">
                <CalendarClockIcon /> Turnos
              </h3>
              {appointmentsMapped.map((app, index) => (
                <div key={index}>
                  <h4 className="text-lg">
                    {getPartOfDate(app.date, "dayFull", true, true)} de{" "}
                    {getPartOfDate(app.date, "monthName", true, true)}
                  </h4>
                  <div className="flex items-center gap-1">
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
              <h3 className="w-full my-4 bg-primary text-white p-2 flex items-center gap-2 text-xl">
                <CalendarClockIcon /> Turnos
              </h3>
              <div> No hay turnos registrados en la cancha.</div>
            </>
          )}
        </section>
      </div>

      <aside className="border flex flex-col gap-2 py-2 px-4">
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

export default CurtPage;

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
