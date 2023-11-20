"use client";
import {useRouter} from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {capitalize, turnStateToSpanish} from "@/lib/utils/utils";

interface Iprops {
  state: string;
}

export const statesReservation = ["pending", "approved", "rejected", "canceled"];

function SelectStateReservations({state}: Iprops) {
  const router = useRouter();

  const handleChange = (value: string) => {
    router.push(`?estado=${value}`);
  };

  return (
    <Select
      defaultValue={statesReservation.includes(state) ? state : ""}
      onValueChange={handleChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Filtrar reservas">
          <span className="text-gray-400 px-1">
            {statesReservation.includes(state)
              ? capitalize(turnStateToSpanish(state, "plural"))
              : "Filtrar reservas"}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pendientes</SelectItem>
        <SelectItem value="approved">Aprobadas</SelectItem>
        <SelectItem value="rejected">Rechazadas</SelectItem>
        <SelectItem value="canceled">Canceladas</SelectItem>
      </SelectContent>
    </Select>
  );
}

export default SelectStateReservations;
