import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { Listing } from "../types";
import { useMediaQuery } from "../useMediaQuery";
import { useAllListings, useOpportunitiesStore } from "../useOpportunitiesStore";
import { LogoTile } from "./LogoTile";

type Tab = "saved" | "pitched" | "interested";
const TABS: { key: Tab; label: string; status: string }[] = [
  { key: "saved", label: "Saved", status: "Saved" },
  { key: "pitched", label: "Pitched", status: "Pitch sent" },
  { key: "interested", label: "Interested", status: "Interest sent" },
];

function TrackerRow({ item, status, onRemove }: { item: Listing; status: string; onRemove: () => void }) {
  return (
    <li className="flex items-center gap-3 border-b border-[#E5E7EB] py-3 last:border-b-0">
      <LogoTile initials={item.initials} bg={item.bg} fg={item.fg} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#14213D]">{item.title}</p>
        <p className="truncate text-xs text-[#475569]">{item.subtitle}</p>
        <span className="mt-1 inline-block rounded-md bg-[#EEF0FA] px-2 py-0.5 text-[11px] font-medium text-[#3F4FA0]">{status}</span>
      </div>
      <Button type="button" variant="ghost" size="sm" onClick={onRemove} className="text-[#D9442F]">Remove</Button>
    </li>
  );
}

export function DealTrackerSheet() {
  const [tab, setTab] = useState<Tab>("saved");
  const wide = useMediaQuery("(min-width: 640px)");
  const open = useOpportunitiesStore((s) => s.panel === "tracker");
  const saved = useOpportunitiesStore((s) => s.saved);
  const pitched = useOpportunitiesStore((s) => s.pitched);
  const interested = useOpportunitiesStore((s) => s.interested);
  const { toggleSaved, removePitched, removeInterested, setPanel } = useOpportunitiesStore.getState();
  const { mandates, raises } = useAllListings();

  const items: Record<Tab, { list: Listing[]; remove: (id: string) => void }> = {
    saved: { list: raises.filter((r) => saved.includes(r.id)), remove: toggleSaved },
    pitched: { list: mandates.filter((m) => pitched.includes(m.id)), remove: removePitched },
    interested: { list: raises.filter((r) => interested.includes(r.id)), remove: removeInterested },
  };
  const current = TABS.find((t) => t.key === tab) ?? TABS[0];

  return (
    <Sheet open={open} onOpenChange={(o) => setPanel(o ? "tracker" : null)}>
      <SheetContent side={wide ? "right" : "bottom"} className={cn("overflow-y-auto", wide ? "w-full sm:max-w-md" : "max-h-[85vh]")}>
        <SheetHeader>
          <SheetTitle className="font-display text-2xl">Deal tracker</SheetTitle>
          <SheetDescription>Everything you've saved, pitched or shown interest in.</SheetDescription>
        </SheetHeader>
        <div className="px-4 pb-6">
          <div role="tablist" className="mb-3 grid grid-cols-3 gap-1 rounded-xl bg-[#ECEAE3] p-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={cn("h-10 rounded-lg text-[13px]", tab === t.key ? "bg-[#F5B544] font-semibold text-[#14213D]" : "text-[#475569]")}
              >
                {t.label} ({items[t.key].list.length})
              </button>
            ))}
          </div>
          {items[tab].list.length === 0 ? (
            <p className="py-10 text-center text-sm text-[#94A3B8]">Nothing here yet</p>
          ) : (
            <ul>
              {items[tab].list.map((item) => (
                <TrackerRow key={item.id} item={item} status={current.status} onRemove={() => items[tab].remove(item.id)} />
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
