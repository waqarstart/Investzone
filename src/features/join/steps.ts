export type StepKey =
  | "registration"
  | "basic"
  | "document"
  | "verification"
  | "selfie"
  | "address";

export type StepStatus = "not_started" | "completed" | "skipped";
export type KycStatus = "not_started" | "in_progress" | "skipped" | "verified";

export interface StepMeta {
  key: StepKey;
  label: string;
  eyebrow: string;
  heading: string;
  helper: string;
}

export const STEPS: StepMeta[] = [
  {
    key: "registration",
    label: "Registration",
    eyebrow: "REGISTRATION",
    heading: "Create your account",
    helper: "Start with the basics. KYC comes next.",
  },
  {
    key: "basic",
    label: "Basic information",
    eyebrow: "BASIC INFORMATION",
    heading: "Tell us about you",
    helper: "Enter your details exactly as they appear on your ID.",
  },
  {
    key: "document",
    label: "Identity document",
    eyebrow: "IDENTITY DOCUMENT",
    heading: "Upload your ID",
    helper: "Choose a document and upload clear photos of it.",
  },
  {
    key: "verification",
    label: "Verification",
    eyebrow: "IDENTITY VERIFICATION",
    heading: "Verifying your identity",
    helper: "This usually takes a few seconds.",
  },
  {
    key: "selfie",
    label: "Selfie check",
    eyebrow: "SELFIE CHECK",
    heading: "Take a live selfie",
    helper: "We'll compare it with the photo on your ID.",
  },
  {
    key: "address",
    label: "Address proof",
    eyebrow: "ADDRESS PROOF",
    heading: "Verify your address",
    helper: "Upload a document that shows your current address.",
  },
];

/** When false, the address step is optional and can be completed without an upload. */
export const ADDRESS_VERIFICATION_REQUIRED = true;

export const INITIAL_STEP_STATUS: Record<StepKey, StepStatus> = {
  registration: "not_started",
  basic: "not_started",
  document: "not_started",
  verification: "not_started",
  selfie: "not_started",
  address: "not_started",
};