import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  query: string;
  onQuery: (q: string) => void;
  total: number;
  index: number;
  onStep: (dir: 1 | -1) => void;
  onClose: () => void;
}

export function ChatSearchBar({ query, onQuery, total, index, onStep, onClose }: Props) {
  return (
    <div className="flex items-center gap-2 border-b border-[#E5E7EB] bg-white px-4 py-2">
      <input
        autoFocus
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onStep(e.shiftKey ? -1 : 1); } if (e.key === "Escape") onClose(); }}
        placeholder="Search in conversation"
        aria-label="Search in conversation"
        className="h-10 min-w-0 flex-1 rounded-lg bg-[#EEF0FA] px-3 text-sm text-[#14213D] placeholder:text-[#64748B] focus:outline-2 focus:outline-[#3F4FA0]"
      />
      <span className="shrink-0 text-xs text-[#475569]" aria-live="polite">{total ? `${index + 1} of ${total}` : "0 of 0"}</span>
      <Button type="button" variant="ghost" size="icon" aria-label="Previous match" disabled={!total} onClick={() => onStep(-1)} className="size-10"><ChevronUp aria-hidden className="size-4" /></Button>
      <Button type="button" variant="ghost" size="icon" aria-label="Next match" disabled={!total} onClick={() => onStep(1)} className="size-10"><ChevronDown aria-hidden className="size-4" /></Button>
      <Button type="button" variant="ghost" size="icon" aria-label="Close search" onClick={onClose} className="size-10"><X aria-hidden className="size-4" /></Button>
    </div>
  );
}
