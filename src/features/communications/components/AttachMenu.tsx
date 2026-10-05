import { useState } from "react";
import { Camera, FileText, Image, Paperclip, Presentation } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ICON_BUTTON } from "../lib/format";

interface Props {
  onFile: (name: string, pages: number) => void;
}

export function AttachMenu({ onFile }: Props) {
  const [open, setOpen] = useState(false);
  const soon = () => { toast("Attachments of this type are coming soon"); setOpen(false); };
  const pick = (name: string, pages: number) => { onFile(name, pages); setOpen(false); };
  const options = [
    { label: "Document", icon: FileText, run: () => pick("Term_Sheet_v2.pdf", 6) },
    { label: "Photos", icon: Image, run: soon },
    { label: "Pitch deck", icon: Presentation, run: () => pick("AgriFlow_Pitch_Deck.pdf", 18) },
    { label: "Camera", icon: Camera, run: soon },
  ];
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" aria-label="Attach file" className={`grid place-items-center focus-visible:outline-2 focus-visible:outline-[#3F4FA0] ${ICON_BUTTON}`}>
          <Paperclip aria-hidden className="size-6" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" className="w-48 p-1.5">
        {options.map((o) => (
          <button key={o.label} type="button" onClick={o.run} className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-sm text-[#14213D] hover:bg-[#EEF0FA]">
            <o.icon aria-hidden className="size-4 text-[#3F4FA0]" />
            {o.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
