/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
/* eslint-disable react/function-component-definition */
import type {FC} from "react";
import type {Dayjs} from "dayjs";
import type {CourtSchedule} from "@/lib/types/importables/types";

import dayjs from "dayjs";
import React, {useState} from "react";
import {useRouter} from "next/navigation";

import {timeToMinutesDayJs} from "@/lib/utils/utils";
import TimePickerUI from "@/components/TimePicker/time-picker";
import {Button} from "@/components/ui/button";
import {ToggleGroup, ToggleGroupItem} from "@/components/ui/toggle-group";

import {DAYS_OF_WEEK} from "../horarios/page";

import ScheduleTable from "./ScheduleTable";

interface HorarioFormProps {
  schedule: CourtSchedule[];
  courtId: number;
  courts: number[];
}

const ScheduleForm: FC<HorarioFormProps> = ({courtId, courts, schedule}) => {
  const [openTime, setOpenTime] = useState(dayjs("2022-04-17T08:00"));
  const [closeTime, setCloseTime] = useState(dayjs("2022-04-17T22:30"));
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [days, setDays] = useState<CourtSchedule[]>([...schedule]);
  const router = useRouter();

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

    const data = await response.json();

    router.push(`../${courtId}`);
  };

  return (
    <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-8">
      <section className="flex-auto">
        <h2 className="font-semibold text-xl">Horarios de la Cancha X</h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-bold">Dias de la semana</p>
            <ToggleGroup type="multiple" variant="outline" onValueChange={setSelectedDays}>
              <div>
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

          <div className="flex flex-col gap-2">
            <p className="font-bold">Horario de Apertura</p>
            <TimePickerUI
              ampm={false}
              className="w-full"
              value={openTime}
              onChange={(value: Dayjs) => {
                setOpenTime(value);
              }}
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-bold">Horario de Cierre</p>
            <TimePickerUI
              ampm={false}
              className="w-full"
              value={closeTime}
              onChange={(value: Dayjs) => {
                setCloseTime(value);
              }}
            />
          </div>
          <Button
            className="bg-blue-500 text-white hover:bg-blue-300"
            variant="secondary"
            onClick={handleClic}
          >
            Agregar Horario
          </Button>
          <Button onClick={updateCourtTimes}>Finalizar</Button>
        </div>
      </section>
      <div>
        <ScheduleTable showHeader handleEdit={handleEdit} schedule={days} />
      </div>
    </div>
  );
};

export default ScheduleForm;
