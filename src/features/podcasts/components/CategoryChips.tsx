import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from 'cn'
import { CATEGORIES } from '../data'
import type { Category } from '../types'

interface CategoryChipsProps {
  value: Category
  onChange: (category: Category) => void
}

export function CategoryChips({ value, onChange }: CategoryChipsProps) {
  const rowRef = useRef<HTMLDivElement>(null)
  const [scrolled, setScrolled] = useState(false)

  function handleScroll() {
    const row = rowRef.current
    if (row) setScrolled(row.scrollLeft > 4)
  }

  function scrollRow() {
    rowRef.current?.scrollBy({ left: scrolled ? -240 : 240, behavior: 'smooth' })
  }

  return (
    <div className="flex min-w-0 items-center gap-2">
      <div
        ref={rowRef}
        onScroll={handleScroll}
        role="group"
        aria-label="Episode categories"
        className="flex min-w-0 flex-1 gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {CATEGORIES.map((category) => {
          const active = category === value
          return (
            <button
              key={category}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(category)}
              className={cn(
                'h-9 shrink-0 rounded-full px-3.5 text-[13px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F4FA0]',
                active
                  ? 'bg-[#14213D] font-semibold text-white'
                  : 'border border-[#D5DBE5] bg-white font-medium text-[#475569] hover:border-[#3F4FA0]/50 hover:text-[#14213D]',
              )}
            >
              {category}
            </button>
          )
        })}
      </div>
      <button
        type="button"
        onClick={scrollRow}
        aria-label={scrolled ? 'Scroll categories to the left' : 'Scroll categories to the right'}
        className="hidden size-9 shrink-0 place-items-center rounded-full border border-[#E5E7EB] bg-white text-[#14213D] shadow-[0_1px_2px_rgba(16,24,40,0.06)] transition-colors hover:bg-[#F6F4EF] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3F4FA0] md:grid"
      >
        {scrolled ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
      </button>
    </div>
  )
}
