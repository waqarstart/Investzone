import { Play, X } from 'lucide-react'
import { EmptyState } from '@/components/common/EmptyState'
import { useIsMobile } from '@/components/common/useIsMobile'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { THUMB_GRADIENTS } from '../data'
import { usePlayerStore } from '../usePlayerStore'

interface LibrarySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LibrarySheet({ open, onOpenChange }: LibrarySheetProps) {
  const isMobile = useIsMobile()
  const saved = usePlayerStore((state) => state.saved)
  const play = usePlayerStore((state) => state.play)
  const toggleSaved = usePlayerStore((state) => state.toggleSaved)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? 'bottom' : 'right'}
        className="gap-0 bg-white data-[side=bottom]:max-h-[80vh]"
      >
        <SheetHeader className="border-b border-[#E5E7EB]">
          <SheetTitle className="font-display text-lg font-bold text-[#14213D]">
            My library
          </SheetTitle>
          <SheetDescription className="text-[13px] text-[#475569]">
            Saved episodes, ready to play.
          </SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
          {saved.length === 0 ? (
            <EmptyState text="Nothing saved yet" />
          ) : (
            <ul className="space-y-3">
              {saved.map((track) => {
                const TrackIcon = track.icon
                return (
                  <li
                    key={track.id}
                    className="flex items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
                  >
                    <span
                      className="grid size-11 shrink-0 place-items-center rounded-lg text-[#F5B544]"
                      style={{ backgroundImage: THUMB_GRADIENTS[track.variant] }}
                    >
                      <TrackIcon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold text-[#14213D]">
                        {track.title}
                      </span>
                      <span className="block truncate text-[11px] text-[#94A3B8]">
                        {track.host}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        play(track)
                        onOpenChange(false)
                      }}
                      aria-label={`Play ${track.title}`}
                      className="grid size-9 shrink-0 place-items-center rounded-full bg-[#F5B544] text-[#14213D] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F4FA0]"
                    >
                      <Play className="size-4 fill-current" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSaved(track)}
                      aria-label={`Remove ${track.title} from your library`}
                      className="grid size-9 shrink-0 place-items-center rounded-full text-[#94A3B8] transition-colors hover:bg-[#F3F4F6] hover:text-[#F2705A] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F4FA0]"
                    >
                      <X className="size-4" />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
