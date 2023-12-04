"use client";
/* eslint-disable @typescript-eslint/no-misused-promises */

import type {FC} from "react";

import {useRouter} from "next/navigation";

import {errorToast, successToast} from "@/lib/utils/toasts";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../ui/alert-dialog";
import {Button} from "../../ui/button";
import {Textarea} from "../../ui/textarea";

const handleOnClick = async (reservationId: number, state: string) => {
  const res: {
    status: number;
    message: string;
  } = await fetch(`/api/propietary/reservation`, {
    method: "PUT",
    body: JSON.stringify({state, reservationId}),
    headers: {"Content-Type": "application/json"},
  })
    .then((data) => data.json())
    .catch(() => errorToast("No se pudo realizar la operacion. Intentelo nuevamente"));

  if (res.status === 200) {
    successToast(res.message);
  } else {
    errorToast(res.message);
  }
};

interface ReservationDenyAlertProps {
  reservationId: number;
}

// eslint-disable-next-line react/function-component-definition
export const AlertRejectReservation: FC<ReservationDenyAlertProps> = ({reservationId}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Rechazar</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Esta seguro de rechazar la solicitud de turno?</AlertDialogTitle>
          <AlertDialogDescription>
            El usuario recibira una notificacion de que su solicitud fue rechazada.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction role="button" onClick={() => handleOnClick(reservationId, "rejected")}>
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface ReservationConfirmAlertProps {
  reservationId: number;
}

// eslint-disable-next-line react/function-component-definition
export const AlertConfirmReservation: FC<ReservationConfirmAlertProps> = ({reservationId}) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="default">Aprobar</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Esta seguro de aprobar la solicitud de turno?</AlertDialogTitle>
          <AlertDialogDescription>
            El usuario recibira una notificacion de que su solicitud fue aprobada.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction role="button" onClick={() => handleOnClick(reservationId, "approved")}>
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
