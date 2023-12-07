import type {ReservationFullInfoWithUser} from "@/backend/db/models/reservations";

import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {timeInStringFromMinutes, turnStateToSpanish} from "@/lib/utils/utils";
import {Separator} from "@/components/ui/separator";

import {AlertConfirmReservation, AlertRejectReservation} from "./AlertChangeState";
import PaymentConfirmationThumbnail from "./PaymentConfirmation";

interface ReservationCardProps {
  reservation: ReservationFullInfoWithUser;
}

function ReservationCard({reservation}: ReservationCardProps): JSX.Element {
  return (
    <Card className="w-[350px] lg:w-[400px] h-[400px] relative">
      <CardHeader>
        <CardTitle>
          {new Date(reservation.appointment.date).toLocaleString("es-AR", {
            day: "numeric",
            month: "numeric",
            year: "numeric",
          })}
          , {timeInStringFromMinutes(String(reservation.appointment.startTime))}-
          {timeInStringFromMinutes(String(reservation.appointment.endTime))}
        </CardTitle>
        <Separator />

        <CardContent className="p-0">
          <div className="flex justify-between">
            <p>Fecha de solicitud</p>
            <span className="font-semibold">
              {new Date(reservation.date).toLocaleString("es-AR", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
              })}
            </span>
          </div>
          <Separator />

          <div className="flex justify-between">
            <p>Cancha</p>
            <span className="font-semibold">{reservation.appointment.court.name}</span>
          </div>
          <Separator />

          <div className="flex justify-between">
            <p>Precio</p>
            <span className="font-semibold">
              {reservation.appointment.court.price.toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })}
            </span>
          </div>

          <Separator />

          <div className="flex justify-between">
            <p>Estado</p>
            <span className="font-semibold">{turnStateToSpanish(reservation.state)}</span>
          </div>

          <Separator />

          <div className="flex justify-between">
            <p>Cliente</p>
            <span className="font-semibold">{reservation.user.name}</span>
          </div>

          <Separator />

          <div className="flex justify-between">
            <p>Email</p>
            <span className="font-semibold">{reservation.user.email}</span>
          </div>

          <Separator />

          <div className="flex justify-between">
            <p>Observacion</p>
            <span
              className={
                "font-semibold " +
                (reservation.observation ? "w-2/3 px-2 h-[70px] overflow-auto" : "")
              }
            >
              {reservation.observation ?? "-"}
            </span>
          </div>

          <Separator />

          {reservation.paymentConfirmation ? (
            <div className="flex justify-between">
              <p>Comprobante de pago</p>
              <span className="font-semibold">
                <PaymentConfirmationThumbnail
                  paymentConfirmation={reservation.paymentConfirmation}
                />
              </span>
            </div>
          ) : null}
        </CardContent>

        <CardFooter className="flex gap-2 items-center absolute bottom-0 left-0">
          <AlertConfirmReservation reservationId={reservation.id} />
          <AlertRejectReservation reservationId={reservation.id} />
        </CardFooter>
      </CardHeader>
    </Card>
  );
}

export default ReservationCard;
