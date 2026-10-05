import { AnimatePresence } from "motion/react";
import { Zap } from "lucide-react";
import { useFilteredRaises, useOpportunitiesStore, useVisibleSlice } from "../useOpportunitiesStore";
import { CARD_CLASS, SECTORS, SIZE_OPTIONS, STAGES } from "../lib";
import { ColumnHeader } from "./ColumnHeader";
import { FilterBar, type FilterGroup } from "./FilterBar";
import { PremiumUpsell } from "./PremiumUpsell";
import { RaiseRow } from "./RaiseRow";
import { RowSkeleton } from "./RowSkeleton";
import { ShowMoreButton } from "./ShowMoreButton";

const GROUPS: FilterGroup[] = [
  { key: "sector", label: "Sector", options: SECTORS },
  { key: "size", label: "Raise size", options: SIZE_OPTIONS },
  { key: "stage", label: "Stage", options: STAGES },
];

export function FoundersColumn() {
  const list = useFilteredRaises();
  const { shown, remaining, loading } = useVisibleSlice(list, "founders");
  const filters = useOpportunitiesStore((s) => s.filters.founders);
  const { setFilter, clearFilters, showMore } = useOpportunitiesStore.getState();

  return (
    <section aria-labelledby="founders-title" className={`${CARD_CLASS} p-5 sm:p-6`}>
      <ColumnHeader id="founders-title" title="Founders" count={list.length} countWord="Live Rounds" subtitle="Verified raises open for investment" />
      <FilterBar allLabel="All Raises" groups={GROUPS} values={filters} onChange={(k, v) => setFilter("founders", k, v)} onClear={() => clearFilters("founders")} />
      <ul className="mt-4">
        <AnimatePresence initial={false}>
          {shown.map((r, i) => (
            <RaiseRow key={r.id} raise={r} defaultOpen={i === 0} />
          ))}
        </AnimatePresence>
        {loading && <RowSkeleton />}
      </ul>
      {shown.length === 0 && <p className="py-8 text-center text-sm text-[#475569]">No live rounds match these filters.</p>}
      <PremiumUpsell tone="warm" icon={Zap} title="See every curated deal before syndicates close" muted="Over 350 active Angels" emphasis="Early access & data rooms" />
      <ShowMoreButton label="Show more founders" remaining={remaining} loading={loading} onClick={() => void showMore("founders")} />
    </section>
  );
}
