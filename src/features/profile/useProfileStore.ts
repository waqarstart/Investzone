import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ExperienceItem, MilestoneItem, ProfileData, UserRole } from './types'

const INITIAL_EXPERIENCES_FOUNDER: ExperienceItem[] = [
  {
    id: 'exp-1',
    title: 'Founder & CEO',
    company: 'AgriFlow Technologies',
    location: 'Karachi, Pakistan · Hybrid',
    startDate: 'Jan 2024',
    current: true,
    description: 'Modernizing cold-chain logistics, telemetry hardware, and predictive harvest brokerage for smallholder agriculture across South Asia.',
    metrics: 'Raised $480K Seed · 3.2x YoY ARR Growth',
  },
  {
    id: 'exp-2',
    title: 'Head of Product & Solutions',
    company: 'Nexus Scale Labs',
    location: 'Lahore, Pakistan',
    startDate: 'Mar 2021',
    endDate: 'Dec 2023',
    current: false,
    description: 'Led cross-functional engineering and design pods building real-time supply chain telematics and B2B SaaS payment rails.',
    metrics: 'Scaled platform to 45K MAU across 4 regional hubs',
  },
]

const INITIAL_EXPERIENCES_INVESTOR: ExperienceItem[] = [
  {
    id: 'exp-inv-1',
    title: 'Managing Partner & Syndicate Lead',
    company: 'Apex Capital Syndicate',
    location: 'Dubai, UAE · Global',
    startDate: 'Jun 2022',
    current: true,
    description: 'Deploying bilateral venture capital into high-growth B2B SaaS, emerging market FinTech, and climate resilience technologies.',
    metrics: 'Managing $40M Syndicate AUM · 18 Portfolio Investments',
  },
  {
    id: 'exp-inv-2',
    title: 'Venture Partner',
    company: 'Meridian Seed Fund',
    location: 'Singapore',
    startDate: 'Jan 2019',
    endDate: 'May 2022',
    current: false,
    description: 'Spearheaded early-stage investments across Southeast Asia and MENA. Managed SPV deal allocation workflows and LP syndications.',
    metrics: '4 Early Exits · 2.8x Net MOIC',
  },
]

const INITIAL_MILESTONES: MilestoneItem[] = [
  {
    id: 'm-1',
    title: '$1.2M Seed Round Target Opened',
    category: 'funding',
    date: 'Oct 2026',
    metric: '$480K Committed',
    description: '40% lead commitment secured from Meridian Ventures & Apex Syndicate.',
  },
  {
    id: 'm-2',
    title: 'Crossed $480K Annual Recurring Revenue',
    category: 'traction',
    date: 'Aug 2026',
    metric: '3.2x YoY Growth',
    description: 'Scaled telemetry nodes across 14,000+ farmer clusters and cold-chain hubs.',
  },
  {
    id: 'm-3',
    title: 'Commercial Telematics Partnership with AgriCorp',
    category: 'partnership',
    date: 'May 2026',
    metric: '4 Regional Hubs',
    description: 'Standardized automated escrow and IoT cold storage telemetry across Punjab and Sindh.',
  },
  {
    id: 'm-4',
    title: 'Winner: South Asia Climate Tech Innovation Award',
    category: 'award',
    date: 'Feb 2026',
    metric: 'Top AgTech 2026',
    description: 'Recognized for reducing agricultural post-harvest spoilage by 28%.',
  },
]

const DEFAULT_PROFILE: ProfileData = {
  firstName: 'Syeda Zahra',
  lastName: 'Ijaz',
  role: 'founder',
  headline: 'Founder & CEO at AgriFlow Technologies · Agritech IoT & Telemetry SaaS | Raising $1.2M Seed',
  location: 'Karachi, Pakistan',
  contactEmail: 'zahra.ijaz@agriflowtech.io',
  contactPhone: '+92 300 1234567',
  website: 'https://agriflowtech.io',
  bio: 'Building the digital backbone for agricultural logistics in South Asia. Passionate about empowering 2M+ smallholder farmers with predictive harvest analytics, IoT cold-chain visibility, and automated escrow settlement rails. Previously led product at Nexus Scale Labs.',
  connectionsCount: 524,
  followersCount: 1480,
  
  // KYC & Sensitive Government Verification Data
  kycStatus: 'verified',
  kycExpiryDate: '14 Aug 2029',
  kycVerifiedDate: 'Oct 2026',
  kycTier: 'Tier-1 RegTech & NADRA Verified',
  legalFullName: 'Syeda Zahra Ijaz',
  cnicNumber: '42101-5829143-2',
  docType: 'cnic',
  dob: '1994-08-14',
  nationality: 'Pakistan',
  gender: 'female',
  residentialAddress: 'House 42-B, Block 4, Clifton',
  city: 'Karachi',
  postalCode: '75600',
  country: 'Pakistan',
  
  experiences: INITIAL_EXPERIENCES_FOUNDER,
  milestones: INITIAL_MILESTONES,
  featured: [],
  skills: [
    'Agritech Telemetry',
    'Venture Capital Fundraising',
    'B2B SaaS Architecture',
    'Supply Chain Escrow',
    'IoT Hardware Telematics',
    'Term Sheet Negotiation',
    'Cap Table Strategy',
    'Financial Modeling',
  ],
}

interface ProfileStoreState {
  profile: ProfileData
  updateProfile: (partial: Partial<ProfileData>) => void
  setRole: (role: UserRole) => void
  addExperience: (item: ExperienceItem) => void
  updateExperience: (item: ExperienceItem) => void
  deleteExperience: (id: string) => void
  addMilestone: (item: MilestoneItem) => void
  updateMilestone: (item: MilestoneItem) => void
  deleteMilestone: (id: string) => void
  addSkill: (skill: string) => void
  removeSkill: (skill: string) => void
  setAvatar: (dataUrl: string) => void
  setCover: (dataUrl: string) => void
  updateKycStatus: (status: ProfileData['kycStatus'], expiryDate?: string) => void
  resetToDefaults: () => void
}

export const useProfileStore = create<ProfileStoreState>()(
  persist(
    (set) => ({
      profile: DEFAULT_PROFILE,
      updateProfile: (partial) =>
        set((state) => ({
          profile: { ...state.profile, ...partial },
        })),
      setRole: (role) =>
        set((state) => {
          const isFounder = role === 'founder'
          return {
            profile: {
              ...state.profile,
              role,
              headline: isFounder
                ? 'Founder & CEO at AgriFlow Technologies · Agritech IoT | Raising $1.2M Seed'
                : 'Managing Partner at Apex Capital Syndicate · Venture Syndicate with $40M AUM',
              experiences: isFounder ? INITIAL_EXPERIENCES_FOUNDER : INITIAL_EXPERIENCES_INVESTOR,
              skills: isFounder
                ? ['Agritech Telemetry', 'Venture Capital Fundraising', 'B2B SaaS', 'Supply Chain Escrow']
                : ['Venture Syndicates', 'LP Fund Management', 'Term Sheet Structuring', 'B2B SaaS Due Diligence', 'Cross-Border Capital'],
            },
          }
        }),
      addExperience: (item) =>
        set((state) => ({
          profile: {
            ...state.profile,
            experiences: [item, ...state.profile.experiences],
          },
        })),
      updateExperience: (item) =>
        set((state) => ({
          profile: {
            ...state.profile,
            experiences: state.profile.experiences.map((exp) => (exp.id === item.id ? item : exp)),
          },
        })),
      deleteExperience: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            experiences: state.profile.experiences.filter((exp) => exp.id !== id),
          },
        })),
      addMilestone: (item) =>
        set((state) => ({
          profile: {
            ...state.profile,
            milestones: [item, ...(state.profile.milestones || [])],
          },
        })),
      updateMilestone: (item) =>
        set((state) => ({
          profile: {
            ...state.profile,
            milestones: (state.profile.milestones || []).map((m) => (m.id === item.id ? item : m)),
          },
        })),
      deleteMilestone: (id) =>
        set((state) => ({
          profile: {
            ...state.profile,
            milestones: (state.profile.milestones || []).filter((m) => m.id !== id),
          },
        })),
      addSkill: (skill) =>
        set((state) => {
          if (state.profile.skills.includes(skill)) return state
          return {
            profile: {
              ...state.profile,
              skills: [...state.profile.skills, skill],
            },
          }
        }),
      removeSkill: (skill) =>
        set((state) => ({
          profile: {
            ...state.profile,
            skills: state.profile.skills.filter((s) => s !== skill),
          },
        })),
      setAvatar: (avatarUrl) =>
        set((state) => ({
          profile: { ...state.profile, avatarUrl },
        })),
      setCover: (coverUrl) =>
        set((state) => ({
          profile: { ...state.profile, coverUrl },
        })),
      updateKycStatus: (kycStatus, kycExpiryDate) =>
        set((state) => ({
          profile: {
            ...state.profile,
            kycStatus,
            kycExpiryDate: kycExpiryDate || state.profile.kycExpiryDate || '14 Aug 2029',
          },
        })),
      resetToDefaults: () => set({ profile: DEFAULT_PROFILE }),
    }),
    {
      name: 'bridgeway-profile',
      merge: (persistedState, currentState) => {
        const typedPersisted = (persistedState as Partial<ProfileStoreState>) || {}
        const mergedProfile: ProfileData = {
          ...currentState.profile,
          ...(typedPersisted.profile || {}),
        }
        if (!mergedProfile.milestones || mergedProfile.milestones.length === 0) {
          mergedProfile.milestones = INITIAL_MILESTONES
        }
        return {
          ...currentState,
          ...typedPersisted,
          profile: mergedProfile,
        }
      },
    }
  )
)
