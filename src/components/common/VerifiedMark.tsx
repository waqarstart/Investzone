import { Check } from 'lucide-react'
import { cn } from 'cn'

export function VerifiedMark({ className }: { className?: string }) {
  return (
    <span
      aria-label="Verified"
      className={cn(
        'inline-grid size-3.5 shrink-0 place-items-center rounded-full bg-[#5BA4E6] text-white',
        className,
      )}
    >
      <Check className="size-2.5" strokeWidth={3.5} />
    </span>
  )
}
