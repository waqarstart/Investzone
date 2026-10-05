export function MandateChips({ chips }: { chips: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <li key={chip} className="rounded-md border border-[#E5E7EB] bg-[#F3F4F6] px-2 py-1 text-[11.5px] text-[#475569]">
          {chip}
        </li>
      ))}
    </ul>
  );
}
