/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
import type {ReservationFullInfo} from "@/backend/db/models/reservations";

import {useRouter} from "next/navigation";

import {Button, buttonVariants} from "../ui/button";
import {useToast} from "../ui/use-toast";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";

interface Iprops {
  reservation: ReservationFullInfo;
}

export function CancelReservationBtn({reservation}: Iprops) {
  const {toast} = useToast();
  const router = useRouter();

  const cancelReservation = async (res: ReservationFullInfo) => {
    const payload = JSON.stringify({reservationId: res.id});

    try {
      const response: {data: string; status: number; message: string} = await fetch(
        "/api/reservation",
        {
          method: "PATCH",
          body: payload,
        },
      ).then((resp) => resp.json());

      if (response.status === 200) {
        toast({
          title: "✅ Reserva cancelada",
          description: "La reserva se canceló correctamente",
        });

        router.refresh();
      } else throw new Error(response.message);
    } catch (error) {
      toast({
        title: "❌ Error al cancelar la reserva",
        description: "No se pudo cancelar la reserva, intente nuevamente",
      });
    }
  };

  return (
    <Popover>
      <PopoverTrigger className={buttonVariants({variant: "destructive"})}>
        Cancelar reserva
      </PopoverTrigger>
      <PopoverContent className="border flex flex-col items-center w-fit">
        Esta seguro de cancelar tu reserva?
        <Button role="button" type="submit" onClick={() => cancelReservation(reservation)}>
          Confirmar
        </Button>
      </PopoverContent>
    </Popover>
  );
}

export default CancelReservationBtn;
