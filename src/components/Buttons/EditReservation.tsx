import type {ReservationFullInfo} from "@/backend/db/models/reservations";

import {AlertDialogContent} from "@/components/ui/alert-dialog";

import {AlertDialog, AlertDialogTrigger} from "../ui/alert-dialog";
import EditReservationForm from "../Reservation/EditReservationForm";
import {buttonVariants} from "../ui/button";

interface Iprops {
  reservation: ReservationFullInfo;
}

function EditReservation({reservation}: Iprops) {
  return (
    <AlertDialog>
      <AlertDialogTrigger className={buttonVariants({variant: "default"})}>
        Editar reserva
      </AlertDialogTrigger>

      <AlertDialogContent>
        <EditReservationForm reservationInfo={reservation} />
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default EditReservation;
