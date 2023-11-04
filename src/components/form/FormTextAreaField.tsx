import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";

interface PropsType {
    formControl: any,
    name: string,
    label?: string,
    placeholder?: string,
    description?: string,
    disabled?: boolean,
    className?: string,
}

const FormTextAreaField: React.FC<PropsType> = ({ formControl , name , label = '' , placeholder = '' , description = '' , disabled = false, className}) => {
    return (
        <FormField
          control={formControl}
          name={name}
          disabled={disabled}
          render={({ field }) => (
            <FormItem>
              { label && <FormLabel>{label}</FormLabel>}
              <FormControl>
                <Textarea placeholder={placeholder} className={className} {...field} />
              </FormControl>
              { description && <FormDescription>{description}</FormDescription> }
              <FormMessage />
            </FormItem>
          )}
        />
    );
}

export default FormTextAreaField;