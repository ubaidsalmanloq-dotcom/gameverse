import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUpRight,
  CornerDownLeft,
  Search,
  SearchX,
  Sparkles,
  X,
} from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { games } from '@/data/games'
import { genres } from '@/data/genres'
import { EASE } from '@/lib/motion'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { cn, initials } from '@/lib/utils'
import { PlatformList } from './PlatformBadge'
import { SafeImage } from './SafeImage'

interface SearchOverlayProps {
  open: boolean
  onClose: () => void
}

interface ResultItem {
  id: string
  title: string
  meta: string
  href: string
  kind: 'game' | 'genre' | 'studio'
  image?: string
  platforms?: string[]
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function Highlight({ text, query }: { text: string; query: string }) {
  const term = query.trim()
  if (!term) return <>{text}</>
  const parts = text.split(new RegExp(`(${escapeRegExp(term)})`, 'ig'))
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === term.toLowerCase() ? (
          <mark key={index} className="rounded-[2px] bg-accent/25 px-0.5 text-accent-soft">
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        ),
      )}
    </>
  )
}

const popularSlugs = ['elden-ring', 'cyberpunk-2077', 'baldurs-gate-3', 'silent-hill-2']

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)
  const deferredQuery = useDeferredValue(query.trim().toLowerCase())
  const navigate = useNavigate()
  const location = useLocation()

  useLockBodyScroll(open)

  useEffect(() => {
    if (!open) return
    previousFocus.current = document.activeElement as HTMLElement
    const timer = window.setTimeout(() => {
      inputRef.current?.focus()
      setQuery('')
      setActiveIndex(0)
    }, 60)
    return () => {
      window.clearTimeout(timer)
      previousFocus.current?.focus?.()
    }
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [deferredQuery])

  useEffect(() => {
    if (!open) return
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  useEffect(() => {
    if (open) onClose()
    // Close when the route changes after a result is selected.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search])

  const results = useMemo(() => {
    if (!deferredQuery) return { games: [], genres: [], studios: [] as ResultItem[] }

    const matchingGames = games
      .map((game) => {
        const title = game.title.toLowerCase()
        const genreText = game.genres.map((id) => genres.find((genre) => genre.id === id)?.name ?? '').join(' ')
        const fields = `${title} ${game.developer.toLowerCase()} ${game.publisher.toLowerCase()} ${genreText.toLowerCase()} ${game.year}`
        if (!fields.includes(deferredQuery)) return null
        const score = title.startsWith(deferredQuery) ? 3 : title.includes(deferredQuery) ? 2 : 1
        return {
          score,
          item: {
            id: `game-${game.slug}`,
            title: game.title,
            meta: `${game.year} · ${game.primaryGenre.replace('-', ' ')} · ${game.developer}`,
            href: `/games/${game.slug}`,
            kind: 'game' as const,
            image: game.cover,
            platforms: game.platforms,
          },
        }
      })
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
      .sort((a, b) => b.score - a.score || b.item.meta.localeCompare(a.item.meta))
      .slice(0, 6)
      .map((entry) => entry.item)

    const matchingGenres = genres
      .filter((genre) => `${genre.name} ${genre.shortName} ${genre.tagline} ${genre.meaning}`.toLowerCase().includes(deferredQuery))
      .slice(0, 5)
      .map((genre) => ({
        id: `genre-${genre.id}`,
        title: genre.name,
        meta: genre.tagline,
        href: `/genres?genre=${genre.id}`,
        kind: 'genre' as const,
        image: genre.image,
      }))

    const studios = Array.from(new Set(games.map((game) => game.developer)))
      .filter((developer) => developer.toLowerCase().includes(deferredQuery))
      .slice(0, 4)
      .map((developer): ResultItem => {
        const gameCount = games.filter((game) => game.developer === developer).length
        return {
          id: `studio-${developer}`,
          title: developer,
          meta: `${gameCount} ${gameCount === 1 ? 'title' : 'titles'} in the archive`,
          href: `/discover?q=${encodeURIComponent(developer)}`,
          kind: 'studio',
        }
      })

    return { games: matchingGames, genres: matchingGenres, studios }
  }, [deferredQuery])

  const flatResults = useMemo(
    () => [...results.games, ...results.genres, ...results.studios],
    [results],
  )

  useEffect(() => {
    const active = document.getElementById(flatResults[activeIndex]?.id ?? '')
    active?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, flatResults])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((current) => (flatResults.length ? (current + 1) % flatResults.length : 0))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) => (flatResults.length ? (current - 1 + flatResults.length) % flatResults.length : 0))
    } else if (event.key === 'Enter' && flatResults[activeIndex]) {
      event.preventDefault()
      navigate(flatResults[activeIndex].href)
      onClose()
    } else if (event.key === 'Tab') {
      const panel = panelRef.current
      if (!panel) return
      const focusable = panel.querySelectorAll<HTMLElement>('button:not([disabled]), input, a[href]')
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
  }

  const popularGames = popularSlugs
    .map((slug) => games.find((game) => game.slug === slug))
    .filter(Boolean)

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto px-3 pb-6 pt-[8vh] sm:px-6 sm:pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label="Search GAMEVERSE"
          onKeyDown={handleKeyDown}
        >
          <button
            type="button"
            className="fixed inset-0 cursor-default bg-[#05060a]/85 backdrop-blur-xl"
            onClick={onClose}
            aria-label="Close search"
            tabIndex={-1}
          />

          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[1.4rem] border border-white/12 bg-[#0d0e14]/95 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4 sm:px-6">
              <Search className="h-4 w-4 shrink-0 text-accent-soft" strokeWidth={1.6} />
              <label htmlFor="global-search" className="sr-only">
                Search games, genres, and studios
              </label>
              <input
                ref={inputRef}
                id="global-search"
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls="search-results"
                aria-autocomplete="list"
                aria-activedescendant={flatResults[activeIndex]?.id}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search games, genres, studios…"
                autoComplete="off"
                spellCheck={false}
                className="h-9 min-w-0 flex-1 bg-transparent text-[15px] text-white placeholder:text-white/30 focus:outline-none"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    inputRef.current?.focus()
                  }}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/45 transition hover:bg-white/10 hover:text-white"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : null}
              <button
                type="button"
                onClick={onClose}
                className="hidden shrink-0 items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.12em] text-white/40 transition hover:bg-white/[0.07] hover:text-white sm:flex"
                aria-label="Close search"
              >
                Esc
              </button>
            </div>

            <div id="search-results" className="max-h-[min(62vh,560px)] overflow-y-auto overscroll-contain p-2.5 sm:p-3">
              {!deferredQuery ? (
                <div>
                  <div className="flex items-center gap-2 px-3 pb-3 pt-2">
                    <Sparkles className="h-3 w-3 text-accent-soft" />
                    <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">
                      Popular in the archive
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {popularGames.map((game) =>
                      game ? (
                        <button
                          key={game.slug}
                          type="button"
                          onClick={() => {
                            navigate(`/games/${game.slug}`)
                            onClose()
                          }}
                          className="group flex items-center gap-3 rounded-xl border border-transparent p-2 text-left transition hover:border-white/10 hover:bg-white/[0.045]"
                        >
                          <SafeImage
                            src={game.cover}
                            alt=""
                            className="h-16 w-12 shrink-0 rounded-lg border border-white/10"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[13px] font-medium text-white">{game.title}</span>
                            <span className="mt-1 block truncate text-[10px] text-white/40">
                              {game.year} · {game.developer}
                            </span>
                          </span>
                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-white/20 transition group-hover:text-accent-soft" />
                        </button>
                      ) : null,
                    )}
                  </div>

                  <div className="mt-3 border-t border-white/[0.07] px-3 pb-2 pt-4">
                    <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">Try a genre</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {['Action', 'RPG', 'Horror', 'Open World', 'Soulslike', 'Racing'].map((label) => {
                        const genre = genres.find((item) => item.shortName === label || item.name === label)
                        if (!genre) return null
                        return (
                          <button
                            key={genre.id}
                            type="button"
                            onClick={() => {
                              setQuery(genre.name)
                              inputRef.current?.focus()
                            }}
                            className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] text-mist-bright transition hover:border-accent/40 hover:text-white"
                          >
                            {genre.shortName}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              ) : flatResults.length ? (
                <div>
                  {results.games.length ? (
                    <ResultGroup label="Games">
                      {results.games.map((item, index) => (
                        <ResultRow
                          key={item.id}
                          item={item}
                          query={query}
                          active={activeIndex === index}
                          onHover={() => setActiveIndex(index)}
                          onSelect={() => {
                            navigate(item.href)
                            onClose()
                          }}
                        />
                      ))}
                    </ResultGroup>
                  ) : null}

                  {results.genres.length ? (
                    <ResultGroup label="Genres">
                      {results.genres.map((item, index) => {
                        const flatIndex = results.games.length + index
                        return (
                          <ResultRow
                            key={item.id}
                            item={item}
                            query={query}
                            active={activeIndex === flatIndex}
                            onHover={() => setActiveIndex(flatIndex)}
                            onSelect={() => {
                              navigate(item.href)
                              onClose()
                            }}
                          />
                        )
                      })}
                    </ResultGroup>
                  ) : null}

                  {results.studios.length ? (
                    <ResultGroup label="Studios">
                      {results.studios.map((item, index) => {
                        const flatIndex = results.games.length + results.genres.length + index
                        return (
                          <ResultRow
                            key={item.id}
                            item={item}
                            query={query}
                            active={activeIndex === flatIndex}
                            onHover={() => setActiveIndex(flatIndex)}
                            onSelect={() => {
                              navigate(item.href)
                              onClose()
                            }}
                          />
                        )
                      })}
                    </ResultGroup>
                  ) : null}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
                    <SearchX className="h-6 w-6 text-mist" strokeWidth={1.35} />
                  </span>
                  <p className="mt-5 font-display text-xl font-medium tracking-[-0.03em] text-white">No matches yet</p>
                  <p className="mt-2 max-w-xs text-[12px] leading-relaxed text-mist">
                    Nothing matches “{query.trim()}”. Try a title, a studio like “Remedy”, or a genre like “RPG”.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      navigate(`/discover?q=${encodeURIComponent(query.trim())}`)
                      onClose()
                    }}
                    className="mt-6 rounded-full border border-white/14 bg-white/[0.04] px-4 py-2 text-[11px] text-white transition hover:bg-white/[0.09]"
                  >
                    Search the full archive anyway
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-3 sm:px-6">
              <div className="flex items-center gap-4 font-mono text-[8px] uppercase tracking-[0.12em] text-white/30">
                <span className="hidden items-center gap-1.5 sm:flex">
                  <span className="rounded border border-white/10 px-1 py-0.5">↑</span>
                  <span className="rounded border border-white/10 px-1 py-0.5">↓</span>
                  Navigate
                </span>
                <span className="hidden items-center gap-1.5 sm:flex">
                  <CornerDownLeft className="h-3 w-3" />
                  Open
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="rounded border border-white/10 px-1 py-0.5">Esc</span>
                  Close
                </span>
              </div>
              <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/20">
                {flatResults.length} {flatResults.length === 1 ? 'match' : 'matches'}
              </span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}

function ResultGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-1.5">
      <p className="px-3 pb-1.5 pt-2 font-mono text-[8px] uppercase tracking-[0.2em] text-white/35">{label}</p>
      <div>{children}</div>
    </div>
  )
}

function ResultRow({
  item,
  query,
  active,
  onHover,
  onSelect,
}: {
  item: ResultItem
  query: string
  active: boolean
  onHover: () => void
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      id={item.id}
      role="option"
      aria-selected={active}
      onMouseEnter={onHover}
      onFocus={onHover}
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-3 rounded-xl border px-2.5 py-2 text-left transition',
        active ? 'border-white/12 bg-white/[0.06]' : 'border-transparent hover:bg-white/[0.03]',
      )}
    >
      {item.kind === 'game' ? (
        <SafeImage src={item.image ?? ''} alt="" className="h-14 w-11 shrink-0 rounded-lg border border-white/10" />
      ) : item.kind === 'genre' ? (
        <SafeImage src={item.image ?? ''} alt="" className="h-14 w-11 shrink-0 rounded-lg border border-white/10" />
      ) : (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] font-mono text-[10px] tracking-[0.08em] text-accent-soft">
          {initials(item.title)}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13px] font-medium text-white">
          <Highlight text={item.title} query={query} />
        </span>
        <span className="mt-0.5 block truncate text-[10px] capitalize text-white/40">
          <Highlight text={item.meta} query={query} />
        </span>
        {item.platforms ? (
          <span className="mt-1 hidden sm:block">
            <PlatformList platforms={item.platforms} limit={4} compact />
          </span>
        ) : null}
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/25">
          {item.kind === 'game' ? 'Dossier' : item.kind === 'genre' ? 'Genre' : 'Filter'}
        </span>
        <ArrowUpRight className="h-3.5 w-3.5 text-white/30" />
      </span>
    </button>
  )
}
