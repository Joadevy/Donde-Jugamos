import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";

import {getUpcomingUserReservationsByEmail} from "@/backend/db/models/reservations";
import ReservationDetails from "@/components/Reservation/ReservationDetails";

async function CustomerPage() {
  const session = await getServerSession();

  if (!session) redirect("/");

  const reservations = await getUpcomingUserReservationsByEmail(session.user.email ?? ""); // Todos los usuarios tienen email

  return (
    <main className="my-4">
      <ul className="flex items-center justify-center flex-col lg:flex-row lg:flex-wrap gap-6">
        {reservations.map((reservation) => (
          <li key={reservation.id}>
            <ReservationDetails reservation={reservation} />
          </li>
        ))}
      </ul>
    </main>
  );
}

export default CustomerPage;
