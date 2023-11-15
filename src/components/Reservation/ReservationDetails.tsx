import type {ReservationFullInfo} from "@/backend/db/models/reservations";

import {
  AlertCircle,
  BadgeDollarSign,
  CalendarDays,
  Clock4,
  Dumbbell,
  LandPlot,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Separator} from "@/components/ui/separator";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {isPossibleToCancel, timeInStringFromMinutes} from "@/lib/utils/utils";
import ReserveInformation from "@/components/Reservation/ReserveInformation";

import Information from "../Sportcenters/Information";
import EditReservation from "../Buttons/EditReservation";
import HoverInfo from "../Information/HoverInfo";
import CancelReservationBtn from "../Buttons/CancelReservation";

interface Iprops {
  reservation: ReservationFullInfo;
}

function ReservationDetails({reservation}: Iprops) {
  return (
    <Tabs className="space-y-0" defaultValue="reservation">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="reservation">Reserva</TabsTrigger>
        <TabsTrigger value="sportcenter">Establecimiento</TabsTrigger>
      </TabsList>
      <TabsContent value="reservation">
        <Card className="w-[300px] lg:w-[400px] h-[420px] lg:h-[400px] relative">
          <CardHeader>
            <CardTitle>{reservation.appointment.court.sportCenter.name}</CardTitle>

            <Separator />
          </CardHeader>

          <CardContent className="space-y-2">
            <ReserveInformation
              details={String(reservation.appointment.court.sport.name)}
              name="Deporte"
            >
              <Dumbbell color="green" size={20} />
            </ReserveInformation>

            <ReserveInformation details={String(reservation.appointment.court.id)} name="Cancha">
              <LandPlot color="green" size={20} />
            </ReserveInformation>

            <ReserveInformation
              details={new Date(reservation.appointment.date).toLocaleDateString("es-AR", {
                weekday: "short",
                year: "numeric",
                month: "numeric",
                day: "numeric",
              })}
              name="Fecha"
            >
              <CalendarDays color="green" size={20} />
            </ReserveInformation>

            <ReserveInformation
              details={
                timeInStringFromMinutes(String(reservation.appointment.startTime)) +
                " - " +
                timeInStringFromMinutes(String(reservation.appointment.endTime))
              }
              name="Turno"
            >
              <Clock4 color="green" size={20} />
            </ReserveInformation>

            <ReserveInformation
              details={Number(reservation.appointment.court.price).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })}
              name={
                reservation.appointment.court.sportCenter.acceptPartialPayment
                  ? "Precio total"
                  : "Precio"
              }
            >
              <BadgeDollarSign color="green" size={20} />
            </ReserveInformation>

            {reservation.appointment.court.sportCenter.acceptPartialPayment ? (
              <ReserveInformation
                details={Number(
                  (reservation.appointment.court.price *
                    reservation.appointment.court.sportCenter.partialPaymentPercentage) /
                    100,
                ).toLocaleString("es-AR", {
                  style: "currency",
                  currency: "ARS",
                })}
                name="Pago por adelantado"
              >
                <BadgeDollarSign color="green" size={20} />
              </ReserveInformation>
            ) : null}

            <ReserveInformation
              details={
                reservation.state == "approved"
                  ? "Aprobada"
                  : reservation.state == "pending"
                  ? "Pendiente"
                  : reservation.state == "cancelled"
                  ? "Cancelada"
                  : reservation.state == "rejected"
                  ? "Rechazada"
                  : ""
              }
              name="Estado"
            >
              <AlertCircle color="green" size={20} />
            </ReserveInformation>
          </CardContent>

          <Separator />

          <CardFooter className="p-2 flex justify-between items-center gap-2 mt-4">
            {["approved", "pending"].includes(reservation.state ?? "") &&
            reservation.appointment.court.sportCenter.acceptPartialPayment ? (
              <EditReservation reservation={reservation} />
            ) : null}

            {!["approved", "pending"].includes(reservation.state ?? "") ? (
              <>
                <p>
                  La reserva ha sido{" "}
                  {reservation.state == "cancelled"
                    ? "cancelada."
                    : "rechazada por el establecimiento."}
                </p>
                <HoverInfo
                  color="red"
                  description={`La reserva ha sido ${
                    reservation.state == "cancelled"
                      ? "cancelada. Comunicate con el establecimiento ante cualquier duda"
                      : "rechazada por el establecimiento. Comunicate con el mismo para mas informacion"
                  }`}
                  title={`Reserva ${reservation.state == "cancelled" ? "cancelada" : "rechazada"}`}
                />
              </>
            ) : isPossibleToCancel(
                reservation.appointment.date,
                reservation.appointment.court.sportCenter.cancelTimeLimit,
              ) ? (
              <CancelReservationBtn reservation={reservation} />
            ) : (
              <>
                <p>La reserva no puede cancelarse</p>
                <HoverInfo
                  color="red"
                  description="Has superado el tiempo limite para cancelar la reserva"
                  title="La reserva no puede cancelarse"
                />
              </>
            )}
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="sportcenter">
        <Card className="w-[300px] lg:w-[400px] h-[420px] lg:h-[400px] relative">
          <CardHeader>
            <CardTitle>{reservation.appointment.court.sportCenter.name}</CardTitle>
            <CardDescription>
              {reservation.appointment.court.sportCenter.description}
            </CardDescription>
            <Separator />
          </CardHeader>

          <CardContent className="space-y-2">
            <Information>
              <MapPin color="green" size={20} />
              <p>{`${reservation.appointment.court.sportCenter.address}, ${reservation.appointment.court.sportCenter.city.name}`}</p>
            </Information>

            <Information>
              <Phone color="green" size={20} />
              <p>{reservation.appointment.court.sportCenter.phone}</p>
            </Information>

            <Information>
              <Mail color="green" size={20} />
              <p>{reservation.appointment.court.sportCenter.email}</p>
            </Information>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

export default ReservationDetails;
