import { useEffect, useRef, useState } from "react";
import {
  Camera,
  ChevronDown,
  Clock,
  FileText,
  Globe,
  Hash,
  Image as ImageIcon,
  Smile,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useJoinStore } from "@/features/join/useJoinStore";
import { cn } from "@/lib/utils";
import type { Post } from "../types";

const MAX_LENGTH = 1000;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const HASHTAG = /#[\p{L}\p{N}_]+/gu;

const EMOJIS = [
  "🚀", "💡", "📈", "🤝", "🎯", "💰", "🌱", "⚡",
  "🔥", "✅", "🙌", "👏", "🎉", "📊", "🧠", "🌍",
  "💼", "🔒", "⭐", "👀", "💬", "🏆", "📣", "🙏",
];

const AUDIENCES = [
  { id: "public", label: "Everyone", icon: Globe },
  { id: "connections", label: "Only my connections", icon: Users },
] as const;

type AudienceId = (typeof AUDIENCES)[number]["id"];

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
  initialPost?: Post | null;
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
  role = "Founder",
  initialPost,
}: ComposerDialogProps) {
  const [text, setText] = useState("");
  const [audience, setAudience] = useState<AudienceId>("public");
  const [image, setImage] = useState<AttachedImage | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      if (initialPost) {
        setText(initialPost.body);
        setImage(
          initialPost.imageUrl
            ? {
                name: initialPost.imageName || "Attached image",
                size: 1024 * 500,
                dataUrl: initialPost.imageUrl,
              }
            : null
        );
      } else {
        setText("");
        setImage(null);
      }
      setAudience("public");
      setIsPosting(false);
      setEmojiOpen(false);
    }
  }, [open, preset, initialPost]);

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

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(60, textareaRef.current.scrollHeight)}px`;
    }
  }, [text, open]);

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
    if (!["image/png", "image/jpeg", "image/webp", "image/gif"].includes(file.type)) {
      toast.error("Please choose a PNG, JPG or WebP image");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error("Image must be smaller than 10 MB");
      return;
    }
    try {
      const dataUrl = await readAsDataUrl(file);
      setImage({ name: file.name, size: file.size, dataUrl });
      toast.success("Image attached");
    } catch {
      toast.error("Could not read image file");
    }
  };

  const canPost = (text.trim().length > 0 || image !== null) && !isPosting;

  function handlePublish() {
    if (!canPost) return;
    setIsPosting(true);

    setTimeout(() => {
      const body = text.trim();
      const tags = Array.from(new Set(body.match(HASHTAG) ?? []));
      
      onPost({
        id: initialPost?.id || `post-${Date.now()}`,
        name: author,
        initials,
        kind: role === "Founder" ? "founder" : "investor",
        headline: role === "Founder" ? "Founder & Systems Architect" : "Managing Partner · Syndicate",
        time: initialPost?.time || "Just now",
        body,
        tags,
        imageUrl: image?.dataUrl,
        imageName: image?.name,
        interested: initialPost?.interested || 0,
        comments: initialPost?.comments || 0,
        engagementScore: initialPost?.engagementScore || 100,
        createdAt: initialPost?.createdAt || Date.now(),
      });

      setIsPosting(false);
      onOpenChange(false);
      toast.success(initialPost ? "Post updated successfully!" : "Post shared successfully with your network!");
    }, 500);
  }

  const activeAudience = AUDIENCES.find((item) => item.id === audience) ?? AUDIENCES[0];
  const AudienceIcon = activeAudience.icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[94vw] !max-w-[740px] sm:!w-[700px] md:!w-[740px] min-h-[460px] max-h-[85vh] flex flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 sm:p-6 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] [&>button]:hidden">
        <DialogTitle className="sr-only">
          {initialPost ? "Edit your post" : "Share an idea or update"}
        </DialogTitle>

        {/* 1. TOP AUTHOR & CONTROLS */}
        <div className="flex shrink-0 items-start justify-between pb-3.5 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-3 min-w-0">
            {/* 44px Circular Avatar */}
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#14213D] text-sm font-bold text-white shadow-sm ring-2 ring-[#E2E8F0]">
              {initials}
            </div>

            {/* Author Name and Sub-row Dropdown */}
            <div className="flex flex-col gap-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[15px] sm:text-[16px] font-bold text-[#14213D] tracking-tight truncate">
                  {author}
                </span>

                {/* Role Chip */}
                <span className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                  role === "Founder" 
                    ? "bg-[#FEF3C7] text-[#92400E]" 
                    : "bg-[#EEF2FF] text-[#3730A3]"
                )}>
                  {role}
                </span>
              </div>

              {/* Icon-only Audience Dropdown directly underneath Author Name */}
              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      title={activeAudience.label}
                      aria-label={activeAudience.label}
                      className="flex items-center gap-1 rounded-full bg-[#F8F9FA] hover:bg-[#F1F5F9] px-2.5 py-1 text-[#475569] border border-[#E2E8F0] transition-colors focus:outline-none"
                    >
                      <AudienceIcon className="size-3.5 text-[#3F4FA0]" />
                      <ChevronDown className="size-3 text-[#64748B]" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-52 bg-white shadow-lg border border-[#E2E8F0] p-1.5 z-50">
                    <div className="px-2.5 py-1.5 text-[11px] font-bold text-[#64748B]">
                      Who can view
                    </div>
                    {AUDIENCES.map((item) => (
                      <DropdownMenuItem
                        key={item.id}
                        onSelect={() => setAudience(item.id)}
                        className={cn(
                          "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium cursor-pointer",
                          audience === item.id ? "bg-[#EEF2FF] text-[#3F4FA0] font-bold" : "text-[#14213D] hover:bg-[#F8F9FA]"
                        )}
                      >
                        <item.icon className="size-4 text-[#3F4FA0]" />
                        <span>{item.label}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {/* Close button */}
          <button
            type="button"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-base font-medium text-[#64748B] transition-colors hover:bg-[#F1F5F9] hover:text-[#14213D] ml-2"
          >
            ✕
          </button>
        </div>

        {/* 2. TEXT INPUT AREA (SPACIOUS CONTAINER WITH NATURAL SPACING) */}
        <div className="flex-1 min-h-0 overflow-y-auto py-3 pr-1 flex flex-col">
          <textarea
            ref={textareaRef}
            rows={2}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
            placeholder="What idea, milestone, or allocation are you building? Share details..."
            className="w-full shrink-0 min-h-[60px] resize-none bg-transparent text-[16px] sm:text-[17px] leading-[1.6] text-[#14213D] placeholder:text-[#94A3B8] focus:outline-none break-words [overflow-wrap:anywhere]"
          />

          {/* Attached Image Preview - Full uncropped view */}
          {image && (
            <div className="relative mt-2 shrink-0 overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]">
              <img
                src={image.dataUrl}
                alt={image.name}
                className="max-h-[420px] w-full object-contain rounded-xl"
              />
              <div className="absolute top-2.5 right-2.5 flex items-center gap-2 rounded-lg bg-[#14213D]/90 px-2.5 py-1 text-xs text-white shadow backdrop-blur-sm">
                <Camera className="size-3.5 text-[#F5B544]" />
                <span className="max-w-[160px] truncate font-mono text-[11px]">
                  {image.name} · {formatSize(image.size)}
                </span>
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="rounded-full p-0.5 hover:bg-white/20 transition-colors"
                  aria-label="Remove image"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. BOTTOM TOOLBAR & ACTION BAR */}
        <div className="shrink-0 mt-auto flex items-center justify-between border-t border-[#F1F5F9] pt-3.5">
          {/* LEFT SIDE: ATTACHMENT UTILITY ICONS */}
          <div className="flex items-center gap-1">
            {/* Emoji */}
            <div ref={emojiRef} className="relative">
              <button
                type="button"
                onClick={() => setEmojiOpen((v) => !v)}
                title="Add emoji"
                className="flex size-9 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F1F5F9] hover:text-[#14213D]"
              >
                <Smile className="size-5" />
              </button>
              {emojiOpen && (
                <div className="absolute bottom-11 left-0 z-50 grid w-[232px] grid-cols-8 gap-1 rounded-xl border border-[#E2E8F0] bg-white p-2 shadow-xl">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        insertAtCursor(emoji);
                        setEmojiOpen(false);
                      }}
                      className="grid size-7 place-items-center rounded-md text-base hover:bg-[#F1F5F9]"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Photo / Media Picker */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                void handleFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Attach media"
              className="flex size-9 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F1F5F9] hover:text-[#14213D]"
            >
              <ImageIcon className="size-5" />
            </button>

            {/* Milestone / Celebrate Deal */}
            <button
              type="button"
              onClick={() => {
                setText("🚀 We just reached a major funding milestone! Proud to announce $1.2M allocated. #Milestone #Funding");
                toast("Inserted milestone template");
              }}
              title="Celebrate a funding milestone"
              className="flex size-9 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F1F5F9] hover:text-[#14213D]"
            >
              <Sparkles className="size-5" />
            </button>

            {/* Document / Deck */}
            <button
              type="button"
              onClick={() => {
                insertAtCursor("#");
              }}
              title="Add hashtag"
              className="flex size-9 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F1F5F9] hover:text-[#14213D]"
            >
              <Hash className="size-5" />
            </button>
          </div>

          {/* RIGHT SIDE: CONTROLS & POST BUTTON */}
          <div className="flex items-center gap-3">
            {/* Schedule Clock */}
            <button
              type="button"
              onClick={() => toast("Post scheduling is queued for your network timeline (demo)")}
              title="Schedule for later"
              className="flex size-9 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F1F5F9] hover:text-[#14213D]"
            >
              <Clock className="size-5" />
            </button>

            {/* Counter */}
            <span className="text-[12px] font-medium text-[#94A3B8]">
              {text.length} / {MAX_LENGTH}
            </span>

            {/* Primary Post / Save Button */}
            <button
              type="button"
              disabled={!canPost}
              onClick={handlePublish}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-6 py-2 text-[14px] font-semibold transition-all shadow-sm",
                canPost
                  ? "bg-[#F5B544] text-[#14213D] hover:bg-[#E9A72F] cursor-pointer shadow-md"
                  : "bg-[#E2E8F0] text-[#94A3B8] cursor-not-allowed opacity-80"
              )}
            >
              {isPosting ? (
                <>
                  <span className="size-3.5 animate-spin rounded-full border-2 border-[#14213D] border-t-transparent" />
                  <span>{initialPost ? "Saving..." : "Posting..."}</span>
                </>
              ) : (
                <span>{initialPost ? "Save changes" : "Post"}</span>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ComposerCard({
  onOpen,
  initials,
}: {
  onOpen: (preset?: string) => void;
  initials?: string;
}) {
  const profile = useJoinStore((state) => state.profile);
  const firstName = profile?.firstName || "Tariq";
  const lastName = profile?.lastName || "Mansoor";
  const userInitials =
    initials ||
    `${firstName[0] ?? "T"}${lastName[0] ?? "M"}`.toUpperCase();

  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_3px_14px_rgba(20,33,61,0.06)] sm:p-5">
      <div className="flex items-center gap-3">
        <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-[#14213D] text-xs font-bold text-white">
          {userInitials}
          <i className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-[#5BA4E6]" />
        </span>
        <button
          onClick={() => onOpen()}
          className="h-10 min-w-0 flex-1 truncate rounded-full border border-[#E5E7EB] bg-[#F8FAFC] px-4 text-left text-xs text-[#64748B] hover:border-[#CBD5E1] transition-colors"
        >
          Share an idea, allocation or investment mandate…
        </button>
      </div>
      <div className="mt-3 grid grid-cols-3 border-t border-[#F1F3F6] pt-3">
        {[
          [Sparkles, "Pitch", "bg-[#FEF3D8] text-[#8A5A00]"],
          [ImageIcon, "Media & Deck", "bg-[#EEF0FA] text-[#3F4FA0]"],
          [FileText, "Write memo", "bg-[#F3EEFA] text-[#7C5CBF]"],
        ].map(([Icon, label, color]) => {
          const ItemIcon = Icon;
          const title = label as string;
          return (
            <button
              key={title}
              onClick={() => onOpen(title === "Write memo" ? "Memo" : title)}
              className="flex min-h-11 items-center justify-center gap-2 text-[11px] font-semibold text-[#475569] sm:text-xs hover:bg-[#F8FAFC] rounded-lg transition-colors"
            >
              <span
                className={`grid size-7 place-items-center rounded-full ${color}`}
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