import React from "react";
import Link from "next/link";

import {buttonVariants} from "@/components/ui/button";
import {getSportCenterByIdWithReservations} from "@/backend/db/models/sportsCenters";
import {CountReservationsByState, turnStateToSpanish} from "@/lib/utils/utils";
import {getSportCenterReservations} from "@/backend/db/models/reservations";
import ReservationCard from "@/components/Reservation/Propietary/ReservationCard";
import PageWrapper from "@/components/Layout/PageWrapper";
import PaginationButtons from "@/components/Pagination/PaginationButtons";
import HistoricReservations from "@/components/Reservation/HistoricReservations";

async function EstablecimientosPage({
  params,
  searchParams,
}: {
  params: {
    sportCenterId: string;
  };
  searchParams: {state: string | undefined; page: number | undefined};
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

  const {
    data: {reservations},
    pagination,
  } = await getSportCenterReservations(
    idToNumber,
    searchParams.page && Number.isInteger(Number(searchParams.page)) && searchParams.page > 0
      ? searchParams.page
      : 1,
    state,
  );

  const filteredReservations = reservations.filter((reservation) => reservation.state === state);

  return (
    <PageWrapper
      aside={
        <>
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
        </>
      }
      main={
        <>
          <section className="relative py-4 lg:w-3/4 lg:mr-5">
            <h1 className="font-bold text-xl lg:text-2xl text-primary lg:absolute lg:top-2">
              Gestioná tus solicitudes de reserva {turnStateToSpanish(state, "plural")}
            </h1>
            {filteredReservations.length === 0 && (
              <h2 className="text-slate-500 italic mt-6">
                Aun no hay reservas {turnStateToSpanish(state, "plural")}
              </h2>
            )}

            <ul className="flex flex-col items-center justify-center lg:items-start lg:justify-start gap-4 lg:flex-row flex-wrap mt-8 mb-5">
              {filteredReservations.map((reservation) => (
                <li key={reservation.id}>
                  <ReservationCard reservation={reservation} />
                </li>
              ))}
            </ul>

            {filteredReservations.length > 0 && (
              <PaginationButtons
                currentPage={pagination.page}
                pageSize={pagination.pageSize}
                total={pagination.total}
                totalPages={pagination.totalPages}
              />
            )}
          </section>

          <section className="py-4">
            <HistoricReservations sportCenterId={params.sportCenterId} />
          </section>
        </>
      }
    />
  );
}

export default EstablecimientosPage;
