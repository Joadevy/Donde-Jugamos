import type {SportCentersWithCourtsAndAppointments} from "@/backend/db/models/sportsCenters";

import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Iprops {
  sportCenter: SportCentersWithCourtsAndAppointments;
  queryParams: URLSearchParams;
}

function SportCenter({sportCenter, queryParams}: Iprops) {
  return (
    <li className="hover:opacity-80 transition:opacity">
      <Link href={`/establecimiento/${sportCenter.id}?${queryParams.toString()}`}>
        <Card>
          <CardHeader>
            <CardTitle>{sportCenter.name}</CardTitle>
            <CardDescription>{sportCenter.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Direccion: {sportCenter.address}</p>
          </CardContent>
          <CardFooter className="flex flex-col ">
            <h3>Contactanos</h3>
            <p>{sportCenter.email}</p>
            <p>{sportCenter.phone}</p>
          </CardFooter>
        </Card>
      </Link>
    </li>
  );
}

export default SportCenter;
