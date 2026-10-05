import { useEffect, useMemo, useState } from "react";
import { Pause, Play } from "lucide-react";
import { formatDuration, waveform } from "../lib/format";
import { useChatStore } from "../useChatStore";

export function VoiceBubble({ id, seconds }: { id: string; seconds: number }) {
  const playing = useChatStore((s) => s.playingVoiceId === id);
  const [elapsed, setElapsed] = useState(0);
  const bars = useMemo(() => waveform(id), [id]);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setElapsed((e) => {
        if (e + 0.1 >= seconds) {
          useChatStore.getState().setPlaying(null);
          return 0;
        }
        return e + 0.1;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [playing, seconds]);

  const progress = elapsed / seconds;
  return (
    <div className="flex items-center gap-3 sm:min-w-[260px]">
      <button
        type="button"
        aria-label={playing ? "Pause voice message" : "Play voice message"}
        onClick={() => useChatStore.getState().setPlaying(playing ? null : id)}
        className="grid size-11 shrink-0 place-items-center rounded-full bg-[#F5B544] text-[#14213D] focus-visible:outline-2 focus-visible:outline-[#3F4FA0] active:scale-[0.98]"
      >
        {playing ? <Pause aria-hidden className="size-5 fill-current" /> : <Play aria-hidden className="size-5 fill-current" />}
      </button>
      <div className="min-w-0 flex-1">
        <div className="flex h-8 items-center gap-[3px]" aria-hidden>
          {bars.map((h, i) => (
            <span
              key={i}
              style={{ height: `${h * 100}%` }}
              className={`w-[3px] shrink-0 rounded-full transition-colors duration-200 ${i / bars.length < progress ? "bg-[#3F4FA0]" : "bg-[#C9CEEA]"}`}
            />
          ))}
        </div>
        <p className="mt-0.5 text-xs text-[#475569]">{formatDuration(playing ? Math.round(elapsed) : seconds)}</p>
      </div>
    </div>
  );
}
