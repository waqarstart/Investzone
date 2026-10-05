import { ChevronDown, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  NotificationItem,
  type NotificationAction,
} from "@/features/notifications/components/NotificationItem";
import { useNotifications } from "@/features/notifications/useNofitications";
import type { NotificationActionKey, NotificationData } from "@/features/notifications/types";
import { FilterPills } from "@/features/notifications/components/FilterPills";

const ACTION_PRESETS: Record<
  NotificationActionKey,
  { label: string; variant: NotificationAction["variant"] }
> = {
  accept: { label: "Accept", variant: "primary" },
  ignore: { label: "Ignore", variant: "secondary" },
  view: { label: "View", variant: "primary" },
  reply: { label: "Reply", variant: "outline" },
  message: { label: "Message", variant: "outline" },
  say_hello: { label: "Say hello", variant: "outline" },
  view_opportunity: { label: "View opportunity", variant: "outline" },
  congratulate: { label: "Congratulate", variant: "outline" },
  add_preferences: { label: "Add preferences", variant: "outline" },
};

const NotificationsPage = () => {
  const navigate = useNavigate();
  const {
    filter,
    setFilter,
    counts,
    groups,
    hasEarlier,
    loadEarlier,
    markRead,
    markAllRead,
    remove,
    accept,
  } = useNotifications();

  const handleAction = (item: NotificationData, key: NotificationActionKey) => {
    switch (key) {
      case "accept":
        accept(item.id);
        toast.success(`You are now connected with ${item.actorName ?? "this member"}`);
        break;
      case "ignore":
        remove(item.id);
        toast("Request ignored");
        break;
      case "view":
      case "view_opportunity":
      case "add_preferences":
        markRead(item.id);
        navigate("/opportunities");
        break;
      case "reply":
      case "message":
      case "say_hello":
        markRead(item.id);
        navigate("/communications");
        break;
      case "congratulate":
        markRead(item.id);
        toast.success("Congratulations sent (demo)");
        break;
    }
  };

  const buildActions = (item: NotificationData): NotificationAction[] =>
    item.actions.map((key) => ({
      id: key,
      ...ACTION_PRESETS[key],
      onClick: () => handleAction(item, key),
    }));

  return (
    <main className="mx-auto flex w-full max-w-[760px] flex-col gap-4 px-4 py-6 pb-28 sm:px-6 sm:py-10">
      <h1 className="sr-only">Notifications</h1>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="font-display text-[26px] font-bold text-[#14213D] sm:text-[32px]">
            Notifications
          </h2>
          {counts.unread > 0 && (
            <span className="whitespace-nowrap rounded-full bg-[#FDE3DD] px-2.5 py-0.5 text-xs font-semibold text-[#D9442F]">
              {counts.unread} new
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={markAllRead}
            disabled={counts.unread === 0}
            className="whitespace-nowrap text-[15px] font-medium text-[#3F4FA0] hover:underline disabled:cursor-not-allowed disabled:opacity-50 disabled:no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B544]"
          >
            Mark all as read
          </button>
          <button
            type="button"
            aria-label="Manage notifications"
            onClick={() => toast("Notification settings are coming soon (demo)")}
            className="rounded-full p-1.5 text-slate-500 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B544]"
          >
            <Settings className="size-5" />
          </button>
        </div>
      </div>

      <FilterPills value={filter} onChange={setFilter} counts={counts} />

      {groups.length === 0 ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white px-6 py-14 text-center">
          <p className="text-lg font-semibold text-[#14213D]">You&apos;re all caught up</p>
          <p className="mt-1 text-sm text-slate-500">
            New activity from your network and opportunities will appear here.
          </p>
        </div>
      ) : (
        <section
          aria-label="Notifications list"
          className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm"
        >
          {groups.map(({ group, items }) => (
            <div key={group}>
              <h3 className="border-b border-[#E5E7EB] bg-[#FAFAF8] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 [&:not(:first-child)]:border-t">
                {group}
              </h3>
              {items.map((item) => (
                <NotificationItem
                  key={item.id}
                  kind={item.kind}
                  avatarName={item.avatarName}
                  actorName={item.actorName}
                  lead={item.lead}
                  role={item.role}
                  verified={item.verified}
                  message={item.message}
                  highlight={item.highlight}
                  quote={item.quote}
                  statusText={item.statusText}
                  timeAgo={item.timeAgo}
                  category={item.category}
                  unread={item.unread}
                  avatarShape={item.shape}
                  avatarTone={item.tone}
                  actions={buildActions(item)}
                  linkLabel={item.linkLabel}
                  onLinkClick={() => {
                    markRead(item.id);
                    toast("This opens the related page in the full app (demo)");
                  }}
                  onDelete={() => {
                    remove(item.id);
                    toast("Notification deleted");
                  }}
                  onTurnOff={() => toast("You'll see fewer notifications like this (demo)")}
                  onReport={() => toast("Thanks, we'll review this (demo)")}
                />
              ))}
            </div>
          ))}
        </section>
      )}

      {hasEarlier && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={loadEarlier}
            className="inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-full border border-[#E5E7EB] bg-white px-6 text-[15px] font-medium text-[#14213D] shadow-sm hover:bg-[#F3F4F6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F5B544]"
          >
            Show earlier notifications
            <ChevronDown className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </main>
  );
};

export default NotificationsPage;