import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { FormValues } from "../schemas"

const FIELD_CLASS =
  "h-14 rounded-xl border border-[#D5DBE5] bg-white px-4 text-base text-[#14213D] placeholder:text-[#94A3B8] transition-colors focus-visible:border-[#F5B544] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F5B544]/30 aria-invalid:border-[#F2705A] aria-invalid:focus-visible:ring-[#F2705A]/25"

export function StepName() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>()

  const firstNameError = errors.firstName?.message
  const lastNameError = errors.lastName?.message

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="firstName" className="text-sm font-semibold text-[#14213D]">
          First name
        </Label>
        <Input
          id="firstName"
          autoComplete="given-name"
          placeholder="e.g. Hamza"
          className={cn(FIELD_CLASS, firstNameError && "border-[#F2705A]")}
          aria-invalid={firstNameError ? true : undefined}
          aria-describedby={firstNameError ? "firstName-error" : undefined}
          {...register("firstName")}
        />
        {firstNameError ? (
          <p id="firstName-error" role="alert" className="text-[13px] font-medium text-[#F2705A]">
            {firstNameError}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="lastName" className="text-sm font-semibold text-[#14213D]">
          Last name
        </Label>
        <Input
          id="lastName"
          autoComplete="family-name"
          placeholder="e.g. Malik"
          className={cn(FIELD_CLASS, lastNameError && "border-[#F2705A]")}
          aria-invalid={lastNameError ? true : undefined}
          aria-describedby={lastNameError ? "lastName-error" : undefined}
          {...register("lastName")}
        />
        {lastNameError ? (
          <p id="lastName-error" role="alert" className="text-[13px] font-medium text-[#F2705A]">
            {lastNameError}
          </p>
        ) : null}
      </div>

      <p className="text-[13px] leading-relaxed text-[#94A3B8] sm:col-span-2">
        Your full name appears on your profile and in member directories.
      </p>
    </div>
  )
}
