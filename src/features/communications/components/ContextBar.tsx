import { Handshake } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Opportunity } from "../types";
import { FOCUS } from "../lib/format";

export function ContextBar({ opportunity: o }: { opportunity: Opportunity }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-2 border-b border-[#E5E7EB] bg-[#EEF0FA] px-5 py-2.5 sm:flex-row sm:items-center sm:gap-3">
      <p className="flex min-w-0 flex-1 items-center gap-2 text-[13.5px] text-[#14213D]">
        <Handshake aria-hidden className="size-4 shrink-0 text-[#3F4FA0]" />
        <span className="truncate">
          Regarding: <strong className="font-semibold">{o.title}</strong> · PKR {o.raised}M of {o.target}M raised
        </span>
      </p>
      <button
        type="button"
        onClick={() => navigate("/opportunities")}
        className={`h-11 shrink-0 self-start whitespace-nowrap rounded-full border border-[#3F4FA0] bg-white px-4 text-[13px] font-medium text-[#3F4FA0] hover:bg-[#F7F8FD] sm:h-9 ${FOCUS}`}
      >
        View opportunity →
      </button>
    </div>
  );
}
