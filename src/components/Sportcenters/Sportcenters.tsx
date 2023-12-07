import type {SportCentersWithCourtsAndAppointments} from "@/backend/db/models/sportsCenters";

import SportCenter from "./SportCenter";

interface Iprops {
  sportCenters: SportCentersWithCourtsAndAppointments[];
  queryParams: URLSearchParams | null;
}

function Sportcenters({sportCenters}: Iprops) {
  if (sportCenters.length === 0)
    return (
      <p className="italic text-slate-600 font-light">
        No hay canchas disponibles segun los filtros seleccionados
      </p>
    );

  return (
    <ul>
      {sportCenters.map((sportCenter) => (
        <SportCenter key={sportCenter.id} sportCenter={sportCenter} />
      ))}
    </ul>
  );
}

export default Sportcenters;
