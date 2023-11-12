/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import {useSession, signIn} from "next-auth/react";

import {Form} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import FormTextAreaField from "@/components/form/FormTextAreaField";

import FormSelectField from "@/components/form/FormSelectField";
import FormTimePickerField from "@/components/form/FormTimePickerField";
import {cn, timeToMinutesDayJs} from "@/lib/utils/utils";

import FormInputField from "../../components/form/FormInputField";
import {useState} from "react";
import {useToast} from "@/components/ui/use-toast";
import {useRouter} from "next/navigation";
import type {ApiResponse} from "@/lib/types/importables/types";

const formSchema = z.object({
  name: z.string().min(2, {message: "Debe tener minimo 2 caracteres"}),
  address: z.string(),
  cityName: z.string(),
  cityPostalCode: z.string(),
  email: z.string(),
  phone: z.string(),
  description: z.string(),
  cbu: z.coerce.number().optional(),
  alias: z.string().optional(),
  cancelTimeLimit: z.any().optional(),
  paymentTimeLimit: z.any().optional(),
  acceptPartialPayment: z.coerce.boolean(),
  partialPaymentPercentage: z.coerce.number(),
});

const acceptPartialPaymentOptions = [
  {title: "Si", value: "true"},
  {title: "No", value: "false"},
];

function Page() {
  const {data: session} = useSession();
  const {toast} = useToast();
  const [payment, setPayment] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      cityName: "",
      cityPostalCode: "",
      phone: "",
      email: "",
      description: "",
      cbu: 0,
      alias: "",
      cancelTimeLimit: dayjs("2022-04-17T12:00"),
      paymentTimeLimit: dayjs("2022-04-17T12:00"),
      acceptPartialPayment: payment,
      partialPaymentPercentage: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session) {
      signIn(undefined, {redirect: false});
    } else {
      toast({
        title: "⏳ Estamos procesando la solicitud",
        description: "Pronto te llegará un correo electrónico con la confirmación!",
      });

      const requestBody = {
        ...values,
        userEmail: session.user.email,
        cancelTimeLimit: timeToMinutesDayJs(values.cancelTimeLimit),
        paymentTimeLimit: timeToMinutesDayJs(values.paymentTimeLimit),
      };

      fetch("/api/sportcenter", {method: "POST", body: JSON.stringify(requestBody)})
        .then((res) => res.json())
        .then((res: ApiResponse) => {
          if (res.status === 200) {
            router.push("../propietario");
          } else {
            toast({
              title: "❌ Error",
              description: "No se pudo procesar tu solicitud, intente nuevamente",
            });
          }
        })
        .catch((err) => {
          toast({
            title: "❌ Error",
            description: "No se pudo procesar tu solicitud, intente nuevamente",
          });
        });
    }
  }

  return (
    <div className="">
      <section className="h-44 bg-green-500 text-white text-4xl font-medium text-center flex items-center justify-center">
        ¿Dónde Jugamos?
      </section>
      <section>
        <Form {...form}>
          <form
            className="w-[600px] container mx-auto flex flex-col gap-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <h2 className="w-full text-2xl my-6">Datos del Establecimiento</h2>
            <FormInputField formControl={form.control} label="Nombre" name="name" />
            <FormTextAreaField
              formControl={form.control}
              label="Description del Establecimiento"
              name="description"
            />
            <h3 className="text-xl my-6">Ubicación</h3>
            <FormInputField formControl={form.control} label="Ciudad" name="cityName" />
            <FormInputField
              formControl={form.control}
              label="Codigo Postal"
              name="cityPostalCode"
            />
            <FormInputField formControl={form.control} label="Direccion" name="address" />
            <h3 className="text-xl my-6">Contacto</h3>
            <FormInputField
              formControl={form.control}
              label="Correo Electronico"
              name="email"
              type="email"
            />
            <FormInputField formControl={form.control} label="Telefono" name="phone" />
            <h2 className=" text-2xl my-6">Pagos y Reservas</h2>
            <FormSelectField
              formControl={form.control}
              label="¿Es necesario realizar una seña para reservar?"
              name="acceptPartialPayment"
              options={acceptPartialPaymentOptions}
              onValueChange={setPayment}
            />
            <FormInputField
              className={cn("", payment ? "" : "hidden")}
              description="Aplicado sobre el valor total del turno"
              formControl={form.control}
              label="Valor mínimo de la seña (en porcentaje %)"
              name="partialPaymentPercentage"
              placeholder="30% del valor total"
              type="number"
            />
            <FormTimePickerField
              ampm={false}
              className={cn("w-full", payment ? "" : "hidden")}
              formControl={form.control}
              label="¿Cuánto tiempo tengo para realizar el pago de la seña?"
              name="paymentTimeLimit"
            />
            <FormInputField formControl={form.control} label="CBU" name="cbu" type="number" />
            <FormInputField formControl={form.control} label="Alias" name="alias" />
            <FormTimePickerField
              ampm={false}
              formControl={form.control}
              label="¿Cuánto tiempo antes del turno tengo para cancelar al reserva?"
              name="cancelTimeLimit"
            />

            <Button className="my-8" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </section>
    </div>
  );
}

export default Page;
