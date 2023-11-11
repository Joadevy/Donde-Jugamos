import {
  SPORT_CENTER_PENDING,
  type SportCentersWithCourtsAndAppointments,
} from "@/backend/db/models/sportsCenters";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

import {Separator} from "../ui/separator";

interface Iprops {
  sportCenter: SportCentersWithCourtsAndAppointments;
}

function SportCenterWrapper({sportCenter}: Iprops) {
  return (
    <Card className="relative w-[300px] lg:w-[400px] h-[350px] flex flex-col">
      <CardHeader>
        <CardTitle>{sportCenter.name}</CardTitle>
        <CardDescription>{sportCenter.description}</CardDescription>
        <Separator />
      </CardHeader>

      <CardContent className="space-y-2 flex-auto flex items-center justify-center">
        {sportCenter.state === SPORT_CENTER_PENDING ? (
          <div className="text-neutral-500 text-xl font-medium">Pendiente de confirmación..</div>
        ) : (
          <div>algun dato..</div>
        )}
      </CardContent>
    </Card>
  );
}

export default SportCenterWrapper;
