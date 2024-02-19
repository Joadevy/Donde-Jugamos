import type {SportCenter} from "@prisma/client";

import {getServerSession} from "next-auth";

import {
  SPORT_CENTER_APPROVED,
  SPORT_CENTER_PENDING,
  getUserPendingSportCenters,
} from "@/backend/db/models/sportsCenters";
import {SportCenterCard, SportCenterPending} from "@/components/Sportcenters/SportCenterWrapper";
import PageWrapper from "@/components/Layout/PageWrapper";

import {authOptions} from "../../api/auth/[...nextauth]/route";

// En esta ruta /propietario/* estarian todas las configs de su establecimiento y ddemas
async function PropietaryPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Debes iniciar sesion para poder ingresar a esta sección</div>;
  }

  const userEmail = session.user.email!;
  const userSportCenters: SportCenter[] | null = await getUserPendingSportCenters(userEmail);

  if (!userSportCenters) {
    return <div>No hay estableciemientos disponibles</div>;
  }

  return (
    <PageWrapper
      main={
        <div className="container mx-auto py-4">
          <h2 className="text-2xl font-bold text-primary mb-2">Administrá tus establecimientos</h2>
          <section className="flex flex-wrap items-center justify-center lg:items-start lg:justify-start gap-6">
            {userSportCenters.map((sportCenter) =>
              sportCenter.state === SPORT_CENTER_APPROVED ? (
                <SportCenterCard
                  key={sportCenter.id}
                  className="w-[300px] h-[380px]"
                  sportCenter={sportCenter}
                />
              ) : (
                <SportCenterPending
                  key={sportCenter.id}
                  className="w-[300px] h-[380px]"
                  description={sportCenter.description!}
                  state={sportCenter.state}
                  title={sportCenter.name}
                />
              ),
            )}
          </section>
        </div>
      }
    />
  );
}

export default PropietaryPage;
