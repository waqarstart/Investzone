import { useMemo } from "react";
import { create } from "zustand";
import { MANDATES, RAISES } from "./data";
import { filterListings, type FitFn } from "./lib";
import type { ColumnFilters, ColumnKey, FilterKey, Listing, Mandate, PanelKey, Preferences, PrefKey, Raise } from "./types";

const DEFAULT_PREFS: Preferences = {
  sectors: ["FinTech", "AgriTech"],
  ticket: "PKR 20M – 100M",
  stages: ["Seed", "Series A"],
  location: "Pakistan & GCC",
};
const EMPTY_PREFS: Preferences = { sectors: [], ticket: null, stages: [], location: null };
const EMPTY_FILTERS: ColumnFilters = { sector: [], size: [], stage: [] };
const PAGE_SIZE = 4;

interface State {
  prefs: Preferences;
  prefsApplied: boolean;
  filters: Record<ColumnKey, ColumnFilters>;
  visible: Record<ColumnKey, number>;
  loadingMore: ColumnKey | null;
  saved: string[];
  pitched: string[];
  interested: string[];
  ownMandates: Mandate[];
  ownRaises: Raise[];
  panel: PanelKey | null;
  pitchTargetId: string | null;
  removePref: (key: PrefKey) => void;
  resetPrefs: () => void;
  savePrefs: (prefs: Preferences) => void;
  setFilter: (column: ColumnKey, key: FilterKey, values: string[]) => void;
  clearFilters: (column: ColumnKey) => void;
  showMore: (column: ColumnKey) => Promise<void>;
  toggleSaved: (id: string) => void;
  addPitched: (id: string) => void;
  removePitched: (id: string) => void;
  addInterested: (id: string) => void;
  removeInterested: (id: string) => void;
  addMandate: (m: Mandate) => void;
  addRaise: (r: Raise) => void;
  deletePost: (id: string) => void;
  setPanel: (panel: PanelKey | null) => void;
  setPitchTarget: (id: string | null) => void;
}

const without = (list: string[], id: string) => list.filter((x) => x !== id);

export const useOpportunitiesStore = create<State>((set, get) => ({
  prefs: DEFAULT_PREFS,
  prefsApplied: false,
  filters: { investors: EMPTY_FILTERS, founders: EMPTY_FILTERS },
  visible: { investors: PAGE_SIZE, founders: PAGE_SIZE },
  loadingMore: null,
  saved: [],
  pitched: [],
  interested: [],
  ownMandates: [],
  ownRaises: [],
  panel: null,
  pitchTargetId: null,
  removePref: (key) =>
    set((s) => ({
      prefsApplied: true,
      prefs: { ...s.prefs, [key]: key === "sectors" || key === "stages" ? [] : null },
    })),
  resetPrefs: () => set({ prefs: EMPTY_PREFS, prefsApplied: true }),
  savePrefs: (prefs) => set({ prefs, prefsApplied: true }),
  setFilter: (column, key, values) =>
    set((s) => ({ filters: { ...s.filters, [column]: { ...s.filters[column], [key]: values } } })),
  clearFilters: (column) => set((s) => ({ filters: { ...s.filters, [column]: EMPTY_FILTERS } })),
  showMore: async (column) => {
    if (get().loadingMore) return;
    set({ loadingMore: column });
    await new Promise((resolve) => setTimeout(resolve, 600));
    set((s) => ({ loadingMore: null, visible: { ...s.visible, [column]: s.visible[column] + PAGE_SIZE } }));
  },
  toggleSaved: (id) => set((s) => ({ saved: s.saved.includes(id) ? without(s.saved, id) : [...s.saved, id] })),
  addPitched: (id) => set((s) => ({ pitched: [...s.pitched, id] })),
  removePitched: (id) => set((s) => ({ pitched: without(s.pitched, id) })),
  addInterested: (id) => set((s) => ({ interested: [...s.interested, id] })),
  removeInterested: (id) => set((s) => ({ interested: without(s.interested, id) })),
  addMandate: (m) => set((s) => ({ ownMandates: [m, ...s.ownMandates] })),
  addRaise: (r) => set((s) => ({ ownRaises: [r, ...s.ownRaises] })),
  deletePost: (id) =>
    set((s) => ({
      ownMandates: s.ownMandates.filter((m) => m.id !== id),
      ownRaises: s.ownRaises.filter((r) => r.id !== id),
    })),
  setPanel: (panel) => set({ panel }),
  setPitchTarget: (pitchTargetId) => set({ pitchTargetId }),
}));

const mandateFits: FitFn<Mandate> = (m, r) => m.ticketMinM <= r[1] && m.ticketMaxM >= r[0];
const raiseFits: FitFn<Raise> = (x, r, kind) =>
  kind === "pref" ? x.minTicketM <= r[1] : x.targetM >= r[0] && x.targetM <= r[1];

export function useFilteredMandates() {
  const own = useOpportunitiesStore((s) => s.ownMandates);
  const filters = useOpportunitiesStore((s) => s.filters.investors);
  const prefs = useOpportunitiesStore((s) => (s.prefsApplied ? s.prefs : null));
  return useMemo(() => filterListings([...own, ...MANDATES], filters, prefs, mandateFits), [own, filters, prefs]);
}

export function useFilteredRaises() {
  const own = useOpportunitiesStore((s) => s.ownRaises);
  const filters = useOpportunitiesStore((s) => s.filters.founders);
  const prefs = useOpportunitiesStore((s) => (s.prefsApplied ? s.prefs : null));
  return useMemo(() => filterListings([...own, ...RAISES], filters, prefs, raiseFits), [own, filters, prefs]);
}

export function useAllListings() {
  const ownMandates = useOpportunitiesStore((s) => s.ownMandates);
  const ownRaises = useOpportunitiesStore((s) => s.ownRaises);
  return useMemo(
    () => ({ mandates: [...ownMandates, ...MANDATES], raises: [...ownRaises, ...RAISES] }),
    [ownMandates, ownRaises],
  );
}

export function useVisibleSlice<T extends Listing>(list: T[], column: ColumnKey) {
  const visible = useOpportunitiesStore((s) => s.visible[column]);
  const loading = useOpportunitiesStore((s) => s.loadingMore === column);
  const base = list.filter((i) => !i.own);
  return {
    shown: [...list.filter((i) => i.own), ...base.slice(0, visible)],
    remaining: Math.max(0, base.length - visible),
    loading,
  };
}
