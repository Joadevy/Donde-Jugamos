/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {getRootUrl} from "@/lib/utils/utils";

import {Button, buttonVariants} from "../ui/button";
import {AlertDialogAction, AlertDialogCancel, AlertDialogFooter} from "../ui/alert-dialog";
import {Textarea} from "../ui/textarea";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";

interface SearchFormProps {
  className: string;
}

const ReserveForm: React.FC<SearchFormProps> = ({className}) => {
  const [isLoading, setIsLoading] = useState(false);
  const formSchema = z.object({
    observation: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    // const baseUrl = `${getRootUrl()}/appointment`;

    console.log(values);
    console.log("hi!");
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form className={`${className}`}>
        <FormField
          control={form.control}
          name="observation"
          render={(field) => (
            <FormItem>
              <FormLabel>Mensaje</FormLabel>
              <FormControl>
                <Textarea
                  className="w-full"
                  placeholder="Escribe una mensaje al establecimiento..."
                  onChange={field.field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="mt-2"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          Adjuntar comprobante
        </Button>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Popover>
            <PopoverTrigger className={buttonVariants({variant: "default"})}>
              Confirmar
            </PopoverTrigger>
            <PopoverContent className="border flex flex-col items-center w-fit">
              Esta seguro de iniciar la reserva?
              <AlertDialogAction
                role="button"
                type="submit"
                onClick={() => {
                  onSubmit(form.getValues());
                }}
              >
                Aceptar
              </AlertDialogAction>
            </PopoverContent>
          </Popover>
        </AlertDialogFooter>
      </form>
    </Form>
  );
};

export default ReserveForm;
