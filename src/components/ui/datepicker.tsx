"use client";

import * as React from "react";
import {format} from "date-fns";
import {Calendar as CalendarIcon} from "lucide-react";
import {es} from "date-fns/locale";

import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn} from "@/lib/utils/utils";

interface DatePickeProps {
  date?: Date;
  setDate?: (date: Date | undefined) => void;
  sinceDate?: Date;
  untilDate?: Date;
  fromMonth?: Date;
  className?: string;
}

export function DatePicker({date, setDate, sinceDate, untilDate, fromMonth, className}: DatePickeProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          variant="outline"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Seleccionar Fecha</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-auto p-0")}>
        <Calendar
          initialFocus
          disabled={(currentDate) => {
            currentDate.setHours(0, 0, 0, 0);

            if (sinceDate && untilDate) {
              const limitInf = new Date(sinceDate);
              const limitSup = new Date(untilDate);

              limitInf.setHours(0, 0, 0, 0);
              limitSup.setHours(0, 0, 0, 0);

              return currentDate <= limitInf || currentDate >= limitSup;
            } else if (sinceDate) {
              const limit = new Date(sinceDate);

              limit.setHours(0, 0, 0, 0);

              return currentDate < limit;
            } else if (untilDate) {
              const limit = new Date(untilDate);

              limit.setHours(0, 0, 0, 0);

              return currentDate > limit;
            }

            return false;
          }}
          fromMonth={fromMonth}
          locale={es}
          mode="single"
          selected={date}
          onSelect={setDate}
        />
      </PopoverContent>
    </Popover>
  );
}
