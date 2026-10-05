import { useEffect } from "react"
import type { ReactNode } from "react"
import { useReducedMotion } from "motion/react"
import { LoaderCircle } from "lucide-react"
import { STEPS } from "@/features/join/steps"
import { cn } from "@/lib/utils"

interface StepAutoFocusProps {
  stepIndex: number
}

export function StepAutoFocus({ stepIndex }: StepAutoFocusProps) {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (stepIndex === 0) return

    const id = window.setTimeout(() => {
      const card = document.getElementById("join-step-card")
      if (!card) return

      if (window.matchMedia("(max-width: 1023px)").matches) {
        card.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" })
      }

      const target = card.querySelector<HTMLElement>(
        'input:not([type="hidden"]), select, textarea',
      )
      if (target) target.focus({ preventScroll: true })
      else card.focus({ preventScroll: true })
    }, 30)

    return () => window.clearTimeout(id)
  }, [stepIndex, reduced])

  return null
}


interface StepFrameProps {
  stepIndex: number
  helper: string
  children: ReactNode
  continueLabel: string
  continueDisabled?: boolean
  continueBlocked?: boolean
  isLoading?: boolean
  canPrevious?: boolean
  onPrevious: () => void
}

export function StepFrame({
  stepIndex,
  helper,
  children,
  continueLabel,
  continueDisabled = false,
  continueBlocked = false,
  isLoading = false,
  canPrevious = true,
  onPrevious,
}: StepFrameProps) {
  const step = STEPS[stepIndex]

  return (
    <div className="flex flex-1 flex-col px-6 py-8 sm:px-10 md:px-11 md:py-12">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#64748B]">
          Step {stepIndex + 1} of {STEPS.length} &middot; {step.eyebrow}
        </p>
        <h1 className="mt-4 font-['Playfair_Display'] text-[30px] font-bold leading-tight text-[#14213D] sm:text-[38px]">
          {step.heading}
        </h1>
        <p className="mt-2 max-w-xl text-base leading-relaxed text-[#475569]">{helper}</p>
      </div>

      <div className="mt-8 flex-1">
        <StepAutoFocus stepIndex={stepIndex} />
        {children}
      </div>

      <div className="mt-10 flex flex-col-reverse gap-3 border-t border-[#E9EDF2] pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!canPrevious}
          className="rounded-full px-5 py-3 text-sm font-semibold text-[#475569] transition-colors hover:bg-[#F1F5F9] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#94A3B8]/30 disabled:pointer-events-none disabled:opacity-40"
        >
          ←&nbsp; Previous
        </button>

        <button
          type="submit"
          disabled={continueDisabled || isLoading}
          aria-disabled={continueBlocked || continueDisabled || isLoading}
          className={cn(
            "inline-flex h-14 items-center justify-center gap-2 rounded-xl px-8 text-base font-semibold text-[#14213D] transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F5B544]/40 disabled:cursor-not-allowed disabled:opacity-60",
            (continueBlocked || continueDisabled) && !isLoading
              ? "bg-[#F5B544] hover:bg-[#E9A92F]"
              : "bg-[#F5B544] hover:bg-[#E9A92F]",
          )}
        >
          {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : null}
          {continueLabel} &nbsp;→
        </button>
      </div>
    </div>
  )
}
