import { Star } from "lucide-react";

export function MatchLine({ text = "You'd be a top match" }: { text?: string }) {
  return (
    <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#8A5A00]">
      <span aria-hidden className="grid size-[18px] place-items-center rounded-full border border-[#F5B544]">
        <Star className="size-2.5 fill-[#F5B544] text-[#F5B544]" />
      </span>
      {text}
    </p>
  );
}
