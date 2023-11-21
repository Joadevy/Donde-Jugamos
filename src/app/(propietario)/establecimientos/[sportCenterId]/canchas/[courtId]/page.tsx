import Link from "next/link";

import {Button} from "@/components/ui/button";

function CanchaPage({params}: {params: {sportCenterId: string; courtId: string}}) {
  return (
    <div className="container mx-auto h-[500px] w-full flex gap-4">
      <div className="flex-auto flex items-center justify-center border">
        Información de la cancha
      </div>
      <aside className="border flex flex-col gap-2 py-2 px-4">
        <Button>
          <Link
            href={`/establecimientos/${params.sportCenterId}/canchas/${params.courtId}/horarios`}
          >
            Gestion de Horarios
          </Link>
        </Button>
        <Button>Generar Turnos</Button>
      </aside>
    </div>
  );
}

export default CanchaPage;
