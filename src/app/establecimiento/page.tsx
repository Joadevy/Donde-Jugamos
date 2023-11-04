"use client"
import { z } from 'zod';
import FormInputField from '../../components/form/FormInputField';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import FormTextAreaField from '@/components/form/FormTextAreaField';
import TimePickerUI from '../../components/TimePicker/time-picker';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
    name: z.string().min(2, {message: "Debe tener minimo 2 caracteres"}),
    addressName: z.string(),
    addressNumber: z.number({ required_error: "Campo Requerido."}),
    cityName: z.string(),
    cityPostalCode: z.string(),
    phone: z.string(),
    email: z.string(),
    description: z.string(),
    cbu: z.number(),
    alias: z.string(),
    reservationCancelTolerance: z.number(),
    paymentTolerance: z.number()
  });

const Page = () => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          addressName: "",
          addressNumber: undefined,
          cityName: "",
          cityPostalCode: "",
          phone: "",
          email: "",
          description: "",
          cbu: undefined,
          alias: "",
          reservationCancelTolerance: 180,
          paymentTolerance: 180,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    return (        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormInputField formControl={form.control} name='name' label='Nombre'/>
                <FormInputField formControl={form.control} name='cityName' label='Ciudad'/>
                <FormInputField formControl={form.control} name='cityPostalCode' label='Codigo Postal'/>
                <FormInputField formControl={form.control} name='addressName' label='Direccion'/>
                <FormInputField formControl={form.control} name='addressNumber' label='Altura' type='number'/>
                <FormInputField formControl={form.control} name='phone' label='Telefono'/>
                <FormInputField formControl={form.control} name='email' label='Correo Electronico' type='email'/>
                <FormTextAreaField formControl={form.control} name='description' label='Description del Establecimiento'/>
                <FormInputField formControl={form.control} name='cbu' label='CBU' type='number'/>
                <FormInputField formControl={form.control} name='alias' label='Alias'/>
                <FormInputField formControl={form.control} name='reservationCancelTolerance' label='Tiempo de Toleraciancia para reservas' type='number'/>
                <FormInputField formControl={form.control} name='paymentTolerance' label='Tiempo de Tolerancia para pago' type='number'/>
                <TimePickerUI />
                <Button type="submit">Submit</Button>
            </form>

            <RadioGroup defaultValue="option-one">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-one" id="option-one" />
                    <Label htmlFor="option-one">Option One</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-two" id="option-two" />
                    <Label htmlFor="option-two">Option Two</Label>
                </div>
            </RadioGroup>
        </Form>
    )
}

export default Page;