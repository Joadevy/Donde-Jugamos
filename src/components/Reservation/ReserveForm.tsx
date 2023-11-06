/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {useRouter} from "next/navigation";

import {useToast} from "@/components/ui/use-toast";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";

import {buttonVariants} from "../ui/button";
import {AlertDialogAction, AlertDialogCancel, AlertDialogFooter} from "../ui/alert-dialog";
import {Textarea} from "../ui/textarea";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {Input} from "../ui/input";

interface SearchFormProps {
  className: string;
  appointmentId: number;
}

const ReserveForm: React.FC<SearchFormProps> = ({className, appointmentId}) => {
  const {toast} = useToast();
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const formSchema = z.object({
    observation: z.string().optional(),
    paymentFile: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      toast({
        title: "⏳ Estamos procesando tu reserva",
        description: "Espera un momento porfavor, te avisaremos cuando este lista",
      });

      const data = new FormData();

      data.set("observation", values.observation ?? "");
      data.set("paymentFile", file ?? "");
      data.set("appointmentId", String(appointmentId));

      const response: {data: string; status: number; message: string} = await fetch(
        "/api/appointment",
        {
          method: "POST",
          body: data,
        },
      ).then((res) => res.json());

      if (response.status !== 200) throw new Error("Error al realizar la reserva");

      toast({
        title: "✅ Reserva solicitada",
        description: "Revise su correo electronico y espere confirmacion del establecimiento",
      });

      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "❌ Error",
        description: "No se pudo realizar la reserva, intente nuevamente",
      });
    }
  };

  return (
    <Form {...form}>
      <form className={`${className} flex gap-3 flex-col`}>
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

        <FormField
          control={form.control}
          name="paymentFile"
          render={(field) => (
            <FormItem>
              <FormLabel>Comprobante de pago</FormLabel>
              <FormControl className="hover:cursor-pointer">
                <Input
                  className="w-full"
                  placeholder="Selecciona el archivo..."
                  type="file"
                  onChange={(e) => {
                    field.field.onChange(e);
                    setFile(e.target.files?.[0] ?? null);
                  }}
                />
              </FormControl>
              <FormMessage className="italic text-slate-400">
                Adjunta una captura de pantalla o imagen del comprobante
              </FormMessage>
            </FormItem>
          )}
        />

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
