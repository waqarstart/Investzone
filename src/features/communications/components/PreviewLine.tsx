import { Check, CheckCheck, FileText, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { describeMessage } from "../lib/format";
import type { Message } from "../types";

export function Ticks({ status, className }: { status: Message["status"]; className?: string }) {
  if (status === "sent") return <Check aria-label="Sent" className={cn("size-4 text-[#94A3B8]", className)} />;
  return <CheckCheck aria-label={status === "read" ? "Read" : "Delivered"} className={cn("size-4", status === "read" ? "text-[#5BA4E6]" : "text-[#94A3B8]", className)} />;
}

export function PreviewLine({ last, typing }: { last?: Message; typing: boolean }) {
  if (typing) return <span className="truncate text-sm italic text-[#3F4FA0]">typing…</span>;
  if (!last) return <span className="truncate text-sm text-[#94A3B8]">No messages yet</span>;
  return (
    <span className="flex min-w-0 items-center gap-1.5 text-sm text-[#475569]">
      {last.senderId === "me" && <Ticks status={last.status} className="shrink-0" />}
      {last.type === "file" && <FileText aria-hidden className="size-4 shrink-0 text-[#94A3B8]" />}
      {last.type === "voice" && <Mic aria-hidden className="size-4 shrink-0 text-[#3F4FA0]" />}
      <span className="truncate">{describeMessage(last)}</span>
    </span>
  );
}
