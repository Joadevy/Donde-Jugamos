import {getUserPendingSportCenters} from "@/backend/db/models/sportsCenters";
import SportCenterWrapper from "@/components/Sportcenters/SportCenterWrapper";

// En esta ruta /propietario/* estarian todas las configs de su establecimiento y ddemas
const page = async () => {
  // const {data: session} = useSession();
  const userEmail = "catalinit@frcu.utn.edu.ar";
  const userSportCenters: any[] = (await getUserPendingSportCenters(userEmail)) || [];

  return (
    <div className="container mx-auto py-4">
      <section>
        {userSportCenters.map((sportCenter) => (
          <SportCenterWrapper key={sportCenter.id} sportCenter={sportCenter} />
        ))}
      </section>
    </div>
  );
};

export default page;
