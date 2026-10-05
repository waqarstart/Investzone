export function FoundersPanel({ founders, traction }: { founders: string; traction: string }) {
  return (
    <div className="mt-1 space-y-3 rounded-xl bg-[#FFF8E8] p-4">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-[#94A3B8]">Founders</p>
        <p className="mt-1 text-[13.5px] text-[#475569]">{founders}</p>
      </div>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-[#94A3B8]">Traction &amp; history</p>
        <p className="mt-1 text-[13px] leading-relaxed text-[#475569]">{traction}</p>
      </div>
    </div>
  );
}
