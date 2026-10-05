import type { ColumnFilters, FilterKey } from "../types";
import { FilterDropdown } from "./FilterDropdown";
import { FilterPill } from "./FilterPill";

export interface FilterGroup {
  key: FilterKey;
  label: string;
  options: readonly string[];
}

interface Props {
  allLabel: string;
  groups: FilterGroup[];
  values: ColumnFilters;
  onChange: (key: FilterKey, values: string[]) => void;
  onClear: () => void;
}

export function FilterBar({ allLabel, groups, values, onChange, onClear }: Props) {
  const none = Object.values(values).every((v) => v.length === 0);
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <FilterPill label={allLabel} selected={none} onClick={onClear} />
      {groups.map((g) => (
        <FilterDropdown key={g.key} label={g.label} options={g.options} selected={values[g.key]} onChange={(v) => onChange(g.key, v)} />
      ))}
    </div>
  );
}
