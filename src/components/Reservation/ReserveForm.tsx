/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";

import {useToast} from "@/components/ui/use-toast";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {getRootUrl} from "@/lib/utils/utils";

import {Button, buttonVariants} from "../ui/button";
import {AlertDialogAction, AlertDialogCancel, AlertDialogFooter} from "../ui/alert-dialog";
import {Textarea} from "../ui/textarea";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";

interface SearchFormProps {
  className: string;
}

async function test() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("hi!");
    }, 2000);
  });
}

const ReserveForm: React.FC<SearchFormProps> = ({className}) => {
  const {toast} = useToast();
  const formSchema = z.object({
    observation: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // const baseUrl = `${getRootUrl()}/appointment`;

    try {
      await test();
      toast({
        title: "✅ Reserva solicitada",
        description: "Revise su correo electronico y espere confirmacion del establecimiento",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "❌ Error",
        description: "No se pudo realizar la reserva, intente nuevamente",
      });
    }

    console.log(values);
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
                onClick={async () => {
                  await onSubmit(form.getValues());
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
