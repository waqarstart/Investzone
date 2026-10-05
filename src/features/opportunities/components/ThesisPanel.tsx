export function ThesisPanel({ thesis, recent }: { thesis: string; recent: string[] }) {
  return (
    <div className="mt-1 rounded-xl bg-[#F6F6F4] p-4">
      <p className="text-[11px] font-medium uppercase tracking-wide text-[#94A3B8]">Investment thesis</p>
      <p className="mt-2 text-[13.5px] leading-relaxed text-[#475569]">“{thesis}”</p>
      {recent.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-[#94A3B8]">Recent investments:</span>
          {recent.map((r) => (
            <span key={r} className="rounded-md border border-[#E5E7EB] bg-white px-2 py-1 text-[11.5px] text-[#475569]">
              {r}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
