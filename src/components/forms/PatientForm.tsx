"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "react-phone-number-input/style.css";

import SubmitButton from "../SubmitButton";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { UserFormValidation } from "@/lib/validation";
import { createUser } from "@/lib/actions/patient.actions";
import { toast } from "sonner";

export default function PatientForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);

    try {
      const user = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };
      const newUser = await createUser(user);
      if (newUser) router.push(`/patients/${newUser.$id}/register`);
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }
    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">Welcome to CarePulse 👋</h1>
          <p className="text-dark-700">
            Get started with your first appointments.
          </p>
        </section>
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          label="Name"
          name="name"
          placeholder="John Doe / Jane Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt=""
          isRequired
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          label="Email"
          name="email"
          placeholder="johndoe@carepulse.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt=""
          isRequired
        />
        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone number"
          placeholder="(+62) 811-1111"
          isRequired
        />
        <SubmitButton isLoading={isLoading}>Submit</SubmitButton>
      </form>
    </Form>
  );
}
