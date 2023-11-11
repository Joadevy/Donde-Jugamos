/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/function-component-definition */
import {LocalizationProvider, TimePicker} from "@mui/x-date-pickers";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

import {cn} from "../../lib/utils/utils";
import {FormDescription, FormField, FormItem, FormLabel, FormMessage} from "../ui/form";
import "./style.css";

interface TimePiclerProps {
  formControl?: any;
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  ampm?: boolean;
  className?: string;
}

const FormTimePickerField: React.FC<TimePiclerProps> = ({
  formControl,
  name,
  label = "",
  placeholder = "",
  description = "",
  disabled = false,
  className,
  ampm,
}) => {
  return (
    <FormField
      control={formControl}
      disabled={disabled}
      name={name}
      render={({field}) => (
        <FormItem className={cn("", className)}>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["TimePicker"]}>
              <TimePicker
                ampm={ampm}
                className="timepicker w-full p-0 h-10 border-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                thresholdToRenderTimeInASingleColumn={28}
                value={field.value}
                onChange={field.onChange}
              />
            </DemoContainer>
          </LocalizationProvider>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormTimePickerField;
