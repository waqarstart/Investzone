import { ChevronDown } from "lucide-react";

export function ScrollToLatestButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={count > 0 ? `Scroll to latest, ${count} new` : "Scroll to latest"}
      className="absolute bottom-4 right-4 grid size-11 place-items-center rounded-full border border-[#E5E7EB] bg-white text-[#14213D] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_6px_20px_rgba(16,24,40,0.12)] focus-visible:outline-2 focus-visible:outline-[#3F4FA0] sm:size-10"
    >
      <ChevronDown aria-hidden className="size-5" />
      {count > 0 && <span className="absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full bg-[#F2705A] text-[10px] font-semibold text-white">{count}</span>}
    </button>
  );
}
