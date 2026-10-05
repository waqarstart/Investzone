import { useState } from "react";
import { cn } from "@/lib/utils";
import { useFilteredMandates, useFilteredRaises } from "../useOpportunitiesStore";
import { FoundersColumn } from "./FoundersColumn";
import { InvestorsColumn } from "./InvestorsColumn";

type Tab = "investors" | "founders";

export function OpportunityColumns() {
  const [tab, setTab] = useState<Tab>("investors");
  const mandates = useFilteredMandates().length;
  const raises = useFilteredRaises().length;
  const tabs: { key: Tab; label: string }[] = [
    { key: "investors", label: `Investors (${mandates})` },
    { key: "founders", label: `Founders (${raises})` },
  ];

  return (
    <div>
      <div role="tablist" aria-label="Opportunity type" className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-[#ECEAE3] p-1 lg:hidden">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "h-11 rounded-lg text-sm focus-visible:outline-2 focus-visible:outline-[#3F4FA0]",
              tab === t.key ? "bg-[#F5B544] font-semibold text-[#14213D]" : "text-[#475569]",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <div className={cn("min-w-0", tab === "investors" ? "block" : "hidden", "lg:block")}>
          <InvestorsColumn />
        </div>
        <div className={cn("min-w-0", tab === "founders" ? "block" : "hidden", "lg:block")}>
          <FoundersColumn />
        </div>
      </div>
    </div>
  );
}
