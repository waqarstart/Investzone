import { useNavigate } from "react-router-dom";
import type { Opportunity } from "../types";
import { FOCUS } from "../lib/format";

export function SharedOpportunityCard({ opportunity: o }: { opportunity: Opportunity }) {
  const navigate = useNavigate();
  const pct = Math.round((o.raised / o.target) * 100);
  return (
    <section aria-labelledby="shared-opp" className="border-b border-[#E5E7EB] px-5 py-5">
      <h4 id="shared-opp" className="text-[11px] font-medium uppercase tracking-wide text-[#94A3B8]">Shared opportunity</h4>
      <div className="mt-3 rounded-2xl border border-[#E5E7EB] bg-[#FAFAF8] p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[15px] font-semibold text-[#14213D]">{o.title}</p>
          <span className="shrink-0 rounded-md bg-[#EEF0FA] px-2 py-0.5 text-[11px] font-medium text-[#3F4FA0]">Active Deal</span>
        </div>
        <p className="mt-2 text-[13px] text-[#475569]">PKR {o.raised}M / {o.target}M raised</p>
        <div role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Funding raised" className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#E5E7EB]">
          <div style={{ width: `${pct}%` }} className="h-full rounded-full bg-[#F5B544]" />
        </div>
        <button type="button" onClick={() => navigate("/opportunities")} className={`mt-3 min-h-11 text-sm font-medium text-[#3F4FA0] hover:underline sm:min-h-0 ${FOCUS}`}>
          View opportunity →
        </button>
      </div>
    </section>
  );
}
