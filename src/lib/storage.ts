import { useMemo, useSyncExternalStore } from "react";
import type { FormValues } from "@/features/join/schemas";

const DRAFT_KEY = "bridgeway-join-draft:v1";
const USER_KEY = "bridgeway-user:v1";
const CHANGE_EVENT = "bridgeway-storage";
export type UserRole = "investor" | "founder";

export type JoinDraft = Partial<Omit<FormValues, "otp">>;

export interface StoredUser {
  displayName: string;
  firstName: string;
  lastName: string;
  contact: string;
  maskedContact: string;
  location: string;
  role: "investor" | "founder" | "";
  kycStatus: "none" | "skipped" | "verified";
  createdAt: number;
}

function getItem(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function setItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // storage full or blocked: data just won't persist
  }
}

function removeItem(key: string) {
  try {
    localStorage.removeItem(key);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    // nothing to remove
  }
}

function parse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/* Draft of the join form (never stores the OTP) */
export const loadJoinDraft = () => parse<JoinDraft>(getItem(DRAFT_KEY));
export function saveJoinDraft(values: Partial<FormValues>) {
  setItem(DRAFT_KEY, JSON.stringify({ ...values, otp: undefined }));
}
export const clearJoinDraft = () => removeItem(DRAFT_KEY);

/* The signed-up user, readable from any page */
export const readUser = () => parse<StoredUser>(getItem(USER_KEY));

export function updateUser(patch: Partial<StoredUser>) {
  const current = readUser();
  const base: StoredUser = current ?? {
    displayName: "", firstName: "", lastName: "", contact: "", maskedContact: "",
    location: "", role: "", kycStatus: "none", createdAt: Date.now(),
  };
  setItem(USER_KEY, JSON.stringify({ ...base, ...patch }));
}

export const clearUser = () => removeItem(USER_KEY);

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

export function useStoredUser(): StoredUser | null {
  const raw = useSyncExternalStore(subscribe, () => getItem(USER_KEY), () => null);
  return useMemo(() => parse<StoredUser>(raw), [raw]);
}

/** Non-React read: route guards, utilities, event handlers. */
export function getRole(): UserRole | null {
  const role = readUser()?.role;
  return role === "investor" || role === "founder" ? role : null;
}

/** React hook: re-renders when the role changes in this tab or another one. */
export function useRole(): UserRole | null {
  const user = useStoredUser();
  const role = user?.role;
  return role === "investor" || role === "founder" ? role : null;
}