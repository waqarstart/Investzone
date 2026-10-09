import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Camera,
  CheckCircle2,
  Edit3,
  Globe,
  MapPin,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useProfileStore } from '../useProfileStore'
import { ContactInfoModal } from './ContactInfoModal'

import { compressImage } from '@/lib/imageUtils'

export function ProfileHeaderCard() {
  const navigate = useNavigate()
  const profile = useProfileStore((state) => state.profile)
  const setAvatar = useProfileStore((state) => state.setAvatar)
  const setCover = useProfileStore((state) => state.setCover)
  const [contactModalOpen, setContactModalOpen] = useState(false)

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const initials = `${profile.firstName[0] || 'Z'}${profile.lastName[0] || 'I'}`.toUpperCase()
  const isFounder = profile.role === 'founder'

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const compressed = await compressImage(file, 400, 400, 0.85)
        setAvatar(compressed)
        toast.success('Profile picture updated!')
      } catch {
        toast.error('Failed to process image')
      }
    }
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const compressed = await compressImage(file, 1200, 450, 0.8)
        setCover(compressed)
        toast.success('Cover photo updated!')
      } catch {
        toast.error('Failed to process image')
      }
    }
  }

  return (
    <>
      <article className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_3px_14px_rgba(20,33,61,0.06)] relative">
        {/* Hidden File Inputs */}
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarUpload}
        />
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCoverUpload}
        />

        {/* 1. COVER PHOTO BANNER */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-gradient-to-r from-[#14213D] via-[#2B4A47] to-[#233C3C]">
          {profile.coverUrl ? (
            <img
              src={profile.coverUrl}
              alt="Profile cover banner"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#F5B544_1px,transparent_1px)] [background-size:16px_16px]" />
          )}

          {/* Cover Photo Upload Button */}
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            title="Change cover photo"
            className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-md hover:bg-black/80 transition-all shadow-md cursor-pointer"
          >
            <Camera className="size-4" />
          </button>
        </div>

        {/* 2. PROFILE INTRO BODY */}
        <div className="px-5 sm:px-7 pb-6 pt-0 relative">
          {/* Avatar and Top Actions Row */}
          <div className="flex flex-wrap items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            {/* 120px Circular Avatar with Camera Trigger */}
            <div className="relative group">
              <div
                className="flex size-28 sm:size-32 shrink-0 items-center justify-center rounded-full bg-[#14213D] text-3xl font-extrabold text-white shadow-xl ring-4 ring-white overflow-hidden"
              >
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>

              {/* Camera upload badge */}
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                title="Update profile picture"
                className="absolute bottom-1 right-1 flex size-8 items-center justify-center rounded-full bg-[#F5B544] text-[#14213D] shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer border-2 border-white"
              >
                <Camera className="size-4" />
              </button>
            </div>

            {/* Edit Profile (Pen Icon Button) */}
            <button
              type="button"
              onClick={() => navigate('/profile/edit')}
              title="Edit Profile"
              className="flex size-9 items-center justify-center rounded-full border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#14213D] shadow-xs transition-colors cursor-pointer"
            >
              <Edit3 className="size-4 text-[#3F4FA0]" />
            </button>
          </div>

          {/* User Name, KYC Badge & Role Tag */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-[#14213D] tracking-tight">
                {profile.firstName} {profile.lastName}
              </h1>

              {/* Verified Identity Badge (Based on KYC) */}
              {profile.kycStatus === 'verified' && (
                <div
                  title={`ID Verified · Valid until ${profile.kycExpiryDate || '14 Aug 2029'}`}
                  className="flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 shadow-2xs"
                >
                  <CheckCircle2 className="size-3.5 text-emerald-600 fill-emerald-100" />
                  <span>Verified</span>
                </div>
              )}

              {/* Role Chip */}
              <span
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider',
                  isFounder ? 'bg-[#FEF3D8] text-[#92400E]' : 'bg-[#EEF2FF] text-[#3730A3]'
                )}
              >
                {isFounder ? 'Founder' : 'Investor'}
              </span>
            </div>

            {/* Headline */}
            <p className="text-xs sm:text-sm text-[#334155] leading-relaxed max-w-2xl font-medium break-words [overflow-wrap:anywhere]">
              {profile.headline}
            </p>

            {/* Location, Contact & Connections */}
            <div className="flex items-center gap-4 text-xs text-[#64748B] flex-wrap pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5 text-[#94A3B8]" />
                <span>{profile.location}</span>
              </span>

              <button
                type="button"
                onClick={() => setContactModalOpen(true)}
                className="flex items-center gap-1 font-semibold text-[#3F4FA0] hover:underline cursor-pointer"
              >
                <Globe className="size-3.5" />
                <span>Contact info</span>
              </button>

              <span className="flex items-center gap-1 font-semibold text-[#14213D]">
                <Users className="size-3.5 text-[#94A3B8]" />
                <span className="text-[#3F4FA0] font-bold">{profile.connectionsCount}+</span> connections
              </span>
            </div>
          </div>
        </div>
      </article>

      {/* Contact Info Modal */}
      <ContactInfoModal
        open={contactModalOpen}
        onOpenChange={setContactModalOpen}
      />
    </>
  )
}
