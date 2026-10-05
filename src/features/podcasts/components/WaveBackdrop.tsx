import { cn } from 'cn'
import type { ThumbAccent, ThumbShape } from '../types'

const ACCENTS: Record<ThumbAccent, string> = {
  amber: '#F5B544',
  sky: '#5BA4E6',
}

export function WaveBackdrop({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 600 320"
      preserveAspectRatio="none"
      className={cn('pointer-events-none absolute inset-0 h-full w-full', className)}
    >
      <path
        d="M-20 214 C 60 134, 130 274, 210 204 S 350 74, 430 164 S 570 254, 640 174"
        fill="none"
        stroke="#8FA0F0"
        strokeWidth="2.5"
        opacity="0.4"
      />
      <path
        d="M-20 244 C 70 174, 140 304, 220 234 S 360 114, 440 194 S 580 274, 640 214"
        fill="none"
        stroke="#A5AEF2"
        strokeWidth="2"
        opacity="0.3"
      />
      <path
        d="M-20 184 C 50 114, 120 244, 200 174 S 340 44, 420 134 S 560 224, 640 144"
        fill="none"
        stroke="#7C8DE8"
        strokeWidth="2"
        opacity="0.25"
      />
      <path
        d="M-20 274 C 80 214, 150 324, 230 264 S 370 154, 450 224 S 590 294, 640 244"
        fill="none"
        stroke="#B6BEF5"
        strokeWidth="1.5"
        opacity="0.28"
      />
      <path
        d="M-20 154 C 40 94, 110 214, 190 144 S 330 24, 410 104 S 550 194, 640 114"
        fill="none"
        stroke="#6E7FDD"
        strokeWidth="1.5"
        opacity="0.32"
      />
    </svg>
  )
}

export function ThumbShape({ shape, accent }: { shape: ThumbShape; accent: ThumbAccent }) {
  const stroke = ACCENTS[accent]
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 180"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {shape === 'wave' && (
        <path
          d="M-10 118 C 50 64, 96 152, 156 112 S 252 40, 334 92"
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.35"
        />
      )}
      {shape === 'arc' && (
        <path
          d="M14 156 A 150 150 0 0 1 306 156"
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.35"
        />
      )}
      {shape === 'triangle' && (
        <path
          d="M160 26 L 296 156 L 24 156 Z"
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          strokeLinejoin="round"
          opacity="0.35"
        />
      )}
      {shape === 'circle' && (
        <circle
          cx="160"
          cy="90"
          r="62"
          fill="none"
          stroke={stroke}
          strokeWidth="2.5"
          opacity="0.35"
        />
      )}
    </svg>
  )
}
