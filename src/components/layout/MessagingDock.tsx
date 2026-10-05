import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronUp, MessageSquare, Pencil, Search } from 'lucide-react'
import { usePlayerStore } from '@/features/podcasts/usePlayerStore'

const conversations = [
  ['AQ', 'Amina Qureshi', 'Thanks for the introduction!', '2m'],
  ['MV', 'Marcus Vance', 'Could you share the deck?', '18m'],
  ['ZB', 'Zainab Bilal', 'Great connecting with you.', '1h'],
  ['AC', 'Apex Capital', 'Allocation review is ready.', '3h'],
]

export function MessagingDock() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const playerOpen = usePlayerStore((state) => state.track !== null)
  return <>
    <div className="fixed bottom-0 right-4 z-30 hidden w-[260px] overflow-hidden rounded-t-2xl border border-[#E5E7EB] bg-white shadow-[0_4px_20px_rgba(20,33,61,0.15)] md:block">
      <button onClick={() => setOpen((value) => !value)} className="flex h-12 w-full items-center gap-2 px-3 text-left" aria-expanded={open}><span className="relative grid size-7 place-items-center rounded-full bg-[#14213D] text-[10px] font-bold text-white">TM<i className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border border-white bg-[#5BA4E6]" /></span><span className="text-sm font-semibold">Messaging</span><span className="rounded-full bg-[#F2705A] px-1.5 text-[10px] font-bold text-white">3</span><Pencil className="ml-auto size-4 text-[#94A3B8]" /><span aria-label={open ? 'Collapse messaging' : 'Expand messaging'}>{open ? <ChevronDown className="size-4" /> : <ChevronUp className="size-4" />}</span></button>
      {open && <div className="border-t border-[#E5E7EB] p-3"><div className="relative mb-2"><Search className="absolute left-2.5 top-2.5 size-4 text-[#94A3B8]" /><input placeholder="Search messages" className="h-9 w-full rounded-lg bg-[#F3F4F6] pl-8 text-xs outline-none focus:ring-2 focus:ring-[#3F4FA0]" /></div>{conversations.map(([initials, name, message, time]) => <button key={name} onClick={() => navigate('/communications')} className="flex w-full items-center gap-2 rounded-lg p-2 text-left hover:bg-[#F3F4F6]"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#14213D] text-xs font-bold text-white">{initials}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold">{name}</span><span className="block truncate text-[11px] text-[#64748B]">{message}</span></span><span className="text-[10px] text-[#94A3B8]">{time}</span></button>)}</div>}
    </div>
    <button onClick={() => navigate('/communications')} className={`fixed bottom-[calc(76px+env(safe-area-inset-bottom))] right-4 z-30 size-[52px] place-items-center rounded-full bg-[#F5B544] text-[#14213D] shadow-lg md:hidden ${playerOpen ? 'hidden' : 'grid'}`} aria-label="Open messaging"><MessageSquare className="size-5" /><span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-[#F2705A] text-[10px] font-bold text-white">3</span></button>
  </>
}
