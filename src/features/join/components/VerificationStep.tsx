import { AlertCircle, Check, Loader2 } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DOC_FORMATS, DOC_LABEL, formatDisplayDate, maskDocumentNumber, wait } from '@/lib/documents'
import type { FormValues } from "../schemas";
import { useKycDraft, type CheckId, type CheckResult } from "../useKycDraft";
import { isBefore, parseISO, startOfDay } from "date-fns";

const CHECKS: { id: CheckId; label: string }[] = [
  { id: "authenticity", label: "Document authenticity" },
  { id: "expiry", label: "Document expiry" },
  { id: "consistency", label: "Name and date of birth consistency" },
  { id: "number", label: "Document number" },
  { id: "ocr", label: "OCR-extracted information" },
];

function evaluate(id: CheckId, values: FormValues): CheckResult {
  switch (id) {
    case "expiry":
      return isBefore(parseISO(values.docExpiry), startOfDay(new Date()))
        ? { state: "failed", message: "This document has expired." }
        : { state: "passed" };
    case "number":
      return values.docType && DOC_FORMATS[values.docType].test(values.docNumber.trim())
        ? { state: "passed" }
        : { state: "failed", message: "The document number format looks invalid." };
    default:
      return { state: "passed" };
  }
}

interface VerificationStepProps {
  onBackToDocument: () => void;
}

export function VerificationStep({ onBackToDocument }: VerificationStepProps) {
  const reduced = useReducedMotion();
  const { getValues } = useFormContext<FormValues>();
  const checks = useKycDraft((state) => state.checks);
  const verification = useKycDraft((state) => state.verification);
  const runId = useRef(0);

  const run = useCallback(async () => {
    const id = ++runId.current;
    const alive = () => runId.current === id;
    const draft = useKycDraft.getState();
    const values = getValues();

    draft.resetChecks();
    draft.setVerification("running");
    let failed = false;

    for (const check of CHECKS) {
      draft.setCheck(check.id, { state: "running" });
      await wait(900);
      if (!alive()) return;
      const result = evaluate(check.id, values);
      if (result.state === "failed") failed = true;
      useKycDraft.getState().setCheck(check.id, result);
    }
    useKycDraft.getState().setVerification(failed ? "failed" : "passed");
  }, [getValues]);

  useEffect(() => {
    if (useKycDraft.getState().verification !== "passed") void run();
    return () => {
      runId.current += 1;
    };
  }, [run]);

  const values = getValues();

  return (
    <div className="grid gap-6">
      <ul className="grid gap-2" role="status" aria-live="polite">
        {CHECKS.map((check, index) => {
          const result = checks[check.id];
          return (
            <motion.li
              key={check.id}
              initial={reduced ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduced ? 0 : index * 0.06 }}
              className={cn(
                "flex items-start gap-3 rounded-xl border p-3.5",
                result.state === "failed" ? "border-[#F2705A] bg-[#FDECE8]" : "border-[#E5E7EB] bg-white",
              )}
            >
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center">
                {result.state === "running" && <Loader2 className="size-5 animate-spin text-[#F5B544]" />}
                {result.state === "passed" && (
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#5BA4E6] text-white">
                    <Check className="size-4" />
                  </span>
                )}
                {result.state === "failed" && <AlertCircle className="size-6 text-[#D9442F]" />}
                {result.state === "pending" && <span className="size-5 rounded-full border-2 border-[#D5DBE5]" />}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#14213D]">{check.label}</p>
                {result.message && <p className="text-sm text-[#D9442F]">{result.message}</p>}
              </div>
            </motion.li>
          );
        })}
      </ul>

      {verification === "failed" && (
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="outline" onClick={onBackToDocument} className="h-11 rounded-xl">
            Back to document
          </Button>
          <Button
            type="button"
            onClick={() => void run()}
            className="h-11 rounded-xl bg-[#F5B544] font-semibold text-[#14213D] hover:bg-[#E9A72F]"
          >
            Retry
          </Button>
        </div>
      )}

      {verification === "passed" && values.docType && (
        <section aria-label="Extracted from your document" className="rounded-2xl bg-[#FAFAF8] p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-[#14213D]">Extracted from your document</h3>
          <dl className="mt-3 divide-y divide-[#E5E7EB] text-sm">
            {[
              ["Name", values.fullName.trim().toUpperCase()],
              ["Date of birth", values.dob ? formatDisplayDate(values.dob) : "Not provided"],
              ["Document type", DOC_LABEL[values.docType]],
              ["Document number", maskDocumentNumber(values.docNumber)],
              ["Expiry date", formatDisplayDate(values.docExpiry)],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 py-2">
                <dt className="text-slate-500">{label}</dt>
                <dd className="text-right font-semibold text-[#14213D]">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-xs text-[#94A3B8]">Demo: document reading is simulated.</p>
        </section>
      )}
    </div>
  );
}