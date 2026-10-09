import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { EpisodeGrid } from '@/features/podcasts/components/EpisodeGrid'
import { FeaturedEpisode } from '@/features/podcasts/components/FeaturedEpisode'
import { PodcastsHeader } from '@/features/podcasts/components/PodcastsHeader'
import { episodes } from '@/features/podcasts/data'
import { usePlayerStore } from '@/features/podcasts/usePlayerStore'

function FadeUp({
  index,
  children,
  className,
}: {
  index: number
  children: ReactNode
  className?: string
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function PodcastsPage() {
  const [isSavedOnly, setIsSavedOnly] = useState(false)
  const hasTrack = usePlayerStore((state) => state.track !== null)
  const saved = usePlayerStore((state) => state.saved)
  const savedIds = useMemo(() => new Set(saved.map((item) => item.id)), [saved])

  const visibleEpisodes = useMemo(() => {
    let list = episodes
    if (isSavedOnly) {
      list = list.filter((item) => savedIds.has(item.id))
    }
    const sorted = [...list]
    sorted.sort((a, b) => (b.rating ?? 4.8) - (a.rating ?? 4.8) || b.plays - a.plays)
    return sorted
  }, [isSavedOnly, savedIds])

  return (
    <div className="min-h-screen bg-[#F6F4EF]">
      <main className="mx-auto w-full max-w-[1280px] min-w-0 px-4 py-6 pb-28 sm:px-6">
        <div className="flex min-w-0 flex-col gap-6 sm:gap-8">
          <FadeUp index={0}>
            <PodcastsHeader
              isSavedOnly={isSavedOnly}
              onToggleSaved={() => setIsSavedOnly((prev) => !prev)}
              savedCount={saved.length}
            />
          </FadeUp>

          {!isSavedOnly && (
            <FadeUp index={1}>
              <FeaturedEpisode />
            </FadeUp>
          )}

          <FadeUp index={isSavedOnly ? 1 : 2}>
            <EpisodeGrid
              episodes={visibleEpisodes}
              isSavedOnly={isSavedOnly}
            />
          </FadeUp>

          <FadeUp index={3}>
            <footer className="flex flex-col items-center justify-between gap-2 border-t border-[#E5E7EB] pt-4 text-[12px] text-[#64748B] sm:flex-row">
              <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
                <a className="underline-offset-4 hover:text-[#14213D] hover:underline" href="#about">
                  About
                </a>
                <span aria-hidden="true"> &middot; </span>
                <a
                  className="underline-offset-4 hover:text-[#14213D] hover:underline"
                  href="#accessibility"
                >
                  Accessibility
                </a>
                <span aria-hidden="true"> &middot; </span>
                <a
                  className="underline-offset-4 hover:text-[#14213D] hover:underline"
                  href="#help"
                >
                  Help Center
                </a>
                <span aria-hidden="true"> &middot; </span>
                <a
                  className="underline-offset-4 hover:text-[#14213D] hover:underline"
                  href="#privacy"
                >
                  Privacy &amp; Terms
                </a>
              </nav>
              <span>&copy; 2026 Bridgeway</span>
            </footer>
          </FadeUp>

          {hasTrack && <div className="h-16 md:hidden" aria-hidden="true" />}
        </div>
      </main>
    </div>
  )
}
