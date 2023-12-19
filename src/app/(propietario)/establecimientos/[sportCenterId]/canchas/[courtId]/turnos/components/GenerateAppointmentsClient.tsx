/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable react/function-component-definition */
"use client";
import type {FC} from "react";
import type {ApiResponse, CourtSchedule} from "@/lib/types/importables/types";
import type {Appointment, Court} from "@prisma/client";

import React, {useState} from "react";
import {addDays} from "date-fns";
import {useRouter} from "next/navigation";

import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {diferenciaEnDias, getPartOfDate} from "@/lib/utils/utils";
import {DatePicker} from "@/components/ui/datepicker";
import {errorToast, successToast} from "@/lib/utils/toasts";

import AppointmentsDayList from "./AppointmentsDayList";

interface GenerateAppointmentsClientProps {
  courtId: number;
  schedule: CourtSchedule[];
  appointmentTime: number;
  similarCourts?: Court[] | null;
  maxDate?: Date | null;
}

const DAY_LIMIT_MAX = 30 as const;

const GenerateAppointmentsClient: FC<GenerateAppointmentsClientProps> = ({
  courtId,
  schedule,
  appointmentTime,
  maxDate,
}) => {
  const sinceDate = addDays(maxDate || new Date(), 1);
  const untilDate = addDays(
    sinceDate,
    DAY_LIMIT_MAX - (maxDate ? diferenciaEnDias(new Date(), maxDate) : 0) - 1,
  );

  const [fromDate, setFromDate] = useState<Date | undefined>(sinceDate);
  const [toDate, setToDate] = useState<Date | undefined>();

  const [appointments, setAppointments] = useState<Record<number, Partial<Appointment>[]>>({});
  const [dates, setDates] = useState<number[]>([]);
  const router = useRouter();

  const handleAppointmentChangeState = (
    day: number,
    appointmentsChanged: Partial<Appointment>[],
  ) => {
    appointments[day] = appointmentsChanged;
    setAppointments({...appointments});
  };

  const handleGenerate = () => {
    const dateFrom = fromDate ? new Date(fromDate) : new Date();
    const dateTo = toDate || new Date(dateFrom);

    dateFrom.setHours(0, 0, 0, 0);
    dateTo.setHours(0, 0, 0, 0);

    const newAppointment = generateAppointments(
      dateFrom,
      dateTo,
      schedule,
      appointmentTime,
      courtId,
    );
    const appointmentDates = Object.keys(newAppointment).map((value) => Number(value));

    setAppointments(newAppointment);
    setDates(appointmentDates);
  };

  const saveAppointments = () => {
    const url = `/api/appointment/${courtId}`;
    const data = Object.entries(appointments).flatMap((value) => value[1]);

    fetch(url, {body: JSON.stringify(data), method: "POST"})
      .then((res) => res.json())
      .then((res: ApiResponse) => {
        if (res.status === 200) {
          successToast("Los turnos se generaron con exito!");
          router.refresh();
          router.push(`../${courtId}`);
        } else throw Error(res.message);
      })
      .catch(() => {
        errorToast("No se pudo procesar tu solicitud, intente nuevamente");
      });
  };

  return (
    <div className="container mx-auto mt-8">
      <div className="w-fit mx-auto">
        <p className="text-lg font-medium">
          Seleccione el rango de fechas en el que quiera generar los turnos
        </p>
        <ul className="text-base text-neutral-500">
          Aclaraciones:
          <li>* Máximo 30 días desde la fecha del último turno generado.</li>
          <li>
            * Si desea generar el turno para un día unicamente, dejar la{" "}
            <strong>Fecha Hasta</strong> en blanco.
          </li>
        </ul>
        <div className="my-4 flex flex-wrap gap-4">
          <div className="flex-auto flex flex-col gap-2">
            <Label className="text-base">Fecha Desde (*)</Label>
            <DatePicker date={fromDate} setDate={setFromDate} sinceDate={sinceDate} />
          </div>
          <div className="flex-auto flex flex-col gap-2">
            <Label className="text-base">Fecha Hasta</Label>
            <DatePicker
              date={toDate}
              setDate={setToDate}
              sinceDate={sinceDate}
              untilDate={untilDate}
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2 m-auto">
          <Button className="w-full" onClick={handleGenerate}>
            Previsualizar
          </Button>
        </div>
      </div>

      <section className="max-w-5xl mx-auto my-10">
        <div className="flex flex-col gap-4">
          {dates.length
            ? dates.map((value) => (
                <AppointmentsDayList
                  key={value}
                  editable
                  appointments={appointments[value]}
                  date={value}
                  updateState={handleAppointmentChangeState}
                />
              ))
            : null}
        </div>

        {Object.keys(appointments).length > 0 && (
          <div className="w-full lg:w-1/2 m-auto mt-4">
            <Button
              className="flex-auto bg-blue-500 w-full"
              disabled={dates.length == 0}
              onClick={saveAppointments}
            >
              Generar turnos
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};

export default GenerateAppointmentsClient;

function generateAppointments(
  dateFrom: Date,
  dateTo: Date,
  schedule: CourtSchedule[],
  duration: number,
  courtId: number,
): Record<number, Partial<Appointment>[]> {
  const appointmetsGenerated: Record<number, Partial<Appointment>[]> = {};

  while (dateFrom <= dateTo) {
    const dateKey = dateFrom.getTime();
    const dayStr = getPartOfDate(dateFrom, "dayName");
    const daySchedule = schedule.find((day) => day.name === dayStr);

    if (daySchedule) {
      const dayCloseTime = daySchedule.closeTime!;
      let timeTracker = daySchedule.openTime!;

      while (dayCloseTime - timeTracker >= duration) {
        const appointment: Omit<Appointment, "id"> = {
          date: new Date(dateFrom),
          startTime: timeTracker,
          endTime: timeTracker + duration,
          active: true,
          courtId: courtId,
        };

        if (appointmetsGenerated[dateKey]) {
          appointmetsGenerated[dateKey].push(appointment);
        } else {
          appointmetsGenerated[dateKey] = [appointment];
        }

        timeTracker += duration;
      }
    }
    dateFrom.setDate(dateFrom.getDate() + 1);
  }

  return appointmetsGenerated;
}
