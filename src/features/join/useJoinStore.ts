import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface FinishedProfile {
  firstName: string
  lastName: string
  contact: string
  location: string
  role: "investor" | "founder"
}

interface JoinState {
  profile: FinishedProfile | null
  saveProfile: (profile: FinishedProfile) => void
  clearProfile: () => void
}

export const useJoinStore = create<JoinState>()(
  persist(
    (set) => ({
      profile: null,
      saveProfile: (profile) => set({ profile }),
      clearProfile: () => set({ profile: null }),
    }),
    { name: "bridgeway-user" },
  ),
)
