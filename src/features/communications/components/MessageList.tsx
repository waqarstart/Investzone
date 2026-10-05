import { useEffect, useMemo, useRef, useState } from "react";
import { BRIDGE_PATTERN, buildItems, firstName } from "../lib/format";
import type { Conversation, Message } from "../types";
import { useChatStore } from "../useChatStore";
import { DateSeparator } from "./DateSeparator";
import { MessageBubble } from "./MessageBubble";
import { ScrollToLatestButton } from "./ScrollToLatestButton";
import { SystemNotice } from "./SystemNotice";
import { TypingBubble } from "./TypingBubble";

interface Props {
  conversation: Conversation;
  messages: Message[];
  query: string;
  activeMatchId?: string;
  onReply: (m: Message) => void;
}

export function MessageList({ conversation, messages, query, activeMatchId, onReply }: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const atBottom = useRef(true);
  const prevLength = useRef(messages.length);
  const [away, setAway] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const typingNow = useChatStore((s) => !!s.typing[conversation.id]);
  const showTyping = typingNow || !!conversation.idleTyping;
  const items = useMemo(() => buildItems(messages), [messages]);
  const hasChat = messages.some((m) => m.type !== "system");

  const toBottom = (smooth: boolean) => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  };

  useEffect(() => {
    toBottom(false);
    prevLength.current = messages.length;
    setNewCount(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation.id]);

  useEffect(() => {
    const grew = messages.length > prevLength.current;
    prevLength.current = messages.length;
    const last = messages[messages.length - 1];
    if (atBottom.current || last?.senderId === "me") toBottom(true);
    else if (grew) setNewCount((n) => n + 1);
  }, [messages, showTyping]);

  useEffect(() => {
    if (activeMatchId) document.getElementById(`msg-${activeMatchId}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [activeMatchId]);

  function onScroll() {
    const el = scroller.current;
    if (!el) return;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    atBottom.current = near;
    setAway(!near);
    if (near) setNewCount(0);
  }

  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={scroller}
        onScroll={onScroll}
        role="log"
        aria-live="polite"
        aria-label="Messages"
        style={{ backgroundImage: BRIDGE_PATTERN }}
        className="h-full overflow-y-auto bg-[#FBFAF7] p-3 sm:p-5"
      >
        {items.map((item) =>
          item.kind === "separator" ? (
            <DateSeparator key={item.key} label={item.label} />
          ) : item.message.type === "system" ? (
            <SystemNotice key={item.key} text={item.message.text ?? ""} />
          ) : (
            <MessageBubble key={item.key} message={item.message} conversation={conversation} first={item.first} last={item.last} query={query} active={item.message.id === activeMatchId} onReply={onReply} />
          ),
        )}
        {!hasChat && <p className="py-10 text-center text-sm text-[#475569]">Say hello to {firstName(conversation.name)}</p>}
        {showTyping && <TypingBubble conversation={conversation} />}
      </div>
      {away && <ScrollToLatestButton count={newCount} onClick={() => toBottom(true)} />}
    </div>
  );
}
