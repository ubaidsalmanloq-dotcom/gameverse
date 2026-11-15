import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Search, X } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { genreById, genres } from '@/data/genres'
import { games as allGames } from '@/data/games'
import type { Game, GenreId } from '@/data/types'
import { cn } from '@/lib/utils'
import { GameGrid } from './GameGrid'
import { SortSelect } from './SortSelect'
import type { CatalogSort, GenreFilter } from './catalogTypes'

interface CatalogExplorerProps {
  source?: Game[]
  genreFilters?: GenreId[]
  initialVisible?: number
  syncUrl?: boolean
  showSearch?: boolean
  searchPlaceholder?: string
  className?: string
  compactFilters?: boolean
}

const defaultGenres = genres.map((genre) => genre.id)

export function CatalogExplorer({
  source = allGames,
  genreFilters = defaultGenres,
  initialVisible = 9,
  syncUrl = false,
  showSearch = false,
  searchPlaceholder = 'Search titles, studios, genres…',
  className,
  compactFilters = false,
}: CatalogExplorerProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const paramGenre = searchParams.get('genre')
  const validParamGenre =
    syncUrl && paramGenre && (genreFilters.includes(paramGenre as GenreId) || paramGenre === 'all')
      ? (paramGenre as GenreFilter)
      : null
  const paramSort = syncUrl ? (searchParams.get('sort') as CatalogSort | null) : null
  const initialSort: CatalogSort =
    paramSort && ['popularity', 'year', 'alpha'].includes(paramSort) ? paramSort : 'popularity'

  const [activeGenre, setActiveGenre] = useState<GenreFilter>(validParamGenre ?? 'all')
  const [sort, setSort] = useState<CatalogSort>(initialSort)
  const [query, setQuery] = useState(syncUrl ? (searchParams.get('q') ?? '') : '')
  const [visible, setVisible] = useState(initialVisible)

  useEffect(() => {
    if (!syncUrl) return
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous)
        if (activeGenre === 'all') next.delete('genre')
        else next.set('genre', activeGenre)
        if (sort === 'popularity') next.delete('sort')
        else next.set('sort', sort)
        if (query.trim()) next.set('q', query.trim())
        else next.delete('q')
        return next
      },
      { replace: true },
    )
  }, [activeGenre, sort, query, syncUrl, setSearchParams])

  useEffect(() => {
    setVisible(initialVisible)
  }, [activeGenre, sort, query, initialVisible])

  const visibleGenres = genreFilters.map((id) => genreById[id]).filter(Boolean)

  const genreCounts = useMemo(() => {
    const counts: Record<string, number> = { all: source.length }
    for (const genre of visibleGenres) {
      counts[genre.id] = source.filter((game) => game.genres.includes(genre.id)).length
    }
    return counts
  }, [source, visibleGenres])

  const filteredGames = useMemo(() => {
    const tokens = query
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean)

    const filtered = source.filter((game) => {
      if (activeGenre !== 'all' && !game.genres.includes(activeGenre)) return false
      if (!tokens.length) return true
      const haystack = [
        game.title,
        game.developer,
        game.publisher,
        game.year.toString(),
        ...game.genres.map((id) => genreById[id]?.name ?? ''),
      ]
        .join(' ')
        .toLowerCase()
      return tokens.every((token) => haystack.includes(token))
    })

    return [...filtered].sort((a, b) => {
      if (sort === 'year') return b.year - a.year
      if (sort === 'alpha') return a.title.localeCompare(b.title, 'en', { sensitivity: 'base' })
      return b.popularity - a.popularity
    })
  }, [source, activeGenre, query, sort])

  const shownGames = filteredGames.slice(0, visible)
  const hasFilters = activeGenre !== 'all' || query.trim().length > 0 || sort !== 'popularity'

  const resetFilters = () => {
    setActiveGenre('all')
    setSort('popularity')
    setQuery('')
    setVisible(initialVisible)
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="border-y border-white/[0.07] py-5">
        <div
          className="hide-scrollbar -mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible"
          role="group"
          aria-label="Filter games by genre"
        >
          <FilterPill
            active={activeGenre === 'all'}
            label="All Games"
            count={genreCounts.all}
            onClick={() => setActiveGenre('all')}
          />
          {visibleGenres.map((genre) => (
            <FilterPill
              key={genre.id}
              active={activeGenre === genre.id}
              label={genre.shortName}
              count={genreCounts[genre.id] ?? 0}
              onClick={() => setActiveGenre(genre.id as GenreId)}
            />
          ))}
        </div>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
          {showSearch ? (
            <div className="relative w-full sm:w-[280px]">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/35" strokeWidth={1.7} />
              <label htmlFor="catalog-search" className="sr-only">
                Search the game archive
              </label>
              <input
                id="catalog-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={searchPlaceholder}
                className="h-10 w-full rounded-full border border-white/12 bg-white/[0.035] pl-10 pr-9 text-[11px] text-white placeholder:text-white/30 transition focus:border-accent/60 focus:bg-white/[0.05] focus:outline-none"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-white/40 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              ) : null}
            </div>
          ) : null}
          <div className="self-end sm:self-auto">
            <SortSelect value={sort} onChange={setSort} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-7 pb-6">
        <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/40" aria-live="polite">
          {filteredGames.length === 0
            ? 'No titles found'
            : `Showing ${shownGames.length} of ${filteredGames.length} ${filteredGames.length === 1 ? 'title' : 'titles'}`}
          {activeGenre !== 'all' ? (
            <span className="text-accent-soft"> · {genreById[activeGenre]?.name ?? activeGenre}</span>
          ) : null}
        </p>
        {hasFilters ? (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-mist transition hover:text-white"
          >
            Reset
            <X className="h-3 w-3" />
          </button>
        ) : null}
      </div>

      <GameGrid
        games={shownGames}
        onReset={resetFilters}
        priorityCount={compactFilters ? 2 : 3}
        emptyMessage={
          query.trim()
            ? `No games match “${query.trim()}”. Try a title, studio, or genre.`
            : 'No games in the archive match this filter yet.'
        }
      />

      <AnimatePresence>
        {filteredGames.length > shownGames.length ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-10 flex justify-center"
          >
            <button
              type="button"
              onClick={() => setVisible((current) => current + 9)}
              className="group inline-flex items-center gap-3 rounded-full border border-white/14 bg-white/[0.035] px-6 py-3.5 text-xs font-medium text-white transition hover:border-white/25 hover:bg-white/[0.07]"
            >
              Load more titles
              <span className="font-mono text-[9px] tracking-[0.12em] text-white/40">
                +{Math.min(9, filteredGames.length - shownGames.length)}
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-white/50 transition-transform group-hover:translate-x-0.5" />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {syncUrl && filteredGames.length > shownGames.length ? (
        <p className="mt-4 text-center text-[10px] text-white/25">
          <Link to="/discover" className="hover:text-white/60">
            Browse the full archive
          </Link>
        </p>
      ) : null}
    </div>
  )
}

function FilterPill({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean
  label: string
  count: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'group inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-[11px] font-medium tracking-[-0.01em] transition-all duration-300',
        active
          ? 'border-transparent bg-[#f4f1ea] text-[#0a0a0f]'
          : 'border-white/[0.09] bg-white/[0.02] text-mist-bright hover:border-white/20 hover:bg-white/[0.05] hover:text-white',
      )}
    >
      {label}
      <span
        className={cn(
          'font-mono text-[8px] tracking-[0.06em]',
          active ? 'text-black/45' : 'text-white/25 group-hover:text-white/40',
        )}
      >
        {count.toString().padStart(2, '0')}
      </span>
    </button>
  )
}
