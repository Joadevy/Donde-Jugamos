import {getFullCourtById} from "@/backend/db/models/courts";
import {getSports} from "@/backend/db/models/sports";
import CourtForm from "@/components/CourtForm/CourtForm";

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
    <div>
      <CourtForm court={courPersisted} searchParams={params} sports={sports} />
    </div>
  );
}
