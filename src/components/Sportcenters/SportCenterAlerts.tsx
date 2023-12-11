/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import type {ChangeEvent, FC} from "react";
import type {SportCenter} from "@prisma/client";

import {useState} from "react";
import {useRouter} from "next/navigation";

import {SPORT_CENTER_APPROVED, SPORT_CENTER_REJECTED} from "@/backend/db/models/sportsCenters";
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
} from "../ui/alert-dialog";
import {Button} from "../ui/button";
import {Textarea} from "../ui/textarea";

interface SportCenterDenyAlertProps {
  sportCenterId: number;
  title?: string;
}

// eslint-disable-next-line react/function-component-definition
export const SportCenterDenyAlert: FC<SportCenterDenyAlertProps> = ({sportCenterId, title}) => {
  const [reason, setReason] = useState("");
  const router = useRouter();

  const handleValueChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setReason(event.target.value);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">{title ?? `Rechazar`}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Motivo de Rechazo</AlertDialogTitle>
          <AlertDialogDescription>
            Breve detalle del motivo por el cual se rechazo la solicitud.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Textarea
          defaultValue={reason}
          placeholder="Escriba un motivo..."
          onChange={handleValueChange}
        />

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setReason("");
            }}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            role="button"
            onClick={() =>
              handleChangeState(sportCenterId, SPORT_CENTER_REJECTED, reason, () => {
                router.refresh();
              })
            }
          >
            {title ?? `Rechazar`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface SportCenterDisableAlertProps {
  sportCenterId: number;
  sportCenterName: string;
  title: string;
}

export function SportCenterDisableAlert({
  sportCenterId,
  sportCenterName,
  title,
}: SportCenterDisableAlertProps) {
  const router = useRouter();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">{title}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Esta seguro que quiere deshabilitar el establecimiento{" "}
            <strong>{sportCenterName}</strong>?
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            role="button"
            onClick={() =>
              handleChangeActive(sportCenterId, false, () => {
                router.refresh();
              })
            }
          >
            {title}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface SportCenterEnableAlertProps {
  sportCenterId: number;
  sportCenterName: string;
  title: string;
}

export function SportCenterEnableAlert({
  sportCenterId,
  sportCenterName,
  title,
}: SportCenterDisableAlertProps) {
  const router = useRouter();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="default">{title}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Esta seguro que quiere habilitar el establecimiento{" "}
            <strong>{sportCenterName}</strong>?
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            role="button"
            onClick={() =>
              handleChangeActive(sportCenterId, true, () => {
                router.refresh();
              })
            }
          >
            {title}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface SportCenterConfirmAlertProps {
  sportCenterId: number;
  sportCenterName: string;
  title?: string;
  description?: string;
}

// eslint-disable-next-line react/function-component-definition
export const SportCenterConfirmAlert: FC<SportCenterConfirmAlertProps> = ({
  sportCenterId,
  sportCenterName,
  title,
}) => {
  const router = useRouter();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>{title ?? `Aprobar`}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Esta seguro que quiere habilitar el establecimiento <strong>{sportCenterName}</strong>?
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            role="button"
            onClick={() =>
              handleChangeState(sportCenterId, SPORT_CENTER_APPROVED, "", () => {
                router.refresh();
              })
            }
          >
            {title ?? `Aprobar`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const handleChangeState = async (
  sportCenterId: number,
  state: string,
  reason: string,
  onSuccess: () => void,
) => {
  const res: {data: SportCenter; status: number; message: string} = await fetch(
    `/api/sportcenter/${sportCenterId}`,
    {
      method: "PUT",
      body: JSON.stringify({state, reason}),
      headers: {"Content-Type": "application/json"},
    },
  )
    .then((data) => data.json())
    .catch(() => errorToast("No se pudo realizar la operacion. Intentelo nuevamente"));

  if (res.status === 200) {
    onSuccess();
    successToast(res.message);
  } else {
    errorToast(res.message);
  }
};

const handleChangeActive = async (
  sportCenterId: number,
  active: boolean,
  onSuccess: () => void,
) => {
  const res: {data: SportCenter; status: number; message: string} = await fetch(
    `/api/sportcenter/${sportCenterId}`,
    {
      method: "PATCH",
      body: JSON.stringify({active}),
      headers: {"Content-Type": "application/json"},
    },
  )
    .then((data) => data.json())
    .catch(() => errorToast("No se pudo realizar la operacion. Intentelo nuevamente"));

  if (res.status === 200) {
    onSuccess();
    successToast(res.message);
  } else {
    errorToast(res.message);
  }
};
