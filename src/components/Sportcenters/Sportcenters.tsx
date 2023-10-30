import type {SportCenter as TSportCenter} from "@prisma/client";

import SportCenter from "./SportCenter";

interface Iprops {
  sportCenters: TSportCenter[];
  queryParams: URLSearchParams | null;
}

function Sportcenters({sportCenters, queryParams}: Iprops) {
  if (sportCenters.length === 0)
    return (
      <p className="italic text-slate-600 font-light">
        No hay canchas disponibles segun los filtros seleccionados
      </p>
    );

  return (
    <ul>
      {sportCenters.map((sportCenter) => (
        <SportCenter key={sportCenter.id} queryParams={queryParams} sportCenter={sportCenter} />
      ))}
    </ul>
  );
}

export default Sportcenters;
