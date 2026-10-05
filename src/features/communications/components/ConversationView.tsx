import { useMemo, useState } from "react";
import type { Conversation, Message } from "../types";
import { useChatStore, useMessages } from "../useChatStore";
import { ChatHeader } from "./ChatHeader";
import { ChatSearchBar } from "./ChatSearchBar";
import { Composer } from "./Composer";
import { ConfirmDialog } from "./ConfirmDialog";
import { ContextBar } from "./ContextBar";
import { MessageList } from "./MessageList";

interface Props {
  conversation: Conversation;
  showBack: boolean;
  onBack: () => void;
  onInfo: () => void;
}

export function ConversationView({ conversation, showBack, onBack, onInfo }: Props) {
  const messages = useMessages(conversation.id);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [replyTarget, setReplyTarget] = useState<Message | null>(null);
  const [clearOpen, setClearOpen] = useState(false);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? messages.filter((m) => m.type === "text" && m.text?.toLowerCase().includes(q)) : [];
  }, [messages, query]);
  const activeMatch = matches[Math.min(index, Math.max(matches.length - 1, 0))];

  function step(dir: 1 | -1) {
    if (matches.length) setIndex((i) => (i + dir + matches.length) % matches.length);
  }

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
    setIndex(0);
  }

  return (
    <section aria-label={`Conversation with ${conversation.name}`} className="flex min-h-0 min-w-0 flex-col bg-white">
      <ChatHeader conversation={conversation} showBack={showBack} onBack={onBack} onInfo={onInfo} onSearch={() => setSearchOpen(true)} onClear={() => setClearOpen(true)} />
      {searchOpen && <ChatSearchBar query={query} onQuery={(q) => { setQuery(q); setIndex(0); }} total={matches.length} index={index} onStep={step} onClose={closeSearch} />}
      {conversation.opportunity && <ContextBar opportunity={conversation.opportunity} />}
      <MessageList key={conversation.id} conversation={conversation} messages={messages} query={query} activeMatchId={activeMatch?.id} onReply={setReplyTarget} />
      <Composer key={`composer-${conversation.id}`} conversation={conversation} replyTarget={replyTarget} onCancelReply={() => setReplyTarget(null)} />
      <ConfirmDialog
        open={clearOpen}
        onOpenChange={setClearOpen}
        title="Clear this chat?"
        description="All messages in this conversation will be removed for you."
        confirmLabel="Clear chat"
        onConfirm={() => { useChatStore.getState().clearChat(conversation.id); setClearOpen(false); }}
      />
    </section>
  );
}
