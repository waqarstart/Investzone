import { useRef } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import { Pause, Play, SkipBack, SkipForward, X } from 'lucide-react'
import { THUMB_GRADIENTS, formatClock } from '@/features/podcasts/data'
import { usePlayerStore } from '@/features/podcasts/usePlayerStore'

export function MiniPlayer() {
  const track = usePlayerStore((state) => state.track)
  const playing = usePlayerStore((state) => state.playing)
  const elapsed = usePlayerStore((state) => state.elapsed)
  const toggle = usePlayerStore((state) => state.toggle)
  const seek = usePlayerStore((state) => state.seek)
  const skip = usePlayerStore((state) => state.skip)
  const close = usePlayerStore((state) => state.close)
  const barRef = useRef<HTMLDivElement>(null)

  if (!track) return null

  const TrackIcon = track.icon
  const percent = Math.min(100, (elapsed / track.durationSeconds) * 100)

  function handleSeek(event: MouseEvent<HTMLDivElement>) {
    const bar = barRef.current
    if (!bar || !track) return
    const rect = bar.getBoundingClientRect()
    const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1)
    seek(ratio * track.durationSeconds)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!track) return
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      skip(5)
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      skip(-5)
    } else if (event.key === 'Home') {
      event.preventDefault()
      seek(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      seek(track.durationSeconds)
    }
  }

  return (
    <section
      aria-label="Mini player"
      className="fixed bottom-[calc(76px+env(safe-area-inset-bottom))] left-1/2 z-40 w-[calc(100%-24px)] max-w-[720px] -translate-x-1/2 rounded-2xl border border-[#E5E7EB] bg-white p-2.5 shadow-[0_10px_30px_rgba(20,33,61,0.18)] md:bottom-4 md:left-6 md:w-[420px] md:max-w-[420px] md:translate-x-0"
    >
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <span
          className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl text-[#F5B544]"
          style={{ backgroundImage: THUMB_GRADIENTS[track.variant] }}
        >
          <TrackIcon className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-[#14213D]">{track.title}</p>
          <p className="truncate text-[12px] text-[#64748B]">{track.host}</p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5 sm:gap-1">
          <button
            type="button"
            onClick={() => skip(-15)}
            aria-label="Skip back 15 seconds"
            className="grid size-9 place-items-center rounded-full text-[#475569] transition-colors hover:bg-[#F3F4F6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F4FA0]"
          >
            <SkipBack className="size-4" />
          </button>
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? 'Pause' : 'Play'}
            className="grid size-10 place-items-center rounded-full bg-[#F5B544] text-[#14213D] transition-colors hover:bg-[#EDAB35] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8A5A00]"
          >
            {playing ? (
              <Pause className="size-4 fill-current" />
            ) : (
              <Play className="size-4 fill-current" />
            )}
          </button>
          <button
            type="button"
            onClick={() => skip(15)}
            aria-label="Skip forward 15 seconds"
            className="grid size-9 place-items-center rounded-full text-[#475569] transition-colors hover:bg-[#F3F4F6] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F4FA0]"
          >
            <SkipForward className="size-4" />
          </button>
          <button
            type="button"
            onClick={close}
            aria-label="Close player"
            className="grid size-9 place-items-center rounded-full text-[#64748B] transition-colors hover:bg-[#F3F4F6] hover:text-[#14213D] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F4FA0]"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      <div className="mt-1.5 flex items-center gap-3 px-0.5">
        <div
          ref={barRef}
          role="slider"
          tabIndex={0}
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={track.durationSeconds}
          aria-valuenow={Math.round(elapsed)}
          aria-valuetext={`${formatClock(elapsed)} of ${formatClock(track.durationSeconds)}`}
          onClick={handleSeek}
          onKeyDown={handleKeyDown}
          className="flex h-5 min-w-0 flex-1 cursor-pointer touch-none items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F4FA0]"
        >
          <span className="relative block h-1.5 w-full overflow-hidden rounded-full bg-[#E5E7EB]">
            <span
              className="absolute inset-y-0 left-0 rounded-full bg-[#F5B544]"
              style={{ width: `${percent}%` }}
            />
          </span>
        </div>
        <span className="shrink-0 font-mono text-[11px] tabular-nums text-[#64748B]">
          {formatClock(elapsed)} / {formatClock(track.durationSeconds)}
        </span>
      </div>
    </section>
  )
}
