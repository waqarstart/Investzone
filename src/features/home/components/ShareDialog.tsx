import { useState } from "react";
import {
  Copy,
  Mail,
  MessageCircle,
  Repeat,
  Search,
  Send,
  Sparkles,
  Users,
  X,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { Post } from "../types";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
}

const RECENT_CONTACTS = [
  { id: "1", name: "Salman Kazi", role: "Partner, Indus Seed Fund", initials: "SK" },
  { id: "2", name: "Amina Zafar", role: "Indus Valley Ventures", initials: "AZ" },
  { id: "3", name: "Apex Capital Syndicate", role: "Institutional Lead", initials: "AC" },
  { id: "4", name: "Taimur Chaudhry", role: "Angel Investor", initials: "TH" },
];

export function ShareDialog({ open, onOpenChange, post }: ShareDialogProps) {
  const [search, setSearch] = useState("");
  const [sentMap, setSentMap] = useState<Record<string, boolean>>({});

  if (!post) return null;

  const handleSend = (id: string, name: string) => {
    setSentMap((prev) => ({ ...prev, [id]: true }));
    toast.success(`Direct memo sent to ${name}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText?.(window.location.href);
    toast.success("Opportunity link copied to clipboard!");
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `Check out this deal on Bridgeway: ${post.name}'s raise - ${post.body.slice(0, 100)}...`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const filteredContacts = RECENT_CONTACTS.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[540px] rounded-2xl border border-[#E2E8F0] bg-[#FFFFFF] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.22)] sm:p-6 [&>button]:hidden">
        <DialogTitle className="sr-only">Share this Opportunity</DialogTitle>

        {/* 1. MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-3.5">
          <h3 className="text-[17px] font-bold text-[#14213D]">Share this Opportunity</h3>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex size-8 items-center justify-center rounded-full text-slate-500 hover:bg-[#F1F5F9] hover:text-[#14213D]"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* 2. SECTION A: DIRECT INTERNAL SEND */}
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-[#F8F9FA] px-3.5 py-1.5 focus-within:border-[#3F4FA0] focus-within:bg-white transition-colors">
            <Search className="size-4 text-[#94A3B8]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search investors, founders, or syndicates..."
              className="w-full bg-transparent text-xs text-[#14213D] placeholder:text-[#94A3B8] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
            {filteredContacts.map((contact) => {
              const isSent = sentMap[contact.id];
              return (
                <div
                  key={contact.id}
                  className="flex items-center justify-between rounded-xl border border-[#F1F5F9] bg-[#FAFAFA] p-2 hover:bg-[#F8F9FA] transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#14213D] text-[10px] font-bold text-white">
                      {contact.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-[#14213D]">
                        {contact.name}
                      </p>
                      <p className="truncate text-[10px] text-[#64748B]">{contact.role}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSend(contact.id, contact.name)}
                    disabled={isSent}
                    className={`ml-2 flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold transition-all ${
                      isSent
                        ? "bg-[#EEF0FA] text-[#3F4FA0]"
                        : "border border-[#3F4FA0] text-[#3F4FA0] hover:bg-[#3F4FA0] hover:text-white"
                    }`}
                  >
                    {isSent ? (
                      <>
                        <Check className="size-3" />
                        <span>Sent</span>
                      </>
                    ) : (
                      <>
                        <Send className="size-2.5" />
                        <span>Send</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. SECTION B: FEED BROADCAST OPTIONS */}
        <div className="mt-4 border-t border-[#F1F5F9] pt-3.5 space-y-2">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
            Or share to network
          </span>

          <button
            type="button"
            onClick={() => {
              toast.success("Quote post dialog opened (demo)");
              onOpenChange(false);
            }}
            className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left hover:bg-[#F8F9FA] transition-colors"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#FEF3D8] text-[#8A5A00]">
              <Sparkles className="size-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#14213D]">Repost with your thoughts</p>
              <p className="text-[11px] text-[#64748B]">
                Quote this deal and add your commentary to your network feed
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              toast.success("Instantly reposted to your connections!");
              onOpenChange(false);
            }}
            className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left hover:bg-[#F8F9FA] transition-colors"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#EEF0FA] text-[#3F4FA0]">
              <Repeat className="size-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#14213D]">Instant Repost</p>
              <p className="text-[11px] text-[#64748B]">
                Instantly broadcast this deal to all your connections
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              toast.success("Shared to your accredited syndicate");
              onOpenChange(false);
            }}
            className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left hover:bg-[#F8F9FA] transition-colors"
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#F3EEFA] text-[#7C5CBF]">
              <Users className="size-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#14213D]">Share to Syndicate or Group</p>
              <p className="text-[11px] text-[#64748B]">
                Post into private investor syndicates you belong to
              </p>
            </div>
          </button>
        </div>

        {/* 4. SECTION C: QUICK UTILITY & EXTERNAL SHARING */}
        <div className="mt-4 flex items-center justify-between gap-2 rounded-xl bg-[#F8F9FA] p-2.5">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#14213D] shadow-sm hover:bg-[#F1F5F9] transition-colors border border-[#E2E8F0]"
          >
            <Copy className="size-3.5 text-[#64748B]" />
            <span>Copy Link</span>
          </button>

          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#14213D] shadow-sm hover:bg-[#F1F5F9] transition-colors border border-[#E2E8F0]"
          >
            <MessageCircle className="size-3.5 text-[#14213D]" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={() => {
              window.location.href = `mailto:?subject=Bridgeway Deal: ${encodeURIComponent(
                post.name
              )}&body=Review this opportunity on Bridgeway: ${encodeURIComponent(window.location.href)}`;
            }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-[#14213D] shadow-sm hover:bg-[#F1F5F9] transition-colors border border-[#E2E8F0]"
          >
            <Mail className="size-3.5 text-[#64748B]" />
            <span>Email</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
