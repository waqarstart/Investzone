import { cn } from "@/lib/utils";
import type { NotificationFilter } from "../types";

const FILTERS: { id: NotificationFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "connections", label: "Connections" },
  { id: "opportunities", label: "Opportunities" },
  { id: "messages", label: "Messages" },
  { id: "mentions", label: "Mentions" },
];

export interface FilterPillsProps {
  value: NotificationFilter;
  onChange: (value: NotificationFilter) => void;
  counts: Record<NotificationFilter, number>;
}

export function FilterPills({ value, onChange, counts }: FilterPillsProps) {
  return (
    <nav
      aria-label="Filter notifications"
      className="rounded-2xl border border-[#E5E7EB] bg-white p-2 shadow-sm"
    >
      <ul className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((filter) => {
          const selected = filter.id === value;
          const count = filter.id === "all" ? 0 : counts[filter.id];
          return (
            <li key={filter.id} className="shrink-0">
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onChange(filter.id)}
                className={cn(
                  "flex h-11 items-center gap-2 whitespace-nowrap rounded-full px-4 text-[15px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B544]",
                  selected
                    ? "bg-[#14213D] text-white"
                    : "text-slate-600 hover:bg-[#F3F4F6]",
                )}
              >
                {filter.label}
                {count > 0 && (
                  <span
                    className={cn(
                      "min-w-5 rounded-full px-1.5 text-center text-xs font-semibold leading-5",
                      filter.id === "unread"
                        ? "bg-[#F2705A] text-white"
                        : selected
                          ? "bg-white/20 text-white"
                          : "bg-[#EEF0FA] text-[#3F4FA0]",
                    )}
                  >
                    {count}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}