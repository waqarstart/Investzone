import { format, isValid, parseISO } from "date-fns";

export type DocType = "cnic" | "passport" | "license";
export type ProofType = "utility_bill" | "bank_statement" | "government" | "other";

export const wait = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));

export const DOCUMENT_TYPES: {
  id: DocType;
  label: string;
  hint: string;
  placeholder: string;
}[] = [
  { id: "cnic", label: "CNIC / National ID", hint: "Front and back", placeholder: "35202-1234567-1" },
  { id: "passport", label: "Passport", hint: "Photo page", placeholder: "AB1234567" },
  { id: "license", label: "Driving license", hint: "Front and back", placeholder: "LHR-1234567" },
];

export const DOC_LABEL: Record<DocType, string> = {
  cnic: "CNIC / National ID",
  passport: "Passport",
  license: "Driving license",
};

export const DOC_FORMATS: Record<DocType, RegExp> = {
  cnic: /^\d{5}-?\d{7}-?\d$/,
  passport: /^[A-Za-z0-9]{6,9}$/,
  license: /^[A-Za-z0-9-]{6,20}$/,
};

export const DOC_NUMBER_ERROR: Record<DocType, string> = {
  cnic: "Enter a valid CNIC number",
  passport: "Enter a valid passport number",
  license: "Enter a valid license number",
};

export const PROOF_TYPES: { id: ProofType; label: string }[] = [
  { id: "utility_bill", label: "Utility bill" },
  { id: "bank_statement", label: "Bank statement" },
  { id: "government", label: "Government document" },
  { id: "other", label: "Other proof of address" },
];

export const PROOF_LABEL: Record<ProofType, string> = {
  utility_bill: "Utility bill",
  bank_statement: "Bank statement",
  government: "Government document",
  other: "Other proof of address",
};

export function requiresBackSide(type: DocType | ""): boolean {
  return type === "cnic" || type === "license";
}

export function formatCnic(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 13);
  return [digits.slice(0, 5), digits.slice(5, 12), digits.slice(12)]
    .filter(Boolean)
    .join("-");
}

export function maskDocumentNumber(value: string): string {
  const clean = value.replace(/[^A-Za-z0-9]/g, "");
  return clean.length <= 4 ? clean : `•••• ${clean.slice(-4)}`;
}

export const ACCEPTED_FILES: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "application/pdf": [".pdf"],
};

export const ACCEPTED_IMAGES: Record<string, string[]> = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024;

export function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function todayISO(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function formatDisplayDate(iso: string): string {
  const date = parseISO(iso);
  return isValid(date) ? format(date, "d MMM yyyy") : iso;
}

export function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
}