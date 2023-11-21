import React from "react";
import Link from "next/link";

import {Button} from "@/components/ui/button";

function EstablecimientosPage({params}: {params: {sportCenterId: string}}) {
  console.log("id del establecimiento: ", params.sportCenterId); // este seria el parametro /establecimientos/id < este ultimo id

  return (
    <div className="container mx-auto h-[500px] w-full flex gap-4">
      <div className="flex-auto flex items-center justify-center border">
        Información del establecimiento
      </div>
      <aside className="border flex flex-col gap-2 py-2 px-4">
        <Button>
          <Link href={`/establecimientos/${params.sportCenterId}/canchas`}>Canchas</Link>
        </Button>
      </aside>
    </div>
  );
}

export default EstablecimientosPage;
