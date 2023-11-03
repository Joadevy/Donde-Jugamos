"use client"
import { z } from 'zod';
import FormInputField from '../../components/form/FormInputField';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
    username: z.string()
        .min(2, {message: "Debe tener minimo 2 caracteres"})
        .max(50, {message: "Debe tener maximo 50 caracteres"}),
  });

const Page = () => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          username: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    return (        
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormInputField formControl={form.control} name='username' placeholder='username...' label='UserName' description='Username of user'/>
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}

export default Page;