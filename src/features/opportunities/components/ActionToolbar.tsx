import type { ReactNode } from "react";
import { FolderKanban, ListChecks, SlidersHorizontal, SquarePen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PanelKey } from "../types";
import { useFilteredMandates, useFilteredRaises, useOpportunitiesStore } from "../useOpportunitiesStore";

const ITEM = "inline-flex min-h-11 items-center gap-2 whitespace-nowrap text-sm text-[#475569] hover:text-[#14213D] focus-visible:outline-2 focus-visible:outline-[#3F4FA0] md:min-h-0";

function ToolbarButton({ panel, filled, children }: { panel: PanelKey; filled?: boolean; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => useOpportunitiesStore.getState().setPanel(panel)}
      className={cn(ITEM, filled && "h-11 rounded-xl bg-[#3F4FA0] px-4 font-medium text-white hover:bg-[#35438A] hover:text-white md:h-10")}
    >
      {children}
    </button>
  );
}

export function ActionToolbar() {
  const total = useFilteredMandates().length + useFilteredRaises().length;
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <nav
        aria-label="Opportunity actions"
        className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden"
      >
        <ul className="flex w-max items-center gap-x-6 gap-y-3 md:w-auto md:flex-wrap">
          <li><ToolbarButton panel="preferences"><SlidersHorizontal aria-hidden className="size-4" />Preferences</ToolbarButton></li>
          <li><ToolbarButton panel="tracker"><FolderKanban aria-hidden className="size-4" />Deal tracker</ToolbarButton></li>
          <li><ToolbarButton panel="post" filled><SquarePen aria-hidden className="size-4" />Post an opportunity</ToolbarButton></li>
          <li><ToolbarButton panel="posts"><ListChecks aria-hidden className="size-4" />Manage my posts</ToolbarButton></li>
        </ul>
      </nav>
      <p className="flex items-center gap-2 text-[12.5px] text-[#475569]">
        <span aria-hidden className="size-2 rounded-full bg-[#F5B544]" />
        <span>Updated 10m ago · <strong className="font-semibold text-[#14213D]">{total} matching opportunities</strong></span>
      </p>
    </div>
  );
}
