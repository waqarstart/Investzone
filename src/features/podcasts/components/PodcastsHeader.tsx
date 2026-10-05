import { Library, Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CARD_SHADOW } from '../data'

interface PodcastsHeaderProps {
  onOpenLibrary: () => void
  onStartPodcast: () => void
}

export function PodcastsHeader({ onOpenLibrary, onStartPodcast }: PodcastsHeaderProps) {
  return (
    <section
      aria-labelledby="podcasts-title"
      className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6"
    >
      <div className="min-w-0">
        <h1
          id="podcasts-title"
          className="font-display text-[30px] leading-tight font-bold text-[#14213D] sm:text-[40px]"
        >
          Podcasts
        </h1>
        <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-[#475569]">
          Conversations, deal breakdowns, and strategic capital mechanics from the Bridgeway
          community.
        </p>
      </div>
      <div className="grid shrink-0 grid-cols-2 gap-3 sm:flex sm:items-center">
        <Button
          type="button"
          onClick={onOpenLibrary}
          className={`${CARD_SHADOW} h-11 gap-1 rounded-full border border-[#3F4FA0] bg-white px-2.5 text-[12.5px] font-semibold text-[#3F4FA0] hover:bg-[#EEF0FA] hover:text-[#3F4FA0] focus-visible:ring-[#3F4FA0] sm:h-10 sm:gap-1.5 sm:px-4 sm:text-sm`}
        >
          <Library className="size-4" />
          My library
        </Button>
        <Button
          type="button"
          onClick={onStartPodcast}
          className="h-11 gap-1 rounded-full border border-[#F5B544] bg-[#F5B544] px-2.5 text-[12.5px] font-semibold text-[#14213D] hover:bg-[#EDAB35] hover:text-[#14213D] focus-visible:ring-[#8A5A00] sm:h-10 sm:gap-1.5 sm:px-4 sm:text-sm"
        >
          <Mic className="size-4" />
          Start a podcast
        </Button>
      </div>
    </section>
  )
}
