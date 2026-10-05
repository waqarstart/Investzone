import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  options: readonly string[];
  selected: string[];
  onChange: (values: string[]) => void;
}

export function FilterDropdown({ label, options, selected, onChange }: Props) {
  const active = selected.length > 0;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-[13px] focus-visible:outline-2 focus-visible:outline-[#3F4FA0] md:h-8",
            active ? "border-[#3F4FA0]/30 bg-[#EEF0FA] font-medium text-[#3F4FA0]" : "border-[#E5E7EB] bg-white text-[#475569] hover:bg-[#FAFAF8]",
          )}
        >
          {active ? `${label} · ${selected.length}` : label}
          <ChevronDown aria-hidden className="size-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={selected.includes(option)}
            onSelect={(e) => e.preventDefault()}
            onCheckedChange={(on) => onChange(on ? [...selected, option] : selected.filter((o) => o !== option))}
          >
            {option}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
