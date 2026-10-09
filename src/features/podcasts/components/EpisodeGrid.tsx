import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { EmptyState } from '@/components/common/EmptyState'
import { EpisodeCard } from './EpisodeCard'
import type { Episode } from '../types'

interface EpisodeGridProps {
  episodes: Episode[]
  isSavedOnly?: boolean
}

export function EpisodeGrid({
  episodes,
  isSavedOnly,
}: EpisodeGridProps) {
  const navigate = useNavigate()
  const displayedEpisodes = isSavedOnly ? episodes : episodes.slice(0, 4)

  return (
    <section aria-labelledby="latest-heading" className="min-w-0">
      {!isSavedOnly && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2
              id="latest-heading"
              className="font-display text-[24px] leading-tight font-bold text-[#14213D] sm:text-[28px]"
            >
              Top Rated
            </h2>
          </div>
        </div>
      )}

      {displayedEpisodes.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            text={
              isSavedOnly
                ? "You don't have any saved videos yet. Click the bookmark icon on any episode to save it here!"
                : 'No episodes in this category yet'
            }
          />
        </div>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedEpisodes.map((episode, index) => (
              <EpisodeCard key={episode.id} episode={episode} index={index} />
            ))}
          </div>

          {!isSavedOnly && episodes.length > 4 && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => navigate('/podcasts/all')}
                className="inline-flex items-center gap-2 rounded-full border border-[#14213D] bg-[#14213D] px-7 py-2.5 text-sm font-bold text-white shadow-xs transition-all hover:bg-[#1E2E54] hover:shadow-md cursor-pointer"
              >
                <span>View more</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
