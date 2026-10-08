import { useState } from 'react'
import { Calendar, Sparkles, Trophy, X } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useProfileStore } from '../useProfileStore'
import type { MilestoneItem } from '../types'

interface AddMilestoneModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editItem?: MilestoneItem | null
}

export function AddMilestoneModal({ open, onOpenChange, editItem }: AddMilestoneModalProps) {
  const addMilestone = useProfileStore((state) => state.addMilestone)
  const updateMilestone = useProfileStore((state) => state.updateMilestone)

  const [title, setTitle] = useState(editItem?.title || '')
  const [category, setCategory] = useState<MilestoneItem['category']>(editItem?.category || 'funding')
  const [date, setDate] = useState(editItem?.date || '')
  const [metric, setMetric] = useState(editItem?.metric || '')
  const [description, setDescription] = useState(editItem?.description || '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Please enter a milestone title')
      return
    }

    const item: MilestoneItem = {
      id: editItem?.id || `m-${Date.now()}`,
      title: title.trim(),
      category,
      date: date.trim() || '2026',
      metric: metric.trim() || undefined,
      description: description.trim() || undefined,
    }

    if (editItem) {
      updateMilestone(item)
      toast.success('Milestone updated!')
    } else {
      addMilestone(item)
      toast.success('Success milestone added to your profile!')
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[94vw] !max-w-[580px] max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-0 shadow-2xl [&>button]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F1F5F9] px-6 py-4">
          <div className="flex items-center gap-2">
            <Trophy className="size-5 text-[#F5B544]" />
            <DialogTitle className="text-base font-bold text-[#14213D]">
              {editItem ? 'Edit Success Milestone' : 'Add Success Milestone & Achievement'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 [scrollbar-width:thin]">
          <div>
            <label className="block text-xs font-bold text-[#14213D] mb-1">Milestone Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. $2.4M Series A Secured or 100% Allocation Met"
              className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#14213D] mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MilestoneItem['category'])}
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none"
              >
                <option value="funding">💰 Funding / Capital Closed</option>
                <option value="traction">📈 Traction & Revenue Growth</option>
                <option value="partnership">🤝 Strategic Partnership</option>
                <option value="product">🚀 Product Launch / Patent</option>
                <option value="award">🏆 Award & Recognition</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#14213D] mb-1 flex items-center gap-1">
                <Calendar className="size-3.5 text-[#64748B]" />
                <span>Date Achieved</span>
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. Oct 2026"
                className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#14213D] mb-1 flex items-center gap-1">
              <Sparkles className="size-3.5 text-[#F5B544]" />
              <span>Key Metric / Impact Tag</span>
            </label>
            <input
              type="text"
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              placeholder="e.g. $1.2M Target or 3.2x YoY Growth or 14K Farmers"
              className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#14213D] mb-1">Description & Context</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Share the significance of this milestone for your company or fund..."
              className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none resize-none"
            />
          </div>

          {/* Footer */}
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
              className="rounded-full bg-[#14213D] px-6 py-2 text-xs font-bold text-[#F5B544] hover:bg-[#233866] transition-colors"
            >
              {editItem ? 'Save Milestone' : 'Post Milestone'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
