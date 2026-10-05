import { addMinutes, differenceInCalendarDays, differenceInMinutes, format, parseISO } from "date-fns";
import { MOCK_NOW } from "../data";
import type { Message } from "../types";

export const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F4FA0]";
export const AMBER_BUTTON = "bg-[#F5B544] text-[#14213D] hover:bg-[#E9A72E] active:scale-[0.98]";
export const ICON_BUTTON = "size-11 rounded-full text-[#475569] hover:bg-[#EEF0FA] sm:size-10";
export const BRIDGE_PATTERN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='40' viewBox='0 0 80 40'%3E%3Cpath d='M0 40 Q20 8 40 40 T80 40' fill='none' stroke='%2314213D' stroke-opacity='0.04' stroke-width='1.5'/%3E%3C/svg%3E\")";

export function formatListTime(iso: string) {
  const d = parseISO(iso);
  const diff = differenceInCalendarDays(MOCK_NOW, d);
  if (diff <= 0) return format(d, "h:mm a");
  if (diff === 1) return "Yesterday";
  if (diff < 7) return format(d, "EEEE");
  return format(d, "MMM dd");
}

export const formatBubbleTime = (iso: string) => format(parseISO(iso), "h:mm a");

export function formatSeparator(iso: string) {
  const d = parseISO(iso);
  return differenceInCalendarDays(MOCK_NOW, d) === 0 ? format(d, "'Today,' MMMM d") : format(d, "EEEE, MMMM d");
}

export function formatDuration(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export function describeMessage(m: Message) {
  if (m.type === "file") return m.file?.name ?? "File";
  if (m.type === "voice") return `Voice message (${formatDuration(m.voice?.seconds ?? 0)})`;
  return m.text ?? "";
}

export function nextTimestamp(list: Message[]) {
  const last = list[list.length - 1];
  const base = last ? parseISO(last.createdAt) : MOCK_NOW;
  return format(addMinutes(base, 1), "yyyy-MM-dd'T'HH:mm:ss");
}

export const firstName = (name: string) => name.replace(/^Dr\.\s+/, "").split(" ")[0] ?? name;
export const initialsOf = (label: string) => label.split(/[\s.]+/).filter(Boolean).map((w) => w[0]).join("").slice(0, 2).toUpperCase();

export type RenderItem =
  | { kind: "separator"; key: string; label: string }
  | { kind: "message"; key: string; message: Message; first: boolean; last: boolean };

function sameGroup(a: Message | undefined, b: Message | undefined) {
  if (!a || !b || a.type === "system" || b.type === "system") return false;
  return a.senderId === b.senderId && a.type === b.type && Math.abs(differenceInMinutes(parseISO(a.createdAt), parseISO(b.createdAt))) <= 5;
}

export function buildItems(messages: Message[]): RenderItem[] {
  const items: RenderItem[] = [];
  let lastDay = "";
  messages.forEach((message, i) => {
    if (message.type !== "system") {
      const day = message.createdAt.slice(0, 10);
      if (day !== lastDay) {
        items.push({ kind: "separator", key: `sep-${day}`, label: formatSeparator(message.createdAt) });
        lastDay = day;
      }
    }
    items.push({
      kind: "message",
      key: message.id,
      message,
      first: !sameGroup(messages[i - 1], message),
      last: !sameGroup(message, messages[i + 1]),
    });
  });
  return items;
}

export function splitHighlight(text: string, query: string): { text: string; match: boolean }[] {
  const q = query.trim();
  if (!q) return [{ text, match: false }];
  const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return text.split(new RegExp(`(${escaped})`, "gi")).filter(Boolean).map((part) => ({ text: part, match: part.toLowerCase() === q.toLowerCase() }));
}

export function waveform(seed: string, bars = 28) {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return Array.from({ length: bars }, (_, i) => {
    h = (h * 1664525 + 1013904223 + i) >>> 0;
    return 0.25 + (h % 75) / 100;
  });
}
