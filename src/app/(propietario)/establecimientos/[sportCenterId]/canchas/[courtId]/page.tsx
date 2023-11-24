import type {CourtSchedule} from "@/lib/types/importables/types";

import Link from "next/link";

import {Button} from "@/components/ui/button";
import {agruparPorHoras} from "@/lib/utils/curts.services";
import {findWithDays} from "@/backend/db/models/courts";

import ScheduleTable from "./components/ScheduleTable";

async function CurtPage({params}: {params: {sportCenterId: string; courtId: string}}) {
  const curt = await findWithDays(params.sportCenterId, params.courtId);

  let curtSchedule: CourtSchedule[] = [];

  if (curt?.days.length) {
    curtSchedule = curt.days.map((day) => {
      return {
        name: day.name,
        openTime: day.firstHalfStartTime,
        closeTime: day.secondHalfEndTime,
      };
    });
  }

  return (
    <div className="container mx-auto h-[500px] w-full flex gap-4">
      {curt !== null ? (
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
      ) : (
        <div>No hay información de la cancha</div>
      )}
      <aside className="border flex flex-col gap-2 py-2 px-4">
        <Button>
          <Link
            href={`/establecimientos/${params.sportCenterId}/canchas/${params.courtId}/horarios`}
          >
            Gestion de Horarios
          </Link>
        </Button>
        <Button>Generar Turnos</Button>
        <Button>Editar Datos</Button>
        <Button className="mt-auto" variant="destructive">
          Deshabilitar
        </Button>
      </aside>
    </div>
  );
}

export default CurtPage;
