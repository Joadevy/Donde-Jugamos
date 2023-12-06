/* eslint-disable @next/next/no-async-client-component */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import type {Appointment, City, Court, SportCenter, User} from "@prisma/client";

import {getServerSession} from "next-auth";

import {AlertDialog, AlertDialogTrigger} from "@/components/ui/alert-dialog";
import {timeInStringFromMinutes} from "@/lib/utils/utils";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";

import {Badge} from "../ui/badge";
import {Separator} from "../ui/separator";
import SignInClip from "../Buttons/SignInClip";

import Reservation from "./Reservation";

interface CityWithName {
  cityName: City["name"];
}

export type SportCenterInformation = Pick<
  SportCenter,
  | "name"
  | "description"
  | "address"
  | "phone"
  | "email"
  | "paymentTimeLimit"
  | "cancelTimeLimit"
  | "acceptPartialPayment"
  | "partialPaymentPercentage"
  | "CBU"
  | "Alias"
> &
  CityWithName;

interface Iprops {
  appointment: Appointment;
  court: Court;
  sportCenterInfo: SportCenterInformation;
}

interface IhoverCard {
  timeInString: string;
  court: Court;
}

// Esto deberia estar en un archivo aparte pero como se usa solo aca, quedo.
function CourtHoverCard({timeInString, court}: IhoverCard) {
  return (
    <HoverCard>
      <HoverCardTrigger> {timeInString} hs</HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-1">
          <div className="flex h-5 justify-between space-x-10 text-sm">
            <p className="flex gap-1 border">
              Cancha <span>{court.name}</span>
            </p>
            <Separator orientation="vertical" />
            <p>
              {Number(court.price).toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })}
            </p>
          </div>

          <Separator />

          <p className="font-normal text-slate-700">{court.description}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

// La idea es que si no inicio sesion, lo redirecciona a iniciar sesion y sino le muestra el que corresponde
async function ReservationClip({appointment, court, sportCenterInfo}: Iprops) {
  const timeInString = timeInStringFromMinutes(String(appointment.startTime));
  const session = await getServerSession(authOptions);

  return session?.user ? (
    <AlertDialog>
      <AlertDialogTrigger>
        <Badge className="hover:cursor-pointer" role="button" variant="default">
          <CourtHoverCard court={court} timeInString={timeInString} />
        </Badge>
      </AlertDialogTrigger>

      <Reservation appointment={appointment} court={court} sportCenterInfo={sportCenterInfo} />
    </AlertDialog>
  ) : (
    <SignInClip>
      <CourtHoverCard court={court} timeInString={timeInString} />
    </SignInClip>
  );
}

export default ReservationClip;
