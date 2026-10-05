import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { BellOff, MoreVertical, Pin } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { FOCUS, formatListTime } from "../lib/format";
import type { Conversation } from "../types";
import { useChatStore, useMessages } from "../useChatStore";
import { ChatAvatar } from "./ChatAvatar";
import { PreviewLine } from "./PreviewLine";
import { RoleBadge } from "./RoleBadge";

interface Props {
  conversation: Conversation;
  selected: boolean;
  onOpen: () => void;
  onDelete: () => void;
}

export function ConversationRow({ conversation: c, selected, onOpen, onDelete }: Props) {
  const reduce = useReducedMotion();
  const messages = useMessages(c.id);
  const typing = useChatStore((s) => !!s.typing[c.id]);
  const { togglePin, toggleMute, markUnread } = useChatStore.getState();
  const [menuOpen, setMenuOpen] = useState(false);
  const pressTimer = useRef<number | undefined>(undefined);
  const last = [...messages].reverse().find((m) => m.type !== "system");

  return (
    <motion.li
      layout={!reduce}
      className="group relative border-b border-[#E5E7EB] last:border-b-0"
      onContextMenu={(e) => { e.preventDefault(); setMenuOpen(true); }}
      onTouchStart={() => { pressTimer.current = window.setTimeout(() => setMenuOpen(true), 550); }}
      onTouchEnd={() => window.clearTimeout(pressTimer.current)}
      onTouchMove={() => window.clearTimeout(pressTimer.current)}
    >
      {selected && <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] bg-[#F5B544]" />}
      <button
        type="button"
        data-row
        aria-current={selected ? "true" : undefined}
        onClick={onOpen}
        className={cn("flex min-h-[84px] w-full items-center gap-3.5 px-5 py-3.5 text-left hover:bg-[#FAFAF8]", FOCUS, selected && "bg-[#FEF3D8] hover:bg-[#FEF3D8]")}
      >
        <ChatAvatar initials={c.initials} tone={c.tone} online={c.online} />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="min-w-0 truncate text-base font-semibold text-[#14213D]">{c.name}</span>
            <RoleBadge role={c.role} />
            <span className="ml-auto shrink-0 pl-1 text-[12.5px] text-[#94A3B8]">{last ? formatListTime(last.createdAt) : ""}</span>
          </span>
          <span className="mt-1 flex items-center gap-2 pr-1">
            <PreviewLine last={last} typing={typing} />
            <span className="ml-auto flex shrink-0 items-center gap-1.5 group-hover:opacity-0">
              {c.muted && <BellOff aria-label="Muted" className="size-4 text-[#94A3B8]" />}
              {c.pinned && <Pin aria-label="Pinned" className="size-4 text-[#94A3B8]" />}
              {c.unread > 0 && (
                <span aria-label={`${c.unread} unread`} className="grid size-[22px] place-items-center rounded-full bg-[#F2705A] text-xs font-semibold text-white">{c.unread}</span>
              )}
            </span>
          </span>
        </span>
      </button>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button type="button" aria-label={`Options for ${c.name}`} className={cn("absolute bottom-3 right-4 grid size-8 place-items-center rounded-full text-[#475569] opacity-0 hover:bg-white focus-visible:opacity-100 group-hover:opacity-100", FOCUS)}>
            <MoreVertical aria-hidden className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => togglePin(c.id)}>{c.pinned ? "Unpin" : "Pin"}</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => markUnread(c.id)}>Mark as unread</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => { toggleMute(c.id); toast(c.muted ? "Notifications on" : "Chat muted"); }}>{c.muted ? "Unmute" : "Mute"}</DropdownMenuItem>
          <DropdownMenuItem onSelect={onDelete} className="text-[#D9442F]">Delete chat</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.li>
  );
}
