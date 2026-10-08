import { useState } from 'react'
import { Edit3, MapPin, Plus, Sparkles, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useProfileStore } from '../useProfileStore'
import { AddExperienceModal } from './AddExperienceModal'
import type { ExperienceItem } from '../types'

export function ProfileExperienceCard() {
  const profile = useProfileStore((state) => state.profile)
  const deleteExperience = useProfileStore((state) => state.deleteExperience)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ExperienceItem | null>(null)

  function handleEdit(item: ExperienceItem) {
    setSelectedItem(item)
    setModalOpen(true)
  }

  function handleAdd() {
    setSelectedItem(null)
    setModalOpen(true)
  }

  function handleDelete(id: string) {
    deleteExperience(id)
    toast.success('Experience removed')
  }

  return (
    <>
      <article className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-[0_3px_14px_rgba(20,33,61,0.06)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#14213D]">Experience & Track Record</h2>
            <span className="rounded-full bg-[#FEF3D8] px-2 py-0.5 text-[10px] font-bold text-[#92400E]">
              {profile.experiences.length} Ventures
            </span>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1 text-xs font-semibold text-[#3F4FA0] hover:underline cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Add experience</span>
          </button>
        </div>

        {/* Timeline Items */}
        <div className="divide-y divide-[#F1F5F9] space-y-4">
          {profile.experiences.map((exp, idx) => (
            <div key={exp.id} className={idx > 0 ? 'pt-4' : ''}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3.5 min-w-0">
                  {/* Company Logo / Placeholder */}
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#14213D] text-white font-bold text-sm shadow-xs">
                    {exp.company[0] || 'B'}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-[#14213D] leading-snug">
                      {exp.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#475569] mt-0.5">
                      {exp.company}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-[#94A3B8] flex-wrap mt-0.5">
                      <span>
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                      {exp.location && (
                        <>
                          <span>·</span>
                          <span className="flex items-center gap-0.5">
                            <MapPin className="size-3" />
                            <span>{exp.location}</span>
                          </span>
                        </>
                      )}
                    </div>

                    {exp.metrics && (
                      <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-[#F5F7FF] border border-[#DDE3FA] px-2 py-0.5 text-[11px] font-bold text-[#3F4FA0]">
                        <Sparkles className="size-3 text-[#F5B544]" />
                        <span>{exp.metrics}</span>
                      </div>
                    )}

                    <p className="mt-2 text-xs text-[#334155] leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                      {exp.description}
                    </p>
                  </div>
                </div>

                {/* Edit & Delete Icons */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleEdit(exp)}
                    title="Edit experience"
                    className="p-1 rounded-full text-[#94A3B8] hover:bg-slate-100 hover:text-[#14213D] transition-colors"
                  >
                    <Edit3 className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(exp.id)}
                    title="Remove experience"
                    className="p-1 rounded-full text-[#94A3B8] hover:bg-red-50 hover:text-[#EF4444] transition-colors"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </article>

      <AddExperienceModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        editItem={selectedItem}
      />
    </>
  )
}
