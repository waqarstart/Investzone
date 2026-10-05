import { useState } from 'react'
import { connections as seedConnections, invitations as seedInvitations, people as seedPeople } from './data'
import type { Person } from './types'

export function useConnections() {
  const [invites, setInvites] = useState(seedInvitations)
  const [network, setNetwork] = useState(seedConnections)
  const [suggestions] = useState(seedPeople)
  const [pending, setPending] = useState<string[]>([])
  const [hidden, setHidden] = useState<string[]>([])
  const [undo, setUndo] = useState<{ item: typeof seedInvitations[number]; timeout: ReturnType<typeof setTimeout> } | null>(null)
  function accept(item: typeof seedInvitations[number]) { setInvites(value=>value.filter(x=>x.id!==item.id)); setNetwork(value=>[{...item,connected:'just now'},...value]) }
  function ignore(item: typeof seedInvitations[number]) { setInvites(value=>value.filter(x=>x.id!==item.id)); if(undo) clearTimeout(undo.timeout); const timeout=setTimeout(()=>setUndo(null),5000); setUndo({item,timeout}) }
  function restore() { if(undo){clearTimeout(undo.timeout);setInvites(value=>[undo.item,...value]);setUndo(null)} }
  function togglePending(id:string){setPending(value=>value.includes(id)?value.filter(x=>x!==id):[...value,id])}
  function dismiss(id:string){setHidden(value=>[...value,id])}
  function remove(person:Person){setNetwork(value=>value.filter(x=>x.id!==person.id))}
  return { invites, network, suggestions:suggestions.filter(p=>!hidden.includes(p.id)), pending, undo, accept, ignore, restore, togglePending, dismiss, remove, setNetwork }
}
