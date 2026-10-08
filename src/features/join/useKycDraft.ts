import { create } from "zustand";

export type CheckId = "authenticity" | "expiry" | "consistency" | "number" | "ocr";
export type CheckState = "pending" | "running" | "passed" | "failed";
export interface CheckResult {
  state: CheckState;
  message?: string;
}
export type FileKey = "idFront" | "idBack" | "addressProof";

const EMPTY_CHECKS: Record<CheckId, CheckResult> = {
  authenticity: { state: "pending" },
  expiry: { state: "pending" },
  consistency: { state: "pending" },
  number: { state: "pending" },
  ocr: { state: "pending" },
};

interface DraftState {
  idFront: File | null;
  idBack: File | null;
  addressProof: File | null;
  fileErrors: Partial<Record<FileKey, string>>;
  checks: Record<CheckId, CheckResult>;
  verification: "idle" | "running" | "passed" | "failed";
  selfie: "none" | "matched";
  setFile: (key: FileKey, file: File | null) => void;
  setFileError: (key: FileKey, message?: string) => void;
  setCheck: (id: CheckId, result: CheckResult) => void;
  resetChecks: () => void;
  setVerification: (value: DraftState["verification"]) => void;
  setSelfie: (value: DraftState["selfie"]) => void;
  reset: () => void;
}

export const useKycDraft = create<DraftState>()((set) => ({
  idFront: null,
  idBack: null,
  addressProof: null,
  fileErrors: {},
  checks: { ...EMPTY_CHECKS },
  verification: "idle",
  selfie: "none",
  setFile: (key, file) =>
    set((state) => ({
      [key]: file,
      fileErrors: { ...state.fileErrors, [key]: undefined },
    })),
  setFileError: (key, message) =>
    set((state) => ({ fileErrors: { ...state.fileErrors, [key]: message } })),
  setCheck: (id, result) => set((state) => ({ checks: { ...state.checks, [id]: result } })),
  resetChecks: () => set({ checks: { ...EMPTY_CHECKS } }),
  setVerification: (verification) => set({ verification }),
  setSelfie: (selfie) => set({ selfie }),
  reset: () =>
    set({
      idFront: null,
      idBack: null,
      addressProof: null,
      fileErrors: {},
      checks: { ...EMPTY_CHECKS },
      verification: "idle",
      selfie: "none",
    }),
}));