import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

export function Reveal({ index, children }: { index: number; children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: reduce ? 0 : index * 0.06 }}
    >
      {children}
    </motion.div>
  );
}
