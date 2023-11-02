import type {Appointment, Court} from "@prisma/client";
import type {SportCenterInformation} from "./ReservationClip";

import {BadgeDollarSign, CalendarDays, Clock4, LandPlot, MapPinned} from "lucide-react";

import {
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {timeInStringFromMinutes} from "@/lib/utils/utils";

import {Separator} from "../ui/separator";

import ReserveInformation from "./ReserveInformation";
import ReserveForm from "./ReserveForm";

interface Iprops {
  appointment: Appointment;
  court: Court;
  sportCenterInfo: SportCenterInformation;
}

function ReservationForm({appointment, court, sportCenterInfo}: Iprops) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader className="space-y-1">
        <AlertDialogTitle className="mb-2">
          Reserva tu turno en {sportCenterInfo.name}
        </AlertDialogTitle>

        <AlertDialogDescription className="flex flex-col justify-center gap-2">
          <ReserveInformation details={sportCenterInfo.address} name="Direccion">
            <MapPinned color="green" size={20} />
          </ReserveInformation>

          <Separator />

          <ReserveInformation details={court.id.toString()} name="Cancha">
            <LandPlot color="green" size={20} />
          </ReserveInformation>

          <Separator />

          <ReserveInformation
            details={new Date(appointment.date).toLocaleDateString("es-AR", {
              weekday: "short",
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}
            name="Fecha"
          >
            <CalendarDays color="green" size={20} />
          </ReserveInformation>

          <Separator />

          <ReserveInformation
            details={
              timeInStringFromMinutes(String(appointment.startTime)) +
              " - " +
              timeInStringFromMinutes(String(appointment.endTime))
            }
            name="Turno"
          >
            <Clock4 color="green" size={20} />
          </ReserveInformation>

          <Separator />

          <ReserveInformation
            details={Number(court.price).toLocaleString("es-AR", {
              style: "currency",
              currency: "ARS",
            })}
            name="Precio"
          >
            <BadgeDollarSign color="green" size={20} />
          </ReserveInformation>

          <Separator />
        </AlertDialogDescription>
      </AlertDialogHeader>

      <ReserveForm className="" />
    </AlertDialogContent>
  );
}

export default ReservationForm;
