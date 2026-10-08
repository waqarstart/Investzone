import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Camera,
  ChevronDown,
  FileText,
  Globe,
  Hash,
  Mic,
  Paperclip,
  PenLine,
  Send,
  Smile,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Post } from "../types";

const MAX_LENGTH = 1000;
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const HASHTAG = /#[\p{L}\p{N}_]+/gu;
const HASHTAG_SPLIT = /(#[\p{L}\p{N}_]+)/u;

const EMOJIS = [
  "🚀", "💡", "📈", "🤝", "🎯", "💰", "🌱", "⚡",
  "🔥", "✅", "🙌", "👏", "🎉", "📊", "🧠", "🌍",
  "💼", "🔒", "⭐", "👀", "💬", "🏆", "📣", "🙏",
];

const AUDIENCES = [
  { id: "public", label: "Anyone on Bridgeway", icon: Globe },
  { id: "connections", label: "My connections", icon: Users },
] as const;

type AudienceId = (typeof AUDIENCES)[number]["id"];

const PLACEHOLDERS: Record<string, string> = {
  Pitch: "Share your idea or pitch…",
  Memo: "Write your memo…",
  "Success story": "Share a deal you closed…",
};

interface AttachedImage {
  name: string;
  size: number;
  dataUrl: string;
}

interface ComposerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  author: string;
  initials: string;
  onPost: (post: Post) => void;
  preset?: string;
  role?: "Founder" | "Investor";
}

function formatSize(bytes: number): string {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the file"));
    reader.readAsDataURL(file);
  });
}

export function ComposerDialog({
  open,
  onOpenChange,
  author,
  initials,
  onPost,
  preset,
  role,
}: ComposerDialogProps) {
  const [text, setText] = useState("");
  const [audience, setAudience] = useState<AudienceId>("public");
  const [image, setImage] = useState<AttachedImage | null>(null);
  const [emojiOpen, setEmojiOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setText("");
      setImage(null);
      setAudience("public");
      setEmojiOpen(false);
    }
  }, [open]);

  useLayoutEffect(() => {
    const element = textareaRef.current;
    if (!element) return;
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }, [text, open]);

  useEffect(() => {
    if (!emojiOpen) return undefined;
    const close = (event: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
        setEmojiOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [emojiOpen]);

  const insertAtCursor = (snippet: string) => {
    const element = textareaRef.current;
    const start = element?.selectionStart ?? text.length;
    const end = element?.selectionEnd ?? text.length;
    const before = text.slice(0, start);
    const needsSpace = snippet === "#" && before.length > 0 && !/\s$/.test(before);
    const insert = needsSpace ? ` ${snippet}` : snippet;
    const next = (before + insert + text.slice(end)).slice(0, MAX_LENGTH);
    setText(next);
    window.requestAnimationFrame(() => {
      element?.focus();
      const caret = Math.min(before.length + insert.length, next.length);
      element?.setSelectionRange(caret, caret);
    });
  };

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      toast.error("Please choose a PNG, JPG or WebP image");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Image is larger than 5 MB");
      return;
    }
    try {
      const dataUrl = await readAsDataUrl(file);
      setImage({ name: file.name, size: file.size, dataUrl });
    } catch {
      toast.error("Could not read that image");
    }
  };

  const canPost = text.trim().length > 0 || image !== null;

  function post() {
    if (!canPost) return;
    const body = text.trim();
    const tags = Array.from(new Set(body.match(HASHTAG) ?? []));
    onPost({
      id: `new-${Date.now()}`,
      name: author,
      initials,
      kind: role === "Founder" ? "founder" : "investor",
      headline: "Bridgeway member · Network",
      time: "Just now",
      body,
      tags,
      imageUrl: image?.dataUrl,
      imageName: image?.name,
      interested: 0,
      comments: 0,
      engagementScore: 0,
      createdAt: Date.now(),
    } as Post);
    onOpenChange(false);
    toast("Posted (demo)");
  }

  const activeAudience = AUDIENCES.find((item) => item.id === audience) ?? AUDIENCES[0];
  const AudienceIcon = activeAudience.icon;
  const parts = text.split(HASHTAG_SPLIT);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[min(470px,calc(100dvh-2rem))] max-w-[calc(100%-1.5rem)] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-[640px] [&>button]:hidden">
        <DialogHeader className="flex-row shrink-0 items-center justify-between space-y-0 border-b border-[#E5E7EB] px-5 py-4 sm:px-6 sm:py-5">
          <DialogHeader>
<div className="flex items-center gap-4">
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#14213D] text-lg font-bold text-white">
              {initials}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="truncate text-lg font-semibold text-[#14213D]">{author}</p>
                {role && (
                  <span
                    className={cn(
                      "whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      role === "Founder"
                        ? "bg-[#FEF3D8] text-[#8A5A00]"
                        : "bg-[#EEF0FA] text-[#3F4FA0]",
                    )}
                  >
                    {role}
                  </span>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Choose who can see this post"
                    className="mt-1.5 inline-flex h-8 items-center gap-2 rounded-full bg-[#F3F4F6] px-3 text-sm font-medium text-[#475569] hover:bg-[#E5E7EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B544]"
                  >
                    <AudienceIcon className="size-4" aria-hidden="true" />
                    {activeAudience.label}
                    <ChevronDown className="size-3.5" aria-hidden="true" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {AUDIENCES.map((item) => (
                    <DropdownMenuItem key={item.id} onSelect={() => setAudience(item.id)}>
                      <item.icon className="mr-2 size-4" aria-hidden="true" />
                      {item.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          </DialogHeader>
          <button
            type="button"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
            className="grid size-10 place-items-center rounded-full bg-[#F3F4F6] text-[#475569] hover:bg-[#E5E7EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B544]"
          >
            <X className="size-5" />
          </button>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          

          <div className="relative min-h-[220px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 whitespace-pre-wrap break-words text-[17px] leading-7 text-[#14213D]"
            >
              {parts.map((part, index) =>
                index % 2 === 1 ? (
                  <span key={index} className="text-[#3F4FA0]">
                    {part}
                  </span>
                ) : (
                  <span key={index}>{part}</span>
                ),
              )}
              {"\n"}
            </div>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(event) => setText(event.target.value.slice(0, MAX_LENGTH))}
              placeholder={PLACEHOLDERS[preset ?? ""] ?? "Share an idea, allocation or update…"}
              aria-label="Post text"
              rows={3}
              className="relative block min-h-[96px] w-full resize-none overflow-hidden whitespace-pre-wrap break-words bg-transparent text-[17px] leading-7 text-transparent caret-[#14213D] outline-none placeholder:text-[#94A3B8]"
            />
          </div>

          {image && (
            <div className="relative mt-4 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-[#F3F4F6]">
              <img
                src={image.dataUrl}
                alt={`Attached image ${image.name}`}
                className="max-h-[340px] w-full object-cover"
              />
              <div className="absolute bottom-3 left-3 right-3 flex max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-lg bg-[#14213D]/90 px-3 py-2 text-white sm:right-auto">
                <Camera className="size-4 shrink-0 text-[#F5B544]" aria-hidden="true" />
                <span className="min-w-0 truncate font-mono text-xs">
                  {image.name} · {formatSize(image.size)}
                </span>
                <button
                  type="button"
                  aria-label="Remove image"
                  onClick={() => setImage(null)}
                  className="shrink-0 rounded-full p-0.5 hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B544]"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative flex shrink-0 items-center gap-1.5 border-t border-[#E5E7EB] px-4 py-4 sm:gap-2 sm:px-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(event) => {
              void handleFile(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-[#F3F4F6] px-3 text-sm font-semibold text-[#475569] hover:bg-[#E5E7EB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B544] sm:px-4"
          >
            <Camera className="size-4" aria-hidden="true" />
            <span className="hidden min-[420px]:inline">Add Photo</span>
            <span className="min-[420px]:hidden">Photo</span>
          </button>

          <button
            type="button"
            aria-label="Add a hashtag"
            onClick={() => insertAtCursor("#")}
            className="grid size-10 shrink-0 place-items-center rounded-full text-[#64748B] hover:bg-[#F3F4F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B544]"
          >
            <Hash className="size-5" />
          </button>

          <div ref={emojiRef} className="relative">
            <button
              type="button"
              aria-label="Add an emoji"
              aria-expanded={emojiOpen}
              onClick={() => setEmojiOpen((current) => !current)}
              className="grid size-10 shrink-0 place-items-center rounded-full text-[#64748B] hover:bg-[#F3F4F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B544]"
            >
              <Smile className="size-5" />
            </button>
            {emojiOpen && (
              <div className="absolute bottom-12 left-0 z-20 grid w-[232px] grid-cols-8 gap-1 rounded-xl border border-[#E5E7EB] bg-white p-2 shadow-lg">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      insertAtCursor(emoji);
                      setEmojiOpen(false);
                    }}
                    className="grid size-7 place-items-center rounded-md text-lg hover:bg-[#F3F4F6]"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            aria-label="Attach a document"
            onClick={() => toast("Attachments are coming soon")}
            className="grid size-10 shrink-0 place-items-center rounded-full text-[#64748B] hover:bg-[#F3F4F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B544]"
          >
            <Paperclip className="size-5" />
          </button>

          <span
            className={cn(
              "ml-auto shrink-0 font-mono text-xs sm:text-sm",
              text.length >= MAX_LENGTH ? "text-[#D9442F]" : "text-[#94A3B8]",
            )}
            aria-live="polite"
          >
            {text.length}/{MAX_LENGTH}
          </span>

          <button
            type="button"
            disabled={!canPost}
            onClick={post}
            className="inline-flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-[#F5B544] px-5 text-base font-bold text-[#14213D] hover:bg-[#E9A72F] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14213D]/40 disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
          >
            Post
            <Send className="size-4" aria-hidden="true" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ComposerCard({
  onOpen,
}: {
  onOpen: (preset?: string) => void;
}) {
  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_3px_14px_rgba(20,33,61,0.06)] sm:p-5">
      <div className="flex items-center gap-3">
        <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-[#14213D] text-xs font-bold text-white">
          TM
          <i className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-[#5BA4E6]" />
        </span>
        <button
          onClick={() => onOpen()}
          className="h-10 min-w-0 flex-1 truncate rounded-full border border-[#E5E7EB] bg-[#F8FAFC] px-4 text-left text-xs text-[#64748B]"
        >
          Share an idea, allocation or investment mandate…
        </button>
      </div>
      <div className="mt-3 grid grid-cols-3 border-t border-[#F1F3F6] pt-3">
        {[
          [Mic, "Pitch", "bg-[#FEF3D8] text-[#8A5A00]"],
          [FileText, "Media & Deck", "bg-[#EEF0FA] text-[#3F4FA0]"],
          [PenLine, "Write memo", "bg-[#F3EEFA] text-[#7C5CBF]"],
        ].map(([Icon, label, color]) => {
          const ItemIcon = Icon as typeof Mic;
          const title = label as string;
          return (
            <button
              key={title}
              onClick={() => onOpen(title === "Write memo" ? "Memo" : title)}
              className="flex min-h-11 items-center justify-center gap-2 text-[11px] font-semibold text-[#475569] sm:text-xs"
            >
              <span
                className={`grid size-7 place-items-center rounded-full ${color as string}`}
              >
                <ItemIcon className="size-3.5" />
              </span>
              <span className="truncate">{title}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}