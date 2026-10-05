import { Bell, BriefcaseBusiness, House, MessageSquareText, Mic, Users } from 'lucide-react'

export const navItems = [
  { label: 'Home', to: '/home', icon: House },
  { label: 'Connections', to: '/connections', icon: Users },
  { label: 'Opportunities', to: '/opportunities', icon: BriefcaseBusiness },
  { label: 'Podcasts', to: '/podcasts', icon: Mic },
  { label: 'Communications', to: '/communications', icon: MessageSquareText },
  { label: 'Notifications', to: '/notifications', icon: Bell },
]
