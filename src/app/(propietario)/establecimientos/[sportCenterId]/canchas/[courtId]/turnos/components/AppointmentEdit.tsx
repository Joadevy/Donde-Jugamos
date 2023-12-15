/* eslint-disable react/function-component-definition */
"use client";

import type {Appointment} from "@prisma/client";
import type {ApiResponse} from "@/lib/types/importables/types";

import {useState, type FC, useRef} from "react";
import {useRouter} from "next/navigation";

import {Button} from "@/components/ui/button";
import {errorToast, successToast} from "@/lib/utils/toasts";

import AppointmentsDayList from "./AppointmentsDayList";

interface AppointmentEditProps {
  courtId: number;
  appointments: Record<number, Partial<Appointment>[]>;
}

const AppointmentEdit: FC<AppointmentEditProps> = ({appointments, courtId}) => {
  const [appointmentsUpdated, setAppointmentsUpdated] = useState(appointments);
  const appointmentsToUpdate = useRef<Partial<Appointment>[]>([]);
  const router = useRouter();

  const handleAppointmentChange = (appointmentChanged: Partial<Appointment>) => {
    const appointmentIndex = appointmentsToUpdate.current.findIndex(
      (app) => app.id === appointmentChanged.id,
    );

    if (appointmentIndex >= 0) {
      appointmentsToUpdate.current.splice(appointmentIndex, 1);
    } else {
      appointmentsToUpdate.current.push(appointmentChanged);
    }
  };

  const handleAppointmentChangeState = (
    day: number,
    appointmentsChanged: Partial<Appointment>[],
  ) => {
    appointments[day] = appointmentsChanged;
    setAppointmentsUpdated({...appointments});
  };

  const saveChanges = () => {
    const url = `/api/appointment/${courtId}`;

    fetch(url, {body: JSON.stringify(appointmentsToUpdate.current), method: "PUT"})
      .then((res) => res.json())
      .then((res: ApiResponse) => {
        if (res.status === 200) {
          successToast("Los turnos se modificaron con exito!");
          router.push(`../../${courtId}`);
        } else throw Error(res.message);
      })
      .catch(() => {
        errorToast("No se pudo procesar tu solicitud, intente nuevamente");
      });
  };

  return (
    <div>
      {Object.keys(appointmentsUpdated).map((value) => (
        <AppointmentsDayList
          key={Number(value)}
          editable
          appointments={appointments[Number(value)]}
          date={Number(value)}
          updateAppointment={handleAppointmentChange}
          updateState={handleAppointmentChangeState}
        />
      ))}
      <Button onClick={saveChanges}>Guardar</Button>
    </div>
  );
};

export default AppointmentEdit;
