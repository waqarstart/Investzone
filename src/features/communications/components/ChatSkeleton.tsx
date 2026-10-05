import { Skeleton } from "@/components/ui/skeleton";

export function ChatSkeleton() {
  return (
    <ul aria-hidden>
      {Array.from({ length: 6 }, (_, i) => (
        <li key={i} className="flex items-center gap-3.5 border-b border-[#E5E7EB] px-5 py-3.5">
          <Skeleton className="size-14 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3.5 w-full" />
          </div>
        </li>
      ))}
    </ul>
  );
}
