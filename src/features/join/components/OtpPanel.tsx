import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";
import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { FormValues } from "../schemas";

interface OtpPanelProps {
  contactLabel: string;
  onEdit: () => void;
}

export function OtpPanel({ contactLabel, onEdit }: OtpPanelProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormValues>();
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const id = window.setTimeout(() => setSeconds((current) => current - 1), 1000);
    return () => window.clearTimeout(id);
  }, [seconds]);

  return (
    <div className="grid gap-4">
      <p className="text-sm text-slate-600">
        Code sent to <span className="font-semibold text-[#14213D]">{contactLabel}</span>
      </p>

      <Controller
        name="otp"
        control={control}
        render={({ field }) => (
          <OTPInput
            id="otp-input"
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            inputMode="numeric"
            autoComplete="one-time-code"
            autoFocus
            value={field.value}
            onChange={field.onChange}
            containerClassName="flex gap-2 sm:gap-3"
            render={({ slots }) => (
              <>
                {slots.map((slot, index) => (
                  <div
                    key={index}
                    className={cn(
                      "relative flex h-14 w-11 items-center justify-center rounded-xl border bg-white text-2xl font-semibold text-[#14213D] sm:h-16 sm:w-14",
                      slot.isActive
                        ? "border-[#F5B544] ring-4 ring-[#F5B544]/25"
                        : errors.otp
                          ? "border-[#F2705A]"
                          : "border-[#D5DBE5]",
                    )}
                  >
                    {slot.char}
                    {slot.hasFakeCaret && (
                      <span className="absolute h-6 w-px animate-pulse bg-[#14213D]" />
                    )}
                  </div>
                ))}
              </>
            )}
          />
        )}
      />

      {errors.otp && (
        <p role="alert" className="text-sm text-[#D9442F]">
          {errors.otp.message}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" aria-live="polite">
        {seconds > 0 ? (
          <span className="text-slate-500">
            Resend code in 0:{String(seconds).padStart(2, "0")}
          </span>
        ) : (
          <button
            type="button"
            onClick={() => {
              setSeconds(30);
              toast("Code resent (demo)");
            }}
            className="font-medium text-[#3F4FA0] hover:underline"
          >
            Resend code
          </button>
        )}
        <button type="button" onClick={onEdit} className="font-medium text-[#3F4FA0] hover:underline">
          Edit details
        </button>
      </div>

      <p className="text-xs text-[#94A3B8]">Demo mode: any 6-digit code works.</p>
    </div>
  );
}