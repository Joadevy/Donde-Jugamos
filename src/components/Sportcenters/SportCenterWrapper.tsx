import type {FC, ReactElement} from "react";
import type {SportCenter} from "@prisma/client";

import {Mail, MapPin, Phone} from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {cn} from "@/lib/utils/utils";
import {SPORT_CENTER_REJECTED} from "@/backend/db/models/sportsCenters";

import {Button} from "../ui/button";

import Information from "./Information";

interface SportCenterWrapperProps {
  title: string;
  description: string;
  className?: string;
  children?: ReactElement;
}

interface SportCentePendingProps {
  title: string;
  description: string;
  state?: string;
  className?: string;
}

interface SportCenterProps {
  sportCenter: SportCenter;
  className?: string;
}

// eslint-disable-next-line react/function-component-definition
export const SportCenterWrapper: FC<SportCenterWrapperProps> = ({
  title,
  description,
  className,
  children,
}) => {
  return (
    <Card className={cn("relative flex flex-col", className)}>
      <CardHeader className="flex-auto">
        <CardTitle>{title}</CardTitle>
        <CardDescription className="overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:5]">
          {description}
        </CardDescription>
      </CardHeader>
      {children}
    </Card>
  );
};

// eslint-disable-next-line react/function-component-definition
export const SportCenterPending: FC<SportCentePendingProps> = ({
  title,
  description,
  state,
  className,
}) => {
  return (
    <SportCenterWrapper className={className} description={description} title={title}>
      <CardContent className="space-y-2">
        {state === SPORT_CENTER_REJECTED ? (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center font-semibold text-xl text-neutral-500 rounded-md bg-red-300/20 drop-shadow-xl backdrop-blur-[1px] hover:shadow-xl cursor-default select-none">
            Rechazado
          </div>
        ) : (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center font-semibold text-xl text-neutral-500 rounded-md bg-neutral-300/20 drop-shadow-xl backdrop-blur-[1px] hover:shadow-xl cursor-default select-none">
            Pendiente de confirmación..
          </div>
        )}
      </CardContent>
    </SportCenterWrapper>
  );
};

// eslint-disable-next-line react/function-component-definition
export const SportCenterCard: FC<SportCenterProps> = ({sportCenter, className}) => {
  return (
    <SportCenterWrapper
      className={className}
      description={sportCenter.description!}
      title={sportCenter.name}
    >
      <>
        <CardContent className="space-y-2 flex-auto">
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
          <Link className="w-full" href="/dashboard/generar-turnos">
            {/* <Link className="w-full" href={`/dashboard/${sportCenter.id}`}> */}
            <Button className="w-full">Administrar</Button>
          </Link>
        </CardFooter>
      </>
    </SportCenterWrapper>
  );
};
