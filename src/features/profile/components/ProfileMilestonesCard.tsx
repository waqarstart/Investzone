import { useState } from 'react'
import {
  Coins,
  Edit3,
  Handshake,
  Plus,
  Rocket,
  Sparkles,
  Trash2,
  TrendingUp,
  Trophy,
} from 'lucide-react'
import { toast } from 'sonner'
import { useProfileStore } from '../useProfileStore'
import { AddMilestoneModal } from './AddMilestoneModal'
import type { MilestoneItem } from '../types'

function getCategoryIcon(cat: MilestoneItem['category']) {
  switch (cat) {
    case 'funding':
      return <Coins className="size-4 text-[#F5B544]" />
    case 'traction':
      return <TrendingUp className="size-4 text-emerald-600" />
    case 'partnership':
      return <Handshake className="size-4 text-[#3F4FA0]" />
    case 'product':
      return <Rocket className="size-4 text-purple-600" />
    case 'award':
      return <Trophy className="size-4 text-[#F5B544]" />
    default:
      return <Sparkles className="size-4 text-[#F5B544]" />
  }
}

const DEFAULT_FALLBACK_MILESTONES: MilestoneItem[] = [
  {
    id: 'm-1',
    title: '$1.2M Seed Round Target Opened',
    category: 'funding',
    date: 'Oct 2026',
    metric: '$480K Committed',
    description: '40% lead commitment secured from Meridian Ventures & Apex Syndicate.',
  },
  {
    id: 'm-2',
    title: 'Crossed $480K Annual Recurring Revenue',
    category: 'traction',
    date: 'Aug 2026',
    metric: '3.2x YoY Growth',
    description: 'Scaled telemetry nodes across 14,000+ farmer clusters and cold-chain hubs.',
  },
  {
    id: 'm-3',
    title: 'Commercial Telematics Partnership with AgriCorp',
    category: 'partnership',
    date: 'May 2026',
    metric: '4 Regional Hubs',
    description: 'Standardized automated escrow and IoT cold storage telemetry across Punjab and Sindh.',
  },
  {
    id: 'm-4',
    title: 'Winner: South Asia Climate Tech Innovation Award',
    category: 'award',
    date: 'Feb 2026',
    metric: 'Top AgTech 2026',
    description: 'Recognized for reducing agricultural post-harvest spoilage by 28%.',
  },
]

export function ProfileMilestonesCard() {
  const profile = useProfileStore((state) => state.profile)
  const deleteMilestone = useProfileStore((state) => state.deleteMilestone)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MilestoneItem | null>(null)

  const milestones =
    profile.milestones && profile.milestones.length > 0
      ? profile.milestones
      : DEFAULT_FALLBACK_MILESTONES

  function handleAdd() {
    setSelectedItem(null)
    setModalOpen(true)
  }

  function handleEdit(item: MilestoneItem) {
    setSelectedItem(item)
    setModalOpen(true)
  }

  function handleDelete(id: string) {
    deleteMilestone(id)
    toast.success('Milestone removed')
  }

  return (
    <>
      <article className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-[0_3px_14px_rgba(20,33,61,0.06)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-[#14213D]">Success Milestones</h2>

          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1 text-xs font-semibold text-[#3F4FA0] hover:underline cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Post milestone</span>
          </button>
        </div>

        {/* Milestone Cards Grid */}
        {milestones.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {milestones.map((item) => (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between rounded-xl border border-[#E2E8F0] bg-gradient-to-br from-white to-[#F8FAFC] p-4 hover:border-[#3F4FA0] hover:shadow-sm transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#14213D]/5 border border-[#14213D]/10">
                      {getCategoryIcon(item.category)}
                    </div>
                    <span className="text-[10px] font-semibold text-[#94A3B8]">{item.date}</span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-[#14213D] leading-snug break-words [overflow-wrap:anywhere]">
                    {item.title}
                  </h3>

                  {item.description && (
                    <p className="mt-1 text-xs text-[#64748B] line-clamp-2 leading-relaxed break-words [overflow-wrap:anywhere]">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between pt-2.5 border-t border-[#F1F5F9]">
                  {item.metric ? (
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-bold text-[#3F4FA0]">
                      <Sparkles className="size-2.5 text-[#F5B544]" />
                      <span>{item.metric}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#94A3B8] uppercase font-bold tracking-wider">
                      {item.category}
                    </span>
                  )}

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      title="Edit milestone"
                      className="p-1 rounded text-[#94A3B8] hover:text-[#14213D] transition-colors"
                    >
                      <Edit3 className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      title="Delete milestone"
                      className="p-1 rounded text-[#94A3B8] hover:text-[#EF4444] transition-colors"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-slate-200 py-8 text-center text-xs text-slate-400">
            <Trophy className="mx-auto size-6 text-slate-300 mb-2" />
            <p className="font-semibold text-slate-600">No success milestones added yet.</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Post key funding rounds, ARR expansion, or award achievements.</p>
            <button
              type="button"
              onClick={handleAdd}
              className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#14213D] px-3.5 py-1.5 text-xs font-bold text-[#F5B544] hover:bg-[#233866] transition-colors cursor-pointer"
            >
              <Plus className="size-3" />
              <span>Add Your First Milestone</span>
            </button>
          </div>
        )}
      </article>

      <AddMilestoneModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editItem={selectedItem}
      />
    </>
  )
}
