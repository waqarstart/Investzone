import { Mail, Smartphone } from "lucide-react";
import { useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { PhoneInput } from "react-international-phone";
import ReCAPTCHA from "react-google-recaptcha";
import "react-international-phone/style.css";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { FormValues } from "../schemas";
import { Field, inputClass, selectTriggerClass } from "./FormField";
import { PasswordField } from './PassworField';

const FALLBACK_SITE_KEY = "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI";
const SITE_KEY = (import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined) || FALLBACK_SITE_KEY;

const PHONE_VARS = {
  "--react-international-phone-height": "56px",
  "--react-international-phone-border-radius": "12px",
  "--react-international-phone-border-color": "#D5DBE5",
  "--react-international-phone-font-size": "16px",
  "--react-international-phone-text-color": "#14213D",
} as React.CSSProperties;

export function RegistrationStep() {
  const {
    register,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<FormValues>();
  const contactMethod = useWatch({ control, name: "contactMethod" });
  const password = useWatch({ control, name: "password" });
  const [compactCaptcha] = useState(() => window.matchMedia("(max-width: 380px)").matches);

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

      <div>
        <div
          role="tablist"
          aria-label="Contact method"
          className="mb-4 inline-flex rounded-xl border border-[#E5E7EB] bg-[#F3F4F6] p-1"
        >
          {(["phone", "email"] as const).map((method) => {
            const active = contactMethod === method;
            const Icon = method === "phone" ? Smartphone : Mail;
            return (
              <button
                key={method}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setValue("contactMethod", method);
                  clearErrors(["phone", "email"]);
                }}
                className={cn(
                  "flex h-10 items-center gap-2 whitespace-nowrap rounded-lg border-b-2 px-4 text-sm font-semibold transition",
                  active
                    ? "border-[#F5B544] bg-white text-[#14213D] shadow-sm"
                    : "border-transparent text-slate-500 hover:text-[#14213D]",
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                {method === "phone" ? "Use phone" : "Use email"}
              </button>
            );
          })}
        </div>

        {contactMethod === "phone" ? (
          <Field
            label="Mobile phone number"
            htmlFor="phone-input"
            error={errors.phone?.message}
            hint="We'll send a 6-digit confirmation code. Standard carrier rates may apply."
          >
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  defaultCountry="pk"
                  value={field.value}
                  onChange={(phone) => field.onChange(phone)}
                  style={PHONE_VARS}
                  className="w-full"
                  inputClassName="!w-full !text-[#14213D]"
                  inputProps={{
                    id: "phone-input",
                    placeholder: "300 1234567",
                    autoComplete: "tel",
                    "aria-invalid": Boolean(errors.phone),
                  }}
                />
              )}
            />
          </Field>
        ) : (
          <Field
            label="Email address"
            htmlFor="email"
            error={errors.email?.message}
            hint="We'll send a 6-digit confirmation code to this email."
          >
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={inputClass(Boolean(errors.email))}
              {...register("email")}
            />
          </Field>
        )}
      </div>

      <PasswordField
        id="password"
        label="Password"
        registration={register("password")}
        error={errors.password?.message}
        value={password}
        showMeter
      />
      <PasswordField
        id="confirmPassword"
        label="Confirm password"
        registration={register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />

      <Field label="Join as" htmlFor="role" error={errors.role?.message}>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="role" className={selectTriggerClass(Boolean(errors.role))}>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="investor">I am an Investor</SelectItem>
                <SelectItem value="founder">I am a Founder (I have an idea)</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </Field>

      <div>
        <Controller
          name="captchaToken"
          control={control}
          render={({ field }) => (
            <div className="overflow-x-auto rounded-xl bg-[#F3F4F6] p-3">
              <ReCAPTCHA
                sitekey={SITE_KEY}
                size={compactCaptcha ? "compact" : "normal"}
                onChange={(token) => field.onChange(token ?? "")}
                onExpired={() => field.onChange("")}
                onErrored={() => field.onChange("")}
              />
            </div>
          )}
        />
        {errors.captchaToken && (
          <p role="alert" className="mt-1.5 text-sm text-[#D9442F]">
            {errors.captchaToken.message}
          </p>
        )}
      </div>

      <div>
        <Controller
          name="acceptTerms"
          control={control}
          render={({ field }) => (
            <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600">
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                aria-invalid={Boolean(errors.acceptTerms)}
                className="mt-0.5"
              />
              <span>
                I agree to the{" "}
                <a href="#" className="font-medium text-[#3F4FA0] hover:underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="font-medium text-[#3F4FA0] hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>
          )}
        />
        {errors.acceptTerms && (
          <p role="alert" className="mt-1.5 text-sm text-[#D9442F]">
            {errors.acceptTerms.message}
          </p>
        )}
      </div>
    </div>
  );
}