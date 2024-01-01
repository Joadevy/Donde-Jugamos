import React from "react";
import {Mail, MapPin, Phone, User} from "lucide-react";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {getSportCentersWithUserAndCity} from "@/backend/db/models/sportsCenters";
import Information from "@/components/Sportcenters/Information";
import {
  SportCenterDisableAlert,
  SportCenterEnableAlert,
} from "@/components/Sportcenters/SportCenterAlerts";
import {buttonVariants} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {FilterInput} from "@/components/Sportcenters/FilterInput";
import {FilterSelect} from "@/components/Sportcenters/FilterSelect";
import {getCities} from "@/backend/db/models/cities";
import PageWrapper from "@/components/Layout/PageWrapper";
import PaginationButtons from "@/components/Pagination/PaginationButtons";

const EstablecimientosPage = async ({
  searchParams,
}: {
  searchParams: {name: string; postCode: string; page: string | undefined};
}) => {
  const {name, postCode} = searchParams;
  const cities = await getCities();

  const citiesOptions = cities.map((city) => ({option: city.name, value: city.postCode}));

  const {
    data: {sportcenters: sportCenters},
    pagination,
  } = await getSportCentersWithUserAndCity(
    name ? name : undefined,
    postCode ? postCode : undefined,
    searchParams.page &&
      Number.isInteger(Number(searchParams.page)) &&
      Number(searchParams.page) > 0
      ? Number(searchParams.page)
      : 1,
  );

  return (
    <PageWrapper
      aside={
        <>
          <Link className={buttonVariants({variant: "default"})} href="/admin/solicitudes">
            Solicitudes
          </Link>

          <Link className={buttonVariants({variant: "default"})} href="/admin">
            Gestion app
          </Link>
        </>
      }
      main={
        <section className="relative py-4">
          <h1 className="font-bold text-xl lg:text-2xl text-primary lg:absolute lg:top-2">
            Gestionar establecimientos aprobados
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
            <p className="text-slate-400 italic lg:mt-5">No hay establecimientos aprobados</p>
          ) : (
            <div className="flex flex-col gap-4 ">
              <div className="lg:mt-5 flex items-center justify-center lg:items-start lg:justify-start flex-wrap gap-4 py-4">
                {sportCenters.map((sportCenter) => (
                  <Card
                    key={sportCenter.id}
                    className="relative flex flex-col w-[300px] lg:w-[400px] h-[350px]"
                  >
                    <CardHeader className="flex-auto">
                      <CardTitle>{sportCenter.name}</CardTitle>
                      <CardDescription className="overflow-hidden">
                        {sportCenter.description!}
                      </CardDescription>
                      <Separator />
                    </CardHeader>

                    <CardContent className="space-y-2">
                      <Information>
                        <User color="green" size={20} />
                        <p>{sportCenter.user.name}</p>
                      </Information>

                      <Information>
                        <MapPin color="green" size={20} />
                        <p>
                          {sportCenter.address}, {sportCenter.city.name}
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
                    </CardContent>
                    <CardFooter className="mt-auto flex gap-2 w-fit">
                      {sportCenter.active ? (
                        <SportCenterDisableAlert
                          sportCenterId={sportCenter.id}
                          sportCenterName={sportCenter.name}
                          title="Inhabilitar"
                        />
                      ) : (
                        <SportCenterEnableAlert
                          sportCenterId={sportCenter.id}
                          sportCenterName={sportCenter.name}
                          title="Habilitar"
                        />
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
              <PaginationButtons
                currentPage={pagination.page}
                pageSize={pagination.pageSize}
                total={pagination.total}
                totalPages={pagination.totalPages}
              />
            </div>
          )}
        </section>
      }
    />
  );
};

export default EstablecimientosPage;
