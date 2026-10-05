import { Skeleton } from "@/components/ui/skeleton";

export function RowSkeleton() {
  return (
    <li aria-hidden className="flex gap-4 py-5">
      <Skeleton className="size-12 shrink-0 rounded-2xl sm:size-16" />
      <div className="flex-1 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-full" />
      </div>
    </li>
  );
}
