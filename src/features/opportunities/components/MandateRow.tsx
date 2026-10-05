import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AMBER_BUTTON } from "../lib";
import type { Mandate } from "../types";
import { AnimatedRow } from "./AnimatedRow";
import { CollapsePanel, DetailsToggle } from "./CollapsePanel";
import { LogoTile } from "./LogoTile";
import { MandateChips } from "./MandateChips";
import { MatchLine } from "./MatchLine";
import { RowFooter } from "./RowFooter";
import { ThesisPanel } from "./ThesisPanel";
import { VerifiedBadge } from "./VerifiedBadge";

interface Props {
  mandate: Mandate;
  defaultOpen: boolean;
  pitched: boolean;
  onPitch: (id: string) => void;
}

export function MandateRow({ mandate: m, defaultOpen, pitched, onPitch }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `thesis-${m.id}`;
  return (
    <AnimatedRow>
      <div className="flex gap-3 sm:gap-4">
        <LogoTile initials={m.initials} bg={m.bg} fg={m.fg} />
        <div className="min-w-0 flex-1 space-y-2.5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 text-[18px] font-semibold leading-snug">
              <button type="button" onClick={() => setOpen((v) => !v)} className="text-left text-[#3F4FA0] hover:underline focus-visible:outline-2 focus-visible:outline-[#3F4FA0]">
                {m.title}
              </button>
            </h3>
            <VerifiedBadge />
          </div>
          <p className="truncate text-[13.5px] text-[#475569]">{m.subtitle}</p>
          <MandateChips chips={m.chips} />
          <MatchLine />
          <CollapsePanel open={open} id={panelId}>
            <ThesisPanel thesis={m.thesis} recent={m.recent} />
          </CollapsePanel>
          <RowFooter
            meta={
              <>
                <span className="text-[12.5px] text-[#94A3B8]">{m.postedAgo}</span>
                <span className={cn("text-[11.5px]", m.tag.tinted ? "rounded-md bg-[#EEF0FA] px-2 py-1 font-medium text-[#3F4FA0]" : "text-[#475569]")}>
                  {m.tag.text}
                </span>
                <DetailsToggle open={open} controls={panelId} onClick={() => setOpen((v) => !v)} />
              </>
            }
            actions={
              <Button
                type="button"
                disabled={pitched}
                onClick={() => onPitch(m.id)}
                className={cn("h-11 flex-1 rounded-lg px-4 md:h-10 sm:flex-none", AMBER_BUTTON)}
              >
                {pitched ? <>Pitch sent <Check aria-hidden className="size-4" /></> : "Pitch to this investor"}
              </Button>
            }
          />
        </div>
      </div>
    </AnimatedRow>
  );
}
