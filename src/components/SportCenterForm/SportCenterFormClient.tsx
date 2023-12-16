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
import {cn, minutesToTimeDayJs, timeToMinutesDayJs} from "@/lib/utils/utils";

import FormInputField from "../../components/form/FormInputField";
import {useState} from "react";
import {useRouter} from "next/navigation";
import type {ApiResponse} from "@/lib/types/importables/types";
import {errorToast, successToast} from "@/lib/utils/toasts";
import type {SportCentersWithUserAndCity} from "@/backend/db/models/sportsCenters";
import {Separator} from "../ui/separator";

const formSchema = z.object({
  name: z.string().min(2, {message: "Debe tener minimo 2 caracteres"}),
  address: z.string(),
  cityName: z.string(),
  cityPostalCode: z.string(),
  email: z.string(),
  phone: z.string(),
  description: z.string(),
  cbu: z.string().optional(),
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

interface Iprops {
  sportCenter?: SportCentersWithUserAndCity; // No deberia ser todo este tipo creeria
}

function SportCenterFormClient({sportCenter}: Iprops) {
  const {data: session} = useSession();
  const [payment, setPayment] = useState(sportCenter?.acceptPartialPayment ?? true);
  const router = useRouter();
  const isUpdate = !!sportCenter;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: sportCenter?.name ?? "",
      address: sportCenter?.address ?? "",
      cityName: sportCenter?.city.name ?? "",
      cityPostalCode: sportCenter?.city.postCode ?? "",
      phone: sportCenter?.phone ?? "",
      email: sportCenter?.email ?? "",
      description: sportCenter?.description ?? "",
      cbu: sportCenter?.CBU ?? "",
      alias: sportCenter?.Alias ?? "",
      cancelTimeLimit: isUpdate
        ? minutesToTimeDayJs(sportCenter.cancelTimeLimit)
        : dayjs("2022-04-17T12:00"),
      paymentTimeLimit: isUpdate
        ? minutesToTimeDayJs(sportCenter.paymentTimeLimit)
        : dayjs("2022-04-17T12:00"),
      acceptPartialPayment: sportCenter?.acceptPartialPayment ?? payment,
      partialPaymentPercentage: sportCenter?.partialPaymentPercentage ?? 30,
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
        sportCenterId: sportCenter?.id,
        acceptPartialPayment: payment,
      };

      fetch("/api/sportcenter", {
        method: isUpdate ? "PUT" : "POST",
        body: JSON.stringify(requestBody),
      })
        .then((res) => res.json())
        .then((res: ApiResponse) => {
          if (res.status === 200) {
            if (isUpdate) {
              successToast("Establecimiento actualizado!");
              router.refresh();

              return;
            }
            successToast(
              "Estamos procesando su solicitud. Pronto le llegará un correo electrónico con la confirmación!",
            );
            router.push("/establecimientos");
          } else throw Error(res.message);
        })
        .catch((err) => {
          console.log({err});
          errorToast("No se pudo procesar tu solicitud, intente nuevamente");
        });
    }
  }

  return (
    <article className={!isUpdate ? "flex flex-col items-center" : ""}>
      <header className={"p-2 " + (!isUpdate ? "w-3/4" : "")}>
        <h1 className="font-bold text-primary text-xl">
          {isUpdate ? sportCenter.name : "Registra tu establecimiento"}
        </h1>
        <p className="italic text-slate-400">
          {isUpdate
            ? sportCenter.description
            : "A la brevedad te contactaremos para que comencemos a trabajar juntos!"}
        </p>
        <Separator />
      </header>

      <Form {...form}>
        <form
          className="w-full lg:w-[800px] container mx-auto lg:grid lg:grid-cols-2 gap-2 lg:gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <section>
            <h2 className="w-full text-xl my-4 bg-primary text-white p-2">
              Datos del Establecimiento
            </h2>
            <FormInputField
              className="mb-2"
              formControl={form.control}
              label="Nombre"
              name="name"
            />
            <FormTextAreaField
              className="mb-2"
              formControl={form.control}
              label="Description del Establecimiento"
              name="description"
            />
          </section>

          <section>
            <h2 className="text-xl my-4 bg-primary text-white p-2">Ubicación</h2>
            <FormInputField formControl={form.control} label="Ciudad" name="cityName" />
            <FormInputField
              className="mb-2"
              formControl={form.control}
              label="Codigo Postal"
              name="cityPostalCode"
            />
            <FormInputField
              className="mb-2"
              formControl={form.control}
              label="Direccion"
              name="address"
            />
          </section>

          <section>
            <h2 className="text-xl my-4 bg-primary text-white p-2">Contacto</h2>
            <FormInputField
              className="mb-2"
              formControl={form.control}
              label="Correo Electronico"
              name="email"
              type="email"
            />
            <FormInputField
              className="mb-2"
              formControl={form.control}
              label="Telefono"
              name="phone"
            />
          </section>

          <section>
            <h2 className="text-xl my-4 bg-primary text-white p-2">Pagos y Reservas</h2>
            <FormSelectField
              className="mb-2"
              formControl={form.control}
              label="¿Es necesario realizar una seña para reservar?"
              name="acceptPartialPayment"
              options={acceptPartialPaymentOptions}
              onValueChange={() => {
                setPayment(!payment);
              }}
            />
            <FormInputField
              className={cn("mb-2 ", payment ? "" : "hidden")}
              description="Aplicado sobre el valor total del turno"
              formControl={form.control}
              label="Valor de la seña (en porcentaje)"
              name="partialPaymentPercentage"
              placeholder="30% del valor total por defecto"
              type="number"
            />
            <FormTimePickerField
              ampm={false}
              className={cn("w-full mb-2 ", payment ? "" : "hidden")}
              formControl={form.control}
              label="¿Cuántas horas se tiene, antes del turno, para realizar el pago de la seña?"
              name="paymentTimeLimit"
            />
            <FormInputField
              className="mb-2"
              formControl={form.control}
              label="CBU"
              name="cbu"
              type="number"
            />
            <FormInputField
              className="mb-2"
              formControl={form.control}
              label="Alias"
              name="alias"
            />
            <FormTimePickerField
              ampm={false}
              className="mb-2"
              formControl={form.control}
              label="¿Cuántas horas se tiene, antes del turno, para cancelar la reserva?"
              name="cancelTimeLimit"
            />
          </section>

          <Button className="mt-5 col-span-2 text-center" type="submit">
            {sportCenter ? "Actualizar mi establecimiento" : "Crear mi establecimiento"}
          </Button>
        </form>
      </Form>
    </article>
  );
}

export default SportCenterFormClient;
