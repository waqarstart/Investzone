import { X } from "lucide-react";

interface Props {
  label: string;
  value: string;
  onRemove: () => void;
}

export function PreferenceChip({ label, value, onRemove }: Props) {
  return (
    <span className="inline-flex h-9 max-w-full items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-[#F3F4F6] pl-3.5 pr-1.5 text-[13px]">
      <span className="text-[#94A3B8]">{label}:</span>
      <span className="truncate font-semibold text-[#14213D]">{value}</span>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove filter"
        className="grid size-7 shrink-0 place-items-center rounded-full text-[#475569] hover:bg-white focus-visible:outline-2 focus-visible:outline-[#3F4FA0]"
      >
        <X aria-hidden className="size-3.5" />
      </button>
    </span>
  );
}
