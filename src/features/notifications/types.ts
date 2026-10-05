export type NotificationKind =
  | "connection_request"
  | "connection_accepted"
  | "opportunity_interest"
  | "message"
  | "introduction"
  | "match"
  | "milestone"
  | "mention"
  | "analytics"
  | "account";

export type NotificationCategory =
  | "Connections"
  | "Opportunities"
  | "Messages"
  | "Brokered Introductions"
  | "Milestones"
  | "Mentions"
  | "Analytics"
  | "Account";

export type NotificationGroup = "Today" | "This week" | "Earlier";

export type NotificationFilter =
  | "all"
  | "unread"
  | "connections"
  | "opportunities"
  | "messages"
  | "mentions";

export type MemberRole = "Founder" | "Investor" | "Broker";

export type NotificationActionKey =
  | "accept"
  | "ignore"
  | "view"
  | "reply"
  | "message"
  | "say_hello"
  | "view_opportunity"
  | "congratulate"
  | "add_preferences";

export interface AvatarTone {
  background: string;
  color: string;
}

export interface NotificationData {
  id: string;
  group: NotificationGroup;
  kind: NotificationKind;
  category: NotificationCategory;
  timeAgo: string;
  unread: boolean;
  /** Used for the initials of the avatar. */
  avatarName: string;
  /** Bold name shown before the sentence (people and organizations). */
  actorName?: string;
  /** Bold lead text for system notices without an actor, e.g. "New match: Karakoram Angels". */
  lead?: string;
  role?: MemberRole;
  verified?: boolean;
  message: string;
  /** Part of the message that is shown in bold. */
  highlight?: string;
  quote?: string;
  statusText?: string;
  actions: NotificationActionKey[];
  linkLabel?: string;
  tone?: AvatarTone;
  shape?: "circle" | "square";
  /** Hidden until the user presses "Show earlier notifications". */
  deferred?: boolean;
}