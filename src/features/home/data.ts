import type { Post, Story } from './types'

export const stories: Story[] = [
  { id: 'tarik', initials: 'TM', name: 'Tariq Malik', chip: 'Seed', headline: 'PKR 45M Seed Closed', gradient: 'linear-gradient(145deg,#3f4fa0,#14213d)' },
  { id: 'sarah', initials: 'SJ', name: 'Sarah Jenkins', chip: 'Series A', headline: '$2.4M Series A Secured', gradient: 'linear-gradient(145deg,#73533c,#14213d)' },
  { id: 'bilal', initials: 'BC', name: 'Bilal & Co', chip: 'Pre-A', headline: '100% Allocation Met', gradient: 'linear-gradient(145deg,#171b36,#6b2a2f)' },
  { id: 'zoya', initials: 'ZA', name: 'Zoya Alvi', chip: 'Angel', headline: '$850K Angel Round', gradient: 'linear-gradient(145deg,#513d8f,#4186b5)' },
]

export const posts: Post[] = [
  { id: 'amina', name: 'Amina Qureshi', initials: 'AQ', kind: 'founder', headline: 'Founder & CEO at AgriFlow Tech · Agritech B2B SaaS', time: '2h · Edited', body: 'Thrilled to announce our Seed round is officially open on Bridgeway! 🚀 We are modernizing cold-chain logistics and agricultural telemetry for smallholder farmers across South Asia with real-time IoT and predictive harvest brokerage.', extra: 'ARR & MOMENTUM  $480K (3.2x YoY growth)     SEEKING ALLOCATION  $1.2M (Lead investor committed: 40%)', tags: ['#AgriTech', '#VentureCapital', '#Fundraising', '#EmergingMarkets', '#BridgewayDeal'], interested: 42, comments: 18, engagementScore: 95, createdAt: 6, banner: 'deal' },
  { id: 'marcus', name: 'Marcus Vance', initials: 'MV', kind: 'investor', headline: 'Partner at Meridian Ventures · FinTech & Climate Tech Focus', time: '5h', body: 'Meridian Ventures is deploying $15M this quarter into pre-Series A and Series A B2B infrastructure and cross-border settlement rails.', extra: 'If you have clean audited metrics, ARR > $300k, and are building defensible proprietary rails, ping our syndicate desk directly via Bridgeway or submit your memo to our verified queue.', tags: ['#Fintech', '#Syndication', '#SeriesA', '#BilateralVenture'], interested: 89, comments: 31, engagementScore: 82, createdAt: 5 },
  { id: 'kamran', name: 'Kamran Shafi', initials: 'KS', kind: 'founder', headline: 'Co-Founder @ MedScale · HealthTech', time: '1d', body: 'Milestone unlocked! With the help of the Bridgeway broker network, our $3M Pre-Series A oversubscribed within 18 days. Gratitude to our lead syndicate and 14 co-investors who closed through standardized covenant workflows.', tags: [], interested: 124, comments: 26, engagementScore: 77, createdAt: 4, banner: 'celebration' },
  { id: 'zainab', name: 'Zainab Bilal', initials: 'ZB', kind: 'founder', headline: 'CTO at HealthBridge AI · Healthtech', time: '1d', body: 'We are expanding our clinical AI platform with new hospital partners across the region. Looking to meet investors who understand responsible healthcare infrastructure.', tags: ['#Healthtech', '#AI', '#SeriesA'], interested: 36, comments: 12, engagementScore: 60, createdAt: 3 },
  { id: 'apex', name: 'Apex Capital Syndicate', initials: 'AC', kind: 'investor', headline: 'Venture Syndicate · $40M AUM', time: '2d', body: 'Our syndicate is reviewing exceptional teams building in logistics, fintech and climate resilience. Introductions from founders and co-investors are welcome.', tags: ['#Syndicate', '#ClimateTech'], interested: 52, comments: 9, engagementScore: 48, createdAt: 2 },
  { id: 'solar', name: 'SolarGrid Energy', initials: 'SG', kind: 'founder', headline: 'Pre-A Clean Energy Hardware', time: '3d', body: 'Our modular storage pilot is now live. We are opening a strategic allocation for partners focused on distributed energy systems.', tags: ['#CleanEnergy', '#Hardware'], interested: 28, comments: 6, engagementScore: 35, createdAt: 1 },
]

export const suggestions = [
  { initials: 'ZB', name: 'Zainab Bilal', detail: 'CTO at HealthBridge AI · Healthtech' },
  { initials: 'AC', name: 'Apex Capital Syndicate', detail: 'Venture Syndicate with $40M AUM' },
  { initials: 'SG', name: 'SolarGrid Energy', detail: 'Pre-A Clean Energy Hardware' },
]
