import type { ReplyRef } from "../types";

export function ReplyQuote({ reply }: { reply: ReplyRef }) {
  return (
    <div className="mb-2 rounded-lg border-l-4 border-[#3F4FA0] bg-[#F3F4F6] p-3">
      <p className="text-xs font-semibold text-[#14213D]">{reply.senderId === "me" ? "You wrote:" : `${reply.senderName} wrote:`}</p>
      <p className="mt-0.5 line-clamp-3 text-[13.5px] text-[#475569]">“{reply.text}”</p>
    </div>
  );
}
