import type { Conversation, MediaItem, Message, MessageStatus, MessageType, Person, Tone } from "./types";

export const MOCK_NOW = new Date(2026, 9, 24, 10, 43, 0);

const T = (bg: string, fg: string): Tone => ({ bg, fg });
const INDIGO = T("#3F4FA0", "#FFFFFF");
const NAVY_AMBER = T("#14213D", "#F5B544");
const NAVY = T("#14213D", "#FFFFFF");

const MEDIA: MediaItem[] = [
  { id: "md1", name: "Deck_v3", kind: "doc" },
  { id: "md2", name: "CapTable", kind: "table" },
  { id: "md3", name: "Demo.mp4", kind: "video" },
  { id: "md4", name: "Term_Sheet_v1", kind: "doc" },
  { id: "md5", name: "Financial_Model", kind: "table" },
  { id: "md6", name: "Product_Walkthrough.mp4", kind: "video" },
  { id: "md7", name: "Data_Room_Index", kind: "doc" },
  { id: "md8", name: "Unit_Economics", kind: "table" },
  { id: "md9", name: "Founder_Intro.mp4", kind: "video" },
  { id: "md10", name: "NDA_Signed", kind: "doc" },
  { id: "md11", name: "Cohort_Retention", kind: "table" },
  { id: "md12", name: "Market_Sizing", kind: "doc" },
];

export const CONVERSATIONS: Conversation[] = [
  { id: "zainab-bilal", name: "Zainab Bilal", initials: "ZB", role: "Founder", tone: INDIGO, online: true, unread: 0, idleTyping: true, headline: "CTO & Co-Founder @ HealthBridge AI", shortTitle: "CTO @ HealthBridge AI", location: "Lahore, Pakistan", opportunity: { id: "agriflow", title: "AgriFlow Seed Round", raised: 48, target: 120 }, mutuals: { count: 88, names: ["Hassan S.", "Taimur C.", "Rabia M."] }, media: MEDIA },
  { id: "apex-capital", name: "Apex Capital Syndicate", initials: "AC", role: "Investor", tone: NAVY_AMBER, online: false, lastSeen: "Last seen yesterday at 6:20 PM", unread: 2, headline: "Syndicate lead · Early-stage fintech and agritech", shortTitle: "Syndicate Desk", location: "Lahore, Pakistan", opportunity: { id: "solargrid", title: "SolarGrid Energy · Seed Bridge", raised: 60, target: 90 }, mutuals: { count: 11, names: ["Farhan T.", "Nida K.", "Mirza B."] }, media: MEDIA },
  { id: "amina-qureshi", name: "Amina Qureshi", initials: "AQ", role: "Founder", tone: T("#334155", "#FFFFFF"), online: true, unread: 0, headline: "CEO & Founder @ PulseHealth", shortTitle: "CEO @ PulseHealth", location: "Karachi, Pakistan", opportunity: { id: "pulsehealth", title: "PulseHealth · Series A Extension", raised: 82, target: 100 }, mutuals: { count: 9, names: ["Zainab B.", "Taimur C.", "Nida K."] }, media: MEDIA },
  { id: "taimur-chaudhry", name: "Taimur Chaudhry", initials: "TC", role: "Investor", tone: NAVY, online: false, lastSeen: "Last seen Tuesday at 4:05 PM", unread: 0, headline: "Partner @ Chaudhry Growth Partners", shortTitle: "Partner @ Chaudhry Growth", location: "Islamabad, Pakistan", mutuals: { count: 12, names: ["Hassan S.", "Zainab B.", "Amina Q."] }, media: MEDIA },
  { id: "rabia-mansoor", name: "Dr. Rabia Mansoor", initials: "RM", role: "Founder", tone: T("#1F2937", "#F5B544"), online: false, lastSeen: "Last seen Monday at 7:48 PM", unread: 0, headline: "CEO @ ClinicLoop Diagnostics", shortTitle: "CEO @ ClinicLoop", location: "Lahore, Pakistan", mutuals: { count: 8, names: ["Farhan T.", "Amina Q.", "Nida K."] }, media: MEDIA },
  { id: "farhan-tareen", name: "Farhan Tareen", initials: "FT", role: "Investor", tone: INDIGO, online: false, lastSeen: "Last seen Oct 12", unread: 0, headline: "Managing Director @ Tareen Capital", shortTitle: "MD @ Tareen Capital", location: "Karachi, Pakistan", mutuals: { count: 10, names: ["Mirza B.", "Taimur C.", "Zainab B."] }, media: MEDIA },
  { id: "nida-karim", name: "Nida Karim", initials: "NK", role: "Founder", tone: T("#475569", "#FFFFFF"), online: false, lastSeen: "Last seen Oct 08", unread: 0, headline: "Founder @ KhataLedger", shortTitle: "Founder @ KhataLedger", location: "Islamabad, Pakistan", mutuals: { count: 9, names: ["Hassan S.", "Rabia M.", "Amina Q."] }, media: MEDIA },
  { id: "mirza-baig", name: "Mirza Baig", initials: "MB", role: "Investor", tone: NAVY, online: false, lastSeen: "Last seen Sep 29", unread: 0, pinned: true, headline: "Principal @ Baig Family Office", shortTitle: "Principal @ Baig Family Office", location: "Dubai, UAE", mutuals: { count: 10, names: ["Farhan T.", "Taimur C.", "Hassan S."] }, media: MEDIA },
];

export const NEW_PEOPLE: Person[] = [
  { id: "hassan-siddiqui", name: "Hassan Siddiqui", initials: "HS", role: "Investor", tone: INDIGO, headline: "Partner @ Siddiqui Ventures", shortTitle: "Partner @ Siddiqui Ventures", location: "Karachi, Pakistan" },
  { id: "sana-rauf", name: "Sana Rauf", initials: "SR", role: "Founder", tone: NAVY, headline: "Co-Founder @ GridKraft", shortTitle: "Co-Founder @ GridKraft", location: "Faisalabad, Pakistan" },
  { id: "omar-javed", name: "Omar Javed", initials: "OJ", role: "Investor", tone: T("#334155", "#FFFFFF"), headline: "Angel · Ex-operator in logistics", shortTitle: "Angel Investor", location: "Lahore, Pakistan" },
  { id: "laiba-shah", name: "Laiba Shah", initials: "LS", role: "Founder", tone: INDIGO, headline: "CEO @ FreshRoute", shortTitle: "CEO @ FreshRoute", location: "Rawalpindi, Pakistan" },
  { id: "bilal-ahmed", name: "Bilal Ahmed", initials: "BA", role: "Founder", tone: NAVY_AMBER, headline: "CEO @ SolarGrid Energy", shortTitle: "CEO @ SolarGrid", location: "Faisalabad, Pakistan" },
  { id: "meher-nadeem", name: "Meher Nadeem", initials: "MN", role: "Investor", tone: NAVY, headline: "Investment Lead @ Meridian Impact", shortTitle: "Investment Lead", location: "Dubai, UAE" },
  { id: "usman-tariq", name: "Usman Tariq", initials: "UT", role: "Founder", tone: T("#475569", "#FFFFFF"), headline: "CEO @ LogiFleet AI", shortTitle: "CEO @ LogiFleet AI", location: "Islamabad, Pakistan" },
];

export const CONNECTIONS: Person[] = [
  ...CONVERSATIONS.filter((c) => ["zainab-bilal", "taimur-chaudhry", "farhan-tareen"].includes(c.id)),
  ...NEW_PEOPLE,
];

export function personToConversation(p: Person): Conversation {
  return {
    ...p,
    online: false,
    lastSeen: "Last seen recently",
    unread: 0,
    mutuals: { count: 9, names: ["Hassan S.", "Taimur C.", "Zainab B."] },
    media: MEDIA,
  };
}

let seq = 0;
function m(
  conversationId: string,
  senderId: string,
  type: MessageType,
  createdAt: string,
  extra: Partial<Message> = {},
  status: MessageStatus = "read",
): Message {
  seq += 1;
  return { id: `${conversationId}-${seq}`, conversationId, senderId, type, createdAt, status, ...extra };
}

const me = "me";

export const MESSAGES: Record<string, Message[]> = {
  "zainab-bilal": [
    m("zainab-bilal", me, "system", "2026-10-24T10:30:00", { text: "Introduction brokered by Bridgeway · Mutual interest confirmed" }),
    m("zainab-bilal", "zainab-bilal", "text", "2026-10-24T10:35:00", {
      replyTo: { senderId: me, senderName: "You", text: "Can you share the latest cohort retention curves ahead of syndicate partner review?" },
      text: "Hello! We reviewed your revised investor mandate. Our current ARR metrics are tracking 180% YoY, and we have opened our diligence data room for your syndicate review.",
    }),
    m("zainab-bilal", "zainab-bilal", "file", "2026-10-24T10:36:00", { file: { name: "AgriFlow_Investor_Deck_Q3.pdf", size: "2.4 MB", pages: 14, note: "Watermarked" } }),
    m("zainab-bilal", me, "text", "2026-10-24T10:39:00", { text: "Thanks Zainab. The syndicate has reviewed the IoT telemetry unit economics. We'd like to schedule a 30-min call tomorrow to finalize allocation." }),
    m("zainab-bilal", "zainab-bilal", "voice", "2026-10-24T10:41:00", { voice: { seconds: 42 } }),
    m("zainab-bilal", me, "text", "2026-10-24T10:42:00", { text: "Looking forward to reviewing the updated term sheet." }),
  ],
  "apex-capital": [
    m("apex-capital", me, "text", "2026-10-23T16:10:00", { text: "Sharing our updated mandate summary today." }),
    m("apex-capital", "apex-capital", "text", "2026-10-23T17:50:00", { text: "Thank you, received. Reviewing the fit with our SolarGrid allocation." }),
    m("apex-capital", "apex-capital", "text", "2026-10-23T18:12:00", { text: "We've circulated it to the partners." }, "delivered"),
    m("apex-capital", "apex-capital", "text", "2026-10-23T18:14:00", { text: "Expect feedback before the weekend." }, "delivered"),
  ],
  "amina-qureshi": [
    m("amina-qureshi", "amina-qureshi", "text", "2026-10-23T11:20:00", { text: "Great speaking earlier. Happy to walk the syndicate through the numbers." }),
    m("amina-qureshi", me, "text", "2026-10-23T11:32:00", { text: "Please send the latest deck when ready." }),
    m("amina-qureshi", "amina-qureshi", "file", "2026-10-23T14:05:00", { file: { name: "Pitch deck_v3.pdf", size: "3.1 MB", pages: 18, note: "Watermarked" } }),
  ],
  "taimur-chaudhry": [
    m("taimur-chaudhry", me, "text", "2026-10-20T15:10:00", { text: "Are you open to a Thursday call on the allocation?" }),
    m("taimur-chaudhry", "taimur-chaudhry", "voice", "2026-10-20T16:02:00", { voice: { seconds: 42 } }),
  ],
  "rabia-mansoor": [
    m("rabia-mansoor", me, "text", "2026-10-19T18:40:00", { text: "Could you open the data room for our analysts?" }),
    m("rabia-mansoor", "rabia-mansoor", "text", "2026-10-19T19:45:00", { text: "Data room access permissions have been granted." }),
  ],
  "farhan-tareen": [
    m("farhan-tareen", "farhan-tareen", "text", "2026-10-12T09:15:00", { text: "Please confirm a time that suits your partners." }),
    m("farhan-tareen", me, "text", "2026-10-12T09:50:00", { text: "We are scheduling partner sync for Friday." }),
  ],
  "nida-karim": [
    m("nida-karim", me, "text", "2026-10-08T12:00:00", { text: "Ready to review the syndicate terms whenever you are." }),
    m("nida-karim", "nida-karim", "text", "2026-10-08T14:30:00", { text: "Syndicate lead agreement attached." }),
  ],
  "mirza-baig": [
    m("mirza-baig", me, "text", "2026-09-29T10:00:00", { text: "Thanks for the update on the next tranche." }),
    m("mirza-baig", "mirza-baig", "text", "2026-09-29T11:20:00", { text: "Let's align on valuation cap before next tranche." }),
  ],
};

export const CANNED_REPLIES = [
  "Thanks, I'll get back to you shortly.",
  "Sounds good. Can you share the data room link?",
  "Let's lock Friday at 3 PM.",
  "Understood. I'll loop in the rest of the team.",
  "Great, that works for us.",
];
