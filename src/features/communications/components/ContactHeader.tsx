import { BadgeCheck, MessageSquare, Phone, Video, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Conversation } from "../types";
import { ChatAvatar } from "./ChatAvatar";
import { RoleBadge } from "./RoleBadge";

interface Props {
  conversation: Conversation;
  onClose: () => void;
  onChat: () => void;
}

export function ContactPanelHeader({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex h-20 shrink-0 items-center justify-between border-b border-[#E5E7EB] px-5">
      <h2 className="text-lg font-semibold text-[#14213D]">Contact Info</h2>
      <Button type="button" variant="ghost" size="icon" aria-label="Close contact info" onClick={onClose} className="size-11 rounded-full sm:size-10">
        <X aria-hidden className="size-5" />
      </Button>
    </div>
  );
}

export function ContactHeader({ conversation: c, onChat }: Omit<Props, "onClose">) {
  const soon = () => toast("Calls are coming soon (demo)");
  const actions = [
    { label: "Chat", icon: MessageSquare, run: onChat },
    { label: "Call", icon: Phone, run: soon },
    { label: "Video", icon: Video, run: soon },
  ];
  return (
    <div className="flex flex-col items-center border-b border-[#E5E7EB] px-5 py-6 text-center">
      <div className="relative">
        <ChatAvatar initials={c.initials} tone={c.tone} size="lg" />
        <BadgeCheck aria-label="Verified by Bridgeway" className="absolute bottom-1 right-1 size-7 rounded-full bg-white text-[#5BA4E6]" />
      </div>
      <h3 className="mt-4 text-[26px] font-semibold leading-tight text-[#14213D]">{c.name}</h3>
      <RoleBadge role={c.role} className="mt-2 text-xs" />
      <p className="mt-3 text-sm text-[#475569]">{c.headline}</p>
      <p className="text-sm text-[#475569]">{c.location}</p>
      <div className="mt-5 flex gap-6">
        {actions.map((a) => (
          <div key={a.label} className="flex flex-col items-center gap-1.5">
            <Button type="button" variant="outline" size="icon" aria-label={a.label} onClick={a.run} className="size-14 rounded-full">
              <a.icon aria-hidden className="size-5" />
            </Button>
            <span className="text-[13px] text-[#475569]">{a.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
