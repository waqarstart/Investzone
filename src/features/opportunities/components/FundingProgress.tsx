import { motion, useReducedMotion } from "motion/react";
import { percentRaised } from "../lib";

interface Props {
  raisedM: number;
  targetM: number;
  minTicketM: number;
}

export function FundingProgress({ raisedM, targetM, minTicketM }: Props) {
  const reduce = useReducedMotion();
  const pct = percentRaised(raisedM, targetM);
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <p className="text-[13px] font-semibold text-[#14213D]">
          PKR {raisedM}M of {targetM}M ({pct}%)
        </p>
        <p className="text-xs text-[#94A3B8]">Min ticket PKR {minTicketM}M</p>
      </div>
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Funding raised"
        className="h-1.5 overflow-hidden rounded-full bg-[#E5E7EB]"
      >
        <motion.div
          className="h-full rounded-full bg-[#F5B544]"
          initial={reduce ? false : { width: 0 }}
          animate={{ width: `${Math.min(pct, 100)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
