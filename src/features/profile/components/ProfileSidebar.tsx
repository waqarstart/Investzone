import { useState } from 'react'
import {
  Check,
  Copy,
  Sparkles,
  UserPlus,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useProfileStore } from '../useProfileStore'

const SUGGESTED_PEERS = [
  {
    name: 'Amina Qureshi',
    role: 'Founder & CEO',
    company: 'AgriFlow Tech',
    initials: 'AQ',
    badge: 'Seed Stage',
  },
  {
    name: 'Marcus Vance',
    role: 'Managing Partner',
    company: 'Meridian Ventures',
    initials: 'MV',
    badge: 'Investor · $15M',
    memberId: 'marcus_v',
  },
  {
    name: 'Dr Aamir Mehmood',
    role: 'Chief AI Architect',
    company: 'HealthBridge AI',
    initials: 'AM',
    badge: 'Series A',
    memberId: 'dr_aamir',
  },
  {
    name: 'Zainab Bilal',
    role: 'CTO & Co-Founder',
    company: 'NexusFin',
    initials: 'ZB',
    badge: 'FinTech',
  },
  {
    name: 'Taimur Chaudhry',
    role: 'Managing Partner',
    company: 'Indus Horizon Capital',
    initials: 'TC',
    badge: 'Venture Capital',
  },
  {
    name: 'Sarah Jenkins',
    role: 'Global Growth Partner',
    company: 'Falcon Syndicate',
    initials: 'SJ',
    badge: 'Investor',
    memberId: 'sarah_j',
  },
  {
    name: 'Kamran Shafi',
    role: 'Co-Founder & COO',
    company: 'MedScale',
    initials: 'KS',
    badge: 'HealthTech',
  },
  {
    name: 'Mahnoor Khan',
    role: 'CTO & Co-Founder',
    company: 'LogiFleet AI',
    initials: 'MK',
    badge: 'Logistics · AI',
  },
]

interface ProfileSidebarProps {
  member?: {
    name: string
    role: 'Founder' | 'Investor'
    id: string
  }
}

export function ProfileSidebar({ member }: ProfileSidebarProps = {}) {
  const currentProfile = useProfileStore((state) => state.profile)
  const [connected, setConnected] = useState<Record<string, boolean>>({})

  const publicUrl = member
    ? `https://bridgeway.com/in/${member.name.toLowerCase().replace(/\s+/g, '-')}`
    : `https://bridgeway.com/in/${currentProfile.firstName.toLowerCase().replace(/\s+/g, '-')}-${currentProfile.lastName.toLowerCase()}`

  const isOtherMember = !!member
  const isFounder = member ? member.role === 'Founder' : currentProfile.role === 'founder'

  function handleCopyLink() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(publicUrl)
    }
    toast.success(isOtherMember ? `${member.name}'s profile link copied!` : 'Public profile link copied to clipboard!')
  }

  return (
    <aside className="space-y-4">
      {/* 1. PROFILE STRENGTH GAUGE */}
      <section className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_3px_14px_rgba(20,33,61,0.06)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#14213D] flex items-center gap-1.5">
            <Sparkles className="size-4 text-[#F5B544]" />
            <span>Profile Strength</span>
          </span>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
            {isOtherMember ? 'All-Star · 98%' : 'All-Star · 92%'}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden my-2">
          <div
            className={`h-full bg-gradient-to-r from-[#F5B544] via-[#3F4FA0] to-emerald-500 rounded-full transition-all ${
              isOtherMember ? 'w-[98%]' : 'w-[92%]'
            }`}
          />
        </div>

        <p className="text-[11px] text-[#64748B] leading-relaxed mt-2">
          {isOtherMember
            ? `${member.name} ranks in the top 3% of verified ${isFounder ? 'founders' : 'investors'} on Bridgeway.`
            : `Your profile ranks in the top 5% of verified ${isFounder ? 'founders' : 'investors'} on Bridgeway.`}
        </p>
      </section>

      {/* 2. PUBLIC PROFILE & URL BOX */}
      <section className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_3px_14px_rgba(20,33,61,0.06)]">
        <h3 className="text-xs font-bold text-[#14213D] mb-1">Public Profile & URL</h3>
        <p className="text-[11px] text-[#64748B] mb-3">
          {isOtherMember ? `Share ${member.name}'s verified profile` : 'Share your verified profile with co-investors & LPs'}
        </p>

        <div className="flex items-center justify-between rounded-xl border border-[#CBD5E1]/70 bg-[#F8FAFC] px-3 py-2 text-xs">
          <span className="truncate max-w-[190px] font-mono text-[11px] text-[#334155]">
            {publicUrl}
          </span>
          <button
            type="button"
            onClick={handleCopyLink}
            title="Copy link"
            className="flex items-center gap-1 text-[11px] font-bold text-[#3F4FA0] hover:text-[#14213D] transition-colors ml-2 cursor-pointer"
          >
            <Copy className="size-3.5" />
            <span>Copy</span>
          </button>
        </div>
      </section>

      {/* 3. SUGGESTED CONNECTIONS (At least 8 in column + centered see more button) */}
      <section className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_3px_14px_rgba(20,33,61,0.06)]">
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-xs font-bold text-[#14213D]">Suggested Connections</h3>
        </div>

        <div className="space-y-3.5">
          {SUGGESTED_PEERS.map((peer) => {
            const isConn = connected[peer.name]
            return (
              <div key={peer.name} className="flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  {peer.memberId ? (
                    <Link
                      to={`/profile/member/${peer.memberId}`}
                      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#14213D] text-xs font-bold text-white shadow-xs hover:ring-2 hover:ring-[#3F4FA0]/40 transition-all cursor-pointer"
                      title={`View ${peer.name}'s profile`}
                    >
                      {peer.initials}
                    </Link>
                  ) : (
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#14213D] text-xs font-bold text-white shadow-xs">
                      {peer.initials}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    {peer.memberId ? (
                      <Link
                        to={`/profile/member/${peer.memberId}`}
                        className="truncate text-xs font-bold text-[#14213D] hover:text-[#3F4FA0] hover:underline block transition-colors cursor-pointer"
                        title={`View ${peer.name}'s profile`}
                      >
                        {peer.name}
                      </Link>
                    ) : (
                      <p className="truncate text-xs font-bold text-[#14213D]">{peer.name}</p>
                    )}
                    <p className="truncate text-[10px] text-[#64748B]">{peer.role} · {peer.company}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setConnected((prev) => ({ ...prev, [peer.name]: !prev[peer.name] }))
                    if (!isConn) toast.success(`Connection request sent to ${peer.name}`)
                  }}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold transition-all cursor-pointer ${
                    isConn
                      ? 'bg-slate-100 text-slate-500'
                      : 'border border-[#3F4FA0] text-[#3F4FA0] hover:bg-[#EEF0FA]'
                  }`}
                >
                  {isConn ? (
                    <>
                      <Check className="size-3 text-emerald-600" />
                      <span>Pending</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="size-3" />
                      <span>Connect</span>
                    </>
                  )}
                </button>
              </div>
            )
          })}
        </div>

        {/* Centered button redirecting to connections page */}
        <div className="pt-4 mt-3 border-t border-[#F1F5F9] flex justify-center">
          <Link
            to="/connections"
            className="inline-flex items-center justify-center rounded-full bg-[#EEF0FA] px-6 py-2 text-xs font-bold text-[#3F4FA0] hover:bg-[#3F4FA0] hover:text-white transition-all shadow-xs cursor-pointer"
          >
            See more
          </Link>
        </div>
      </section>
    </aside>
  )
}
