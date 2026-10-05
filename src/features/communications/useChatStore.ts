import { useMemo } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { CANNED_REPLIES, CONVERSATIONS, MESSAGES, personToConversation } from "./data";
import { describeMessage, nextTimestamp } from "./lib/format";
import type { ChatFilter, Conversation, Message, MessageDraft, MessageStatus, Person } from "./types";

const EMPTY: Message[] = [];
const RANK: Record<MessageStatus, number> = { sent: 0, delivered: 1, read: 2 };
const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

interface ChatState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  drafts: Record<string, string>;
  filter: ChatFilter;
  query: string;
  typing: Record<string, boolean>;
  activeId: string | null;
  panelOpen: boolean;
  playingVoiceId: string | null;
  setActive: (id: string | null) => void;
  setFilter: (f: ChatFilter) => void;
  setQuery: (q: string) => void;
  setDraft: (id: string, text: string) => void;
  setPanelOpen: (open: boolean) => void;
  setPlaying: (id: string | null) => void;
  openConversation: (id: string) => void;
  markAllRead: () => void;
  markUnread: (id: string) => void;
  togglePin: (id: string) => void;
  toggleMute: (id: string) => void;
  setBlocked: (id: string, blocked: boolean) => void;
  deleteChat: (id: string) => void;
  clearChat: (id: string) => void;
  deleteMessage: (convId: string, msgId: string) => void;
  send: (convId: string, draft: MessageDraft) => void;
  startChat: (person: Person) => string;
}

function patch(conversations: Conversation[], id: string, change: Partial<Conversation>) {
  return conversations.map((c) => (c.id === id ? { ...c, ...change } : c));
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => {
      const setStatus = (convId: string, msgId: string, status: MessageStatus) =>
        set((s) => ({
          messages: {
            ...s.messages,
            [convId]: (s.messages[convId] ?? EMPTY).map((m) => (m.id === msgId && RANK[status] > RANK[m.status] ? { ...m, status } : m)),
          },
        }));

      const receiveReply = (convId: string) => {
        const state = get();
        const conv = state.conversations.find((c) => c.id === convId);
        if (!conv || conv.blocked) return;
        const list = state.messages[convId] ?? EMPTY;
        const sent = list.filter((m) => m.senderId === "me").length;
        const reply: Message = {
          id: uid(),
          conversationId: convId,
          senderId: convId,
          type: "text",
          text: CANNED_REPLIES[sent % CANNED_REPLIES.length],
          createdAt: nextTimestamp(list),
          status: "read",
        };
        const viewing = state.activeId === convId;
        set((s) => ({
          messages: { ...s.messages, [convId]: [...(s.messages[convId] ?? EMPTY), reply] },
          conversations: viewing ? s.conversations : patch(s.conversations, convId, { unread: (conv.unread ?? 0) + 1 }),
        }));
      };

      return {
        conversations: CONVERSATIONS,
        messages: MESSAGES,
        drafts: {},
        filter: "all",
        query: "",
        typing: { "apex-capital": true },
        activeId: null,
        panelOpen: true,
        playingVoiceId: null,
        setActive: (activeId) => set({ activeId }),
        setFilter: (filter) => set({ filter }),
        setQuery: (query) => set({ query }),
        setDraft: (id, text) => set((s) => ({ drafts: { ...s.drafts, [id]: text } })),
        setPanelOpen: (panelOpen) => set({ panelOpen }),
        setPlaying: (playingVoiceId) => set({ playingVoiceId }),
        openConversation: (id) => set((s) => ({ conversations: patch(s.conversations, id, { unread: 0 }) })),
        markAllRead: () => set((s) => ({ conversations: s.conversations.map((c) => ({ ...c, unread: 0 })) })),
        markUnread: (id) => set((s) => ({ conversations: patch(s.conversations, id, { unread: 1 }) })),
        togglePin: (id) =>
          set((s) => ({
            conversations: s.conversations.map((c) => (c.id === id ? { ...c, pinned: !c.pinned, pinSorted: !c.pinned } : c)),
          })),
        toggleMute: (id) => set((s) => ({ conversations: s.conversations.map((c) => (c.id === id ? { ...c, muted: !c.muted } : c)) })),
        setBlocked: (id, blocked) => set((s) => ({ conversations: patch(s.conversations, id, { blocked }) })),
        deleteChat: (id) =>
          set((s) => {
            const rest = Object.fromEntries(Object.entries(s.messages).filter(([key]) => key !== id));
            return { conversations: s.conversations.filter((c) => c.id !== id), messages: rest };
          }),
        clearChat: (id) => set((s) => ({ messages: { ...s.messages, [id]: [] } })),
        deleteMessage: (convId, msgId) =>
          set((s) => ({ messages: { ...s.messages, [convId]: (s.messages[convId] ?? EMPTY).filter((m) => m.id !== msgId) } })),
        startChat: (person) => {
          if (get().conversations.some((c) => c.id === person.id)) return person.id;
          const intro: Message = {
            id: uid(),
            conversationId: person.id,
            senderId: "me",
            type: "system",
            text: "Introduction brokered by Bridgeway",
            createdAt: nextTimestamp([]),
            status: "read",
          };
          set((s) => ({
            conversations: [personToConversation(person), ...s.conversations],
            messages: { ...s.messages, [person.id]: [intro] },
          }));
          return person.id;
        },
        send: (convId, draft) => {
          const list = get().messages[convId] ?? EMPTY;
          const msg: Message = { id: uid(), conversationId: convId, senderId: "me", createdAt: nextTimestamp(list), status: "sent", ...draft };
          set((s) => {
            const current = s.conversations.find((c) => c.id === convId);
            return {
              messages: { ...s.messages, [convId]: [...list, msg] },
              conversations: current ? [current, ...s.conversations.filter((c) => c.id !== convId)] : s.conversations,
            };
          });
          setTimeout(() => setStatus(convId, msg.id, "delivered"), 700);
          setTimeout(() => setStatus(convId, msg.id, "read"), 2000);
          setTimeout(() => {
            set((s) => ({ typing: { ...s.typing, [convId]: true } }));
            setTimeout(() => {
              set((s) => ({ typing: { ...s.typing, [convId]: false } }));
              receiveReply(convId);
            }, 1500);
          }, 1500);
        },
      };
    },
    {
      name: "bridgeway-chat",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ conversations: s.conversations, messages: s.messages, drafts: s.drafts, panelOpen: s.panelOpen }),
    },
  ),
);

export function useMessages(id: string) {
  return useChatStore((s) => s.messages[id] ?? EMPTY);
}

export function useVisibleConversations() {
  const conversations = useChatStore((s) => s.conversations);
  const messages = useChatStore((s) => s.messages);
  const filter = useChatStore((s) => s.filter);
  const query = useChatStore((s) => s.query);
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    return conversations
      .filter((c) => {
        if (filter === "unread" && c.unread === 0) return false;
        if (filter === "investors" && c.role !== "Investor") return false;
        if (filter === "founders" && c.role !== "Founder") return false;
        if (!q) return true;
        const last = [...(messages[c.id] ?? EMPTY)].reverse().find((m) => m.type !== "system");
        return c.name.toLowerCase().includes(q) || (last ? describeMessage(last).toLowerCase().includes(q) : false);
      })
      .sort((a, b) => Number(!!b.pinSorted) - Number(!!a.pinSorted));
  }, [conversations, messages, filter, query]);
}

export function useUnreadTotal() {
  return useChatStore((s) => s.conversations.reduce((sum, c) => sum + c.unread, 0));
}
