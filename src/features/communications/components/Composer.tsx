import { useEffect, useRef, useState } from "react";
import { Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AMBER_BUTTON, describeMessage, FOCUS } from "../lib/format";
import type { Conversation, Message } from "../types";
import { useChatStore } from "../useChatStore";
import { AttachMenu } from "./AttachMenu";
import { EmojiPopover } from "./EmojiPopover";
import { ReplyPreview } from "./ReplyPreview";
import { VoiceRecorder } from "./VoiceRecorder";

interface Props {
  conversation: Conversation;
  replyTarget: Message | null;
  onCancelReply: () => void;
}

export function Composer({ conversation, replyTarget, onCancelReply }: Props) {
  const id = conversation.id;
  const text = useChatStore((s) => s.drafts[id] ?? "");
  const { setDraft, send, setBlocked } = useChatStore.getState();
  const [recording, setRecording] = useState(false);
  const [upload, setUpload] = useState<{ name: string; pages: number; progress: number } | null>(null);
  const field = useRef<HTMLTextAreaElement>(null);

  const replyRef = replyTarget
    ? { senderId: replyTarget.senderId, senderName: replyTarget.senderId === "me" ? "You" : conversation.name, text: describeMessage(replyTarget) }
    : undefined;

  useEffect(() => {
    if (!upload) return;
    if (upload.progress >= 100) {
      send(id, { type: "file", file: { name: upload.name, size: "1.8 MB", pages: upload.pages } });
      setUpload(null);
      return;
    }
    const t = setTimeout(() => setUpload((u) => (u ? { ...u, progress: u.progress + 20 } : u)), 220);
    return () => clearTimeout(t);
  }, [upload, id, send]);

  function resize() {
    const el = field.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 96)}px`;
  }

  function submit() {
    const value = text.trim();
    if (!value) return;
    send(id, { type: "text", text: value, replyTo: replyRef });
    setDraft(id, "");
    onCancelReply();
    requestAnimationFrame(resize);
  }

  function insertEmoji(emoji: string) {
    const el = field.current;
    const start = el?.selectionStart ?? text.length;
    const end = el?.selectionEnd ?? text.length;
    setDraft(id, text.slice(0, start) + emoji + text.slice(end));
    requestAnimationFrame(() => { el?.focus(); el?.setSelectionRange(start + emoji.length, start + emoji.length); });
  }

  if (conversation.blocked) {
    return (
      <div className="flex items-center justify-center gap-2 border-t border-[#E5E7EB] bg-white px-4 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-sm text-[#475569]">
        You blocked this contact
        <button type="button" onClick={() => setBlocked(id, false)} className={`font-medium text-[#3F4FA0] hover:underline ${FOCUS}`}>Unblock</button>
      </div>
    );
  }

  return (
    <div className="border-t border-[#E5E7EB] bg-white pb-[env(safe-area-inset-bottom)]">
      {replyTarget && <ReplyPreview target={replyTarget} conversation={conversation} onCancel={onCancelReply} />}
      {upload && (
        <div className="mx-4 mt-3" role="status">
          <p className="text-xs text-[#475569]">Uploading {upload.name}…</p>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#E5E7EB]">
            <div style={{ width: `${upload.progress}%` }} className="h-full rounded-full bg-[#F5B544] transition-[width] duration-200" />
          </div>
        </div>
      )}
      {recording ? (
        <VoiceRecorder onCancel={() => setRecording(false)} onSend={(seconds) => { send(id, { type: "voice", voice: { seconds } }); setRecording(false); }} />
      ) : (
        <div className="flex items-end gap-1 px-3 py-3 sm:gap-2 sm:px-4">
          <EmojiPopover onPick={insertEmoji} />
          <AttachMenu onFile={(name, pages) => setUpload({ name, pages, progress: 0 })} />
          <div className="flex min-h-12 min-w-0 flex-1 items-end rounded-[24px] bg-[#F3F4F6] pl-4 pr-1">
            <textarea
              id="composer-input"
              ref={field}
              rows={1}
              value={text}
              onChange={(e) => { setDraft(id, e.target.value); resize(); }}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
              placeholder="Type a message…"
              aria-label="Type a message"
              className="max-h-24 min-w-0 flex-1 resize-none bg-transparent py-3 text-[15px] leading-6 text-[#14213D] placeholder:text-[#64748B] focus:outline-none"
            />
            <button type="button" aria-label="Record voice message" onClick={() => setRecording(true)} className={`grid size-11 shrink-0 place-items-center self-end rounded-full text-[#475569] hover:bg-white sm:size-12 ${FOCUS}`}>
              <Mic aria-hidden className="size-5" />
            </button>
          </div>
          <Button type="button" size="icon" aria-label="Send message" disabled={!text.trim()} onClick={submit} className={`size-12 shrink-0 rounded-full ${AMBER_BUTTON}`}>
            <Send aria-hidden className="size-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
