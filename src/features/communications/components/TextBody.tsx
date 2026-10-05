import { splitHighlight } from "../lib/format";

export function TextBody({ text, query }: { text: string; query: string }) {
  return (
    <p className="whitespace-pre-wrap break-words text-[15px] leading-[1.6] text-[#14213D]">
      {splitHighlight(text, query).map((part, i) =>
        part.match ? <mark key={i} className="rounded bg-[#F5B544] px-0.5 text-[#14213D]">{part.text}</mark> : <span key={i}>{part.text}</span>,
      )}
    </p>
  );
}
