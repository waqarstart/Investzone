import { ArrowRight, BadgeCheck, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { AvatarTone, MemberRole, NotificationCategory, NotificationKind } from "../types";
import { NotificationAvatar } from "./NotificationAvatar";

export interface NotificationAction {
  id: string;
  label: string;
  variant: "primary" | "outline" | "secondary";
  onClick: () => void;
}

export interface NotificationItemProps {
  kind: NotificationKind;
  avatarName: string;
  actorName?: string;
  lead?: string;
  message: string;
  highlight?: string;
  timeAgo: string;
  category: NotificationCategory;
  unread?: boolean;
  role?: MemberRole;
  verified?: boolean;
  avatarUrl?: string;
  avatarShape?: "circle" | "square";
  avatarTone?: AvatarTone;
  quote?: string;
  statusText?: string;
  actions?: NotificationAction[];
  linkLabel?: string;
  onLinkClick?: () => void;
  onDelete?: () => void;
  onTurnOff?: () => void;
  onReport?: () => void;
}

const ROLE_STYLES: Record<MemberRole, string> = {
  Founder: "bg-[#FEF3D8] text-[#8A5A00]",
  Investor: "bg-[#EEF0FA] text-[#3F4FA0]",
  Broker: "bg-[#14213D] text-[#F5B544] uppercase tracking-wide text-[10px]",
};

const ACTION_STYLES: Record<NotificationAction["variant"], string> = {
  primary: "border-transparent bg-[#F5B544] text-[#14213D] hover:bg-[#E9A72F]",
  outline: "border-[#3F4FA0] bg-white text-[#3F4FA0] hover:bg-[#EEF0FA]",
  secondary: "border-[#E5E7EB] bg-white text-[#14213D] hover:bg-[#F3F4F6]",
};

function renderMessage(message: string, highlight?: string) {
  if (!highlight) return message;
  const index = message.indexOf(highlight);
  if (index === -1) return message;
  return (
    <>
      {message.slice(0, index)}
      <strong className="font-semibold text-[#14213D]">{highlight}</strong>
      {message.slice(index + highlight.length)}
    </>
  );
}

export function NotificationItem({
  kind,
  avatarName,
  actorName,
  lead,
  message,
  highlight,
  timeAgo,
  category,
  unread = false,
  role,
  verified = false,
  avatarUrl,
  avatarShape,
  avatarTone,
  quote,
  statusText,
  actions,
  linkLabel,
  onLinkClick,
  onDelete,
  onTurnOff,
  onReport,
}: NotificationItemProps) {
  return (
    <article
      className={cn(
        "flex w-full items-start gap-3.5 border-b border-[#E5E7EB] px-4 py-4 last:border-b-0 sm:gap-4 sm:px-5",
        unread ? "bg-[#EEF0FA]" : "bg-white",
      )}
    >
      <NotificationAvatar
        name={avatarName}
        kind={kind}
        avatarUrl={avatarUrl}
        shape={avatarShape}
        tone={avatarTone}
      />

      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[15px] leading-6 text-slate-600">
          {actorName && <span className="font-semibold text-[#14213D]">{actorName}</span>}
          {role && (
            <span
              className={cn(
                "whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold",
                ROLE_STYLES[role],
              )}
            >
              {role}
            </span>
          )}
          {verified && <BadgeCheck className="size-4 text-[#5BA4E6]" aria-label="Verified" />}
          <span>
            {lead && <strong className="font-semibold text-[#14213D]">{lead} </strong>}
            {renderMessage(message, highlight)}
          </span>
        </p>

        {quote && (
          <blockquote className="mt-2 inline-block max-w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-1.5 text-sm italic text-slate-600">
            <span className="line-clamp-2">“{quote}”</span>
          </blockquote>
        )}

        {statusText && (
          <p className="mt-1 flex items-center gap-1.5 text-sm text-[#5BA4E6]">
            <BadgeCheck className="size-4" aria-hidden="true" />
            {statusText}
          </p>
        )}

        <p className="mt-1 text-sm text-slate-500">
          {timeAgo} · <span className="text-[#3F4FA0]">{category}</span>
        </p>

        {actions && actions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {actions.map((action) => (
              <Button
                key={action.id}
                type="button"
                variant="outline"
                size="sm"
                onClick={action.onClick}
                className={cn(
                  "h-9 shrink-0 whitespace-nowrap rounded-full px-5 font-semibold",
                  ACTION_STYLES[action.variant],
                )}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}

        {linkLabel && (
          <button
            type="button"
            onClick={onLinkClick}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[#3F4FA0] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B544]"
          >
            {linkLabel}
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3 pt-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="More options"
              className="rounded-full p-1.5 text-slate-500 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B544]"
            >
              <MoreHorizontal className="size-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={onDelete}>Delete this notification</DropdownMenuItem>
            <DropdownMenuItem onSelect={onTurnOff}>
              Turn off notifications like this
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={onReport} className="text-[#D9442F]">
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {unread && (
          <span className="size-2.5 rounded-full bg-[#3F4FA0]" role="img" aria-label="Unread" />
        )}
      </div>
    </article>
  );
}