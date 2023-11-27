import type {CourtFullInfo} from "@/backend/db/models/courts";

import {CircleDollarSign, Dumbbell, Mail, MapPin, PersonStanding, Phone} from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {Button} from "../ui/button";
import Information from "../Sportcenters/Information";
import CourtInformation from "../Reservation/ReserveInformation";
import {Separator} from "../ui/separator";

interface Iprops {
  court: CourtFullInfo;
  className?: string;
}

export function CourtCard({court, className}: Iprops) {
  return (
    <Card className={className + " w-[300px] h-[300px] relative"}>
      <CardHeader className="flex-auto space-y-0">
        <CardTitle>Cancha {court.name}</CardTitle>
        <CardDescription className="overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:5]">
          {court.description}
        </CardDescription>

        <Separator />
      </CardHeader>

      <CardContent className="space-y-2 flex-auto">
        <CourtInformation details={court.sport.name} name="Deporte">
          <Dumbbell color="green" size={20} />
        </CourtInformation>

        <CourtInformation details={String(court.capacity)} name="Capacidad">
          <PersonStanding color="green" size={20} />
        </CourtInformation>

        <CourtInformation details={`$${court.price}`} name="Precio">
          <CircleDollarSign color="green" size={20} />
        </CourtInformation>
      </CardContent>
      <CardFooter className="absolute bottom-0 w-full">
        <Link
          className="w-full"
          href={`/establecimientos/${court.sportCenterId}/canchas/${court.id}`}
        >
          <Button className="w-full">Administrar</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
