import type {ReservationFullInfo} from "@/backend/db/models/reservations";

import {BadgeDollarSign, CalendarDays, Clock4, LandPlot, Mail, MapPin, Phone} from "lucide-react";

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
import {timeInStringFromMinutes} from "@/lib/utils/utils";
import ReserveInformation from "@/components/Reservation/ReserveInformation";

import Information from "../Sportcenters/Information";
import EditReservation from "../Buttons/EditReservation";

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
        <Card className=" w-[300px] lg:w-[400px] h-[350px] relative">
          <CardHeader>
            <CardTitle>{reservation.appointment.court.sportCenter.name}</CardTitle>

            <Separator />
          </CardHeader>

          <CardContent className="space-y-2">
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
                  ? "Precio total: "
                  : "Precio: "
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
          </CardContent>

          <CardFooter>
            {reservation.appointment.court.sportCenter.acceptPartialPayment ? (
              <EditReservation reservation={reservation} />
            ) : null}
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="sportcenter">
        <Card className=" w-[300px] lg:w-[400px] h-[350px] relative">
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
