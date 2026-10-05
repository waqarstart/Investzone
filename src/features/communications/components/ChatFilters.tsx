import { cn } from "@/lib/utils";
import { FOCUS } from "../lib/format";
import type { ChatFilter } from "../types";
import { useChatStore, useUnreadTotal } from "../useChatStore";

const FILTERS: { key: ChatFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "investors", label: "Investors" },
  { key: "founders", label: "Founders" },
];

export function ChatFilters() {
  const filter = useChatStore((s) => s.filter);
  const setFilter = useChatStore((s) => s.setFilter);
  const unread = useUnreadTotal();
  return (
    <div role="group" aria-label="Filter conversations" className="flex gap-2 overflow-x-auto px-5 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          type="button"
          aria-pressed={filter === f.key}
          onClick={() => setFilter(f.key)}
          className={cn(
            "inline-flex h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-sm sm:h-9",
            FOCUS,
            filter === f.key ? "bg-[#14213D] font-medium text-white" : "text-[#475569] hover:bg-[#EEF0FA]",
          )}
        >
          {f.label}
          {f.key === "unread" && unread > 0 && (
            <span className="grid size-[18px] place-items-center rounded-full bg-[#F2705A] text-[11px] font-semibold text-white">{unread}</span>
          )}
        </button>
      ))}
    </div>
  );
}
