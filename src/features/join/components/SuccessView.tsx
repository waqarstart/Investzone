import { useEffect, useRef } from "react"
import { motion, useReducedMotion } from "motion/react"
import { ArrowRight, Check } from "lucide-react"

interface SuccessViewProps {
  firstName: string
  onContinue: () => void
}

export function SuccessView({ firstName, onContinue }: SuccessViewProps) {
  const reduced = useReducedMotion()
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    containerRef.current?.focus()
  }, [])

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center focus:outline-none sm:px-10"
    >
      <motion.span
        initial={reduced ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: reduced ? 0 : 0.4, ease: "easeOut" }}
        className="flex size-16 items-center justify-center rounded-full bg-[#FEF3D8]"
        aria-hidden="true"
      >
        <Check className="size-8 text-[#14213D]" strokeWidth={3} />
      </motion.span>

      <h1 className="mt-6 max-w-lg font-['Playfair_Display'] text-[26px] font-semibold leading-tight text-[#14213D] sm:text-[32px]">
        Welcome to Bridgeway, {firstName}!
      </h1>

      <p className="mt-3 max-w-md text-sm leading-relaxed text-[#475569]">
        Your profile has been created. You're now ready to explore members, opportunities, and
        events.
      </p>

      <button
        type="button"
        onClick={onContinue}
        className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#F5B544] px-8 text-sm font-semibold text-[#14213D] transition-colors hover:bg-[#F0A92D] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F5B544]/50"
      >
        Continue to dashboard
        <ArrowRight className="size-4" aria-hidden="true" />
      </button>

      <p className="mt-5 text-[13px] text-[#94A3B8]">
        You can update your profile, verification details, and role at any time.
      </p>
    </div>
  )
}
