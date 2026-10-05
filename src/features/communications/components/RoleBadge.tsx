import { cn } from "@/lib/utils";
import type { Role } from "../types";

const TONES: Record<Role, string> = {
  Founder: "bg-[#FEF3D8] text-[#8A5A00]",
  Investor: "bg-[#EEF0FA] text-[#3F4FA0]",
};

export function RoleBadge({ role, className }: { role: Role; className?: string }) {
  return <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-[11.5px] font-medium", TONES[role], className)}>{role}</span>;
}
