import { useCallback, useMemo, useState } from "react";
import { INITIAL_NOTIFICATIONS } from "./data.ts";
import type {
  NotificationCategory,
  NotificationData,
  NotificationFilter,
  NotificationGroup,
} from "./types";

const GROUP_ORDER: NotificationGroup[] = ["Today", "This week", "Earlier"];

const FILTER_CATEGORY: Record<
  Exclude<NotificationFilter, "all" | "unread">,
  NotificationCategory
> = {
  connections: "Connections",
  opportunities: "Opportunities",
  messages: "Messages",
  mentions: "Mentions",
};

function matchesFilter(item: NotificationData, filter: NotificationFilter): boolean {
  if (filter === "all") return true;
  if (filter === "unread") return item.unread;
  return item.category === FILTER_CATEGORY[filter];
}

export function useNotifications() {
  const [items, setItems] = useState<NotificationData[]>(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [earlierLoaded, setEarlierLoaded] = useState(false);

  const available = useMemo(
    () => items.filter((item) => earlierLoaded || !item.deferred),
    [items, earlierLoaded],
  );

  const counts = useMemo<Record<NotificationFilter, number>>(() => {
    const unread = available.filter((item) => item.unread);
    return {
      all: available.length,
      unread: unread.length,
      connections: unread.filter((item) => item.category === "Connections").length,
      opportunities: unread.filter((item) => item.category === "Opportunities").length,
      messages: unread.filter((item) => item.category === "Messages").length,
      mentions: unread.filter((item) => item.category === "Mentions").length,
    };
  }, [available]);

  const groups = useMemo(() => {
    const visible = available.filter((item) => matchesFilter(item, filter));
    return GROUP_ORDER.map((group) => ({
      group,
      items: visible.filter((item) => item.group === group),
    })).filter((entry) => entry.items.length > 0);
  }, [available, filter]);

  const hasEarlier = !earlierLoaded && items.some((item) => item.deferred);

  const update = useCallback((id: string, patch: Partial<NotificationData>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }, []);

  const markRead = useCallback((id: string) => update(id, { unread: false }), [update]);

  const markAllRead = useCallback(() => {
    setItems((prev) => prev.map((item) => ({ ...item, unread: false })));
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const accept = useCallback(
    (id: string) =>
      update(id, { unread: false, actions: ["message"], statusText: "You are now connected" }),
    [update],
  );

  const loadEarlier = useCallback(() => setEarlierLoaded(true), []);

  return {
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
  };
}