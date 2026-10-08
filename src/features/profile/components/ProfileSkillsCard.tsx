import { useState } from 'react'
import { Check, Plus, Tag, X } from 'lucide-react'
import { toast } from 'sonner'
import { useProfileStore } from '../useProfileStore'

export function ProfileSkillsCard() {
  const profile = useProfileStore((state) => state.profile)
  const addSkill = useProfileStore((state) => state.addSkill)
  const removeSkill = useProfileStore((state) => state.removeSkill)
  const [newSkill, setNewSkill] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  function handleAdd() {
    if (!newSkill.trim()) return
    addSkill(newSkill.trim())
    setNewSkill('')
    setIsAdding(false)
    toast.success('Skill added to profile')
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-[0_3px_14px_rgba(20,33,61,0.06)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-[#14213D]">Skills & Endorsements</h2>
          <span className="rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-bold text-[#3730A3]">
            {profile.skills.length} Endorsed
          </span>
        </div>

        {!isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1 text-xs font-semibold text-[#3F4FA0] hover:underline cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Add skill</span>
          </button>
        )}
      </div>

      {/* Add Skill Input Form */}
      {isAdding && (
        <div className="flex items-center gap-2 mb-4 p-2.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC]">
          <Tag className="size-4 text-[#64748B] shrink-0" />
          <input
            type="text"
            autoFocus
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                handleAdd()
              } else if (e.key === 'Escape') {
                setIsAdding(false)
              }
            }}
            placeholder="e.g. Term Sheet Structuring or B2B SaaS"
            className="flex-1 bg-transparent text-xs text-[#14213D] focus:outline-none placeholder:text-[#94A3B8]"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="rounded-lg bg-[#3F4FA0] text-white p-1.5 hover:bg-[#2e3b80] transition-colors"
          >
            <Check className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="rounded-lg text-[#64748B] p-1.5 hover:bg-slate-200 transition-colors"
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Skills Badges Strip */}
      <div className="flex flex-wrap gap-2">
        {profile.skills.map((skill) => (
          <div
            key={skill}
            className="group flex items-center gap-1.5 rounded-xl border border-[#DDE3FA] bg-[#F5F7FF] px-3 py-1.5 text-xs font-semibold text-[#14213D] hover:border-[#3F4FA0] hover:bg-white transition-all shadow-2xs"
          >
            <span>{skill}</span>
            <button
              type="button"
              onClick={() => {
                removeSkill(skill)
                toast.info(`Removed ${skill}`)
              }}
              className="text-[#94A3B8] hover:text-[#EF4444] opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded"
              aria-label={`Remove ${skill}`}
            >
              <X className="size-3" />
            </button>
          </div>
        ))}
      </div>
    </article>
  )
}
