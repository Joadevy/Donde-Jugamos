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

import "./style.css";
import FormSelectField from "@/components/form/FormSelectField";
import FormTimePickerField from "@/components/form/FormTimePickerField";
import {timeToMinutesDayJs} from "@/lib/utils/utils";

import FormInputField from "../../components/form/FormInputField";

const formSchema = z.object({
  name: z.string().min(2, {message: "Debe tener minimo 2 caracteres"}),
  addressName: z.string(),
  addressNumber: z.coerce.number({required_error: "Campo Requerido."}),
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

function Page() {
  const {data: session} = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      addressName: "",
      addressNumber: 0,
      cityName: "",
      cityPostalCode: "",
      phone: "",
      email: "",
      description: "",
      cbu: 0,
      alias: "",
      cancelTimeLimit: dayjs("2022-04-17T12:00"),
      paymentTimeLimit: dayjs("2022-04-17T12:00"),
      acceptPartialPayment: true,
      partialPaymentPercentage: 30,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session) {
      signIn(undefined, {redirect: false});
    } else {
      const requestBody = {
        ...values,
        userEmail: session.user.email,
        cancelTimeLimit: timeToMinutesDayJs(values.cancelTimeLimit),
        paymentTimeLimit: timeToMinutesDayJs(values.paymentTimeLimit),
      };

      fetch("/api/sportcenter", {method: "POST", body: JSON.stringify(requestBody)})
        .then((res) => res.json())
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  const acceptPartialPaymentOptions = [
    {title: "Si", value: "true"},
    {title: "No", value: "false"},
  ];

  return (
    <div className="w-11/12 mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <h2 className="[grid-area:t-about] w-full text-2xl my-8">Datos del Establecimiento</h2>
          <FormInputField
            className="[grid-area:name]"
            formControl={form.control}
            label="Nombre"
            name="name"
          />
          <FormTextAreaField
            className="[grid-area:description]"
            formControl={form.control}
            label="Description del Establecimiento"
            name="description"
          />
          <h3 className="[grid-area:t-location] text-xl my-8">Ubicación</h3>
          <FormInputField
            className="[grid-area:city]"
            formControl={form.control}
            label="Ciudad"
            name="cityName"
          />
          <FormInputField
            className="[grid-area:postal]"
            formControl={form.control}
            label="Codigo Postal"
            name="cityPostalCode"
          />
          <FormInputField
            className="[grid-area:address]"
            formControl={form.control}
            label="Direccion"
            name="addressName"
          />
          <FormInputField
            className="[grid-area:rise]"
            formControl={form.control}
            label="Altura"
            name="addressNumber"
            type="number"
          />
          <h3 className="[grid-area:t-contact] text-xl my-8">Contacto</h3>
          <FormInputField
            className="[grid-area:email]"
            formControl={form.control}
            label="Correo Electronico"
            name="email"
            type="email"
          />
          <FormInputField
            className="[grid-area:phone]"
            formControl={form.control}
            label="Telefono"
            name="phone"
          />
          <h2 className="[grid-area:t-payment-reservation] text-2xl my-8">Pagos y Reservas</h2>
          <FormSelectField
            className="[grid-area:acceptPayment]"
            description="Pago mínimo y obligatorio para la reserva"
            formControl={form.control}
            label="Admite Seña"
            name="acceptPartialPayment"
            options={acceptPartialPaymentOptions}
          />
          <FormInputField
            className="[grid-area:percentage]"
            description="Porcentaje aplicado al valor total de la cacha donde el resultado es valor minimo de la seña"
            formControl={form.control}
            label="Porcentaje de la seña"
            name="partialPaymentPercentage"
            placeholder="30% del valor total"
            type="number"
          />
          <FormInputField
            className="[grid-area:cbu]"
            formControl={form.control}
            label="CBU"
            name="cbu"
            type="number"
          />
          <FormInputField
            className="[grid-area:alias]"
            formControl={form.control}
            label="Alias"
            name="alias"
          />
          <FormTimePickerField
            ampm={false}
            className="[grid-area:cancel]"
            formControl={form.control}
            label="Tiempo previo admisible para cancelar reservas"
            name="cancelTimeLimit"
          />
          <FormTimePickerField
            ampm={false}
            className="[grid-area:payment] w-full"
            formControl={form.control}
            label="Tiempo previo admisible para realizar pago"
            name="paymentTimeLimit"
          />
          <Button className="[grid-area:submit] my-8" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default Page;
