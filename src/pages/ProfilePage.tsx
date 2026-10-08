import { ProfileHeaderCard } from '@/features/profile/components/ProfileHeaderCard'
import { ProfileAnalyticsCard } from '@/features/profile/components/ProfileAnalyticsCard'
import { ProfileAboutCard } from '@/features/profile/components/ProfileAboutCard'
import { ProfileMilestonesCard } from '@/features/profile/components/ProfileMilestonesCard'
import { ProfileActivityCard } from '@/features/profile/components/ProfileActivityCard'
import { ProfileExperienceCard } from '@/features/profile/components/ProfileExperienceCard'
import { ProfileSkillsCard } from '@/features/profile/components/ProfileSkillsCard'
import { ProfileInterestsCard } from '@/features/profile/components/ProfileInterestsCard'
import { ProfileSidebar } from '@/features/profile/components/ProfileSidebar'

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-[1128px] px-3 sm:px-4 py-4 sm:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Main Content Column (8 cols on large screens, ~68%) */}
        <div className="lg:col-span-8 space-y-4">
          <ProfileHeaderCard />
          <ProfileAboutCard />
          <ProfileAnalyticsCard />
          <ProfileMilestonesCard />
          <ProfileActivityCard />
          <ProfileExperienceCard />
          <ProfileSkillsCard />
          <ProfileInterestsCard />
        </div>

        {/* Sidebar Column (4 cols on large screens, ~32%) with independent scroll and hidden scrollbar */}
        <div className="lg:col-span-4 lg:sticky lg:top-[88px] lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto lg:overscroll-contain no-scrollbar">
          <ProfileSidebar />
        </div>
      </div>
    </div>
  )
}
