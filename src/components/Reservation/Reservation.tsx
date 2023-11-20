import type {Appointment, Court} from "@prisma/client";
import type {SportCenterInformation} from "./ReservationClip";

import {BadgeDollarSign, CalendarDays, Clock4, LandPlot, MapPinned} from "lucide-react";

import {
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {timeInStringFromMinutes} from "@/lib/utils/utils";

import CopyToClipboard from "../CopyClipboard/CopyClipboard";
import {Tabs, TabsList, TabsContent, TabsTrigger} from "../ui/tabs";
import {Separator} from "../ui/separator";
import {Input} from "../ui/input";

import ReserveInformation from "./ReserveInformation";
import ReserveForm from "./ReserveForm";

interface Iprops {
  appointment: Appointment;
  court: Court;
  sportCenterInfo: SportCenterInformation;
}

function Reservation({appointment, court, sportCenterInfo}: Iprops) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader className="space-y-1">
        <AlertDialogTitle className="mb-2">
          Reserva tu turno en {sportCenterInfo.name}
        </AlertDialogTitle>

        <div className="flex flex-col justify-center gap-2 text-slate-500 text-sm">
          <ReserveInformation
            details={`${sportCenterInfo.address}, ${sportCenterInfo.cityName}`}
            name="Direccion"
          >
            <MapPinned color="green" size={20} />
          </ReserveInformation>

          <Separator />

          <ReserveInformation details={court.name} name="Cancha">
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
            name={sportCenterInfo.acceptPartialPayment ? "Precio total" : "Precio"}
          >
            <BadgeDollarSign color="green" size={20} />
          </ReserveInformation>

          {sportCenterInfo.acceptPartialPayment ? (
            <>
              <Separator />

              <ReserveInformation
                details={Number(
                  (court.price * sportCenterInfo.partialPaymentPercentage) / 100,
                ).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
                name="Pago por adelantado"
              >
                <BadgeDollarSign color="green" size={20} />
              </ReserveInformation>
            </>
          ) : null}

          <Separator />

          {sportCenterInfo.acceptPartialPayment &&
          (sportCenterInfo.Alias || sportCenterInfo.CBU) ? (
            <div className="flex flex-col mt-1">
              <Tabs className="space-y-0 flex flex-col" defaultValue="CBU">
                <TabsList className="grid self-center mb-1 w-3/4 grid-cols-2 h-7">
                  <TabsTrigger className="h-5 text-sm" value="CBU">
                    CBU
                  </TabsTrigger>
                  <TabsTrigger className="h-5 text-sm" value="Alias">
                    Alias
                  </TabsTrigger>
                </TabsList>

                <TabsContent className="-mt-0 flex self-center w-3/4 justify-evenly" value="CBU">
                  <Input readOnly className="w-3/4" value={sportCenterInfo.CBU ?? ""} />
                  <CopyToClipboard value={sportCenterInfo.CBU ?? ""} />
                </TabsContent>

                <TabsContent className="-mt-0 flex self-center w-3/4 justify-evenly" value="Alias">
                  <Input readOnly className="w-3/4" value={sportCenterInfo.Alias ?? ""} />
                  <CopyToClipboard value={sportCenterInfo.Alias ?? ""} />
                </TabsContent>
              </Tabs>
            </div>
          ) : null}
        </div>
      </AlertDialogHeader>

      <ReserveForm appointmentId={appointment.id} sportCenterInfo={sportCenterInfo} />
    </AlertDialogContent>
  );
}

export default Reservation;
