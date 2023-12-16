import Link from "next/link";

import {buttonVariants} from "@/components/ui/button";
import SportForm from "@/components/Admin/AdminForms/SportForm";
import {getSports} from "@/backend/db/models/sports";
import {FilterSelect} from "@/components/Sportcenters/FilterSelect";

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
    <div className="my-5 container mx-auto h-fit w-full flex flex-col lg:flex-row gap-4 relative">
      <div className="flex-auto flex flex-col lg:flex-row gap-4 justify-center lg:border">
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
      </div>

      <aside className="border flex flex-col gap-2 py-2 px-4 order-1 lg:order-2">
        <Link className={buttonVariants({variant: "default"})} href="/admin/solicitudes">
          Solicitudes
        </Link>

        <Link className={buttonVariants({variant: "default"})} href="/admin/establecimientos">
          Establecimientos
        </Link>

        <Link className={buttonVariants({variant: "default"})} href="/admin">
          Gestion app
        </Link>
      </aside>
    </div>
  );
};

export default SportsPage;
