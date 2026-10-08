import { useState } from 'react'
import { Bookmark, Check, DollarSign } from 'lucide-react'
import { toast } from 'sonner'

type ZoneTab = 'funds' | 'startups' | 'investors' | 'theses'

interface TrackedItem {
  id: string
  name: string
  subtitle: string
  metrics: string
  badge: string
  badgeColor?: string
  initials: string
  avatar?: string
  type: 'fund' | 'startup' | 'investor' | 'thesis'
}

const VENTURE_FUNDS: TrackedItem[] = [
  {
    id: 'meridian',
    name: 'Meridian Ventures',
    subtitle: 'Venture Capital · Multi-Stage Lead Syndicate',
    metrics: '$65M AUM · 28 Deals · FinTech & B2B Rails',
    badge: 'Lead Syndicate',
    badgeColor: 'bg-indigo-50 text-[#3F4FA0] border-indigo-200',
    initials: 'MV',
    type: 'fund',
  },
  {
    id: 'indus',
    name: 'Indus Horizon Capital',
    subtitle: 'Early-Stage Institutional VC · Seed to Series A',
    metrics: '$45M AUM · 34 Portfolio Cos · Tech-Enabled',
    badge: 'Institutional LP',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    initials: 'IH',
    type: 'fund',
  },
  {
    id: 'falcon',
    name: 'Falcon Syndicate Desk',
    subtitle: 'Cross-Border SPVs & High-Conviction Angels',
    metrics: '$18M Deployed · 42 Angel LPs · Fast Covenants',
    badge: 'Active SPVs',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    initials: 'FS',
    type: 'fund',
  },
  {
    id: 'apex',
    name: 'Apex Capital Syndicate',
    subtitle: 'B2B Software, Climate & Supply Chain Infrastructure',
    metrics: '$40M AUM · 22 Investments · Lead Allocator',
    badge: 'Co-Investment Desk',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    initials: 'AC',
    type: 'fund',
  },
]

const ACTIVE_STARTUPS: TrackedItem[] = [
  {
    id: 'agriflow',
    name: 'AgriFlow Technologies',
    subtitle: 'Agritech IoT & Cold-Chain Telemetry Rails',
    metrics: 'Seeking $1.2M Seed · $480K ARR (3.2x YoY) · 40% Committed',
    badge: 'Active Deal Room',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    initials: 'AF',
    type: 'startup',
  },
  {
    id: 'medscale',
    name: 'MedScale AI',
    subtitle: 'Clinical Workflow AI & Hospital Interoperability',
    metrics: '$3M Pre-Series A · 18 Hospital Enterprise Pilots',
    badge: 'Due Diligence Open',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    initials: 'MS',
    type: 'startup',
  },
  {
    id: 'nexusfin',
    name: 'NexusFin Global',
    subtitle: 'Programmable Cross-Border Settlement & Escrow',
    metrics: 'PKR 45M Seed Closed · $3.2M Monthly Settlement GMV',
    badge: 'Oversubscribed',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    initials: 'NF',
    type: 'startup',
  },
  {
    id: 'solargrid',
    name: 'SolarGrid Energy',
    subtitle: 'Modular Distributed Energy Hardware & Micro-Grids',
    metrics: 'Pre-A Round · Commercial Pilot Live · Hardware Moat',
    badge: 'Strategic Allocation',
    badgeColor: 'bg-indigo-50 text-[#3F4FA0] border-indigo-200',
    initials: 'SG',
    type: 'startup',
  },
]

const ANGEL_INVESTORS: TrackedItem[] = [
  {
    id: 'marcus_v',
    name: 'Marcus Vance',
    subtitle: 'Managing Partner at Meridian Ventures · Verified LP',
    metrics: 'Check Size: $100K–$500K · 24 Bilateral Deals Backed',
    badge: 'Verified Lead',
    badgeColor: 'bg-[#FEF3D8] text-[#B45309] border-[#F5B544]/50',
    initials: 'MV',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    type: 'investor',
  },
  {
    id: 'sarah_j',
    name: 'Sarah Jenkins',
    subtitle: 'Global Syndicate Lead · Climate Tech & FinTech Angel',
    metrics: 'Check Size: $25K–$100K · 18 Portfolio Investments',
    badge: 'Operator Angel',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    initials: 'SJ',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    type: 'investor',
  },
  {
    id: 'tariq_m',
    name: 'Tariq Malik',
    subtitle: 'Serial Fintech Founder & Angel Allocator',
    metrics: 'Check Size: $50K–$150K · 8 Exits & Co-Investments',
    badge: 'Exited Founder',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    initials: 'TM',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    type: 'investor',
  },
  {
    id: 'dr_aamir',
    name: 'Dr Aamir Mehmood',
    subtitle: 'Chief AI Architect at HealthBridge · DeepTech Angel',
    metrics: 'Check Size: $25K–$75K · Technical Diligence Advisor',
    badge: 'Technical LP',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    initials: 'AM',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    type: 'investor',
  },
]

const MARKET_THESES: TrackedItem[] = [
  {
    id: 'ag_logistics',
    name: 'Cold-Chain IoT & Perishable Logistics',
    subtitle: 'Solving the $2.4B post-harvest wastage in South Asia',
    metrics: '$18.4M Total Deployed · 8 Open Deals · 3.4x YoY Growth',
    badge: 'High Velocity Thesis',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    initials: 'AG',
    type: 'thesis',
  },
  {
    id: 'crossborder_fx',
    name: 'B2B Cross-Border Settlement & Escrow',
    subtitle: 'Replacing legacy SWIFT correspondent banking rails',
    metrics: '$32.0M Total Volume · 12 Deals · Instant Clearing',
    badge: 'Institutional Demand',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    initials: 'FX',
    type: 'thesis',
  },
  {
    id: 'clinical_ai',
    name: 'Clinical Diagnostics & Hospital Interop',
    subtitle: 'Responsible AI copilots integrated into hospital EMRs',
    metrics: '$14.2M Capital Deployed · 6 Emerging Seed Cohorts',
    badge: 'Strong IP Moat',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    initials: 'AI',
    type: 'thesis',
  },
  {
    id: 'clean_energy',
    name: 'Distributed Commercial Battery Storage',
    subtitle: 'Modular smart hardware mitigating industrial peak tariffs',
    metrics: '$21.5M Deployed · 5 Pilot Companies · Clean Tech',
    badge: 'Infrastructure Play',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    initials: 'ES',
    type: 'thesis',
  },
]

export function ProfileInterestsCard() {
  const [activeTab, setActiveTab] = useState<ZoneTab>('investors')
  const [trackingMap, setTrackingMap] = useState<Record<string, boolean>>({
    meridian: true,
    indus: true,
    agriflow: true,
    marcus_v: true,
    ag_logistics: true,
  })

  function toggleTrack(item: TrackedItem) {
    const isCurrentlyTracked = !!trackingMap[item.id]
    setTrackingMap((prev) => ({
      ...prev,
      [item.id]: !isCurrentlyTracked,
    }))

    if (isCurrentlyTracked) {
      toast.info(`Removed ${item.name} from your tracked deal flow`)
    } else {
      toast.success(`Now tracking ${item.name}`)
    }
  }

  const items: TrackedItem[] =
    activeTab === 'investors'
      ? ANGEL_INVESTORS
      : activeTab === 'funds'
      ? VENTURE_FUNDS
      : activeTab === 'startups'
      ? ACTIVE_STARTUPS
      : MARKET_THESES

  return (
    <article className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-[0_3px_14px_rgba(20,33,61,0.06)]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
        <h2 className="text-base font-bold text-[#14213D]">
          Tracked Interests
        </h2>
      </div>
      <p className="text-xs text-[#64748B] mb-4">
        Tracked investors, venture funds, active startups & market theses.
      </p>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 [scrollbar-width:none]">
        <button
          type="button"
          onClick={() => setActiveTab('investors')}
          className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'investors'
              ? 'bg-[#14213D] text-[#F5B544] shadow-xs'
              : 'border border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC]'
          }`}
        >
          Investors
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('funds')}
          className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'funds'
              ? 'bg-[#14213D] text-[#F5B544] shadow-xs'
              : 'border border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC]'
          }`}
        >
          Venture Funds
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('startups')}
          className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'startups'
              ? 'bg-[#14213D] text-[#F5B544] shadow-xs'
              : 'border border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC]'
          }`}
        >
          Active Startups
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('theses')}
          className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'theses'
              ? 'bg-[#14213D] text-[#F5B544] shadow-xs'
              : 'border border-[#CBD5E1] bg-white text-[#334155] hover:bg-[#F8FAFC]'
          }`}
        >
          Market Theses
        </button>
      </div>

      {/* Grid of Tracked Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {items.map((item) => {
          const isTracked = !!trackingMap[item.id]

          return (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-[#F8FAFC]/60 p-4 transition-all hover:border-[#3F4FA0]/60 hover:bg-white hover:shadow-xs"
            >
              <div className="flex items-start gap-3 min-w-0">
                {/* Emblem / Avatar */}
                {item.avatar ? (
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100 shadow-2xs">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="size-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#14213D] to-[#3F4FA0] text-xs font-bold text-[#F5B544] shadow-2xs">
                    {item.initials}
                  </div>
                )}

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-xs sm:text-sm font-bold text-[#14213D] truncate max-w-[190px]">
                      {item.name}
                    </h3>
                    <span
                      className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[9px] font-bold ${
                        item.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#475569] truncate mt-0.5" title={item.subtitle}>
                    {item.subtitle}
                  </p>

                  <div className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-[#14213D] bg-white border border-[#E2E8F0] px-2 py-0.5 rounded-md inline-flex max-w-full truncate">
                    <DollarSign className="size-3 text-emerald-600 shrink-0" />
                    <span className="truncate">{item.metrics}</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 mt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                <span className="text-[10px] text-[#94A3B8] font-medium">
                  {item.type === 'fund'
                    ? 'Syndicate Deal Flow'
                    : item.type === 'startup'
                    ? 'Seed / Series A Memo'
                    : item.type === 'investor'
                    ? 'Direct Allocation Desk'
                    : 'Sector Macro Telemetry'}
                </span>

                <button
                  type="button"
                  onClick={() => toggleTrack(item)}
                  className={`inline-flex items-center gap-1 rounded-full px-3.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                    isTracked
                      ? 'border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      : 'border border-[#3F4FA0] bg-[#EEF0FA] text-[#3F4FA0] hover:bg-[#3F4FA0] hover:text-white'
                  }`}
                >
                  {isTracked ? (
                    <>
                      <Check className="size-3 text-emerald-600" />
                      <span>Tracked</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="size-3" />
                      <span>Track {item.type === 'investor' ? 'Mandate' : 'Deal'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </article>
  )
}
