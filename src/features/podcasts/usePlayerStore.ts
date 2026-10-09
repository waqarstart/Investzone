import { create } from 'zustand'
import { toast } from 'sonner'
import { Rocket, Network } from 'lucide-react'
import type { PlayerTrack } from './types'

let ticker: ReturnType<typeof setInterval> | null = null

const STORAGE_KEY = 'bridgeway_saved_podcast_ids'

function getInitialSaved(): PlayerTrack[] {
  const defaultTracks: PlayerTrack[] = [
    {
      id: 'ep-90-day-sprint',
      title: 'From idea to term sheet: The 90-day sprint',
      host: 'Zainab Bilal',
      durationSeconds: 2710,
      icon: Rocket,
      variant: 'violet',
    },
    {
      id: 'ep-syndicate-investing',
      title: 'Syndicate investing explained for angel syndicates',
      host: 'Farhan Tareen',
      durationSeconds: 3150,
      icon: Network,
      variant: 'deepBlue',
    },
  ]

  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    if (raw) {
      const parsed = JSON.parse(raw) as string[]
      if (Array.isArray(parsed)) {
        return defaultTracks.filter((t) => parsed.includes(t.id))
      }
    }
  } catch {
    // fallback
  }
  return defaultTracks
}

interface PlayerState {
  track: PlayerTrack | null
  playing: boolean
  elapsed: number
  saved: PlayerTrack[]
  isSaved: (id: string) => boolean
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
    saved: getInitialSaved(),
    isSaved: (id: string) => get().saved.some((item) => item.id === id),
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
      const isAlreadySaved = get().saved.some((item) => item.id === track.id)
      const nextSaved = isAlreadySaved
        ? get().saved.filter((item) => item.id !== track.id)
        : [...get().saved, track]
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSaved.map((t) => t.id)))
        }
      } catch {
        // ignore
      }
      set({ saved: nextSaved })
      toast(isAlreadySaved ? 'Removed from saved videos' : 'Saved video to your library')
    },
  }
})
