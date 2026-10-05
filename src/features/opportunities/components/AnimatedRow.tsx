import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

export function AnimatedRow({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.li
      layout={!reduce}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, height: 0 }}
      className="border-b border-[#E5E7EB] py-5 last:border-b-0"
    >
      {children}
    </motion.li>
  );
}
