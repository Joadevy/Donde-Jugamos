import Link from "next/link";

import {buttonVariants} from "@/components/ui/button";
import {FilterSelect} from "@/components/Sportcenters/FilterSelect";
import {getFullCities} from "@/backend/db/models/cities";
import CityForm from "@/components/Admin/AdminForms/CityForm";
import PageWrapper from "@/components/Layout/PageWrapper";

const CitiesPage = async ({searchParams}: {searchParams: {postCode: string}}) => {
  const {postCode} = searchParams;
  const cities = await getFullCities();

  const citiesOptions = cities.map((c) => ({
    option: c.name,
    value: c.postCode,
  }));

  const cityToEdit = postCode
    ? cities.find((c) => c.postCode.toLocaleLowerCase() == postCode.toLocaleLowerCase())
    : cities[0];

  return (
    <PageWrapper
      aside={
        <>
          <Link className={buttonVariants({variant: "default"})} href="/admin/solicitudes">
            Solicitudes
          </Link>

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
            Gestion de ciudades
          </h1>

          <div className="lg:mt-8 flex gap-6 flex-wrap">
            <section>
              <div className="w-[400px] border">
                <CityForm />
              </div>
            </section>

            <section className="space-y-4">
              {cityToEdit ? (
                <FilterSelect
                  options={citiesOptions}
                  placeholder="Seleccionar ciudad"
                  queryParam="postCode"
                />
              ) : null}

              <div className="w-[400px] border">
                <CityForm city={cityToEdit} />
              </div>
            </section>
          </div>
        </section>
      }
    />
  );
};

export default CitiesPage;
