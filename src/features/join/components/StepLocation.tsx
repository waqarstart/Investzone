import { MapPin } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import type { FormValues } from "../schemas"

const FIELD_CLASS =
  "h-14 rounded-xl border border-[#D5DBE5] bg-white pl-12 pr-4 text-base text-[#14213D] placeholder:text-[#94A3B8] transition-colors focus-visible:border-[#F5B544] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F5B544]/30 aria-invalid:border-[#F2705A] aria-invalid:focus-visible:ring-[#F2705A]/25"

export function StepLocation() {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>()

  const error = errors.location?.message

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="location" className="text-sm font-semibold text-[#14213D]">
        Location
      </Label>

      <div className="relative">
        <MapPin
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#94A3B8]"
          aria-hidden="true"
        />
        <Input
          id="location"
          autoComplete="address-level2"
          placeholder="Islamabad, Pakistan"
          className={cn(FIELD_CLASS, error && "border-[#F2705A]")}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "location-error" : "location-hint"}
          {...register("location")}
        />
      </div>

      {error ? (
        <p id="location-error" role="alert" className="text-[13px] font-medium text-[#F2705A]">
          {error}
        </p>
      ) : (
        <p id="location-hint" className="text-[13px] text-[#475569]">
          Use the format City, State, Country. Example: Islamabad, ICT, Pakistan
        </p>
      )}
    </div>
  )
}
