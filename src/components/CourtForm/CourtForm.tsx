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
import {useRouter} from "next/navigation";
import type {ApiResponse} from "@/lib/types/importables/types";
import {errorToast, successToast} from "@/lib/utils/toasts";
import {Separator} from "../ui/separator";
import type {CourtFullInfo} from "@/backend/db/models/courts";
import type {Sport} from "@prisma/client";
import {useMemo} from "react";

interface Iprops {
  court?: CourtFullInfo;
  searchParams: {sportCenterId: string};
  sports: Sport[];
}

function CourtForm({court, searchParams, sports}: Iprops) {
  const {data: session} = useSession();
  const router = useRouter();
  const isUpdate = !!court;

  const sportNames = useMemo(() => {
    return sports.map((sport) => sport.name);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sportsOptions = useMemo(() => {
    return sports.map((sport) => ({title: sport.name, value: String(sport.id)}));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const formSchema = z.object({
    name: z.string().min(2, {message: "Debe tener minimo 2 caracteres"}),
    description: z.string().optional(),
    capacity: z
      .string()
      .transform(Number)
      .refine((value) => value >= 1, {message: "Debe tener minimo 1 de capacidad"}),
    price: z
      .string()
      .transform(Number)
      .refine((value) => value >= 1, {message: "Debe tener minimo 1 de valor"}),
    sportId: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: court?.name ?? "",
      description: court?.description ?? "",
      capacity: court?.capacity ?? undefined,
      price: court?.price ?? undefined,
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      sportId: String(court?.sport.id) ?? String(sports[0]?.id) ?? "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session) {
      signIn(undefined, {redirect: false});
    } else {
      const requestBody = {
        ...values,
        sportCenterId: searchParams.sportCenterId,
        id: court?.id,
      };

      fetch("/api/court/update", {
        method: isUpdate ? "PUT" : "POST",
        body: JSON.stringify(requestBody),
      })
        .then((res) => res.json())
        .then((res: ApiResponse) => {
          if (res.status === 200) {
            if (isUpdate) {
              successToast("Cancha actualizada!");
              router.refresh();

              return;
            }
            successToast("Estamos procesando su solicitud. Pronto veras tu nueva cancha lista!");
            router.push(`/establecimientos/${searchParams.sportCenterId}/canchas`);
          } else throw Error(res.message);
        })
        .catch((err) => {
          console.log({err});
          errorToast("No se pudo procesar tu solicitud, intente nuevamente");
        });
    }
  }

  return (
    <article className="flex flex-col items-center">
      <header className="p-2 w-3/4">
        <h1 className="font-bold text-primary text-xl">
          {isUpdate ? court.name : "Registra tu cancha"}
        </h1>
        <p className="italic text-slate-400">
          {isUpdate
            ? court.description
            : "Completa el formulario para dar de alta tu cancha y asociarla a tu establecimiento!"}
        </p>
        <Separator />
      </header>

      <Form {...form}>
        <form
          className="w-full lg:w-[800px] container mx-auto lg:grid lg:grid-cols-2 gap-2 lg:gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <section>
            <h2 className="w-full text-xl my-4 bg-primary text-white p-2">Datos de la cancha</h2>
            <FormInputField
              className="mb-2"
              formControl={form.control}
              label="Nombre"
              name="name"
            />
            <FormTextAreaField
              className="mb-2"
              formControl={form.control}
              label="Descripcion"
              name="description"
            />
          </section>

          <section>
            <h2 className="text-xl my-4 bg-primary text-white p-2">Capacidad y precio</h2>
            <FormInputField
              formControl={form.control}
              label="Capacidad"
              name="capacity"
              type="number"
            />
            <FormInputField
              className="mb-2"
              formControl={form.control}
              label="Valor del turno"
              name="price"
              type="number"
            />
          </section>

          <section>
            <h2 className="text-xl my-4 bg-primary text-white p-2">Deporte asociado</h2>
            <FormSelectField
              className="mb-2"
              formControl={form.control}
              label="Deporte"
              name="sportId"
              options={sportsOptions}
            />
          </section>

          <Button className="mt-5 col-span-2 text-center" type="submit">
            {court ? "Actualizar mi cancha" : "Crear mi cancha"}
          </Button>
        </form>
      </Form>
    </article>
  );
}

export default CourtForm;
