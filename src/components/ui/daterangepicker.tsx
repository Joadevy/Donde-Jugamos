/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable react/function-component-definition */
"use client";

import type {DateRange} from "react-day-picker";

import * as React from "react";
import {es} from "date-fns/locale";
import {format} from "date-fns";
import {Calendar as CalendarIcon} from "lucide-react";

import {cn} from "@/lib/utils/utils";
import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";

interface DatePickerWithRangeProps {
  className?: React.HTMLAttributes<HTMLDivElement>;
  date: DateRange;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  minDayLimit?: number;
  maxDayLimit?: number;
  disabledDatesFrom?: Date; //Condicion para deshabilitar dias.
}

export const DatePickerWithRange: React.FC<DatePickerWithRangeProps> = ({
  className,
  date,
  setDate,
  minDayLimit,
  maxDayLimit,
  disabledDatesFrom,
}) => {
  const currentDate = new Date();

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
            id="date"
            variant="outline"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/y")} - {format(date.to, "dd/MM/y")}
                </>
              ) : (
                format(date.from, "dd/MM/y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            initialFocus
            defaultMonth={date.from}
            disabled={(calendarDate) => (disabledDatesFrom ? calendarDate < currentDate : true)}
            locale={es}
            max={maxDayLimit}
            min={minDayLimit}
            mode="range"
            numberOfMonths={2}
            selected={date}
            onSelect={setDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
