import { Check } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";

interface AccountCreatedPanelProps {
  onContinue: () => void;
  onSkip: () => void;
}

export function AccountCreatedPanel({ onContinue, onSkip }: AccountCreatedPanelProps) {
  const reduced = useReducedMotion();
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-14 text-center sm:px-14">
      <motion.div
        initial={reduced ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="flex size-20 items-center justify-center rounded-full bg-[#5BA4E6] text-white"
      >
        <Check className="size-10" aria-hidden="true" />
      </motion.div>
      <h2 className="mt-6 font-display text-3xl font-bold text-[#14213D] sm:text-4xl">
        Your account is ready
      </h2>
      <p className="mt-3 max-w-md text-slate-600">
        Verify your identity to unlock full access, or skip and do it later.
      </p>
      <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
        <Button
          type="button"
          onClick={onContinue}
          className="h-14 rounded-xl bg-[#F5B544] text-base font-semibold text-[#14213D] hover:bg-[#E9A72F]"
        >
          Continue with KYC
        </Button>
        <button
          type="button"
          onClick={onSkip}
          className="h-11 text-sm font-semibold text-[#3F4FA0] hover:underline"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}