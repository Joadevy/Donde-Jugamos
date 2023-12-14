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
import type {Sport} from "@prisma/client";

interface Iprops {
  sport?: Sport;
}

function SportForm({sport}: Iprops) {
  const {data: session} = useSession();
  const router = useRouter();
  const isUpdate = !!sport;

  const formSchema = z.object({
    name: z.string().min(2, {message: "Debe tener minimo 2 caracteres"}),
    duration: z.string().refine((value) => Number(value) > 1, {
      message: "Debe tener minimo 15 minutos de duracion",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),

    reValidateMode: "onChange",
    values: {
      name: sport?.name ?? "",
      duration: sport?.duration ? String(sport.duration) : "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!session) {
      signIn(undefined, {redirect: false});
    } else {
      const requestBody = {
        ...values,
        id: sport?.id,
      };

      fetch("/api/admin/sports", {
        method: isUpdate ? "PUT" : "POST",
        body: JSON.stringify(requestBody),
      })
        .then((res) => res.json())
        .then((res: ApiResponse) => {
          if (res.status === 200) {
            if (isUpdate) {
              successToast("Deporte actualizado!");
              router.refresh();

              return;
            }
            successToast("Estamos procesando su solicitud. Pronto veras el deporte listo");
            router.push(`/admin/deportes`);
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
          {isUpdate ? `Editar ${sport.name}` : "Generar nuevo deporte"}
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
              placeholder="Escribe el nombre del deporte..."
            />
            <FormInputField
              formControl={form.control}
              label="Duracion en minutos"
              name="duration"
              type="number"
            />
          </section>

          <Button className="mt-5 col-span-2 text-center w-fit mb-2" type="submit">
            {sport ? "Actualizar deporte" : "Dar de alta deporte"}
          </Button>
        </form>
      </Form>
    </article>
  );
}

export default SportForm;
