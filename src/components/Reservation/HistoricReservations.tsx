import Link from "next/link";
import React from "react";

import {CountReservationsByState} from "@/lib/utils/utils";
import {getSportCenterHistoricReservations} from "@/backend/db/models/reservations";

import {buttonVariants} from "../ui/button";

interface Iprops {
  sportCenterId: string;
}

async function HistoricReservations({sportCenterId}: Iprops) {
  const reservations = await getSportCenterHistoricReservations(Number(sportCenterId));

  const amountReservationsByState = CountReservationsByState(reservations);

  return (
    <>
      <h2 className="text-center font-bold">Historico de reservas</h2>

      <div className="flex flex-col gap-1">
        <Link
          className={buttonVariants({variant: "outline"})}
          href={`/establecimientos/${sportCenterId}?state=pending`}
        >
          {amountReservationsByState.pending} Reservas pendientes
        </Link>

        <Link
          className={buttonVariants({variant: "outline"})}
          href={`/establecimientos/${sportCenterId}?state=approved`}
        >
          {amountReservationsByState.approved} Reservas aprobadas
        </Link>

        <Link
          className={buttonVariants({variant: "outline"})}
          href={`/establecimientos/${sportCenterId}?state=rejected`}
        >
          {amountReservationsByState.rejected} Reservas rechazadas
        </Link>

        <Link
          className={buttonVariants({variant: "outline"})}
          href={`/establecimientos/${sportCenterId}?state=canceled`}
        >
          {amountReservationsByState.canceled} Reservas canceladas
        </Link>
      </div>
    </>
  );
}

export default HistoricReservations;
