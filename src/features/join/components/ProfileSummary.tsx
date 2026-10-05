import type { LucideIcon } from "lucide-react"
import { BadgeCheck, BriefcaseBusiness, ContactRound, LockKeyhole, Mail, MapPin, ShieldCheck, Smartphone, UserRound } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { useFormContext, useWatch } from "react-hook-form"
import { maskEmail, maskPhone } from "@/features/join/lib/contact"
import { STEPS } from "@/features/join/steps"
import { cn } from "@/lib/utils"
import type { FormValues } from "../schemas"

interface ProfileSummaryProps { completedCount: number }
interface Row { id: string; icon: LucideIcon; label: string; value: string; emptyText: string; badge?: { label: string; className: string } }

export function ProfileSummary({ completedCount }: ProfileSummaryProps) {
  const reduced = useReducedMotion()
  const { control } = useFormContext<FormValues>()
  const firstName = useWatch({ control, name: "firstName" }) || ""
  const lastName = useWatch({ control, name: "lastName" }) || ""
  const contactMethod = useWatch({ control, name: "contactMethod" })
  const phone = useWatch({ control, name: "phone" }) || ""
  const email = useWatch({ control, name: "email" }) || ""
  const location = useWatch({ control, name: "location" }) || ""
  const role = useWatch({ control, name: "role" })
  const fullName = `${firstName.trim()} ${lastName.trim()}`.trim()
  const initials = `${firstName.trim().charAt(0)}${lastName.trim().charAt(0)}`.toUpperCase()
  const contact = contactMethod === "phone" ? phone : email
  const maskedContact = contact ? contactMethod === "phone" ? maskPhone(contact) : maskEmail(contact) : ""
  const contactComplete = completedCount >= 3
  const securityComplete = completedCount >= 4
  const rows: Row[] = [
    { id: "name", icon: ContactRound, label: "Full Name", value: fullName, emptyText: "Not added yet" },
    { id: "contact", icon: contactMethod === "email" ? Mail : Smartphone, label: "Contact channel", value: maskedContact, emptyText: "Not added yet", badge: maskedContact ? { label: contactComplete ? "VERIFIED" : "PENDING OTP", className: contactComplete ? "bg-[#EAF2FC] text-[#2F6EA6]" : "bg-[#FEF3D8] text-[#8A5A00]" } : undefined },
    { id: "security", icon: ShieldCheck, label: "Security check", value: securityComplete ? "Verified Authentic" : "", emptyText: "Not completed" },
    { id: "location", icon: MapPin, label: "Primary Base", value: location.trim(), emptyText: "Not added yet" },
    { id: "role", icon: BriefcaseBusiness, label: "Strategic Role", value: "", emptyText: "Not added yet", badge: role ? { label: role === "investor" ? "Investor" : "Founder", className: role === "investor" ? "border border-[#C7D2FE] bg-[#EEF0FA] text-[#3F4FA0]" : "bg-[#FEF3D8] text-[#8A5A00]" } : undefined },
  ]
  const percent = Math.round((completedCount / STEPS.length) * 100)
  return <aside className="flex flex-col rounded-3xl border border-[#E5E7EB] bg-white p-6 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_rgba(16,24,40,0.04)] sm:p-8">
    <div className="flex items-center justify-between gap-4"><h2 className="text-xl font-semibold text-[#14213D]">Your profile so far</h2><span className="inline-flex items-center gap-2 rounded-full bg-[#F1F5F9] px-3 py-1 text-xs font-semibold text-[#64748B]"><span className="size-2 rounded-full bg-[#5BA4E6]" /> LIVE</span></div>
    <div className="mt-6 flex items-center gap-4 rounded-2xl border border-[#EAF0F6] bg-[#FAFAF8] p-4"><span className="grid size-14 shrink-0 place-items-center rounded-full border border-[#CBD5F4] bg-[#EEF0FA] text-base font-semibold text-[#3F4FA0]">{initials || <UserRound className="size-6" />}</span><div className="min-w-0"><p className="flex items-center gap-2 truncate text-base font-semibold">{fullName || "Your name"}{securityComplete && <BadgeCheck className="size-4 shrink-0 text-[#5BA4E6]" />}</p><p className="text-sm text-[#64748B]">{role ? role === "investor" ? "Investor" : "Founder" : "Candidate for Syndicate Access"}</p></div></div>
    <ul className="mt-5">{rows.map((row) => <li key={row.id} className="flex min-h-[46px] items-center justify-between gap-3 border-b border-[#E9EDF2] py-2.5 last:border-0"><span className="flex min-w-0 items-center gap-3 text-sm text-[#64748B]"><row.icon className="size-[18px] shrink-0 text-[#94A3B8]" /><span className="truncate">{row.label}</span></span><span className="flex min-w-0 items-center gap-2">{!(row.id === "role" && row.badge) && <span className={cn("max-w-[180px] truncate text-right text-sm font-semibold", row.value ? "text-[#14213D]" : "italic font-normal text-[#94A3B8]")}>{row.value || row.emptyText}</span>}{row.id === "security" && securityComplete ? <BadgeCheck className="size-4 shrink-0 text-[#5BA4E6]" /> : null}{row.badge && row.id !== "role" ? <span className={`shrink-0 rounded-md px-2 py-1 text-[9px] font-bold ${row.badge.className}`}>{row.badge.label}</span> : null}{row.badge && row.id === "role" ? <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold ${row.badge.className}`}>{row.badge.label}</span> : null}</span></li>)}</ul>
    <div className="mt-5 border-t border-[#E9EDF2] pt-5"><div className="flex items-center justify-between text-sm"><span className="font-semibold text-[#64748B]">Profile completion</span><span className="font-bold">{percent}%</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E5E7EB]" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><motion.div className="h-full rounded-full bg-[#F5B544]" initial={false} animate={{ width: `${percent}%` }} transition={{ duration: reduced ? 0 : 0.3 }} /></div></div>
    <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#EAF0F6] bg-[#FAFAF8] px-4 py-4"><LockKeyhole className="mt-0.5 size-4 shrink-0 text-[#64748B]" /><p className="text-[13px] leading-relaxed text-[#64748B]">Your details are only used to create your Bridgeway account.</p></div>
  </aside>
}
