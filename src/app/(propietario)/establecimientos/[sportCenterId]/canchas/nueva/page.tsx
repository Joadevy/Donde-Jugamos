import {getSports} from "@/backend/db/models/sports";
import CourtForm from "@/components/CourtForm/CourtForm";

const page = async ({params}: {params: {sportCenterId: string}}) => {
  const sports = await getSports();

  return (
    <div>
      <CourtForm searchParams={params} sports={sports} />
    </div>
  );
};

export default page;
