import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import type { CatalogSort } from './catalogTypes'

interface SortSelectProps {
  value: CatalogSort
  onChange: (value: CatalogSort) => void
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <label className="group relative inline-flex shrink-0 items-center gap-2 rounded-full border border-white/12 bg-white/[0.035] pl-4 pr-2 text-[11px] text-mist-bright transition hover:border-white/20 hover:bg-white/[0.055]">
      <SlidersHorizontal className="h-3.5 w-3.5 text-white/45" strokeWidth={1.6} />
      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/40">Sort</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as CatalogSort)}
        aria-label="Sort games"
        className="cursor-pointer appearance-none bg-transparent py-2.5 pr-6 text-[11px] font-medium text-white outline-none"
      >
        <option className="bg-[#11131a] text-white" value="popularity">
          Popularity
        </option>
        <option className="bg-[#11131a] text-white" value="year">
          Release year
        </option>
        <option className="bg-[#11131a] text-white" value="alpha">
          Alphabetical
        </option>
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 h-3.5 w-3.5 text-white/40" strokeWidth={1.8} />
    </label>
  )
}
