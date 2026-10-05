import { cn } from "@/lib/utils";
import type { Tone } from "../types";

const SIZES = {
  sm: { box: "size-9 text-xs", dot: "" },
  md: { box: "size-14 text-lg", dot: "size-3.5 border-2" },
  lg: { box: "size-28 text-4xl ring-4 ring-[#EEF0FA]", dot: "size-5 border-[3px]" },
} as const;

interface Props {
  initials: string;
  tone: Tone;
  size?: keyof typeof SIZES;
  online?: boolean;
  className?: string;
}

export function ChatAvatar({ initials, tone, size = "md", online, className }: Props) {
  const s = SIZES[size];
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <span
        aria-hidden
        style={{ backgroundColor: tone.bg, color: tone.fg }}
        className={cn("grid place-items-center rounded-full font-semibold", s.box)}
      >
        {initials}
      </span>
      {online !== undefined && size !== "sm" && (
        <span
          role="img"
          aria-label={online ? "Online" : "Offline"}
          className={cn("absolute bottom-0 right-0 rounded-full border-white", s.dot, online ? "bg-[#5BA4E6]" : "bg-[#CBD5E1]")}
        />
      )}
    </span>
  );
}
