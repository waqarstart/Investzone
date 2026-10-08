import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useProfileStore } from '../useProfileStore'

interface EditAboutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditAboutModal({ open, onOpenChange }: EditAboutModalProps) {
  const profile = useProfileStore((state) => state.profile)
  const updateProfile = useProfileStore((state) => state.updateProfile)

  const [bio, setBio] = useState(profile.bio || '')

  useEffect(() => {
    if (open) {
      setBio(profile.bio || '')
    }
  }, [open, profile.bio])

  const MAX_CHARACTERS = 2500
  const charCount = bio.length

  function handleBioChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const val = e.target.value
    if (val.length > MAX_CHARACTERS) {
      setBio(val.slice(0, MAX_CHARACTERS))
      toast.warning('Maximum limit of 2,500 characters reached')
      return
    }
    setBio(val)
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (charCount > MAX_CHARACTERS) {
      toast.error('Please keep your summary under 2,500 characters')
      return
    }
    updateProfile({ bio })
    toast.success('About section updated successfully!')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[94vw] !max-w-[680px] flex flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-0 shadow-2xl [&>button]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F1F5F9] px-6 py-4">
          <div>
            <DialogTitle className="text-base sm:text-lg font-bold text-[#14213D]">
              Edit About
            </DialogTitle>
            <p className="text-xs text-[#64748B] mt-0.5">
              Highlight your founder story, milestones, or strategic focus
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <textarea
              rows={8}
              required
              maxLength={MAX_CHARACTERS}
              value={bio}
              onChange={handleBioChange}
              placeholder="Write a comprehensive overview of your background, industry experience, investment criteria, or company vision..."
              className="w-full min-h-[220px] rounded-xl border border-[#CBD5E1] bg-white p-4 text-xs sm:text-sm text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20 resize-y leading-relaxed break-words [overflow-wrap:anywhere]"
            />
            <div className="flex items-center justify-between mt-2 text-xs text-[#64748B]">
              <span className="text-[11px] text-[#94A3B8]">
                Markdown breaks & paragraphs supported
              </span>
              <span className={`text-xs font-semibold ${charCount >= MAX_CHARACTERS ? 'text-amber-600 font-bold' : 'text-[#64748B]'}`}>
                {charCount.toLocaleString()} / 2,500 characters
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1F5F9]">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-full px-5 py-2 text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={charCount > MAX_CHARACTERS}
              className="rounded-full bg-[#14213D] px-6 py-2 text-xs font-bold text-[#F5B544] shadow-sm hover:bg-[#233866] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
