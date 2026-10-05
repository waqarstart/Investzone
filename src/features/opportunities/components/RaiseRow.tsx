import { useState } from "react";
import { Bookmark, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useOpportunitiesStore } from "../useOpportunitiesStore";
import { AMBER_BUTTON } from "../lib";
import type { Raise } from "../types";
import { AnimatedRow } from "./AnimatedRow";
import { CollapsePanel, DetailsToggle } from "./CollapsePanel";
import { FoundersPanel } from "./FoundersPanel";
import { FundingProgress } from "./FundingProgress";
import { InterestStack } from "./InterestStack";
import { LogoTile } from "./LogoTile";
import { MatchLine } from "./MatchLine";
import { RowFooter } from "./RowFooter";
import { VerifiedBadge } from "./VerifiedBadge";

interface Props {
  raise: Raise;
  defaultOpen: boolean;
}

export function RaiseRow({ raise: r, defaultOpen }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [loading, setLoading] = useState(false);
  const interested = useOpportunitiesStore((s) => s.interested.includes(r.id));
  const saved = useOpportunitiesStore((s) => s.saved.includes(r.id));
  const addInterested = useOpportunitiesStore((s) => s.addInterested);
  const toggleSaved = useOpportunitiesStore((s) => s.toggleSaved);
  const panelId = `founders-${r.id}`;
  const urgent = r.closingDays <= 7;

  async function express() {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    addInterested(r.id);
    setLoading(false);
    toast.success(`Interest sent to ${r.company} (demo)`);
  }

  function save() {
    toggleSaved(r.id);
    toast(saved ? "Removed from saved" : "Saved");
  }

  return (
    <AnimatedRow>
      <div className="flex gap-3 sm:gap-4">
        <LogoTile initials={r.initials} bg={r.bg} fg={r.fg} />
        <div className="min-w-0 flex-1 space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-[18px] font-semibold leading-snug">
              <button type="button" onClick={() => setOpen((v) => !v)} className="text-left text-[#3F4FA0] hover:underline focus-visible:outline-2 focus-visible:outline-[#3F4FA0]">
                {r.title}
              </button>
            </h3>
            <VerifiedBadge />
          </div>
          <p className="truncate text-[13.5px] text-[#475569]">{r.subtitle}</p>
          <p className="line-clamp-2 text-[13.5px] text-[#475569]">{r.pitch}</p>
          <FundingProgress raisedM={r.raisedM} targetM={r.targetM} minTicketM={r.minTicketM} />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <InterestStack seeds={r.interestedBy} count={r.interested + (interested ? 1 : 0)} />
            <MatchLine />
          </div>
          <CollapsePanel open={open} id={panelId}>
            <FoundersPanel founders={r.founders} traction={r.traction} />
          </CollapsePanel>
          <RowFooter
            meta={
              <>
                <span className={cn("text-[13px]", urgent ? "font-semibold text-[#D9442F]" : "text-[#475569]")}>
                  Closing in {r.closingDays} days
                </span>
                <span className="text-[12.5px] text-[#94A3B8]">{r.postedAgo}</span>
                <DetailsToggle open={open} controls={panelId} onClick={() => setOpen((v) => !v)} />
              </>
            }
            actions={
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={save}
                  aria-pressed={saved}
                  aria-label={saved ? "Remove from saved" : "Save opportunity"}
                  className="size-11 rounded-lg md:size-10"
                >
                  <Bookmark className={cn("size-4", saved && "fill-[#F5B544] text-[#14213D]")} />
                </Button>
                <Button
                  type="button"
                  disabled={interested || loading}
                  onClick={express}
                  className={cn("h-11 flex-1 rounded-lg px-4 md:h-10 sm:flex-none", AMBER_BUTTON)}
                >
                  {loading ? <Loader2 aria-hidden className="size-4 animate-spin" /> : null}
                  {interested ? <>Interest sent <Check aria-hidden className="size-4" /></> : "Express interest"}
                </Button>
              </>
            }
          />
        </div>
      </div>
    </AnimatedRow>
  );
}
