import { create } from "zustand";
import { persist } from "zustand/middleware";
import { INITIAL_STEP_STATUS, STEPS, type KycStatus, type StepKey, type StepStatus } from "./steps";

interface KycState {
  accountCreated: boolean;
  displayName: string;
  maskedContact: string;
  role: "" | "investor" | "founder";
  kycStatus: KycStatus;
  stepStatus: Record<StepKey, StepStatus>;
  createAccount: (payload: {
    displayName: string;
    maskedContact: string;
    role: "investor" | "founder";
  }) => void;
  completeStep: (key: StepKey) => void;
  skipRemaining: () => void;
  markVerified: () => void;
  resumeFromSkipped: () => void;
  reset: () => void;
}

const INITIAL = {
  accountCreated: false,
  displayName: "",
  maskedContact: "",
  role: "" as const,
  kycStatus: "not_started" as KycStatus,
  stepStatus: INITIAL_STEP_STATUS,
};

export const useKycStore = create<KycState>()(
  persist(
    (set) => ({
      ...INITIAL,
      createAccount: ({ displayName, maskedContact, role }) =>
        set((state) => ({
          accountCreated: true,
          displayName,
          maskedContact,
          role,
          kycStatus: "in_progress",
          stepStatus: { ...state.stepStatus, registration: "completed" },
        })),
      completeStep: (key) =>
        set((state) => ({
          stepStatus: { ...state.stepStatus, [key]: "completed" },
          kycStatus: state.kycStatus === "verified" ? "verified" : "in_progress",
        })),
      skipRemaining: () =>
        set((state) => {
          const next = { ...state.stepStatus };
          for (const step of STEPS) {
            if (next[step.key] !== "completed") next[step.key] = "skipped";
          }
          return { stepStatus: next, kycStatus: "skipped" };
        }),
      markVerified: () => set({ kycStatus: "verified" }),
      resumeFromSkipped: () =>
        set((state) => {
          const next = { ...state.stepStatus };
          for (const step of STEPS) {
            if (next[step.key] === "skipped") next[step.key] = "not_started";
          }
          return { stepStatus: next, kycStatus: "in_progress" };
        }),
      reset: () => set({ ...INITIAL, stepStatus: { ...INITIAL_STEP_STATUS } }),
    }),
    { name: "bridgeway-kyc" },
  ),
);