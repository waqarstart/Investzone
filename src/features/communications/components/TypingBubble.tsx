import { motion, useReducedMotion } from "motion/react";
import type { Conversation } from "../types";
import { ChatAvatar } from "./ChatAvatar";

export function TypingBubble({ conversation }: { conversation: Conversation }) {
  const reduce = useReducedMotion();
  return (
    <div className="mt-3.5 flex items-end gap-2" role="status" aria-label={`${conversation.name} is typing`}>
      <ChatAvatar initials={conversation.initials} tone={conversation.tone} size="sm" />
      <div className="flex items-center gap-1.5 rounded-[18px] rounded-bl-[6px] border border-[#E5E7EB] bg-white px-4 py-3.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-2 rounded-full bg-[#CBD5E1]"
            animate={reduce ? undefined : { y: [0, -4, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  );
}
