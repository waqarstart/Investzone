import { useState } from 'react'
import { Edit3 } from 'lucide-react'
import { useProfileStore } from '../useProfileStore'
import { EditAboutModal } from './EditAboutModal'

export function ProfileAboutCard() {
  const profile = useProfileStore((state) => state.profile)
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <article className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-[0_3px_14px_rgba(20,33,61,0.06)]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-[#14213D]">About</h2>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            title="Edit about summary"
            className="flex size-8 items-center justify-center rounded-full text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#14213D] transition-colors cursor-pointer"
          >
            <Edit3 className="size-4" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-[#334155] leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
          {profile.bio || 'No summary added yet. Click edit to add your founder journey or investment focus.'}
        </p>
      </article>

      <EditAboutModal open={modalOpen} onOpenChange={setModalOpen} />
    </>
  )
}
