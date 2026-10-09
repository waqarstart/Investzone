import { useState } from 'react'
import { ArrowLeft, Heart, Image as ImageIcon, MessageSquare, Play, Plus } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { PostCard } from '@/features/home/components/PostCard'
import { useFeedStore } from '@/features/home/useFeedStore'
import { useProfileStore } from '@/features/profile/useProfileStore'
import { ProfileSidebar } from '@/features/profile/components/ProfileSidebar'
import { ComposerDialog } from '@/features/home/components/ComposerDialog'

type ActivityTab = 'posts' | 'comments' | 'images' | 'videos'

export default function ProfileActivityPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = (searchParams.get('tab') as ActivityTab) || 'posts'
  const [activeTab, setActiveTab] = useState<ActivityTab>(
    ['posts', 'comments', 'images', 'videos'].includes(initialTab) ? initialTab : 'posts'
  )
  const [composerOpen, setComposerOpen] = useState(false)

  const profile = useProfileStore((state) => state.profile)
  const allPosts = useFeedStore((state) => state.posts)
  const commentsMap = useFeedStore((state) => state.commentsMap)
  const addPost = useFeedStore((state) => state.addPost)

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

  // Dynamic user posted videos extracted from user's posts
  const userPostedVideos: {
    id: string
    videoUrl: string
    title: string
    date: string
    likes: number
    comments: number
  }[] = []

  userOriginalPosts.forEach((post) => {
    if (post.videoUrl) {
      userPostedVideos.push({
        id: `${post.id}-vid`,
        videoUrl: post.videoUrl,
        title: post.body ? post.body.slice(0, 100) : 'Attached video',
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

  // Default initial comments matching profile activity
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

  function handleTabChange(tab: ActivityTab) {
    setActiveTab(tab)
    setSearchParams({ tab })
  }

  return (
    <div className="mx-auto max-w-[1128px] px-3 sm:px-4 py-4 sm:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Main Column */}
        <div className="lg:col-span-8 space-y-4">
          {/* Back to profile & User Summary Banner Card */}
          <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-[0_3px_14px_rgba(20,33,61,0.06)]">
            <div className="flex items-center justify-between mb-4">
              <Link
                to="/profile"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#3F4FA0] hover:text-[#14213D] hover:underline transition-colors cursor-pointer"
              >
                <ArrowLeft className="size-4" />
                <span>Back to profile</span>
              </Link>

              <button
                type="button"
                onClick={() => setComposerOpen(true)}
                className="flex items-center gap-1.5 rounded-full border border-[#3F4FA0] bg-white hover:bg-[#EEF0FA] text-[#3F4FA0] px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="size-3.5" />
                <span>Create a post</span>
              </button>
            </div>

            {/* User Title & Followers */}
            <div className="flex items-center gap-3.5 border-t border-[#F1F5F9] pt-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#14213D] text-sm font-bold text-white overflow-hidden ring-2 ring-[#E2E8F0]">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={displayFullName} className="size-full object-cover" />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-lg font-bold text-[#14213D] truncate">
                  {displayFullName}'s All Activity
                </h1>
                <p className="text-xs text-[#64748B] font-medium">
                  {profile.followersCount} followers
                </p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-[#F1F5F9] pb-3 pt-5 overflow-x-auto [scrollbar-width:none]">
              <button
                type="button"
                onClick={() => handleTabChange('posts')}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'posts'
                    ? 'bg-[#14213D] text-white font-bold shadow-xs'
                    : 'text-[#64748B] hover:bg-slate-100'
                }`}
              >
                Posts ({userOriginalPosts.length})
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('comments')}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'comments'
                    ? 'bg-[#14213D] text-white font-bold shadow-xs'
                    : 'text-[#64748B] hover:bg-slate-100'
                }`}
              >
                Comments ({allComments.length})
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('images')}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'images'
                    ? 'bg-[#14213D] text-white font-bold shadow-xs'
                    : 'text-[#64748B] hover:bg-slate-100'
                }`}
              >
                Images ({userPostedImages.length})
              </button>

              <button
                type="button"
                onClick={() => handleTabChange('videos')}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === 'videos'
                    ? 'bg-[#14213D] text-white font-bold shadow-xs'
                    : 'text-[#64748B] hover:bg-slate-100'
                }`}
              >
                Videos ({userPostedVideos.length})
              </button>
            </div>
          </div>

          {/* Tab Contents: All Posts, All Comments, All Images, All Videos */}
          <div className="space-y-4">
            {/* 1. Posts Tab (ALL user posts) */}
            {activeTab === 'posts' && (
              userOriginalPosts.length > 0 ? (
                userOriginalPosts.map((post) => (
                  <PostCard key={post.id} post={post} onHide={() => {}} />
                ))
              ) : (
                <div className="rounded-2xl border border-[#E5E7EB] bg-white py-14 text-center shadow-xs">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#EEF0FA] text-[#3F4FA0] mb-3">
                    <Plus className="size-6" />
                  </div>
                  <h3 className="text-sm font-bold text-[#14213D]">No posts published yet</h3>
                  <p className="text-xs text-[#64748B] max-w-sm mx-auto mt-1 mb-4">
                    Share updates, venture milestones, or deal announcements with your network.
                  </p>
                  <button
                    type="button"
                    onClick={() => setComposerOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#14213D] text-[#F5B544] px-4 py-2 text-xs font-bold hover:bg-[#233866] transition-colors cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    <span>Create a post</span>
                  </button>
                </div>
              )
            )}

            {/* 2. Comments Tab (ALL comments) */}
            {activeTab === 'comments' && (
              <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs space-y-0">
                <h3 className="text-sm font-bold text-[#14213D] mb-3">All Comments ({allComments.length})</h3>
                {allComments.map((item) => (
                  <div
                    key={item.id}
                    className="border-b border-[#F1F5F9] py-3.5 first:pt-0 last:border-b-0"
                  >
                    <p className="text-xs text-[#64748B]">
                      <span className="font-semibold text-[#334155]">{item.author}</span>
                      {' commented on a post · '}
                      <span>{item.time}</span>
                    </p>
                    <p className="mt-1.5 text-xs sm:text-sm text-[#14213D] font-normal leading-relaxed break-words [overflow-wrap:anywhere]">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* 3. Images Tab (ALL images) */}
            {activeTab === 'images' && (
              userPostedImages.length > 0 ? (
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs">
                  <h3 className="text-sm font-bold text-[#14213D] mb-4">All Uploaded Photos ({userPostedImages.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                    {userPostedImages.map((img) => (
                      <div
                        key={img.id}
                        onClick={() => toast.info(img.title)}
                        className="group relative overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] cursor-pointer hover:border-[#3F4FA0] transition-all"
                      >
                        <div className="h-44 w-full overflow-hidden bg-slate-100">
                          <img
                            src={img.src}
                            alt={img.title}
                            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="p-3">
                          <p className="text-xs font-semibold text-[#14213D] line-clamp-2 leading-snug">
                            {img.title}
                          </p>
                          <div className="mt-2 flex items-center justify-between text-[11px] text-[#64748B]">
                            <span>{img.date}</span>
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Heart className="size-3 text-rose-500 fill-rose-500" />
                                <span>{img.likes}</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="size-3 text-[#3F4FA0]" />
                                <span>{img.comments}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-[#E5E7EB] bg-white py-14 text-center shadow-xs">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#EEF0FA] text-[#3F4FA0] mb-3">
                    <ImageIcon className="size-6" />
                  </div>
                  <h3 className="text-sm font-bold text-[#14213D]">No photos posted yet</h3>
                  <p className="text-xs text-[#64748B] max-w-sm mx-auto mt-1 mb-4">
                    When you attach photos to your posts, they will automatically appear here.
                  </p>
                  <button
                    type="button"
                    onClick={() => setComposerOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#14213D] text-[#F5B544] px-4 py-2 text-xs font-bold hover:bg-[#233866] transition-colors cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    <span>Create a post</span>
                  </button>
                </div>
              )
            )}

            {/* 4. Videos Tab (ALL videos) */}
            {activeTab === 'videos' && (
              userPostedVideos.length > 0 ? (
                <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-xs">
                  <h3 className="text-sm font-bold text-[#14213D] mb-4">All Uploaded Videos ({userPostedVideos.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {userPostedVideos.map((vid) => (
                      <div
                        key={vid.id}
                        className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-black shadow-sm"
                      >
                        <video
                          src={vid.videoUrl}
                          controls
                          className="w-full max-h-[260px] object-contain"
                        />
                        <div className="p-3 bg-white">
                          <p className="text-xs font-bold text-[#14213D] line-clamp-2">
                            {vid.title}
                          </p>
                          <p className="text-[10px] text-[#64748B] mt-1">{vid.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-[#E5E7EB] bg-white py-14 text-center shadow-xs">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#EEF0FA] text-[#3F4FA0] mb-3">
                    <Play className="size-6 text-[#3F4FA0]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#14213D]">No videos posted yet</h3>
                  <p className="text-xs text-[#64748B] max-w-sm mx-auto mt-1 mb-4">
                    When you upload video updates, they will appear here.
                  </p>
                  <button
                    type="button"
                    onClick={() => setComposerOpen(true)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#14213D] text-[#F5B544] px-4 py-2 text-xs font-bold hover:bg-[#233866] transition-colors cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    <span>Create a post</span>
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 lg:sticky lg:top-[88px] lg:max-h-[calc(100vh-100px)] lg:overflow-y-auto lg:overscroll-contain no-scrollbar">
          <ProfileSidebar />
        </div>
      </div>

      {/* Composer Dialog for creating a post directly */}
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
    </div>
  )
}
