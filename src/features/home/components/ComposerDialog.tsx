import { useEffect, useRef, useState } from "react";
import {
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Globe,
  Hash,
  Image as ImageIcon,
  Plus,
  Smile,
  Sparkles,
  Users,
  Video,
  X,
  ZoomIn,
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
import { useProfileStore } from "@/features/profile/useProfileStore";
import { cn } from "@/lib/utils";
import type { Post } from "../types";

const MAX_LENGTH = 1000;
const MAX_IMAGES = 10;
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
  quotedPost?: Post | null;
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

function compressAndReadImage(file: File, maxWidth = 1080, quality = 0.75): Promise<string> {
  if (file.type === "image/gif") {
    return readAsDataUrl(file);
  }
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", quality);
          resolve(compressed);
        } else {
          resolve(String(e.target?.result || ""));
        }
      };
      img.onerror = () => resolve(String(e.target?.result || ""));
      img.src = String(e.target?.result || "");
    };
    reader.onerror = () => resolve("");
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
  quotedPost,
}: ComposerDialogProps) {
  const profileStore = useProfileStore((state) => state.profile);
  const avatarUrl = profileStore?.avatarUrl;

  const [text, setText] = useState("");
  const [audience, setAudience] = useState<AudienceId>("public");
  const [images, setImages] = useState<AttachedImage[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoName, setVideoName] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (previewIndex === null) return undefined;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPreviewIndex(null);
      } else if (e.key === "ArrowLeft") {
        setPreviewIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
      } else if (e.key === "ArrowRight") {
        setPreviewIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : prev));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewIndex, images.length]);

  useEffect(() => {
    if (open) {
      if (initialPost) {
        setText(initialPost.body);
        const loadedImages: AttachedImage[] = [];
        if (initialPost.images && initialPost.images.length > 0) {
          initialPost.images.forEach((url, i) => {
            loadedImages.push({
              name: `Photo ${i + 1}`,
              size: 1024 * 400,
              dataUrl: url,
            });
          });
        } else if (initialPost.imageUrl) {
          loadedImages.push({
            name: initialPost.imageName || "Attached photo",
            size: 1024 * 400,
            dataUrl: initialPost.imageUrl,
          });
        }
        setImages(loadedImages);
        setVideoUrl(initialPost.videoUrl || null);
        setVideoName(initialPost.videoName || null);
      } else {
        setText("");
        setImages([]);
        setVideoUrl(null);
        setVideoName(null);
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

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const incoming = Array.from(files);

    if (images.length + incoming.length > MAX_IMAGES) {
      toast.info(`You can attach up to ${MAX_IMAGES} photos per post.`);
    }

    const availableSlots = Math.max(0, MAX_IMAGES - images.length);
    if (availableSlots <= 0) {
      toast.error(`Maximum limit of ${MAX_IMAGES} photos reached.`);
      return;
    }

    const toProcess = incoming.slice(0, availableSlots);

    const validFiles = toProcess.filter((file) => {
      if (!["image/png", "image/jpeg", "image/webp", "image/gif"].includes(file.type)) {
        toast.error(`${file.name}: Please choose a PNG, JPG or WebP image`);
        return false;
      }
      if (file.size > MAX_IMAGE_BYTES) {
        toast.error(`${file.name}: Image must be smaller than 10 MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    try {
      const readPromises = validFiles.map(async (file) => {
        const dataUrl = await compressAndReadImage(file);
        return { name: file.name, size: file.size, dataUrl };
      });
      const newImages = await Promise.all(readPromises);
      setImages((prev) => [...prev, ...newImages]);
      toast.success(`${newImages.length} photo${newImages.length === 1 ? "" : "s"} attached`);
    } catch {
      toast.error("Could not read attached images");
    }
  };

  const handleVideoFile = (file?: File) => {
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Video must be smaller than 50 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      setVideoUrl(String(e.target?.result || ""));
      setVideoName(file.name);
      toast.success("Video attached successfully");
    };
    reader.onerror = () => {
      toast.error("Failed to read video file");
    };
    reader.readAsDataURL(file);
  };

  const canPost = (text.trim().length > 0 || images.length > 0 || Boolean(videoUrl) || Boolean(quotedPost)) && !isPosting;

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
        images: images.map((img) => img.dataUrl),
        imageUrl: images[0]?.dataUrl,
        imageName: images.length > 1 ? `${images.length} photos` : images[0]?.name,
        videoUrl: videoUrl || undefined,
        videoName: videoName || undefined,
        interested: initialPost?.interested || 0,
        comments: initialPost?.comments || 0,
        engagementScore: initialPost?.engagementScore || 100,
        createdAt: initialPost?.createdAt || Date.now(),
        quotedPost: quotedPost || undefined,
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
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#14213D] text-sm font-bold text-white shadow-sm ring-2 ring-[#E2E8F0] overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt={author} className="size-full object-cover" />
              ) : (
                initials
              )}
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

          {/* Attached Images Preview */}
          {images.length > 0 && (
            <div className="mt-3 flex flex-col gap-2">
              {/* Single Image Preview */}
              {images.length === 1 ? (
                <div
                  onClick={() => setPreviewIndex(0)}
                  className="group relative overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] cursor-pointer hover:border-[#3F4FA0]/50 transition-colors"
                >
                  <img
                    src={images[0].dataUrl}
                    alt={images[0].name}
                    className="max-h-[380px] w-full object-contain rounded-xl transition-transform group-hover:scale-[1.01]"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none">
                    <div className="flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1.5 text-xs font-semibold text-white shadow backdrop-blur-sm">
                      <ZoomIn className="size-4" />
                      <span>Click to preview</span>
                    </div>
                  </div>
                  <div
                    className="absolute top-2.5 right-2.5 flex items-center gap-2 rounded-lg bg-[#14213D]/90 px-2.5 py-1 text-xs text-white shadow backdrop-blur-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Camera className="size-3.5 text-[#F5B544]" />
                    <span className="max-w-[160px] truncate font-mono text-[11px]">
                      {images[0].name} · {formatSize(images[0].size)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setImages([])}
                      className="rounded-full p-0.5 hover:bg-white/20 transition-colors cursor-pointer"
                      aria-label="Remove image"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Multi-Image Gallery Strip (up to 10 photos) */
                <div className="flex flex-col gap-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#14213D] flex items-center gap-1.5">
                      <Camera className="size-4 text-[#3F4FA0]" />
                      <span>Attached Photos ({images.length}/{MAX_IMAGES})</span>
                    </span>
                    {images.length < MAX_IMAGES && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-semibold text-[#3F4FA0] hover:underline cursor-pointer"
                      >
                        + Add more
                      </button>
                    )}
                  </div>

                  {/* Horizontal Scrollable Thumbnails */}
                  <div className="flex gap-2.5 overflow-x-auto pb-1 pt-1 [scrollbar-width:thin]">
                    {images.map((img, idx) => (
                      <div
                        key={`${img.name}-${idx}`}
                        onClick={() => setPreviewIndex(idx)}
                        className="group relative size-24 shrink-0 overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm cursor-pointer transition-all hover:border-[#3F4FA0] hover:shadow-md hover:scale-[1.03]"
                      >
                        <img
                          src={img.dataUrl}
                          alt={img.name}
                          className="h-full w-full object-cover rounded-xl"
                        />
                        {/* Hover Overlay with Zoom Icon */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                          <ZoomIn className="size-5 text-white drop-shadow-md" />
                        </div>
                        {/* Delete button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImages((prev) => prev.filter((_, i) => i !== idx));
                          }}
                          className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors shadow z-10 cursor-pointer"
                          aria-label={`Remove photo ${idx + 1}`}
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                    {images.length < MAX_IMAGES && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex size-24 shrink-0 flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#CBD5E1] bg-white text-[#64748B] hover:border-[#3F4FA0] hover:text-[#3F4FA0] transition-colors cursor-pointer"
                      >
                        <Plus className="size-5" />
                        <span className="text-[10px] font-semibold mt-1">Add photo</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Attached Video Preview */}
          {videoUrl && (
            <div className="relative mt-3 overflow-hidden rounded-xl border border-[#E2E8F0] bg-black">
              <video
                src={videoUrl}
                controls
                className="max-h-[360px] w-full object-contain"
              />
              <button
                type="button"
                onClick={() => {
                  setVideoUrl(null);
                  setVideoName(null);
                }}
                className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-black/75 text-white hover:bg-red-600 transition-colors shadow z-10 cursor-pointer"
                aria-label="Remove video"
              >
                <X className="size-4" />
              </button>
            </div>
          )}

          {/* Quoted Post Card Preview in Composer */}
          {quotedPost && (
            <div className="mt-3 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-left">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#14213D] text-[10px] font-bold text-white">
                  {quotedPost.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#14213D] truncate">{quotedPost.name}</p>
                  <p className="text-[10px] text-[#64748B] truncate">{quotedPost.headline}</p>
                </div>
              </div>
              <p className="text-xs text-[#334155] line-clamp-3 break-words whitespace-pre-wrap">{quotedPost.body}</p>
              {(quotedPost.images && quotedPost.images.length > 0 ? quotedPost.images : quotedPost.imageUrl ? [quotedPost.imageUrl] : []).length > 0 && (
                <div className="mt-2.5 max-h-36 overflow-hidden rounded-lg border border-[#E2E8F0] bg-black">
                  <img
                    src={(quotedPost.images && quotedPost.images[0]) || quotedPost.imageUrl}
                    alt="Quoted media preview"
                    className="max-h-36 w-full object-contain"
                  />
                </div>
              )}
            </div>
          )}

          {/* Lightbox / Full Photo Preview Modal */}
          {previewIndex !== null && images[previewIndex] && (
            <div
              className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in duration-200 select-none"
              onClick={() => setPreviewIndex(null)}
            >
              {/* Top Bar */}
              <div
                className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 to-transparent text-white"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-2.5">
                  <Camera className="size-4 text-[#F5B544]" />
                  <span className="text-sm font-semibold truncate max-w-[240px] sm:max-w-md">
                    {images[previewIndex].name}
                  </span>
                  <span className="text-xs text-white/60">
                    ({previewIndex + 1} of {images.length})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setPreviewIndex(null)}
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  aria-label="Close preview"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Previous Button */}
              {images.length > 1 && previewIndex > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex size-11 items-center justify-center rounded-full bg-black/60 text-white shadow-xl hover:bg-black/90 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="size-6" />
                </button>
              )}

              {/* Next Button */}
              {images.length > 1 && previewIndex < images.length - 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreviewIndex((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : prev));
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex size-11 items-center justify-center rounded-full bg-black/60 text-white shadow-xl hover:bg-black/90 hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  aria-label="Next photo"
                >
                  <ChevronRight className="size-6" />
                </button>
              )}

              {/* Center Full Image */}
              <div
                className="relative max-h-[82vh] max-w-[90vw] flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={images[previewIndex].dataUrl}
                  alt={images[previewIndex].name}
                  className="max-h-[82vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
                />
              </div>

              {/* Bottom Thumbnail Strip inside Lightbox */}
              {images.length > 1 && (
                <div
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 backdrop-blur-md overflow-x-auto max-w-[90vw]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPreviewIndex(idx)}
                      className={cn(
                        "size-9 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer",
                        idx === previewIndex
                          ? "border-white scale-110 shadow-md"
                          : "border-transparent opacity-50 hover:opacity-100"
                      )}
                    >
                      <img src={img.dataUrl} alt={`Thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
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
              multiple
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                void handleFiles(e.target.files);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Attach media (up to 10 photos)"
              className="flex size-9 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F1F5F9] hover:text-[#14213D]"
            >
              <ImageIcon className="size-5" />
            </button>

            {/* Video Picker */}
            <input
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/ogg"
              className="hidden"
              onChange={(e) => {
                handleVideoFile(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              title="Attach video"
              className="flex size-9 items-center justify-center rounded-lg text-[#64748B] transition-colors hover:bg-[#F1F5F9] hover:text-[#14213D]"
            >
              <Video className="size-5" />
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
  const profileStore = useProfileStore((state) => state.profile);
  const joinProfile = useJoinStore((state) => state.profile);
  const firstName = profileStore?.firstName || joinProfile?.firstName || "Syeda Zahra";
  const lastName = profileStore?.lastName || joinProfile?.lastName || "Ijaz";
  const userInitials =
    initials ||
    `${firstName[0] ?? "Z"}${lastName[0] ?? "I"}`.toUpperCase();
  const avatarUrl = profileStore?.avatarUrl;

  return (
    <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-[0_3px_14px_rgba(20,33,61,0.06)] sm:p-5">
      <div className="flex items-center gap-3">
        <span className="relative grid size-10 shrink-0 place-items-center rounded-full bg-[#14213D] text-xs font-bold text-white overflow-hidden ring-1 ring-slate-200">
          {avatarUrl ? (
            <img src={avatarUrl} alt={firstName} className="size-full object-cover" />
          ) : (
            userInitials
          )}
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