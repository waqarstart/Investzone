import { ShieldCheck } from "lucide-react";

export function SystemNotice({ text }: { text: string }) {
  return (
    <div className="my-3.5 flex justify-center">
      <p className="inline-flex max-w-[90%] items-start gap-2 rounded-full border border-[#E5E7EB] bg-white px-3.5 py-1.5 text-[12.5px] text-[#475569]">
        <ShieldCheck aria-hidden className="mt-0.5 size-3.5 shrink-0 text-[#F5B544]" />
        <span>{text}</span>
      </p>
    </div>
  );
}
