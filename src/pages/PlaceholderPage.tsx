import { useLocation } from 'react-router-dom'

const labels: Record<string, string> = { '/connections': 'Connections', '/opportunities': 'Opportunities', '/podcasts': 'Podcasts', '/communications': 'Communications', '/notifications': 'Notifications' }
export default function PlaceholderPage() {
  const { pathname } = useLocation()
  return <main className="grid min-h-[65vh] place-items-center px-5"><h1 className="text-center text-2xl font-bold">{labels[pathname] ?? 'Bridgeway'} (coming next)</h1></main>
}
