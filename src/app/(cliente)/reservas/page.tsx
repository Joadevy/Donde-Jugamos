import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";

import {getUserReservationsByEmailAndState} from "@/backend/db/models/reservations";
import ReservationDetails from "@/components/Reservation/ReservationDetails";
import {turnStateToSpanish} from "@/lib/utils/utils";

import SelectStateReservations from "./components/SelectStateReservations";

export const statesReservation = ["pending", "approved", "rejected", "canceled"];

async function CustomerPage({searchParams}: {searchParams: {estado: string}}) {
  const session = await getServerSession();

  if (!session) redirect("/");

  const reservations = await getUserReservationsByEmailAndState(
    session.user.email ?? "",
    statesReservation.includes(searchParams.estado) ? searchParams.estado : undefined,
  );

  return (
    <main className="flex flex-col gap-2 items-center justify-center my-4">
      <header className="self-start my-2 mx-2 lg:my-0 lg:mx-10">
        <SelectStateReservations state={searchParams.estado} />
      </header>
      {reservations.length === 0 ? (
        <p className="text-slate-400 italic text-center">
          No tienes reservas {turnStateToSpanish(searchParams.estado, "plural")}
        </p>
      ) : (
        <ul className="flex items-center justify-center flex-col lg:flex-row lg:flex-wrap gap-6">
          {reservations.map((reservation) => (
            <li key={reservation.id}>
              <ReservationDetails reservation={reservation} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default CustomerPage;
