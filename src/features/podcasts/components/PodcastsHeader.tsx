import { ArrowLeft, Bookmark } from 'lucide-react'
import { cn } from 'cn'

interface PodcastsHeaderProps {
  isSavedOnly: boolean
  onToggleSaved: () => void
  savedCount?: number
}

export function PodcastsHeader({
  isSavedOnly,
  onToggleSaved,
}: PodcastsHeaderProps) {
  if (isSavedOnly) {
    return (
      <section aria-labelledby="saved-videos-title" className="min-w-0">
        <button
          type="button"
          onClick={onToggleSaved}
          className="inline-flex items-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#14213D] shadow-xs transition-all hover:border-[#3F4FA0] hover:bg-[#F8FAFC] cursor-pointer"
          title="Back"
          aria-label="Back"
        >
          <ArrowLeft className="size-4 text-[#3F4FA0]" />
          <span>Back</span>
        </button>

        <h1
          id="saved-videos-title"
          className="mt-4 font-display text-[30px] leading-tight font-bold text-[#14213D] sm:text-[40px]"
        >
          Saved Videos
        </h1>
      </section>
    )
  }

  return (
    <section
      aria-labelledby="podcasts-title"
      className="flex min-w-0 flex-wrap items-center justify-between gap-3 sm:gap-4"
    >
      <div className="flex items-center gap-3 min-w-0">
        <h1
          id="podcasts-title"
          className="font-display text-[30px] leading-tight font-bold text-[#14213D] sm:text-[40px]"
        >
          Podcasts
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
        <button
          type="button"
          onClick={onToggleSaved}
          aria-pressed={isSavedOnly}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-xl border transition-all cursor-pointer shadow-xs select-none',
            isSavedOnly
              ? 'border-[#14213D] bg-[#14213D] text-[#F5B544] shadow-sm hover:bg-[#1E2E54]'
              : 'border-[#CBD5E1] bg-white text-[#14213D] hover:border-[#3F4FA0] hover:bg-[#F8FAFC]',
          )}
          title={isSavedOnly ? 'Show all episodes' : 'Show saved videos'}
          aria-label={isSavedOnly ? 'Show all episodes' : 'Show saved videos'}
        >
          <Bookmark
            className={cn(
              'size-4.5 shrink-0',
              isSavedOnly ? 'fill-[#F5B544] text-[#F5B544]' : 'text-[#3F4FA0]',
            )}
          />
        </button>
      </div>
    </section>
  )
}

