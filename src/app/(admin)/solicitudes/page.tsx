import React from "react";
import {CircleDollarSign, Mail, MapPin, Phone} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {SPORT_CENTER_PENDING, getSportCentersByState} from "@/backend/db/models/sportsCenters";
import Information from "@/components/Sportcenters/Information";
import {Button} from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";
import {Textarea} from "@/components/ui/textarea";

const page = async () => {
  const sportCenters = (await getSportCentersByState(SPORT_CENTER_PENDING)) || [];

  if (!sportCenters.length) return <div>No hay solicitudes de alta</div>;

  return (
    <div className="container mx-auto flex flex-wrap gap-2 py-4">
      {sportCenters.map((sportCenter) => (
        <Card key={sportCenter.id} className=" w-[300px] lg:w-[400px] h-[350px] flex flex-col">
          <CardHeader className="flex-auto">
            <CardTitle>{sportCenter.name}</CardTitle>
            <CardDescription className="overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:5]">
              {sportCenter.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-2">
            <Information>
              <MapPin color="green" size={20} />
              <p>{sportCenter.address}</p>
            </Information>

            <Information>
              <Phone color="green" size={20} />
              <p>{sportCenter.phone}</p>
            </Information>

            <Information>
              <Mail color="green" size={20} />
              <p>{sportCenter.email}</p>
            </Information>
          </CardContent>
          <CardFooter className="mt-auto flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Rechazar</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Motivo de Rechazo</AlertDialogTitle>
                  <AlertDialogDescription>
                    Breve detalle del motivo por el cual se rechazo la solicitud.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <Textarea placeholder="Escriba un motivo..." />

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button>Aceptar</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default page;
