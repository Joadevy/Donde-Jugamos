"use client";
/* eslint-disable @typescript-eslint/no-misused-promises */
import type {Dayjs} from "dayjs";

import React, {useState} from "react";
import dayjs from "dayjs";
import {TableBody} from "@mui/material";
import {X} from "lucide-react";

import {Button} from "@/components/ui/button";
import {timeInStringFromMinutes, timeToMinutesDayJs} from "@/lib/utils/utils";
import {
  Table,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TimePickerUI from "@/components/TimePicker/time-picker";
import ToggleGroup from "@/components/ToggleGroup/ToggleGroup";

const DAYS = [
  {value: "monday", label: "Lunes", disabled: false},
  {value: "tuesday", label: "Martes", disabled: false},
  {value: "wednesday", label: "Miércoles", disabled: false},
  {value: "thursday", label: "Jueves", disabled: false},
  {value: "friday", label: "Viérnes", disabled: false},
  {value: "saturday", label: "Sabado", disabled: false},
  {value: "sunday", label: "Domingo", disabled: false},
];

function HorariosPage() {
  const [openTime, setOpenTime] = useState(dayjs("2022-04-17T08:00"));
  const [closeTime, setCloseTime] = useState(dayjs("2022-04-17T22:30"));
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [daysToConfig, setDaysToConfig] = useState([...DAYS]);
  const [daysConfigured, setDaysConfigured] = useState<
    {
      names: string[];
      openTime: number;
      closeTime: number;
    }[]
  >([]);

  const handleClic = () => {
    const configured = daysConfigured.flatMap((day) => day.names);
    const news = {
      names: [] as string[],
      openTime: timeToMinutesDayJs(openTime),
      closeTime: timeToMinutesDayJs(closeTime),
    };

    selectedDays.forEach((day) => {
      if (!configured.includes(day)) {
        news.names.push(day);
        changeDayState(day, "disable");
      }
    });

    daysConfigured.push(news);

    setDaysToConfig([...daysToConfig]);
    setDaysConfigured([...daysConfigured]);
  };

  const handleEdit = (index: number) => {
    const row = daysConfigured.splice(index, 1)[0];

    row.names.forEach((dayName) => changeDayState(dayName, "enable"));

    setDaysToConfig([...daysToConfig]);
    setDaysConfigured([...daysConfigured]);
  };

  const changeDayState = (dayName: string, state: "disable" | "enable") => {
    return daysToConfig.map((day) => {
      if (day.value === dayName) {
        day.disabled = state === "disable" ? true : false;
      }

      return day;
    });
  };

  const updateCourtTimes = async () => {
    const days = daysConfigured.flatMap((day) => {
      return day.names.map((name) => {
        return {
          name,
          openTime: day.openTime,
          closeTime: day.closeTime,
        };
      });
    });

    const courts = [1];

    const response = await fetch("/api/court", {
      method: "POST",
      body: JSON.stringify({days, courts}),
    });
    const data = await response.json();

    console.log(data);
  };

  return (
    <div className="container mx-auto flex flex-col md:flex-row items-center gap-8">
      <section className="flex-auto">
        <h2 className="font-semibold text-xl">Horarios de la Cancha X</h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="font-bold">Dias de la semana</p>
            <ToggleGroup
              className="data-[state=on]:bg-green-600 data-[state=on]:text-white"
              options={daysToConfig}
              onValueChange={(values: string[]) => {
                setSelectedDays(values);
              }}
            />
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
      {daysConfigured.length > 0 ? (
        <section className="flex-auto">
          <Table className="w-full select-none border">
            <TableCaption>Horarios de apertura de la cancha X.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Dias</TableHead>
                <TableHead>Apertura</TableHead>
                <TableHead>Cierre</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {daysConfigured.map((conf, index) => (
                <TableRow key={index} className="hover:bg-green-50">
                  <TableCell className="flex flex-col gap-2">
                    {conf.names.map((name) => (
                      <p key={name}>{DAYS.find((day) => day.value === name)?.label}</p>
                    ))}
                  </TableCell>
                  <TableCell>{timeInStringFromMinutes(conf.openTime.toString())}</TableCell>
                  <TableCell>{timeInStringFromMinutes(conf.closeTime.toString())}</TableCell>
                  <TableCell>
                    <X
                      color="green"
                      size={25}
                      onClick={() => {
                        handleEdit(index);
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter />
          </Table>
        </section>
      ) : null}
    </div>
  );
}

export default HorariosPage;
