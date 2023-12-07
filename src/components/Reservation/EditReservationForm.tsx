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
import {useRef, useState} from "react";
import {useRouter} from "next/navigation";

import {useToast} from "@/components/ui/use-toast";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";

import {buttonVariants} from "../ui/button";
import {AlertDialogAction, AlertDialogCancel, AlertDialogFooter} from "../ui/alert-dialog";
import {Textarea} from "../ui/textarea";
import {Popover, PopoverContent, PopoverTrigger} from "../ui/popover";
import {Input} from "../ui/input";
import HoverInfo from "../Information/HoverInfo";

import PaymentConfirmationThumbnail from "./Propietary/PaymentConfirmation";

interface SearchFormProps {
  reservationInfo: ReservationFullInfo;
}

const EditReservationForm: React.FC<SearchFormProps> = ({reservationInfo}) => {
  const {toast} = useToast();
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();
  const imgRef = useRef<null | HTMLImageElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    reservationInfo.paymentConfirmation,
  );

  // Funcion auxiliar para abrir la imagen del comprobante pago a fullscreen
  const openFullscreen = () => {
    if (!imgRef.current) return;

    const imgEl: any = imgRef.current;

    if (imgEl.requestFullscreen) {
      imgEl.requestFullscreen();
    } else if (imgEl.mozRequestFullScreen) {
      /* Firefox */
      imgEl.mozRequestFullScreen();
    } else if (imgEl.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      imgEl.webkitRequestFullscreen();
    } else if (imgEl.msRequestFullscreen) {
      /* IE/Edge */
      imgEl.msRequestFullscreen();
    }
  };

  const formSchema = z.object({
    observation: z.string().optional(),
    paymentFile: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      observation: reservationInfo.observation ?? "",
      paymentFile: reservationInfo.paymentConfirmation ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const data = new FormData();

      data.set("observation", values.observation ?? "");
      data.set("paymentFile", file ?? "");
      data.set("reservationId", String(reservationInfo.id));

      toast({
        title: "⏳ Estamos procesando tus cambios",
        description: "Espera un momento porfavor, te avisaremos cuando este lista",
      });
      const response: {data: string; status: number; message: string} = await fetch(
        "/api/reservation",
        {
          method: "PUT",
          body: data,
        },
      ).then((res) => res.json());

      if (response.status !== 200) throw new Error("Error al actualizar la reserva");

      toast({
        title: "✅ Reserva actualizada",
        description: "Espere respuesta del establecimiento",
      });

      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: "❌ Error",
        description: "No se pudo actualizar la reserva, intente nuevamente",
      });
    }
  };

  return (
    <>
      <header>
        <h1 className="text-xl lg:text-2xl font-semibold">Edita tu reserva</h1>
        <p className="text-slate-500 italic">
          Aqui puedes modificar tu mensaje al establecimiento{" "}
          {reservationInfo.appointment.court.sportCenter.acceptPartialPayment
            ? "o adjuntar tu comprobante del pago"
            : ""}
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
                    description="Puedes enviarle un mensaje que el establecimiento recibira junto con tu solicitud."
                    title="Mensaje al establecimiento"
                  />
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="w-full"
                    defaultValue={reservationInfo.observation ?? ""}
                    placeholder="Escribe una mensaje al establecimiento..."
                    onChange={field.field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {reservationInfo.appointment.court.sportCenter.acceptPartialPayment ? (
            <FormField
              control={form.control}
              name="paymentFile"
              render={(field) => (
                <FormItem>
                  <FormLabel className="flex flex-col gap-2 mb-2">
                    <div className="flex gap-1 items-center">
                      <p>Comprobante de pago por adelantado</p>
                      <HoverInfo
                        description="Puedes hacerlo ahora o mas tarde aunque el establecimiento podria cancelar tu reserva."
                        title="Pago por adelantado"
                      />
                    </div>
                  </FormLabel>
                  <FormControl className="hover:cursor-pointer">
                    <Input
                      accept="image/*"
                      className=""
                      placeholder={
                        reservationInfo.paymentConfirmation
                          ? "Editar comprobante"
                          : "Selecciona el archivo..."
                      }
                      type="file"
                      onChange={(e) => {
                        if (!e.target.files?.[0]) return;

                        if (e.target.files[0].size > 1000000) {
                          toast({
                            title: "❌ Error",
                            description: "El archivo es demasiado grande",
                          });

                          return;
                        }

                        const reader = new FileReader();

                        reader.readAsDataURL(e.target.files[0]);

                        reader.onload = () => {
                          if (e.target.files?.[0].type.includes("image")) {
                            setImagePreview(reader.result as string);
                          }
                        };

                        field.field.onChange(e);
                        setFile(e.target.files[0]);
                      }}
                    />
                  </FormControl>
                  <FormMessage className="italic text-slate-400">
                    Adjunta una captura de pantalla o imagen del comprobante
                  </FormMessage>
                  {imagePreview ? (
                    <PaymentConfirmationThumbnail description paymentConfirmation={imagePreview} />
                  ) : null}
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
                Esta seguro de confirmar los cambios en tu reserva?
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

export default EditReservationForm;
