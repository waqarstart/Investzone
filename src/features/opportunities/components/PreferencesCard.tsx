import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ChevronUp, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CARD_CLASS, getPreferenceChips } from "../lib";
import { useOpportunitiesStore } from "../useOpportunitiesStore";
import { PreferenceChip } from "./PreferenceChip";

function AddPreferencesButton({ className }: { className?: string }) {
  return (
    <Button
      type="button"
      onClick={() => useOpportunitiesStore.getState().setPanel("preferences")}
      className={cn("h-11 rounded-xl bg-[#EEF0FA] px-4 text-[#3F4FA0] hover:bg-[#E2E6F6] md:h-10", className)}
    >
      <Plus aria-hidden className="size-4" /> Add preferences
    </Button>
  );
}

export function PreferencesCard() {
  const [open, setOpen] = useState(true);
  const reduce = useReducedMotion();
  const prefs = useOpportunitiesStore((s) => s.prefs);
  const { removePref, resetPrefs } = useOpportunitiesStore.getState();
  const chips = getPreferenceChips(prefs);

  return (
    <section aria-labelledby="prefs-title" className={`${CARD_CLASS} p-5 sm:p-6`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-[#94A3B8]">Deal flow tailoring</p>
          <h2 id="prefs-title" className="mt-1.5 font-display text-[22px] font-bold text-[#14213D] sm:text-[28px]">
            Opportunities based on your preferences
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <AddPreferencesButton className="hidden sm:inline-flex" />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="prefs-chips"
            aria-label={open ? "Collapse preferences" : "Expand preferences"}
            className="size-10 rounded-full"
          >
            <ChevronUp aria-hidden className={cn("size-4 transition-transform", !open && "rotate-180")} />
          </Button>
        </div>
      </div>
      <AddPreferencesButton className="mt-4 w-full sm:hidden" />
      <motion.div
        id="prefs-chips"
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: reduce ? 0 : 0.25 }}
        className="overflow-hidden"
        aria-hidden={!open}
      >
        {chips.length > 0 ? (
          <ul className="flex flex-wrap items-center gap-2.5 pt-5">
            {chips.map((c) => (
              <li key={c.key} className="max-w-full">
                <PreferenceChip label={c.label} value={c.value} onRemove={() => removePref(c.key)} />
              </li>
            ))}
            <li>
              <button type="button" onClick={resetPrefs} className="min-h-11 text-[13px] font-medium text-[#3F4FA0] hover:underline md:min-h-0">
                Reset all
              </button>
            </li>
          </ul>
        ) : (
          <p className="pt-5 text-[13.5px] text-[#94A3B8]">No preferences set. Add preferences to see better matches.</p>
        )}
      </motion.div>
    </section>
  );
}
