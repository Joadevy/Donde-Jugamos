import React from "react";
import {Mail, MapPin, Phone, User} from "lucide-react";
import Link from "next/link";

import {CardContent, CardFooter} from "@/components/ui/card";
import {SPORT_CENTER_PENDING, getFullSportCentersByState} from "@/backend/db/models/sportsCenters";
import Information from "@/components/Sportcenters/Information";
import {
  SportCenterConfirmAlert,
  SportCenterDenyAlert,
} from "@/components/Sportcenters/SportCenterAlerts";
import {SportCenterWrapper} from "@/components/Sportcenters/SportCenterWrapper";
import {buttonVariants} from "@/components/ui/button";
import PageWrapper from "@/components/Layout/PageWrapper";
import {getCities} from "@/backend/db/models/cities";
import {FilterInput} from "@/components/Sportcenters/FilterInput";
import {FilterSelect} from "@/components/Sportcenters/FilterSelect";

const SolicitudesPage = async ({
  searchParams,
}: {
  searchParams: {name: string; postCode: string};
}) => {
  const {name, postCode} = searchParams;
  const sportCenters =
    (await getFullSportCentersByState(
      SPORT_CENTER_PENDING,
      name ? name : undefined,
      postCode ? postCode : undefined,
    )) || [];
  const cities = await getCities();

  const citiesOptions = cities.map((city) => ({
    option: city.name,
    value: city.postCode,
  }));

  return (
    <PageWrapper
      aside={
        <>
          <Link className={buttonVariants({variant: "default"})} href="/admin/establecimientos">
            Establecimientos
          </Link>

          <Link className={buttonVariants({variant: "default"})} href="/admin">
            Gestion app
          </Link>
        </>
      }
      main={
        <section className="relative py-4">
          <h1 className="font-bold text-xl lg:text-2xl text-primary lg:absolute lg:top-2">
            Gestionar solicitudes de alta
          </h1>

          <div className="mt-2 lg:mt-8 flex flex-col lg:flex-row gap-4">
            <FilterInput placeholder="Filtrar por nombre" queryParam="name" />
            <FilterSelect
              label=""
              options={[{option: "Todas", value: "all"}, ...citiesOptions]}
              placeholder="Filtrar por ciudad"
              queryParam="postCode"
            />
          </div>

          {sportCenters.length === 0 ? (
            <p className="text-slate-400 italic lg:mt-5">No hay solicitudes de alta</p>
          ) : (
            <div className="lg:mt-5 flex items-center justify-center lg:items-start lg:justify-start flex-wrap gap-4 py-4">
              {sportCenters.map((sportCenter) => (
                <SportCenterWrapper
                  key={sportCenter.id}
                  className="w-[300px] lg:w-[400px] h-[350px] flex flex-col"
                  description={sportCenter.description!}
                  title={sportCenter.name}
                >
                  <>
                    <CardContent className="space-y-2">
                      <Information>
                        <MapPin color="green" size={20} />
                        <p>
                          {sportCenter.address}, {sportCenter.city.name} (
                          {sportCenter.city.postCode})
                        </p>
                      </Information>

                      <Information>
                        <Phone color="green" size={20} />
                        <p>{sportCenter.phone}</p>
                      </Information>

                      <Information>
                        <Mail color="green" size={20} />
                        <p>{sportCenter.email}</p>
                      </Information>

                      <Information>
                        <User color="green" size={20} />
                        <p>{sportCenter.user.name}</p>
                      </Information>
                    </CardContent>
                    <CardFooter className="mt-auto flex gap-2 w-fit">
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
          )}
        </section>
      }
    />
  );
};

export default SolicitudesPage;
