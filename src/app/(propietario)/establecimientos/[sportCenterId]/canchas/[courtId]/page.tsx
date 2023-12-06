import type {CourtSchedule} from "@/lib/types/importables/types";

import Link from "next/link";

import {Button} from "@/components/ui/button";
import {findWithDays} from "@/backend/db/models/courts";

import ScheduleTable from "./components/ScheduleTable";

async function CurtPage({params}: {params: {sportCenterId: string; courtId: string}}) {
  const curt = await findWithDays(params.sportCenterId, params.courtId);

  if (curt == null) {
    return <div>No se encontro la Cancha</div>;
  }
  let curtSchedule: CourtSchedule[] = [];

  if (curt.days.length) {
    curtSchedule = curt.days.map((day) => {
      return {
        name: day.name,
        openTime: day.openTime,
        closeTime: day.closeTime,
      };
    });
  }

  return (
    <div className="container mx-auto h-[500px] w-full flex gap-4">
      <div className="flex-auto flex flex-col gap-4">
        <section className="flex border">
          <div className="flex-auto">
            <h2 className="text-xl font-semibold">{curt.name}</h2>
            <p>{curt.description}</p>
            <p>
              <strong>Capacidad: </strong>
              {curt.capacity}
            </p>
            <p>
              <strong>Precio: </strong>
              {curt.price}
            </p>
          </div>
          <section>
            {curtSchedule.length > 0 ? (
              <div className="w-[300px]">
                <ScheduleTable className="text-xs" schedule={curtSchedule} />
              </div>
            ) : (
              <div>No se establecieron los horarios de la cancha.</div>
            )}
          </section>
        </section>

        <section className="border p-4">Aca irian los turnos</section>
      </div>

      <aside className="border flex flex-col gap-2 py-2 px-4">
        <Button>
          <Link href={`${params.courtId}/horarios`}>Gestion de Horarios</Link>
        </Button>
        <Button>
          <Link href={`${params.courtId}/turnos`}>Generar Turnos</Link>
        </Button>
        <Button>Editar Datos</Button>
        <Button className="mt-auto" variant="destructive">
          Deshabilitar
        </Button>
      </aside>
    </div>
  );
}

export default CurtPage;
