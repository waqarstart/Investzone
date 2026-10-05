import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CONNECTIONS } from "../data";
import { FOCUS } from "../lib/format";
import { useChatStore } from "../useChatStore";
import { ChatAvatar } from "./ChatAvatar";
import { RoleBadge } from "./RoleBadge";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenChat: (id: string) => void;
}

export function NewChatDialog({ open, onOpenChange, onOpenChat }: Props) {
  const [query, setQuery] = useState("");
  const people = CONNECTIONS.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) setQuery(""); }}>
      <DialogContent className="max-h-[85vh] overflow-hidden sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New message</DialogTitle>
          <DialogDescription>Choose a connection to start chatting.</DialogDescription>
        </DialogHeader>
        <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search connections" aria-label="Search connections" />
        <ul className="-mx-2 max-h-[50vh] overflow-y-auto">
          {people.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => { const id = useChatStore.getState().startChat(p); onOpenChat(id); onOpenChange(false); setQuery(""); }}
                className={`flex min-h-12 w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-[#EEF0FA] ${FOCUS}`}
              >
                <ChatAvatar initials={p.initials} tone={p.tone} size="sm" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-[#14213D]">{p.name}</span>
                  <span className="block truncate text-xs text-[#475569]">{p.headline}</span>
                </span>
                <RoleBadge role={p.role} />
              </button>
            </li>
          ))}
          {people.length === 0 && <li className="py-6 text-center text-sm text-[#94A3B8]">No connections found</li>}
        </ul>
      </DialogContent>
    </Dialog>
  );
}
