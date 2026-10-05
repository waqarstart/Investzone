import { create } from 'zustand'
import { toast } from 'sonner'
import type { PlayerTrack } from './types'

let ticker: ReturnType<typeof setInterval> | null = null

interface PlayerState {
  track: PlayerTrack | null
  playing: boolean
  elapsed: number
  saved: PlayerTrack[]
  play: (track: PlayerTrack, startAt?: number) => void
  toggle: () => void
  seek: (seconds: number) => void
  skip: (seconds: number) => void
  close: () => void
  toggleSaved: (track: PlayerTrack) => void
}

export const usePlayerStore = create<PlayerState>()((set, get) => {
  function stopTicker() {
    if (ticker) {
      clearInterval(ticker)
      ticker = null
    }
  }

  function startTicker() {
    if (ticker) return
    ticker = setInterval(() => {
      const { track, elapsed, playing } = get()
      if (!track || !playing) return
      const next = elapsed + 1
      if (next >= track.durationSeconds) {
        set({ elapsed: track.durationSeconds, playing: false })
        stopTicker()
        return
      }
      set({ elapsed: next })
    }, 1000)
  }

  function syncTicker() {
    const { track, playing } = get()
    if (track && playing) startTicker()
    else stopTicker()
  }

  return {
    track: null,
    playing: false,
    elapsed: 0,
    saved: [],
    play: (track, startAt = 0) => {
      set({
        track,
        elapsed: Math.min(Math.max(startAt, 0), track.durationSeconds),
        playing: true,
      })
      syncTicker()
    },
    toggle: () => {
      if (!get().track) return
      set({ playing: !get().playing })
      syncTicker()
    },
    seek: (seconds) => {
      const { track } = get()
      if (!track) return
      set({ elapsed: Math.min(Math.max(seconds, 0), track.durationSeconds) })
      syncTicker()
    },
    skip: (seconds) => {
      get().seek(get().elapsed + seconds)
    },
    close: () => {
      set({ track: null, playing: false, elapsed: 0 })
      syncTicker()
    },
    toggleSaved: (track) => {
      const isSaved = get().saved.some((item) => item.id === track.id)
      set({
        saved: isSaved
          ? get().saved.filter((item) => item.id !== track.id)
          : [...get().saved, track],
      })
      toast(isSaved ? 'Removed from your library' : 'Saved to your library')
    },
  }
})
