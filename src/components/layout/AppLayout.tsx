import { Outlet } from 'react-router-dom'
import { AppHeader } from './AppHeader'
import { MobileTabBar } from './MobileTabBar'
import { MessagingDock } from './MessagingDock'
import { MiniPlayer } from './MiniPlayer'

export function AppLayout() {
  return <div className="min-h-screen bg-[#F3F4F6] text-[#14213D]"><AppHeader /><Outlet /><MessagingDock /><MiniPlayer /><MobileTabBar /></div>
}
