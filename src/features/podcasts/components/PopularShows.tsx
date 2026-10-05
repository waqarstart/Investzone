import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { DEFAULT_FOLLOWED, shows } from '../data'
import type { Show } from '../types'
import { ShowCard } from './ShowCard'

export function PopularShows() {
  const [followed, setFollowed] = useState<string[]>(DEFAULT_FOLLOWED)

  function toggle(show: Show) {
    const isFollowed = followed.includes(show.id)
    setFollowed((ids) =>
      isFollowed ? ids.filter((id) => id !== show.id) : [...ids, show.id],
    )
    toast(isFollowed ? `Unfollowed ${show.name}` : `Now following ${show.name}`)
  }

  return (
    <section aria-labelledby="shows-heading" className="min-w-0">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div className="min-w-0">
          <h2
            id="shows-heading"
            className="font-display text-[24px] leading-tight font-bold text-[#14213D] sm:text-[28px]"
          >
            Popular shows
          </h2>
          <p className="mt-1 text-[14px] text-[#475569]">
            Subscribe to recurring syndication channels and sector briefs.
          </p>
        </div>
        <button
          type="button"
          onClick={() => toast('More shows are coming soon (demo)')}
          className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-[#3F4FA0] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F4FA0]"
        >
          Explore all shows
          <ArrowRight className="size-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
        {shows.map((show, index) => (
          <ShowCard
            key={show.id}
            show={show}
            index={index}
            followed={followed.includes(show.id)}
            onToggle={() => toggle(show)}
          />
        ))}
      </div>
    </section>
  )
}
