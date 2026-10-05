import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

interface LogoProps {
  size?: number
  showWordmark?: boolean
  className?: string
  to?: string
  wordmarkSize?: string
}

export function Logo({ size = 44, showWordmark = true, className, to = "/", wordmarkSize = "text-xl" }: LogoProps) {
  const mark = (
    <span
      className="flex items-center justify-center rounded-xl bg-[#FEF3D8]"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg width={Math.round(size * 0.55)} height={Math.round(size * 0.55)} viewBox="0 0 24 24" fill="none">
        <path
          d="M3 17c3.5-7 7.5-10.5 12-10.5H21"
          stroke="#14213D"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M3 7c3.5 7 7.5 10.5 12 10.5H21"
          stroke="#F5B544"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )

  return (
    <Link
      to={to}
      className={cn("inline-flex items-center gap-3 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F5B544]/40", className)}
    >
      {mark}
      {showWordmark ? (
        <span className={`font-['Playfair_Display'] ${wordmarkSize} font-bold tracking-tight text-[#14213D]`}>
          Bridgeway
        </span>
      ) : null}
    </Link>
  )
}
