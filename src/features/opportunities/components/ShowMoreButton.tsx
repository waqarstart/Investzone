import { ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  label: string;
  remaining: number;
  loading: boolean;
  onClick: () => void;
}

export function ShowMoreButton({ label, remaining, loading, onClick }: Props) {
  if (remaining === 0 && !loading) {
    return <p className="mt-3 py-3 text-center text-[13px] text-[#94A3B8]">You're all caught up</p>;
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="mt-3 flex h-12 w-full items-center justify-center gap-1.5 rounded-xl bg-[#F6F6F4] text-[13px] text-[#475569] hover:bg-[#EFEEEA] focus-visible:outline-2 focus-visible:outline-[#3F4FA0] disabled:opacity-70"
    >
      {loading ? <Skeleton className="h-3 w-28" /> : <>{label}<ChevronDown aria-hidden className="size-4" /></>}
    </button>
  );
}
