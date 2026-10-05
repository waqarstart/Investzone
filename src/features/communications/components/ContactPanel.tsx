import type { Conversation } from "../types";
import { ContactHeader, ContactPanelHeader } from "./ContactHeader";
import { MediaGrid } from "./MediaGrid";
import { MuteAndBlock } from "./MuteAndBlock";
import { MutualConnections } from "./MutualConnections";
import { SharedOpportunityCard } from "./SharedOpportunityCard";

interface Props {
  conversation: Conversation;
  onClose: () => void;
}

export function ContactPanel({ conversation: c, onClose }: Props) {
  const chat = () => {
    onClose();
    requestAnimationFrame(() => document.getElementById("composer-input")?.focus());
  };
  return (
    <aside aria-label="Contact info" className="flex min-h-0 min-w-0 flex-col border-l border-[#E5E7EB] bg-white">
      <ContactPanelHeader onClose={onClose} />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <ContactHeader conversation={c} onChat={chat} />
        {c.opportunity && <SharedOpportunityCard opportunity={c.opportunity} />}
        <MediaGrid media={c.media} />
        <MutualConnections mutuals={c.mutuals} />
        <MuteAndBlock conversation={c} />
      </div>
    </aside>
  );
}
