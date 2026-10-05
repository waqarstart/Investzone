import { initialsOf } from "../lib/format";
import type { Conversation } from "../types";

const TONES = ["bg-[#14213D]", "bg-[#3F4FA0]", "bg-[#475569]"] as const;

export function MutualConnections({ mutuals }: { mutuals: Conversation["mutuals"] }) {
  const shown = mutuals.names.slice(0, 2);
  return (
    <section aria-labelledby="mutual-title" className="px-5 py-5">
      <h4 id="mutual-title" className="text-[15px] font-semibold text-[#14213D]">Mutual connections ({mutuals.count})</h4>
      <div className="mt-3 flex items-center gap-3">
        <span aria-hidden className="flex shrink-0">
          {mutuals.names.slice(0, 3).map((n, i) => (
            <span key={n} className={`-ml-2 grid size-8 place-items-center rounded-full border-2 border-white text-[10px] font-semibold text-white first:ml-0 ${TONES[i % TONES.length]}`}>{initialsOf(n)}</span>
          ))}
        </span>
        <p className="text-[13px] text-[#475569]">{shown.join(", ")}, and {mutuals.count - shown.length} others</p>
      </div>
    </section>
  );
}
