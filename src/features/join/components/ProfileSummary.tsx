import { Check, Minus, ShieldAlert, ShieldCheck, User } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { COUNTRIES } from "@/lib/countries";
import {
  DOC_LABEL,
  PROOF_LABEL,
  formatDisplayDate,
  maskDocumentNumber,
  requiresBackSide,
} from "@/lib/documents";
import { maskEmail, maskPhone } from "../lib/contact";
import type { FormValues } from "../schemas";
import { STEPS, type KycStatus, type StepKey, type StepStatus } from "../steps";
import { useKycDraft, type CheckId } from "../useKycDraft";

void COUNTRIES;

interface Row {
  label: string;
  value: ReactNode | null;
  optional?: boolean;
}

interface ProfileSummaryProps {
  values: FormValues;
  statuses: Record<StepKey, StepStatus>;
  activeKey: StepKey | null;
  kycStatus: KycStatus;
  persisted: { displayName: string; maskedContact: string; role: "" | "investor" | "founder" };
}

const CHECK_LABELS: Record<CheckId, string> = {
  authenticity: "Document authenticity",
  expiry: "Document expiry",
  consistency: "Name and date of birth",
  number: "Document number",
  ocr: "OCR-extracted information",
};

function Chip({ tone, children }: { tone: "indigo" | "amber" | "sky"; children: ReactNode }) {
  const styles = {
    indigo: "bg-[#EEF0FA] text-[#3F4FA0]",
    amber: "bg-[#FEF3D8] text-[#8A5A00]",
    sky: "bg-[#E4F1FC] text-[#2F7DC2]",
  };
  return (
    <span className={cn("whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold", styles[tone])}>
      {children}
    </span>
  );
}

function fileName(file: File | null): string | null {
  return file ? file.name : null;
}

function buildRows(
  key: StepKey,
  values: FormValues,
  statuses: Record<StepKey, StepStatus>,
  persisted: ProfileSummaryProps["persisted"],
  draft: ReturnType<typeof useKycDraft.getState>,
): Row[] {
  const name = values.fullName.trim() || persisted.displayName;
  const contact =
    values.contactMethod === "phone"
      ? values.phone.replace(/\D/g, "").length > 4
        ? maskPhone(values.phone)
        : ""
      : values.email.trim()
        ? maskEmail(values.email)
        : "";
  const role = values.role || persisted.role;

  switch (key) {
    case "registration":
      return [
        { label: "Full legal name", value: name || null },
        {
          label: "Contact",
          value:
            contact || persisted.maskedContact ? (
              <span className="flex items-center justify-end gap-2">
                {contact || persisted.maskedContact}
                {statuses.registration === "completed" && <Chip tone="sky">Verified</Chip>}
              </span>
            ) : null,
        },
        {
          label: "Password",
          value: values.password.length >= 8 || statuses.registration === "completed" ? "Set" : null,
        },
        {
          label: "Role",
          value: role ? (
            <Chip tone={role === "investor" ? "indigo" : "amber"}>
              {role === "investor" ? "Investor" : "Founder"}
            </Chip>
          ) : null,
        },
        { label: "Account", value: statuses.registration === "completed" ? "Created" : null },
      ];
    case "basic":
      return [
        { label: "Full legal name", value: name || null },
        { label: "Date of birth", value: values.dob ? formatDisplayDate(values.dob) : null },
        { label: "Nationality", value: values.nationality || null },
        {
          label: "Address",
          value: values.city && values.country ? `${values.city}, ${values.country}` : null,
        },
        {
          label: "Gender",
          value:
            values.gender === "male"
              ? "Male"
              : values.gender === "female"
                ? "Female"
                : values.gender === "prefer_not"
                  ? "Prefer not to say"
                  : "Not provided",
          optional: !values.gender,
        },
      ];
    case "document": {
      const rows: Row[] = [
        { label: "Document type", value: values.docType ? DOC_LABEL[values.docType] : null },
        {
          label: "Document number",
          value: values.docNumber.trim() ? maskDocumentNumber(values.docNumber) : null,
        },
        { label: "Expiry date", value: values.docExpiry ? formatDisplayDate(values.docExpiry) : null },
        { label: "Front side", value: fileName(draft.idFront) },
      ];
      if (requiresBackSide(values.docType)) {
        rows.push({ label: "Back side", value: fileName(draft.idBack) });
      }
      return rows;
    }
    case "verification":
      return (Object.keys(CHECK_LABELS) as CheckId[]).map((id) => {
        const state = draft.checks[id].state;
        return {
          label: CHECK_LABELS[id],
          value: state === "passed" ? "Passed" : state === "failed" ? "Failed" : state === "running" ? "Checking…" : null,
        };
      });
    case "selfie": {
      const matched = draft.selfie === "matched";
      return [
        { label: "Live selfie", value: matched ? "Captured" : null },
        { label: "Liveness", value: matched ? "Passed" : null },
        { label: "Face match", value: matched ? "Matched" : null },
      ];
    }
    case "address":
      return [
        { label: "Proof type", value: values.proofType ? PROOF_LABEL[values.proofType] : null },
        {
          label: "Issue date",
          value: values.proofIssueDate ? formatDisplayDate(values.proofIssueDate) : null,
        },
        { label: "Document", value: fileName(draft.addressProof) },
      ];
  }
}

function StatusPill({ status, active }: { status: StepStatus; active: boolean }) {
  if (status === "completed") return <Chip tone="sky">Completed</Chip>;
  if (status === "skipped") {
    return <span className="whitespace-nowrap rounded-full bg-[#F3F4F6] px-2.5 py-0.5 text-xs font-semibold text-slate-500">Skipped</span>;
  }
  if (active) return <Chip tone="amber">In progress</Chip>;
  return <span className="whitespace-nowrap rounded-full bg-[#F3F4F6] px-2.5 py-0.5 text-xs font-semibold text-slate-500">Not started</span>;
}

function StatusIcon({ status, active }: { status: StepStatus; active: boolean }) {
  if (status === "completed") {
    return (
      <span className="flex size-6 items-center justify-center rounded-full bg-[#5BA4E6] text-white">
        <Check className="size-4" aria-hidden="true" />
      </span>
    );
  }
  if (status === "skipped") {
    return (
      <span className="flex size-6 items-center justify-center rounded-full bg-[#E5E7EB] text-slate-500">
        <Minus className="size-4" aria-hidden="true" />
      </span>
    );
  }
  return (
    <span
      className={cn(
        "size-6 rounded-full border-2",
        active ? "border-[#F5B544] bg-[#FEF3D8]" : "border-[#D5DBE5]",
      )}
    />
  );
}

export function ProfileSummary({ values, statuses, activeKey, kycStatus, persisted }: ProfileSummaryProps) {
  const draft = useKycDraft();
  const [open, setOpen] = useState<string[]>(activeKey ? [activeKey] : []);

  useEffect(() => {
    if (activeKey) setOpen((current) => (current.includes(activeKey) ? current : [...current, activeKey]));
  }, [activeKey]);

  const name = values.fullName.trim() || persisted.displayName;
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const role = values.role || persisted.role;
  const completed = STEPS.filter((step) => statuses[step.key] === "completed").length;
  const verified = kycStatus === "verified";

  return (
    <aside
      aria-label="Your profile so far"
      className="flex flex-col rounded-3xl border border-[#E5E7EB] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_rgba(16,24,40,0.04)] sm:p-8"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-[#14213D] sm:text-2xl">Your profile so far</h2>
        <span className="flex items-center gap-1.5 rounded-full bg-[#EEF0FA] px-3 py-1 text-xs font-semibold text-slate-600">
          <span className="size-2 rounded-full bg-[#5BA4E6]" />
          LIVE
        </span>
      </div>

      <div className="mt-5 flex items-center gap-4 rounded-2xl border border-[#E5E7EB] bg-[#FAFAF8] p-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#EEF0FA] text-lg font-semibold text-[#3F4FA0]">
          {initials || <User className="size-6" aria-hidden="true" />}
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-[#14213D]">{name || "Your name"}</p>
          <span
            className={cn(
              "mt-1 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold",
              verified ? "bg-[#E4F1FC] text-[#2F7DC2]" : "bg-[#FDE3DD] text-[#D9442F]",
            )}
          >
            {verified ? (
              <ShieldCheck className="size-3.5" aria-hidden="true" />
            ) : (
              <ShieldAlert className="size-3.5" aria-hidden="true" />
            )}
            {verified ? "KYC verified" : "Not KYC verified"}
          </span>
          {role && (
            <p className="mt-1 text-xs text-slate-500">
              Joining as {role === "investor" ? "Investor" : "Founder"}
            </p>
          )}
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-[#14213D]">KYC progress</span>
          <span className="text-slate-500">{completed}/6 steps</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E5E7EB]">
          <div
            className="h-full rounded-full bg-[#F5B544] transition-all duration-500"
            style={{ width: `${(completed / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <Accordion type="multiple" value={open} onValueChange={setOpen} className="mt-4">
        {STEPS.map((step) => {
          const status = statuses[step.key];
          const active = activeKey === step.key;
          const rows = buildRows(step.key, values, statuses, persisted, draft);
          const counted = rows.filter((row) => !row.optional || row.value !== "Not provided");
          const filled = counted.filter((row) => row.value !== null).length;

          return (
            <AccordionItem key={step.key} value={step.key} className="border-[#E5E7EB]">
              <AccordionTrigger className="gap-3 py-4 hover:no-underline">
                <span className="flex min-w-0 flex-1 items-center gap-3">
                  <StatusIcon status={status} active={active} />
                  <span className="min-w-0 text-left">
                    <span className="block truncate text-sm font-semibold text-[#14213D]">{step.label}</span>
                    <span className="block text-xs font-normal text-slate-500">
                      {filled} of {counted.length} fields
                    </span>
                  </span>
                </span>
                <StatusPill status={status} active={active} />
              </AccordionTrigger>
              <AccordionContent>
                <dl className="divide-y divide-[#F0F1F3]">
                  {rows.map((row) => (
                    <div key={row.label} className="flex items-center justify-between gap-4 py-2 text-sm">
                      <dt className="text-slate-500">{row.label}</dt>
                      <dd
                        className={cn(
                          "min-w-0 truncate text-right",
                          row.value === null
                            ? "italic text-[#94A3B8]"
                            : row.value === "Failed"
                              ? "font-semibold text-[#D9442F]"
                              : "font-semibold text-[#14213D]",
                        )}
                      >
                        {row.value ?? (status === "skipped" ? "Skipped" : "Not added yet")}
                      </dd>
                    </div>
                  ))}
                </dl>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      <p className="mt-4 flex items-start gap-2 rounded-xl bg-[#FAFAF8] p-3 text-xs text-slate-500">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#3F4FA0]" aria-hidden="true" />
        Your details are only used to verify your identity on Bridgeway.
      </p>
    </aside>
  );
}