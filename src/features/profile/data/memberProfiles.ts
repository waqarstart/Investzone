export interface MemberProfileData {
  id: string
  name: string
  initials: string
  role: 'Founder' | 'Investor'
  headline: string
  location: string
  avatar?: string
  bio: string
  badge: string
  badgeColor?: string
  metrics?: string
  subtitle?: string
  followersCount: number
  connectionsCount: number
  verified: boolean
  kycTier: string
  experiences: {
    id: string
    title: string
    company: string
    location: string
    period: string
    description: string
    metrics?: string
  }[]
  skills: string[]
  milestones?: {
    id: string
    title: string
    category: 'funding' | 'traction' | 'partnership' | 'product' | 'award'
    date: string
    metric?: string
    description?: string
  }[]
  posts?: {
    id: string
    body: string
    time: string
    images?: string[]
    likes: number
    comments: number
    impressions?: number
  }[]
  recentPost?: {
    body: string
    time: string
    likes: number
    comments: number
  }
}

export const MEMBER_PROFILES: Record<string, MemberProfileData> = {
  marcus_v: {
    id: 'marcus_v',
    name: 'Marcus Vance',
    initials: 'MV',
    role: 'Investor',
    headline: 'Managing Partner at Meridian Ventures · Verified LP · FinTech & Climate Tech Focus',
    location: 'Dubai, UAE · Global Allocations',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    bio: 'Deploying bilateral venture capital into high-growth B2B SaaS, cross-border payment rails, and emerging market climate resilience technologies. Managing $65M Syndicate AUM across 28 bilateral portfolio investments.',
    badge: 'Verified Lead',
    badgeColor: 'bg-[#FEF3D8] text-[#B45309] border-[#F5B544]/50',
    metrics: 'Check Size: $100K–$500K · 24 Bilateral Deals Backed',
    subtitle: 'Managing Partner at Meridian Ventures · Verified LP',
    followersCount: 4210,
    connectionsCount: 890,
    verified: true,
    kycTier: 'Tier-1 Institutional LP Verified',
    experiences: [
      {
        id: 'e1',
        title: 'Managing Partner',
        company: 'Meridian Ventures',
        location: 'Dubai, UAE',
        period: '2021 — Present',
        description: 'Leading seed to Series A syndication rounds for emerging market B2B infrastructure and climate tech.',
        metrics: '$65M AUM · 28 Deals Deployed',
      },
      {
        id: 'e2',
        title: 'Principal Investor',
        company: 'Apex Capital Partners',
        location: 'Singapore',
        period: '2017 — 2021',
        description: 'Managed early-stage SPV allocations and investor syndicate relations.',
        metrics: '12 Early Exits',
      },
    ],
    skills: ['Venture Capital', 'Syndication Desk', 'B2B SaaS', 'Cross-Border Rails', 'Deal Due Diligence', 'Term Sheets'],
    milestones: [
      {
        id: 'mv-m1',
        title: '$15M Q3 Allocation Mandate Opened',
        category: 'funding',
        date: 'Oct 2026',
        metric: '$15M Target',
        description: 'Deploying bilateral checks into Series A fintech and cross-border settlement rails.',
      },
      {
        id: 'mv-m2',
        title: 'Crossed $65M Syndicate Assets Under Management',
        category: 'traction',
        date: 'Jul 2026',
        metric: '28 Portfolio Cos',
        description: 'Scaled syndicate network to 140+ institutional LP co-investors.',
      },
      {
        id: 'mv-m3',
        title: 'Lead Allocator for Regional Fintech Cohort',
        category: 'partnership',
        date: 'Mar 2026',
        metric: '12 Startups',
        description: 'Standardized bilateral convertible terms for emerging cross-border payment founders.',
      },
    ],
    posts: [
      {
        id: 'mv-p1',
        body: 'Meridian Ventures is deploying $15M this quarter into pre-Series A and Series A B2B infrastructure and cross-border settlement rails. Ping our syndicate desk directly via Bridgeway or submit your memo to our verified queue.',
        time: '5h',
        likes: 89,
        comments: 31,
        impressions: 420,
      },
      {
        id: 'mv-p2',
        body: 'Standardized covenants on Bridgeway have sped up our diligence cycle by 40%. Transparent cap tables and clean governance make syndicated rounds move significantly faster.',
        time: '3d',
        likes: 64,
        comments: 19,
        impressions: 310,
      },
      {
        id: 'mv-p3',
        body: 'Excited to announce our co-investment syndicate in AgriFlow Technologies $1.2M Seed Round! High conviction in rural telemetry hardware.',
        time: '1w',
        likes: 112,
        comments: 42,
        impressions: 580,
      },
    ],
    recentPost: {
      body: 'Meridian Ventures is deploying $15M this quarter into pre-Series A and Series A B2B infrastructure and cross-border settlement rails. Ping our syndicate desk directly via Bridgeway.',
      time: '5h ago',
      likes: 89,
      comments: 31,
    },
  },

  sarah_j: {
    id: 'sarah_j',
    name: 'Sarah Jenkins',
    initials: 'SJ',
    role: 'Investor',
    headline: 'Global Syndicate Lead · Climate Tech & FinTech Angel Allocator',
    location: 'London, UK · Global',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bio: 'Backing ambitious operators building decarbonization software and high-velocity fintech solutions across emerging corridors. 18 portfolio investments backed over the past 4 years.',
    badge: 'Operator Angel',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    metrics: 'Check Size: $25K–$100K · 18 Portfolio Investments',
    subtitle: 'Global Syndicate Lead · Climate Tech & FinTech Angel',
    followersCount: 3180,
    connectionsCount: 640,
    verified: true,
    kycTier: 'Accredited Angel Allocator',
    experiences: [
      {
        id: 'e1',
        title: 'Global Syndicate Lead',
        company: 'Falcon Syndicate Desk',
        location: 'London, UK',
        period: '2022 — Present',
        description: 'Syndicating angel checks with 40+ co-investors into early-stage climate tech & fintech.',
        metrics: '18 Portfolio Investments',
      },
      {
        id: 'e2',
        title: 'VP of Growth',
        company: 'Stripe Emerging Corridors',
        location: 'London, UK',
        period: '2018 — 2022',
        description: 'Scaled cross-border payment volume across high-growth international startup corridors.',
      },
    ],
    skills: ['Angel Investing', 'Climate Tech', 'FinTech', 'SPV Structuring', 'Early Growth Strategy'],
    milestones: [
      {
        id: 'sj-m1',
        title: '$4.5M Climate Syndicate Allocations Deployed',
        category: 'funding',
        date: 'Sep 2026',
        metric: '$4.5M Deployed',
        description: 'Led 6 bilateral angel syndicates backing carbon accounting and grid intelligence founders.',
      },
      {
        id: 'sj-m2',
        title: 'Partnered with European Cleantech Accelerator',
        category: 'partnership',
        date: 'Jun 2026',
        metric: '18 Startups Backed',
        description: 'Standardized angel SPV participation rights and follow-on allocations.',
      },
      {
        id: 'sj-m3',
        title: 'Voted Top Climate Angel Allocator 2026',
        category: 'award',
        date: 'Mar 2026',
        metric: 'Angel Award',
        description: 'Recognized for high founder NPS and fast due-diligence turnaround.',
      },
    ],
    posts: [
      {
        id: 'sj-p1',
        body: 'Published our new syndicated investment mandate for Q3 2026. Looking for teams building automated audit & carbon accounting rails. Reach out on Bridgeway to discuss allocations.',
        time: '2d',
        likes: 48,
        comments: 14,
        impressions: 340,
      },
      {
        id: 'sj-p2',
        body: 'Climate software is shifting from compliance reporting to active energy orchestration. Seeing incredible founders in this space across emerging corridors.',
        time: '1w',
        likes: 67,
        comments: 21,
        impressions: 480,
      },
      {
        id: 'sj-p3',
        body: 'Thrilled to welcome 12 new LP angels to our Falcon Syndicate desk. Standardized terms make syndicate syndication frictionless.',
        time: '3w',
        likes: 92,
        comments: 18,
        impressions: 610,
      },
    ],
    recentPost: {
      body: 'Published our new syndicated investment mandate for Q3 2026. Looking for teams building automated audit & carbon accounting rails.',
      time: '2d ago',
      likes: 48,
      comments: 14,
    },
  },

  tariq_m: {
    id: 'tariq_m',
    name: 'Tariq Malik',
    initials: 'TM',
    role: 'Investor',
    headline: 'Serial Fintech Founder & Angel Allocator · 8 Exits & Co-Investments',
    location: 'Karachi, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    bio: 'Operator turned angel investor. Built and scaled payment gateway infrastructure across South Asia with 2 successful strategic exits. Now allocating personal capital into first-time technical founders.',
    badge: 'Exited Founder',
    badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
    metrics: 'Check Size: $50K–$150K · 8 Exits & Co-Investments',
    subtitle: 'Serial Fintech Founder & Angel Allocator',
    followersCount: 5420,
    connectionsCount: 920,
    verified: true,
    kycTier: 'Tier-1 RegTech Verified',
    experiences: [
      {
        id: 'e1',
        title: 'General Partner & Angel',
        company: 'Indus Valley Angels',
        location: 'Karachi, Pakistan',
        period: '2023 — Present',
        description: 'First-check investor backing technical founders solving foundational logistics and payment frictions.',
        metrics: '8 Exits & Co-Investments',
      },
      {
        id: 'e2',
        title: 'Founder & CEO',
        company: 'PayQuick (Acquired)',
        location: 'Karachi, Pakistan',
        period: '2017 — 2022',
        description: 'Built merchant payment rails processing over $120M annual GMV. Acquired in 2022.',
      },
    ],
    skills: ['Angel Investing', 'Fintech Architecture', 'Cap Table Management', 'Product Strategy', 'M&A'],
    milestones: [
      {
        id: 'tm-m1',
        title: 'Closed $2.2M Angel Syndicate Round',
        category: 'funding',
        date: 'Aug 2026',
        metric: '$2.2M Syndicate',
        description: 'Syndicated capital across 8 fintech portfolio companies in the region.',
      },
      {
        id: 'tm-m2',
        title: 'PayQuick Strategic Acquisition Finalized',
        category: 'award',
        date: 'Jan 2025',
        metric: 'Strategic Exit',
        description: 'Successfully exited payment gateway platform after scaling to $120M annual GMV.',
      },
    ],
    posts: [
      {
        id: 'tm-p1',
        body: 'PKR 45M Seed Round closed for our portfolio company. Exceptional execution from the founding pod! Looking forward to scaling their distribution nationwide.',
        time: '3d',
        likes: 74,
        comments: 22,
        impressions: 510,
      },
      {
        id: 'tm-p2',
        body: 'When evaluating fintech founders, unit economics on customer acquisition matter far more than gross transaction volume in year one.',
        time: '1w',
        likes: 110,
        comments: 34,
        impressions: 740,
      },
    ],
    recentPost: {
      body: 'PKR 45M Seed Round closed for our portfolio company. Exceptional execution from the founding pod!',
      time: '3d ago',
      likes: 74,
      comments: 22,
    },
  },

  dr_aamir: {
    id: 'dr_aamir',
    name: 'Dr Aamir Mehmood',
    initials: 'AM',
    role: 'Investor',
    headline: 'Chief AI Architect at HealthBridge · DeepTech Angel & Technical Diligence Advisor',
    location: 'Lahore, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    bio: 'PhD in Computer Science. Leading clinical AI architecture while advising and backing early-stage technical founders building foundational deep-tech, machine learning, and healthcare workflows.',
    badge: 'Technical LP',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    metrics: 'Check Size: $25K–$75K · Technical Diligence Advisor',
    subtitle: 'Chief AI Architect at HealthBridge · DeepTech Angel',
    followersCount: 2890,
    connectionsCount: 510,
    verified: true,
    kycTier: 'Technical Diligence LP Verified',
    experiences: [
      {
        id: 'e1',
        title: 'Chief AI Architect',
        company: 'HealthBridge AI',
        location: 'Lahore, Pakistan',
        period: '2022 — Present',
        description: 'Architecting hospital interoperability platforms and responsible diagnostic machine learning models.',
      },
      {
        id: 'e2',
        title: 'DeepTech Venture Advisor',
        company: 'Crescent Moon Angels',
        location: 'Lahore, Pakistan',
        period: '2020 — Present',
        description: 'Conducting code audits, IP defense evaluations, and ML architecture assessments for prospective angel investments.',
      },
    ],
    skills: ['DeepTech', 'Artificial Intelligence', 'HealthTech', 'Technical Diligence', 'Cloud Infrastructure'],
    milestones: [
      {
        id: 'da-m1',
        title: 'Completed Technical Diligence for 14 AI Rounds',
        category: 'partnership',
        date: 'Aug 2026',
        metric: '14 DeepTech Audits',
        description: 'Vetted ML architecture, IP moats, and cloud infrastructure for tier-1 syndicate leads.',
      },
      {
        id: 'da-m2',
        title: 'Published Clinical ML Safety Framework',
        category: 'award',
        date: 'Apr 2026',
        metric: 'Peer-Reviewed',
        description: 'Co-authored benchmark on reducing diagnostic hallucination in multi-modal models.',
      },
    ],
    posts: [
      {
        id: 'da-p1',
        body: 'Reviewing early-stage clinical AI startups this week. The key differentiator is defensible workflow integration, not wrapper models.',
        time: '4d',
        likes: 62,
        comments: 19,
        impressions: 480,
      },
      {
        id: 'da-p2',
        body: 'Always check data provenance before investing in machine learning companies. Moats exist in proprietary distribution and clean ground truth data.',
        time: '2w',
        likes: 88,
        comments: 24,
        impressions: 610,
      },
    ],
    recentPost: {
      body: 'Reviewing early-stage clinical AI startups this week. The key differentiator is defensible workflow integration, not wrapper models.',
      time: '4d ago',
      likes: 62,
      comments: 19,
    },
  },

  amina_q: {
    id: 'amina_q',
    name: 'Amina Qureshi',
    initials: 'AQ',
    role: 'Founder',
    headline: 'Founder & CEO at AgriFlow Tech · Agritech B2B SaaS | Raising $1.2M Seed',
    location: 'Lahore, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    bio: 'Modernizing cold-chain logistics and agricultural telemetry for smallholder farmers across South Asia with real-time IoT and predictive harvest brokerage. Incubated at NIC Lahore.',
    badge: 'Seed Stage',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    metrics: 'ARR $480K (3.2x YoY) · Raising $1.2M',
    subtitle: 'Founder & CEO at AgriFlow Tech',
    followersCount: 3840,
    connectionsCount: 710,
    verified: true,
    kycTier: 'Tier-1 RegTech Verified',
    experiences: [
      {
        id: 'e1',
        title: 'Founder & CEO',
        company: 'AgriFlow Technologies',
        location: 'Lahore, Pakistan',
        period: '2023 — Present',
        description: 'Building telemetry and predictive cold storage hardware for farmers.',
        metrics: 'Raised $480K Seed',
      },
    ],
    skills: ['AgriTech', 'Cold-Chain IoT', 'B2B SaaS', 'Supply Chain', 'Venture Capital'],
    milestones: [
      {
        id: 'aq-m1',
        title: '$1.2M Seed Round Target Opened',
        category: 'funding',
        date: 'Oct 2026',
        metric: '$480K Committed',
        description: '40% lead commitment secured from Meridian Ventures & Apex Syndicate.',
      },
      {
        id: 'aq-m2',
        title: 'Crossed $480K Annual Recurring Revenue',
        category: 'traction',
        date: 'Aug 2026',
        metric: '3.2x YoY Growth',
        description: 'Scaled telemetry nodes across 14,000+ farmer clusters and cold-chain hubs.',
      },
      {
        id: 'aq-m3',
        title: 'Winner: South Asia Climate Tech Innovation Award',
        category: 'award',
        date: 'Feb 2026',
        metric: 'Top AgTech 2026',
        description: 'Recognized for reducing agricultural post-harvest spoilage by 28%.',
      },
    ],
    posts: [
      {
        id: 'aq-p1',
        body: 'Thrilled to announce our Seed round is officially open on Bridgeway! We are modernizing cold-chain logistics with real-time IoT and predictive brokerage.',
        time: '2h',
        likes: 142,
        comments: 38,
        impressions: 920,
      },
      {
        id: 'aq-p2',
        body: 'Over 14,000 smallholder farmers now connected to AgriFlow sensor hubs. Post-harvest loss dropped by 28% in our pilot districts!',
        time: '4d',
        likes: 95,
        comments: 26,
        impressions: 680,
      },
      {
        id: 'aq-p3',
        body: 'Huge milestone: Signed pilot agreement with AgriCorp to deploy automated cold room monitoring in Punjab and Sindh.',
        time: '2w',
        likes: 120,
        comments: 31,
        impressions: 810,
      },
    ],
    recentPost: {
      body: 'Thrilled to announce our Seed round is officially open on Bridgeway! We are modernizing cold-chain logistics with real-time IoT.',
      time: '2h ago',
      likes: 42,
      comments: 18,
    },
  },

  zainab_b: {
    id: 'zainab_b',
    name: 'Zainab Bilal',
    initials: 'ZB',
    role: 'Founder',
    headline: 'CTO & Co-Founder at HealthBridge AI · Clinical Interoperability & Medical AI',
    location: 'Lahore, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    bio: 'Pioneering ethical, high-precision clinical workflow AI. Ex-Google Health research fellow now building hospital interoperability tools across 14 hospital groups.',
    badge: 'FinTech & AI',
    badgeColor: 'bg-indigo-50 text-[#3F4FA0] border-indigo-200',
    metrics: '14 Hospital Deployments · Series A',
    subtitle: 'CTO & Co-Founder at HealthBridge AI',
    followersCount: 4620,
    connectionsCount: 880,
    verified: true,
    kycTier: 'Verified Healthcare Founder',
    experiences: [
      {
        id: 'e1',
        title: 'CTO & Co-Founder',
        company: 'HealthBridge AI',
        location: 'Lahore, Pakistan',
        period: '2022 — Present',
        description: 'Leading healthcare engineering and AI model safety pod.',
      },
    ],
    skills: ['HealthTech', 'Machine Learning', 'Clinical EMR', 'Enterprise Software', 'Data Governance'],
    milestones: [
      {
        id: 'zb-m1',
        title: 'Deployed to 14 Regional Hospital Networks',
        category: 'product',
        date: 'Jul 2026',
        metric: '14 Hospital Hubs',
        description: 'Standardized automated EHR diagnostic synthesis across 120,000+ patient records.',
      },
      {
        id: 'zb-m2',
        title: 'Clinical AI Safety Certification Achieved',
        category: 'award',
        date: 'Jan 2026',
        metric: 'ISO/IEC 27001',
        description: 'First healthcare AI provider in the territory to pass rigorous patient data privacy audits.',
      },
    ],
    posts: [
      {
        id: 'zb-p1',
        body: 'We are expanding our clinical AI platform with new hospital partners across the region. Excited for what Q4 holds!',
        time: '1d',
        likes: 36,
        comments: 12,
        impressions: 290,
      },
      {
        id: 'zb-p2',
        body: 'Ethical AI in clinical environments requires human-in-the-loop verification at every diagnostic checkpoint. Here is how our architecture ensures 99.8% precision.',
        time: '1w',
        likes: 82,
        comments: 29,
        impressions: 640,
      },
    ],
    recentPost: {
      body: 'We are expanding our clinical AI platform with new hospital partners across the region. Excited for what Q4 holds!',
      time: '1d ago',
      likes: 36,
      comments: 12,
    },
  },

  taimur_c: {
    id: 'taimur_c',
    name: 'Taimur Chaudhry',
    initials: 'TC',
    role: 'Investor',
    headline: 'Managing Partner at Indus Horizon Capital · Seed to Series A Syndicate Lead',
    location: 'Lahore, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    bio: 'Investing $45M institutional capital into early-stage fintech, agritech, and B2B SaaS founders across emerging Asian corridors.',
    badge: 'Venture Capital',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    metrics: '$45M AUM · 34 Portfolio Companies',
    subtitle: 'Managing Partner at Indus Horizon Capital',
    followersCount: 6710,
    connectionsCount: 1200,
    verified: true,
    kycTier: 'Institutional Lead Allocator',
    experiences: [
      {
        id: 'e1',
        title: 'Managing Partner',
        company: 'Indus Horizon Capital',
        location: 'Lahore, Pakistan',
        period: '2020 — Present',
        description: 'Leading seed to Series A syndication rounds for Pakistani & regional startups.',
        metrics: '$45M AUM · 34 Investments',
      },
    ],
    skills: ['Venture Capital', 'Syndicates', 'Deal Flow', 'Fund Management', 'Board Advisory'],
    milestones: [
      {
        id: 'tc-m1',
        title: '$45M Fund II Allocation Closed',
        category: 'funding',
        date: 'Aug 2026',
        metric: '$45M Closed',
        description: 'Fully committed fund mandate to lead Series A syndication rounds in emerging tech corridors.',
      },
      {
        id: 'tc-m2',
        title: 'Led 34 Bilateral Founder Investments',
        category: 'traction',
        date: 'May 2026',
        metric: '34 Deals Backed',
        description: 'Co-invested alongside tier-1 institutional LPs with automated governance.',
      },
    ],
    posts: [
      {
        id: 'tc-p1',
        body: 'Reviewing several compelling cross-border payment pitches today. Bridgeway standard covenants streamline deal execution by 3x.',
        time: '2d',
        likes: 58,
        comments: 16,
        impressions: 430,
      },
      {
        id: 'tc-p2',
        body: 'Fund II is actively writing checks. If you are a technical founder with strong unit economics in fintech or logistics, ping our syndicate desk.',
        time: '5d',
        likes: 130,
        comments: 44,
        impressions: 890,
      },
    ],
    recentPost: {
      body: 'Reviewing several compelling cross-border payment pitches today. Bridgeway standard covenants streamline deal execution by 3x.',
      time: '2d ago',
      likes: 58,
      comments: 16,
    },
  },

  kamran_s: {
    id: 'kamran_s',
    name: 'Kamran Shafi',
    initials: 'KS',
    role: 'Founder',
    headline: 'Co-Founder & COO at MedScale · HealthTech Scale-Up',
    location: 'Karachi, Pakistan',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    bio: 'Scaling clinic operating systems across 600+ independent diagnostic labs and clinics throughout the country. $3M Pre-Series A closed.',
    badge: 'HealthTech',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    metrics: '$3M Round Closed · 600+ Clinics',
    subtitle: 'Co-Founder & COO at MedScale',
    followersCount: 2940,
    connectionsCount: 480,
    verified: true,
    kycTier: 'Tier-1 RegTech Verified',
    experiences: [
      {
        id: 'e1',
        title: 'Co-Founder & COO',
        company: 'MedScale',
        location: 'Karachi, Pakistan',
        period: '2022 — Present',
        description: 'Overseeing commercial partnerships, clinic network onboarding, and regulatory compliance.',
      },
    ],
    skills: ['HealthTech', 'Operations', 'Scaling', 'Diagnostics', 'B2B Sales'],
    milestones: [
      {
        id: 'ks-m1',
        title: '$3M Pre-Series A Round Oversubscribed',
        category: 'funding',
        date: 'Sep 2026',
        metric: '$3M Secured',
        description: 'Syndicated across regional institutional healthtech investors on Bridgeway.',
      },
      {
        id: 'ks-m2',
        title: 'Network Expanded to 600+ Independent Clinics',
        category: 'traction',
        date: 'Jun 2026',
        metric: '600+ Diagnostic Labs',
        description: 'Processing over 18,000 patient bookings and lab orders weekly.',
      },
    ],
    posts: [
      {
        id: 'ks-p1',
        body: 'Milestone unlocked! With the help of the Bridgeway broker network, our $3M Pre-Series A oversubscribed within 18 days.',
        time: '1d',
        likes: 124,
        comments: 26,
        impressions: 780,
      },
      {
        id: 'ks-p2',
        body: 'Healthtech infrastructure in emerging markets succeeds when you build for existing clinic workflows instead of asking operators to change overnight.',
        time: '1w',
        likes: 89,
        comments: 18,
        impressions: 520,
      },
    ],
    recentPost: {
      body: 'Milestone unlocked! With the help of the Bridgeway broker network, our $3M Pre-Series A oversubscribed within 18 days.',
      time: '1d ago',
      likes: 124,
      comments: 26,
    },
  },
}
