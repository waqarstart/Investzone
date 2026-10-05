import { BookUser, Car, IdCard } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { cn } from "@/lib/utils";
import {
  DOCUMENT_TYPES,
  formatCnic,
  requiresBackSide,
  todayISO,
  type DocType,
} from '@/lib/documents'
import type { FormValues } from "../schemas";
import { useKycDraft } from "../useKycDraft";
import { Field, inputClass } from "./FormField";
import { FileDropzone } from "./FileDropZone";

const ICONS: Record<DocType, LucideIcon> = { cnic: IdCard, passport: BookUser, license: Car };

export function DocumentStep() {
  const {
    control,
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<FormValues>();
  const docType = useWatch({ control, name: "docType" });
  const { idFront, idBack, fileErrors, setFile } = useKycDraft();
  const needsBack = requiresBackSide(docType);
  const current = DOCUMENT_TYPES.find((type) => type.id === docType);

  return (
    <div className="grid gap-6">
      <div>
        <p id="doc-type-label" className="mb-2 text-sm font-semibold text-[#14213D]">
          Document type
        </p>
        <div role="radiogroup" aria-labelledby="doc-type-label" className="grid gap-3 sm:grid-cols-3">
          {DOCUMENT_TYPES.map((type) => {
            const Icon = ICONS[type.id];
            const selected = docType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  if (selected) return;
                  setValue("docType", type.id, { shouldValidate: false });
                  setValue("docNumber", "");
                  clearErrors(["docType", "docNumber"]);
                  setFile("idBack", null);
                }}
                className={cn(
                  "flex items-center gap-3 rounded-xl border-2 p-4 text-left transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F5B544]/25 sm:flex-col sm:items-start",
                  selected
                    ? "border-[#F5B544] bg-[#FEF3D8]"
                    : "border-[#E5E7EB] bg-white hover:border-[#D5DBE5]",
                )}
              >
                <Icon className="size-6 shrink-0 text-[#3F4FA0]" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-[#14213D]">{type.label}</span>
                  <span className="block text-xs text-slate-500">{type.hint}</span>
                </span>
              </button>
            );
          })}
        </div>
        {errors.docType && (
          <p role="alert" className="mt-1.5 text-sm text-[#D9442F]">
            {errors.docType.message}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Document number" htmlFor="docNumber" error={errors.docNumber?.message}>
          <Controller
            name="docNumber"
            control={control}
            render={({ field }) => (
              <input
                id="docNumber"
                type="text"
                value={field.value}
                onBlur={field.onBlur}
                onChange={(event) =>
                  field.onChange(
                    docType === "cnic"
                      ? formatCnic(event.target.value)
                      : event.target.value.toUpperCase(),
                  )
                }
                placeholder={current?.placeholder ?? "Select a document type first"}
                disabled={!docType}
                autoComplete="off"
                aria-invalid={Boolean(errors.docNumber)}
                className={cn(inputClass(Boolean(errors.docNumber)), "disabled:bg-[#F3F4F6]")}
              />
            )}
          />
        </Field>
        <Field label="Expiry date" htmlFor="docExpiry" error={errors.docExpiry?.message}>
          <input
            id="docExpiry"
            type="date"
            min={todayISO()}
            aria-invalid={Boolean(errors.docExpiry)}
            className={inputClass(Boolean(errors.docExpiry))}
            {...register("docExpiry")}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FileDropzone
          id="id-front"
          label={docType === "passport" ? "Photo page" : "Front side"}
          file={idFront}
          onChange={(file) => setFile("idFront", file)}
          error={fileErrors.idFront}
        />
        {needsBack && (
          <FileDropzone
            id="id-back"
            label="Back side"
            file={idBack}
            onChange={(file) => setFile("idBack", file)}
            error={fileErrors.idBack}
          />
        )}
      </div>
    </div>
  );
}