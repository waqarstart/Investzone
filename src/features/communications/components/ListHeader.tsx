import { MoreVertical, SquarePen } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ICON_BUTTON } from "../lib/format";
import { useChatStore } from "../useChatStore";

export function ListHeader({ onCompose }: { onCompose: () => void }) {
  const count = useChatStore((s) => s.conversations.length);
  const markAllRead = useChatStore((s) => s.markAllRead);
  return (
    <div className="flex items-center justify-between gap-3 px-5 pt-5">
      <div className="flex min-w-0 items-center gap-3">
        <h2 className="text-[26px] font-semibold text-[#14213D]">Messages</h2>
        <span className="shrink-0 rounded-full bg-[#EEF0FA] px-2.5 py-1 text-xs font-medium text-[#3F4FA0]">{count} active</span>
      </div>
      <div className="flex items-center">
        <Button type="button" variant="ghost" size="icon" aria-label="New message" onClick={onCompose} className={ICON_BUTTON}>
          <SquarePen aria-hidden className="size-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon" aria-label="More options" className={ICON_BUTTON}>
              <MoreVertical aria-hidden className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={markAllRead}>Mark all as read</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => toast("Archived chats are coming soon")}>Archived</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
