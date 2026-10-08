import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, Gem, Search, X } from 'lucide-react'
import { toast } from 'sonner'
import { Logo } from '@/components/auth/Logo'
import { useJoinStore } from '@/features/join/useJoinStore'
import { useProfileStore } from '@/features/profile/useProfileStore'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { navItems } from './navigation'

export function AppHeader() {
  const profile = useProfileStore((state) => state.profile)
  const joinProfile = useJoinStore((state) => state.profile)
  const clearProfile = useJoinStore((state) => state.clearProfile)
  const navigate = useNavigate()
  const [mobileSearch, setMobileSearch] = useState(false)
  const [query, setQuery] = useState('')
  const firstName = profile?.firstName || joinProfile?.firstName || 'Syeda Zahra'
  const lastName = profile?.lastName || joinProfile?.lastName || 'Ijaz'
  const initials = `${firstName[0] ?? 'Z'}${lastName[0] ?? 'I'}`.toUpperCase()
  const avatarUrl = profile?.avatarUrl

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    toast('Search is coming soon (demo)')
  }

  return (
    <header className="sticky top-0 z-50 bg-[#F5B544] shadow-[0_4px_16px_rgba(20,33,61,0.18)]">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-2 px-3 sm:px-5 lg:h-20 lg:gap-4">
        <Logo to="/home" size={38} className="shrink-0 [&>span:first-child]:hidden sm:[&>span:first-child]:flex" />
        <form onSubmit={submitSearch} className={`${mobileSearch ? 'absolute left-0 top-full flex w-full bg-[#F5B544] px-4 pb-3 sm:static sm:w-auto sm:bg-transparent sm:p-0' : 'hidden'} relative h-10 flex-1 items-center sm:flex sm:max-w-[310px] lg:max-w-[310px]`}>
          <Search className="absolute left-3 size-4 text-[#14213D]/70" aria-hidden="true" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search ideas, investors, opportunities…" className="h-full min-w-0 w-full rounded-full border border-[#14213D]/10 bg-white/85 pl-9 pr-3 text-xs text-[#14213D] outline-none placeholder:text-[#475569] focus:ring-2 focus:ring-[#3F4FA0]" aria-label="Search" />
          {mobileSearch && <button type="button" onClick={() => setMobileSearch(false)} className="absolute right-6 sm:hidden" aria-label="Close search"><X className="size-4" /></button>}
        </form>
        <div className="flex items-center gap-1 sm:hidden">
          <Button variant="ghost" size="icon" className="size-10" aria-label="Open search" onClick={() => setMobileSearch((value) => !value)}><Search /></Button>
          <NavLink to="/notifications" aria-label="Notifications" className="relative grid size-10 place-items-center"><Bell className="size-5" /><span className="absolute right-1 top-0 grid size-4 place-items-center rounded-full bg-[#14213D] text-[10px] text-white">3</span></NavLink>
          <ProfileMenu initials={initials} firstName={firstName} avatarUrl={avatarUrl} clearProfile={clearProfile} navigate={navigate} />
        </div>
        <nav aria-label="Primary" className="hidden flex-1 items-stretch justify-center gap-1 md:flex lg:gap-2">
          {navItems.map(({ label, to, icon: Icon }) => <NavLink key={to} to={to} end title={label} className={({ isActive }) => `group relative flex min-w-[42px] flex-col items-center justify-center gap-1 px-2 text-[11px] ${isActive ? 'font-bold text-[#14213D]' : 'text-[#14213D]/70 hover:text-[#14213D]'}`}>
            <span className="relative"><Icon className="size-[18px]" />{label === 'Notifications' && <span className="absolute -right-2 -top-2 grid size-4 place-items-center rounded-full bg-[#14213D] text-[9px] font-bold text-white">3</span>}</span>
            <span className="hidden xl:block">{label}</span>
            <span className="absolute inset-x-1 bottom-0 h-[3px] rounded-full bg-[#14213D] opacity-0 group-aria-[current=page]:opacity-100" />
          </NavLink>)}
        </nav>
        <div className="hidden items-center gap-3 border-l border-[#14213D]/20 pl-3 sm:flex">
          <ProfileMenu initials={initials} firstName={firstName} avatarUrl={avatarUrl} clearProfile={clearProfile} navigate={navigate} />
          <Button onClick={() => toast('Premium is coming soon (demo)')} className="hidden h-9 rounded-full bg-[#14213D] px-4 text-xs font-semibold text-[#F5B544] hover:bg-[#24365c] lg:inline-flex"><Gem className="size-3.5" /> Try Premium</Button>
        </div>
      </div>
    </header>
  )
}

function ProfileMenu({ initials, firstName, avatarUrl, clearProfile, navigate }: { initials: string; firstName: string; avatarUrl?: string; clearProfile: () => void; navigate: ReturnType<typeof useNavigate> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-10 items-center gap-1.5 rounded-full px-1.5 text-sm font-semibold text-[#14213D] outline-none focus-visible:ring-2 focus-visible:ring-[#3F4FA0] cursor-pointer" aria-label="Profile menu">
          <span className="relative grid size-8 place-items-center rounded-full bg-[#14213D] text-xs font-bold text-white overflow-hidden ring-1 ring-white/50">
            {avatarUrl ? (
              <img src={avatarUrl} alt={firstName} className="size-full object-cover" />
            ) : (
              initials
            )}
            <i className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[#F5B544] bg-[#5BA4E6]" />
          </span>
          <span className="hidden sm:inline">{firstName === 'Tariq' ? 'Me' : firstName}</span>
          <ChevronDown className="hidden size-3 sm:block" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => navigate('/profile')}>My profile</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast('Settings are coming soon (demo)')}>Settings</DropdownMenuItem>
        <DropdownMenuItem onSelect={() => { clearProfile(); navigate('/') }}>Sign out</DropdownMenuItem>
        <DropdownMenuItem className="md:hidden" onSelect={() => toast('Premium is coming soon (demo)')}><Gem className="size-4" /> Try Premium</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
