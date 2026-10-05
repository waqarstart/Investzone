import { useState } from "react";
import { FileText, PlayCircle, Table2, type LucideIcon } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FOCUS } from "../lib/format";
import type { MediaItem, MediaKind } from "../types";

const ICONS: Record<MediaKind, { icon: LucideIcon; color: string }> = {
  doc: { icon: FileText, color: "text-[#3F4FA0]" },
  table: { icon: Table2, color: "text-[#F5B544]" },
  video: { icon: PlayCircle, color: "text-[#5BA4E6]" },
};

function Tile({ item, onOpen }: { item: MediaItem; onOpen: () => void }) {
  const { icon: Icon, color } = ICONS[item.kind];
  return (
    <button type="button" onClick={onOpen} className={`flex min-w-0 flex-col items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#FAFAF8] p-3 hover:bg-white ${FOCUS}`}>
      <Icon aria-hidden className={`size-6 ${color}`} />
      <span className="w-full truncate text-xs text-[#14213D]">{item.name}</span>
    </button>
  );
}

export function MediaGrid({ media }: { media: MediaItem[] }) {
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const [allOpen, setAllOpen] = useState(false);
  return (
    <section aria-labelledby="media-title" className="border-b border-[#E5E7EB] px-5 py-5">
      <div className="flex items-center justify-between">
        <h4 id="media-title" className="text-[15px] font-semibold text-[#14213D]">Media, docs &amp; links</h4>
        <button type="button" onClick={() => setAllOpen(true)} className={`text-sm font-medium text-[#3F4FA0] hover:underline ${FOCUS}`}>{media.length} · See all</button>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2.5">
        {media.slice(0, 3).map((item) => <Tile key={item.id} item={item} onOpen={() => setPreview(item)} />)}
      </div>
      <Dialog open={allOpen} onOpenChange={setAllOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Media, docs &amp; links</DialogTitle>
            <DialogDescription>{media.length} shared items</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-2.5">
            {media.map((item) => <Tile key={item.id} item={item} onOpen={() => { setAllOpen(false); setPreview(item); }} />)}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={preview !== null} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="truncate">{preview?.name}</DialogTitle>
            <DialogDescription>Preview not available in demo</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
}
