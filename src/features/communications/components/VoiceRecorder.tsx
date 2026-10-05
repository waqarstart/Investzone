import { useEffect, useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AMBER_BUTTON, formatDuration } from "../lib/format";

interface Props {
  onCancel: () => void;
  onSend: (seconds: number) => void;
}

export function VoiceRecorder({ onCancel, onSend }: Props) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flex items-center gap-3 px-4 py-3" role="status" aria-label="Recording voice message">
      <span aria-hidden className="size-3 animate-pulse rounded-full bg-[#D9442F]" />
      <span className="text-sm tabular-nums text-[#14213D]">{formatDuration(seconds)}</span>
      <span className="hidden text-[13px] text-[#94A3B8] sm:inline">Recording…</span>
      <Button type="button" variant="ghost" onClick={onCancel} className="ml-auto h-11 text-[#D9442F] hover:bg-[#FDECE8] sm:h-10">Cancel</Button>
      <Button type="button" size="icon" aria-label="Send voice message" onClick={() => onSend(Math.max(1, seconds))} className={`size-12 rounded-full ${AMBER_BUTTON}`}>
        <Send aria-hidden className="size-5" />
      </Button>
    </div>
  );
}
