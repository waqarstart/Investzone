export type UserRole = 'founder' | 'investor'

export interface ExperienceItem {
  id: string
  title: string
  company: string
  companyLogo?: string
  location?: string
  startDate: string
  endDate?: string
  current: boolean
  description: string
  metrics?: string // e.g. "Raised $1.2M Seed" or "Managed $15M AUM"
}

export interface FeaturedItem {
  id: string
  type: 'deck' | 'deal_room' | 'post' | 'article'
  title: string
  subtitle: string
  image?: string
  linkText: string
  metrics?: string
  badge?: string
}

export interface MilestoneItem {
  id: string
  title: string
  category: 'funding' | 'traction' | 'partnership' | 'product' | 'award'
  date: string
  metric?: string
  description?: string
}

export interface ProfileData {
  firstName: string
  lastName: string
  role: UserRole
  headline: string
  location: string
  contactEmail: string
  contactPhone?: string
  website?: string
  avatarUrl?: string
  coverUrl?: string
  bio: string
  openTo?: string
  connectionsCount: number
  followersCount: number
  
  // KYC / Verification Data (Sensitive details captured during KYC)
  kycStatus: 'verified' | 'skipped' | 'in_progress' | 'not_started'
  kycExpiryDate?: string // e.g. "14 Aug 2029"
  kycVerifiedDate?: string // e.g. "Oct 2026"
  kycTier?: string // e.g. "Tier-1 NADRA & RegTech"
  legalFullName?: string
  cnicNumber?: string // e.g. "42101-5829143-2"
  docType?: 'cnic' | 'passport' | 'license'
  dob?: string // e.g. "1994-08-14"
  nationality?: string // e.g. "Pakistan"
  gender?: string // e.g. "Female"
  residentialAddress?: string // e.g. "House 42-B, Block 4, Clifton"
  city?: string // e.g. "Karachi"
  postalCode?: string // e.g. "75600"
  country?: string // e.g. "Pakistan"
  
  // Founder Specific Fields
  startupName?: string
  startupStage?: string // "Pre-Seed" | "Seed" | "Series A"
  startupIndustry?: string
  targetRaise?: string // "$1.2M"
  valuationCap?: string // "$6.0M"
  leadCommitted?: string // "40%"
  currentArr?: string // "$480K"
  yoyGrowth?: string // "3.2x YoY"
  
  // Investor Specific Fields
  fundName?: string
  fundAum?: string // "$40M AUM"
  checkSize?: string // "$50K - $500K"
  sectors?: string[] // ["B2B SaaS", "Agritech", "Fintech", "AI"]
  investmentStage?: string // "Seed to Series A"
  syndicateCarry?: string // "15% Carry"
  
  // Sections
  experiences: ExperienceItem[]
  milestones: MilestoneItem[]
  featured: FeaturedItem[]
  skills: string[]
}
