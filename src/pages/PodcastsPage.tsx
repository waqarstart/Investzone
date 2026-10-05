import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { CategoryChips } from '@/features/podcasts/components/CategoryChips'
import { ContinueListening } from '@/features/podcasts/components/ContinueListening'
import { EpisodeGrid } from '@/features/podcasts/components/EpisodeGrid'
import { FeaturedEpisode } from '@/features/podcasts/components/FeaturedEpisode'
import { LibrarySheet } from '@/features/podcasts/components/LibrarySheet'
import { PodcastsHeader } from '@/features/podcasts/components/PodcastsHeader'
import { PopularShows } from '@/features/podcasts/components/PopularShows'
import { StartPodcastDialog } from '@/features/podcasts/components/StartPodcastDialog'
import { episodes } from '@/features/podcasts/data'
import type { Category, SortKey } from '@/features/podcasts/types'
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
  const [category, setCategory] = useState<Category>('All')
  const [sort, setSort] = useState<SortKey>('latest')
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [startOpen, setStartOpen] = useState(false)
  const hasTrack = usePlayerStore((state) => state.track !== null)

  const visibleEpisodes = useMemo(() => {
    const filtered =
      category === 'All' ? episodes : episodes.filter((item) => item.categories.includes(category))
    const sorted = [...filtered]
    if (sort === 'played') sorted.sort((a, b) => b.plays - a.plays)
    else if (sort === 'longest') sorted.sort((a, b) => b.durationSeconds - a.durationSeconds)
    else sorted.sort((a, b) => a.publishedDaysAgo - b.publishedDaysAgo)
    return sorted
  }, [category, sort])

  return (
    <div className="min-h-screen bg-[#F6F4EF]">
      <main className="mx-auto w-full max-w-[1280px] min-w-0 px-4 py-6 pb-28 sm:px-6">
        <div className="flex min-w-0 flex-col gap-6 sm:gap-8">
          <FadeUp index={0}>
            <PodcastsHeader
              onOpenLibrary={() => setLibraryOpen(true)}
              onStartPodcast={() => setStartOpen(true)}
            />
          </FadeUp>

          <FadeUp index={1}>
            <CategoryChips value={category} onChange={setCategory} />
          </FadeUp>

          <FadeUp index={2}>
            <FeaturedEpisode />
          </FadeUp>

          <FadeUp index={3}>
            <ContinueListening />
          </FadeUp>

          <FadeUp index={4}>
            <EpisodeGrid episodes={visibleEpisodes} sort={sort} onSortChange={setSort} />
          </FadeUp>

          <FadeUp index={5}>
            <PopularShows />
          </FadeUp>

          <FadeUp index={6}>
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

      <LibrarySheet open={libraryOpen} onOpenChange={setLibraryOpen} />
      <StartPodcastDialog open={startOpen} onOpenChange={setStartOpen} />
    </div>
  )
}
