import { Check, ShieldAlert } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";

interface FinalViewProps {
  status: "verified" | "skipped";
  firstName: string;
  onHome: () => void;
  onResume: () => void;
}

export function FinalView({ status, firstName, onHome, onResume }: FinalViewProps) {
  const reduced = useReducedMotion();
  const verified = status === "verified";

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-14 text-center sm:px-14">
      <motion.div
        initial={reduced ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className={
          verified
            ? "flex size-20 items-center justify-center rounded-full bg-[#5BA4E6] text-white"
            : "flex size-20 items-center justify-center rounded-full bg-[#FEF3D8] text-[#8A5A00]"
        }
      >
        {verified ? <Check className="size-10" aria-hidden="true" /> : <ShieldAlert className="size-10" aria-hidden="true" />}
      </motion.div>

      <h2 className="mt-6 font-display text-3xl font-bold text-[#14213D] sm:text-4xl">
        {verified ? "You're KYC verified" : "Your account is ready"}
      </h2>
      <p className="mt-3 max-w-md text-slate-600">
        {verified
          ? `Thanks, ${firstName}. Your identity has been verified.`
          : "You skipped KYC, so your account is marked Not KYC verified. You can complete it any time."}
      </p>

      <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
        <Button
          type="button"
          onClick={onHome}
          className="h-14 rounded-xl bg-[#F5B544] text-base font-semibold text-[#14213D] hover:bg-[#E9A72F]"
        >
          Continue to home
        </Button>
        {!verified && (
          <Button type="button" variant="outline" onClick={onResume} className="h-12 rounded-xl">
            Complete KYC now
          </Button>
        )}
      </div>
    </div>
  );
}