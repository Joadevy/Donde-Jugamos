/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import type {Sport, SportCenter, City} from "@prisma/client";

import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {getRootUrl, timeToMinutes} from "@/lib/utils/utils";

import {Input} from "../ui/input";
import {Button} from "../ui/button";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import DatePickerField from "../DatePickerField/DatePickerField";

// Esto capaz no deberia estar aca, pero lo dejo por ahora
// export const cities: City[] = [
//   {name: "Colon", postCode: "3280"},
//   {name: "Concepcion del Uruguay", postCode: "3260"},
// ];

interface SearchFormProps {
  className: string;
  sports: Sport[];
  cities: Pick<City, "name" | "postCode">[];
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

const getSportscentersWithNoAppointments = async (url: string) => {
  const response: {
    data: SportCenter[];
    status: number;
    message: string;
  } = await fetch(url)
    .then((data) => data.json())
    .catch((err) => {
      console.log(err);
    });

  return response;
};

const SearchForm: React.FC<SearchFormProps> = ({className, sports, cities}) => {
  const citiesNames = cities.map((city) => city.name);
  const citypostCodes = cities.map((city) => city.postCode);
  const formSchema = getFormSchema(citiesNames, citypostCodes);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const baseUrl = `${getRootUrl()}/api/appointment`;

    const queryParams = new URLSearchParams();

    queryParams.append("city", values.city.postCode);
    queryParams.append("sport", values.sport);
    queryParams.append("date", values.date.toISOString());
    queryParams.append("time", timeToMinutes(values.time).toString());

    const response = await getSportscentersWithNoAppointments(
      `${baseUrl}?${queryParams.toString()}`,
    );

    const {data: sportcenters} = response;

    console.log(sportcenters, response.message);
  };

  return (
    <Form {...form}>
      <form className={`${className}`} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="city"
          render={() => (
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
