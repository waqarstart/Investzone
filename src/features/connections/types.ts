export type Role = 'Founder' | 'Investor'
export type NetworkTab = 'invitations' | 'celebrations' | 'all' | 'familiar' | 'events' | 'pages'
export interface Person { id: string; name: string; initials: string; role: Role; headline: string; sector: string; mutuals: number; location: string; gradient: string; connected?: string }
export interface Invitation extends Person { match: string; mutualName: string }
export interface Celebration { id: string; initials: string; name: string; text: string; time: string; sector: string; kind: 'deal' | 'career' | 'mandate' }
export interface NetworkEvent { id: string; month: string; day: string; title: string; organizer: string; place: string }
export interface NetworkPage { id: string; initials: string; name: string; description: string }
