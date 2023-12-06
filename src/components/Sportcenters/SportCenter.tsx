import type {SportCentersWithCourtsAndAppointments} from "@/backend/db/models/sportsCenters";
import type {SportCenterInformation} from "../Reservation/ReservationClip";

import {CircleDollarSign, Mail, MapPin, Phone} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";

import {buttonVariants} from "../ui/button";
import ReservationClip from "../Reservation/ReservationClip";
import {Separator} from "../ui/separator";

import Information from "./Information";

interface Iprops {
  sportCenter: SportCentersWithCourtsAndAppointments;
}

function SportCenter({sportCenter}: Iprops) {
  const startPrice = Number(
    sportCenter.courts.reduce((prev, current) => {
      return prev.price < current.price ? prev : current;
    }).price,
  );

  const SportCenterInfo: SportCenterInformation = {
    name: sportCenter.name,
    description: sportCenter.description,
    address: sportCenter.address,
    phone: sportCenter.phone,
    email: sportCenter.email,
    paymentTimeLimit: sportCenter.paymentTimeLimit,
    cancelTimeLimit: sportCenter.cancelTimeLimit,
    acceptPartialPayment: sportCenter.acceptPartialPayment,
    CBU: sportCenter.CBU,
    Alias: sportCenter.Alias,
    partialPaymentPercentage: sportCenter.partialPaymentPercentage,
    cityName: sportCenter.city.name,
  };

  return (
    <li>
      <Tabs className="space-y-0" defaultValue="sportcenter">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sportcenter">Establecimiento</TabsTrigger>
          <TabsTrigger value="reservation">Reservar</TabsTrigger>
        </TabsList>
        <TabsContent value="sportcenter">
          <Card className=" w-[300px] lg:w-[400px] h-[350px] relative">
            <CardHeader>
              <CardTitle>{sportCenter.name}</CardTitle>
              <CardDescription>{sportCenter.description}</CardDescription>
              <Separator />
            </CardHeader>

            <CardContent className="space-y-2">
              <Information>
                <CircleDollarSign color="green" size={20} />
                <p>
                  Desde{" "}
                  {startPrice.toLocaleString("es-AR", {
                    style: "currency",
                    currency: "ARS",
                  })}
                </p>
              </Information>

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
            <CardFooter>
              <TabsList className="absolute bottom-4 left-5">
                <TabsTrigger className={buttonVariants({variant: "default"})} value="reservation">
                  Iniciar Reserva
                </TabsTrigger>
              </TabsList>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="reservation">
          <Card className=" w-[300px] lg:w-[400px] h-[350px]">
            <CardHeader>
              <CardTitle>Inicia tu reserva</CardTitle>
              <CardDescription>Elige el turno y la cancha que desees... y a jugar!</CardDescription>
              <Separator />
            </CardHeader>

            <CardContent className="space-x-2">
              {sportCenter.courts.map((court) =>
                court.appointments.map((appointment) => (
                  <ReservationClip
                    key={appointment.id}
                    appointment={appointment}
                    court={court}
                    sportCenterInfo={SportCenterInfo}
                  />
                )),
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </li>
  );
}

export default SportCenter;
