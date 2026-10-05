import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { toast } from 'sonner'
import { useJoinStore } from '@/features/join/useJoinStore'
import { posts as initialPosts } from '@/features/home/data'
import type { Post } from '@/features/home/types'
import { ComposerCard } from '@/features/home/components/ComposerDialog'
import { ComposerDialog } from '@/features/home/components/ComposerDialog'
import { SuccessStories } from '@/features/home/components/SuccessStories'
import { PostCard } from '@/features/home/components/PostCard'
import { IntelligenceCard, NotificationsCard, SidebarFooter, SuggestedCard } from '@/features/home/components/Sidebar'

export default function HomePage() {
  const profile = useJoinStore((state) => state.profile)
  const firstName = profile?.firstName || 'Tariq'
  const lastName = profile?.lastName || 'Mansoor'
  const initials = `${firstName[0] ?? 'T'}${lastName[0] ?? 'M'}`.toUpperCase()
  const [items, setItems] = useState(initialPosts)
  const [hidden, setHidden] = useState<string[]>([])
  const [composerOpen, setComposerOpen] = useState(false)
  const [composerPreset, setComposerPreset] = useState('Pitch')
  const [sort, setSort] = useState<'Top Deals & Matches' | 'Most recent'>('Top Deals & Matches')
  const visible = useMemo(() => items.filter((post) => !hidden.includes(post.id)).sort((a, b) => sort === 'Most recent' ? b.createdAt - a.createdAt : b.engagementScore - a.engagementScore), [items, hidden, sort])
  const openComposer = (preset = 'Pitch') => { setComposerPreset(preset); setComposerOpen(true) }
  return <main className="mx-auto w-full max-w-[1280px] px-3 pb-28 pt-5 sm:px-5 lg:px-6 lg:pb-24 lg:pt-6"><h1 className="sr-only">Home</h1><div className="grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]"><div className="min-w-0 space-y-5"><SuccessStories initials={initials} onShare={() => openComposer('Success story')} /><ComposerCard onOpen={openComposer} /><div className="flex items-center gap-3 px-1 pt-1"><span className="h-px flex-1 bg-[#E2E8F0]" /><label className="text-xs text-[#64748B]">Sort by:</label><div className="relative"><select value={sort} onChange={(event) => setSort(event.target.value as typeof sort)} className="appearance-none bg-transparent pr-5 text-xs font-bold text-[#14213D] outline-none"><option>Top Deals & Matches</option><option>Most recent</option></select><ChevronDown className="pointer-events-none absolute right-0 top-0.5 size-3" /></div></div><div className="space-y-5">{visible.map((post, index) => <div key={post.id} className={index === 1 ? 'contents' : undefined}><PostCard post={post} onHide={(id) => { setHidden((values) => [...values, id]); toast('Post hidden (demo)') }} />{index === 0 && <div className="grid gap-4 md:grid-cols-2 lg:hidden"><SuggestedCard /><NotificationsCard /></div>}</div>)}</div><button onClick={() => toast('You are all caught up (demo)')} className="w-full rounded-xl border border-[#E5E7EB] bg-white py-3 text-sm font-semibold text-[#3F4FA0]">Load more</button></div><aside aria-label="Recommendations and notifications" className="min-w-0 space-y-5 lg:sticky lg:top-[104px] lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pb-2"><div className="hidden space-y-5 lg:block"><SuggestedCard /><NotificationsCard /><IntelligenceCard /><SidebarFooter /></div><div className="space-y-5 lg:hidden"><IntelligenceCard /><SidebarFooter /></div></aside></div><ComposerDialog open={composerOpen} onOpenChange={setComposerOpen} author={`${firstName} ${lastName}`} initials={initials} preset={composerPreset} onPost={(post: Post) => setItems((current) => [post, ...current])} /></main>
}
