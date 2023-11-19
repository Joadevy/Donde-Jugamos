import React from "react";
import {Mail, MapPin, Phone} from "lucide-react";

import {CardContent, CardFooter} from "@/components/ui/card";
import {SPORT_CENTER_PENDING, getSportCentersByState} from "@/backend/db/models/sportsCenters";
import Information from "@/components/Sportcenters/Information";
import {
  SportCenterConfirmAlert,
  SportCenterDenyAlert,
} from "@/components/Sportcenters/SportCenterAlerts";
import {SportCenterWrapper} from "@/components/Sportcenters/SportCenterWrapper";

const SolicitudesPage = async () => {
  const sportCenters = (await getSportCentersByState(SPORT_CENTER_PENDING)) || [];

  if (!sportCenters.length) return <div>No hay solicitudes de alta</div>;

  return (
    <div className="container mx-auto flex items-start justify-start flex-wrap gap-2 py-4">
      {sportCenters.map((sportCenter) => (
        <SportCenterWrapper
          key={sportCenter.id}
          className=" w-[300px] lg:w-[400px] h-[350px] flex-1 flex flex-col"
          description={sportCenter.description!}
          title={sportCenter.name}
        >
          <>
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
              <SportCenterDenyAlert sportCenterId={sportCenter.id} />
              <SportCenterConfirmAlert
                sportCenterId={sportCenter.id}
                sportCenterName={sportCenter.name}
              />
            </CardFooter>
          </>
        </SportCenterWrapper>
      ))}
    </div>
  );
};

export default SolicitudesPage;
