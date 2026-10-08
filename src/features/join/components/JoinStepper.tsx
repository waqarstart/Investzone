import { Check, Minus } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { STEPS, type StepKey, type StepStatus } from "../steps";

interface JoinStepperProps {
  caption: string;
  activeIndex: number;
  statuses: Record<StepKey, StepStatus>;
  canSelect: (index: number) => boolean;
  onSelect: (index: number) => void;
}

export function JoinStepper({ caption, activeIndex, statuses, canSelect, onSelect }: JoinStepperProps) {
  const reduced = useReducedMotion();
  const activeLabel = STEPS[activeIndex]?.label;

  return (
    <div>
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 sm:text-sm">
        {caption}
      </p>

      <nav aria-label="KYC progress">
        <ol className="mx-auto flex w-full max-w-[980px] items-start">
          {STEPS.map((step, index) => {
            const status = statuses[step.key];
            const active = index === activeIndex;
            const done = status === "completed";
            const skipped = status === "skipped";
            const selectable = !active && canSelect(index);
            const previousDone = index > 0 && statuses[STEPS[index - 1].key] === "completed";

            return (
              <li key={step.key} className="relative flex flex-1 flex-col items-center">
                {index > 0 && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[-50%] right-[50%] top-[19px] h-0.5 bg-[#E5E7EB]"
                  >
                    <motion.span
                      className="block h-full bg-[#F5B544]"
                      initial={false}
                      animate={{ width: previousDone ? "100%" : "0%" }}
                      transition={{ duration: reduced ? 0 : 0.4 }}
                    />
                  </span>
                )}

                <button
                  type="button"
                  disabled={!selectable}
                  onClick={() => onSelect(index)}
                  aria-current={active ? "step" : undefined}
                  aria-label={`${step.label}${done ? ", completed" : skipped ? ", skipped" : ""}`}
                  className={cn(
                    "relative z-10 flex size-10 items-center justify-center rounded-full text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F5B544]/40",
                    done || active ? "bg-[#F5B544] text-[#14213D]" : "bg-[#E5E7EB] text-slate-500",
                    active && "shadow-[0_0_0_8px_rgba(245,181,68,0.25)]",
                    selectable ? "cursor-pointer hover:brightness-95" : "cursor-default",
                  )}
                >
                  {done ? (
                    <Check className="size-5" aria-hidden="true" />
                  ) : skipped ? (
                    <Minus className="size-5" aria-hidden="true" />
                  ) : (
                    index + 1
                  )}
                </button>

                <span
                  className={cn(
                    "mt-3 hidden px-1 text-center text-xs leading-4 sm:block sm:text-sm",
                    active ? "font-semibold text-[#14213D]" : "text-slate-500",
                  )}
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      </nav>

      {activeLabel && (
        <p className="mt-3 text-center text-sm font-semibold text-[#14213D] sm:hidden">{activeLabel}</p>
      )}
    </div>
  );
}