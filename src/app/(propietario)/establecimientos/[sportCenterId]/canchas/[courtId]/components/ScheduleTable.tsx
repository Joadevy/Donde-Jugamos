/* eslint-disable react/function-component-definition */
import type {FC, ReactElement} from "react";
import type {CourtSchedule} from "@/lib/types/importables/types";

import React from "react";
import {X} from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {cn, timeInStringFromMinutes} from "@/lib/utils/utils";

import {DAYS_OF_WEEK} from "../horarios/page";

interface ScheduleTableProps {
  schedule: CourtSchedule[];
  showHeader?: boolean;
  caption?: string;
  className?: string;
  children?: ReactElement;
  handleEdit?: (day: string) => void;
}

const ScheduleTable: FC<ScheduleTableProps> = ({
  schedule,
  children,
  className,
  caption,
  showHeader = false,
  handleEdit,
}) => {
  return (
    <Table className={cn("w-full select-none border", className)}>
      <TableCaption>{caption}</TableCaption>
      <TableHeader className={cn("bg-neutral-200", showHeader ? "" : "hidden")}>
        <TableRow>
          <TableHead>Dias</TableHead>
          <TableHead>Apertura</TableHead>
          <TableHead>Cierre</TableHead>
          {handleEdit ? <TableHead /> : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {schedule.map((day, index) =>
          day.openTime !== null && day.closeTime !== null ? (
            <TableRow key={index} className="hover:bg-green-50">
              <TableCell className="flex flex-col gap-2">
                <p>{DAYS_OF_WEEK[`${day.name}`].name}</p>
              </TableCell>
              <TableCell>{timeInStringFromMinutes(day.openTime.toString())}</TableCell>
              <TableCell> {timeInStringFromMinutes(day.closeTime.toString())}</TableCell>
              {handleEdit ? (
                <TableCell>
                  <X
                    className="cursor-pointer"
                    color="green"
                    size={25}
                    onClick={() => {
                      handleEdit(day.name);
                    }}
                  />
                </TableCell>
              ) : null}
            </TableRow>
          ) : null,
        )}
      </TableBody>
      <TableFooter>{children}</TableFooter>
    </Table>
  );
};

export default ScheduleTable;
