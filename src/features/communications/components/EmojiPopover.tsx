import { Smile } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ICON_BUTTON } from "../lib/format";

const EMOJIS = ["😀", "😂", "😊", "😍", "🙏", "👍", "🔥", "🎉", "💡", "📈", "💰", "🤝", "✅", "📎", "📊", "🚀", "👏", "🙌", "😅", "🤔", "👀", "💼", "🏦", "🌱"];

export function EmojiPopover({ onPick }: { onPick: (emoji: string) => void }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" aria-label="Insert emoji" className={`grid place-items-center focus-visible:outline-2 focus-visible:outline-[#3F4FA0] ${ICON_BUTTON}`}>
          <Smile aria-hidden className="size-6" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" className="w-64 p-2">
        <div className="grid grid-cols-6 gap-1">
          {EMOJIS.map((e) => (
            <button key={e} type="button" onClick={() => onPick(e)} aria-label={`Insert ${e}`} className="grid size-9 place-items-center rounded-lg text-xl hover:bg-[#EEF0FA]">
              {e}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
