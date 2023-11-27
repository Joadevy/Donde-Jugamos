import type {CourtFullInfo} from "@/backend/db/models/courts";

import {getSportCenterCourts} from "@/backend/db/models/courts";
import {CourtCard} from "@/components/Courts/CourtCard";
import {Button} from "@/components/ui/button";

async function CanchasPage({params}: {params: {sportCenterId: string}}) {
  const courts: CourtFullInfo[] = await getSportCenterCourts(Number(params.sportCenterId));

  // Solo conocemos el sportcenterId en esta ruta: /establecimientos/sportCenterId/canchas

  return (
    <div className="container mx-auto min-h-[500px] w-full flex gap-4 m-4">
      <div className="flex-auto flex flex-col border p-4">
        <section>
          <h2 className="text-2xl font-bold text-primary mb-2">Administrá tus canchas</h2>

          <ul className="flex gap-4 flex-wrap">
            {courts.map((court) => (
              <li key={court.id}>
                <CourtCard court={court} />
              </li>
            ))}
          </ul>
        </section>
      </div>
      <aside className="border flex flex-col gap-2 py-2 px-4">
        <Button>Nueva Cancha</Button>
        <Button>Otra Opcion</Button>
      </aside>
    </div>
  );
}

export default CanchasPage;
