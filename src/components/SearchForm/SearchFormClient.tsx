/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import type {Sport} from "@prisma/client";

import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {timeToMinutes} from "@/lib/utils/utils";

import {Input} from "../ui/input";
import {Button} from "../ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import DatePickerField from "../DatePickerField/DatePickerField";

interface Location {
  name: string;
  postalCode: string;
}

// Esto capaz no deberia estar aca, pero lo dejo por ahora
export const cities: Location[] = [
  {name: "Colon", postalCode: "3280"},
  {name: "Concepcion del Uruguay", postalCode: "3260"},
];

const citiesNames = cities.map((city) => city.name);
const cityPostalCodes = cities.map((city) => city.postalCode);

interface SearchFormProps {
  className: string;
  sports: Sport[];
}

const formSchema = z.object({
  location: z.object(
    {
      name: z.enum(citiesNames as [string]),
      postalCode: z.enum(cityPostalCodes as [string]),
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

const SearchForm: React.FC<SearchFormProps> = ({className, sports}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const baseUrl = "http://localhost:3000/api/appointment";

    const queryParams = new URLSearchParams();

    queryParams.append("location", values.location.postalCode);
    queryParams.append("sport", values.sport);
    queryParams.append("date", values.date.toISOString());
    queryParams.append("time", timeToMinutes(values.time).toString());

    const response = await fetch(`${baseUrl}?${queryParams.toString()}`).catch((err) => {
      console.log(err);
    });

    console.log(await response.json());
  };

  return (
    <Form {...form}>
      <form className={`${className}`} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="location"
          render={() => (
            <FormItem className="lg:w-56">
              <FormLabel>
                <datalist id="citiesList">
                  {cities.map((city) => (
                    <option key={city.postalCode} value={city.name} />
                  ))}
                </datalist>
              </FormLabel>
              <FormControl>
                <Input
                  autoComplete="off" // Para que no se autocomplete con cualquier cosa que haya ingresado previamente
                  list="citiesList"
                  placeholder="Buscar Ciudad"
                  onChange={(e) => {
                    e.preventDefault();
                    const city = cities.find(
                      (c) => c.name.toLowerCase() === e.target.value.toLowerCase(),
                    );

                    if (city) {
                      form.setValue("location", city);
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
                  <SelectItem value="16:00">16:00 hs</SelectItem>
                  <SelectItem value="17:00">17:00 hs</SelectItem>
                  <SelectItem value="18:00">18:00 hs</SelectItem>
                  <SelectItem value="19:00">19:00 hs</SelectItem>
                  <SelectItem value="20:00">20:00 hs</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Buscar canchas</Button>
      </form>
    </Form>
  );
};

export default SearchForm;
