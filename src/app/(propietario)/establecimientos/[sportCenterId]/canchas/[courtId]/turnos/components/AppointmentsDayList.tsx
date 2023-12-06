/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/function-component-definition */
import type {FC} from "react";
import type {AppointmentDTO} from "./GenerateAppointmentsClient";

import React from "react";
import {format} from "date-fns";
import {es} from "date-fns/locale";

import {capitalize, timeInStringFromMinutes} from "@/lib/utils/utils";

interface AppointmentsDayListProps {
  date: number;
  appointments: AppointmentDTO[];
  updateState?: (day: number, appointments: AppointmentDTO[]) => void;
  editable?: boolean;
}

const AppointmentsDayList: FC<AppointmentsDayListProps> = ({
  date,
  appointments,
  updateState,
  editable,
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

  const handleState = (appointment: AppointmentDTO) => {
    appointment.active = !appointment.active;

    if (updateState) {
      updateState(date, [...appointments]);
    }
  };

  return (
    <div className="rounded-md">
      <header className="p-2 flex items-center gap-4">
        <div className="text-xl font-medium">
          {dayStr} de {monthStr}
        </div>
      </header>

      <div className="flex gap-2 p-2">
        {appointments.map((appointment) => (
          <div
            key={appointment.startTime + appointment.endTime}
            className={`w-28 p-2 border flex justify-between rounded-md select-none 
            ${editable ? "hover:scale-110 hover:bg-green-400 hover:cursor-pointer" : ""}
            ${appointment.active ? "bg-green-400/40" : "bg-neutral-400/40"} `}
            onClick={() => {
              editable && handleState(appointment);
            }}
          >
            <span>{timeInStringFromMinutes(appointment.startTime.toString())}</span>-
            <span>{timeInStringFromMinutes(appointment.endTime.toString())}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentsDayList;
