import Link from "next/link";

import {getSports} from "@/backend/db/models/sports";
import CourtForm from "@/components/CourtForm/CourtForm";
import PageWrapper from "@/components/Layout/PageWrapper";
import {buttonVariants} from "@/components/ui/button";

const page = async ({params}: {params: {sportCenterId: string}}) => {
  const sports = await getSports();

  return (
    <PageWrapper
      aside={
        <Link
          className={buttonVariants({variant: "default"})}
          href={`/establecimientos/${params.sportCenterId}/canchas`}
        >
          Gestionar canchas
        </Link>
      }
      main={<CourtForm searchParams={params} sports={sports} />}
    />
  );
};

export default page;
