import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { cn } from '../../lib/utils/utils';

interface TimePickerProps {
  label?: string;
  ampm?: boolean;
  className?: string;
}

const TimePickerUI: React.FC<TimePickerProps> = ({label, ampm, className}) => {

   return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={['TimePicker']}>
        <TimePicker label={label} ampm={ampm} className={cn('',className)} />
      </DemoContainer>
    </LocalizationProvider>
   );
}

export default TimePickerUI;