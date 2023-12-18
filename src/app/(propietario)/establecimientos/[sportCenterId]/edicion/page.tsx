import React from "react";
import Link from "next/link";

import {Button, buttonVariants} from "@/components/ui/button";
import {getSportCenterByIdWithUserAndCity} from "@/backend/db/models/sportsCenters";
import SportCenterClient from "@/components/SportCenterForm/SportCenterFormClient";
import PageWrapper from "@/components/Layout/PageWrapper";

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
    <PageWrapper
      aside={
        <>
          <Link
            className={buttonVariants({variant: "default"})}
            href={`/establecimientos/${params.sportCenterId}`}
          >
            Establecimiento
          </Link>

          <Link
            className={buttonVariants({variant: "default"})}
            href={`/establecimientos/${params.sportCenterId}/canchas`}
          >
            Canchas
          </Link>
        </>
      }
      main={<SportCenterClient sportCenter={sportCenter} />}
    />
  );
}

export default EdicionEstablecimientoPage;
