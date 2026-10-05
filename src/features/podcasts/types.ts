import type { LucideIcon } from 'lucide-react'

export type PodcastRole = 'Investor' | 'Founder' | 'Legal Partner'

export type ThumbnailVariant = 'indigo' | 'violet' | 'deepBlue' | 'plum'

export type ThumbShape = 'wave' | 'arc' | 'triangle' | 'circle'

export type ThumbAccent = 'amber' | 'sky'

export type SortKey = 'latest' | 'played' | 'longest'

export type Category =
  | 'All'
  | 'Founder stories'
  | 'Investor insights'
  | 'Deals closed'
  | 'Fundraising tips'
  | 'AgriTech'
  | 'FinTech'
  | 'HealthTech'
  | 'AI & Automation'
  | 'Legal & compliance'
  | 'Syndication'

export interface Episode {
  id: string
  title: string
  host: string
  role: PodcastRole
  plays: number
  publishedDaysAgo: number
  durationSeconds: number
  categories: Exclude<Category, 'All'>[]
  icon: LucideIcon
  variant: ThumbnailVariant
  shape: ThumbShape
  accent: ThumbAccent
}

export interface FeaturedEpisode {
  id: string
  title: string
  summary: string
  hostName: string
  hostTag: string
  guestName: string
  guestTag: string
  durationSeconds: number
  publishedDaysAgo: number
  plays: number
  topic: string
  icon: LucideIcon
}

export interface ContinueItem {
  id: string
  title: string
  host: string
  episode: string
  percent: number
  minutesLeft: number
  durationSeconds: number
  icon: LucideIcon
  variant: ThumbnailVariant
}

export interface Show {
  id: string
  name: string
  host: string
  icon: LucideIcon
}

export interface PlayerTrack {
  id: string
  title: string
  host: string
  durationSeconds: number
  icon: LucideIcon
  variant: ThumbnailVariant
}
