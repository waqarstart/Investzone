import { Search, X } from "lucide-react";
import { FOCUS } from "../lib/format";
import { useChatStore } from "../useChatStore";

export function ChatSearch() {
  const query = useChatStore((s) => s.query);
  const setQuery = useChatStore((s) => s.setQuery);
  return (
    <div className="relative px-5 pt-4">
      <Search aria-hidden className="pointer-events-none absolute left-8 top-1/2 mt-2 size-4 -translate-y-1/2 text-[#94A3B8]" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search or start a new chat"
        aria-label="Search conversations"
        className={`h-12 w-full rounded-xl bg-[#EEF0FA] pl-10 pr-10 text-[15px] text-[#14213D] placeholder:text-[#64748B] ${FOCUS}`}
      />
      {query && (
        <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className={`absolute right-7 top-1/2 mt-2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-[#475569] ${FOCUS}`}>
          <X aria-hidden className="size-4" />
        </button>
      )}
    </div>
  );
}
