import { formatBubbleTime } from "../lib/format";
import type { Message } from "../types";
import { Ticks } from "./PreviewLine";

export function MessageMeta({ message }: { message: Message }) {
  return (
    <span className="mt-1 flex items-center justify-end gap-1 self-end text-[11.5px] text-[#94A3B8]">
      {formatBubbleTime(message.createdAt)}
      {message.senderId === "me" && <Ticks status={message.status} className="size-3.5" />}
    </span>
  );
}
