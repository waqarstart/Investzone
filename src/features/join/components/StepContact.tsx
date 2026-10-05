import { useState } from "react"
import type { ComponentProps, ReactNode } from "react"
import { Lock, Mail, Smartphone } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { PhoneInput } from "react-international-phone"
import "react-international-phone/style.css"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { FormValues } from "../schemas"

type SelectorStyleProps = NonNullable<
  NonNullable<Parameters<typeof PhoneInput>[0]>["countrySelectorStyleProps"]
>

type SelectorWrapperProps = {
  children: ReactNode
  rootProps: ComponentProps<"button">
}

const FIELD_CLASS =
  "h-14 rounded-xl border border-[#D5DBE5] bg-white px-4 text-base text-[#14213D] placeholder:text-[#94A3B8] transition-colors focus-visible:border-[#F5B544] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F5B544]/30 aria-invalid:border-[#F2705A] aria-invalid:focus-visible:ring-[#F2705A]/25"

export function StepContact() {
  const {
    register,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useFormContext<FormValues>()

  const [phoneTouched, setPhoneTouched] = useState(false)
  const [dialCode, setDialCode] = useState("92")

  const method = watch("contactMethod")
  const phone = watch("phone") ?? ""
  const isPhone = method === "phone"

  const phoneError = errors.phone?.message
  const emailError = errors.email?.message

  const selectorStyleProps = {
    className: "z-20",
    renderButtonWrapper: ({ children, rootProps }: SelectorWrapperProps) => (
      <button
        {...rootProps}
        type="button"
        className={cn(
          "flex h-14 items-center gap-1.5 rounded-xl border border-[#D5DBE5] bg-white px-3 text-sm font-medium text-[#14213D] transition-colors hover:bg-[#F8FAFC]",
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F5B544]/30",
          "[&>div]:contents [&_.react-international-phone-country-selector-button__flag-emoji]:order-1 [&_.react-international-phone-country-selector-button__dropdown-arrow]:order-3",
          phoneError && "border-[#F2705A]",
        )}
      >
        {children}
        <span className="order-2 tabular-nums">+{dialCode}</span>
      </button>
    ),
  } as unknown as SelectorStyleProps

  return (
    <div className="flex flex-col gap-6">
      <div
        role="tablist"
        aria-label="Contact method"
        className="grid grid-cols-2 gap-1 rounded-full bg-[#F1F3F7] p-1"
      >
        {(
          [
            { value: "phone", label: "Use phone", Icon: Smartphone },
            { value: "email", label: "Use email", Icon: Mail },
          ] as const
        ).map(({ value, label, Icon }) => {
          const selected = method === value
          return (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => {
                setValue("contactMethod", value, { shouldDirty: true })
                trigger(["phone", "email"])
              }}
              className={cn(
                "flex h-11 items-center justify-center gap-2 rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F5B544]/40",
                selected
                  ? "relative rounded-b-lg border-b-2 border-[#F5B544] bg-white text-[#14213D] shadow-[0_1px_2px_rgba(16,24,40,0.08)]"
                  : "text-[#64748B] hover:text-[#14213D]",
              )}
            >
              <Icon className="size-4" strokeWidth={2} />
              {label}
            </button>
          )
        })}
      </div>

      {isPhone ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor="phone-input" className="text-sm font-semibold text-[#14213D]">
            Mobile phone number
          </Label>

          <PhoneInput
            defaultCountry="pk"
            value={phone}
            placeholder="300 1234567"
            countrySelectorStyleProps={selectorStyleProps}
            inputClassName="join-phone-input focus:shadow-[0_0_0_4px_rgba(245,181,68,0.28)]"
            inputStyle={{
              height: "56px",
              borderRadius: "12px",
              border: phoneError ? "1px solid #F2705A" : "1px solid #D5DBE5",
              backgroundColor: "#FFFFFF",
              paddingLeft: "16px",
              paddingRight: "16px",
              fontSize: "16px",
              fontFamily: "inherit",
              color: "#14213D",
            }}
            onChange={(value, meta) => {
              setValue("phone", value, { shouldDirty: true, shouldValidate: phoneTouched })
              if (meta.country?.dialCode) setDialCode(meta.country.dialCode)
            }}
            onFocus={() => setPhoneTouched(false)}
            onBlur={() => {
              setPhoneTouched(true)
              void trigger("phone")
            }}
            inputProps={{
              id: "phone-input",
              autoComplete: "tel-national",
              "aria-invalid": phoneError ? true : undefined,
              "aria-describedby": phoneError ? "phone-error" : undefined,
            }}
          />

          {phoneError ? (
            <p id="phone-error" role="alert" className="text-[13px] font-medium text-[#F2705A]">
              {phoneError}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Label htmlFor="email" className="text-sm font-semibold text-[#14213D]">
            Email address
          </Label>
          <div className="relative">
            <Mail
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#94A3B8]"
              aria-hidden="true"
            />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              className={cn(FIELD_CLASS, "pl-12", emailError && "border-[#F2705A]")}
              aria-invalid={emailError ? true : undefined}
              aria-describedby={emailError ? "email-error" : undefined}
              {...register("email")}
            />
          </div>
          {emailError ? (
            <p id="email-error" role="alert" className="text-[13px] font-medium text-[#F2705A]">
              {emailError}
            </p>
          ) : null}
        </div>
      )}

      <div className="flex items-start gap-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-4 py-3.5">
        <Lock className="mt-0.5 size-4 shrink-0 text-[#94A3B8]" aria-hidden="true" />
        <p className="text-[13px] leading-relaxed text-[#475569]">
          {isPhone
            ? "We'll send a 6-digit confirmation code. Standard carrier rates may apply."
            : "We'll send a 6-digit confirmation code to this email."}
        </p>
      </div>
    </div>
  )
}
