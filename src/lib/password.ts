export const PASSWORD_RULES: { id: string; label: string; test: (value: string) => boolean }[] = [
  { id: "length", label: "At least 8 characters", test: (v) => v.length >= 8 },
  { id: "upper", label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { id: "lower", label: "One lowercase letter", test: (v) => /[a-z]/.test(v) },
  { id: "number", label: "One number", test: (v) => /\d/.test(v) },
];

const LABELS = ["", "Weak", "Fair", "Good", "Strong"] as const;

export function passwordStrength(value: string): { score: number; label: string } {
  if (!value) return { score: 0, label: "" };
  const score = PASSWORD_RULES.filter((rule) => rule.test(value)).length;
  return { score, label: LABELS[score] };
}