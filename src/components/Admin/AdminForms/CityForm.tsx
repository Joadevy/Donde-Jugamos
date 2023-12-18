/* eslint-disable import/order */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSession, signIn} from "next-auth/react";

import {Form} from "@/components/ui/form";
import {Button} from "@/components/ui/button";

import FormInputField from "../../../components/form/FormInputField";
import {useRouter} from "next/navigation";
import type {ApiResponse} from "@/lib/types/importables/types";
import {errorToast, successToast} from "@/lib/utils/toasts";
import {Separator} from "../../ui/separator";
import type {City} from "@prisma/client";
import FormSelectField from "@/components/form/FormSelectField";

interface Iprops {
  city?: City;
}

function CityForm({city}: Iprops) {
  const {data: session} = useSession();
  const router = useRouter();
  const isUpdate = !!city;

  const formSchema = z.object({
    name: z.string().min(2, {message: "Debe tener minimo 2 caracteres"}),
    postCode: z.string().min(2, {
      message: "Debe tener minimo 2 numeros de longitud",
    }),
    active: z.enum(["true", "false"]),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    reValidateMode: "onChange",
    values: {
      name: city?.name ?? "",
      postCode: city?.postCode ? city.postCode : "",
      active: city?.active ? (String(city.active) as "true") : "false",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session) {
      signIn(undefined, {redirect: false});
    } else {
      const requestBody = {
        ...values,
        id: city?.id,
      };

      fetch("/api/admin/cities", {
        method: isUpdate ? "PUT" : "POST",
        body: JSON.stringify(requestBody),
      })
        .then((res) => res.json())
        .then((res: ApiResponse) => {
          if (res.status === 200) {
            if (isUpdate) {
              successToast("Ciudad actualizada!");

              return;
            }
            successToast("Estamos procesando su solicitud. Pronto veras la ciudad lista");
            router.push(`/admin/ciudades`);
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
      <header className="p-4 w-11/12">
        <h1 className="font-bold text-primary text-xl">
          {isUpdate ? `Editar ${city.name}` : "Generar nueva ciudad"}
        </h1>

        <Separator />
      </header>

      <Form {...form}>
        <form
          className="w-full lg:w-[800px] container mx-auto lg:grid lg:grid-cols-2 gap-2 lg:gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <section>
            <FormInputField
              className="mb-2"
              formControl={form.control}
              label="Nombre"
              name="name"
              placeholder="Escribe el nombre de la ciudad..."
            />

            <FormInputField
              className="mb-2"
              formControl={form.control}
              label="Codigo postal"
              name="postCode"
              placeholder="Escribe el codigo postal dè la ciudad..."
            />

            <FormSelectField
              className="mb-2"
              formControl={form.control}
              label="Estado"
              name="active"
              options={[
                {title: "Inactivo", value: "false"},
                {title: "Activo", value: "true"},
              ]}
              placeholder="Estado del deporte"
            />
          </section>

          <Button className="mt-5 col-span-2 text-center w-fit mb-2" type="submit">
            {city ? "Actualizar ciudad" : "Dar de alta ciudad"}
          </Button>
        </form>
      </Form>
    </article>
  );
}

export default CityForm;
