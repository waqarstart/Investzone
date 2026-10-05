export function DateSeparator({ label }: { label: string }) {
  return (
    <div className="my-3.5 flex justify-center">
      <span className="rounded-full bg-[#EEF0F3] px-3 py-1 text-xs text-[#475569]">{label}</span>
    </div>
  );
}
