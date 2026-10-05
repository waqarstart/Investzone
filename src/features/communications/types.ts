export type Role = "Founder" | "Investor";
export type MessageStatus = "sent" | "delivered" | "read";
export type MessageType = "text" | "file" | "voice" | "system";
export type ChatFilter = "all" | "unread" | "investors" | "founders";
export type MediaKind = "doc" | "table" | "video";

export interface Tone {
  bg: string;
  fg: string;
}

export interface MediaItem {
  id: string;
  name: string;
  kind: MediaKind;
}

export interface Opportunity {
  id: string;
  title: string;
  raised: number;
  target: number;
}

export interface Person {
  id: string;
  name: string;
  initials: string;
  role: Role;
  headline: string;
  shortTitle: string;
  location: string;
  tone: Tone;
}

export interface Conversation extends Person {
  online: boolean;
  lastSeen?: string;
  pinned?: boolean;
  pinSorted?: boolean;
  muted?: boolean;
  blocked?: boolean;
  idleTyping?: boolean;
  unread: number;
  opportunity?: Opportunity;
  mutuals: { count: number; names: string[] };
  media: MediaItem[];
}

export interface ReplyRef {
  senderId: string;
  senderName: string;
  text: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  type: MessageType;
  text?: string;
  file?: { name: string; size: string; pages?: number; note?: string };
  voice?: { seconds: number };
  replyTo?: ReplyRef;
  createdAt: string;
  status: MessageStatus;
}

export type MessageDraft = Pick<Message, "type" | "text" | "file" | "voice" | "replyTo">;
