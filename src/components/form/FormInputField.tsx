import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

interface PropsType {
    formControl: any,
    name: string,
    label?: string,
    placeholder?: string,
    description?: string,
    disabled?: boolean,
    type?: string,
    className?: string,
}

const FormInputField: React.FC<PropsType> = ({ formControl , name , label = '' , placeholder = '' , description = '' , disabled = false , type = 'text', className}) => {
    return (
        <FormField
          control={formControl}
          name={name}
          disabled={disabled}
          render={({ field }) => (
            <FormItem>
              { label && <FormLabel>{label}</FormLabel>}
              <FormControl>
                <Input placeholder={placeholder} className={className} {...{...field, type: type}} />
              </FormControl>
              { description && <FormDescription>{description}</FormDescription> }
              <FormMessage />
            </FormItem>
          )}
        />
    )
}

export default FormInputField;