import { cn } from "@/lib/utils";

const SIZES = {
  md: "size-12 text-xl sm:size-16 sm:text-2xl rounded-2xl",
  sm: "size-10 text-base rounded-xl",
} as const;

interface Props {
  initials: string;
  bg: string;
  fg: string;
  size?: keyof typeof SIZES;
}

export function LogoTile({ initials, bg, fg, size = "md" }: Props) {
  return (
    <div
      aria-hidden
      style={{ backgroundColor: bg, color: fg }}
      className={cn("grid shrink-0 place-items-center font-display font-bold", SIZES[size])}
    >
      {initials}
    </div>
  );
}
