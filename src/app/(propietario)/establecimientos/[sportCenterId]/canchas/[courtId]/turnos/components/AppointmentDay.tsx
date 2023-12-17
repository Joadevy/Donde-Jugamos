import type {AppointmentViewSchedule} from "../../page";

import {cn, timeInStringFromMinutes} from "@/lib/utils/utils";

interface AppointmentDayProps {
  appointment: AppointmentViewSchedule;
}

export default function AppointmentDay({appointment}: AppointmentDayProps) {
  const color = !appointment.active
    ? "bg-neutral-400/40"
    : appointment.reservationState === "approved"
    ? "bg-blue-400/40"
    : appointment.reservationState === "pending"
    ? "bg-yellow-400/40"
    : "bg-green-400/40";

  return (
    <div
      key={appointment.startTime + appointment.endTime}
      className={cn(`w-auto p-1 border flex rounded-md select-none`, color)}
    >
      <span>{timeInStringFromMinutes(appointment.startTime.toString())}</span>-
      <span>{timeInStringFromMinutes(appointment.endTime.toString())}</span>
    </div>
  );
}
