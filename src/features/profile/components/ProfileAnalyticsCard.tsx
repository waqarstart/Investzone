import { BarChart2, Eye, Search, Users } from 'lucide-react'
import { toast } from 'sonner'

export function ProfileAnalyticsCard() {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-[0_3px_14px_rgba(20,33,61,0.06)]">
      {/* Title & Private Indicator */}
      <h2 className="text-base font-bold text-[#14213D]">Analytics</h2>
      <div className="flex items-center gap-1.5 text-xs text-[#64748B] mt-0.5 mb-4">
        <Eye className="size-3.5 text-[#64748B]" />
        <span>Private to you</span>
      </div>

      {/* Analytics 3 Column Row (LinkedIn Exact Format) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 pt-1">
        {/* 1. Profile views */}
        <div
          onClick={() => toast.info('145 people viewed your profile recently')}
          className="flex items-start gap-3 group cursor-pointer"
        >
          <Users className="size-5 shrink-0 text-[#14213D] mt-0.5" />
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[#14213D] group-hover:text-[#0a66c2] group-hover:underline transition-colors">
              145 profile views
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
              Discover who&apos;s viewed your profile.
            </p>
          </div>
        </div>

        {/* 2. Post impressions */}
        <div
          onClick={() => toast.info('Your posts gained 110 impressions in the past 7 days')}
          className="flex items-start gap-3 group cursor-pointer"
        >
          <BarChart2 className="size-5 shrink-0 text-[#14213D] mt-0.5" />
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[#14213D] group-hover:text-[#0a66c2] group-hover:underline transition-colors">
              110 post impressions
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
              Check out who&apos;s engaging with your posts.
            </p>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">Past 7 days</p>
          </div>
        </div>

        {/* 3. Search appearances */}
        <div
          onClick={() => toast.info('You appeared in 9 search results this week')}
          className="flex items-start gap-3 group cursor-pointer"
        >
          <Search className="size-5 shrink-0 text-[#14213D] mt-0.5" />
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[#14213D] group-hover:text-[#0a66c2] group-hover:underline transition-colors">
              9 search appearances
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">
              See how often you appear in search results.
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
