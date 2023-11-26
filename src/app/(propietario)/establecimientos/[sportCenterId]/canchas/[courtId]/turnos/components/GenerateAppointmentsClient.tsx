/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable react/function-component-definition */
"use client";
import type {FC} from "react";
import type {DateRange} from "react-day-picker";
import type {CourtSchedule} from "@/lib/types/importables/types";

import React, {useState} from "react";
import {addDays} from "date-fns";

import {DatePickerWithRange} from "@/components/ui/daterangepicker";
import {Button} from "@/components/ui/button";

import Prueba from "./Prueba";

interface GenerateAppointmentsClientProps {
  schedule: CourtSchedule[];
  appointmentTime: number;
  courtId: number;
}

export interface AppointmentDTO {
  date: Date;
  startTime: number;
  endTime: number;
  active: boolean;
  courtId: number;
}

const DAY_LIMIT_MIN = 15 as const;
const DAY_LIMIT_MAX = 30 as const;

const DAT_OF_WEEK = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

const GenerateAppointmentsClient: FC<GenerateAppointmentsClientProps> = ({
  schedule,
  appointmentTime,
  courtId,
}) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), DAY_LIMIT_MIN),
  });
  const [daysOfAppointments, setDaysOfAppointments] = useState<number[]>([]);
  const [appointmentsMap, setAppointmentsMap] = useState<Map<number, AppointmentDTO[]>>(
    new Map<number, AppointmentDTO[]>(),
  );

  const handleClick = () => {
    const appointmetsGenerated: AppointmentDTO[] = [];

    if (!date?.from) return false;
    if (!date.to) return false;

    const dateFrom = new Date(date.from);
    const dateTo = new Date(date.to);

    dateFrom.setHours(0, 0, 0, 0);
    dateTo.setHours(0, 0, 0, 0);

    while (dateFrom <= dateTo) {
      const dayStr = DAT_OF_WEEK[dateFrom.getDay()];
      const daySchedule = schedule.find((day) => day.name === dayStr);
      const dayCloseTime = daySchedule?.closeTime!;
      let timeTracker = daySchedule?.openTime!;

      while (dayCloseTime - timeTracker >= appointmentTime) {
        const appointment: AppointmentDTO = {
          date: new Date(dateFrom),
          startTime: timeTracker,
          endTime: timeTracker + appointmentTime,
          active: true,
          courtId: courtId,
        };

        appointmetsGenerated.push(appointment);

        timeTracker += appointmentTime;
      }

      daysOfAppointments.push(new Date(dateFrom).getTime());
      dateFrom.setDate(dateFrom.getDate() + 1);
    }
    // setDaysOfAppointments([...daysOfAppointments, new Date(dateFrom).getTime()]);

    const mapaDeObjetos: Map<number, AppointmentDTO[]> = appointmetsGenerated.reduce(
      (mapa, objeto) => {
        const key = mapa.get(objeto.date.getTime());

        if (key) {
          key.push(objeto);
        } else {
          mapa.set(objeto.date.getTime(), [objeto]);
        }

        return mapa;
      },
      new Map<number, AppointmentDTO[]>(),
    );

    setAppointmentsMap(new Map(mapaDeObjetos));
  };

  const changeUpdate = (day: number, appoinments: AppointmentDTO[]) => {
    appointmentsMap.set(day, appoinments);
    setAppointmentsMap(new Map(appointmentsMap));
  };

  const createAppointments = () => {
    const newAppointments: AppointmentDTO[] = [];

    appointmentsMap.forEach((appointments) => newAppointments.push(...appointments));

    console.log("Se va a enviar", newAppointments);
  };

  return (
    <div>
      <h1 className="text-xl font-bold">Generacion de Turnos</h1>
      <p>
        <strong>Tiempo: </strong> {appointmentTime}
      </p>
      <div>
        <strong>Rango de fechas</strong>
        <DatePickerWithRange
          date={date!}
          disabledDatesFrom={new Date()}
          maxDayLimit={DAY_LIMIT_MAX}
          setDate={setDate}
        />
        <p>Dias: {daysDiff(date?.to, date?.from)}</p>
      </div>
      <Button onClick={handleClick}>Generar Turnos</Button>
      <Button onClick={createAppointments}>Finalizar</Button>

      {daysOfAppointments.map((day, index) => (
        <div key={day}>
          <Prueba
            key={index}
            appointments={appointmentsMap.get(day)}
            date={day}
            updateState={changeUpdate}
          />
        </div>
      ))}
    </div>
  );
};

export default GenerateAppointmentsClient;

function daysDiff(to: Date | undefined, from: Date | undefined): number {
  if (!to) return 0;
  if (!from) return 0;
  to.setHours(0, 0, 0, 0);
  from.setHours(0, 0, 0, 0);
  const diff = to.getTime() - from.getTime();

  return diff / (1000 * 3600 * 24) + 1;
}
