import type {CourtSchedule} from "@/lib/types/importables/types";
import { Clock3Icon , CalendarClockIcon, DollarSignIcon } from "lucide-react";
import Link from "next/link";

import {Button} from "@/components/ui/button";
import {findWithDays} from "@/backend/db/models/courts";
import { capitalize, timeInStringFromMinutes } from "@/lib/utils/utils";
import { DAYS_OF_WEEK } from "./horarios/page";
import AppointmentDay from "./turnos/components/AppointmentDay";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Appointment } from "@prisma/client";

async function CurtPage({params}: {params: {sportCenterId: string; courtId: string}}) {
  const curt = await findWithDays(params.sportCenterId, params.courtId);

  if (curt == null) {
    return <div>No se encontro la Cancha</div>;
  }

  const {days, sportCenter, appointments, sport} = {...curt};
  const appointmentsMapped = mapAppointments(appointments);
  let curtSchedule: CourtSchedule[] = [];

  if (curt.days.length) {
    curtSchedule = curt.days.map((day) => {
      return {
        name: day.name,
        openTime: day.openTime,
        closeTime: day.closeTime,
      };
    });
  }

  const date = new Date();

  const dayStr = capitalize(
    format(date, "eeee dd", {
      locale: es,
    }),
  );

  const monthStr = capitalize(
    format(date, "LLLL", {
      locale: es,
    }),
  );

  const handelChangeDate = () => {
    date.setDate( date.getDate() + 1);
  }

  return (
    <div className="container mx-auto h-[500px] w-full flex gap-4">
      <div className="flex-auto flex flex-col gap-4">
        <header className="">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold">{curt.sportCenter.name} - {curt.name}</h2> 
          </div>
          <p className="text-xl text-neutral-400">{curt.sport.name}</p>
        </header>

        {/* <section className="w-full p-4">
          <h3 className="flex items-center gap-2 text-xl"><DollarSignIcon /> Precio</h3>
          <div className="text-2xl">$ {curt.price}</div>
        </section> */}

        <section className="w-full p-4">
          <h3 className="w-full my-4 bg-primary text-white p-2 flex items-center gap-2 text-xl"><Clock3Icon /> Horarios</h3>
          <div className="flex items-center gap-2 mt-2">
          {curtSchedule.length > 0 ? (
            curtSchedule.map( ( day , index) => <div key={index} className="flex-auto flex flex-col items-center">
              
                <div>{DAYS_OF_WEEK[`${day.name}`].name}</div>
                { 
                  day.openTime ? 
                  <div>{timeInStringFromMinutes(day.openTime.toString())} - {timeInStringFromMinutes(day.closeTime!.toString())}</div>
                  : <div>Cerrado</div>
                }
                
              
            </div> )
          ) : (
            <div>No se establecieron los horarios de la cancha.</div>
          )}
          </div>
        </section>

        <section className="p-4">
          <div className="mt-2">
            {
              appointmentsMapped.length ?
              (
                <>
                  {
                    appointmentsMapped.map( (app, index) => (
                      <div key={index}>
                        <h3 className="w-full my-4 bg-primary text-white p-2 flex items-center gap-2 text-xl"><CalendarClockIcon /> Turnos - {app.date.toISOString()}</h3>
                        <div className="flex items-center justify-between">
                          {
                            app.schedule.map( (appointment, index) => <AppointmentDay key={index} appointment={appointment}></AppointmentDay> )
                          }
                        </div>

                      </div>
                    ))
                  }
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-4 h-4 bg-green-400/40 rounded-full" /> Disponible
                  </div>
                </>
              )
              : (
                <>
                  <h3 className="w-full my-4 bg-primary text-white p-2 flex items-center gap-2 text-xl"><CalendarClockIcon /> Turnos - {dayStr} de {monthStr}</h3>
                  <div> No hay turnos registrados en la cancha.</div>
                </>
              ) 
            }
          </div>
        </section>
      </div>

      <aside className="border flex flex-col gap-2 py-2 px-4">
        <Button>
          <Link href={`${params.courtId}/horarios`}>Gestion de Horarios</Link>
        </Button>
        <Button>
          <Link href={`${params.courtId}/turnos`}>Generar Turnos</Link>
        </Button>
        <Button>Editar Datos</Button>
      </aside>
    </div>
  );
}

export default CurtPage;

interface appointmentView {
  date: Date,
  schedule: {
    startTime: number,
    endTime: number,
    active: boolean,
  }[]
}

function mapAppointments(appointments: Appointment[]): appointmentView[] {
  const appointmentsMapped: appointmentView[] = [];

  appointments.forEach( (appointment) => {
    const current = appointmentsMapped.find( a => a.date.getDate() == appointment.date.getDate());
    
    const schedule = {
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      active: appointment.active,
    }

    if(current){
      current.schedule.push(schedule);
    } else {
      const newDate = {
        date: appointment.date,
        schedule: [schedule]
      }

      appointmentsMapped.push(newDate);
    }


  });
  
  return appointmentsMapped;
}