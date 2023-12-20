import type {Control, FieldValue, FieldValues} from "react-hook-form";

import {cn} from "@/lib/utils/utils";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {Textarea} from "../ui/textarea";

interface PropsType {
  formControl: Control<FieldValue<FieldValues>>;
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

function FormTextAreaField({
  formControl,
  name,
  label = "",
  placeholder = "",
  description = "",
  disabled = false,
  className,
}: PropsType) {
  return (
    <FormField
      control={formControl}
      disabled={disabled}
      name={name}
      render={({field}) => (
        <FormItem className={cn("", className)}>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <FormControl>
            <Textarea placeholder={placeholder} {...field} />
          </FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default FormTextAreaField;
