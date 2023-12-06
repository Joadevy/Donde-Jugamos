/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable react/function-component-definition */
"use client";
import type {FC} from "react";
import type {DateRange} from "react-day-picker";
import type {CourtSchedule} from "@/lib/types/importables/types";
import type {Court} from "@prisma/client";

import React, {Suspense, useState} from "react";
import {addDays, format} from "date-fns";
import {Box, Step, StepButton, StepLabel, Stepper, Typography} from "@mui/material";

import {DatePickerWithRange} from "@/components/ui/daterangepicker";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";

import Prueba from "./AppointmentsDayList";
import AppointmentsDayList from "./AppointmentsDayList";

interface GenerateAppointmentsClientProps {
  courtId: number;
  schedule: CourtSchedule[];
  appointmentTime: number;
  courts: Court[];
}

export interface AppointmentDTO {
  date: Date;
  startTime: number;
  endTime: number;
  active: boolean;
  courtId: number;
}

const DAY_LIMIT_MIN = 1 as const;
const DAY_LIMIT_MAX = 30 as const;

const GenerateAppointmentsClient: FC<GenerateAppointmentsClientProps> = ({
  courtId,
  schedule,
  appointmentTime,
  courts,
}) => {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), DAY_LIMIT_MIN),
  });

  const [appointmentsMap, setAppointmentsMap] = useState<Map<number, AppointmentDTO[]>>(
    new Map<number, AppointmentDTO[]>(),
  );
  const [daysOfAppointments, setDaysOfAppointments] = useState<number[]>([]);

  const steps: string[] = ["Seleccionar filtros", "Generación de Turnos", "Confirmación"];
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<Record<number, boolean>>({});

  const handleClick = () => {
    const appointmetsGenerated: AppointmentDTO[] = [];

    if (!date?.from) return false;
    if (!date.to) return false;

    const dateFrom = new Date(date.from);
    const dateTo = new Date(date.to);

    dateFrom.setHours(0, 0, 0, 0);
    dateTo.setHours(0, 0, 0, 0);

    while (dateFrom <= dateTo) {
      const dayStr = format(dateFrom, "eeee").trim().toLowerCase();
      const daySchedule = schedule.find((day) => day.name === dayStr);

      if (daySchedule) {
        const dayCloseTime = daySchedule.closeTime!;
        let timeTracker = daySchedule.openTime!;

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
        setDaysOfAppointments([...daysOfAppointments]);
      }
      dateFrom.setDate(dateFrom.getDate() + 1);
    }

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

  const updateAppointmentState = (day: number, appoinments: AppointmentDTO[]) => {
    appointmentsMap.set(day, appoinments);
    setAppointmentsMap(new Map(appointmentsMap));
    console.log(appointmentsMap);
  };

  const createAppointments = async () => {
    const newAppointments: AppointmentDTO[] = [];
    const url = `/api/appointment/${courtId}`;

    appointmentsMap.forEach((appointments) => newAppointments.push(...appointments));
    const body = JSON.stringify(newAppointments);

    const result = await fetch(url, {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json",
      },
    }).catch((err) => null);

    console.log(result);
  };

  const handleNext = () => {
    const newActiveStep = activeStep + 1;

    setActiveStep(newActiveStep);
    setCompleted({[newActiveStep - 1]: true});

    if (newActiveStep === 1) {
      handleClick();
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setCompleted({...completed, [activeStep]: false});

    if (activeStep === 1) {
      setDaysOfAppointments([]);
      setAppointmentsMap(new Map());
    }
  };

  return (
    <div className="mt-8">
      <div />
      <Box className="pb-24">
        <Stepper nonLinear activeStep={activeStep} className="w-[950px] mx-auto">
          {steps.map((label, index) => (
            <Step key={label} completed={completed[index]}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <div className="mt-8">
          {activeStep === 0 ? (
            <div className="w-[600px] mx-auto">
              <Label>Rango de fechas para generación de turnos</Label>
              <DatePickerWithRange
                date={date!}
                disabledDatesFrom={new Date()}
                maxDayLimit={DAY_LIMIT_MAX}
                setDate={setDate}
              />
              <p className="text-sm">Maximo 30 dias</p>
              <Button className="w-full mt-4" onClick={handleNext}>
                Siguiente
              </Button>
            </div>
          ) : activeStep === 1 ? (
            <Suspense fallback={<Loading />}>
              <div className="relative flex flex-col gap-4 items-center">
                <div className="fixed bottom-0 w-full border-t bg-white p-2">
                  <p className="text-sm">
                    Haga click en el turno para habilitar o deshabilitar un turno
                  </p>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-400/40 rounded-full" /> Habilitado
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-neutral-400/40 rounded-full" /> Deshabilitado
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  {daysOfAppointments.map((day) => (
                    <AppointmentsDayList
                      key={day}
                      editable
                      appointments={appointmentsMap.get(day)!}
                      date={day}
                      updateState={updateAppointmentState}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" onClick={handleBack}>
                    back
                  </Button>
                  <Button onClick={handleNext}>Siguiente</Button>
                </div>
              </div>
            </Suspense>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="w-[950px] mx-auto">
                <Label className="text-lg">
                  ¿Desea copiar la configuración realizada a otras canchas?
                </Label>
                <div className="italic text-rose-400">
                  Lista de canchas en forma de checkbox que cumplan:
                  <ul>
                    <li>* Misma duración de cancha</li>
                    <li>* Otro?</li>
                  </ul>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <h2 className="text-2xl font-bold">Resumen</h2>
                {daysOfAppointments.map((day) => (
                  <AppointmentsDayList
                    key={day}
                    appointments={appointmentsMap.get(day)!}
                    date={day}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2 mx-auto">
                <Button variant="secondary" onClick={handleBack}>
                  back
                </Button>
                <Button onClick={createAppointments}>Finalizar</Button>
              </div>
            </div>
          )}
        </div>
      </Box>
    </div>
  );
};

export default GenerateAppointmentsClient;

function Loading() {
  return <h2>🌀 Loading...</h2>;
}
