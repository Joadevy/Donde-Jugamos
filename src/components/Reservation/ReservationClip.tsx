/* eslint-disable @typescript-eslint/no-confusing-void-expression */
"use client";
import type {Appointment, Court} from "@prisma/client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {timeInStringFromMinutes} from "@/lib/utils/utils";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";

import {Badge} from "../ui/badge";
import {Separator} from "../ui/separator";

import ReservationForm from "./ReservationForm";

export interface SportCenterInformation {
  name: string;
  description: string | null;
  address: string;
  phone: string;
  email: string;
  paymentTimeLimit: number;
  cancelTimeLimit: number;
}

interface Iprops {
  appointment: Appointment;
  court: Court;
  sportCenterInfo: SportCenterInformation;
}

function ReservationClip({appointment, court, sportCenterInfo}: Iprops) {
  const timeInString = timeInStringFromMinutes(String(appointment.startTime));

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Badge className="hover:cursor-pointer" role="button" variant="default">
          <HoverCard>
            <HoverCardTrigger> {timeInString} hs</HoverCardTrigger>
            <HoverCardContent>
              <div className="space-y-1">
                <div className="flex h-5 justify-between space-x-10 text-sm">
                  <p>Cancha {court.id}</p>
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
        </Badge>
      </AlertDialogTrigger>

      <ReservationForm appointment={appointment} court={court} sportCenterInfo={sportCenterInfo} />
    </AlertDialog>
  );
}

export default ReservationClip;
