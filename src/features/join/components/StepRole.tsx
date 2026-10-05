import { Check, Rocket, TrendingUp } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"
import type { FormValues } from "../schemas"

const ROLE_OPTIONS = [
  {
    value: "investor",
    label: "I'm here to invest",
    description: "I back founders and look for promising opportunities.",
    Icon: TrendingUp,
  },
  {
    value: "founder",
    label: "I'm building",
    description: "I'm raising capital, partners and guidance.",
    Icon: Rocket,
  },
] as const

export function StepRole() {
  const {
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useFormContext<FormValues>()

  const role = watch("role")
  const error = errors.role?.message

  const select = (value: "investor" | "founder") => {
    setValue("role", value, { shouldDirty: true, shouldValidate: true })
  }

  return (
    <div className="flex flex-col gap-4">
      <div role="radiogroup" aria-label="How will you use Bridgeway?" className="grid gap-4 sm:grid-cols-2">
        {ROLE_OPTIONS.map(({ value, label, description, Icon }) => {
          const selected = role === value
          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => select(value)}
              onBlur={() => void trigger("role")}
              className={cn(
                "group relative flex flex-col gap-3 rounded-2xl border p-5 text-left transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F5B544]/40",
                selected
                  ? "border-[#F5B544] bg-[#FEF3D8] shadow-[0_1px_2px_rgba(16,24,40,0.06)]"
                  : "border-[#E5E7EB] bg-white hover:border-[#D5DBE5] hover:bg-[#FCFCFB]",
              )}
            >
              <span className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    "flex size-11 items-center justify-center rounded-xl transition-colors",
                    selected ? "bg-[#14213D] text-white" : "bg-[#EEF0FA] text-[#3F4FA0]",
                  )}
                >
                  <Icon className="size-5" strokeWidth={2} aria-hidden="true" />
                </span>
                <span
                  className={cn(
                    "flex size-6 items-center justify-center rounded-full border transition-all",
                    selected
                      ? "border-[#F5B544] bg-[#F5B544] text-[#14213D]"
                      : "border-[#D5DBE5] bg-white text-transparent",
                  )}
                  aria-hidden="true"
                >
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
              </span>

              <span>
                <span className="block text-base font-semibold text-[#14213D]">{label}</span>
                <span className="mt-1 block text-[13px] leading-relaxed text-[#475569]">
                  {description}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <div aria-live="polite">
        {error ? (
          <p role="alert" className="text-[13px] font-medium text-[#F2705A]">
            {error}
          </p>
        ) : (
          <p className="text-[13px] text-[#475569]">
            You can add a second role later from your profile settings.
          </p>
        )}
      </div>
    </div>
  )
}
