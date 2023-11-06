"use client";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";

import {Form} from "@/components/ui/form";
import {Button} from "@/components/ui/button";
import FormTextAreaField from "@/components/form/FormTextAreaField";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";

import TimePickerUI from "../../components/TimePicker/time-picker";
import FormInputField from "../../components/form/FormInputField";

import "./style.css";
import FormSelectField from "@/components/form/FormSelectField";
import FormTimePickerField from "@/components/form/FormTimePickerField";
import { timeInStringFromMinutes } from "@/lib/utils/utils";
import dayjs from "dayjs";

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
  reservationCancelTolerance: z.any().optional(),
  paymentTolerance: z.number().optional(),
  acceptPartialPayment: z.coerce.boolean(),
  partialPaymentPercentage: z.coerce.number(),
});

function Page() {
  //   const [fullTime, setFullTime] = useState(true);

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
      cbu: undefined,
      alias: "",
      reservationCancelTolerance: dayjs('2022-04-17T3:30'),
      paymentTolerance: 180,
      acceptPartialPayment: true,
      partialPaymentPercentage: 30,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const acceptPartialPaymentOptions = [
    {title: "Si", value: "true"},
    {title: "No", value: "false"},
  ];

  return (
    <div className="container mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <h2 className="[grid-area:t-about] text-2xl mt-4 mb-2">Datos del Establecimiento</h2>
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
          <h3 className="[grid-area:t-location] text-xl mt-4 mb-2">Ubicación</h3>
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
          <h3 className="[grid-area:t-contact] text-xl mt-4 mb-2">Contacto</h3>
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
          <h2 className="[grid-area:t-payment-reservation] text-2xl mt-4 mb-2">Pagos y Reservas</h2>
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
            <FormTimePickerField className="[grid-area:cancel]"
            formControl={form.control}
            ampm={false}
            label="Tiempo previo admisible para cancelar reservas"
            name="reservationCancelTolerance" />
          <FormTimePickerField className="[grid-area:payment]"
            formControl={form.control}
            ampm={false}
            label="Tiempo previo admisible para realizar pago"
            name="paymentTolerance" />
          <Button className="[grid-area:submit]" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default Page;

{
  /* {fullTime ? (
  <>
    <TimePickerUI />
    <TimePickerUI />
  </>
) : (
  <>
    <TimePickerUI />
    <TimePickerUI />
    <TimePickerUI />
    <TimePickerUI />
  </>
)}
<div>
  <Label>Horario de Apertura</Label>
  <RadioGroup
    className="flex"
    defaultValue={fullTime.toString()}
    onValueChange={handleRadioGroupValueChange}
  >
    <div className="flex items-center space-x-2">
      <RadioGroupItem id="fullTime" value="true" />
      <Label htmlFor="fullTime">Tiempo Completo</Label>
    </div>
    <div className="flex items-center space-x-2">
      <RadioGroupItem id="partialTime" value="false" />
      <Label htmlFor="partialTime">Tiempo Parcial</Label>
    </div>
  </RadioGroup>
</div> */
}
