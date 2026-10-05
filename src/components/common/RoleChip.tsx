import type { Role } from '@/features/connections/types'
export function RoleChip({role}:{role:Role}){return <span className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${role==='Founder'?'border-[#F5B544]/50 bg-[#FEF3D8] text-[#8A5A00]':'border-[#3F4FA0]/30 bg-[#EEF0FA] text-[#3F4FA0]'}`}>{role}</span>}
