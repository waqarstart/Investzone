import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Ban,
  BarChart2,
  Bookmark,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Coins,
  Download,
  ExternalLink,
  Flag,
  Handshake,
  Info,
  Mail,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Repeat2,
  Rocket,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  ThumbsUp,
  TrendingUp,
  Trophy,
  UserPlus,
  X,
} from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { MEMBER_PROFILES, type MemberProfileData } from '@/features/profile/data/memberProfiles'
import { ProfileSidebar } from '@/features/profile/components/ProfileSidebar'

type ActivityTab = 'posts' | 'comments' | 'images'

function getCategoryIcon(cat?: string) {
  switch (cat) {
    case 'funding':
      return <Coins className="size-4 text-[#F5B544]" />
    case 'traction':
      return <TrendingUp className="size-4 text-emerald-600" />
    case 'partnership':
      return <Handshake className="size-4 text-[#3F4FA0]" />
    case 'product':
      return <Rocket className="size-4 text-purple-600" />
    case 'award':
      return <Trophy className="size-4 text-[#F5B544]" />
    default:
      return <Sparkles className="size-4 text-[#F5B544]" />
  }
}

export default function MemberProfilePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const member: MemberProfileData | undefined = id ? MEMBER_PROFILES[id] : undefined

  const [isConnected, setIsConnected] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isTracked, setIsTracked] = useState(true)
  const [isBlocked, setIsBlocked] = useState(false)
  const [activeTab, setActiveTab] = useState<ActivityTab>('posts')
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({})

  // Dropdowns & Modals
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [aboutMemberModalOpen, setAboutMemberModalOpen] = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [selectedReportReason, setSelectedReportReason] = useState('Suspicious deal terms')

  const moreMenuRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const firstName = member ? member.name.split(' ')[0] : 'Member'

  // Close more menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setMoreMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Escape key closes modals/menus
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMoreMenuOpen(false)
        setContactModalOpen(false)
        setAboutMemberModalOpen(false)
        setReportModalOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const checkScroll = useCallback(() => {
    const el = carouselRef.current
    if (!el) {
      setCanScrollLeft(false)
      setCanScrollRight(false)
      return
    }
    setCanScrollLeft(el.scrollLeft > 5)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5)
  }, [])

  useEffect(() => {
    checkScroll()
    const el = carouselRef.current
    if (!el) return

    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)
    const timer = setTimeout(checkScroll, 100)

    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
      clearTimeout(timer)
    }
  }, [activeTab, member?.posts?.length, checkScroll])

  function scrollCarousel(direction: 'left' | 'right') {
    if (!carouselRef.current) return
    const offset = direction === 'left' ? -340 : 340
    carouselRef.current.scrollBy({ left: offset, behavior: 'smooth' })
    setTimeout(checkScroll, 350)
  }

  function toggleLike(postId: string) {
    setLikedMap((prev) => {
      const next = !prev[postId]
      if (next) toast.success('Liked post')
      return { ...prev, [postId]: next }
    })
  }

  if (!member) {
    return (
      <div className="mx-auto max-w-[1128px] px-4 py-12 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-4">
          <Briefcase className="size-8" />
        </div>
        <h2 className="text-xl font-bold text-[#14213D]">Member Profile Not Found</h2>
        <p className="mt-1 text-sm text-[#64748B]">The profile you are looking for does not exist or has been made private.</p>
        <Link
          to="/profile"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#14213D] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#3F4FA0] transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Return to My Profile</span>
        </Link>
      </div>
    )
  }

  function handleConnect() {
    setIsConnected(!isConnected)
    if (!isConnected) {
      toast.success(`Connection request sent to ${member?.name}`)
    } else {
      toast.info(`Connection request withdrawn`)
    }
  }

  function handleFollow() {
    setIsFollowing(!isFollowing)
    setMoreMenuOpen(false)
    if (!isFollowing) {
      toast.success(`You are now following ${member?.name}`)
    } else {
      toast.info(`Unfollowed ${member?.name}`)
    }
  }

  function handleTrack() {
    setIsTracked(!isTracked)
    if (!isTracked) {
      toast.success(`Now tracking ${member?.name}'s deal flow`)
    } else {
      toast.info(`Removed ${member?.name} from tracked deal flow`)
    }
  }

  function handleCopyShare() {
    navigator.clipboard?.writeText(window.location.href)
    toast.success('Profile URL copied to clipboard')
  }

  function handleSendInMessage() {
    setMoreMenuOpen(false)
    navigator.clipboard?.writeText(window.location.href)
    toast.success(`Profile link copied. Redirecting to messages...`)
    setTimeout(() => {
      navigate('/communications')
    }, 700)
  }

  function handleSavePDF() {
    setMoreMenuOpen(false)
    toast.info('Preparing print / PDF format...')
    setTimeout(() => {
      window.print()
    }, 300)
  }

  function handleBlock() {
    setIsBlocked(!isBlocked)
    if (!isBlocked) {
      toast.error(`${member?.name} has been blocked`)
    } else {
      toast.success(`${member?.name} unblocked`)
    }
  }

  function submitReport() {
    setReportModalOpen(false)
    toast.success(`Report submitted regarding ${member?.name}. Our Trust & Safety team will review it.`)
  }

  // Member posts fallback
  const memberPosts = member.posts && member.posts.length > 0
    ? member.posts
    : member.recentPost
      ? [
          {
            id: `${member.id}-post-1`,
            body: member.recentPost.body,
            time: member.recentPost.time,
            likes: member.recentPost.likes,
            comments: member.recentPost.comments,
            impressions: 340,
          },
        ]
      : []

  // Member milestones fallback
  const memberMilestones = member.milestones && member.milestones.length > 0
    ? member.milestones
    : [
        {
          id: `${member.id}-m-1`,
          title: `${member.role === 'Founder' ? 'Seed Target Finalized' : 'Allocation Mandate Activated'}`,
          category: 'funding' as const,
          date: 'Sep 2026',
          metric: member.metrics || 'Verified Check',
          description: `Active on Bridgeway syndicate rails with ${member.headline}.`,
        },
      ]

  // Member comments mock
  const memberComments = [
    {
      id: `${member.id}-c-1`,
      author: member.name,
      time: '3d',
      content: 'Standardized diligence terms make syndicate participation frictionless on Bridgeway.',
    },
    {
      id: `${member.id}-c-2`,
      author: member.name,
      time: '1w',
      content: 'Great execution by the team! Looking forward to co-investing in the follow-on allocation.',
    },
  ]

  return (
    <div className="mx-auto max-w-[1128px] px-3 sm:px-4 py-4 sm:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Main Content Column (Matching ProfilePage order) */}
        <div className="lg:col-span-8 space-y-4">
          {/* 1. Header Card */}
          <article className="overflow-visible rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_3px_14px_rgba(20,33,61,0.06)] relative">
            {/* Banner with inside Back arrow button */}
            <div className="relative h-32 sm:h-44 w-full bg-gradient-to-r from-[#14213D] via-[#1E2D4F] to-[#3F4FA0] rounded-t-2xl overflow-hidden">
              <div className="absolute inset-0 opacity-15 [background-image:radial-gradient(#F5B544_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Inside Back Arrow Button (Icon only) */}
              <button
                type="button"
                onClick={() => navigate(-1)}
                title="Go back"
                className="absolute left-3.5 top-3.5 z-10 flex size-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-all cursor-pointer shadow-md"
                aria-label="Back"
              >
                <ArrowLeft className="size-4.5" />
              </button>

              {/* Inside Share Profile button */}
              <button
                type="button"
                onClick={handleCopyShare}
                title="Share profile"
                className="absolute right-3.5 top-3.5 z-10 flex size-9 sm:w-auto sm:px-3 sm:py-1.5 items-center justify-center gap-1.5 rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-all cursor-pointer shadow-md text-xs font-semibold"
                aria-label="Share profile"
              >
                <Share2 className="size-3.5" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>

            {/* Profile Intro (Exact LinkedIn structure) */}
            <div className="px-5 sm:px-7 pb-6 pt-0 relative">
              {/* Circular Avatar */}
              <div className="flex items-end justify-between -mt-16 sm:-mt-20 mb-3">
                <div className="relative">
                  <div className="flex size-28 sm:size-32 shrink-0 items-center justify-center rounded-full bg-[#14213D] text-3xl font-extrabold text-white shadow-xl ring-4 ring-white overflow-hidden">
                    {member.avatar ? (
                      <img src={member.avatar} alt={member.name} className="h-full w-full object-cover" />
                    ) : (
                      <span>{member.initials}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Name & Degree connection */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-bold text-[#14213D] tracking-tight">
                    {member.name} <span className="text-sm font-normal text-[#64748B]">· 2nd</span>
                  </h1>

                  {/* Only green tick */}
                  {member.verified && (
                    <span title="Verified Member" className="flex items-center text-emerald-600">
                      <CheckCircle2 className="size-4.5 fill-emerald-100 text-emerald-600" />
                    </span>
                  )}

                  {/* Only Investor / Founder stays */}
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${
                      member.role === 'Founder'
                        ? 'bg-[#FEF3D8] text-[#92400E]'
                        : 'bg-[#EEF2FF] text-[#3730A3]'
                    }`}
                  >
                    {member.role}
                  </span>
                </div>

                {/* Headline */}
                <p className="text-xs sm:text-sm text-[#334155] leading-relaxed max-w-2xl">
                  {member.headline}
                </p>

                {/* Location · Contact info */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#64748B] pt-0.5">
                  <span>{member.location}</span>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => setContactModalOpen(true)}
                    className="font-semibold text-[#3F4FA0] hover:underline cursor-pointer"
                  >
                    Contact info
                  </button>
                </div>

                {/* Connections count */}
                <div className="pt-0.5">
                  <span className="text-xs hover:underline cursor-pointer">
                    <span className="font-bold text-[#3F4FA0]">{member.connectionsCount.toLocaleString()}+</span>{' '}
                    <span className="font-semibold text-[#14213D]">connections</span>
                  </span>
                </div>

                {/* Mutual connections row */}
                <div className="flex items-center gap-2 pt-0.5">
                  <div className="flex -space-x-1.5">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80"
                      alt="Mutual contact"
                      className="size-5 rounded-full ring-2 ring-white object-cover"
                    />
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80"
                      alt="Mutual contact"
                      className="size-5 rounded-full ring-2 ring-white object-cover"
                    />
                  </div>
                  <p className="text-xs text-[#475569]">
                    <span className="font-semibold text-[#14213D] hover:text-[#3F4FA0] hover:underline cursor-pointer">Zahra, Muhammad</span> and 12 other mutual connections
                  </p>
                </div>

                {/* Metrics Highlight pill */}
                {member.metrics && (
                  <div className="pt-1">
                    <div className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50/70 px-3 py-1 text-xs font-semibold text-emerald-900">
                      <Sparkles className="size-3.5 text-emerald-600" />
                      <span>{member.metrics}</span>
                    </div>
                  </div>
                )}

                {/* BUTTONS ROW: [+ Connect] [Message] [...] with Dropdown */}
                <div className="flex items-center gap-2 pt-3 flex-wrap relative z-20">
                  {/* 1. + Connect Button */}
                  <button
                    type="button"
                    onClick={handleConnect}
                    className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold transition-all cursor-pointer shadow-xs ${
                      isConnected
                        ? 'border border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : 'bg-[#14213D] text-white hover:bg-[#3F4FA0]'
                    }`}
                  >
                    {isConnected ? (
                      <>
                        <Check className="size-3.5 text-emerald-600" />
                        <span>Connected</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="size-3.5" />
                        <span>Connect</span>
                      </>
                    )}
                  </button>

                  {/* 2. Message Button */}
                  <button
                    type="button"
                    onClick={() => navigate('/communications')}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#3F4FA0] bg-white px-4 py-2 text-xs font-bold text-[#3F4FA0] hover:bg-[#EEF0FA] transition-all cursor-pointer shadow-2xs"
                  >
                    <Send className="size-3.5 -rotate-12" />
                    <span>Message</span>
                  </button>

                  {/* 3. More (...) Button with Dropdown Menu */}
                  <div className="relative" ref={moreMenuRef}>
                    <button
                      type="button"
                      onClick={() => setMoreMenuOpen((prev) => !prev)}
                      className={`flex size-8.5 items-center justify-center rounded-full border transition-colors cursor-pointer ${
                        moreMenuOpen
                          ? 'border-[#3F4FA0] bg-[#EEF0FA] text-[#3F4FA0]'
                          : 'border-slate-300 bg-white text-[#14213D] hover:bg-[#EEF0FA] hover:border-[#3F4FA0] hover:text-[#3F4FA0]'
                      }`}
                      aria-label="More actions"
                      title="More actions"
                    >
                      <MoreHorizontal className="size-4.5" />
                    </button>

                    {/* LinkedIn Popover Menu */}
                    {moreMenuOpen && (
                      <div className="absolute left-0 top-full mt-1.5 w-64 rounded-2xl border border-slate-200 bg-white py-2 shadow-[0_10px_30px_rgba(20,33,61,0.12)] z-50 animate-in fade-in zoom-in-95 duration-100">
                        {/* Send profile in a message */}
                        <button
                          type="button"
                          onClick={handleSendInMessage}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-xs font-semibold text-[#14213D] hover:bg-[#EEF0FA] hover:text-[#3F4FA0] transition-colors cursor-pointer text-left"
                        >
                          <Send className="size-4 text-[#3F4FA0] -rotate-12 shrink-0" />
                          <span>Send profile in a message</span>
                        </button>

                        {/* Save to PDF */}
                        <button
                          type="button"
                          onClick={handleSavePDF}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-xs font-semibold text-[#14213D] hover:bg-[#EEF0FA] hover:text-[#3F4FA0] transition-colors cursor-pointer text-left"
                        >
                          <Download className="size-4 text-[#3F4FA0] shrink-0" />
                          <span>Save to PDF</span>
                        </button>

                        {/* + Follow */}
                        <button
                          type="button"
                          onClick={handleFollow}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-xs font-semibold text-[#14213D] hover:bg-[#EEF0FA] hover:text-[#3F4FA0] transition-colors cursor-pointer text-left"
                        >
                          {isFollowing ? (
                            <>
                              <Check className="size-4 text-emerald-600 shrink-0" />
                              <span>Following</span>
                            </>
                          ) : (
                            <>
                              <Plus className="size-4 text-[#3F4FA0] shrink-0" />
                              <span>Follow</span>
                            </>
                          )}
                        </button>

                        {/* Report [FirstName] */}
                        <button
                          type="button"
                          onClick={() => {
                            setMoreMenuOpen(false)
                            setReportModalOpen(true)
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-xs font-semibold text-[#14213D] hover:bg-[#EEF0FA] hover:text-[#3F4FA0] transition-colors cursor-pointer text-left"
                        >
                          <Flag className="size-4 text-amber-600 shrink-0" />
                          <span>Report {firstName}</span>
                        </button>

                        {/* Block [FirstName] */}
                        <button
                          type="button"
                          onClick={() => {
                            setMoreMenuOpen(false)
                            handleBlock()
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-xs font-semibold text-[#14213D] hover:bg-[#EEF0FA] hover:text-[#3F4FA0] transition-colors cursor-pointer text-left"
                        >
                          <Ban className="size-4 text-red-600 shrink-0" />
                          <span>{isBlocked ? `Unblock ${firstName}` : `Block ${firstName}`}</span>
                        </button>

                        {/* About this member */}
                        <button
                          type="button"
                          onClick={() => {
                            setMoreMenuOpen(false)
                            setAboutMemberModalOpen(true)
                          }}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-xs font-semibold text-[#14213D] hover:bg-[#EEF0FA] hover:text-[#3F4FA0] transition-colors cursor-pointer text-left"
                        >
                          <Info className="size-4 text-[#3F4FA0] shrink-0" />
                          <span>About this member</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* 2. About Card */}
          <article className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-[0_3px_14px_rgba(20,33,61,0.06)]">
            <h2 className="text-base font-bold text-[#14213D] mb-3">About</h2>
            <p className="text-xs sm:text-sm text-[#334155] leading-relaxed whitespace-pre-wrap">{member.bio}</p>
          </article>

          {/* 3. Success Milestones Card (Matching ProfileMilestonesCard) */}
          <article className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-[0_3px_14px_rgba(20,33,61,0.06)]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-[#14213D]">Success Milestones</h2>
              <span className="text-xs font-semibold text-[#64748B]">
                {memberMilestones.length} Recorded
              </span>
            </div>

            <div className="divide-y divide-[#F1F5F9] space-y-4">
              {memberMilestones.map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex items-start justify-between gap-3 ${idx > 0 ? 'pt-4' : ''}`}
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#14213D]/5 border border-[#14213D]/10 mt-0.5">
                      {getCategoryIcon(item.category)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-[#14213D] leading-snug break-words [overflow-wrap:anywhere]">
                          {item.title}
                        </h3>
                        <span className="text-[11px] text-[#94A3B8] font-medium">{item.date}</span>
                      </div>

                      {item.metric && (
                        <div className="mt-1.5 inline-flex items-center gap-1 rounded-md bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-bold text-[#3F4FA0]">
                          <Sparkles className="size-2.5 text-[#F5B544]" />
                          <span>{item.metric}</span>
                        </div>
                      )}

                      {item.description && (
                        <p className="mt-1.5 text-xs text-[#475569] leading-relaxed break-words [overflow-wrap:anywhere]">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* 4. Activity Card (LinkedIn-style Carousel matching ProfileActivityCard) */}
          <article className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-[0_3px_14px_rgba(20,33,61,0.06)]">
            {/* Top Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-[#14213D] leading-tight">
                  Activity
                </h2>
                <span className="text-xs font-semibold text-[#3F4FA0] block mt-0.5">
                  {member.followersCount.toLocaleString()} followers
                </span>
              </div>
            </div>

            {/* Filter Pills Row */}
            <div className="flex items-center gap-2 pb-3.5 pt-1 overflow-x-auto [scrollbar-width:none]">
              <button
                type="button"
                onClick={() => setActiveTab('posts')}
                className={`rounded-full px-4 py-1 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'posts'
                    ? 'bg-[#14213D] text-[#F5B544] shadow-xs'
                    : 'border border-slate-300 text-[#64748B] hover:bg-slate-50 hover:text-[#14213D]'
                }`}
              >
                Posts
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('comments')}
                className={`rounded-full px-4 py-1 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'comments'
                    ? 'bg-[#14213D] text-[#F5B544] shadow-xs'
                    : 'border border-slate-300 text-[#64748B] hover:bg-slate-50 hover:text-[#14213D]'
                }`}
              >
                Comments
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('images')}
                className={`rounded-full px-4 py-1 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'images'
                    ? 'bg-[#14213D] text-[#F5B544] shadow-xs'
                    : 'border border-slate-300 text-[#64748B] hover:bg-slate-50 hover:text-[#14213D]'
                }`}
              >
                Images
              </button>
            </div>

            {/* Carousel Container */}
            <div className="relative group/carousel mt-1">
              {/* Scroll Left Button */}
              {canScrollLeft && (
                <button
                  type="button"
                  onClick={() => scrollCarousel('left')}
                  className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 flex size-9 items-center justify-center rounded-full border border-[#CBD5E1] bg-white text-[#14213D] shadow-md hover:bg-slate-50 hover:scale-105 transition-all cursor-pointer"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="size-4.5" />
                </button>
              )}

              {/* Scroll Right Button */}
              {canScrollRight && (
                <button
                  type="button"
                  onClick={() => scrollCarousel('right')}
                  className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 flex size-9 items-center justify-center rounded-full border border-[#CBD5E1] bg-white text-[#14213D] shadow-md hover:bg-slate-50 hover:scale-105 transition-all cursor-pointer"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="size-4.5" />
                </button>
              )}

              {/* 1. POSTS CAROUSEL */}
              {activeTab === 'posts' && (
                memberPosts.length > 0 ? (
                  <div
                    ref={carouselRef}
                    className="flex gap-3.5 overflow-x-auto pb-2 pt-1 [scrollbar-width:none] scroll-smooth snap-x"
                  >
                    {memberPosts.map((post) => {
                      const isLiked = !!likedMap[post.id]
                      const totalLikes = post.likes + (isLiked ? 1 : 0)

                      return (
                        <div
                          key={post.id}
                          className="w-[290px] sm:w-[325px] shrink-0 snap-start rounded-xl border border-[#E2E8F0] bg-white p-3.5 flex flex-col justify-between shadow-xs hover:border-[#CBD5E1] transition-all"
                        >
                          <div>
                            {/* Author Header */}
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="size-10 shrink-0 rounded-full overflow-hidden bg-[#14213D] text-white flex items-center justify-center font-bold text-xs ring-2 ring-[#3F4FA0]">
                                  {member.avatar ? (
                                    <img
                                      src={member.avatar}
                                      alt={member.name}
                                      className="size-full object-cover"
                                    />
                                  ) : (
                                    <span>{member.initials}</span>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-bold text-[#14213D] truncate leading-tight">
                                    {member.name}
                                  </p>
                                  <p className="text-[11px] text-[#64748B] truncate leading-tight mt-0.5">
                                    {member.headline}
                                  </p>
                                  <p className="text-[10px] text-[#94A3B8] mt-0.5 leading-none">
                                    {post.time}
                                  </p>
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => toast.info('Post options')}
                                className="text-[#64748B] hover:text-[#14213D] p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                              >
                                <MoreHorizontal className="size-4" />
                              </button>
                            </div>

                            {/* Post Body */}
                            <p className="text-xs text-[#14213D] mt-2.5 line-clamp-3 leading-relaxed break-words whitespace-pre-wrap">
                              {post.body}
                            </p>

                            {/* Post Media Preview */}
                            {post.images?.[0] && (
                              <div className="mt-2.5 overflow-hidden rounded-lg border border-[#E2E8F0] bg-slate-50">
                                <img
                                  src={post.images[0]}
                                  alt="Post preview"
                                  className="h-44 w-full object-cover"
                                />
                              </div>
                            )}

                            {/* Reactions Stat Row */}
                            <div className="mt-2.5 pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="flex -space-x-1">
                                  <span className="flex size-4 items-center justify-center rounded-full bg-[#3F4FA0] text-[9px] text-white">👍</span>
                                  <span className="flex size-4 items-center justify-center rounded-full bg-[#14213D] text-[9px] text-[#F5B544]">👏</span>
                                </span>
                                <span className="truncate">
                                  {totalLikes} likes
                                </span>
                              </div>
                              <span className="shrink-0">{post.comments} comments</span>
                            </div>

                            {/* 4 Action Buttons Row */}
                            <div className="mt-2 pt-1 border-t border-[#F1F5F9] flex items-center justify-around text-[#64748B]">
                              <button
                                type="button"
                                onClick={() => toggleLike(post.id)}
                                className={`flex items-center gap-1 p-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer text-xs font-semibold ${
                                  isLiked ? 'text-[#3F4FA0]' : ''
                                }`}
                              >
                                <ThumbsUp className={`size-3.5 ${isLiked ? 'fill-[#3F4FA0]' : ''}`} />
                              </button>

                              <button
                                type="button"
                                onClick={() => toast.info('Opening comments thread')}
                                className="flex items-center gap-1 p-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer text-xs font-semibold"
                              >
                                <MessageSquare className="size-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => toast.success('Post reposted to your network')}
                                className="flex items-center gap-1 p-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer text-xs font-semibold"
                              >
                                <Repeat2 className="size-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard?.writeText(window.location.href)
                                  toast.success('Post link copied to clipboard')
                                }}
                                className="flex items-center gap-1 p-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer text-xs font-semibold"
                              >
                                <Send className="size-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Card Footer: Impressions & View Post */}
                          <div className="mt-2.5 pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px]">
                            <span className="flex items-center gap-1 font-semibold text-[#14213D]">
                              <BarChart2 className="size-3.5 text-[#64748B]" />
                              <span>{post.impressions || 320} impressions</span>
                            </span>
                            <span className="font-bold text-[#3F4FA0]">
                              Active post
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center rounded-xl border border-dashed border-[#E2E8F0] bg-slate-50/50">
                    <p className="text-xs font-bold text-[#14213D]">No posts shared yet</p>
                  </div>
                )
              )}

              {/* 2. COMMENTS CAROUSEL */}
              {activeTab === 'comments' && (
                <div
                  ref={carouselRef}
                  className="flex gap-3.5 overflow-x-auto pb-2 pt-1 [scrollbar-width:none] scroll-smooth snap-x"
                >
                  {memberComments.map((c) => (
                    <div
                      key={c.id}
                      className="w-[290px] sm:w-[325px] shrink-0 snap-start rounded-xl border border-[#E2E8F0] bg-white p-3.5 flex flex-col justify-between shadow-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="size-7 rounded-full bg-[#14213D] text-white flex items-center justify-center font-bold text-[10px]">
                            {member.initials}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#14213D] leading-tight">{member.name}</p>
                            <p className="text-[10px] text-[#94A3B8] leading-tight">{c.time} ago</p>
                          </div>
                        </div>
                        <p className="text-xs text-[#334155] leading-relaxed italic bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                          "{c.content}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 3. IMAGES CAROUSEL */}
              {activeTab === 'images' && (
                <div className="py-8 text-center rounded-xl border border-dashed border-[#E2E8F0] bg-slate-50/50">
                  <p className="text-xs font-bold text-[#14213D]">No media photos uploaded yet</p>
                </div>
              )}
            </div>

            {/* Bottom Footer - Exact LinkedIn 'Show all ➔' */}
            <div className="border-t border-[#F1F5F9] pt-3 mt-3 text-center">
              <button
                type="button"
                onClick={() => toast.info(`Viewing all ${memberPosts.length} posts by ${member.name}`)}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#475569] hover:text-[#14213D] hover:underline transition-colors py-1 cursor-pointer"
              >
                <span>Show all posts</span>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </article>

          {/* 5. Experience Card */}
          <article className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-[0_3px_14px_rgba(20,33,61,0.06)]">
            <h2 className="text-base font-bold text-[#14213D] mb-4">Experience & Track Record</h2>

            <div className="divide-y divide-[#F1F5F9] space-y-4">
              {member.experiences.map((exp, idx) => (
                <div key={exp.id} className={idx > 0 ? 'pt-4' : ''}>
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#14213D] text-white font-bold text-sm shadow-xs">
                      {exp.company[0] || 'B'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-[#14213D] truncate">{exp.title}</h3>
                      <p className="text-xs font-semibold text-[#3F4FA0]">{exp.company}</p>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] mt-0.5">
                        <Clock className="size-3 text-[#64748B]" />
                        <span>{exp.period}</span>
                        <span>·</span>
                        <span>{exp.location}</span>
                      </div>

                      <p className="mt-2 text-xs text-[#334155] leading-relaxed">{exp.description}</p>

                      {exp.metrics && (
                        <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-[#FEF3D8] px-2 py-0.5 text-[10px] font-bold text-[#92400E]">
                          <Sparkles className="size-3" />
                          <span>{exp.metrics}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </article>

          {/* 6. Skills & Endorsements Card (Matching ProfileSkillsCard) */}
          <article className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-[0_3px_14px_rgba(20,33,61,0.06)]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-[#14213D]">Skills & Endorsements</h2>
                <span className="rounded-full bg-[#EEF2FF] px-2 py-0.5 text-[10px] font-bold text-[#3730A3]">
                  {member.skills.length} Endorsed
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {member.skills.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-1.5 rounded-xl border border-[#DDE3FA] bg-[#F5F7FF] px-3 py-1.5 text-xs font-semibold text-[#14213D] shadow-2xs"
                >
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </article>
        </div>

        {/* Sidebar Column (Exact 4 cols sticky sidebar matching ProfilePage) */}
        <div className="lg:col-span-4 lg:sticky lg:top-[88px] lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto lg:overscroll-contain no-scrollbar space-y-4">
          {/* Quick Mandate Tracking Card */}
          <section className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-[0_3px_14px_rgba(20,33,61,0.06)]">
            <h3 className="text-xs font-bold text-[#14213D] mb-1">Deal Flow Tracking</h3>
            <p className="text-[11px] text-[#64748B] mb-3.5">
              Receive notifications when {member.name} opens new syndicate allocations or bilateral rounds.
            </p>

            <button
              type="button"
              onClick={handleTrack}
              className={`w-full flex items-center justify-center gap-1.5 rounded-full py-2 text-xs font-bold transition-all cursor-pointer ${
                isTracked
                  ? 'border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-[#14213D] text-[#F5B544] hover:bg-[#3F4FA0] hover:text-white'
              }`}
            >
              {isTracked ? (
                <>
                  <Check className="size-3.5 text-emerald-600" />
                  <span>Mandate Tracked</span>
                </>
              ) : (
                <>
                  <Bookmark className="size-3.5" />
                  <span>Track Mandate</span>
                </>
              )}
            </button>
          </section>

          {/* The standard right-most column from profile with that member's public URL */}
          <ProfileSidebar member={{ name: member.name, role: member.role, id: member.id }} />
        </div>
      </div>

      {/* CONTACT INFO MODAL */}
      {contactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-[#14213D]">{member.name}</h2>
              <button
                type="button"
                onClick={() => setContactModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-[#334155]">
              <div>
                <p className="font-bold text-[#14213D] text-[13px] flex items-center gap-1.5">
                  <ExternalLink className="size-3.5 text-[#3F4FA0]" />
                  <span>Bridgeway Profile</span>
                </p>
                <div className="mt-1 flex items-center justify-between gap-2 rounded-lg bg-slate-50 p-2 border border-slate-200">
                  <span className="text-[#3F4FA0] truncate">bridgeway.vc/profile/member/{member.id}</span>
                  <button
                    type="button"
                    onClick={handleCopyShare}
                    className="font-bold text-[#3F4FA0] hover:underline shrink-0"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <p className="font-bold text-[#14213D] text-[13px] flex items-center gap-1.5">
                  <Mail className="size-3.5 text-[#3F4FA0]" />
                  <span>Email</span>
                </p>
                <p className="mt-1 text-slate-700">{member.id}@bridgeway-network.com</p>
              </div>

              <div>
                <p className="font-bold text-[#14213D] text-[13px] flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-[#3F4FA0]" />
                  <span>Location</span>
                </p>
                <p className="mt-1 text-slate-700">{member.location}</p>
              </div>

              <div>
                <p className="font-bold text-[#14213D] text-[13px] flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-emerald-600" />
                  <span>Verified Credentials</span>
                </p>
                <p className="mt-1 text-slate-700">{member.kycTier}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setContactModalOpen(false)}
                className="rounded-full bg-[#14213D] px-5 py-2 text-xs font-bold text-white hover:bg-[#3F4FA0] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ABOUT THIS MEMBER MODAL */}
      {aboutMemberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-[#14213D]">About this member</h2>
              <button
                type="button"
                onClick={() => setAboutMemberModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs text-[#334155]">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#14213D] text-white font-bold text-sm">
                  {member.initials}
                </div>
                <div>
                  <p className="font-bold text-[#14213D] text-sm">{member.name}</p>
                  <p className="text-[11px] text-[#64748B]">{member.role} · {member.headline}</p>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Joined</span>
                  <span className="font-semibold text-slate-800">March 2024</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Verification</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                    Verified Institution
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">KYC Status</span>
                  <span className="font-semibold text-slate-800">{member.kycTier}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Profile URL</span>
                  <span className="font-semibold text-[#3F4FA0]">bridgeway.vc/member/{member.id}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setAboutMemberModalOpen(false)}
                className="rounded-full bg-[#14213D] px-5 py-2 text-xs font-bold text-white hover:bg-[#3F4FA0] transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Flag className="size-4 text-red-600" />
                <h2 className="text-base font-bold text-[#14213D]">Report {member.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="size-5" />
              </button>
            </div>

            <p className="mt-3 text-xs text-[#64748B]">
              Why are you reporting this profile? Your report remains anonymous to this member.
            </p>

            <div className="mt-3 space-y-2">
              {[
                'Suspicious deal terms or inaccurate cap table',
                'Impersonation or fake account identity',
                'Unsolicited commercial spam or phishing',
                'Harassment or unprofessional conduct',
                'Other policy violation',
              ].map((reason) => (
                <label
                  key={reason}
                  className="flex items-center gap-2.5 rounded-lg border border-slate-200 p-2.5 text-xs text-[#14213D] hover:bg-slate-50 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason}
                    checked={selectedReportReason === reason}
                    onChange={(e) => setSelectedReportReason(e.target.value)}
                    className="text-[#0a66c2]"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitReport}
                className="rounded-full bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
