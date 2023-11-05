/* eslint-disable react/function-component-definition */

import {cn} from "@/lib/utils/utils";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select";

export interface FormSelectFieldOptions {
  title: string;
  value: string;
}

interface PropsType {
  formControl: any;
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
  options: FormSelectFieldOptions[];
}

const FormSelectField: React.FC<PropsType> = ({
  formControl,
  name,
  label = "",
  placeholder = "",
  description = "",
  disabled = false,
  className,
  options = [],
}) => {
  return (
    <FormField
      control={formControl}
      disabled={disabled}
      name={name}
      render={({field}) => (
        <FormItem className={cn("", className)}>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <Select defaultValue={field.value} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.length
                ? options.map((option, index) => (
                    <SelectItem key={index} value={option.value}>
                      {option.title}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormSelectField;
