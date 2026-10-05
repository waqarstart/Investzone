import { CircleCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function VerifiedBadge() {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span tabIndex={0} role="img" aria-label="Verified by Bridgeway" className="shrink-0 rounded-full text-[#5BA4E6] focus-visible:outline-2 focus-visible:outline-[#3F4FA0]">
            <CircleCheck className="size-5" strokeWidth={1.75} />
          </span>
        </TooltipTrigger>
        <TooltipContent>Verified by Bridgeway</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
