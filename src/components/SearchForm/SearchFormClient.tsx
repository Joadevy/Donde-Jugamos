/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import type {Sport, City} from "@prisma/client";
import type {DefaultSearchFormValues} from "./SearchFormServer";

import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useState} from "react";
import {useRouter} from "next/navigation";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {getRootUrl, timeInStringFromMinutes, timeToMinutes} from "@/lib/utils/utils";

import {Input} from "../ui/input";
import {Button} from "../ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import DatePickerField from "../DatePickerField/DatePickerField";

interface SearchFormProps {
  className: string;
  sports: Sport[];
  cities: Pick<City, "name" | "postCode">[];
  defaultValues: DefaultSearchFormValues;
}

const getFormSchema = (citiesNames: string[], citypostCodes: string[]) => {
  return z.object({
    city: z.object(
      {
        name: z.enum(citiesNames as [string]),
        postCode: z.enum(citypostCodes as [string]),
      },
      {
        required_error: "Ciudad no valida", // Truquito parche para que maneje bien el error
      },
    ),
    sport: z.string({
      required_error: "Requerido",
    }),
    date: z.date({
      required_error: "Requerido",
      invalid_type_error: "Fecha no valida",
    }),
    time: z.string({
      required_error: "Requerido",
    }),
  });
};

const SearchForm: React.FC<SearchFormProps> = ({className, sports, cities, defaultValues}) => {
  const citiesNames = cities.map((city) => city.name);
  const citypostCodes = cities.map((city) => city.postCode);
  const formSchema = getFormSchema(citiesNames, citypostCodes);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: defaultValues.date ? new Date(defaultValues.date) : new Date(),
      sport: defaultValues.sport ? defaultValues.sport : "",
      time: defaultValues.time ? timeInStringFromMinutes(defaultValues.time) : "",
      city: cities.find((city) => city.postCode === defaultValues.city),
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // setIsLoading(true);
    const baseUrl = `${getRootUrl()}/appointment`;

    const queryParams = new URLSearchParams();

    queryParams.append("city", values.city.postCode);
    queryParams.append("sport", values.sport);
    queryParams.append("date", values.date.toISOString());
    queryParams.append("time", timeToMinutes(values.time).toString());

    router.push(`${baseUrl}?${queryParams.toString()}`);
  };

  return (
    <main className="flex flex-col gap-2">
      <Form {...form}>
        <form className={`${className}`} onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="city"
            render={(field) => (
              <FormItem className="lg:w-56">
                <FormLabel>
                  <datalist id="citiesList">
                    {cities.map((city) => (
                      <option key={city.postCode} value={city.name} />
                    ))}
                  </datalist>
                </FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off" // Para que no se autocomplete con cualquier cosa que haya ingresado previamente
                    defaultValue={field.formState.defaultValues?.city?.name}
                    list="citiesList"
                    placeholder="Buscar Ciudad"
                    onChange={(e) => {
                      e.preventDefault();
                      const city = cities.find(
                        (c) => c.name.toLowerCase() === e.target.value.toLowerCase(),
                      );

                      if (city) {
                        form.setValue("city", city);
                      }
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sport"
            render={({field}) => (
              <FormItem className="lg:w-36">
                {/* <FormLabel>Deporte</FormLabel> */}
                <Select defaultValue={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Elige Deporte" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sports.map((sport) => (
                      <SelectItem key={sport.id} value={sport.name}>
                        {sport.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <DatePickerField control={form.control} name="date" />

          <FormField
            control={form.control}
            name="time"
            render={({field}) => (
              <FormItem className="lg:w-32">
                {/* <FormLabel>Hora Desde</FormLabel> */}
                <Select defaultValue={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Elige Hora" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="08:00">8:00 hs</SelectItem>
                    <SelectItem value="09:00">9:00 hs</SelectItem>
                    <SelectItem value="10:00">10:00 hs</SelectItem>
                    <SelectItem value="12:00">12:00 hs</SelectItem>
                    <SelectItem value="18:00">18:00 hs</SelectItem>
                    <SelectItem value="19:00">19:00 hs</SelectItem>
                    <SelectItem value="20:00">20:00 hs</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="lg:w-32" disabled={isLoading} type="submit">
            <p className={isLoading ? "animate-spin" : ""}>{isLoading ? "↻" : "Buscar canchas"}</p>
          </Button>
        </form>
      </Form>
    </main>
  );
};

export default SearchForm;
