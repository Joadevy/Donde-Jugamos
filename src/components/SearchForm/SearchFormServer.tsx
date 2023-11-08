import {getSports} from "@/backend/db/models/sports";
import {getCities} from "@/backend/db/models/cities";

import SearchFormClient from "./SearchFormClient";

export interface DefaultSearchFormValues {
  city?: string;
  sport?: string;
  date?: string;
  time?: string;
}

async function SearchFormServer(defaultValues: DefaultSearchFormValues) {
  const sports = await getSports();
  const cities = await getCities();

  const {city: postCode, sport, date, time} = defaultValues;

  return (
    <SearchFormClient
      cities={cities}
      className="flex flex-col lg:flex-row lg:items-center gap-2"
      defaultValues={{city: postCode, sport, date, time}}
      sports={sports}
    />
  );
}

export default SearchFormServer;
