import { cn } from "@/lib/utils";

const TONES = ["bg-[#14213D]", "bg-[#7C5CBF]", "bg-[#E4573D]"] as const;
const SIZES = {
  sm: "size-[22px] text-[8px]",
  md: "size-6 text-[9px]",
} as const;

export function AvatarStack({ seeds, size = "sm" }: { seeds: string[]; size?: keyof typeof SIZES }) {
  return (
    <span aria-hidden className="flex shrink-0">
      {seeds.slice(0, 3).map((seed, i) => (
        <span
          key={seed}
          className={cn(
            "grid place-items-center rounded-full border-2 border-white font-semibold text-white -ml-1.5 first:ml-0",
            SIZES[size],
            TONES[i % TONES.length],
          )}
        >
          {seed}
        </span>
      ))}
    </span>
  );
}
