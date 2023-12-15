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
import { CourtFullInfo } from "@/backend/db/models/courts";
import { Clock3Icon } from "lucide-react";

interface HorarioFormProps {
  schedule: CourtSchedule[];
  courtId: number;
  courts: number[];
  court?: CourtFullInfo;
}

const ScheduleForm: FC<HorarioFormProps> = ({courtId, courts, schedule, court}) => {
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
    <div className="container max-w-5xl mx-auto p-8">
        <h3 className="w-full mb-4 bg-primary text-white p-2 flex items-center gap-2 text-xl">
            <Clock3Icon /> Horarios - {court?.name}
          </h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <span className="font-medium text-lg my-2">Dias de la semana</span>
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

          <div className="flex items-center gap-4">
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
          
          <Button onClick={updateCourtTimes}>Finalizar</Button>
        </div>
      
    </div>
  );
};

export default ScheduleForm;
