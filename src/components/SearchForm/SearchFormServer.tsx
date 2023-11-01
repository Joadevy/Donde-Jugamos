import {getSports} from "@/backend/db/models/sports";
import {getCities} from "@/backend/db/models/cities";

import SearchFormClient from "./SearchFormClient";

async function SearchFormServer() {
  const sports = await getSports();
  const cities = await getCities();

  return (
    <SearchFormClient
      cities={cities}
      className="flex flex-col lg:flex-row lg:items-center gap-2"
      sports={sports}
    />
  );
}

export default SearchFormServer;
