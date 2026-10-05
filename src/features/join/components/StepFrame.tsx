import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface StepFrameProps {
  eyebrow: string;
  heading: string;
  helper: string;
  children: ReactNode;
  continueLabel: string;
  continueDisabled?: boolean;
  isLoading?: boolean;
  canPrevious?: boolean;
  onPrevious?: () => void;
  canSkip?: boolean;
  onSkip?: () => void;
}

export function StepFrame({
  eyebrow,
  heading,
  helper,
  children,
  continueLabel,
  continueDisabled = false,
  isLoading = false,
  canPrevious = false,
  onPrevious,
  canSkip = false,
  onSkip,
}: StepFrameProps) {
  return (
    <div className="flex h-full flex-1 flex-col">
      <div className="flex-1 px-5 pb-6 pt-8 sm:px-14 sm:pt-14">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 sm:text-sm">{eyebrow}</p>
        <h2 className="mt-4 font-display text-[30px] font-bold leading-tight text-[#14213D] sm:text-[44px]">
          {heading}
        </h2>
        <p className="mt-2 text-base text-slate-600 sm:text-lg">{helper}</p>
        <div className="mt-8">{children}</div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-[#E5E7EB] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-14 sm:py-6">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {canPrevious && (
            <button
              type="button"
              onClick={onPrevious}
              disabled={isLoading}
              className="h-11 whitespace-nowrap text-base font-semibold text-slate-600 hover:text-[#14213D] disabled:opacity-50"
            >
              ← Previous
            </button>
          )}
          {canSkip && (
            <button
              type="button"
              onClick={onSkip}
              disabled={isLoading}
              className="h-11 whitespace-nowrap text-sm font-semibold text-[#3F4FA0] hover:underline disabled:opacity-50"
            >
              Skip KYC for now
            </button>
          )}
        </div>
        <Button
          type="submit"
          disabled={continueDisabled || isLoading}
          className="h-14 whitespace-nowrap rounded-xl bg-[#F5B544] px-8 text-base font-semibold text-[#14213D] hover:bg-[#E9A72F] disabled:opacity-60 sm:min-w-[200px]"
        >
          {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" /> : null}
          {continueLabel}
          {!isLoading && <span aria-hidden="true">&nbsp;→</span>}
        </Button>
      </div>
    </div>
  );
}