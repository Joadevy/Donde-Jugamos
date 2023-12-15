/* eslint-disable react/function-component-definition */
import type {Appointment} from "@prisma/client";
import type {FC} from "react";

import {timeInStringFromMinutes} from "@/lib/utils/utils";

interface AppointmentDayProps {
  appointment: Omit<Appointment, "id" | "date" | "courtId">;
}

const AppointmentDay: FC<AppointmentDayProps> = ({appointment}) => {
  return (
    <div
      key={appointment.startTime + appointment.endTime}
      className={`w-28 p-2 border flex justify-between rounded-md select-none 
            ${appointment.active ? "bg-green-400/40" : "bg-neutral-400/40"} `}
    >
      <span>{timeInStringFromMinutes(appointment.startTime.toString())}</span>-
      <span>{timeInStringFromMinutes(appointment.endTime.toString())}</span>
    </div>
  );
};

export default AppointmentDay;
