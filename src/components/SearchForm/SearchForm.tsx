/* eslint-disable react/function-component-definition */
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";

import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";

import {Input} from "../ui/input";
import {Button} from "../ui/button";
import {DatePicker} from "../ui/datepicker";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "../ui/select";
import DatePickerField from "../DatePickerField/DatePickerField";

interface SearchFormProps {
  className: string;
}

const formSchema = z.object({
  location: z.string(),
  sport: z.string(),
  date: z.date(),
  time: z.string(),
});

const SearchForm: React.FC<SearchFormProps> = ({className}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      sport: "",
      date: new Date(),
      time: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <Form {...form}>
      <form className={`${className}`} onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="location"
          render={({field}) => (
            <FormItem>
              {/* <FormLabel>Ciudad</FormLabel> */}
              <FormControl>
                <Input placeholder="Ciudad" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sport"
          render={({field}) => (
            <FormItem>
              {/* <FormLabel>Deporte</FormLabel> */}
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Deportes" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="padel">Padel</SelectItem>
                  <SelectItem value="futbol">Futbol</SelectItem>
                  <SelectItem value="basquet">Basquet</SelectItem>
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
            <FormItem>
              {/* <FormLabel>Hora Desde</FormLabel> */}
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Hora Desde" />
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default SearchForm;
