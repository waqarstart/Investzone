import { Bookmark, Play, Sparkles } from 'lucide-react'
import { Avatar } from '@/components/common/Avatar'
import { VerifiedMark } from '@/components/common/VerifiedMark'
import { useIsMobile } from '@/components/common/useIsMobile'
import { Button } from '@/components/ui/button'
import { cn } from 'cn'
import {
  CARD_SHADOW,
  featuredEpisode,
  formatClock,
  formatPlays,
} from '../data'
import type { PlayerTrack } from '../types'
import { usePlayerStore } from '../usePlayerStore'

const track: PlayerTrack = {
  id: featuredEpisode.id,
  title: featuredEpisode.title,
  host: featuredEpisode.hostName,
  durationSeconds: featuredEpisode.durationSeconds,
  icon: featuredEpisode.icon,
  variant: 'indigo',
}

export function FeaturedEpisode() {
  const isMobile = useIsMobile()
  const play = usePlayerStore((state) => state.play)
  const saved = usePlayerStore((state) => state.saved)
  const toggleSaved = usePlayerStore((state) => state.toggleSaved)
  const isSaved = saved.some((item) => item.id === track.id)
  const avatarSize = isMobile ? 64 : 96

  return (
    <section aria-labelledby="featured-heading" className="min-w-0">
      <div
        className={cn(
          'grid grid-cols-1 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white transition-shadow duration-300 lg:grid-cols-[1.35fr_1fr]',
          CARD_SHADOW,
        )}
      >
        <div className="relative min-h-[280px] overflow-hidden aspect-video lg:aspect-auto lg:min-h-full bg-slate-950">
          <img
            src={`https://img.youtube.com/vi/${featuredEpisode.youtubeId || 'dGl9kYq5KKs'}/hqdefault.jpg`}
            alt={featuredEpisode.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30" />
          <div className="relative z-10 flex h-full w-full flex-wrap items-center justify-center gap-5 px-6 py-8 sm:gap-9 sm:px-8">
            <figure className="flex flex-col items-center gap-2">
              <span className="relative inline-block rounded-full ring-4 ring-[#5BA4E6] shadow-md">
                <Avatar name={featuredEpisode.hostName} size={avatarSize} tone="indigo" verified />
              </span>
              <figcaption className="text-[11px] font-bold tracking-wide text-white uppercase drop-shadow-xs">
                Host
              </figcaption>
            </figure>
            <button
              type="button"
              onClick={() => play(track)}
              aria-label={`Play ${featuredEpisode.title}`}
              className="grid size-14 shrink-0 place-items-center rounded-full bg-red-600 text-white shadow-[0_0_30px_rgba(220,38,38,0.7)] transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:size-[72px]"
            >
              <Play className="size-6 fill-current ml-0.5 sm:size-8" />
            </button>
            <figure className="flex flex-col items-center gap-2">
              <span className="relative inline-block rounded-full ring-4 ring-[#F5B544] shadow-md">
                <Avatar name={featuredEpisode.guestName} size={avatarSize} tone="navy" verified />
              </span>
              <figcaption className="text-[11px] font-bold tracking-wide text-white uppercase drop-shadow-xs">
                Guest
              </figcaption>
            </figure>
          </div>
          <span className="absolute right-3 bottom-3 z-10 rounded-md bg-[rgba(20,33,61,0.85)] px-2 py-1 font-mono text-xs text-white">
            {formatClock(featuredEpisode.durationSeconds)}
          </span>
        </div>

        <div className="min-w-0 p-6 lg:p-8">
          <h2
            id="featured-heading"
            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#FEF3D8] px-3 py-1.5 text-[11px] font-bold tracking-wide text-[#8A5A00] uppercase"
          >
            <Sparkles className="size-3.5" />
            Episode of the week
          </h2>
          <h3 className="mt-4 font-display text-[22px] leading-snug font-bold text-[#14213D] sm:text-[28px]">
            {featuredEpisode.title}
          </h3>
          <p className="mt-3 text-[14.5px] leading-relaxed text-[#475569]">
            {featuredEpisode.summary}
          </p>

          <div className="mt-5 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="flex min-w-0 flex-wrap items-center gap-1.5">
                <span className="text-[13px] text-[#94A3B8]">Host:</span>
                <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[#14213D]">
                  {featuredEpisode.hostName}
                  <VerifiedMark />
                </span>
              </span>
              <span className="rounded-full border border-[#3F4FA0]/30 bg-[#EEF0FA] px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap text-[#3F4FA0]">
                {featuredEpisode.hostTag}
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="flex min-w-0 flex-wrap items-center gap-1.5">
                <span className="text-[13px] text-[#94A3B8]">Guest:</span>
                <span className="flex items-center gap-1.5 text-[13px] font-semibold text-[#14213D]">
                  {featuredEpisode.guestName}
                  <VerifiedMark />
                </span>
              </span>
              <span className="rounded-full border border-[#F5B544]/60 bg-[#FEF3D8] px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap text-[#8A5A00]">
                {featuredEpisode.guestTag}
              </span>
            </div>
          </div>

          <p className="mt-4 text-[12px] text-[#94A3B8]">
            Published {featuredEpisode.publishedDaysAgo} days ago &bull;{' '}
            {formatPlays(featuredEpisode.plays)} plays &bull; {featuredEpisode.topic}
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button
              type="button"
              onClick={() => play(track)}
              className="h-11 rounded-full border border-[#F5B544] bg-[#F5B544] text-sm font-bold text-[#14213D] hover:bg-[#EDAB35] hover:text-[#14213D] focus-visible:ring-[#8A5A00] sm:h-10"
            >
              <Play className="size-4 fill-current" />
              Play episode
            </Button>
            <Button
              type="button"
              onClick={() => toggleSaved(track)}
              aria-pressed={isSaved}
              className={cn(
                'h-11 rounded-full text-sm font-semibold sm:h-10',
                isSaved
                  ? 'border border-[#3F4FA0]/50 bg-[#EEF0FA] text-[#3F4FA0] hover:bg-[#E3E7F7] hover:text-[#3F4FA0]'
                  : 'border border-[#E5E7EB] bg-white text-[#475569] hover:bg-[#F6F4EF] hover:text-[#14213D]',
              )}
            >
              <Bookmark className={cn('size-4', isSaved && 'fill-current')} />
              {isSaved ? 'Saved' : 'Save for later'}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
