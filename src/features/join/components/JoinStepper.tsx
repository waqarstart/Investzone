import { Check } from "lucide-react"
import { STEPS } from "@/features/join/steps"
import { cn } from "@/lib/utils"

interface JoinStepperProps { activeIndex: number; completedCount: number; onSelectStep: (index: number) => void }

export function JoinStepper({ activeIndex, completedCount, onSelectStep }: JoinStepperProps) {
  const currentIndex = activeIndex < 0 ? STEPS.length - 1 : activeIndex
  const finished = activeIndex < 0
  return <section className="mx-auto max-w-[840px] text-center" aria-label="Registration progress">
    <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[#64748B]">Step {finished ? 6 : currentIndex + 1} of 6 · Takes less than 2 minutes</p>
    <ol className="relative mt-6 grid grid-cols-6">
      <span className="absolute left-[8.33%] right-[8.33%] top-5 h-0.5 bg-[#E5E7EB]" aria-hidden="true" />
      <span className="absolute left-[8.33%] top-5 h-0.5 bg-[#F5B544] transition-all" style={{ width: `${finished ? 83.34 : currentIndex * 16.67}%` }} aria-hidden="true" />
      {STEPS.map((step, index) => {
        const isDone = finished || index < completedCount
        const isActive = !finished && index === activeIndex
        return <li key={step.id} className="relative z-10 flex min-w-0 flex-col items-center">
          <button type="button" disabled={!isDone} onClick={() => isDone && onSelectStep(index)} aria-current={isActive ? "step" : undefined} aria-label={`${step.label}${isDone ? ", completed, go back" : isActive ? ", current step" : ", upcoming step"}`} className={cn("grid size-10 place-items-center rounded-full text-sm font-semibold transition-all max-sm:size-8", isDone && "bg-[#F5B544] text-[#14213D]", isActive && "bg-[#F5B544] text-[#14213D] shadow-[0_0_0_6px_rgba(245,181,68,0.25)]", !isDone && !isActive && "bg-[#E5E7EB] text-[#64748B]", isDone && "cursor-pointer")}>
            {isDone ? <Check className="size-4" strokeWidth={2.5} /> : index + 1}
          </button>
          <span className={cn("mt-2 hidden whitespace-nowrap text-xs sm:block", isActive ? "font-bold text-[#14213D]" : isDone ? "text-[#14213D]" : "text-[#64748B]", isActive && "max-sm:block")}>{step.label}</span>
        </li>
      })}
    </ol>
  </section>
}
