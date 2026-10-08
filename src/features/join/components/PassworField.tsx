import { Check, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import { PASSWORD_RULES, passwordStrength } from '@/lib/password';
import { Field, inputClass } from "./FormField";

interface PasswordFieldProps {
  id: string;
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  value?: string;
  showMeter?: boolean;
  autoComplete?: string;
}

const SEGMENT_COLORS = ["", "bg-[#F2705A]", "bg-[#F5B544]", "bg-[#3F4FA0]", "bg-[#5BA4E6]"];

export function PasswordField({
  id,
  label,
  registration,
  error,
  value = "",
  showMeter = false,
  autoComplete = "new-password",
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const { score, label: strengthLabel } = passwordStrength(value);

  return (
    <Field label={label} htmlFor={id} error={error}>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(inputClass(Boolean(error)), "pr-12")}
          {...registration}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-slate-500 hover:bg-black/5"
        >
          {visible ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </button>
      </div>

      {showMeter && value && (
        <div className="mt-3" aria-live="polite">
          <div className="flex items-center gap-2">
            <div className="grid flex-1 grid-cols-4 gap-1.5">
              {[1, 2, 3, 4].map((segment) => (
                <span
                  key={segment}
                  className={cn(
                    "h-1.5 rounded-full",
                    segment <= score ? SEGMENT_COLORS[score] : "bg-[#E5E7EB]",
                  )}
                />
              ))}
            </div>
            <span className="w-14 text-right text-xs font-semibold text-slate-600">
              {strengthLabel}
            </span>
          </div>
          <ul className="mt-2 grid grid-cols-1 gap-1 text-xs sm:grid-cols-2">
            {PASSWORD_RULES.map((rule) => {
              const met = rule.test(value);
              return (
                <li
                  key={rule.id}
                  className={cn("flex items-center gap-1.5", met ? "text-[#5BA4E6]" : "text-slate-500")}
                >
                  <Check className={cn("size-3.5", met ? "opacity-100" : "opacity-30")} aria-hidden="true" />
                  {rule.label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </Field>
  );
}