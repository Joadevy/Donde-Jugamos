/* eslint-disable @typescript-eslint/no-confusing-void-expression */
"use client";
import type {Appointment, Court} from "@prisma/client";

import {timeInStringFromMinutes} from "@/lib/utils/utils";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card";

import {Badge, badgeVariants} from "../ui/badge";
import {Separator} from "../ui/separator";
import {Button} from "../ui/button";

interface Iprops {
  appointment: Appointment;
  court: Court;
}

function AppointmentClip({appointment, court}: Iprops) {
  const timeInString = timeInStringFromMinutes(String(appointment.startTime));

  return (
    <Badge
      className="hover:cursor-pointer"
      role="button"
      variant="default"
      onClick={() => console.log("hi")}
    >
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
  );
}

export default AppointmentClip;
