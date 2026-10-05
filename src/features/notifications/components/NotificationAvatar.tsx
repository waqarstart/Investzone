import {
  AtSign,
  CircleAlert,
  Eye,
  Handshake,
  MessageSquare,
  Network,
  PartyPopper,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  UserCheck,
  UserPlus,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AvatarTone, NotificationKind } from "../types";

const KIND_BADGE: Record<NotificationKind, { icon: LucideIcon; className: string }> = {
  connection_request: { icon: UserPlus, className: "bg-[#7C5CBF] text-white" },
  connection_accepted: { icon: UserCheck, className: "bg-[#5BA4E6] text-white" },
  opportunity_interest: { icon: TrendingUp, className: "bg-[#F5B544] text-[#14213D]" },
  message: { icon: MessageSquare, className: "bg-[#5BA4E6] text-white" },
  introduction: { icon: Handshake, className: "bg-[#F5B544] text-[#14213D]" },
  match: { icon: Sparkles, className: "bg-[#F5B544] text-[#14213D]" },
  milestone: { icon: PartyPopper, className: "bg-[#F2705A] text-white" },
  mention: { icon: AtSign, className: "bg-[#7C5CBF] text-white" },
  analytics: { icon: TrendingUp, className: "bg-[#5BA4E6] text-white" },
  account: { icon: CircleAlert, className: "bg-[#F5B544] text-[#14213D]" },
};

/** Notices without a person get an icon tile instead of initials. */
const ICON_TILE: Partial<Record<NotificationKind, { icon: LucideIcon; tone: AvatarTone }>> = {
  introduction: { icon: Network, tone: { background: "#14213D", color: "#F5B544" } },
  analytics: { icon: Eye, tone: { background: "#EEF0FA", color: "#3F4FA0" } },
  account: { icon: SlidersHorizontal, tone: { background: "#FEF3D8", color: "#B7791F" } },
};

const KIND_DEFAULTS: Partial<
  Record<NotificationKind, { shape: "circle" | "square"; tone: AvatarTone }>
> = {
  match: { shape: "square", tone: { background: "#F3F4F6", color: "#14213D" } },
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export interface NotificationAvatarProps {
  name: string;
  kind: NotificationKind;
  avatarUrl?: string;
  shape?: "circle" | "square";
  tone?: AvatarTone;
}

export function NotificationAvatar({ name, kind, avatarUrl, shape, tone }: NotificationAvatarProps) {
  const { icon: BadgeIcon, className: badgeClass } = KIND_BADGE[kind];
  const tile = ICON_TILE[kind];
  const defaults = KIND_DEFAULTS[kind];

  const resolvedShape = tile ? "square" : (shape ?? defaults?.shape ?? "circle");
  const resolvedTone = tile?.tone ??
    tone ??
    defaults?.tone ?? { background: "#EEF0FA", color: "#3F4FA0" };

  return (
    <div className="relative shrink-0">
      <div
        className={cn(
          "flex size-12 items-center justify-center overflow-hidden text-lg font-semibold sm:size-[54px]",
          resolvedShape === "square" ? "rounded-xl" : "rounded-full",
        )}
        style={
          avatarUrl
            ? undefined
            : { backgroundColor: resolvedTone.background, color: resolvedTone.color }
        }
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt={name} className="size-full object-cover" />
        ) : tile ? (
          <tile.icon className="size-6" aria-hidden="true" />
        ) : (
          <span aria-hidden="true">{getInitials(name)}</span>
        )}
      </div>
      <span
        className={cn(
          "absolute -bottom-1 -right-1 flex size-[22px] items-center justify-center rounded-full ring-2 ring-white",
          badgeClass,
        )}
      >
        <BadgeIcon className="size-3" aria-hidden="true" />
      </span>
    </div>
  );
}