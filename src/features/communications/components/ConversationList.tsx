import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence } from "motion/react";
import { MessageSquareOff } from "lucide-react";
import { useChatStore, useVisibleConversations } from "../useChatStore";
import { ChatFilters } from "./ChatFilters";
import { ChatSearch } from "./ChatSearch";
import { ChatSkeleton } from "./ChatSkeleton";
import { ConfirmDialog } from "./ConfirmDialog";
import { ConversationRow } from "./ConversationRow";
import { ListHeader } from "./ListHeader";
import { NewChatDialog } from "./NewChatDialog";

interface Props {
  activeId: string | null;
  onOpen: (id: string) => void;
  onDeleted: (id: string) => void;
}

export function ConversationList({ activeId, onOpen, onDeleted }: Props) {
  const list = useVisibleConversations();
  const [loading, setLoading] = useState(true);
  const [composeOpen, setComposeOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  function onKeyDown(e: KeyboardEvent<HTMLUListElement>) {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    const rows = Array.from(listRef.current?.querySelectorAll<HTMLButtonElement>("[data-row]") ?? []);
    const i = rows.findIndex((r) => r === document.activeElement);
    const next = rows[e.key === "ArrowDown" ? Math.min(i + 1, rows.length - 1) : Math.max(i - 1, 0)];
    if (next) { e.preventDefault(); next.focus(); }
  }

  return (
    <aside aria-label="Conversations" className="flex min-h-0 min-w-0 flex-col border-r border-[#E5E7EB] bg-white">
      <ListHeader onCompose={() => setComposeOpen(true)} />
      <ChatSearch />
      <ChatFilters />
      <div className="min-h-0 flex-1 overflow-y-auto border-t border-[#E5E7EB]">
        {loading ? (
          <ChatSkeleton />
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
            <MessageSquareOff aria-hidden className="size-8 text-[#94A3B8]" />
            <p className="text-sm font-medium text-[#14213D]">No conversations match</p>
            <p className="text-[13px] text-[#475569]">Try a different search or filter.</p>
          </div>
        ) : (
          <ul ref={listRef} onKeyDown={onKeyDown}>
            <AnimatePresence initial={false}>
              {list.map((c) => (
                <ConversationRow key={c.id} conversation={c} selected={c.id === activeId} onOpen={() => onOpen(c.id)} onDelete={() => setDeleteId(c.id)} />
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
      <NewChatDialog open={composeOpen} onOpenChange={setComposeOpen} onOpenChat={onOpen} />
      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title="Delete this chat?"
        description="The conversation and its messages will be removed for you."
        confirmLabel="Delete chat"
        onConfirm={() => { if (deleteId) { useChatStore.getState().deleteChat(deleteId); onDeleted(deleteId); } setDeleteId(null); }}
      />
    </aside>
  );
}
