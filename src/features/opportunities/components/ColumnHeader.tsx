interface Props {
  id: string;
  title: string;
  count: number;
  countWord: string;
  subtitle: string;
}

export function ColumnHeader({ id, title, count, countWord, subtitle }: Props) {
  return (
    <header>
      <div className="flex items-baseline justify-between gap-3">
        <h2 id={id} className="font-display text-[26px] font-bold text-[#14213D]">{title}</h2>
        <p className="shrink-0 text-[13px] text-[#94A3B8]">{count} {countWord}</p>
      </div>
      <p className="mt-1 text-[13.5px] text-[#475569]">{subtitle}</p>
    </header>
  );
}
