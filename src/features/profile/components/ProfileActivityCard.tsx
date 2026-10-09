import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Repeat2,
  Send,
  ThumbsUp,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useFeedStore } from '@/features/home/useFeedStore'
import { ComposerDialog } from '@/features/home/components/ComposerDialog'
import { useProfileStore } from '../useProfileStore'

type ActivityTab = 'posts' | 'comments' | 'images'

export function ProfileActivityCard() {
  const profile = useProfileStore((state) => state.profile)
  const allPosts = useFeedStore((state) => state.posts)
  const commentsMap = useFeedStore((state) => state.commentsMap)
  const addPost = useFeedStore((state) => state.addPost)

  const [activeTab, setActiveTab] = useState<ActivityTab>('posts')
  const [composerOpen, setComposerOpen] = useState(false)
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({})

  const carouselRef = useRef<HTMLDivElement>(null)

  const currentFullName = `${profile.firstName} ${profile.lastName}`.trim().toLowerCase()
  const displayFullName = `${profile.firstName} ${profile.lastName}`.trim() || 'Zahra Ijaz'
  const initials = `${profile.firstName?.[0] || 'Z'}${profile.lastName?.[0] || 'I'}`.toUpperCase()

  // Filter posts where user is the author (strictly exclude other users like Amina Qureshi)
  const userOriginalPosts = allPosts.filter((p) => {
    if (p.id === 'amina') return false
    if (p.repostedBy) return false
    const postAuthor = (p.name || '').trim().toLowerCase()
    return (
      postAuthor === currentFullName ||
      (currentFullName.length > 2 && postAuthor.includes(currentFullName)) ||
      p.id.startsWith('post-') ||
      p.id.startsWith('new-')
    )
  })

  // Dynamic user posted images extracted from user's posts
  const userPostedImages: {
    id: string
    src: string
    title: string
    date: string
    likes: number
    comments: number
  }[] = []

  userOriginalPosts.forEach((post) => {
    if (post.images && post.images.length > 0) {
      post.images.forEach((imgUrl, idx) => {
        userPostedImages.push({
          id: `${post.id}-img-${idx}`,
          src: imgUrl,
          title: post.body ? post.body.slice(0, 100) : 'Attached photo',
          date: post.time || 'Recently',
          likes: post.interested || 0,
          comments: post.comments || 0,
        })
      })
    } else if (post.imageUrl) {
      userPostedImages.push({
        id: `${post.id}-img`,
        src: post.imageUrl,
        title: post.body ? post.body.slice(0, 100) : 'Attached photo',
        date: post.time || 'Recently',
        likes: post.interested || 0,
        comments: post.comments || 0,
      })
    }
  })

  // Dynamic user comments from store
  const dynamicComments: { id: string; author: string; time: string; content: string }[] = []
  Object.entries(commentsMap).forEach(([_postId, comments]) => {
    comments.forEach((c) => {
      if (
        c.name.toLowerCase() === currentFullName ||
        c.name.toLowerCase().includes('zahra')
      ) {
        dynamicComments.push({
          id: c.id,
          author: c.name || displayFullName,
          time: c.time || 'Just now',
          content: c.content,
        })
      }
    })
  })

  const defaultComments = [
    {
      id: 'comment-seed-1',
      author: displayFullName,
      time: '1mo',
      content: 'Congratulations Naseer 👏🏻',
    },
    {
      id: 'comment-seed-2',
      author: displayFullName,
      time: '2mo',
      content: 'Nice!!!!',
    },
    {
      id: 'comment-seed-3',
      author: displayFullName,
      time: '2mo',
      content: 'Nice!!!',
    },
  ]

  const allComments = [...dynamicComments, ...defaultComments]

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkScroll = useCallback(() => {
    const el = carouselRef.current
    if (!el) {
      setCanScrollLeft(false)
      setCanScrollRight(false)
      return
    }
    // el.scrollLeft > 5 to account for sub-pixel precision
    setCanScrollLeft(el.scrollLeft > 5)
    // Check if remaining scroll distance is greater than 5px
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5)
  }, [])

  useEffect(() => {
    checkScroll()
    const el = carouselRef.current
    if (!el) return

    el.addEventListener('scroll', checkScroll, { passive: true })
    window.addEventListener('resize', checkScroll)

    // Re-check after layout render
    const timer = setTimeout(checkScroll, 100)

    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
      clearTimeout(timer)
    }
  }, [activeTab, userOriginalPosts.length, allComments.length, userPostedImages.length, checkScroll])

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

  return (
    <>
      <article className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-[0_3px_14px_rgba(20,33,61,0.06)]">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#14213D] leading-tight">
              Activity
            </h2>
            <Link
              to="/profile/activity"
              className="text-xs font-semibold text-[#0a66c2] hover:underline cursor-pointer block mt-0.5"
            >
              {profile.followersCount} followers
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setComposerOpen(true)}
              className="rounded-full border border-[#0a66c2] bg-white hover:bg-[#EEF2F9] text-[#0a66c2] px-3.5 py-1 text-xs font-bold transition-colors cursor-pointer"
            >
              Create a post
            </button>
          </div>
        </div>

        {/* Filter Pills Row (Exact LinkedIn style) */}
        <div className="flex items-center gap-2 pb-3.5 pt-1 overflow-x-auto [scrollbar-width:none]">
          <button
            type="button"
            onClick={() => setActiveTab('posts')}
            className={`rounded-full px-4 py-1 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'posts'
                ? 'bg-[#01754f] text-white shadow-xs'
                : 'border border-[#64748B] text-[#64748B] hover:bg-slate-50'
            }`}
          >
            Posts
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('comments')}
            className={`rounded-full px-4 py-1 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'comments'
                ? 'bg-[#01754f] text-white shadow-xs'
                : 'border border-[#64748B] text-[#64748B] hover:bg-slate-50'
            }`}
          >
            Comments
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('images')}
            className={`rounded-full px-4 py-1 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'images'
                ? 'bg-[#01754f] text-white shadow-xs'
                : 'border border-[#64748B] text-[#64748B] hover:bg-slate-50'
            }`}
          >
            Images
          </button>
        </div>

        {/* CAROUSEL CONTAINER (Horizontal Cards with Navigation Arrow) */}
        <div className="relative group/carousel mt-1">
          {/* Scroll Left Button - Only visible when there are items scrolled to the left */}
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

          {/* Scroll Right Button - Only visible when there are items scrolled to the right */}
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
            userOriginalPosts.length > 0 ? (
              <div
                ref={carouselRef}
                className="flex gap-3.5 overflow-x-auto pb-2 pt-1 [scrollbar-width:none] scroll-smooth snap-x"
              >
                {userOriginalPosts.map((post, idx) => {
                  const isLiked = !!likedMap[post.id]
                  const impressionsCount = post.engagementScore ? post.engagementScore * 3 : 208 + idx * 29

                  return (
                    <div
                      key={post.id}
                      className="w-[290px] sm:w-[325px] shrink-0 snap-start rounded-xl border border-[#E2E8F0] bg-white p-3.5 flex flex-col justify-between shadow-xs hover:border-[#CBD5E1] transition-all"
                    >
                      <div>
                        {/* Author Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="size-10 shrink-0 rounded-full overflow-hidden bg-[#14213D] text-white flex items-center justify-center font-bold text-xs ring-2 ring-[#01754f]">
                              {profile.avatarUrl ? (
                                <img
                                  src={profile.avatarUrl}
                                  alt={displayFullName}
                                  className="size-full object-cover"
                                />
                              ) : (
                                <span>{initials}</span>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-[#14213D] truncate leading-tight">
                                {displayFullName} <span className="font-normal text-[#64748B]">· You</span>
                              </p>
                              <p className="text-[11px] text-[#64748B] truncate leading-tight mt-0.5">
                                {profile.headline || 'Founder & Systems Architect'}
                              </p>
                              <p className="text-[10px] text-[#94A3B8] mt-0.5 leading-none">
                                {post.time || '2w'}
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

                        {/* Post Image Media */}
                        {(post.images?.[0] || post.imageUrl) && (
                          <div className="mt-2.5 overflow-hidden rounded-lg border border-[#E2E8F0] bg-slate-50">
                            <img
                              src={post.images?.[0] || post.imageUrl}
                              alt="Post media preview"
                              className="h-44 w-full object-cover"
                            />
                          </div>
                        )}

                        {/* Post Video Media */}
                        {post.videoUrl && (
                          <div className="mt-2.5 overflow-hidden rounded-lg border border-[#E2E8F0] bg-black">
                            <video
                              src={post.videoUrl}
                              controls
                              className="max-h-44 w-full object-contain"
                            />
                          </div>
                        )}

                        {/* Reactions Stat Row */}
                        <div className="mt-2.5 pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-[#64748B]">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="flex -space-x-1">
                              <span className="flex size-4 items-center justify-center rounded-full bg-[#0a66c2] text-[9px] text-white">👍</span>
                              <span className="flex size-4 items-center justify-center rounded-full bg-[#01754f] text-[9px] text-white">👏</span>
                            </span>
                            <span className="truncate">
                              {post.interested ? `${post.interested} others` : 'Malik Faizan Masood and 7 others'}
                            </span>
                          </div>
                          <span className="shrink-0">{post.comments || 1} comment</span>
                        </div>

                        {/* 4 Action Buttons Row */}
                        <div className="mt-2 pt-1 border-t border-[#F1F5F9] flex items-center justify-around text-[#64748B]">
                          <button
                            type="button"
                            onClick={() => toggleLike(post.id)}
                            className={`flex items-center gap-1 p-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer text-xs font-semibold ${
                              isLiked ? 'text-[#0a66c2]' : ''
                            }`}
                          >
                            <ThumbsUp className={`size-3.5 ${isLiked ? 'fill-[#0a66c2]' : ''}`} />
                          </button>

                          <button
                            type="button"
                            onClick={() => toast.info('Open comments')}
                            className="flex items-center gap-1 p-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer text-xs font-semibold"
                          >
                            <MessageSquare className="size-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => toast.success('Post reposted to feed')}
                            className="flex items-center gap-1 p-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer text-xs font-semibold"
                          >
                            <Repeat2 className="size-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => toast.success('Link copied')}
                            className="flex items-center gap-1 p-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer text-xs font-semibold"
                          >
                            <Send className="size-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Card Footer: Impressions & View Analytics */}
                      <div className="mt-2.5 pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1 font-semibold text-[#14213D]">
                          <BarChart2 className="size-3.5 text-[#64748B]" />
                          <span>{impressionsCount} impressions</span>
                        </span>
                        <Link
                          to="/profile/activity"
                          className="font-bold text-[#0a66c2] hover:underline cursor-pointer"
                        >
                          View analytics
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="py-10 text-center rounded-xl border border-dashed border-[#E2E8F0] bg-slate-50/50">
                <p className="text-xs font-bold text-[#14213D]">No posts published yet</p>
                <button
                  type="button"
                  onClick={() => setComposerOpen(true)}
                  className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#14213D] text-[#F5B544] px-3.5 py-1 text-xs font-bold hover:bg-[#233866] transition-colors cursor-pointer"
                >
                  <Plus className="size-3" />
                  <span>Create your first post</span>
                </button>
              </div>
            )
          )}

          {/* 2. COMMENTS CAROUSEL */}
          {activeTab === 'comments' && (
            <div
              ref={carouselRef}
              className="flex gap-3.5 overflow-x-auto pb-2 pt-1 [scrollbar-width:none] scroll-smooth snap-x"
            >
              {allComments.map((c) => (
                <div
                  key={c.id}
                  className="w-[280px] sm:w-[310px] shrink-0 snap-start rounded-xl border border-[#E2E8F0] bg-white p-3.5 flex flex-col justify-between shadow-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="size-8 shrink-0 rounded-full bg-[#14213D] text-white flex items-center justify-center font-bold text-xs">
                        {c.author[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-[#14213D] truncate">{c.author}</p>
                        <p className="text-[10px] text-[#94A3B8]">{c.time}</p>
                      </div>
                    </div>
                    <p className="text-xs text-[#334155] leading-relaxed line-clamp-3">
                      {c.content}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#F1F5F9] text-[11px] text-[#64748B]">
                    <span>Commented on a founder update</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 3. IMAGES CAROUSEL */}
          {activeTab === 'images' && (
            userPostedImages.length > 0 ? (
              <div
                ref={carouselRef}
                className="flex gap-3.5 overflow-x-auto pb-2 pt-1 [scrollbar-width:none] scroll-smooth snap-x"
              >
                {userPostedImages.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => toast.info(img.title)}
                    className="w-[240px] shrink-0 snap-start rounded-xl border border-[#E2E8F0] bg-white overflow-hidden shadow-xs cursor-pointer hover:border-[#0a66c2] transition-all"
                  >
                    <img src={img.src} alt={img.title} className="h-40 w-full object-cover" />
                    <div className="p-3">
                      <p className="text-xs font-semibold text-[#14213D] line-clamp-1">{img.title}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-[#64748B]">
                        <span>{img.date}</span>
                        <span className="flex items-center gap-1">
                          <Heart className="size-3 text-rose-500 fill-rose-500" />
                          <span>{img.likes}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center rounded-xl border border-dashed border-[#E2E8F0] bg-slate-50/50">
                <p className="text-xs font-bold text-[#14213D]">No photos uploaded yet</p>
              </div>
            )
          )}
        </div>

        {/* BOTTOM FOOTER - Exact LinkedIn 'Show all ➔' */}
        <div className="border-t border-[#F1F5F9] pt-3 mt-3 text-center">
          <Link
            to={`/profile/activity?tab=${activeTab}`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#475569] hover:text-[#14213D] hover:underline transition-colors py-1 cursor-pointer"
          >
            <span>Show all</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </article>

      {/* Composer Dialog Integration */}
      <ComposerDialog
        open={composerOpen}
        onOpenChange={setComposerOpen}
        author={displayFullName}
        initials={initials}
        role={profile.role === 'founder' ? 'Founder' : 'Investor'}
        onPost={(newPost) => {
          addPost(newPost)
          toast.success('Post published to your activity!')
        }}
      />
    </>
  )
}
