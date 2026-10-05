import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function CollapsePanel({ open, id, children }: { open: boolean; id: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          id={id}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.25 }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface ToggleProps {
  open: boolean;
  controls: string;
  onClick: () => void;
}

export function DetailsToggle({ open, controls, onClick }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls={controls}
      className="inline-flex min-h-11 items-center gap-1 rounded-md text-[13px] font-medium text-[#3F4FA0] hover:underline focus-visible:outline-2 focus-visible:outline-[#3F4FA0] md:min-h-0"
    >
      More details
      <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} aria-hidden />
    </button>
  );
}
