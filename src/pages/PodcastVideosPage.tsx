import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  Bookmark,
  Check,
  ExternalLink,
  Play,
  Search,
  Share2,
  Sparkles,
  Star,
  Tv,
  X,
} from 'lucide-react'
import { Avatar } from '@/components/common/Avatar'
import { EmptyState } from '@/components/common/EmptyState'
import { RoleChip } from '@/components/common/RoleChip'
import { VerifiedMark } from '@/components/common/VerifiedMark'
import { cn } from 'cn'
import { CategoryDropdown } from '@/features/podcasts/components/CategoryDropdown'
import { episodes, featuredEpisode, formatClock, formatPlays, formatPublishedDays } from '@/features/podcasts/data'
import type { Category, Episode, PodcastRole } from '@/features/podcasts/types'
import { usePlayerStore } from '@/features/podcasts/usePlayerStore'

const AVATAR_TONES: Record<PodcastRole, 'indigo' | 'amber' | 'violet'> = {
  Investor: 'indigo',
  Founder: 'amber',
  'Legal Partner': 'violet',
}

// Combine featured episode and all episodes into a unified library of YouTube channel videos
const allInterviews: Episode[] = [
  {
    id: featuredEpisode.id,
    title: featuredEpisode.title,
    host: featuredEpisode.hostName,
    role: 'Investor',
    plays: featuredEpisode.plays,
    rating: 5.0,
    publishedDaysAgo: featuredEpisode.publishedDaysAgo,
    durationSeconds: featuredEpisode.durationSeconds,
    categories: ['Fundraising tips', 'Founder stories'],
    icon: featuredEpisode.icon,
    variant: 'indigo',
    shape: 'wave',
    accent: 'amber',
    youtubeId: featuredEpisode.youtubeId || 'dGl9kYq5KKs',
    description: featuredEpisode.summary,
  },
  ...episodes,
]

export default function PodcastVideosPage() {
  const [activeModalVideo, setActiveModalVideo] = useState<Episode | null>(null)
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(false)

  const saved = usePlayerStore((state) => state.saved)
  const toggleSaved = usePlayerStore((state) => state.toggleSaved)

  const filteredInterviews = useMemo(() => {
    return allInterviews.filter((item) => {
      const matchesCategory =
        activeCategory === 'All' || item.categories.includes(activeCategory as any)
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.host.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  function handleShare(video: Episode) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `https://www.youtube.com/watch?v=${video.youtubeId || 'EngW7tLk6R8'}`,
      )
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F4EF]">
      <main className="mx-auto w-full max-w-[1280px] min-w-0 px-4 py-6 pb-28 sm:px-6">
        {/* Top Header Row with Search Bar at TOP */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/podcasts"
            className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#14213D] shadow-xs transition-all hover:border-[#3F4FA0] hover:bg-[#F8FAFC]"
          >
            <ArrowLeft className="size-4 text-[#3F4FA0]" />
            <span>Back to Podcasts</span>
          </Link>

          {/* Search bar at top of this page */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search interviews, topics, speakers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-xl border border-[#CBD5E1] bg-white pl-10 pr-4 text-xs sm:text-sm text-[#14213D] placeholder-[#94A3B8] shadow-xs focus:border-[#3F4FA0] focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-xs transition-all hover:bg-red-700 cursor-pointer"
            >
              <Tv className="size-4" />
              <span>YouTube Channel</span>
              <ExternalLink className="size-3.5 opacity-80" />
            </a>
          </div>
        </div>

        {/* Studio Channel Banner */}
        <div className="mt-5 rounded-2xl bg-[#14213D] p-6 text-white sm:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#F5B544]/20 px-3 py-1 text-[11px] font-bold tracking-wide text-[#F5B544] uppercase">
                <Sparkles className="size-3.5" />
                Bridgeway Official Channel
              </div>
              <h1 className="mt-2 font-display text-[24px] leading-tight font-bold text-white sm:text-[32px]">
                Founder &amp; Investor Interviews
              </h1>
              <p className="mt-1 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
                All video interviews from our official YouTube channel. Stream in-depth sessions with startup founders, angel syndicates, and venture partners.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-[#CBD5E1]">
              <span className="rounded-lg bg-white/10 px-3 py-1.5 font-semibold text-white">
                {allInterviews.length} Videos Available
              </span>
            </div>
          </div>
        </div>

        {/* Videos Section Heading with Category Dropdown Filter */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#E5E7EB] pb-3">
          <div className="min-w-0">
            <h2 className="font-display text-[22px] font-bold text-[#14213D] sm:text-[26px]">
              All Videos ({filteredInterviews.length})
            </h2>
            <p className="mt-0.5 text-xs text-[#64748B]">Click any video to stream or watch on YouTube</p>
          </div>
          <div className="shrink-0">
            <CategoryDropdown value={activeCategory} onChange={setActiveCategory} />
          </div>
        </div>

        {/* Videos Grid */}
        {filteredInterviews.length === 0 ? (
          <div className="mt-8">
            <EmptyState text="No videos match your search criteria" />
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredInterviews.map((item) => {
              const isSaved = saved.some((s) => s.id === item.id)

              return (
                <div
                  key={item.id}
                  onClick={() => setActiveModalVideo(item)}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white text-left transition-all duration-200 hover:-translate-y-1 hover:border-[#CBD5E1] hover:shadow-lg cursor-pointer"
                >
                  {/* Video Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    <img
                      src={`https://img.youtube.com/vi/${item.youtubeId || 'EngW7tLk6R8'}/hqdefault.jpg`}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* YouTube Play Badge Overlay */}
                    <div className="absolute inset-0 grid place-items-center bg-black/25 transition-opacity group-hover:bg-black/45">
                      <div className="grid size-12 place-items-center rounded-full bg-red-600 text-white shadow-lg transition-transform group-hover:scale-110">
                        <Play className="size-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Duration badge */}
                    <span className="absolute bottom-2 right-2 rounded-md bg-black/85 px-1.5 py-0.5 font-mono text-[11px] text-white">
                      {formatClock(item.durationSeconds)}
                    </span>

                    {/* Bookmark quick button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleSaved({
                          id: item.id,
                          title: item.title,
                          host: item.host,
                          durationSeconds: item.durationSeconds,
                          icon: item.icon,
                          variant: item.variant,
                        })
                      }}
                      title={isSaved ? 'Remove from saved' : 'Save video'}
                      className={cn(
                        'absolute top-2 right-2 grid size-7 place-items-center rounded-full backdrop-blur-md transition-all cursor-pointer',
                        isSaved
                          ? 'bg-[#14213D]/95 text-[#F5B544] shadow-md ring-1 ring-[#F5B544]'
                          : 'bg-black/60 text-white/80 hover:bg-black/90 hover:text-[#F5B544]',
                      )}
                    >
                      <Bookmark className={cn('size-3.5', isSaved && 'fill-[#F5B544]')} />
                    </button>
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <div className="flex items-center justify-between gap-1 text-[11px] text-[#64748B]">
                        {item.role === 'Legal Partner' ? (
                          <span className="inline-flex shrink-0 whitespace-nowrap rounded-full border border-[#CBD5E1] bg-[#F1F5F9] px-2 py-0.5 text-[10px] font-semibold text-[#475569]">
                            Legal Partner
                          </span>
                        ) : (
                          <RoleChip role={item.role} />
                        )}
                        {item.rating && (
                          <span className="flex items-center gap-0.5 font-semibold text-[#14213D]">
                            <Star className="size-3 fill-[#F5B544] text-[#F5B544]" />
                            <span>{item.rating.toFixed(1)}</span>
                          </span>
                        )}
                      </div>

                      <h4 className="mt-2 line-clamp-2 text-sm leading-snug font-bold text-[#14213D] group-hover:text-[#3F4FA0]">
                        {item.title}
                      </h4>

                      <div className="mt-2 flex items-center gap-1.5 text-xs text-[#475569]">
                        <Avatar name={item.host} size={22} tone={AVATAR_TONES[item.role]} />
                        <span className="truncate">{item.host}</span>
                        <VerifiedMark />
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-[#F1F5F9] pt-2.5 text-[11px] text-[#94A3B8]">
                      <span>{formatPlays(item.plays)} views</span>
                      <span>{formatPublishedDays(item.publishedDaysAgo)}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Video Player Modal */}
        {activeModalVideo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setActiveModalVideo(null)}
          >
            <div
              className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveModalVideo(null)}
                className="absolute right-3 top-3 z-30 grid size-8 place-items-center rounded-full bg-black/60 text-white backdrop-blur-md transition-all hover:bg-black hover:scale-105 cursor-pointer"
                title="Close"
              >
                <X className="size-4" />
              </button>

              {/* Responsive 16:9 YouTube iframe Player */}
              <div className="relative aspect-video w-full bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${activeModalVideo.youtubeId || 'EngW7tLk6R8'}?autoplay=1&enablejsapi=1`}
                  title={activeModalVideo.title}
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Modal Details & Action Bar */}
              <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B]">
                      {activeModalVideo.role === 'Legal Partner' ? (
                        <span className="inline-flex shrink-0 whitespace-nowrap rounded-full border border-[#CBD5E1] bg-[#F1F5F9] px-2.5 py-0.5 text-[11px] font-semibold text-[#475569]">
                          Legal Partner
                        </span>
                      ) : (
                        <RoleChip role={activeModalVideo.role} />
                      )}
                      <span className="flex items-center gap-1 font-semibold text-[#14213D]">
                        <Star className="size-3.5 fill-[#F5B544] text-[#F5B544]" />
                        <span>{activeModalVideo.rating ? activeModalVideo.rating.toFixed(1) : '5.0'}</span>
                      </span>
                      <span>&bull;</span>
                      <span>{formatPlays(activeModalVideo.plays)} views</span>
                      <span>&bull;</span>
                      <span>Published {formatPublishedDays(activeModalVideo.publishedDaysAgo)}</span>
                    </div>

                    <h3 className="mt-2 font-display text-[20px] font-bold text-[#14213D] sm:text-[24px]">
                      {activeModalVideo.title}
                    </h3>

                    <div className="mt-2.5 flex items-center gap-2 text-sm text-[#475569]">
                      <Avatar name={activeModalVideo.host} size={28} tone={AVATAR_TONES[activeModalVideo.role]} />
                      <span className="font-semibold text-[#14213D]">{activeModalVideo.host}</span>
                      <VerifiedMark />
                    </div>

                    {activeModalVideo.description && (
                      <p className="mt-3 text-sm leading-relaxed text-[#475569]">
                        {activeModalVideo.description}
                      </p>
                    )}
                  </div>

                  {/* Actions in Modal */}
                  <div className="flex shrink-0 items-center gap-2">
                    <a
                      href={`https://www.youtube.com/watch?v=${activeModalVideo.youtubeId || 'EngW7tLk6R8'}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-red-600 px-3 text-xs font-bold text-white shadow-xs transition-all hover:bg-red-700 cursor-pointer"
                    >
                      <Tv className="size-3.5" />
                      <span>Watch on YouTube</span>
                      <ExternalLink className="size-3" />
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        toggleSaved({
                          id: activeModalVideo.id,
                          title: activeModalVideo.title,
                          host: activeModalVideo.host,
                          durationSeconds: activeModalVideo.durationSeconds,
                          icon: activeModalVideo.icon,
                          variant: activeModalVideo.variant,
                        })
                      }
                      className={cn(
                        'flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-semibold transition-all cursor-pointer',
                        saved.some((s) => s.id === activeModalVideo.id)
                          ? 'border-[#14213D] bg-[#14213D] text-[#F5B544]'
                          : 'border-[#CBD5E1] bg-white text-[#14213D] hover:bg-[#F8FAFC]',
                      )}
                    >
                      <Bookmark className="size-3.5 fill-current" />
                      <span>{saved.some((s) => s.id === activeModalVideo.id) ? 'Saved' : 'Save'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShare(activeModalVideo)}
                      className="flex h-9 items-center gap-1.5 rounded-xl border border-[#CBD5E1] bg-white px-3 text-xs font-semibold text-[#14213D] transition-all hover:bg-[#F8FAFC] cursor-pointer"
                    >
                      {copied ? <Check className="size-3.5 text-emerald-600" /> : <Share2 className="size-3.5 text-[#3F4FA0]" />}
                      <span>{copied ? 'Copied' : 'Share'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
