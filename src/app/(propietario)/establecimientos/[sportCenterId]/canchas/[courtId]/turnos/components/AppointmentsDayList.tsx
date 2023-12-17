/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/function-component-definition */
import type {FC} from "react";
import type {Appointment} from "@prisma/client";

import React from "react";
import {format} from "date-fns";
import {es} from "date-fns/locale";

import {capitalize, timeInStringFromMinutes} from "@/lib/utils/utils";

interface AppointmentsDayListProps {
  date: number;
  appointments: Partial<Appointment>[];
  editable?: boolean;
  updateState?: (day: number, appointments: Partial<Appointment>[], update?: boolean) => void;
  updateAppointment?: (appointment: Partial<Appointment>) => void;
}

const AppointmentsDayList: FC<AppointmentsDayListProps> = ({
  date,
  appointments,
  editable,
  updateState,
  updateAppointment,
}) => {
  if (!appointments) return <div />;

  const currentDate = new Date(date);
  const dayStr = capitalize(
    format(currentDate, "eeee dd", {
      locale: es,
    }),
  );
  const monthStr = capitalize(
    format(currentDate, "LLLL", {
      locale: es,
    }),
  );

  const handleState = (appointment: Partial<Appointment>) => {
    appointment.active = !appointment.active;

    if (updateAppointment) {
      updateAppointment(appointment);
    }

    if (updateState) {
      updateState(date, [...appointments]);
    }
  };

  const enableAll = () => {
    appointments.forEach((app) => (app.active = true));

    if (updateState) {
      updateState(date, [...appointments], true);
    }
  };

  const disableAll = () => {
    appointments.forEach((app) => (app.active = false));
    if (updateState) {
      updateState(date, [...appointments], true);
    }
  };

  return (
    <div className="rounded-md">
      <header className="p-2 flex items-center gap-4">
        <div className="text-xl font-medium">
          {dayStr} de {monthStr}
        </div>
        <div className="flex gap-1 ml-auto">
          <button className="p-2 text-xs text-white bg-blue-400 rounded-md" onClick={enableAll}>
            Habilitar Todos
          </button>
          <button className="p-2 text-xs text-white bg-neutral-500 rounded-md" onClick={disableAll}>
            Deshabilitar Todos
          </button>
        </div>
      </header>

      <div className="flex flex-wrap gap-1 p-2">
        {appointments.map((appointment) => (
          <div
            key={appointment.startTime! + appointment.endTime!}
            className={`w-28 p-2 border flex justify-between rounded-md select-none 
            ${editable ? "hover:scale-110 hover:bg-green-400 hover:cursor-pointer" : ""}
            ${appointment.active ? "bg-green-400/40" : "bg-neutral-400/40"} `}
            onClick={() => {
              editable && handleState(appointment);
            }}
          >
            <span>{timeInStringFromMinutes(appointment.startTime!.toString())}</span>-
            <span>{timeInStringFromMinutes(appointment.endTime!.toString())}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentsDayList;
