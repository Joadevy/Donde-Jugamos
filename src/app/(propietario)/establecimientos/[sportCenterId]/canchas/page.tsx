import Link from "next/link";
import React from "react";

import {Button} from "@/components/ui/button";

function CanchasPage({params}: {params: {sportCenterId: string}}) {
  // Solo conocemos el sportcenterId en esta ruta: /establecimientos/sportCenterId/canchas
  console.log(params.sportCenterId);

  return (
    <div className="container mx-auto h-[500px] w-full flex gap-4">
      <div className="flex-auto flex flex-col items-center justify-center border">
        <h1>EN CONSTRUCCION</h1>{" "}
        <p>
          Si queres acceder a la administracion de una cancha en particular navega a
          /establecimientos/sportCenterId/canchas/courtId
        </p>
        <p>
          Aca van a estar todas las canchas para poder seleccionar e ir al dashboard de la cancha,
          editar una cancha, eliminar, etc
        </p>
      </div>
      <aside className="border flex flex-col gap-2 py-2 px-4">
        <Button>Nueva Cancha</Button>
        <Button>Otra Opcion</Button>
      </aside>
    </div>
  );
}

export default CanchasPage;
