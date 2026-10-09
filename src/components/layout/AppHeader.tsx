import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Bell, ChevronDown, Gem, Search, X } from 'lucide-react'
import { toast } from 'sonner'
import { Logo } from '@/components/auth/Logo'
import { useJoinStore } from '@/features/join/useJoinStore'
import { useProfileStore } from '@/features/profile/useProfileStore'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MEMBER_PROFILES } from '@/features/profile/data/memberProfiles'
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

  const [isFocused, setIsFocused] = useState(false)

  // Search through members
  const trimmed = query.trim().toLowerCase()
  const searchResults = trimmed.length > 0
    ? Object.values(MEMBER_PROFILES).filter((m) =>
        m.name.toLowerCase().includes(trimmed) ||
        m.role.toLowerCase().includes(trimmed) ||
        m.headline.toLowerCase().includes(trimmed) ||
        m.skills.some((s) => s.toLowerCase().includes(trimmed))
      )
    : []

  function submitSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (searchResults.length > 0) {
      navigate(`/profile/member/${searchResults[0].id}`)
      setQuery('')
      setIsFocused(false)
      setMobileSearch(false)
    } else if (trimmed) {
      toast.info(`No members found matching "${query}"`)
    }
  }

  function handleSelectMember(memberId: string) {
    navigate(`/profile/member/${memberId}`)
    setQuery('')
    setIsFocused(false)
    setMobileSearch(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-[#F5B544] shadow-[0_4px_16px_rgba(20,33,61,0.18)]">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-2 px-3 sm:px-5 lg:h-20 lg:gap-4">
        <Logo to="/home" size={38} className="shrink-0 [&>span:first-child]:hidden sm:[&>span:first-child]:flex" />
        <div className="relative flex-1 sm:max-w-[310px] lg:max-w-[340px]">
          <form onSubmit={submitSearch} className={`${mobileSearch ? 'absolute left-0 top-full flex w-full bg-[#F5B544] px-4 pb-3 sm:static sm:w-auto sm:bg-transparent sm:p-0' : 'hidden'} relative h-10 w-full items-center sm:flex`}>
            <Search className="absolute left-3 size-4 text-[#14213D]/70" aria-hidden="true" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Search ideas, investors, opportunities…"
              className="h-full min-w-0 w-full rounded-full border border-[#14213D]/10 bg-white/85 pl-9 pr-8 text-xs text-[#14213D] outline-none placeholder:text-[#475569] focus:ring-2 focus:ring-[#3F4FA0] focus:bg-white transition-all"
              aria-label="Search"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-3 text-[#64748B] hover:text-[#14213D] cursor-pointer"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            )}
            {mobileSearch && <button type="button" onClick={() => setMobileSearch(false)} className="absolute right-8 sm:hidden" aria-label="Close search"><X className="size-4" /></button>}
          </form>

          {/* Real-time Search Dropdown Menu */}
          {isFocused && trimmed.length > 0 && (
            <div className="absolute left-0 top-11 z-50 w-full sm:w-[360px] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                {searchResults.length > 0 ? `People & Members (${searchResults.length})` : 'No results found'}
              </div>

              {searchResults.length > 0 ? (
                <div className="max-h-[300px] overflow-y-auto space-y-1">
                  {searchResults.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        handleSelectMember(member.id)
                      }}
                      className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                    >
                      <div className="relative size-9 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-[#14213D] text-white flex items-center justify-center font-bold text-xs">
                        {member.avatar ? (
                          <img src={member.avatar} alt={member.name} className="size-full object-cover" />
                        ) : (
                          member.initials
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-[#14213D] group-hover:text-[#3F4FA0] truncate">
                            {member.name}
                          </p>
                          <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-bold text-[#475569]">
                            {member.role}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#64748B] truncate">
                          {member.headline}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center text-xs text-[#64748B]">
                  No people found matching "{query}"
                </div>
              )}
            </div>
          )}
        </div>
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
