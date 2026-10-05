import { AnimatePresence } from "motion/react";
import { Award } from "lucide-react";
import { useFilteredMandates, useOpportunitiesStore, useVisibleSlice } from "../useOpportunitiesStore";
import { CARD_CLASS, SECTORS, SIZE_OPTIONS, STAGES } from "../lib";
import { ColumnHeader } from "./ColumnHeader";
import { FilterBar, type FilterGroup } from "./FilterBar";
import { MandateRow } from "./MandateRow";
import { PremiumUpsell } from "./PremiumUpsell";
import { RowSkeleton } from "./RowSkeleton";
import { ShowMoreButton } from "./ShowMoreButton";

const GROUPS: FilterGroup[] = [
  { key: "sector", label: "Sector", options: SECTORS },
  { key: "size", label: "Ticket size", options: SIZE_OPTIONS },
  { key: "stage", label: "Stage", options: STAGES },
];

export function InvestorsColumn() {
  const list = useFilteredMandates();
  const { shown, remaining, loading } = useVisibleSlice(list, "investors");
  const filters = useOpportunitiesStore((s) => s.filters.investors);
  const pitched = useOpportunitiesStore((s) => s.pitched);
  const { setFilter, clearFilters, showMore, setPitchTarget } = useOpportunitiesStore.getState();

  return (
    <section aria-labelledby="investors-title" className={`${CARD_CLASS} p-5 sm:p-6`}>
      <ColumnHeader id="investors-title" title="Investors" count={list.length} countWord="Mandates" subtitle="Mandates from verified investors, matched to your idea" />
      <FilterBar allLabel="All Mandates" groups={GROUPS} values={filters} onChange={(k, v) => setFilter("investors", k, v)} onClear={() => clearFilters("investors")} />
      <ul className="mt-4">
        <AnimatePresence initial={false}>
          {shown.map((m, i) => (
            <MandateRow key={m.id} mandate={m} defaultOpen={i === 0} pitched={pitched.includes(m.id)} onPitch={setPitchTarget} />
          ))}
        </AnimatePresence>
        {loading && <RowSkeleton />}
      </ul>
      {shown.length === 0 && <p className="py-8 text-center text-sm text-[#475569]">No mandates match these filters.</p>}
      <PremiumUpsell tone="grey" icon={Award} title="See every opportunity where you'd be a top match" muted="Members use Premium" emphasis="Unlock unlimited requests" />
      <ShowMoreButton label="Show more investors" remaining={remaining} loading={loading} onClick={() => void showMore("investors")} />
    </section>
  );
}
