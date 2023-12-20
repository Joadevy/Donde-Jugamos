import SportCenter from "@/components/Sportcenters/SportCenter";
import {getSportCentersWithCourtsByFilters} from "@/backend/db/models/sportsCenters";
import SearchFormServer from "@/components/SearchForm/SearchFormServer";

interface SearchParams {
  city: string;
  sport: string;
  date: string;
  time: string;
}

const page = async ({searchParams}: {searchParams: SearchParams}) => {
  const {city: postCode, sport, date, time} = searchParams;

  if (!postCode || !sport || !date || !time) {
    return (
      <div className="flex items-center flex-col mt-4 gap-2">
        <SearchFormServer {...searchParams} />
        <p className="italic text-slate-500 text-center">
          Debes completar todos los campos para poder buscar..
        </p>
      </div>
    );
  }

  const sportCenters = await getSportCentersWithCourtsByFilters(
    postCode,
    sport,
    date,
    Number(time),
  );

  if (sportCenters.length === 0) {
    return (
      <div className="flex items-center flex-col mt-4 gap-2">
        <SearchFormServer {...searchParams} />
        <p className="italic text-slate-500 text-center">
          No hay establecimientos con canchas disponibles segun los filtros seleccionados..
        </p>
      </div>
    );
  }

  return (
    <main className="flex items-center flex-col my-4 gap-6">
      <SearchFormServer {...searchParams} />

      <ul className="flex items-center justify-center flex-col lg:flex-row lg:flex-wrap gap-6">
        {sportCenters.map((sportCenter) => (
          <SportCenter key={sportCenter.id} sportCenter={sportCenter} />
        ))}
      </ul>
    </main>
  );
};

export default page;
