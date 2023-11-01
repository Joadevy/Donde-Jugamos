/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import type {SportCenter as SportCenterType} from "@/lib/types/importables/types";

import React from "react";

import SportCenter from "@/components/Sportcenters/SportCenter";

const page = async ({searchParams}) => {
  const queryParams = new URLSearchParams(searchParams);

  const result = await fetch("http://localhost:3000/api/appointment", {
    method: "POST",
    body: JSON.stringify(searchParams),
  });

  const sportCenters = await result.json();

  if (!sportCenters.data.length) {
    return <div>{sportCenters.message}</div>;
  }

  return (
    <div className="w-1/2 self-center flex flex-col lg:flex-row gap-2">
      <ul>
        {sportCenters.data.map((sportCenter: SportCenterType) => (
          <SportCenter key={sportCenter.id} queryParams={queryParams} sportCenter={sportCenter} />
        ))}
      </ul>
    </div>
  );
};

export default page;
