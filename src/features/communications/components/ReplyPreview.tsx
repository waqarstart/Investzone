import { X } from "lucide-react";
import { describeMessage } from "../lib/format";
import type { Conversation, Message } from "../types";

interface Props {
  target: Message;
  conversation: Conversation;
  onCancel: () => void;
}

export function ReplyPreview({ target, conversation, onCancel }: Props) {
  const name = target.senderId === "me" ? "You" : conversation.name;
  return (
    <div className="mx-4 mt-3 flex items-center gap-3 rounded-lg border-l-4 border-[#3F4FA0] bg-[#F3F4F6] py-2 pl-3 pr-1">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-[#3F4FA0]">{name}</p>
        <p className="truncate text-[13px] text-[#475569]">{describeMessage(target)}</p>
      </div>
      <button type="button" onClick={onCancel} aria-label="Cancel reply" className="grid size-9 place-items-center rounded-full text-[#475569] hover:bg-white">
        <X aria-hidden className="size-4" />
      </button>
    </div>
  );
}
