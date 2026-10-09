import { motion, useReducedMotion } from 'motion/react'
import { Bookmark, Play, Star } from 'lucide-react'
import { Avatar } from '@/components/common/Avatar'
import { RoleChip } from '@/components/common/RoleChip'
import { VerifiedMark } from '@/components/common/VerifiedMark'
import { cn } from 'cn'
import {
  CARD_SHADOW,
  CARD_SHADOW_HOVER,
  formatClock,
  formatPlays,
  formatPublishedDays,
} from '../data'
import type { Episode, PodcastRole } from '../types'
import { usePlayerStore } from '../usePlayerStore'

const AVATAR_TONES: Record<PodcastRole, 'indigo' | 'amber' | 'violet'> = {
  Investor: 'indigo',
  Founder: 'amber',
  'Legal Partner': 'violet',
}

interface EpisodeCardProps {
  episode: Episode
  index: number
}

export function EpisodeCard({ episode, index }: EpisodeCardProps) {
  const reduced = useReducedMotion()
  const play = usePlayerStore((state) => state.play)
  const saved = usePlayerStore((state) => state.saved)
  const toggleSaved = usePlayerStore((state) => state.toggleSaved)
  const isSaved = saved.some((item) => item.id === episode.id)

  function start() {
    play({
      id: episode.id,
      title: episode.title,
      host: episode.host,
      durationSeconds: episode.durationSeconds,
      icon: episode.icon,
      variant: episode.variant,
    })
  }

  function handleSave(e: React.MouseEvent) {
    e.stopPropagation()
    toggleSaved({
      id: episode.id,
      title: episode.title,
      host: episode.host,
      durationSeconds: episode.durationSeconds,
      icon: episode.icon,
      variant: episode.variant,
    })
  }

  return (
    <motion.div
      role="button"
      tabIndex={0}
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index, 11) * 0.05, ease: 'easeOut' }}
      onClick={start}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          start()
        }
      }}
      aria-label={`Play ${episode.title}`}
      className={cn(
        'group relative min-w-0 cursor-pointer overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D5DBE5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F4FA0]',
        CARD_SHADOW,
        CARD_SHADOW_HOVER,
      )}
    >
      <span className="relative block aspect-[16/9] w-full overflow-hidden bg-slate-900">
        <img
          src={`https://img.youtube.com/vi/${episode.youtubeId || 'dGl9kYq5KKs'}/hqdefault.jpg`}
          alt={episode.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30" />
        <span
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center transition-transform duration-200 group-hover:scale-110"
        >
          <span className="grid size-11 place-items-center rounded-full bg-red-600 text-white shadow-[0_4px_18px_rgba(0,0,0,0.5)]">
            <Play className="size-5 fill-current ml-0.5" />
          </span>
        </span>
        {/* Save / Bookmark Button */}
        <button
          type="button"
          onClick={handleSave}
          aria-label={isSaved ? `Remove ${episode.title} from saved` : `Save ${episode.title}`}
          title={isSaved ? 'Remove from saved' : 'Save video'}
          className={cn(
            'absolute top-2.5 right-2.5 z-20 grid size-8 place-items-center rounded-full transition-all duration-200 backdrop-blur-md cursor-pointer',
            isSaved
              ? 'bg-[#14213D]/95 text-[#F5B544] shadow-md ring-1 ring-[#F5B544]/60'
              : 'bg-[rgba(20,33,61,0.55)] text-white/80 hover:bg-[rgba(20,33,61,0.9)] hover:text-[#F5B544]',
          )}
        >
          <Bookmark className={cn('size-4', isSaved && 'fill-[#F5B544]')} />
        </button>

        <span className="absolute right-2 bottom-2 rounded-md bg-[rgba(20,33,61,0.75)] px-1.5 py-0.5 font-mono text-xs text-white">
          {formatClock(episode.durationSeconds)}
        </span>
      </span>

      <span className="flex min-w-0 gap-3 p-3.5">
        <Avatar name={episode.host} size={40} tone={AVATAR_TONES[episode.role]} />
        <span className="min-w-0 flex-1">
          <span className="line-clamp-2 min-h-[40px] text-[14px] leading-snug font-semibold text-[#14213D]">
            {episode.title}
          </span>
          <span className="mt-1 flex min-w-0 items-center gap-1 text-[12px] text-[#475569]">
            <span className="truncate">{episode.host}</span>
            <VerifiedMark />
          </span>
          <span className="mt-2 flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            {episode.role === 'Legal Partner' ? (
              <span className="inline-flex shrink-0 whitespace-nowrap rounded-full border border-[#CBD5E1] bg-[#F1F5F9] px-2.5 py-0.5 text-[11px] font-semibold text-[#475569]">
                Legal Partner
              </span>
            ) : (
              <RoleChip role={episode.role} />
            )}
            <span className="flex items-center gap-1.5 text-[11px] whitespace-nowrap text-[#94A3B8]">
              {episode.rating && (
                <span className="flex items-center gap-0.5 font-semibold text-[#14213D]">
                  <Star className="size-3 fill-[#F5B544] text-[#F5B544]" />
                  <span>{episode.rating.toFixed(1)}</span>
                  <span className="ml-0.5 text-[#CBD5E1]">&middot;</span>
                </span>
              )}
              <span>{formatPlays(episode.plays)} views</span>
              <span>&middot;</span>
              <span>{formatPublishedDays(episode.publishedDaysAgo)}</span>
            </span>
          </span>
        </span>
      </span>
    </motion.div>
  )
}

