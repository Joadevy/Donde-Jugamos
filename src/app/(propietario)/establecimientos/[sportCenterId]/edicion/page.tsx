import React from "react";
import Link from "next/link";

import {Button, buttonVariants} from "@/components/ui/button";
import {getSportCenterByIdWithUserAndCity} from "@/backend/db/models/sportsCenters";
import SportCenterClient from "@/components/SportCenterForm/SportCenterFormClient";

async function EdicionEstablecimientoPage({params}: {params: {sportCenterId: string}}) {
  const idToNumber = Number(params.sportCenterId);

  if (isNaN(idToNumber)) {
    throw new Error("El id del establecimiento no es un numero");
  }

  const sportCenter = await getSportCenterByIdWithUserAndCity(idToNumber);

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

  return (
    <div className="my-5 container mx-auto h-fit w-full flex flex-col lg:flex-row gap-4 relative">
      <div className="flex-auto flex flex-col lg:flex-row gap-4 items-center justify-center border">
        <section className="relative py-4">
          <SportCenterClient sportCenter={sportCenter} />
        </section>
      </div>

      <aside className="border flex flex-col gap-2 py-2 px-4 order-1 lg:order-2">
        <Button>
          <Link href={`/establecimientos/${params.sportCenterId}`}>Establecimiento</Link>
        </Button>

        <Button>
          <Link href={`/establecimientos/${params.sportCenterId}/canchas`}>Canchas</Link>
        </Button>
      </aside>
    </div>
  );
}

export default EdicionEstablecimientoPage;
