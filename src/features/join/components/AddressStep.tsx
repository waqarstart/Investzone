import { Controller, useFormContext, useWatch } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ADDRESS_VERIFICATION_REQUIRED } from "../steps";
import { PROOF_TYPES, todayISO } from "@/lib/documents";
import type { FormValues } from "../schemas";
import { useKycDraft } from "../useKycDraft";
import { Field, inputClass, selectTriggerClass } from "./FormField";
import { FileDropzone } from "./FileDropZone";

interface AddressStepProps {
  onEditAddress: () => void;
}

export function AddressStep({ onEditAddress }: AddressStepProps) {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<FormValues>();
  const values = useWatch({ control }) as FormValues;
  const { addressProof, fileErrors, setFile } = useKycDraft();

  const addressSummary = [
    values.addressLine1,
    values.addressLine2,
    values.city,
    values.stateProvince,
    values.postalCode,
    values.country,
  ]
    .filter((part) => part && part.trim())
    .join(", ");

  return (
    <div className="grid gap-5">
      {!ADDRESS_VERIFICATION_REQUIRED && (
        <span className="w-fit rounded-full bg-[#EEF0FA] px-3 py-1 text-xs font-semibold text-[#3F4FA0]">
          Optional
        </span>
      )}

      <Field label="Proof of address" htmlFor="proofType" error={errors.proofType?.message}>
        <Controller
          name="proofType"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger id="proofType" className={selectTriggerClass(Boolean(errors.proofType))}>
                <SelectValue placeholder="Select a document" />
              </SelectTrigger>
              <SelectContent>
                {PROOF_TYPES.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>

      <div className="rounded-xl bg-[#FAFAF8] p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Address on the document</p>
        <p className="mt-1 text-sm text-[#14213D]">{addressSummary || "No address added yet"}</p>
        <button
          type="button"
          onClick={onEditAddress}
          className="mt-2 text-sm font-medium text-[#3F4FA0] hover:underline"
        >
          Edit
        </button>
      </div>

      <Field
        label="Document issue date"
        htmlFor="proofIssueDate"
        error={errors.proofIssueDate?.message}
        hint="Issued within the last 3 months."
      >
        <input
          id="proofIssueDate"
          type="date"
          max={todayISO()}
          aria-invalid={Boolean(errors.proofIssueDate)}
          className={inputClass(Boolean(errors.proofIssueDate))}
          {...register("proofIssueDate")}
        />
      </Field>

      <FileDropzone
        id="address-proof"
        label="Upload document"
        file={addressProof}
        onChange={(file) => setFile("addressProof", file)}
        error={fileErrors.addressProof}
      />
    </div>
  );
}