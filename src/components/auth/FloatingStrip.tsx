import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

export const FLOAT_FADE_DELAY = 0.6;
export const FLOAT_FADE_DURATION = 0.5;

export interface FloatingStripProps {
  title: string;
  subtitle: string;
  icon?: ReactNode;
  className?: string;
  amplitude?: number;
  duration?: number;
  delay?: number;
}

const SHELL_CLASS =
  "pointer-events-none z-10 flex items-center gap-3 whitespace-nowrap rounded-2xl border border-white/[0.14] bg-[rgba(20,33,61,0.88)] px-3 py-2 shadow-[0_10px_30px_rgba(20,33,61,0.25)] backdrop-blur-md sm:px-4 sm:py-3";

export function FloatingStrip({
  title,
  subtitle,
  icon,
  className = "",
  amplitude = 8,
  duration = 4,
  delay = 0,
}: FloatingStripProps) {
  const prefersReducedMotion = useReducedMotion();

  const content = (
    <>
      {icon ? (
        <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-[rgba(245,181,68,0.18)] text-[#F5B544] sm:size-9">
          {icon}
        </span>
      ) : null}
      <span className="flex flex-col leading-tight">
        <span className="text-xs font-semibold text-white sm:text-sm">{title}</span>
        <span className="text-[10px] text-[#CBD5E1] sm:text-xs">{subtitle}</span>
      </span>
    </>
  );

  if (prefersReducedMotion) {
    return <div className={`${SHELL_CLASS} ${className}`}>{content}</div>;
  }

  return (
    <motion.div
      className={`${SHELL_CLASS} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: [0, -amplitude, 0] }}
      transition={{
        opacity: {
          delay: FLOAT_FADE_DELAY,
          duration: FLOAT_FADE_DURATION,
          ease: "easeOut",
        },
        y: {
          delay: FLOAT_FADE_DELAY + delay,
          duration,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
    >
      {content}
    </motion.div>
  );
}
