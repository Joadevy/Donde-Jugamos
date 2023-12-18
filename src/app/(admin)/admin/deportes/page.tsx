import Link from "next/link";

import {buttonVariants} from "@/components/ui/button";
import SportForm from "@/components/Admin/AdminForms/SportForm";
import {getSports} from "@/backend/db/models/sports";
import {FilterSelect} from "@/components/Sportcenters/FilterSelect";
import PageWrapper from "@/components/Layout/PageWrapper";

const SportsPage = async ({searchParams}: {searchParams: {sport: string}}) => {
  const {sport} = searchParams;
  const sports = await getSports();

  const sportsOptions = sports.map((s) => ({
    option: s.name,
    value: s.name,
  }));

  const sportToEdit = sport
    ? sports.find((s) => s.name.toLocaleLowerCase() == sport.toLocaleLowerCase())
    : sports[0];

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
            Gestion de deportes
          </h1>

          <div className="lg:mt-8 flex gap-6 flex-wrap">
            <section>
              <div className="w-[400px] border">
                <SportForm />
              </div>
            </section>

            <section className="space-y-4">
              {sportToEdit ? (
                <FilterSelect
                  options={sportsOptions}
                  placeholder="Seleccionar deporte"
                  queryParam="sport"
                />
              ) : null}

              <div className="w-[400px] border">
                <SportForm sport={sportToEdit} />
              </div>
            </section>
          </div>
        </section>
      }
    />
  );
};

export default SportsPage;
