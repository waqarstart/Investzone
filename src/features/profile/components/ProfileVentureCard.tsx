import { useState } from 'react'
import {
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  Coins,
  DollarSign,
  FileCheck2,
  Lock,
  PieChart,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'
import { toast } from 'sonner'
import { useProfileStore } from '../useProfileStore'

export function ProfileVentureCard() {
  const profile = useProfileStore((state) => state.profile)
  const isFounder = profile.role === 'founder'
  const [requested, setRequested] = useState(false)
  const [requesting, setRequesting] = useState(false)

  function handleRequestDeal() {
    if (requested || requesting) return
    setRequesting(true)
    setTimeout(() => {
      setRequesting(false)
      setRequested(true)
      toast.success(isFounder ? 'Data Vault access requested' : 'Syndicate inquiry submitted')
    }, 600)
  }

  if (isFounder) {
    return (
      <article className="overflow-hidden rounded-2xl border border-[#DDE3FA] bg-gradient-to-br from-white via-[#F5F7FF] to-[#EFF3FF] p-5 sm:p-6 shadow-[0_3px_14px_rgba(20,33,61,0.06)] relative">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#F5B544] text-[#14213D] font-bold">
              <Building2 className="size-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#14213D]">
                {profile.startupName || 'AgriFlow Technologies'}
              </h2>
              <p className="text-[11px] text-[#64748B]">
                {profile.startupIndustry || 'Agritech B2B Supply Chain SaaS'} · {profile.startupStage || 'Seed Stage'}
              </p>
            </div>
          </div>

          <span className="rounded-full bg-[#14213D] px-3 py-1 text-[10px] font-extrabold text-[#F5B544] tracking-wider uppercase">
            Live Funding Round
          </span>
        </div>

        {/* 4 Metric Boxes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
          <div className="rounded-xl border border-[#CBD5E1]/60 bg-white p-3 shadow-2xs">
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
              <DollarSign className="size-3 text-[#3F4FA0]" />
              <span>Target Raise</span>
            </span>
            <p className="mt-1 text-base font-extrabold text-[#14213D]">{profile.targetRaise || '$1.2M'}</p>
            <p className="text-[10px] text-[#64748B]">{profile.valuationCap || '$6.0M Cap'}</p>
          </div>

          <div className="rounded-xl border border-[#CBD5E1]/60 bg-white p-3 shadow-2xs">
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
              <FileCheck2 className="size-3 text-emerald-600" />
              <span>Lead Committed</span>
            </span>
            <p className="mt-1 text-base font-extrabold text-emerald-700">{profile.leadCommitted || '40%'}</p>
            <p className="text-[10px] text-[#64748B]">Institutional Lead</p>
          </div>

          <div className="rounded-xl border border-[#CBD5E1]/60 bg-white p-3 shadow-2xs">
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
              <TrendingUp className="size-3 text-[#F5B544]" />
              <span>Current ARR</span>
            </span>
            <p className="mt-1 text-base font-extrabold text-[#14213D]">{profile.currentArr || '$480K'}</p>
            <p className="text-[10px] text-emerald-600 font-semibold">{profile.yoyGrowth || '3.2x YoY'}</p>
          </div>

          <div className="rounded-xl border border-[#CBD5E1]/60 bg-white p-3 shadow-2xs">
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
              <ShieldCheck className="size-3 text-[#3F4FA0]" />
              <span>Due Diligence</span>
            </span>
            <p className="mt-1 text-base font-extrabold text-[#3F4FA0]">Audited</p>
            <p className="text-[10px] text-[#64748B]">Covenants Verified</p>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#DDE3FA]">
          <div className="flex items-center gap-2 text-xs text-[#475569]">
            <Lock className="size-3.5 text-[#3F4FA0]" />
            <span>Confidential Bilateral Data Vault & Escrow Protocol</span>
          </div>

          <button
            type="button"
            disabled={requested || requesting}
            onClick={handleRequestDeal}
            className="flex items-center justify-center gap-1.5 rounded-full bg-[#14213D] hover:bg-[#233866] text-white px-5 py-2 text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-75"
          >
            {requesting ? (
              <span>Requesting Access…</span>
            ) : requested ? (
              <>
                <Check className="size-4 text-[#F5B544]" />
                <span>Access Requested</span>
              </>
            ) : (
              <>
                <span>Request Deal Room Access</span>
                <ArrowRight className="size-3.5 text-[#F5B544]" />
              </>
            )}
          </button>
        </div>
      </article>
    )
  }

  // Investor Syndicate Mandate Card
  return (
    <article className="overflow-hidden rounded-2xl border border-[#DDE3FA] bg-gradient-to-br from-white via-[#F5F7FF] to-[#EFF3FF] p-5 sm:p-6 shadow-[0_3px_14px_rgba(20,33,61,0.06)] relative">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#3F4FA0] text-white font-bold">
            <Briefcase className="size-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#14213D]">
              {profile.fundName || 'Apex Capital Syndicate'}
            </h2>
            <p className="text-[11px] text-[#64748B]">
              Venture Syndicate Mandate · {profile.investmentStage || 'Seed to Series A'}
            </p>
          </div>
        </div>

        <span className="rounded-full bg-[#EEF2FF] px-3 py-1 text-[10px] font-extrabold text-[#3730A3] tracking-wider uppercase">
          Active Deployment Desk
        </span>
      </div>

      {/* 4 Metric Boxes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        <div className="rounded-xl border border-[#CBD5E1]/60 bg-white p-3 shadow-2xs">
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
            <Coins className="size-3 text-[#3F4FA0]" />
            <span>Total AUM</span>
          </span>
          <p className="mt-1 text-base font-extrabold text-[#14213D]">{profile.fundAum || '$40M AUM'}</p>
          <p className="text-[10px] text-[#64748B]">Active Tranches</p>
        </div>

        <div className="rounded-xl border border-[#CBD5E1]/60 bg-white p-3 shadow-2xs">
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
            <DollarSign className="size-3 text-emerald-600" />
            <span>Check Size</span>
          </span>
          <p className="mt-1 text-base font-extrabold text-emerald-700">{profile.checkSize || '$50K - $500K'}</p>
          <p className="text-[10px] text-[#64748B]">Pre-Seed to Series A</p>
        </div>

        <div className="rounded-xl border border-[#CBD5E1]/60 bg-white p-3 shadow-2xs">
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
            <PieChart className="size-3 text-[#F5B544]" />
            <span>Syndicate Terms</span>
          </span>
          <p className="mt-1 text-base font-extrabold text-[#14213D]">{profile.syndicateCarry || '15% Carry'}</p>
          <p className="text-[10px] text-[#64748B]">SPV Co-investment</p>
        </div>

        <div className="rounded-xl border border-[#CBD5E1]/60 bg-white p-3 shadow-2xs">
          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
            <ShieldCheck className="size-3 text-[#3F4FA0]" />
            <span>Accreditation</span>
          </span>
          <p className="mt-1 text-base font-extrabold text-[#3F4FA0]">Verified LP</p>
          <p className="text-[10px] text-[#64748B]">Tier-1 SEC / KYC</p>
        </div>
      </div>

      {/* CTA Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#DDE3FA]">
        <div className="flex items-center gap-2 text-xs text-[#475569]">
          <Briefcase className="size-3.5 text-[#3F4FA0]" />
          <span>Open for Founder Pitch Memos & LP Syndicate Co-investors</span>
        </div>

        <button
          type="button"
          disabled={requested || requesting}
          onClick={handleRequestDeal}
          className="flex items-center justify-center gap-1.5 rounded-full bg-[#14213D] hover:bg-[#233866] text-white px-5 py-2 text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-75"
        >
          {requesting ? (
            <span>Submitting…</span>
          ) : requested ? (
            <>
              <Check className="size-4 text-[#F5B544]" />
              <span>Inquiry Sent</span>
            </>
          ) : (
            <>
              <span>Submit Deal Memo / Inquiry</span>
              <ArrowRight className="size-3.5 text-[#F5B544]" />
            </>
          )}
        </button>
      </div>
    </article>
  )
}
