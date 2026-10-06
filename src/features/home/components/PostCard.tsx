import { useState } from 'react'
import {
  Check,
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
import type { Post } from '../types'
import { ShareDialog } from './ShareDialog'
import { ComposerDialog } from './ComposerDialog'

interface CommentItem {
  id: string
  name: string
  role: 'Founder' | 'Investor'
  headline: string
  time: string
  initials: string
  content: string
  likes: number
  isReply?: boolean
  replyTo?: string
}

const DEFAULT_COMMENTS: CommentItem[] = [
  {
    id: 'c1',
    name: 'Salman Kazi',
    role: 'Investor',
    headline: 'Partner, Indus Seed Fund',
    time: '15m ago',
    initials: 'SK',
    content: "Impressive progress on the cold-chain telemetry! What is your current target ticket size for this tranche? We'd love to review the data room.",
    likes: 3,
  },
  {
    id: 'c2',
    name: 'Tariq Malik',
    role: 'Founder',
    headline: 'Author',
    time: '8m ago',
    initials: 'TM',
    content: "@Salman Kazi Thanks Salman! We are opening ticket sizes between $25k–$50k. Sending you the data room access via Communications.",
    likes: 1,
    isReply: true,
    replyTo: 'Salman Kazi',
  },
  {
    id: 'c3',
    name: 'Amina Zafar',
    role: 'Investor',
    headline: 'Indus Valley Ventures',
    time: '32m ago',
    initials: 'AZ',
    content: 'Great hardware architecture. Are you deploying with standard cellular IoT (NB-IoT/LTE-M) for remote farms?',
    likes: 2,
  },
]

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
  const [comments, setComments] = useState<CommentItem[]>(DEFAULT_COMMENTS)
  const [commentText, setCommentText] = useState('')
  const [requested, setRequested] = useState(false)
  const [requesting, setRequesting] = useState(false)
  const [connectedUsers, setConnectedUsers] = useState<Record<string, boolean>>({})

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
      role: 'Founder',
      headline: 'Founder & Systems Architect',
      time: 'Just now',
      initials: authorInitials,
      content: commentText.trim(),
      likes: 0,
    }
    setComments((prev) => [newComment, ...prev])
    setCommentText('')
    toast.success('Comment posted')
  }

  function handleCommentAction(commentId: string, action: 'hide' | 'delete' | 'report') {
    if (action === 'delete') {
      setComments((prev) => prev.filter((c) => c.id !== commentId))
      toast.success('Comment deleted')
    } else if (action === 'hide') {
      setComments((prev) => prev.filter((c) => c.id !== commentId))
      toast('Comment hidden from public view')
    } else {
      toast.info('Comment reported to Bridgeway moderation')
    }
  }

  function handleDeletePost() {
    if (onDelete) {
      onDelete(post.id)
    } else {
      onHide(post.id)
    }
    toast.success('Post deleted successfully')
  }

  return (
    <>
      <article className="min-w-0 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_3px_14px_rgba(20,33,61,0.06)]">
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
              {post.time} · <Globe2 className="size-3" />
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

          {/* 3-Dot Post Options Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button aria-label="Post options" className="grid size-8 shrink-0 place-items-center rounded-full text-[#94A3B8] hover:bg-[#F8F9FA] hover:text-[#14213D]">
                <MoreHorizontal className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white border border-[#E2E8F0] shadow-lg">
              {isSelf ? (
                <>
                  <DropdownMenuItem
                    onSelect={() => setEditOpen(true)}
                    className="flex items-center gap-2 text-xs py-2 text-[#14213D] cursor-pointer"
                  >
                    <Edit3 className="size-3.5 text-[#3F4FA0]" />
                    <span>Edit post</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={handleDeletePost}
                    className="flex items-center gap-2 text-xs py-2 text-[#EF4444] cursor-pointer"
                  >
                    <Trash2 className="size-3.5 text-[#EF4444]" />
                    <span>Delete post</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => toast.success('Post pinned to your profile')}
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
            <p className="whitespace-pre-wrap break-words [overflow-wrap:anywhere]">{post.body}</p>
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

          {/* Uploaded or Attached Image - Full uncropped view */}
          {post.imageUrl && (
            <div className="mt-3 overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] shadow-sm">
              <img
                src={post.imageUrl}
                alt={post.imageName ?? 'Post media attachment'}
                className="max-h-[520px] w-full object-contain rounded-xl"
              />
            </div>
          )}

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
        </div>

        {/* Social Counts Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#F1F3F6] px-4 py-2.5 text-[11px] text-[#64748B] sm:px-5">
          <span className="inline-flex items-center gap-1.5">
            <span className="grid size-5 place-items-center rounded-full bg-[#FEF3D8] text-[#d6a528]">
              <ThumbsUp className="size-3 fill-current text-[#d6a528]" />
            </span>
            {count + (liked ? 1 : 0)} Likes
          </span>
          <span className="ml-auto">
            {comments.length} comments <span className="px-1.5">·</span>
            <span className="font-semibold text-[#3F4FA0]">
              {post.kind === 'founder' ? '9 allocations requested' : '14 memos pitched'}
            </span>
          </span>
        </div>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-4 border-t border-[#F1F3F6] px-1 py-1">
          <button
            onClick={() => setLiked((v) => !v)}
            className={`flex min-h-10 items-center justify-center gap-1.5 text-xs font-semibold ${
              liked ? 'text-[#F5B544]' : 'text-[#64748B] hover:text-[#14213D]'
            }`}
          >
            <ThumbsUp className={`size-4 ${liked ? 'fill-[#F5B544]' : ''}`} />
            <span>Like</span>
          </button>

          <button
            onClick={() => setCommentsOpen((v) => !v)}
            className={`flex min-h-10 items-center justify-center gap-1.5 text-xs font-semibold ${
              commentsOpen ? 'text-[#3F4FA0]' : 'text-[#64748B] hover:text-[#14213D]'
            }`}
          >
            <MessageCircle className="size-4" />
            <span>Comment</span>
          </button>

          <button
            onClick={() => setShareOpen(true)}
            className="flex min-h-10 items-center justify-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#3F4FA0]"
          >
            <Repeat2 className="size-4" />
            <span>Repost</span>
          </button>

          <button
            onClick={() => setShareOpen(true)}
            className="flex min-h-10 items-center justify-center gap-1.5 text-xs font-semibold text-[#64748B] hover:text-[#3F4FA0]"
          >
            <Send className="size-4" />
            <span>Share</span>
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
              {comments.map((c) => {
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

            {/* Show More link */}
            <div className="mt-4 text-center">
              <button
                onClick={() => toast('All comments loaded')}
                className="text-xs font-semibold text-[#3F4FA0] hover:underline"
              >
                Show more ▼
              </button>
            </div>
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

      {/* Share / Repost Modal */}
      <ShareDialog open={shareOpen} onOpenChange={setShareOpen} post={post} />
    </>
  )
}
