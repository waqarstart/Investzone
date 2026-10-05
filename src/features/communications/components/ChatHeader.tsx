import { ArrowLeft, MoreVertical, Phone, Search, Video } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FOCUS, ICON_BUTTON } from "../lib/format";
import type { Conversation } from "../types";
import { useChatStore } from "../useChatStore";
import { ChatAvatar } from "./ChatAvatar";
import { RoleBadge } from "./RoleBadge";

interface Props {
  conversation: Conversation;
  showBack: boolean;
  onBack: () => void;
  onInfo: () => void;
  onSearch: () => void;
  onClear: () => void;
}

export function ChatHeader({ conversation: c, showBack, onBack, onInfo, onSearch, onClear }: Props) {
  const calls = () => toast("Calls are coming soon (demo)");
  const toggleMute = useChatStore((s) => s.toggleMute);
  return (
    <header className="flex h-20 shrink-0 items-center gap-3 border-b border-[#E5E7EB] bg-white px-3 sm:px-5">
      {showBack && (
        <Button type="button" variant="ghost" size="icon" aria-label="Back to conversations" onClick={onBack} className={ICON_BUTTON}>
          <ArrowLeft aria-hidden className="size-5" />
        </Button>
      )}
      <button type="button" onClick={onInfo} className={`flex min-w-0 flex-1 items-center gap-3 rounded-xl text-left ${FOCUS}`} aria-label={`Contact info for ${c.name}`}>
        <ChatAvatar initials={c.initials} tone={c.tone} online={c.online} />
        <span className="min-w-0">
          <span className="flex items-center gap-2">
            <span className="truncate text-lg font-semibold text-[#14213D]">{c.name}</span>
            <RoleBadge role={c.role} className="hidden sm:inline-block" />
          </span>
          <span className="block truncate text-[13px] text-[#94A3B8]">
            {c.online ? <span className="text-[#5BA4E6]">● Online</span> : c.lastSeen}
            <span className="text-[#475569]"> · {c.shortTitle}</span>
          </span>
        </span>
      </button>
      <div className="flex shrink-0 items-center">
        <Button type="button" variant="ghost" size="icon" aria-label="Search in conversation" onClick={onSearch} className={ICON_BUTTON}><Search aria-hidden className="size-5" /></Button>
        <Button type="button" variant="ghost" size="icon" aria-label="Voice call" onClick={calls} className={`hidden sm:inline-flex ${ICON_BUTTON}`}><Phone aria-hidden className="size-5" /></Button>
        <Button type="button" variant="ghost" size="icon" aria-label="Video call" onClick={calls} className={`hidden sm:inline-flex ${ICON_BUTTON}`}><Video aria-hidden className="size-5" /></Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon" aria-label="More options" className={ICON_BUTTON}><MoreVertical aria-hidden className="size-5" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="sm:hidden" onSelect={calls}>Voice call</DropdownMenuItem>
            <DropdownMenuItem className="sm:hidden" onSelect={calls}>Video call</DropdownMenuItem>
            <DropdownMenuItem onSelect={onInfo}>View contact info</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => toggleMute(c.id)}>{c.muted ? "Unmute notifications" : "Mute notifications"}</DropdownMenuItem>
            <DropdownMenuItem onSelect={onClear} className="text-[#D9442F]">Clear chat</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
