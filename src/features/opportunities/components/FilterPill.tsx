import { cn } from "@/lib/utils";

interface Props {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export function FilterPill({ label, selected, onClick }: Props) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "h-9 rounded-full px-3.5 text-[13px] focus-visible:outline-2 focus-visible:outline-[#3F4FA0] md:h-8",
        selected ? "bg-[#F5B544] font-semibold text-[#14213D]" : "border border-[#E5E7EB] bg-white text-[#475569] hover:bg-[#FAFAF8]",
      )}
    >
      {label}
    </button>
  );
}
