import { Controller, useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES } from '@/lib/countries'
import { todayISO } from "@/lib/documents";
import type { FormValues } from "../schemas";
import { Field, inputClass, selectTriggerClass } from "./FormField";

function CountrySelect({
  name,
  id,
  placeholder,
}: {
  name: "nationality" | "country";
  id: string;
  placeholder: string;
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormValues>();
  return (
    <Field label={name === "nationality" ? "Nationality" : "Country"} htmlFor={id} error={errors[name]?.message}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger id={id} className={selectTriggerClass(Boolean(errors[name]))}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {COUNTRIES.map((country) => (
                <SelectItem key={country.code} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </Field>
  );
}

export function BasicInfoStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<FormValues>();

  const text = (
    name: "addressLine1" | "addressLine2" | "city" | "stateProvince" | "postalCode",
    label: string,
    placeholder: string,
    extra?: { optional?: boolean; autoComplete?: string },
  ) => (
    <Field label={label} htmlFor={name} error={errors[name]?.message} optional={extra?.optional}>
      <input
        id={name}
        type="text"
        placeholder={placeholder}
        autoComplete={extra?.autoComplete}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        className={inputClass(Boolean(errors[name]))}
        {...register(name)}
      />
    </Field>
  );

  return (
    <div className="grid gap-5">
      <Field label="Full legal name" htmlFor="fullName" error={errors.fullName?.message}>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          placeholder="As shown on your ID"
          aria-invalid={Boolean(errors.fullName)}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
          className={inputClass(Boolean(errors.fullName))}
          {...register("fullName")}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Date of birth" htmlFor="dob" error={errors.dob?.message}>
          <input
            id="dob"
            type="date"
            min="1900-01-01"
            max={todayISO()}
            autoComplete="bday"
            aria-invalid={Boolean(errors.dob)}
            className={inputClass(Boolean(errors.dob))}
            {...register("dob")}
          />
        </Field>
        <CountrySelect name="nationality" id="nationality" placeholder="Select nationality" />
      </div>

      <fieldset className="grid gap-5 rounded-2xl border border-[#E5E7EB] p-4 sm:p-5">
        <legend className="px-2 text-sm font-semibold text-[#14213D]">Residential address</legend>
        {text("addressLine1", "Address line 1", "House, street, area", { autoComplete: "address-line1" })}
        {text("addressLine2", "Address line 2", "Apartment, suite, etc.", {
          optional: true,
          autoComplete: "address-line2",
        })}
        <div className="grid gap-5 sm:grid-cols-2">
          {text("city", "City", "Lahore", { autoComplete: "address-level2" })}
          {text("stateProvince", "State / Province", "Punjab", { autoComplete: "address-level1" })}
          {text("postalCode", "Postal code", "54000", { autoComplete: "postal-code" })}
          <CountrySelect name="country" id="country" placeholder="Select country" />
        </div>
      </fieldset>

      <Field label="Gender" htmlFor="gender" optional>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="gender" className={selectTriggerClass(false)}>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="prefer_not">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </Field>
    </div>
  );
}