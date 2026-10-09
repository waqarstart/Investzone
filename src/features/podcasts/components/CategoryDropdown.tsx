import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Filter } from 'lucide-react'
import { CATEGORIES } from '../data'
import type { Category } from '../types'

interface CategoryDropdownProps {
  value: Category
  onChange: (category: Category) => void
}

export function CategoryDropdown({ value, onChange }: CategoryDropdownProps) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-10 w-[170px] sm:w-[200px] items-center justify-between rounded-xl border border-[#CBD5E1] bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-[#14213D] shadow-xs hover:border-[#3F4FA0] hover:bg-[#F8FAFC] transition-all cursor-pointer select-none"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <div className="flex min-w-0 items-center gap-2">
          <Filter className="size-3.5 sm:size-4 shrink-0 text-[#3F4FA0]" />
          <span className="truncate text-left font-bold text-[#14213D]">
            {value === 'All' ? 'All Categories' : value}
          </span>
        </div>
        <ChevronDown
          className={`size-3.5 sm:size-4 shrink-0 text-[#64748B] transition-transform duration-200 ml-1.5 ${
            open ? 'rotate-180 text-[#3F4FA0]' : ''
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 w-[200px] sm:w-[220px] rounded-2xl border border-slate-200 bg-white py-1.5 shadow-[0_10px_30px_rgba(20,33,61,0.12)] z-50 animate-in fade-in zoom-in-95 duration-100 max-h-72 overflow-y-auto">
          {CATEGORIES.map((cat) => {
            const isSelected = cat === value
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  onChange(cat)
                  setOpen(false)
                }}
                className={`flex w-full items-center justify-between px-3.5 py-2 text-xs font-semibold transition-colors cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#EEF0FA] text-[#3F4FA0] font-bold'
                    : 'text-[#14213D] hover:bg-slate-50 hover:text-[#3F4FA0]'
                }`}
              >
                <span className="truncate mr-2">{cat === 'All' ? 'All Categories' : cat}</span>
                {isSelected && <Check className="size-3.5 shrink-0 text-[#3F4FA0]" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
