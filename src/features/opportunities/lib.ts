import type { ColumnFilters, Listing, Preferences, PrefKey, Range, Region, Sector, Stage } from "./types";

export const SECTORS = ["FinTech", "AgriTech", "HealthTech", "DeepTech & AI", "Logistics", "CleanTech"] as const satisfies readonly Sector[];
export const STAGES = ["Pre-seed", "Seed", "Series A", "Growth"] as const satisfies readonly Stage[];
export const SIZE_OPTIONS = ["Up to PKR 20M", "PKR 20M–50M", "PKR 50M–100M", "PKR 100M+"] as const;
export const LOCATIONS = ["Pakistan", "GCC", "Pakistan & GCC", "Global"] as const;
export const ANY_TICKET = "Any size";

export const CARD_CLASS =
  "rounded-2xl sm:rounded-[20px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04),0_6px_20px_rgba(16,24,40,0.05)]";
export const AMBER_BUTTON =
  "bg-[#F5B544] text-[#14213D] hover:bg-[#E9A72E] focus-visible:ring-2 focus-visible:ring-[#3F4FA0] active:scale-[0.98]";

const SIZE_RANGES: Record<string, Range> = {
  "Up to PKR 20M": [0, 20],
  "PKR 20M–50M": [20, 50],
  "PKR 50M–100M": [50, 100],
  "PKR 100M+": [100, Infinity],
};
export const TICKET_RANGES: Record<string, Range> = {
  [ANY_TICKET]: [0, Infinity],
  "Up to PKR 20M": [0, 20],
  "PKR 20M – 100M": [20, 100],
  "PKR 100M+": [100, Infinity],
};

export const percentRaised = (raisedM: number, targetM: number) => Math.round((raisedM / targetM) * 100);

export function formatSectors(sectors: readonly Sector[]) {
  return sectors.length === 2 ? sectors.join(" & ") : sectors.join(", ");
}

export function formatStages(stages: readonly Stage[]) {
  const sorted = STAGES.filter((s) => stages.includes(s));
  const first = STAGES.indexOf(sorted[0] ?? "Pre-seed");
  const last = STAGES.indexOf(sorted[sorted.length - 1] ?? "Pre-seed");
  return sorted.length > 1 && last - first === sorted.length - 1
    ? `${sorted[0]} to ${sorted[sorted.length - 1]}`
    : sorted.join(", ");
}

export function getPreferenceChips(p: Preferences): { key: PrefKey; label: string; value: string }[] {
  const chips: { key: PrefKey; label: string; value: string }[] = [];
  if (p.sectors.length) chips.push({ key: "sectors", label: "Sector", value: formatSectors(p.sectors) });
  if (p.ticket) chips.push({ key: "ticket", label: "Ticket size", value: p.ticket });
  if (p.stages.length) chips.push({ key: "stages", label: "Stage", value: formatStages(p.stages) });
  if (p.location) chips.push({ key: "location", label: "Location", value: p.location });
  return chips;
}

function regionFits(region: Region, location: string | null) {
  if (location === "Pakistan") return region !== "GCC";
  if (location === "GCC") return region !== "Pakistan";
  return true;
}

export type FitFn<T> = (item: T, range: Range, kind: "filter" | "pref") => boolean;

export function filterListings<T extends Listing>(
  list: T[],
  f: ColumnFilters,
  prefs: Preferences | null,
  fits: FitFn<T>,
): T[] {
  return list.filter((item) => {
    if (item.own) return true;
    if (f.sector.length && !item.sectors.some((s) => f.sector.includes(s))) return false;
    if (f.stage.length && !item.stages.some((s) => f.stage.includes(s))) return false;
    if (f.size.length && !f.size.some((k) => { const r = SIZE_RANGES[k]; return r !== undefined && fits(item, r, "filter"); })) return false;
    if (!prefs) return true;
    if (prefs.sectors.length && !item.sectors.some((s) => prefs.sectors.includes(s))) return false;
    if (prefs.stages.length && !item.stages.some((s) => prefs.stages.includes(s))) return false;
    const ticket = prefs.ticket ? TICKET_RANGES[prefs.ticket] : undefined;
    if (ticket && !fits(item, ticket, "pref")) return false;
    return regionFits(item.region, prefs.location);
  });
}
