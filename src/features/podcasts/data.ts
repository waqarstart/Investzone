import {
  BadgeCheck,
  BriefcaseMedical,
  ChartLine,
  ChartPie,
  Eye,
  FileText,
  FolderCog,
  Globe,
  Handshake,
  Landmark,
  Lightbulb,
  Mic,
  Microscope,
  Network,
  Radio,
  RadioTower,
  Rocket,
  Scale,
  ShieldCheck,
  Truck,
  Wallet,
  Zap,
} from 'lucide-react'
import type {
  Category,
  ContinueItem,
  Episode,
  FeaturedEpisode,
  Show,
  ThumbnailVariant,
} from './types'

export const CATEGORIES: Category[] = [
  'All',
  'Founder stories',
  'Investor insights',
  'Deals closed',
  'Fundraising tips',
  'AgriTech',
  'FinTech',
  'HealthTech',
  'AI & Automation',
  'Legal & compliance',
  'Syndication',
]

export const THUMB_GRADIENTS: Record<ThumbnailVariant, string> = {
  indigo: 'linear-gradient(135deg, #14213D 0%, #2A2F78 100%)',
  violet: 'linear-gradient(135deg, #14213D 0%, #3B2F7A 100%)',
  deepBlue: 'linear-gradient(135deg, #14213D 0%, #1B2A5E 100%)',
  plum: 'linear-gradient(135deg, #14213D 0%, #34285F 100%)',
}

export const FEATURED_GRADIENT =
  'linear-gradient(105deg, #14213D 0%, #2A2F78 55%, #3B3F8F 100%)'

export const CARD_SHADOW =
  'shadow-[0_1px_2px_rgba(16,24,40,0.04),0_6px_20px_rgba(16,24,40,0.05)]'

export const CARD_SHADOW_HOVER =
  'hover:shadow-[0_4px_10px_rgba(16,24,40,0.06),0_12px_28px_rgba(16,24,40,0.09)]'

export const featuredEpisode: FeaturedEpisode = {
  id: 'featured-agriflow-seed',
  title: 'How AgriFlow closed its PKR 120M seed round in 6 weeks',
  summary:
    "Co-founder Tariq Mansoor sits down with lead syndicate partner Farhan Tareen to break down term sheet negotiation, valuation caps, and post-round execution in Pakistan's AgriTech sector.",
  hostName: 'Taimur Chaudhry',
  hostTag: 'Lead Partner',
  guestName: 'Tariq Mansoor',
  guestTag: 'Founder, AgriFlow',
  durationSeconds: 2538,
  publishedDaysAgo: 3,
  plays: 12000,
  topic: 'Seed syndicate breakdown',
  icon: Mic,
}

export const continueItems: ContinueItem[] = [
  {
    id: 'continue-convertible-notes',
    title: 'Structuring Convertible Notes in MENA & GCC',
    host: 'Farhan Tareen',
    episode: '18',
    percent: 70,
    minutesLeft: 12,
    durationSeconds: 2400,
    icon: Landmark,
    variant: 'indigo',
  },
  {
    id: 'continue-healthbridge-ai',
    title: 'HealthBridge AI: From Clinical Triage to Scale',
    host: 'Dr. Rabia Mansoor',
    episode: '09',
    percent: 35,
    minutesLeft: 24,
    durationSeconds: 2215,
    icon: BriefcaseMedical,
    variant: 'deepBlue',
  },
  {
    id: 'continue-angel-checks',
    title: 'What Angels Look For in First-Time Founders',
    host: 'Bilal Ahmad',
    episode: '31',
    percent: 85,
    minutesLeft: 5,
    durationSeconds: 2000,
    icon: BadgeCheck,
    variant: 'plum',
  },
]

export const episodes: Episode[] = [
  {
    id: 'ep-100-pitches',
    title: 'Why investors say no: lessons from 100 pitches',
    host: 'Dr. Rabia Mansoor',
    role: 'Investor',
    plays: 8200,
    publishedDaysAgo: 4,
    durationSeconds: 2295,
    categories: ['Investor insights'],
    icon: ChartLine,
    variant: 'indigo',
    shape: 'wave',
    accent: 'amber',
  },
  {
    id: 'ep-90-day-sprint',
    title: 'From idea to term sheet: The 90-day sprint',
    host: 'Zainab Bilal',
    role: 'Founder',
    plays: 14100,
    publishedDaysAgo: 5,
    durationSeconds: 2710,
    categories: ['Founder stories', 'Fundraising tips'],
    icon: Rocket,
    variant: 'violet',
    shape: 'wave',
    accent: 'sky',
  },
  {
    id: 'ep-syndicate-investing',
    title: 'Syndicate investing explained for angel syndicates',
    host: 'Farhan Tareen',
    role: 'Investor',
    plays: 9400,
    publishedDaysAgo: 7,
    durationSeconds: 3150,
    categories: ['Investor insights', 'Syndication'],
    icon: Network,
    variant: 'deepBlue',
    shape: 'circle',
    accent: 'amber',
  },
  {
    id: 'ep-cold-chain-iot',
    title: 'Building cold-chain IoT telemetry in Punjab',
    host: 'Tariq Mansoor',
    role: 'Founder',
    plays: 6700,
    publishedDaysAgo: 7,
    durationSeconds: 2080,
    categories: ['Founder stories', 'AgriTech'],
    icon: Radio,
    variant: 'plum',
    shape: 'arc',
    accent: 'sky',
  },
  {
    id: 'ep-diligence-data-room',
    title: 'What a good diligence data room looks like',
    host: 'Bilal Ahmad',
    role: 'Investor',
    plays: 11300,
    publishedDaysAgo: 14,
    durationSeconds: 2475,
    categories: ['Investor insights', 'Fundraising tips'],
    icon: FolderCog,
    variant: 'indigo',
    shape: 'arc',
    accent: 'amber',
  },
  {
    id: 'ep-b2b-fintech-economics',
    title: 'Unit economics of B2B fintech infrastructure',
    host: 'Nida Karim',
    role: 'Founder',
    plays: 13800,
    publishedDaysAgo: 14,
    durationSeconds: 2945,
    categories: ['FinTech', 'Founder stories'],
    icon: Wallet,
    variant: 'violet',
    shape: 'wave',
    accent: 'sky',
  },
  {
    id: 'ep-escrow-ndas',
    title: 'Bridgeway deal mechanics: Escrow and NDAs',
    host: 'Sarah Jenkins',
    role: 'Legal Partner',
    plays: 7500,
    publishedDaysAgo: 21,
    durationSeconds: 2210,
    categories: ['Legal & compliance', 'Deals closed'],
    icon: Scale,
    variant: 'deepBlue',
    shape: 'triangle',
    accent: 'amber',
  },
  {
    id: 'ep-ai-dispatchers',
    title: 'Scaling logistics fleets with AI dispatchers',
    host: 'Mahnoor Khan',
    role: 'Founder',
    plays: 8900,
    publishedDaysAgo: 21,
    durationSeconds: 2605,
    categories: ['AI & Automation', 'Founder stories'],
    icon: Truck,
    variant: 'plum',
    shape: 'circle',
    accent: 'sky',
  },
  {
    id: 'ep-regulatory-sandboxes',
    title: 'Navigating SEC & SBP regulatory sandboxes',
    host: 'Mirza Baig',
    role: 'Investor',
    plays: 10400,
    publishedDaysAgo: 30,
    durationSeconds: 3490,
    categories: ['Legal & compliance', 'FinTech'],
    icon: ShieldCheck,
    variant: 'indigo',
    shape: 'arc',
    accent: 'amber',
  },
  {
    id: 'ep-founder-investor-chemistry',
    title: 'The art of founder-investor chemistry',
    host: 'Aamina Sheikh',
    role: 'Founder',
    plays: 16200,
    publishedDaysAgo: 30,
    durationSeconds: 2385,
    categories: ['Founder stories', 'Deals closed'],
    icon: Handshake,
    variant: 'violet',
    shape: 'circle',
    accent: 'sky',
  },
  {
    id: 'ep-micro-grids',
    title: 'Decentralized micro-grids: Powering industrial hubs',
    host: 'Hamza Shah',
    role: 'Founder',
    plays: 9100,
    publishedDaysAgo: 30,
    durationSeconds: 2838,
    categories: ['Founder stories'],
    icon: Zap,
    variant: 'deepBlue',
    shape: 'triangle',
    accent: 'amber',
  },
  {
    id: 'ep-cap-table-dilution',
    title: 'Managing cap table dilution across Seed to Series B',
    host: 'Omar Rasheed',
    role: 'Investor',
    plays: 18500,
    publishedDaysAgo: 30,
    durationSeconds: 3260,
    categories: ['Fundraising tips', 'Investor insights'],
    icon: ChartPie,
    variant: 'plum',
    shape: 'circle',
    accent: 'sky',
  },
]

export const shows: Show[] = [
  { id: 'show-deal-room', name: 'The Deal Room Brief', host: 'Farhan Tareen', icon: RadioTower },
  { id: 'show-founder-zero-one', name: 'Founder Zero to One', host: 'Zainab Bilal', icon: Lightbulb },
  { id: 'show-syndicate-secrets', name: 'Syndicate Secrets', host: 'Taimur Chaudhry', icon: Eye },
  { id: 'show-term-sheet-teardown', name: 'Term Sheet Teardown', host: 'Bilal Ahmad', icon: FileText },
  { id: 'show-frontier-tech', name: 'Frontier Tech Pakistan', host: 'Amina Qureshi', icon: Microscope },
  { id: 'show-angel-playbook', name: 'Angel Playbook GCC', host: 'Sarah Jenkins', icon: Globe },
]

export const DEFAULT_FOLLOWED: string[] = ['show-founder-zero-one']

export function formatClock(totalSeconds: number): string {
  const seconds = Math.max(0, Math.round(totalSeconds))
  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return `${minutes}:${String(rest).padStart(2, '0')}`
}

export function formatPlays(plays: number): string {
  if (plays < 1000) return String(plays)
  const value = Math.round((plays / 1000) * 10) / 10
  const label = value % 1 === 0 ? value.toFixed(0) : value.toFixed(1)
  return `${label}K`
}

export function formatPublishedDays(days: number): string {
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.round(days / 7)}w ago`
  return `${Math.round(days / 30)}mo ago`
}
