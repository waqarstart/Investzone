import { useEffect, useState } from "react"
import { OTPInput } from "input-otp"
import { useFormContext } from "react-hook-form"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { FormValues } from "../schemas"

interface StepVerificationProps {
  onEditContact: () => void
}

const RESEND_SECONDS = 60

function pad(number: number) {
  return number < 10 ? `0${number}` : String(number)
}

export function StepVerification({ onEditContact }: StepVerificationProps) {
  const {
    setValue,
    trigger,
    clearErrors,
    watch,
    formState: { errors },
  } = useFormContext<FormValues>()

  const [touched, setTouched] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)

  const otp = watch("otp") ?? ""
  const otpError = errors.otp?.message

  useEffect(() => {
    if (secondsLeft <= 0) return
    const id = window.setInterval(() => setSecondsLeft((value) => (value <= 1 ? 0 : value - 1)), 1000)
    return () => window.clearInterval(id)
  }, [secondsLeft])

  const handleResend = () => {
    setSecondsLeft(RESEND_SECONDS)
    setValue("otp", "", { shouldDirty: true })
    clearErrors("otp")
    toast("A new verification code has been sent (demo)")
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label htmlFor="otp-input" className="sr-only">
          6-digit verification code
        </label>

        <OTPInput
          id="otp-input"
          value={otp}
          onChange={(value) =>
            setValue("otp", value, { shouldDirty: true, shouldValidate: touched })
          }
          onBlur={() => {
            setTouched(true)
            void trigger("otp")
          }}
          maxLength={6}
          inputMode="numeric"
          autoComplete="one-time-code"
          aria-label="6-digit verification code"
          aria-invalid={otpError ? true : undefined}
          aria-describedby={otpError ? "otp-error" : "otp-hint"}
          containerClassName="flex w-full max-w-[380px] gap-2"
          render={({ slots }) => (
            <>
              {slots.map((slot, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative flex h-16 flex-1 items-center justify-center rounded-xl border bg-white text-2xl font-semibold text-[#14213D] transition-colors",
                    slot.isActive
                      ? "border-[#F5B544] ring-4 ring-[#F5B544]/30"
                      : slot.char
                        ? "border-[#D5DBE5]"
                        : "border-[#E5E7EB]",
                  )}
                >
                  <span className="tabular-nums">{slot.char ?? ""}</span>
                  {slot.hasFakeCaret ? (
                    <span
                      className="absolute bottom-3 h-0.5 w-5 rounded-full bg-[#F5B544]"
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
              ))}
            </>
          )}
        />

        {otpError ? (
          <p id="otp-error" role="alert" className="mt-3 text-[13px] font-medium text-[#F2705A]">
            {otpError}
          </p>
        ) : null}

        <p id="otp-hint" className="mt-3 text-sm text-[#475569]">
          Demo mode: any 6-digit code will verify this step.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EEF1F5] pt-5">
        <div aria-live="polite" className="text-sm text-[#475569]">
          {secondsLeft > 0 ? (
            <span>
              Resend code in{" "}
              <span className="font-semibold tabular-nums text-[#14213D]">
                0:{pad(secondsLeft)}
              </span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-semibold text-[#3F4FA0] transition-colors hover:text-[#2B3A85] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3F4FA0]/25"
            >
              Resend code
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onEditContact}
          className="font-semibold text-[#3F4FA0] transition-colors hover:text-[#2B3A85] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#3F4FA0]/25"
        >
          Edit contact
        </button>
      </div>
    </div>
  )
}
