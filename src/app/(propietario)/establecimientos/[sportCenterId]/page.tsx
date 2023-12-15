import React from "react";
import Link from "next/link";

import {buttonVariants} from "@/components/ui/button";
import {getSportCenterByIdWithReservations} from "@/backend/db/models/sportsCenters";
import {CountReservationsByState, turnStateToSpanish} from "@/lib/utils/utils";
import {getSportCenterReservations} from "@/backend/db/models/reservations";
import SportCenterClient from "@/components/SportCenterForm/SportCenterFormClient";
import ReservationCard from "@/components/Reservation/Propietary/ReservationCard";

async function EstablecimientosPage({
  params,
  searchParams,
}: {
  params: {
    sportCenterId: string;
  };
  searchParams: {state: string | undefined};
}) {
  const {state = "pending"} = searchParams;
  const idToNumber = Number(params.sportCenterId);

  if (isNaN(idToNumber)) {
    throw new Error("El id del establecimiento no es un numero");
  }

  const sportCenter = await getSportCenterByIdWithReservations(idToNumber);

  if (!sportCenter) {
    return (
      <div className="text-center italic text-slate-400 flex flex-col gap-1 items-center mt-4">
        Este establecimiento no existe!
        <Link className={buttonVariants({variant: "outline"})} href="/establecimientos">
          Volver a mis establecimientos
        </Link>
      </div>
    );
  }

  const reservations = await getSportCenterReservations(idToNumber);
  const pendingReservations = reservations.filter((reservation) => reservation.state === state);
  const amountReservationsByState = CountReservationsByState(reservations);

  return (
    <div className="my-5 container mx-auto h-fit w-full flex flex-col lg:flex-row gap-4 relative">
      <div className="flex-auto flex flex-col lg:flex-row gap-4 justify-center lg:border">
        <section className="relative py-4 lg:w-3/4">
          <h1 className="font-bold text-xl lg:text-2xl text-primary lg:absolute lg:top-2">
            Gestioná tus solicitudes de reserva {turnStateToSpanish(state, "plural")}
          </h1>
          {pendingReservations.length === 0 && (
            <h2 className="text-slate-500 italic mt-6">
              Aun no hay reservas {turnStateToSpanish(state, "plural")}
            </h2>
          )}

          <ul className="flex flex-col gap-4 lg:flex-row mt-6">
            {pendingReservations.map((reservation) => (
              <li key={reservation.id}>
                <ReservationCard reservation={reservation} />
              </li>
            ))}
          </ul>
        </section>

        <section className="py-4">
          <h2 className="text-center font-bold">Historico de reservas</h2>

          <div className="flex flex-col gap-1">
            <Link
              className={buttonVariants({variant: "outline"})}
              href={`/establecimientos/${params.sportCenterId}?state=pending`}
            >
              {amountReservationsByState.pending} Reservas pendientes
            </Link>

            <Link
              className={buttonVariants({variant: "outline"})}
              href={`/establecimientos/${params.sportCenterId}?state=approved`}
            >
              {amountReservationsByState.approved} Reservas aprobadas
            </Link>

            <Link
              className={buttonVariants({variant: "outline"})}
              href={`/establecimientos/${params.sportCenterId}?state=rejected`}
            >
              {amountReservationsByState.rejected} Reservas rechazadas
            </Link>

            <Link
              className={buttonVariants({variant: "outline"})}
              href={`/establecimientos/${params.sportCenterId}?state=canceled`}
            >
              {amountReservationsByState.canceled} Reservas canceladas
            </Link>
          </div>
        </section>
      </div>

      <aside className="border flex flex-col gap-2 py-2 px-4 order-1 lg:order-2">
        <Link
          className={buttonVariants({variant: "default"})}
          href={`/establecimientos/${params.sportCenterId}/edicion`}
        >
          Editar informacion
        </Link>

        <Link
          className={buttonVariants({variant: "default"})}
          href={`/establecimientos/${params.sportCenterId}/canchas`}
        >
          Canchas
        </Link>
      </aside>
    </div>
  );
}

export default EstablecimientosPage;
