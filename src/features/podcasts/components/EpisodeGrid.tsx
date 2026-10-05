import { EmptyState } from '@/components/common/EmptyState'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { EpisodeCard } from './EpisodeCard'
import type { Episode, SortKey } from '../types'

interface EpisodeGridProps {
  episodes: Episode[]
  sort: SortKey
  onSortChange: (sort: SortKey) => void
}

export function EpisodeGrid({ episodes, sort, onSortChange }: EpisodeGridProps) {
  return (
    <section aria-labelledby="latest-heading" className="min-w-0">
      <div className="flex flex-col gap-3 border-b border-[#E5E7EB] pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2
            id="latest-heading"
            className="font-display text-[24px] leading-tight font-bold text-[#14213D] sm:text-[28px]"
          >
            Latest episodes
          </h2>
          <p className="mt-1 max-w-2xl text-[14px] text-[#475569]">
            Direct insights on term sheets, cap table hygiene, and scaling from industry
            practitioners.
          </p>
        </div>
        <div className="flex h-9 w-full shrink-0 items-center gap-1 rounded-lg border border-[#E5E7EB] bg-white pl-3 sm:w-auto">
          <span className="text-[13px] whitespace-nowrap text-[#64748B]">Sort by:</span>
          <Select
            value={sort}
            onValueChange={(value) => onSortChange(value as SortKey)}
          >
            <SelectTrigger
              aria-label="Sort episodes"
              className="h-full min-w-0 border-0 bg-transparent px-1.5 text-[13px] font-semibold text-[#14213D] shadow-none hover:bg-transparent focus-visible:ring-[#3F4FA0]"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="played">Most played</SelectItem>
              <SelectItem value="longest">Longest</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {episodes.length === 0 ? (
        <div className="mt-4">
          <EmptyState text="No episodes in this category yet" />
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {episodes.map((episode, index) => (
            <EpisodeCard key={episode.id} episode={episode} index={index} />
          ))}
        </div>
      )}
    </section>
  )
}
