import {getSports} from "@/backend/db/models/sports";

import SearchFormClient from "./SearchFormClient";

async function SearchFormServer() {
  const sports = await getSports();

  return (
    <SearchFormClient className="flex flex-col lg:flex-row lg:items-center gap-2" sports={sports} />
  );
}

export default SearchFormServer;
