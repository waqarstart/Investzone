import { motion, useReducedMotion } from 'motion/react'
import { Check, Plus } from 'lucide-react'
import { cn } from 'cn'
import { CARD_SHADOW, CARD_SHADOW_HOVER } from '../data'
import type { Show } from '../types'

interface ShowCardProps {
  show: Show
  followed: boolean
  index: number
  onToggle: () => void
}

export function ShowCard({ show, followed, index, onToggle }: ShowCardProps) {
  const reduced = useReducedMotion()
  const Icon = show.icon

  return (
    <motion.article
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index, 7) * 0.05, ease: 'easeOut' }}
      className={cn(
        'flex min-w-0 flex-col items-center rounded-2xl border p-4 text-center transition-all duration-200',
        followed ? 'border-[#F5B544] bg-[#FEF3D8]' : 'border-[#E5E7EB] bg-white hover:-translate-y-0.5',
        CARD_SHADOW,
        followed ? '' : CARD_SHADOW_HOVER,
      )}
    >
      <span
        className={cn(
          'grid size-16 shrink-0 place-items-center rounded-2xl',
          followed ? 'bg-[#F5B544] text-[#14213D]' : 'bg-[#14213D] text-[#F5B544]',
        )}
      >
        <Icon className="size-7" />
      </span>
      <span className="mt-3 line-clamp-2 w-full text-[13px] leading-snug font-semibold text-[#14213D]">
        {show.name}
      </span>
      <span className="mt-1 w-full truncate text-[12px] text-[#94A3B8]">{show.host}</span>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={followed}
        className={cn(
          'mt-4 flex h-9 w-full shrink-0 items-center justify-center gap-1.5 rounded-lg border text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F4FA0]',
          followed
            ? 'border-[#E5E7EB] bg-white/70 text-[#64748B] hover:bg-white'
            : 'border-[#3F4FA0] bg-white text-[#3F4FA0] hover:bg-[#EEF0FA]',
        )}
      >
        {followed ? <Check className="size-3.5" /> : <Plus className="size-3.5" />}
        {followed ? 'Following' : 'Follow'}
      </button>
    </motion.article>
  )
}
