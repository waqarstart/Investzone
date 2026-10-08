import { Check, Copy, ExternalLink, Globe, Mail, Phone, X } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useProfileStore } from '../useProfileStore'

interface ContactInfoModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContactInfoModal({ open, onOpenChange }: ContactInfoModalProps) {
  const profile = useProfileStore((state) => state.profile)
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)

  const publicUrl = `https://bridgeway.com/in/${profile.firstName.toLowerCase().replace(/\s+/g, '-')}-${profile.lastName.toLowerCase()}`
  const email = profile.contactEmail || 'zahra.ijaz@agriflowtech.io'
  const phone = profile.contactPhone || '+92 300 1234567'
  const website = profile.website || 'https://agriflowtech.io'

  function handleCopyLink() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(publicUrl)
    }
    setCopiedLink(true)
    toast.success('Profile link copied to clipboard!')
    setTimeout(() => setCopiedLink(false), 2000)
  }

  function handleCopyEmail() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email)
    }
    setCopiedEmail(true)
    toast.success('Email copied to clipboard!')
    setTimeout(() => setCopiedEmail(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[94vw] !max-w-[480px] flex flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-0 shadow-2xl [&>button]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F1F5F9] px-5 py-4">
          <DialogTitle className="text-base font-bold text-[#14213D]">
            {profile.firstName} {profile.lastName}
            <span className="block text-xs font-normal text-[#64748B] mt-0.5">
              Contact & Profile Details
            </span>
          </DialogTitle>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {/* 1. Profile Link */}
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#14213D]">
                <Globe className="size-3.5 text-[#3F4FA0]" />
                <span>Bridgeway Profile</span>
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold text-[#3F4FA0] hover:bg-[#EEF0FA] transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="size-3 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-[#3F4FA0] hover:underline break-all [overflow-wrap:anywhere]"
            >
              {publicUrl}
            </a>
          </div>

          {/* 2. Email Address */}
          <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#14213D]">
                <Mail className="size-3.5 text-[#3F4FA0]" />
                <span>Email Address</span>
              </span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold text-[#3F4FA0] hover:bg-[#EEF0FA] transition-colors cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <Check className="size-3 text-emerald-600" />
                    <span className="text-emerald-700">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <a
              href={`mailto:${email}`}
              className="text-xs font-medium text-[#14213D] hover:text-[#3F4FA0] hover:underline break-all [overflow-wrap:anywhere]"
            >
              {email}
            </a>
          </div>

          {/* 3. Phone (if available) */}
          {phone && (
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#14213D] mb-1.5">
                <Phone className="size-3.5 text-[#3F4FA0]" />
                <span>Phone</span>
              </span>
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="text-xs font-medium text-[#14213D] hover:text-[#3F4FA0]"
              >
                {phone}
              </a>
            </div>
          )}

          {/* 4. Website (if available) */}
          {website && (
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5">
              <span className="flex items-center gap-1.5 text-xs font-bold text-[#14213D] mb-1.5">
                <ExternalLink className="size-3.5 text-[#3F4FA0]" />
                <span>Website</span>
              </span>
              <a
                href={website}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-[#3F4FA0] hover:underline break-all [overflow-wrap:anywhere]"
              >
                {website}
              </a>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-[#F1F5F9] px-5 py-3 bg-slate-50/50">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-full bg-[#14213D] px-5 py-1.5 text-xs font-bold text-[#F5B544] hover:bg-[#233866] transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
