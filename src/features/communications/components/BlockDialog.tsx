import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Conversation } from "../types";
import { useChatStore } from "../useChatStore";

const REASONS = ["Spam", "Inappropriate content", "Other"] as const;

function BlockForm({ conversation: c, onClose }: { conversation: Conversation; onClose: () => void }) {
  const [reason, setReason] = useState<string>(REASONS[0]);
  return (
    <>
      <fieldset className="space-y-1">
        <legend className="sr-only">Reason</legend>
        {REASONS.map((r) => (
          <label key={r} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 text-sm text-[#14213D] hover:bg-[#FAFAF8]">
            <input type="radio" name="block-reason" value={r} checked={reason === r} onChange={() => setReason(r)} className="size-4 accent-[#3F4FA0]" />
            {r}
          </label>
        ))}
      </fieldset>
      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button
          type="button"
          onClick={() => { useChatStore.getState().setBlocked(c.id, true); toast(`${c.name} blocked (demo)`); onClose(); }}
          className="bg-[#F2705A] text-white hover:bg-[#E15C45]"
        >
          Block
        </Button>
      </DialogFooter>
    </>
  );
}

interface Props {
  conversation: Conversation;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BlockDialog({ conversation, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Block / Report {conversation.name}</DialogTitle>
          <DialogDescription>They won't be able to message you. Choose a reason.</DialogDescription>
        </DialogHeader>
        <BlockForm conversation={conversation} onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
