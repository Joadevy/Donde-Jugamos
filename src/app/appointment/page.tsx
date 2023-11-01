import SportCenter from "@/components/Sportcenters/SportCenter";
import {getSportCentersWithCourtsByFilters} from "@/backend/db/models/sportsCenters";

interface SearchParams {
  city: string;
  sport: string;
  date: string;
  time: string;
}

const page = async ({searchParams}: {searchParams: SearchParams}) => {
  const queryParams = new URLSearchParams({...searchParams});
  const {city: postCode, sport, date, time} = searchParams;

  const sportCenters = await getSportCentersWithCourtsByFilters(
    postCode,
    sport,
    new Date(date),
    Number(time),
  );

  if (sportCenters.length === 0) {
    return <div>No hay establecimientos con canchas disponibles en el horario seleccionado..</div>;
  }

  return (
    <div className="w-1/2 self-center flex flex-col lg:flex-row gap-2">
      <ul>
        {sportCenters.map((sportCenter) => (
          <SportCenter key={sportCenter.id} queryParams={queryParams} sportCenter={sportCenter} />
        ))}
      </ul>
    </div>
  );
};

export default page;
