import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { useJoinStore } from '@/features/join/useJoinStore'
import { useProfileStore } from '@/features/profile/useProfileStore'
import { useFeedStore } from '@/features/home/useFeedStore'
import type { Post } from '@/features/home/types'
import { ComposerCard, ComposerDialog } from '@/features/home/components/ComposerDialog'
import { SuccessStories } from '@/features/home/components/SuccessStories'
import { PostCard } from '@/features/home/components/PostCard'
import {
  IntelligenceCard,
  NotificationsCard,
  SidebarFooter,
  SuggestedCard,
} from '@/features/home/components/Sidebar'

export default function HomePage() {
  const profileStore = useProfileStore((state) => state.profile)
  const joinProfile = useJoinStore((state) => state.profile)
  const firstName = profileStore?.firstName || joinProfile?.firstName || 'Syeda Zahra'
  const lastName = profileStore?.lastName || joinProfile?.lastName || 'Ijaz'
  const initials = `${firstName[0] ?? 'Z'}${lastName[0] ?? 'I'}`.toUpperCase()
  const role = profileStore?.role || joinProfile?.role || 'founder'

  const items = useFeedStore((state) => state.posts)
  const hidden = useFeedStore((state) => state.hiddenIds)
  const addPost = useFeedStore((state) => state.addPost)
  const updatePost = useFeedStore((state) => state.updatePost)
  const deletePost = useFeedStore((state) => state.deletePost)
  const hidePost = useFeedStore((state) => state.hidePost)

  const [composerOpen, setComposerOpen] = useState(false)
  const [composerPreset, setComposerPreset] = useState('Pitch')

  const visible = useMemo(
    () =>
      items
        .filter((post) => !hidden.includes(post.id))
        .sort((a, b) => (b.engagementScore || 0) - (a.engagementScore || 0)),
    [items, hidden]
  )

  const openComposer = (preset = 'Pitch') => {
    setComposerPreset(preset)
    setComposerOpen(true)
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] px-3 pb-28 pt-5 sm:px-5 lg:px-6 lg:pb-24 lg:pt-6">
      <h1 className="sr-only">Home</h1>
      <div className="grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
        <div className="min-w-0 space-y-5">
          <SuccessStories initials={initials} onShare={() => openComposer('Success story')} />
          <ComposerCard onOpen={openComposer} initials={initials} />



          <div className="space-y-5">
            {visible.map((post, index) => (
              <div key={post.id} className={index === 1 ? 'contents' : undefined}>
                <PostCard
                  post={post}
                  onHide={(id) => {
                    hidePost(id)
                    toast('Post hidden (demo)')
                  }}
                  onEdit={(updated) => updatePost(updated)}
                  onDelete={(id) => deletePost(id)}
                />
                {index === 0 && (
                  <div className="grid gap-4 md:grid-cols-2 lg:hidden">
                    <SuggestedCard />
                    <NotificationsCard />
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => toast('You are all caught up (demo)')}
            className="w-full rounded-xl border border-[#E5E7EB] bg-white py-3 text-sm font-semibold text-[#3F4FA0] hover:bg-slate-50 transition-colors"
          >
            Load more
          </button>
        </div>

        <aside
          aria-label="Recommendations and notifications"
          className="min-w-0 space-y-5 lg:sticky lg:top-[104px] lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:overscroll-contain no-scrollbar lg:pb-2"
        >
          <div className="hidden space-y-5 lg:block">
            <SuggestedCard />
            <NotificationsCard />
            <IntelligenceCard />
            <SidebarFooter />
          </div>
          <div className="space-y-5 lg:hidden">
            <IntelligenceCard />
            <SidebarFooter />
          </div>
        </aside>
      </div>

      <ComposerDialog
        open={composerOpen}
        onOpenChange={setComposerOpen}
        author={`${firstName} ${lastName}`}
        initials={initials}
        role={role === 'investor' ? 'Investor' : 'Founder'}
        preset={composerPreset}
        onPost={(post: Post) => addPost(post)}
      />
    </main>
  )
}
