import { useState, useEffect } from 'react'
import { Globe, MapPin, User, X } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useProfileStore } from '../useProfileStore'
import type { UserRole } from '../types'

interface EditIntroModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditIntroModal({ open, onOpenChange }: EditIntroModalProps) {
  const profile = useProfileStore((state) => state.profile)
  const updateProfile = useProfileStore((state) => state.updateProfile)
  const setRole = useProfileStore((state) => state.setRole)

  const [firstName, setFirstName] = useState(profile.firstName)
  const [lastName, setLastName] = useState(profile.lastName)
  const [role, setLocalRole] = useState<UserRole>(profile.role)
  const [headline, setHeadline] = useState(profile.headline)
  const [location, setLocation] = useState(profile.location)
  const [website, setWebsite] = useState(profile.website || '')
  const [bio, setBio] = useState(profile.bio)
  const [openTo, setOpenTo] = useState(profile.openTo)

  useEffect(() => {
    if (open) {
      setFirstName(profile.firstName)
      setLastName(profile.lastName)
      setLocalRole(profile.role)
      setHeadline(profile.headline)
      setLocation(profile.location)
      setWebsite(profile.website || '')
      setBio(profile.bio)
      setOpenTo(profile.openTo)
    }
  }, [open, profile])

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (role !== profile.role) {
      setRole(role)
    }
    updateProfile({
      firstName,
      lastName,
      role,
      headline,
      location,
      website,
      bio,
      openTo,
    })
    toast.success('Profile updated successfully!')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[94vw] !max-w-[700px] max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-0 shadow-2xl [&>button]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F1F5F9] px-6 py-4">
          <div className="flex items-center gap-2">
            <User className="size-5 text-[#3F4FA0]" />
            <DialogTitle className="text-base font-bold text-[#14213D]">
              Edit Intro & Identity
            </DialogTitle>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5 [scrollbar-width:thin]">
          {/* Persona / Role Selector */}
          <div>
            <label className="block text-xs font-bold text-[#14213D] mb-1.5">
              Profile Persona / Role
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLocalRole('founder')}
                className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all cursor-pointer ${
                  role === 'founder'
                    ? 'border-[#F5B544] bg-[#FEF3D8]/40 ring-2 ring-[#F5B544]/20'
                    : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F5B544] text-[#14213D] font-bold">
                  🚀
                </div>
                <div>
                  <p className="text-xs font-bold text-[#14213D]">Founder View</p>
                  <p className="text-[10px] text-[#64748B]">Raising capital & building ventures</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLocalRole('investor')}
                className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition-all cursor-pointer ${
                  role === 'investor'
                    ? 'border-[#3F4FA0] bg-[#EEF2FF]/60 ring-2 ring-[#3F4FA0]/20'
                    : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'
                }`}
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#3F4FA0] text-white font-bold">
                  💼
                </div>
                <div>
                  <p className="text-xs font-bold text-[#14213D]">Investor View</p>
                  <p className="text-[10px] text-[#64748B]">Managing capital & deploying funds</p>
                </div>
              </button>
            </div>
          </div>

          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#14213D] mb-1">First Name *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#14213D] mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
              />
            </div>
          </div>

          {/* Professional Headline */}
          <div>
            <label className="block text-xs font-bold text-[#14213D] mb-1">
              Headline *
            </label>
            <textarea
              rows={2}
              required
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Founder & CEO at AgriFlow · Agritech IoT | Raising $1.2M Seed"
              className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20 resize-none"
            />
          </div>

          {/* Open To Status */}
          <div>
            <label className="block text-xs font-bold text-[#14213D] mb-1">
              "Open To" Status Focus
            </label>
            <input
              type="text"
              value={openTo}
              onChange={(e) => setOpenTo(e.target.value)}
              placeholder={role === 'founder' ? 'e.g. Raising Seed Capital ($1.2M)' : 'e.g. Evaluating Seed Deals ($50K-$500K)'}
              className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
            />
          </div>

          {/* Location & Website */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#14213D] mb-1 flex items-center gap-1">
                <MapPin className="size-3.5 text-[#64748B]" />
                <span>Location</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#14213D] mb-1 flex items-center gap-1">
                <Globe className="size-3.5 text-[#64748B]" />
                <span>Website / Portfolio</span>
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://"
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
              />
            </div>
          </div>


          {/* About / Bio Summary */}
          <div>
            <label className="block text-xs font-bold text-[#14213D] mb-1">
              About Summary / Mission Bio
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2.5 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#F1F5F9]">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-full px-4 py-2 text-xs font-semibold text-[#64748B] hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#14213D] px-6 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#24365c] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
