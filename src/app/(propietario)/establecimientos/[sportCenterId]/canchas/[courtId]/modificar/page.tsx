import Link from "next/link";

import {getFullCourtById} from "@/backend/db/models/courts";
import {getSports} from "@/backend/db/models/sports";
import CourtForm from "@/components/CourtForm/CourtForm";
import PageWrapper from "@/components/Layout/PageWrapper";
import {buttonVariants} from "@/components/ui/button";

export default async function CourtUpdate({
  params,
}: {
  params: {sportCenterId: string; courtId: string};
}) {
  const sports = await getSports();
  const courPersisted = await getFullCourtById(Number(params.courtId));

  if (!courPersisted) {
    return <div>No se encontraron los datos de la cancha.</div>;
  }

  return (
    <PageWrapper
      aside={
        <>
          <Link
            className={buttonVariants({variant: "default"})}
            href={`/establecimientos/${params.sportCenterId}/canchas/${params.courtId}`}
          >
            Gestionar cancha
          </Link>
          <Link
            className={buttonVariants({variant: "default"})}
            href={`/establecimientos/${params.sportCenterId}/canchas/${params.courtId}/horarios`}
          >
            Gestionar horarios
          </Link>
          <Link
            className={buttonVariants({variant: "default"})}
            href={`/establecimientos/${params.sportCenterId}/canchas/${params.courtId}/turnos`}
          >
            Generar turnos
          </Link>
          <Link
            className={buttonVariants({variant: "default"})}
            href={`/establecimientos/${params.sportCenterId}/canchas/${params.courtId}/turnos/modificar`}
          >
            Editar Turnos
          </Link>
        </>
      }
      main={<CourtForm court={courPersisted} searchParams={params} sports={sports} />}
    />
  );
}
