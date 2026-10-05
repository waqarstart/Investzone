import { useState } from 'react'
import { Clock, Play } from 'lucide-react'
import { useIsMobile } from '@/components/common/useIsMobile'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { cn } from 'cn'
import {
  CARD_SHADOW,
  CARD_SHADOW_HOVER,
  THUMB_GRADIENTS,
  continueItems,
} from '../data'
import type { ContinueItem, PlayerTrack } from '../types'
import { usePlayerStore } from '../usePlayerStore'

function toTrack(item: ContinueItem): PlayerTrack {
  return {
    id: item.id,
    title: item.title,
    host: item.host,
    durationSeconds: item.durationSeconds,
    icon: item.icon,
    variant: item.variant,
  }
}

interface HistorySheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function HistorySheet({ open, onOpenChange }: HistorySheetProps) {
  const isMobile = useIsMobile()
  const play = usePlayerStore((state) => state.play)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isMobile ? 'bottom' : 'right'}
        className="gap-0 bg-white data-[side=bottom]:max-h-[80vh]"
      >
        <SheetHeader className="border-b border-[#E5E7EB]">
          <SheetTitle className="font-display text-lg font-bold text-[#14213D]">
            Listening history
          </SheetTitle>
          <SheetDescription className="text-[13px] text-[#475569]">
            Pick up exactly where you stopped.
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
          <ul className="space-y-3">
            {continueItems.map((item) => {
              const ItemIcon = item.icon
              return (
                <li
                  key={item.id}
                  className="rounded-xl border border-[#E5E7EB] bg-white p-3 shadow-[0_1px_2px_rgba(16,24,40,0.04)]"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="grid size-10 shrink-0 place-items-center rounded-lg text-[#F5B544]"
                      style={{ backgroundImage: THUMB_GRADIENTS[item.variant] }}
                    >
                      <ItemIcon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold text-[#14213D]">
                        {item.title}
                      </span>
                      <span className="block truncate text-[11px] text-[#94A3B8]">
                        {item.percent}% listened &bull; {item.minutesLeft} min left
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        play(toTrack(item), (item.durationSeconds * item.percent) / 100)
                        onOpenChange(false)
                      }}
                      aria-label={`Resume ${item.title}`}
                      className="grid size-9 shrink-0 place-items-center rounded-full bg-[#F5B544] text-[#14213D] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F4FA0]"
                    >
                      <Play className="size-4 fill-current" />
                    </button>
                  </div>
                  <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
                    <div
                      className="h-full rounded-full bg-[#F5B544]"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export function ContinueListening() {
  const play = usePlayerStore((state) => state.play)
  const [historyOpen, setHistoryOpen] = useState(false)

  return (
    <section aria-labelledby="continue-heading" className="min-w-0">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2
          id="continue-heading"
          className="flex items-center gap-2 text-[20px] font-semibold text-[#14213D]"
        >
          <Clock className="size-5 text-[#F5B544]" />
          Continue listening
        </h2>
        <button
          type="button"
          onClick={() => setHistoryOpen(true)}
          className="text-[13px] font-semibold text-[#3F4FA0] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F4FA0]"
        >
          View listening history
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 lg:grid-cols-3">
        {continueItems.map((item) => {
          const ItemIcon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => play(toTrack(item), (item.durationSeconds * item.percent) / 100)}
              aria-label={`Resume ${item.title}`}
              className={cn(
                'min-w-0 rounded-2xl border border-[#E5E7EB] bg-white p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-[#D5DBE5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F4FA0]',
                CARD_SHADOW,
                CARD_SHADOW_HOVER,
              )}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#14213D] text-[#F5B544]">
                  <ItemIcon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold text-[#14213D]">
                    {item.title}
                  </span>
                  <span className="mt-0.5 block truncate text-[12px] text-[#94A3B8]">
                    Host: {item.host} &bull; Episode {item.episode}
                  </span>
                </span>
              </span>
              <span className="mt-4 block h-1.5 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
                <span
                  className="block h-full rounded-full bg-[#F5B544]"
                  style={{ width: `${item.percent}%` }}
                />
              </span>
              <span className="mt-2 flex items-center justify-between text-[12px] text-[#475569]">
                <span>{item.percent}% listened</span>
                <span>{item.minutesLeft} min left</span>
              </span>
            </button>
          )
        })}
      </div>

      <HistorySheet open={historyOpen} onOpenChange={setHistoryOpen} />
    </section>
  )
}
