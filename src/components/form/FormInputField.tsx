import {cn} from "@/lib/utils/utils";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {Input} from "../ui/input";

interface PropsType {
  formControl: any;
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  type?: string;
  className?: string;
}

const FormInputField: React.FC<PropsType> = ({
  formControl,
  name,
  label = "",
  placeholder = "",
  description = "",
  disabled = false,
  type = "text",
  className,
}) => {
  return (
    <FormField
      control={formControl}
      disabled={disabled}
      name={name}
      render={({field}) => (
        <FormItem className={cn("", className)}>
          {label ? <FormLabel>{label}</FormLabel> : null}
          <FormControl>
            <Input placeholder={placeholder} {...{...field, type: type}} />
          </FormControl>
          {description ? <FormDescription>{description}</FormDescription> : null}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInputField;
