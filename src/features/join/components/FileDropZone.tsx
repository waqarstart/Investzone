import { FileText, RefreshCw, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { cn } from "@/lib/utils";
import { ACCEPTED_FILES, ACCEPTED_IMAGES, MAX_FILE_SIZE, formatFileSize } from '@/lib/documents';

interface FileDropzoneProps {
  id: string;
  label: string;
  file: File | null;
  onChange: (file: File | null) => void;
  error?: string;
  imagesOnly?: boolean;
}

export function FileDropzone({ id, label, file, onChange, error, imagesOnly }: FileDropzoneProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
    return undefined;
  }, [file]);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: imagesOnly ? ACCEPTED_IMAGES : ACCEPTED_FILES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    noClick: Boolean(file),
    onDropAccepted: (files) => {
      setLocalError(null);
      onChange(files[0] ?? null);
    },
    onDropRejected: (rejections: FileRejection[]) => {
      const code = rejections[0]?.errors[0]?.code;
      setLocalError(code === "file-too-large" ? "File is larger than 5 MB" : "Unsupported file type");
    },
  });

  const message = localError ?? error;

  return (
    <div className="min-w-0">
      <p className="mb-2 text-sm font-semibold text-[#14213D]">{label}</p>
      <div
        {...getRootProps({
          id,
          "aria-label": `${label} upload`,
          className: cn(
            "rounded-xl border-2 border-dashed p-4 outline-none transition focus-visible:ring-4 focus-visible:ring-[#F5B544]/25",
            isDragActive ? "border-[#F5B544] bg-[#FEF3D8]" : "border-[#D5DBE5] bg-[#FAFAF8]",
            message && "border-[#F2705A]",
          ),
        })}
      >
        <input {...getInputProps()} />
        {file ? (
          <div className="flex items-center gap-3">
            <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#EEF0FA] text-[#3F4FA0]">
              {preview ? (
                <img src={preview} alt="" className="size-full object-cover" />
              ) : (
                <FileText className="size-6" aria-hidden="true" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-[#14213D]">{file.name}</p>
              <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  onClick={open}
                  className="inline-flex items-center gap-1 text-sm font-medium text-[#3F4FA0] hover:underline"
                >
                  <RefreshCw className="size-3.5" aria-hidden="true" /> Replace
                </button>
                <button
                  type="button"
                  onClick={() => onChange(null)}
                  className="inline-flex items-center gap-1 text-sm font-medium text-[#D9442F] hover:underline"
                >
                  <Trash2 className="size-3.5" aria-hidden="true" /> Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex cursor-pointer flex-col items-center gap-1 py-4 text-center">
            <UploadCloud className="size-7 text-[#3F4FA0]" aria-hidden="true" />
            <p className="text-sm font-medium text-[#14213D]">Drag and drop or browse</p>
            <p className="text-xs text-slate-500">
              {imagesOnly ? "JPG or PNG" : "JPG, PNG or PDF"} · up to 5 MB
            </p>
          </div>
        )}
      </div>
      {message && (
        <p role="alert" className="mt-1.5 text-sm text-[#D9442F]">
          {message}
        </p>
      )}
    </div>
  );
}