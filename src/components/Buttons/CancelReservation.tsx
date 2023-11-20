import type {ReservationFullInfo} from "@/backend/db/models/reservations";

import {AlertDialogContent} from "@/components/ui/alert-dialog";

import {AlertDialog, AlertDialogTrigger} from "../ui/alert-dialog";
import {buttonVariants} from "../ui/button";
import CancelReservationForm from "../Reservation/CancelReservationForm";

interface Iprops {
  reservation: ReservationFullInfo;
}

function CancelReservation({reservation}: Iprops) {
  return (
    <AlertDialog>
      <AlertDialogTrigger className={buttonVariants({variant: "destructive"})}>
        Cancelar reserva
      </AlertDialogTrigger>

      <AlertDialogContent>
        <CancelReservationForm reservationInfo={reservation} />
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default CancelReservation;
