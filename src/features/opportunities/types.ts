export type Sector = "FinTech" | "AgriTech" | "HealthTech" | "DeepTech & AI" | "Logistics" | "CleanTech";
export type Stage = "Pre-seed" | "Seed" | "Series A" | "Growth";
export type Region = "Pakistan" | "GCC" | "Both";
export type ColumnKey = "investors" | "founders";
export type FilterKey = "sector" | "size" | "stage";
export type ColumnFilters = Record<FilterKey, string[]>;
export type PanelKey = "preferences" | "post" | "tracker" | "posts";
export type Range = readonly [number, number];

export interface Preferences {
  sectors: Sector[];
  ticket: string | null;
  stages: Stage[];
  location: string | null;
}
export type PrefKey = keyof Preferences;

export interface Listing {
  id: string;
  title: string;
  subtitle: string;
  initials: string;
  bg: string;
  fg: string;
  sectors: Sector[];
  stages: Stage[];
  region: Region;
  postedAgo: string;
  own?: boolean;
}

export interface Mandate extends Listing {
  investor: string;
  chips: string[];
  ticketMinM: number;
  ticketMaxM: number;
  thesis: string;
  recent: string[];
  tag: { text: string; tinted: boolean };
}

export interface Raise extends Listing {
  company: string;
  pitch: string;
  raisedM: number;
  targetM: number;
  minTicketM: number;
  interested: number;
  interestedBy: string[];
  closingDays: number;
  founders: string;
  traction: string;
}
