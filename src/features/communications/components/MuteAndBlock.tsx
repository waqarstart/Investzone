import { useState } from "react";
import { Ban } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { FOCUS } from "../lib/format";
import type { Conversation } from "../types";
import { useChatStore } from "../useChatStore";
import { BlockDialog } from "./BlockDialog";

export function MuteAndBlock({ conversation: c }: { conversation: Conversation }) {
  const [blockOpen, setBlockOpen] = useState(false);
  const { toggleMute, setBlocked } = useChatStore.getState();
  return (
    <div className="mt-auto space-y-4 border-t border-[#E5E7EB] px-5 py-5">
      <div className="flex min-h-11 items-center justify-between">
        <label htmlFor="mute-switch" className="text-sm text-[#14213D]">Mute notifications</label>
        <Switch id="mute-switch" checked={!!c.muted} onCheckedChange={() => toggleMute(c.id)} />
      </div>
      {c.blocked ? (
        <button type="button" onClick={() => setBlocked(c.id, false)} className={`inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#3F4FA0] hover:underline ${FOCUS}`}>
          Unblock {c.name}
        </button>
      ) : (
        <button type="button" onClick={() => setBlockOpen(true)} className={`inline-flex min-h-11 items-center gap-2 text-sm font-medium text-[#D9442F] hover:underline ${FOCUS}`}>
          <Ban aria-hidden className="size-4" />
          Block / Report {c.name}
        </button>
      )}
      <BlockDialog conversation={c} open={blockOpen} onOpenChange={setBlockOpen} />
    </div>
  );
}
