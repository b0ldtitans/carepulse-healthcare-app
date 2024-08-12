"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import "react-phone-number-input/style.css";

import SubmitButton from "../SubmitButton";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import { PatientFormValidation, UserFormValidation } from "@/lib/validation";
import { registerPatient } from "@/lib/actions/patient.actions";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "../../constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import { FileUploader } from "../FileUploader";
import { toast } from "sonner";

export default function RegisterForm({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    setIsLoading(true);

    let formData;
    if (
      values.identificationDocument &&
      values.identificationDocument?.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }

    try {
      const patient = {
        userId: user.$id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        birthDate: new Date(values.birthDate),
        gender: values.gender,
        address: values.address,
        occupation: values.occupation,
        emergencyContactName: values.emergencyContactName,
        emergencyContactNumber: values.emergencyContactNumber,
        primaryPhysician: values.primaryPhysician,
        insuranceProvider: values.insuranceProvider,
        insurancePolicyNumber: values.insurancePolicyNumber,
        allergies: values.allergies,
        currentMedication: values.currentMedication,
        familyMedicalHistory: values.familyMedicalHistory,
        pastMedicalHistory: values.pastMedicalHistory,
        identificationType: values.identificationType,
        identificationNumber: values.identificationNumber,
        identificationDocument: values.identificationDocument
          ? formData
          : undefined,
        privacyConsent: values.privacyConsent,
        disclosureConsent: values.disclosureConsent,
        treatmentConsent: values.treatmentConsent,
      };

      const newPatient = await registerPatient(patient);

      if (newPatient) {
        router.push(`/patients/${user.$id}/new-appointment`);
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex-1 space-y-12"
      >
        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">
            Please fill out these forms before proceeding
          </p>
        </section>
        {/* PERSONAL INFORMATION */}
        <>
          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Personal Information</h2>
            </div>
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
          <div className="flex flex-col gap-6 xl:flex-row">
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
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.DATE_PICKER}
              label="Date of Birth"
              name="dateofbirth"
              iconSrc="/assets/icons/email.svg"
              iconAlt=""
              isRequired
            />
            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="gender"
              label="Gender"
              isRequired
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className="flex h-11 gap-6 xl:justify-between"
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {GenderOptions.map((gender) => (
                      <div key={gender} className="radio-group">
                        <RadioGroupItem
                          className=""
                          value={gender}
                          id={gender}
                        />
                        <Label htmlFor={gender} className="cursor-pointer">
                          {gender.charAt(0).toUpperCase() + gender.slice(1)}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              label="Address"
              name="address"
              placeholder="Jl. Jendral Sudirman No.21, DKI Jakarta"
              iconSrc="/assets/icons/email.svg"
              iconAlt=""
              isRequired
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              label="Occupation"
              name="occupation"
              placeholder="Software Engineer"
              iconSrc="/assets/icons/email.svg"
              iconAlt=""
              isRequired
            />
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              label="Emergency Contact Name"
              name="emergencyContactName"
              placeholder="Guardian / Father / Mother"
              iconSrc="/assets/icons/email.svg"
              iconAlt=""
              isRequired
            />
            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name="emergencyContactNumber"
              label="Emergency Contact Number"
              placeholder="(+62) 811-1111"
              isRequired
            />
          </div>
        </>
        {/* MEDICAL INFORMATION */}
        <>
          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Medical Information</h2>
            </div>
          </section>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Primary Physician"
              placeholder="Select a Physician"
              isRequired
            >
              {Doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      alt="doctor's image"
                      width={32}
                      height={32}
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              label="Insurance Provider"
              name="insuranceProvider"
              placeholder="e.g Prudentials, Allianz, Manulife"
              iconSrc="/assets/icons/email.svg"
              iconAlt=""
              isRequired
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              label="Insurance Policy Number"
              name="insurancePolicyNumber"
              placeholder="ABC12345"
              iconSrc="/assets/icons/email.svg"
              iconAlt=""
              isRequired
            />
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              label="Allergies (if any)"
              name="allergies"
              placeholder="Peanuts, Penicillin, Pollen"
              iconSrc="/assets/icons/email.svg"
              iconAlt=""
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              label="Current Medication (if any)"
              name="Current Medication"
              placeholder="Ibuprofen 200mg,
            Paracetamol 500mg"
              iconSrc="/assets/icons/email.svg"
              iconAlt=""
            />
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              label="Family Medical History"
              name="familyMedicalHistory"
              placeholder="Mother had diabetes, Father had heart disease"
              iconSrc="/assets/icons/email.svg"
              iconAlt=""
            />
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              label="Past Medical History"
              name="pastMedicalHistory"
              placeholder="Tonsillectomy, Appendectomy"
              iconSrc="/assets/icons/email.svg"
              iconAlt=""
            />
          </div>
        </>
        {/* Identification and Verifiation */}
        <>
          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Identification and Verifiation</h2>
            </div>
          </section>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="identificationType"
              label="Identification Type"
              placeholder="Select an identification Type"
              isRequired
            >
              {IdentificationTypes.map((type) => (
                <SelectItem key={type} value={type} defaultChecked={false}>
                  <span className="cursor-pointer">{type}</span>
                </SelectItem>
              ))}
            </CustomFormField>
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              label="Identification Number"
              name="identificationNumber"
              placeholder="12345678"
              isRequired
            />
          </div>
          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name="identificationDocument"
              label="Identification Document"
              isRequired
              renderSkeleton={(field) => (
                <FormControl>
                  <FileUploader files={field.value} onChange={field.onChange} />
                </FormControl>
              )}
            />
          </div>
        </>
        {/* Consent and Privacy */}
        <>
          <section className="space-y-6">
            <div className="mb-9 space-y-1">
              <h2 className="sub-header">Consent and Privacy Policy</h2>
            </div>
          </section>
          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to receive treatment for my health condition"
            isRequired
          />
          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to the use and disclosure of my health information for treatment purposes"
            isRequired
          />
          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I acknowledge that i have reviewed and agree to the privacy policy"
            isRequired
          />
        </>
        <SubmitButton isLoading={isLoading}>Submit</SubmitButton>
      </form>
    </Form>
  );
}
