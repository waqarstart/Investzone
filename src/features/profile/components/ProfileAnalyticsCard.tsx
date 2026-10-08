import { ArrowUpRight, Eye, LineChart, Search } from 'lucide-react'
import { toast } from 'sonner'

export function ProfileAnalyticsCard() {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-[0_3px_14px_rgba(20,33,61,0.06)]">
      {/* Title */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-bold text-[#14213D]">Analytics</h2>
      </div>
      <p className="text-xs text-[#64748B] mb-4">Past 90 days engagement telemetry</p>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Profile Views */}
        <div
          onClick={() => toast.info('142 founders and investors viewed your profile this month')}
          className="group rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 hover:border-[#3F4FA0] hover:bg-white transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-[#64748B] mb-1.5">
            <Eye className="size-4 text-[#3F4FA0]" />
            <span className="text-[10px] font-bold text-emerald-600 flex items-center">
              +18% <ArrowUpRight className="size-3" />
            </span>
          </div>
          <p className="text-lg font-bold text-[#14213D] tracking-tight">142</p>
          <p className="text-xs font-semibold text-[#475569] mt-0.5">Profile views</p>
          <p className="text-[10px] text-[#94A3B8] mt-1">Discover who viewed your mandate</p>
        </div>

        {/* Post Impressions */}
        <div
          onClick={() => toast.info('Your posts gained 2,480 impressions across feed')}
          className="group rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 hover:border-[#3F4FA0] hover:bg-white transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-[#64748B] mb-1.5">
            <LineChart className="size-4 text-[#F5B544]" />
            <span className="text-[10px] font-bold text-emerald-600 flex items-center">
              +32% <ArrowUpRight className="size-3" />
            </span>
          </div>
          <p className="text-lg font-bold text-[#14213D] tracking-tight">2,480</p>
          <p className="text-xs font-semibold text-[#475569] mt-0.5">Post impressions</p>
          <p className="text-[10px] text-[#94A3B8] mt-1">Check feed engagement & reach</p>
        </div>

        {/* Search Appearances */}
        <div
          onClick={() => toast.info('You appeared in 48 search queries for your sector')}
          className="group rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3.5 hover:border-[#3F4FA0] hover:bg-white transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between text-[#64748B] mb-1.5">
            <Search className="size-4 text-[#7C5CBF]" />
            <span className="text-[10px] font-bold text-emerald-600 flex items-center">
              +9% <ArrowUpRight className="size-3" />
            </span>
          </div>
          <p className="text-lg font-bold text-[#14213D] tracking-tight">48</p>
          <p className="text-xs font-semibold text-[#475569] mt-0.5">Search appearances</p>
          <p className="text-[10px] text-[#94A3B8] mt-1">See how often you appear in search</p>
        </div>
      </div>
    </article>
  )
}
