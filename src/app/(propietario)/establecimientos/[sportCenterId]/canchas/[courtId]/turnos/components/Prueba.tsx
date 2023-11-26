/* eslint-disable react/function-component-definition */
import type {FC} from "react";
import type {AppointmentDTO} from "./GenerateAppointmentsClient";

import React from "react";
import {format} from "date-fns";
import {es} from "date-fns/locale";

import {capitalize} from "@/lib/utils/utils";

interface PruebaProps {
  date: number;
  appointments?: AppointmentDTO[];
  updateState: (day: number, appointments: AppointmentDTO[]) => void;
}

const HOURS_OF_DAY: number[] = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

const Prueba: FC<PruebaProps> = ({date, appointments, updateState}) => {
  if (!appointments) return false;

  const openTime = appointments[0].startTime / 60;

  const handleState = (appointment: AppointmentDTO) => {
    appointment.active = !appointment.active;
    updateState(date, [...appointments]);
  };

  return (
    <div>
      <div>
        {" "}
        {capitalize(
          format(new Date(date), "eeee d/M/yy", {
            locale: es,
          }),
        )}
      </div>
      <div className="flex">
        {HOURS_OF_DAY.filter((hour) => hour >= openTime).map((hour, index) => (
          <div key={index}>
            <div className="w-12 p-2 text-center border">{hour}</div>
            <div className="w-12 p-2 border" />
          </div>
        ))}
      </div>
      <div className="flex ">
        {appointments.map((app, index) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <div
            key={index}
            className={`w-[72px] p-2 rounded-md border hover:cursor-pointer hover:bg-green-200  ${
              app.active ? "bg-green-600" : "bg-neutral-200"
            }`}
            onClick={() => {
              handleState(app);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Prueba;
