import { useState } from 'react'
import { Briefcase, Building2, Calendar, MapPin, X } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useProfileStore } from '../useProfileStore'
import type { ExperienceItem } from '../types'

interface AddExperienceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editItem?: ExperienceItem | null
}

export function AddExperienceModal({ open, onOpenChange, editItem }: AddExperienceModalProps) {
  const addExperience = useProfileStore((state) => state.addExperience)
  const updateExperience = useProfileStore((state) => state.updateExperience)

  const [title, setTitle] = useState(editItem?.title || '')
  const [company, setCompany] = useState(editItem?.company || '')
  const [location, setLocation] = useState(editItem?.location || '')
  const [startDate, setStartDate] = useState(editItem?.startDate || '')
  const [endDate, setEndDate] = useState(editItem?.endDate || '')
  const [current, setCurrent] = useState(editItem?.current ?? true)
  const [description, setDescription] = useState(editItem?.description || '')
  const [metrics, setMetrics] = useState(editItem?.metrics || '')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !company.trim()) {
      toast.error('Please fill in title and company name')
      return
    }

    const item: ExperienceItem = {
      id: editItem?.id || `exp-${Date.now()}`,
      title: title.trim(),
      company: company.trim(),
      location: location.trim() || undefined,
      startDate: startDate.trim() || '2024',
      endDate: current ? undefined : endDate.trim() || 'Present',
      current,
      description: description.trim(),
      metrics: metrics.trim() || undefined,
    }

    if (editItem) {
      updateExperience(item)
      toast.success('Experience updated successfully')
    } else {
      addExperience(item)
      toast.success('New experience added')
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[94vw] !max-w-[620px] max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-0 shadow-2xl [&>button]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#F1F5F9] px-6 py-4">
          <div className="flex items-center gap-2">
            <Briefcase className="size-5 text-[#3F4FA0]" />
            <DialogTitle className="text-base font-bold text-[#14213D]">
              {editItem ? 'Edit Experience' : 'Add Work & Venture Experience'}
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

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 [scrollbar-width:thin]">
          <div>
            <label className="block text-xs font-bold text-[#14213D] mb-1">Title / Role *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Co-Founder & CTO or Managing Partner"
              className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#14213D] mb-1 flex items-center gap-1">
              <Building2 className="size-3.5 text-[#64748B]" />
              <span>Company / Startup / Fund *</span>
            </label>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. AgriFlow Technologies or Apex Syndicate"
              className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#14213D] mb-1 flex items-center gap-1">
              <MapPin className="size-3.5 text-[#64748B]" />
              <span>Location</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Karachi, Pakistan · Hybrid"
              className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
            />
          </div>

          {/* Dates and Current check */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <input
                id="current-check"
                type="checkbox"
                checked={current}
                onChange={(e) => setCurrent(e.target.checked)}
                className="size-4 rounded border-slate-300 text-[#3F4FA0] focus:ring-[#3F4FA0]"
              />
              <label htmlFor="current-check" className="text-xs font-semibold text-[#14213D] cursor-pointer">
                I am currently working in this role / venture
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] mb-1 flex items-center gap-1">
                  <Calendar className="size-3" />
                  <span>Start Date *</span>
                </label>
                <input
                  type="text"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="e.g. Jan 2024"
                  className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-1.5 text-xs text-[#14213D]"
                />
              </div>

              {!current && (
                <div>
                  <label className="block text-[11px] font-semibold text-[#64748B] mb-1 flex items-center gap-1">
                    <Calendar className="size-3" />
                    <span>End Date</span>
                  </label>
                  <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="e.g. Dec 2024"
                    className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-1.5 text-xs text-[#14213D]"
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#14213D] mb-1">
              Key Metrics & Highlights (Funding / ARR / AUM)
            </label>
            <input
              type="text"
              value={metrics}
              onChange={(e) => setMetrics(e.target.value)}
              placeholder="e.g. Raised $1.2M Seed · Scaled to $480K ARR"
              className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#14213D] mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail your responsibilities, technical architecture, or capital allocation strategy..."
              className="w-full rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs text-[#14213D] focus:border-[#3F4FA0] focus:outline-none focus:ring-2 focus:ring-[#3F4FA0]/20 resize-none"
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
              {editItem ? 'Save Updates' : 'Add Experience'}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
