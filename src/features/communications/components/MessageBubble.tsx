import { motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { describeMessage } from "../lib/format";
import type { Conversation, Message } from "../types";
import { useChatStore } from "../useChatStore";
import { ChatAvatar } from "./ChatAvatar";
import { FileBubble } from "./FileBubble";
import { MessageMeta } from "./MessageMeta";
import { ReplyQuote } from "./ReplyQuote";
import { TextBody } from "./TextBody";
import { VoiceBubble } from "./VoiceBubble";

interface Props {
  message: Message;
  conversation: Conversation;
  first: boolean;
  last: boolean;
  query: string;
  active: boolean;
  onReply: (m: Message) => void;
}

export function MessageBubble({ message: m, conversation, first, last, query, active, onReply }: Props) {
  const reduce = useReducedMotion();
  const mine = m.senderId === "me";

  function copy() {
    void navigator.clipboard?.writeText(describeMessage(m));
    toast("Copied to clipboard");
  }

  return (
    <motion.div
      id={`msg-${m.id}`}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={cn("flex items-end gap-2", mine ? "justify-end" : "justify-start", first ? "mt-3.5" : "mt-1")}
    >
      {!mine && (
        <span className="w-9 shrink-0">
          {last && <ChatAvatar initials={conversation.initials} tone={conversation.tone} size="sm" />}
        </span>
      )}
      <div
        className={cn(
          "group/bubble relative flex max-w-[88%] flex-col rounded-[18px] border px-4 py-2.5 sm:max-w-[75%]",
          mine ? "border-[#F6E2A8] bg-[#FEF3D8]" : "border-[#E5E7EB] bg-white",
          last && (mine ? "rounded-br-[6px]" : "rounded-bl-[6px]"),
          active && "ring-2 ring-[#3F4FA0]",
        )}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Message actions"
              className="absolute right-1.5 top-1.5 z-10 grid size-6 place-items-center rounded-full bg-inherit text-[#475569] opacity-0 focus-visible:opacity-100 group-hover/bubble:opacity-100 [@media(hover:none)]:opacity-60"
            >
              <ChevronDown aria-hidden className="size-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={mine ? "end" : "start"}>
            <DropdownMenuItem onSelect={() => onReply(m)}>Reply</DropdownMenuItem>
            <DropdownMenuItem onSelect={copy}>Copy text</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => useChatStore.getState().deleteMessage(m.conversationId, m.id)} className="text-[#D9442F]">Delete for me</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {m.replyTo && <ReplyQuote reply={m.replyTo} />}
        {m.type === "text" && <TextBody text={m.text ?? ""} query={query} />}
        {m.type === "file" && m.file && <FileBubble file={m.file} />}
        {m.type === "voice" && m.voice && <VoiceBubble id={m.id} seconds={m.voice.seconds} />}
        <MessageMeta message={m} />
      </div>
    </motion.div>
  );
}
