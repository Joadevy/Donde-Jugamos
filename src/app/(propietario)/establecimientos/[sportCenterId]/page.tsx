import React from "react";
import Link from "next/link";

import {Button, buttonVariants} from "@/components/ui/button";
import {getSportCenterByIdWithReservations} from "@/backend/db/models/sportsCenters";
import {CountReservationsByState} from "@/lib/utils/utils";
import {getSportCenterReservations} from "@/backend/db/models/reservations";
import SportCenterClient from "@/components/SportCenterForm/SportCenterFormClient";

async function EstablecimientosPage({params}: {params: {sportCenterId: string}}) {
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
  const amountReservationsByState = CountReservationsByState(reservations);

  return (
    <div className="my-5 container mx-auto h-fit w-full flex flex-col lg:flex-row gap-4 relative">
      <div className="flex-auto flex flex-col lg:flex-row gap-4 items-center justify-center border">
        <section className="relative py-4">
          <SportCenterClient sportCenter={sportCenter} />
        </section>

        <section className="py-4">
          <h2 className="text-center font-bold">Historico de reservas</h2>

          <div className="flex flex-col gap-1">
            <div className={buttonVariants({variant: "outline"})}>
              {amountReservationsByState.pending} Reservas pendientes
            </div>

            <div className={buttonVariants({variant: "outline"})}>
              {amountReservationsByState.accepted} Reservas aceptadas
            </div>

            <div className={buttonVariants({variant: "outline"})}>
              {amountReservationsByState.rejected} Reservas rechazadas
            </div>

            <div className={buttonVariants({variant: "outline"})}>
              {amountReservationsByState.canceled} Reservas canceladas
            </div>
          </div>
        </section>
      </div>

      <aside className="border flex flex-col gap-2 py-2 px-4 order-1 lg:order-2">
        <Button>
          <Link href={`/establecimientos/${params.sportCenterId}/canchas`}>Canchas</Link>
        </Button>
      </aside>
    </div>
  );
}

export default EstablecimientosPage;
