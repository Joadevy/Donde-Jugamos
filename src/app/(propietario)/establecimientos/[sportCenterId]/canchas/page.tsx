import Link from "next/link";

import {getSportCenterCourts} from "@/backend/db/models/courts";
import {CourtCard} from "@/components/Courts/CourtCard";
import {buttonVariants} from "@/components/ui/button";
import PageWrapper from "@/components/Layout/PageWrapper";

async function CanchasPage({params}: {params: {sportCenterId: string}}) {
  const courts = await getSportCenterCourts(Number(params.sportCenterId));

  return (
    <PageWrapper
      aside={
        <Link
          className={buttonVariants({variant: "default"})}
          href={`/establecimientos/${params.sportCenterId}/canchas/nueva`}
        >
          Nueva Cancha
        </Link>
      }
      main={
        <section>
          <h2 className="text-2xl font-bold text-primary mb-2">Administrá tus canchas</h2>

          <ul className="flex flex-wrap gap-4 items-center justify-center lg:items-start lg:justify-normal">
            {courts.map((court) => (
              <li key={court.id}>
                <CourtCard court={court} />
              </li>
            ))}
          </ul>
        </section>
      }
    />
  );
}

export default CanchasPage;
