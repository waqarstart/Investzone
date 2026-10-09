import { useState } from 'react'
import { ArrowRight, Heart, Image as ImageIcon, MessageSquare, Play, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { useFeedStore } from '@/features/home/useFeedStore'
import { PostCard } from '@/features/home/components/PostCard'
import { useProfileStore } from '../useProfileStore'

type ActivityTab = 'posts' | 'comments' | 'images' | 'videos'

export function ProfileActivityCard() {
  const profile = useProfileStore((state) => state.profile)
  const allPosts = useFeedStore((state) => state.posts)
  const commentsMap = useFeedStore((state) => state.commentsMap)
  const [activeTab, setActiveTab] = useState<ActivityTab>('posts')
  const [showAllComments, setShowAllComments] = useState(false)

  const currentFullName = `${profile.firstName} ${profile.lastName}`.trim().toLowerCase()
  const displayFullName = `${profile.firstName} ${profile.lastName}`.trim() || 'Zahra Ijaz'

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
  const visibleComments = showAllComments ? allComments : allComments.slice(0, 3)

  return (
    <article className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 sm:p-6 shadow-[0_3px_14px_rgba(20,33,61,0.06)]">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h2 className="text-base font-bold text-[#14213D]">Activity</h2>
          <p className="text-xs font-semibold text-[#3F4FA0]">
            {profile.followersCount} followers
          </p>
        </div>

        <Link
          to="/home"
          className="flex items-center gap-1.5 rounded-full border border-[#3F4FA0] bg-white hover:bg-[#EEF0FA] text-[#3F4FA0] px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer"
        >
          <Plus className="size-3.5" />
          <span>Create a post</span>
        </Link>
      </div>

      {/* Filter Tabs: Posts, Comments, Images, Videos */}
      <div className="flex items-center gap-2 border-b border-[#F1F5F9] pb-3 mb-4 overflow-x-auto [scrollbar-width:none]">
        <button
          type="button"
          onClick={() => setActiveTab('posts')}
          className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'posts'
              ? 'bg-[#14213D] text-white font-bold'
              : 'text-[#64748B] hover:bg-slate-100'
          }`}
        >
          Posts ({userOriginalPosts.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('comments')}
          className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'comments'
              ? 'bg-[#14213D] text-white font-bold'
              : 'text-[#64748B] hover:bg-slate-100'
          }`}
        >
          Comments ({allComments.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('images')}
          className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'images'
              ? 'bg-[#14213D] text-white font-bold'
              : 'text-[#64748B] hover:bg-slate-100'
          }`}
        >
          Images ({userPostedImages.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('videos')}
          className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'videos'
              ? 'bg-[#14213D] text-white font-bold'
              : 'text-[#64748B] hover:bg-slate-100'
          }`}
        >
          Videos ({userPostedVideos.length})
        </button>
      </div>

      {/* Tab Contents */}
      <div className="space-y-4">
        {/* 1. Posts Tab */}
        {activeTab === 'posts' && (
          userOriginalPosts.length > 0 ? (
            userOriginalPosts.map((post) => (
              <PostCard key={post.id} post={post} onHide={() => {}} />
            ))
          ) : (
            <div className="py-12 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#EEF0FA] text-[#3F4FA0] mb-3">
                <Plus className="size-6" />
              </div>
              <h3 className="text-sm font-bold text-[#14213D]">No posts published yet</h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto mt-1 mb-4">
                Share updates, venture milestones, or deal announcements with your network.
              </p>
              <Link
                to="/home"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#14213D] text-[#F5B544] px-4 py-2 text-xs font-bold hover:bg-[#233866] transition-colors"
              >
                <Plus className="size-3.5" />
                <span>Create a post</span>
              </Link>
            </div>
          )
        )}

        {/* 2. Comments Tab */}
        {activeTab === 'comments' && (
          <div className="space-y-0">
            {visibleComments.map((item) => (
              <div
                key={item.id}
                className="border-b border-[#F1F5F9] py-3.5 first:pt-0"
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

            {/* Show all footer */}
            <div className="pt-3 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAllComments(!showAllComments)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#475569] hover:text-[#14213D] hover:underline transition-colors cursor-pointer"
              >
                <span>{showAllComments ? 'Show less' : 'Show all'}</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 3. Images Tab */}
        {activeTab === 'images' && (
          userPostedImages.length > 0 ? (
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
          ) : (
            <div className="py-12 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#EEF0FA] text-[#3F4FA0] mb-3">
                <ImageIcon className="size-6" />
              </div>
              <h3 className="text-sm font-bold text-[#14213D]">No photos posted yet</h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto mt-1 mb-4">
                When you attach photos to your posts, they will automatically appear here in your media gallery.
              </p>
              <Link
                to="/home"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#14213D] text-[#F5B544] px-4 py-2 text-xs font-bold hover:bg-[#233866] transition-colors"
              >
                <Plus className="size-3.5" />
                <span>Create a post</span>
              </Link>
            </div>
          )
        )}

        {/* 4. Videos Tab */}
        {activeTab === 'videos' && (
          userPostedVideos.length > 0 ? (
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
          ) : (
            <div className="py-12 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#EEF0FA] text-[#3F4FA0] mb-3">
                <Play className="size-6 text-[#3F4FA0]" />
              </div>
              <h3 className="text-sm font-bold text-[#14213D]">No videos posted yet</h3>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto mt-1 mb-4">
                When you upload video updates or founder memos, they will automatically appear here.
              </p>
              <Link
                to="/home"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#14213D] text-[#F5B544] px-4 py-2 text-xs font-bold hover:bg-[#233866] transition-colors"
              >
                <Plus className="size-3.5" />
                <span>Create a post</span>
              </Link>
            </div>
          )
        )}
      </div>
    </article>
  )
}
