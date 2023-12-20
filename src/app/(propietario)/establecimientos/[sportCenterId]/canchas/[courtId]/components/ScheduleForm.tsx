/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
/* eslint-disable react/function-component-definition */
import type {FC} from "react";
import type {Dayjs} from "dayjs";
import type {ApiResponse, CourtSchedule} from "@/lib/types/importables/types";
import type {CourtFullInfo, Prueba} from "@/backend/db/models/courts";

import dayjs from "dayjs";
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {Clock3Icon, AlertCircleIcon} from "lucide-react";

import {timeToMinutesDayJs} from "@/lib/utils/utils";
import TimePickerUI from "@/components/TimePicker/time-picker";
import {Button} from "@/components/ui/button";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";
import {errorToast, successToast} from "@/lib/utils/toasts";

import {DAYS_OF_WEEK} from "../horarios/page";

import ScheduleTable from "./ScheduleTable";

interface HorarioFormProps {
  schedule: CourtSchedule[];
  courtId: number;
  courts: number[];
  court?: Prueba;
  // court?: CourtFullInfo;
}

const ScheduleForm: FC<HorarioFormProps> = ({courtId, courts, schedule, court}) => {
  const [openTime, setOpenTime] = useState(dayjs("2022-04-17T08:00"));
  const [closeTime, setCloseTime] = useState(dayjs("2022-04-17T22:30"));
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [days, setDays] = useState<CourtSchedule[]>([...schedule]);
  const router = useRouter();

  const existeReservation = court?.appointments.some((a) => a.reservations.length > 0);

  const handleClic = () => {
    const newDays: CourtSchedule[] = days.map((day) => {
      if (selectedDays.includes(day.name) && (!day.openTime || !day.closeTime)) {
        return {
          ...day,
          openTime: timeToMinutesDayJs(openTime),
          closeTime: timeToMinutesDayJs(closeTime),
        };
      }

      return day;
    });

    setDays([...newDays]);
  };

  const handleEdit = (daySelected: string) => {
    const daysChanged = days.map((day) => {
      if (day.name === daySelected) {
        day.openTime = null;
        day.closeTime = null;
      }

      return day;
    });

    setDays([...daysChanged]);
  };

  const updateCourtTimes = async () => {
    const response = await fetch("/api/court", {
      method: "POST",
      body: JSON.stringify({days, courts}),
    });

    const data = (await response.json()) as ApiResponse;

    if (data.status === 200) {
      successToast("Se actualizaron los horarios correctamente");
      router.refresh();
      router.push(`../${courtId}`);
    } else {
      errorToast("No se puedieron actualizar los horarios");
      router.push(`../${courtId}`);
    }
  };

  return (
    <div className="w-full">
      <h3 className="w-full mb-4 bg-primary text-white p-2 flex items-center gap-2 text-xl">
        <Clock3Icon /> Horarios - {court?.name}
      </h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {court?.appointments.length ? (
            <div className="flex gap-4 p-2 bg-yellow-400 shadow shadow-yellow-500">
              <AlertCircleIcon className="text-yellow-600" />
              {existeReservation ? (
                <div className=" text-yellow-600">
                  Hay turnos con reservas activas o reservas pendientes. Si se realiza una
                  modificación de los horarios actuales se cancelaran las reservas y se regeneraran
                  los turnos.
                </div>
              ) : (
                <div className=" text-yellow-600">Hay turnos activos</div>
              )}
            </div>
          ) : null}

          <span className="font-medium text-lg my-2">Dias de la semana</span>
          <ToggleGroup type="multiple" variant="outline" onValueChange={setSelectedDays}>
            <div className="flex gap-2 flex-wrap">
              {days.map((option, index) => (
                <ToggleGroupItem
                  key={index}
                  aria-label={`Toggle ${option.name}`}
                  className="data-[state=on]:bg-green-600 data-[state=on]:text-white"
                  disabled={option.openTime != null || option.closeTime != null}
                  value={option.name}
                >
                  {DAYS_OF_WEEK[`${option.name}`].name}
                </ToggleGroupItem>
              ))}
            </div>
          </ToggleGroup>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-auto flex flex-col gap-2">
            <span className="font-medium text-lg">Horario de Apertura</span>
            <TimePickerUI
              ampm={false}
              className="w-full"
              value={openTime}
              onChange={(value: Dayjs) => {
                setOpenTime(value);
              }}
            />
          </div>

          <div className="flex-auto flex flex-col gap-2">
            <span className="font-medium text-lg">Horario de Cierre</span>
            <TimePickerUI
              ampm={false}
              className="w-full"
              value={closeTime}
              onChange={(value: Dayjs) => {
                setCloseTime(value);
              }}
            />
          </div>
        </div>

        <Button
          className="bg-blue-500 text-white hover:bg-blue-300"
          variant="secondary"
          onClick={handleClic}
        >
          Agregar Horario
        </Button>

        <div>
          <ScheduleTable showHeader handleEdit={handleEdit} schedule={days} />
        </div>

        <Button onClick={updateCourtTimes}>Guardar cambios</Button>
      </div>
    </div>
  );
};

export default ScheduleForm;
