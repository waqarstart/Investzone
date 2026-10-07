import { useMemo, useState } from 'react'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  Edit3,
  EyeOff,
  Flag,
  Globe2,
  MessageCircle,
  MoreHorizontal,
  Pin,
  Repeat2,
  Send,
  ThumbsUp,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useJoinStore } from '@/features/join/useJoinStore'
import { useFeedStore } from '../useFeedStore'
import { cn } from '@/lib/utils'
import type { CommentItem, Post } from '../types'
import { ShareDialog } from './ShareDialog'
import { ComposerDialog } from './ComposerDialog'

const SEED_COMMENT_TEMPLATES = [
  { name: 'Salman Kazi', role: 'Investor' as const, headline: 'Partner, Indus Seed Fund', initials: 'SK', content: "Impressive progress on the cold-chain telemetry! What is your current target ticket size for this tranche? We'd love to review the data room.", likes: 3 },
  { name: 'Tariq Malik', role: 'Founder' as const, headline: 'Author', initials: 'TM', content: "@Salman Kazi Thanks Salman! We are opening ticket sizes between $25k–$50k. Sending you the data room access via Communications.", likes: 1, isReply: true, replyTo: 'Salman Kazi' },
  { name: 'Amina Zafar', role: 'Investor' as const, headline: 'Indus Valley Ventures', initials: 'AZ', content: 'Great hardware architecture. Are you deploying with standard cellular IoT (NB-IoT/LTE-M) for remote farms?', likes: 2 },
  { name: 'Bilal Chaudhry', role: 'Investor' as const, headline: 'Angel Syndicate Lead', initials: 'BC', content: 'Strong unit economics. What does the customer payback curve look like across tier-2 commercial pilots?', likes: 4 },
  { name: 'Zoya Alvi', role: 'Founder' as const, headline: 'CTO @ NexusFin', initials: 'ZA', content: 'Exciting milestone! Bilateral settlement guarantees like this are sorely needed in cross-border commerce.', likes: 2 },
  { name: 'Hamza Farooq', role: 'Investor' as const, headline: 'VP @ Apex Capital', initials: 'HF', content: 'Connecting with you now to review the termsheet covenants and audit memo.', likes: 5 },
  { name: 'Sarah Jenkins', role: 'Investor' as const, headline: 'Global Growth Partner', initials: 'SJ', content: 'Congratulations on opening the round! We have allocated $100K from our syndication desk.', likes: 7 },
  { name: 'Usman Ghani', role: 'Founder' as const, headline: 'Co-Founder @ AgriScale', initials: 'UG', content: 'Inspiring journey. Would love to collaborate on hardware telemetry integrations.', likes: 1 },
  { name: 'Farhan Siddiqui', role: 'Investor' as const, headline: 'Principal, Falcon Fund', initials: 'FS', content: 'The regulatory moat here is substantial. Let us schedule a diligence call this week.', likes: 3 },
  { name: 'Nida Rehman', role: 'Investor' as const, headline: 'Partner, Ventures Hub', initials: 'NR', content: 'Sent bilateral request for the pitch deck and audited financial projections.', likes: 2 },
  { name: 'Kashif Mehmood', role: 'Founder' as const, headline: 'CEO @ MediBridge', initials: 'KM', content: 'Terrific execution. The pilot retention numbers speak for themselves!', likes: 4 },
  { name: 'Ayesha Mirza', role: 'Investor' as const, headline: 'LP Syndicate Director', initials: 'AM', content: 'Reviewed your milestone deck. Very impressed with the gross margin trajectory.', likes: 6 },
  { name: 'Rohail Dar', role: 'Founder' as const, headline: 'FinTech Architect', initials: 'RD', content: 'How are you handling the offline ledger synchronization in low-connectivity rural hubs?', likes: 2 },
  { name: 'Mahnoor Khan', role: 'Investor' as const, headline: 'Venture Scout', initials: 'MK', content: 'Shared this syndicate opportunity with our regional angel group.', likes: 3 },
  { name: 'Daniyal Ahmed', role: 'Founder' as const, headline: 'Growth Lead', initials: 'DA', content: 'Phenomenal progress! Looking forward to seeing the Series A roadmap unfold.', likes: 1 },
  { name: 'Omer Farooq', role: 'Investor' as const, headline: 'Managing Director @ Crescent Ventures', initials: 'OF', content: 'Solid traction metrics. Is the lead investor taking board representation?', likes: 4 },
  { name: 'Sana Rauf', role: 'Founder' as const, headline: 'COO @ SolarGrid', initials: 'SR', content: 'The scalability of your decentralized pilot is impressive. Best of luck with the round!', likes: 2 },
  { name: 'Zeeshan Ali', role: 'Investor' as const, headline: 'Partner, Karakoram Capital', initials: 'ZA', content: 'Sent you an NDA request for access to the financial model and cohort analysis.', likes: 5 },
]

function generateInitialComments(post: Post): CommentItem[] {
  const targetCount = post.comments && post.comments > 0 ? post.comments : 3
  const items: CommentItem[] = []
  
  for (let i = 0; i < targetCount; i++) {
    const template = SEED_COMMENT_TEMPLATES[i % SEED_COMMENT_TEMPLATES.length]
    const cycle = Math.floor(i / SEED_COMMENT_TEMPLATES.length)
    const suffix = cycle > 0 ? ` (${cycle + 1})` : ''
    const minutesAgo = (i + 1) * 6
    const timeStr = minutesAgo < 60 ? `${minutesAgo}m ago` : `${Math.floor(minutesAgo / 60)}h ago`
    
    items.push({
      id: `c-${post.id}-${i + 1}`,
      name: `${template.name}${suffix}`,
      role: template.role,
      headline: template.headline,
      time: timeStr,
      initials: template.initials,
      content: template.content,
      likes: template.likes,
      isReply: template.isReply,
      replyTo: template.replyTo,
    })
  }
  return items
}

export function PostCard({
  post,
  onHide,
  onEdit,
  onDelete,
}: {
  post: Post
  onHide: (id: string) => void
  onEdit?: (post: Post) => void
  onDelete?: (id: string) => void
}) {
  const profile = useJoinStore((state) => state.profile)
  const currentFullName = profile ? `${profile.firstName} ${profile.lastName}`.trim().toLowerCase() : ''
  const isSelf =
    post.id.startsWith('post-') ||
    post.id.startsWith('new-') ||
    (currentFullName !== '' && post.name.toLowerCase() === currentFullName) ||
    post.name.toLowerCase().includes('zahra')

  const [liked, setLiked] = useState(false)
  const [connected, setConnected] = useState(false)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const storedComments = useFeedStore((state) => state.commentsMap[post.id])
  const addCommentToStore = useFeedStore((state) => state.addComment)
  const deleteCommentFromStore = useFeedStore((state) => state.deleteComment)
  const setPostComments = useFeedStore((state) => state.setPostComments)

  const comments = useMemo(() => {
    if (storedComments && storedComments.length > 0) {
      return storedComments
    }
    return generateInitialComments(post)
  }, [storedComments, post])

  const [visibleCommentCount, setVisibleCommentCount] = useState(3)
  const [commentText, setCommentText] = useState('')
  const [requested, setRequested] = useState(false)
  const [requesting, setRequesting] = useState(false)
  const [connectedUsers, setConnectedUsers] = useState<Record<string, boolean>>({})

  const [reposted, setReposted] = useState(false)
  const [repostsCount, setRepostsCount] = useState(
    post.id === 'amina' ? 8 : post.id === 'marcus' ? 12 : 3
  )
  const [quoteOpen, setQuoteOpen] = useState(false)

  const addPost = useFeedStore((state) => state.addPost)
  const deletePost = useFeedStore((state) => state.deletePost)
  const allFeedPosts = useFeedStore((state) => state.posts)
  const postImages = post.images && post.images.length > 0 ? post.images : post.imageUrl ? [post.imageUrl] : []
  const count = post.interested

  function requestRoom() {
    if (requesting || requested) return
    setRequesting(true)
    window.setTimeout(() => {
      setRequesting(false)
      setRequested(true)
      toast.success('Deal room access requested (demo)')
    }, 800)
  }

  function handleAddComment() {
    if (!commentText.trim()) return
    const authorName = profile ? `${profile.firstName} ${profile.lastName}`.trim() : 'Syeda Zahra Ijaz'
    const authorInitials = profile
      ? `${profile.firstName[0] || 'Z'}${profile.lastName[0] || 'I'}`.toUpperCase()
      : 'SZ'

    const newComment: CommentItem = {
      id: `c-${Date.now()}`,
      name: authorName,
      role: profile?.role === 'investor' ? 'Investor' : 'Founder',
      headline: profile?.role === 'investor' ? 'Managing Partner · Syndicate' : 'Founder & Systems Architect',
      time: 'Just now',
      initials: authorInitials,
      content: commentText.trim(),
      likes: 0,
    }

    if (!storedComments || storedComments.length === 0) {
      const initial = generateInitialComments(post)
      setPostComments(post.id, [newComment, ...initial])
    } else {
      addCommentToStore(post.id, newComment)
    }

    setVisibleCommentCount((prev) => prev + 1)
    setCommentText('')
    toast.success('Comment posted')
  }

  function handleCommentAction(commentId: string, action: 'hide' | 'delete' | 'report') {
    if (action === 'delete') {
      if (!storedComments || storedComments.length === 0) {
        const initial = generateInitialComments(post).filter((c) => c.id !== commentId)
        setPostComments(post.id, initial)
      } else {
        deleteCommentFromStore(post.id, commentId)
      }
      toast.success('Comment deleted')
    } else if (action === 'hide') {
      if (!storedComments || storedComments.length === 0) {
        const initial = generateInitialComments(post).filter((c) => c.id !== commentId)
        setPostComments(post.id, initial)
      } else {
        deleteCommentFromStore(post.id, commentId)
      }
      toast('Comment hidden from public view')
    } else {
      toast.info('Comment reported to Bridgeway moderation')
    }
  }

  function handleDeletePost() {
    if (onDelete) {
      onDelete(post.id)
    } else {
      deletePost(post.id)
      onHide(post.id)
    }
    toast.success(post.repostedBy ? 'Repost deleted successfully' : 'Post deleted successfully')
  }

  function handleUndoRepost() {
    setReposted(false)
    setRepostsCount((prev) => Math.max(0, prev - 1))
    const authorName = profile ? `${profile.firstName} ${profile.lastName}`.trim() : 'Syeda Zahra Ijaz'
    const matchedRepost = allFeedPosts.find(
      (p) => p.repostedBy === authorName && p.body === post.body && p.name === post.name
    )
    if (matchedRepost) {
      deletePost(matchedRepost.id)
    }
    toast.info('Repost removed from your feed')
  }

  function handleRepostInstantly() {
    if (reposted) {
      handleUndoRepost()
      return
    }
    setReposted(true)
    setRepostsCount((prev) => prev + 1)

    const authorName = profile ? `${profile.firstName} ${profile.lastName}`.trim() : 'Syeda Zahra Ijaz'

    const repostedPost: Post = {
      id: `repost-${Date.now()}`,
      name: post.name,
      initials: post.initials,
      kind: post.kind,
      headline: post.headline,
      time: 'Just now',
      body: post.body,
      tags: post.tags || [],
      images: post.images && post.images.length > 0 ? [...post.images] : post.imageUrl ? [post.imageUrl] : [],
      imageUrl: post.imageUrl,
      imageName: post.imageName,
      banner: post.banner,
      extra: post.extra,
      interested: 0,
      comments: 0,
      engagementScore: 99,
      createdAt: Date.now(),
      repostedBy: authorName,
    }
    addPost(repostedPost)
    toast.success('Instantly reposted to your network!')
  }

  function handleRepostWithThoughts() {
    setQuoteOpen(true)
  }

  const reposterInitials = post.repostedBy
    ? post.repostedBy
        .split(' ')
        .filter(Boolean)
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'SZ'

  const isMyRepost = Boolean(
    post.repostedBy &&
      ((currentFullName !== '' && post.repostedBy.toLowerCase() === currentFullName) ||
        post.repostedBy.toLowerCase().includes('zahra'))
  )
  const canDelete = isSelf || isMyRepost

  const renderPostOptions = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="Post options"
          className="grid size-8 shrink-0 place-items-center rounded-full text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#14213D] transition-colors focus:outline-none"
        >
          <MoreHorizontal className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white border border-[#E2E8F0] shadow-lg z-50">
        {canDelete ? (
          <>
            {!post.repostedBy && (
              <DropdownMenuItem
                onSelect={() => setEditOpen(true)}
                className="flex items-center gap-2 text-xs py-2 text-[#14213D] cursor-pointer"
              >
                <Edit3 className="size-3.5 text-[#3F4FA0]" />
                <span>Edit post</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onSelect={handleDeletePost}
              className="flex items-center gap-2 text-xs py-2 text-[#EF4444] cursor-pointer"
            >
              <Trash2 className="size-3.5 text-[#EF4444]" />
              <span>{post.repostedBy ? 'Delete repost' : 'Delete post'}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => toast.success(post.repostedBy ? 'Repost pinned to your profile' : 'Post pinned to your profile')}
              className="flex items-center gap-2 text-xs py-2 text-[#334155] cursor-pointer"
            >
              <Pin className="size-3.5 text-[#64748B]" />
              <span>Pin to top</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                navigator.clipboard?.writeText?.(window.location.href)
                toast.success('Link copied to clipboard')
              }}
              className="flex items-center gap-2 text-xs py-2 text-[#334155] cursor-pointer"
            >
              <Copy className="size-3.5 text-[#64748B]" />
              <span>Copy link</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem
              onSelect={() => toast.success('Post saved to bookmarks')}
              className="flex items-center gap-2 text-xs py-2 text-[#334155] cursor-pointer"
            >
              Save post
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => onHide(post.id)}
              className="flex items-center gap-2 text-xs py-2 text-[#334155] cursor-pointer"
            >
              Hide post
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => toast.info('Report received by Bridgeway')}
              className="flex items-center gap-2 text-xs py-2 text-[#EF4444] cursor-pointer"
            >
              Report post
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )

  return (
    <>
      <article className="min-w-0 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_3px_14px_rgba(20,33,61,0.06)]">
        {/* Repost Header Tag - Exact LinkedIn Style */}
        {post.repostedBy && (
          <div className="flex items-center justify-between border-b border-[#F1F5F9] bg-white px-4 pt-3 pb-2.5 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#14213D] text-[9px] font-bold text-white ring-1 ring-[#10B981]/50 overflow-hidden shadow-xs">
                {reposterInitials}
              </div>
              <span className="truncate text-xs text-[#64748B]">
                <strong className="font-bold text-[#14213D]">{post.repostedBy}</strong> reposted this
              </span>
            </div>
            {renderPostOptions()}
          </div>
        )}

        {/* Post Author Header */}
        <div className="flex min-w-0 items-start gap-3 p-4 sm:p-5">
          <span
            className={`grid size-11 shrink-0 place-items-center rounded-full ${
              post.kind === 'investor' ? 'bg-[#14213D]' : 'bg-[#14213D] ring-2 ring-[#F5B544]'
            } text-xs font-bold text-white sm:size-12`}
          >
            {post.initials}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-sm font-bold text-[#14213D]">{post.name}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                  post.kind === 'founder'
                    ? 'bg-[#FEF3D8] text-[#92400E]'
                    : 'bg-[#EEF2FF] text-[#3730A3]'
                }`}
              >
                {post.kind}
              </span>
              <span className="text-[11px] text-[#94A3B8]">· 1st</span>
            </div>
            <p className="line-clamp-2 text-xs text-[#64748B]">{post.headline}</p>
            <p className="mt-0.5 flex items-center gap-1 text-[10px] text-[#94A3B8]">
              {post.time} {post.repostedBy && <span>· Reposted</span>} · <Globe2 className="size-3" />
            </p>
          </div>

          {/* Connect Button only for other users, not for own post */}
          {!isSelf && (
            <button
              onClick={() => {
                setConnected((value) => !value)
                if (!connected) toast.success('Connection request sent')
              }}
              className={`flex h-8 shrink-0 items-center gap-1 rounded-full px-3 text-[11px] font-semibold transition-colors ${
                connected ? 'bg-[#F1F3F6] text-[#64748B]' : 'border border-[#3F4FA0] text-[#3F4FA0] hover:bg-[#EEF0FA]'
              }`}
              aria-label={connected ? 'Pending connection' : 'Connect'}
            >
              {connected ? (
                <>
                  <Clock3 className="size-3.5" />
                  <span className="hidden sm:inline">Pending</span>
                </>
              ) : (
                <>
                  <span className="hidden sm:inline">+ Connect</span>
                  <span className="sm:hidden">+</span>
                </>
              )}
            </button>
          )}

          {/* 3-Dot Post Options Dropdown (only when not reposted, as it is already at the top row) */}
          {!post.repostedBy && renderPostOptions()}
        </div>

        {/* Post Content Body */}
        <div className="px-4 pb-4 text-sm leading-relaxed text-[#334155] sm:px-5">
          {post.id === 'amina' ? (
            <>
              <p>
                Thrilled to announce our Seed round is officially open on{' '}
                <span className="font-semibold text-[#3F4FA0]">Bridgeway</span>! 🚀
              </p>
              <p className="mt-1">
                We are modernizing cold-chain logistics and agricultural telemetry for smallholder farmers across South Asia with real-time IoT and predictive harvest brokerage.
              </p>
              <div className="mt-3 grid grid-cols-1 divide-y divide-[#DDE3FA] rounded-xl border border-[#DDE3FA] bg-[#F5F7FF] p-3 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
                <div className="pb-2 sm:pb-0 sm:pr-3">
                  <b className="block text-[10px] tracking-wide text-[#64748B]">ARR & MOMENTUM</b>
                  <span className="text-sm font-bold text-[#14213D]">
                    $480K <span className="text-xs text-[#3F4FA0]">(3.2x YoY growth)</span>
                  </span>
                </div>
                <div className="pt-2 sm:pl-3 sm:pt-0">
                  <b className="block text-[10px] tracking-wide text-[#64748B]">SEEKING ALLOCATION</b>
                  <span className="text-sm font-bold text-[#14213D]">
                    $1.2M <span className="text-xs text-[#64748B]">(Lead committed: 40%)</span>
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div>
              {(() => {
                const displayBody = post.body.replace(/^(🔄\s*Reposted from[^\n]+:\s*\n*|—\s*Quoting[^\n]+:\s*\n*)/i, '').trim()
                return !isExpanded && (postImages.length > 0 ? displayBody.length > 70 : displayBody.length > 200) ? (
                  <p className="break-words [overflow-wrap:anywhere]">
                    {displayBody.slice(0, postImages.length > 0 ? 68 : 180).trim()}…{' '}
                    <button
                      type="button"
                      onClick={() => setIsExpanded(true)}
                      className="font-semibold text-[#64748B] hover:text-[#14213D] hover:underline"
                    >
                      more
                    </button>
                  </p>
                ) : (
                  <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">
                    {displayBody}
                    {isExpanded && (postImages.length > 0 ? displayBody.length > 70 : displayBody.length > 200) && (
                      <button
                        type="button"
                        onClick={() => setIsExpanded(false)}
                        className="ml-2 font-semibold text-[#64748B] hover:text-[#14213D] hover:underline"
                      >
                        less
                      </button>
                    )}
                  </p>
                )
              })()}
            </div>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs font-medium text-[#3F4FA0]">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Uploaded or Attached Images - LinkedIn Carousel or Single Image */}
          {postImages.length > 1 ? (
            <div className="relative mt-3 overflow-hidden rounded-xl border border-[#E2E8F0] bg-black shadow-sm select-none group">
              {/* Top-Right Page Counter (e.g. 7/7) */}
              <div className="absolute top-3 right-3 z-20 rounded-md bg-black/75 px-2.5 py-0.5 text-[11px] font-bold text-white shadow backdrop-blur-sm pointer-events-none">
                {activeSlide + 1}/{postImages.length}
              </div>

              {/* Previous Image Button */}
              {activeSlide > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveSlide((prev) => Math.max(0, prev - 1))
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex size-9 items-center justify-center rounded-full bg-black/70 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-black/90 hover:scale-105 active:scale-95"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="size-5" />
                </button>
              )}

              {/* Next Image Button */}
              {activeSlide < postImages.length - 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setActiveSlide((prev) => Math.min(postImages.length - 1, prev + 1))
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex size-9 items-center justify-center rounded-full bg-black/70 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-black/90 hover:scale-105 active:scale-95"
                  aria-label="Next slide"
                >
                  <ChevronRight className="size-5" />
                </button>
              )}

              {/* Active Slide Image */}
              <div className="flex w-full min-h-[280px] max-h-[520px] items-center justify-center bg-black/95">
                <img
                  src={postImages[activeSlide]}
                  alt={`Attachment ${activeSlide + 1} of ${postImages.length}`}
                  className="max-h-[520px] w-full object-contain"
                />
              </div>

              {/* Carousel Dot Indicators */}
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 backdrop-blur-sm">
                {postImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setActiveSlide(idx)
                    }}
                    className={cn(
                      'h-1.5 rounded-full transition-all',
                      idx === activeSlide ? 'w-4 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                    )}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : postImages.length === 1 ? (
            <div className="mt-3 overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] shadow-sm">
              <img
                src={postImages[0]}
                alt={post.imageName ?? 'Post media attachment'}
                className="max-h-[520px] w-full object-contain rounded-xl"
              />
            </div>
          ) : null}

          {/* Special Deal Banner */}
          {post.banner === 'deal' && !post.imageUrl && (
            <div className="relative mt-3 overflow-hidden rounded-xl bg-gradient-to-r from-[#14213D] to-[#293b7d] p-4 text-white sm:p-5">
              <div className="absolute -right-8 -top-16 size-48 rounded-full border-[4px] border-[#F5B544]/90" />
              <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <span className="rounded bg-[#F5B544] px-2 py-1 text-[9px] font-bold text-[#14213D]">
                    AUDITED DEAL ROOM
                  </span>
                  <span className="ml-2 text-xs font-semibold text-[#F5B544]">
                    Confidential Data Vault
                  </span>
                  <h3 className="mt-2 text-lg font-bold">AgriFlow Seed Deck · $1.2M Target</h3>
                  <p className="text-xs text-white/70">Telemetry hardware & freight escrow protocol</p>
                </div>
                <button
                  disabled={requesting || requested}
                  onClick={requestRoom}
                  className="relative z-10 rounded-full border border-[#7586db] bg-[#3F4FA0]/70 px-4 py-2 text-xs font-semibold text-white disabled:opacity-80 hover:bg-[#3F4FA0] transition-colors"
                >
                  {requesting ? 'Requesting…' : requested ? <><Check className="mr-1 inline size-4" />Requested</> : 'Request Deal Room →'}
                </button>
              </div>
            </div>
          )}

          {/* Quoted Post Embedded Card */}
          {post.quotedPost && (
            <div className="mt-3 overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-left">
              <div className="flex items-center gap-2.5 mb-2">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#14213D] text-[11px] font-bold text-white shadow-sm">
                  {post.quotedPost.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-xs font-bold text-[#14213D] truncate">{post.quotedPost.name}</p>
                    <span className="rounded-full px-1.5 py-0.2 bg-[#FEF3D8] text-[9px] font-bold text-[#92400E] uppercase">
                      {post.quotedPost.kind}
                    </span>
                    <span className="text-[10px] text-[#94A3B8]">· {post.quotedPost.time}</span>
                  </div>
                  <p className="text-[11px] text-[#64748B] truncate">{post.quotedPost.headline}</p>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-[#334155] whitespace-pre-wrap break-words">{post.quotedPost.body}</p>
              
              {/* Quoted Post Tags */}
              {post.quotedPost.tags && post.quotedPost.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {post.quotedPost.tags.map((tag) => (
                    <span key={tag} className="text-[10px] font-medium text-[#3F4FA0]">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Quoted Post Images */}
              {(post.quotedPost.images && post.quotedPost.images.length > 0 ? post.quotedPost.images : post.quotedPost.imageUrl ? [post.quotedPost.imageUrl] : []).length > 0 && (
                <div className="mt-2.5 max-h-56 overflow-hidden rounded-lg border border-[#E2E8F0] bg-black">
                  <img
                    src={(post.quotedPost.images && post.quotedPost.images[0]) || post.quotedPost.imageUrl}
                    alt="Quoted post media attachment"
                    className="max-h-56 w-full object-contain"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Social Counts Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#F1F3F6] px-4 py-2.5 text-[11px] text-[#64748B] sm:px-5">
          <span className="inline-flex items-center gap-1.5">
            <span className="grid size-5 place-items-center rounded-full bg-[#FEF3D8] text-[#d6a528]">
              <ThumbsUp className="size-3 fill-current text-[#d6a528]" />
            </span>
            {count + (liked ? 1 : 0)}
          </span>
          <span className="ml-auto flex items-center gap-1 text-[#64748B]">
            <span>{comments.length} comments</span>
            <span className="px-0.5">·</span>
            <span>{repostsCount} reposts</span>
          </span>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-4 border-t border-[#F1F3F6] px-1 py-1">
          {/* Like */}
          <button
            type="button"
            onClick={() => setLiked((v) => !v)}
            className={`flex min-h-10 items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-colors hover:bg-[#F8F9FA] cursor-pointer ${
              liked ? 'text-[#3F4FA0]' : 'text-[#64748B] hover:text-[#14213D]'
            }`}
          >
            <ThumbsUp className={`size-4 ${liked ? 'fill-[#3F4FA0]' : ''}`} />
            <span>Like</span>
          </button>

          {/* Comment */}
          <button
            type="button"
            onClick={() => setCommentsOpen((v) => !v)}
            className={`flex min-h-10 items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-colors hover:bg-[#F8F9FA] cursor-pointer ${
              commentsOpen ? 'text-[#3F4FA0]' : 'text-[#64748B] hover:text-[#14213D]'
            }`}
          >
            <MessageCircle className="size-4" />
            <span>Comment</span>
          </button>

          {/* Repost Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={cn(
                  'flex min-h-10 items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-colors hover:bg-[#F8F9FA] cursor-pointer',
                  reposted ? 'text-[#3F4FA0]' : 'text-[#64748B] hover:text-[#14213D]'
                )}
              >
                <Repeat2 className="size-4" />
                <span>Repost</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56 rounded-xl border border-[#E2E8F0] bg-white p-1.5 shadow-lg z-50">
              {reposted ? (
                <DropdownMenuItem
                  onSelect={handleUndoRepost}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold text-[#EF4444] hover:bg-red-50 cursor-pointer"
                >
                  <Trash2 className="size-4 text-[#EF4444]" />
                  <span>Undo repost</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  onSelect={handleRepostInstantly}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold text-[#14213D] hover:bg-[#F8F9FA] cursor-pointer"
                >
                  <Repeat2 className="size-4 text-[#64748B]" />
                  <span>Repost instantly</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onSelect={handleRepostWithThoughts}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-xs font-semibold text-[#14213D] hover:bg-[#F8F9FA] cursor-pointer"
              >
                <Edit3 className="size-4 text-[#64748B]" />
                <span>Repost with thoughts</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Send */}
          <button
            type="button"
            onClick={() => setShareOpen(true)}
            className="flex min-h-10 items-center justify-center gap-1.5 rounded-lg text-xs font-semibold text-[#64748B] hover:text-[#14213D] transition-colors hover:bg-[#F8F9FA] cursor-pointer"
          >
            <Send className="size-4" />
            <span>Send</span>
          </button>
        </div>

        {/* EXPANDED BORDERLESS COMMENTS SECTION */}
        {commentsOpen && (
          <div className="border-t border-[#F1F3F6] bg-white p-4 sm:p-5">
            {/* Comment Input */}
            <div className="mb-4 flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#14213D] text-xs font-bold text-white">
                {profile ? `${profile.firstName[0] || 'Z'}${profile.lastName[0] || 'I'}`.toUpperCase() : 'SZ'}
              </span>
              <div className="flex flex-1 items-center rounded-full border border-[#E2E8F0] bg-[#F8F9FA] px-3.5 py-1 focus-within:border-[#3F4FA0] focus-within:bg-white transition-colors">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddComment()
                  }}
                  placeholder="Add a comment or inquiry on this raise..."
                  className="w-full bg-transparent text-xs text-[#14213D] placeholder:text-[#94A3B8] focus:outline-none"
                />
              </div>
              <button
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                className="rounded-full bg-[#F5B544] px-4 py-1.5 text-xs font-bold text-[#14213D] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#E9A72F] transition-colors"
              >
                Post
              </button>
            </div>

            {/* Comment Thread */}
            <div className="space-y-3.5">
              {comments.slice(0, visibleCommentCount).map((c) => {
                const isUserConnected = connectedUsers[c.id]
                const isCommentSelf =
                  (currentFullName !== '' && c.name.toLowerCase() === currentFullName) ||
                  c.name.toLowerCase().includes('zahra')

                return (
                  <div
                    key={c.id}
                    className={`flex items-start gap-3 ${c.isReply ? 'ml-8 sm:ml-10 border-l-2 border-[#E2E8F0] pl-3' : ''}`}
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#14213D] text-[10px] font-bold text-white">
                      {c.initials}
                    </span>

                    <div className="flex-1 min-w-0">
                      {/* Comment Header */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                          <span className="text-xs font-bold text-[#14213D]">{c.name}</span>
                          <span
                            className={`rounded-full px-2 py-0.2 text-[9px] font-semibold uppercase ${
                              c.role === 'Founder'
                                ? 'bg-[#FEF3D8] text-[#92400E]'
                                : 'bg-[#EEF2FF] text-[#3730A3]'
                            }`}
                          >
                            {c.role}
                          </span>
                          <span className="text-[11px] text-[#64748B]">· {c.headline}</span>
                          <span className="text-[10px] text-[#94A3B8]">· {c.time}</span>
                        </div>

                        {/* Top-Right Quick Connect & 3-Dot Menu */}
                        <div className="flex items-center gap-1">
                          {!c.isReply && !isCommentSelf && (
                            <button
                              type="button"
                              onClick={() => {
                                setConnectedUsers((prev) => ({ ...prev, [c.id]: !isUserConnected }))
                                if (!isUserConnected) toast.success(`Connected with ${c.name}`)
                              }}
                              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold transition-colors ${
                                isUserConnected
                                  ? 'bg-[#F1F3F6] text-[#64748B]'
                                  : 'border border-[#3F4FA0] text-[#3F4FA0] hover:bg-[#EEF0FA]'
                              }`}
                            >
                              {isUserConnected ? 'Pending' : '+ Connect'}
                            </button>
                          )}

                          {/* 3-Dot Moderation Dropdown */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                aria-label="Comment options"
                                className="flex size-6 items-center justify-center rounded-full text-[#94A3B8] hover:bg-[#F8F9FA] hover:text-[#14213D]"
                              >
                                <MoreHorizontal className="size-3.5" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 bg-white shadow-lg border border-[#E2E8F0]">
                              <DropdownMenuItem
                                onSelect={() => handleCommentAction(c.id, 'hide')}
                                className="flex items-center gap-2 text-xs py-2 text-[#334155] cursor-pointer"
                              >
                                <EyeOff className="size-3.5" />
                                <span>Hide comment</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() => handleCommentAction(c.id, 'delete')}
                                className="flex items-center gap-2 text-xs py-2 text-[#EF4444] cursor-pointer"
                              >
                                <Trash2 className="size-3.5" />
                                <span>Delete comment</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() => handleCommentAction(c.id, 'report')}
                                className="flex items-center gap-2 text-xs py-2 text-[#64748B] cursor-pointer"
                              >
                                <Flag className="size-3.5" />
                                <span>Report comment</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Comment Body Text */}
                      <p className="mt-1 text-xs leading-relaxed text-[#334155] break-words [overflow-wrap:anywhere]">{c.content}</p>

                      {/* Bottom Sub-actions */}
                      <div className="mt-1.5 flex items-center gap-3 text-[11px] text-[#64748B]">
                        <button className="hover:text-[#3F4FA0] font-medium">Like</button>
                        <span>·</span>
                        <button className="hover:text-[#3F4FA0] font-medium">Reply</button>
                        {c.likes > 0 && (
                          <>
                            <span>·</span>
                            <span className="flex items-center gap-1 text-[#3F4FA0]">
                              <ThumbsUp className="size-3" /> {c.likes}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bottom-Left Incremental "See more comments" */}
            {comments.length > visibleCommentCount ? (
              <div className="mt-3.5 flex items-center justify-between text-left">
                <button
                  type="button"
                  onClick={() => setVisibleCommentCount((prev) => Math.min(prev + 7, comments.length))}
                  className="text-xs font-semibold text-[#3F4FA0] hover:text-[#14213D] hover:underline transition-colors"
                >
                  See {comments.length - visibleCommentCount} more comment{comments.length - visibleCommentCount === 1 ? '' : 's'}
                </button>
                <span className="text-[11px] text-[#94A3B8]">
                  {visibleCommentCount} of {comments.length}
                </span>
              </div>
            ) : comments.length > 3 ? (
              <div className="mt-3.5 flex items-center justify-between text-left">
                <button
                  type="button"
                  onClick={() => setVisibleCommentCount(3)}
                  className="text-xs font-semibold text-[#64748B] hover:text-[#14213D] hover:underline transition-colors"
                >
                  Show less
                </button>
                <span className="text-[11px] text-[#94A3B8]">
                  All {comments.length} comments shown
                </span>
              </div>
            ) : null}
          </div>
        )}
      </article>

      {/* Edit Post Modal */}
      {editOpen && (
        <ComposerDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          author={post.name}
          initials={post.initials}
          role={post.kind === 'founder' ? 'Founder' : 'Investor'}
          initialPost={post}
          onPost={(updated) => {
            if (onEdit) onEdit(updated)
            setEditOpen(false)
          }}
        />
      )}

      {/* Quote Post Modal */}
      {quoteOpen && (
        <ComposerDialog
          open={quoteOpen}
          onOpenChange={setQuoteOpen}
          author={profile ? `${profile.firstName} ${profile.lastName}`.trim() : 'Syeda Zahra Ijaz'}
          initials={
            profile
              ? `${profile.firstName[0] || 'Z'}${profile.lastName[0] || 'I'}`.toUpperCase()
              : 'SZ'
          }
          role={profile?.role === 'investor' ? 'Investor' : 'Founder'}
          preset="Quote"
          quotedPost={post}
          onPost={(newPost) => {
            addPost(newPost)
            setQuoteOpen(false)
            setReposted(true)
            setRepostsCount((prev) => prev + 1)
            toast.success('Quote post shared to your network!')
          }}
        />
      )}

      {/* Share / Direct Memo Modal */}
      <ShareDialog open={shareOpen} onOpenChange={setShareOpen} post={post} />
    </>
  )
}
