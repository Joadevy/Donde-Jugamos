/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/function-component-definition */
import {format} from "date-fns";
import {Calendar as CalendarIcon} from "lucide-react";

import {cn} from "@/lib/utils/utils";

import {Button} from "../ui/button";
import {FormControl, FormField, FormItem, FormMessage} from "../ui/form";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {Calendar} from "../ui/calendar";

interface DatePickerFieldProps {
  control: any;
  name: string;
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({control, name = ""}) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({field}) => (
        <FormItem className="flex flex-col">
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  className={cn(
                    "w-[215px] pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground",
                  )}
                  variant="outline"
                >
                  {field.value ? format(field.value, "PPP") : <span>Seleccionar Fecha</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                initialFocus
                disabled={(date) => {
                  const today = new Date();

                  date.setHours(0, 0, 0, 0);
                  today.setHours(0, 0, 0, 0);

                  return date < today;
                }}
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default DatePickerField;
