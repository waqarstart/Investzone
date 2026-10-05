import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import type { Message } from "../types";

export function FileBubble({ file }: { file: NonNullable<Message["file"]> }) {
  const meta = [file.size, file.pages ? `${file.pages} pages` : null, file.note].filter(Boolean).join(" · ");
  return (
    <div className="flex items-center gap-3 sm:min-w-[320px]">
      <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#EEF0FA] text-[#3F4FA0]">
        <FileText className="size-6" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[#14213D]">{file.name}</p>
        <p className="truncate text-xs text-[#475569]">{meta}</p>
      </div>
      <button
        type="button"
        aria-label={`Download ${file.name}`}
        onClick={() => toast("Download is simulated (demo)")}
        className="grid size-10 shrink-0 place-items-center rounded-full text-[#475569] hover:bg-[#EEF0FA] focus-visible:outline-2 focus-visible:outline-[#3F4FA0]"
      >
        <Download aria-hidden className="size-4" />
      </button>
    </div>
  );
}
