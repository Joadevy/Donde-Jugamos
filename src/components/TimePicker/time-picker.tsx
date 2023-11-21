/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/function-component-definition */
import type {PickerChangeHandlerContext, TimeValidationError} from "@mui/x-date-pickers";

import {LocalizationProvider, TimePicker} from "@mui/x-date-pickers";
import {DemoContainer} from "@mui/x-date-pickers/internals/demo";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

import {cn} from "../../lib/utils/utils";

interface TimePickerProps {
  label?: string;
  ampm?: boolean;
  className?: string;
  value?: any;
  onChange?:
    | ((value: any, context: PickerChangeHandlerContext<TimeValidationError>) => void)
    | undefined;
}

const TimePickerUI: React.FC<TimePickerProps> = ({label, ampm, value, onChange, className}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["TimePicker"]}>
        <TimePicker
          ampm={ampm}
          className={cn("", className)}
          label={label}
          value={value}
          onChange={onChange}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
};

export default TimePickerUI;
