import { useState } from "react";
import {
  Check,
  Link as LinkIcon,
  Network,
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Post } from "../types";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
}

interface ContactItem {
  id: string;
  name: string;
  role: string;
  initials?: string;
  avatarBg: string;
  avatarText?: string;
  isIcon?: boolean;
  badge?: {
    text: string;
    bg: string;
    textColor: string;
  };
}

const RECENT_CONTACTS: ContactItem[] = [
  {
    id: "1",
    name: "Salman Kazi",
    role: "Partner · Indus Seed Fund",
    initials: "SK",
    avatarBg: "bg-[#14213D]",
    avatarText: "text-white",
  },
  {
    id: "2",
    name: "Amina Zafar",
    role: "Indus Valley Ventures",
    initials: "AZ",
    avatarBg: "bg-[#3F4FA0]",
    avatarText: "text-white",
  },
  {
    id: "3",
    name: "Apex Capital Group",
    role: "42 Qualified Institutional LPs",
    avatarBg: "bg-[#0F2A2B]",
    avatarText: "text-[#F5B544]",
    isIcon: true,
    badge: {
      text: "Group",
      bg: "bg-[#F1F5F9]",
      textColor: "text-[#475569]",
    },
  },
  {
    id: "4",
    name: "Taimur Chaudhry",
    role: "Focus: B2B Agri & Logistics",
    initials: "TH",
    avatarBg: "bg-[#1E293B]",
    avatarText: "text-white",
    badge: {
      text: "Angel",
      bg: "bg-[#F5B544]/20",
      textColor: "text-[#604100]",
    },
  },
  {
    id: "5",
    name: "Sarah Jenkins",
    role: "Principal · Cross-Border FinTech",
    initials: "SJ",
    avatarBg: "bg-[#4C1D95]",
    avatarText: "text-white",
    badge: {
      text: "VC",
      bg: "bg-[#EEF2FF]",
      textColor: "text-[#4338CA]",
    },
  },
  {
    id: "6",
    name: "Bilal & Co Syndicate",
    role: "Syndicate Lead · Early Stage",
    initials: "BC",
    avatarBg: "bg-[#1E3A8A]",
    avatarText: "text-white",
    badge: {
      text: "Syndicate",
      bg: "bg-[#F0FDF4]",
      textColor: "text-[#15803D]",
    },
  },
  {
    id: "7",
    name: "Zoya Alvi",
    role: "Managing Director · HealthBridge Ventures",
    initials: "ZA",
    avatarBg: "bg-[#047857]",
    avatarText: "text-white",
    badge: {
      text: "Angel",
      bg: "bg-[#F5B544]/20",
      textColor: "text-[#604100]",
    },
  },
  {
    id: "8",
    name: "Kamran Shafi",
    role: "Venture Partner · SilkRoad Capital",
    initials: "KS",
    avatarBg: "bg-[#9A3412]",
    avatarText: "text-white",
    badge: {
      text: "Partner",
      bg: "bg-[#FFF7ED]",
      textColor: "text-[#C2410C]",
    },
  },
  {
    id: "9",
    name: "Marcus Vance",
    role: "Meridian Ventures Syndicate Desk",
    initials: "MV",
    avatarBg: "bg-[#334155]",
    avatarText: "text-white",
    badge: {
      text: "Lead LP",
      bg: "bg-[#F8FAFC]",
      textColor: "text-[#334155]",
    },
  },
  {
    id: "10",
    name: "Zainab Bilal",
    role: "HealthTech Angel LP Group",
    initials: "ZB",
    avatarBg: "bg-[#831843]",
    avatarText: "text-white",
    badge: {
      text: "Angel",
      bg: "bg-[#F5B544]/20",
      textColor: "text-[#604100]",
    },
  },
];

export function ShareDialog({ open, onOpenChange, post }: ShareDialogProps) {
  const [search, setSearch] = useState("");
  const [sentMap, setSentMap] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  if (!post) return null;

  const handleSend = (id: string, name: string) => {
    if (sentMap[id]) return;
    setSentMap((prev) => ({ ...prev, [id]: true }));
    toast.success(`Direct memo sent to ${name}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    setCopied(true);
    toast.success("Opportunity link copied to clipboard!");
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const filteredContacts = RECENT_CONTACTS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase())
  );

  const authorName = post.name?.trim() || "User";
  const possessiveName = authorName.endsWith("s") ? `${authorName}'` : `${authorName}'s`;
  const dialogHeading = `Send ${possessiveName} post`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[500px] h-[520px] max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-0 shadow-[0_20px_45px_-10px_rgba(15,23,42,0.28)] [&>button]:hidden">
        <DialogTitle className="sr-only">{dialogHeading}</DialogTitle>

        {/* MODAL HEADER - COMPACT & FIXED */}
        <div className="flex shrink-0 items-center justify-between px-5 py-3.5 bg-white">
          <h3 className="text-base font-bold tracking-tight text-[#14213D]" id="modal-share-title">
            {dialogHeading}
          </h3>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={() => onOpenChange(false)}
            className="flex size-7 items-center justify-center rounded-full text-[#64748B] transition-colors hover:bg-[#F1F5F9] hover:text-[#14213D] cursor-pointer focus:outline-none"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="w-full h-[1px] bg-[#F1F5F9] shrink-0" />

        {/* MODAL BODY - FLEX COLUMN WITH PERSISTENT SIZE */}
        <div className="flex-1 flex flex-col min-h-0 px-5 pt-3.5 pb-2 bg-white">
          {/* Top Search Controls */}
          <div className="shrink-0 space-y-2.5 mb-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="contactSearchInput"
                className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]"
              >
                Direct Send
              </label>
              <span className="text-[11px] font-medium text-[#94A3B8]">Recent Collaborators</span>
            </div>

            {/* Search Bar */}
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#94A3B8]">
                <Search className="size-4" />
              </span>
              <input
                id="contactSearchInput"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search investors, founders, or groups..."
                className="w-full rounded-xl bg-[#F8F9FA] py-2 pl-10 pr-4 text-xs font-medium text-[#14213D] placeholder-[#94A3B8] transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/30"
              />
            </div>
          </div>

          {/* Scrollable Contacts List Area */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-1.5 [scrollbar-width:thin]">
            {filteredContacts.map((contact) => {
              const isSent = Boolean(sentMap[contact.id]);
              return (
                <div
                  key={contact.id}
                  className="flex items-center justify-between rounded-xl p-2 transition-colors hover:bg-[#F8FAFC]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex size-9 shrink-0 items-center justify-center rounded-full font-bold text-xs shadow-sm ${contact.avatarBg} ${contact.avatarText || "text-white"}`}
                    >
                      {contact.isIcon ? (
                        <Network className="size-4 text-[#F5B544]" />
                      ) : (
                        contact.initials
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="truncate text-[13px] font-semibold text-[#0F172A]">
                          {contact.name}
                        </p>
                        {contact.badge && (
                          <span
                            className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${contact.badge.bg} ${contact.badge.textColor}`}
                          >
                            {contact.badge.text}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-xs text-[#64748B]">{contact.role}</p>
                    </div>
                  </div>

                  {isSent ? (
                    <button
                      type="button"
                      disabled
                      className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#5BA4E6] px-3.5 py-1 text-xs font-semibold text-white shadow-sm cursor-default"
                    >
                      <span>Sent</span>
                      <Check className="size-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSend(contact.id, contact.name)}
                      className="flex shrink-0 items-center gap-1 rounded-full bg-white px-3.5 py-1 text-xs font-semibold text-[#14213D] shadow-sm border border-[#E2E8F0] hover:bg-[#EEF4FF] hover:border-[#3F4FA0] transition-all cursor-pointer"
                    >
                      <span>Send</span>
                    </button>
                  )}
                </div>
              );
            })}
            {filteredContacts.length === 0 && (
              <div className="flex h-36 items-center justify-center text-xs text-[#94A3B8]">
                No collaborators found matching "{search}"
              </div>
            )}
          </div>
        </div>

        {/* SECTION B: BOTTOM TRAY (COPY LINK) - PINNED TO BOTTOM */}
        <div className="shrink-0 mt-auto flex flex-wrap items-center justify-between gap-2.5 bg-[#F8F9FA] px-5 py-3.5 border-t border-[#F1F5F9]">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-[#334155] shadow-sm transition-all hover:bg-slate-50 focus:outline-none cursor-pointer"
          >
            <LinkIcon className="size-4 text-[#475569]" />
            <span>{copied ? "Copied!" : "Copy Link"}</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
