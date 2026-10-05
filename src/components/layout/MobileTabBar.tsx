import { NavLink } from 'react-router-dom'
import { navItems } from './navigation'

export function MobileTabBar() {
  return <nav aria-label="Primary mobile" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-6 border-t border-[#E5E7EB] bg-white px-1 pb-[max(env(safe-area-inset-bottom),6px)] pt-2 md:hidden">
    {navItems.map(({ label, to, icon: Icon }) => <NavLink key={to} to={to} end aria-label={label} className={({ isActive }) => `relative flex min-h-12 flex-col items-center justify-center gap-1 text-[9px] ${isActive ? 'font-bold text-[#14213D]' : 'text-[#64748B]'}`}>
      {({ isActive }) => <><Icon className="size-[18px]" />{label === 'Notifications' && <span className="absolute right-2 top-0 size-2 rounded-full bg-[#F2705A]" />}<span className="max-w-full truncate">{label === 'Communications' ? 'Messages' : label}</span>{isActive && <span className="absolute top-0 h-1 w-6 rounded-full bg-[#F5B544]" />}</>}
    </NavLink>)}
  </nav>
}
