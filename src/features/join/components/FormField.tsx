import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputClass = (hasError: boolean) =>
  cn(
    "h-14 w-full rounded-xl border bg-white px-4 text-base text-[#14213D] outline-none transition placeholder:text-[#94A3B8] focus:border-[#F5B544] focus:ring-4 focus:ring-[#F5B544]/25",
    hasError ? "border-[#F2705A]" : "border-[#D5DBE5]",
  );

export const selectTriggerClass = (hasError: boolean) =>
  cn(
    "h-14 w-full justify-between rounded-xl border bg-white px-4 text-base text-[#14213D] shadow-none data-[size=default]:h-14 focus-visible:border-[#F5B544] focus-visible:ring-4 focus-visible:ring-[#F5B544]/25",
    hasError ? "border-[#F2705A]" : "border-[#D5DBE5]",
  );

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
  children: ReactNode;
}

export function Field({ label, htmlFor, error, hint, optional, className, children }: FieldProps) {
  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-[#14213D]">
        {label}
        {optional && <span className="ml-1 font-normal text-[#94A3B8]">(optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-sm text-[#D9442F]">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-sm text-[#94A3B8]">{hint}</p>
      ) : null}
    </div>
  );
}