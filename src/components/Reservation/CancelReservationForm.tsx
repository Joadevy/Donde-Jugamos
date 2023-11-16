/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import type {ReservationFullInfo} from "@/backend/db/models/reservations";

import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";

import {useToast} from "@/components/ui/use-toast";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";

import {buttonVariants} from "../ui/button";
import {AlertDialogAction, AlertDialogCancel, AlertDialogFooter} from "../ui/alert-dialog";
import {Textarea} from "../ui/textarea";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import HoverInfo from "../Information/HoverInfo";

interface SearchFormProps {
  reservationInfo: ReservationFullInfo;
}

const CancelReservationForm: React.FC<SearchFormProps> = ({reservationInfo}) => {
  const {toast} = useToast();

  const router = useRouter();

  const formSchema = z.object({
    observation: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = new FormData();

      data.set("observation", values.observation ?? "");
      data.set("reservationId", String(reservationInfo.id));

      toast({
        title: "⏳ Estamos procesando tus cancelacion",
        description: "Espera un momento porfavor, te avisaremos cuando este lista",
      });
      const response: {data: string; status: number; message: string} = await fetch(
        "/api/reservation",
        {
          method: "PATCH",
          body: data,
        },
      ).then((res) => res.json());

      if (response.status !== 200) throw new Error("Error al cancelar la reserva");

      toast({
        title: "✅ Reserva cancelada",
        description: "Notificaremos al establecimiento de tu cancelacion",
      });

      router.refresh();
    } catch (error) {
      toast({
        title: "❌ Error",
        description:
          "No se pudo cancelar la reserva, intente nuevamente o comuniquese con el establecimiento",
      });
    }
  };

  return (
    <>
      <header>
        <h1 className="text-xl lg:text-2xl font-semibold">Cancela tu reserva</h1>
        <p className="text-slate-500 italic">
          Puedes escribir un mensaje al establecimiento con el motivo de tu cancelacion
        </p>
      </header>

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
                    description="Puedes enviarle un mensaje que el establecimiento recibira como motivo de tu cancelacion."
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

          <AlertDialogFooter>
            <AlertDialogCancel>Atras</AlertDialogCancel>
            <Popover>
              <PopoverTrigger className={buttonVariants({variant: "default"})}>
                Confirmar
              </PopoverTrigger>
              <PopoverContent className="border flex flex-col items-center w-fit">
                Esta seguro de cancelar tu reserva?
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
    </>
  );
};

export default CancelReservationForm;
