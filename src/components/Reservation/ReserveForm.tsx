/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import type {SportCenterInformation} from "./ReservationClip";

import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {useRouter} from "next/navigation";

import {useToast} from "@/components/ui/use-toast";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {timeInStringFromMinutes} from "@/lib/utils/utils";

import {buttonVariants} from "../ui/button";
import {AlertDialogAction, AlertDialogCancel, AlertDialogFooter} from "../ui/alert-dialog";
import {Textarea} from "../ui/textarea";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {Input} from "../ui/input";
import HoverInfo from "../Information/HoverInfo";

interface SearchFormProps {
  appointmentId: number;
  sportCenterInfo: SportCenterInformation;
}

const ReserveForm: React.FC<SearchFormProps> = ({appointmentId, sportCenterInfo}) => {
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
      <form className="flex gap-4 flex-col">
        <FormField
          control={form.control}
          name="observation"
          render={(field) => (
            <FormItem>
              <FormLabel className="flex gap-1 items-center">
                <p>Mensaje</p>
                <HoverInfo
                  description="Puedes enviarle un mensaje que el establecimiento recibira junto con tu solicitud."
                  title="Mensaje al establecimiento"
                />
              </FormLabel>
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

        {sportCenterInfo.acceptPartialPayment ? (
          <FormField
            control={form.control}
            name="paymentFile"
            render={(field) => (
              <FormItem>
                <FormLabel className="flex flex-col gap-2 mb-2">
                  <div className="flex gap-1 items-center">
                    <p>Comprobante de pago por adelantado</p>
                    <HoverInfo
                      description={`Puedes hacerlo ahora o mas tarde, tienes tiempo hasta las ${timeInStringFromMinutes(
                        String(
                          new Date().getHours() * 60 +
                            new Date().getMinutes() +
                            sportCenterInfo.paymentTimeLimit,
                        ),
                      )} hs para pagar.`}
                      title="Pago por adelantado"
                    />
                  </div>
                </FormLabel>
                <FormControl className="hover:cursor-pointer">
                  <Input
                    accept="image/*"
                    className=""
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
        ) : (
          <FormMessage className="text-slate-400 italic">
            Este establecimiento no requiere pago por adelantado
          </FormMessage>
        )}

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
