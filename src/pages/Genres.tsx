import { useEffect, useRef, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Compass, Layers3, Sparkles } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { GenreIcon } from '@/components/GenreIcon'
import { PageIntro } from '@/components/PageIntro'
import { SafeImage } from '@/components/SafeImage'
import { ScoreBadge } from '@/components/ScoreBadge'
import { gameBySlug, games } from '@/data/games'
import { genreById, genres } from '@/data/genres'
import type { GenreId } from '@/data/types'
import { useSEO } from '@/hooks/useSEO'
import { EASE } from '@/lib/motion'
import { cn } from '@/lib/utils'

export function Genres() {
  const [searchParams, setSearchParams] = useSearchParams()
  const tabListRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const requested = searchParams.get('genre')
  const selected = requested && genreById[requested as GenreId] ? genreById[requested as GenreId] : genres[0]

  useEffect(() => {
    const list = tabListRef.current
    const tab = tabRefs.current[genres.findIndex((genre) => genre.id === selected.id)]
    if (!list || !tab) return

    const listRect = list.getBoundingClientRect()
    const tabRect = tab.getBoundingClientRect()
    const padding = 12

    if (tabRect.top < listRect.top) list.scrollTop -= listRect.top - tabRect.top + padding
    if (tabRect.bottom > listRect.bottom) list.scrollTop += tabRect.bottom - listRect.bottom + padding
    if (tabRect.left < listRect.left) list.scrollLeft -= listRect.left - tabRect.left + padding
    if (tabRect.right > listRect.right) list.scrollLeft += tabRect.right - listRect.right + padding
  }, [selected.id])

  useSEO({
    title: `${selected.name} and More — Genre Atlas | GAMEVERSE`,
    description:
      'A plain-language guide to 16 game genres: what each one means, how it plays, the mechanics that define it, and the dossiers worth starting with.',
    image: selected.image,
  })

  const selectGenre = (id: GenreId) => {
    setSearchParams({ genre: id }, { replace: true })
  }

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End']
    if (!keys.includes(event.key)) return
    event.preventDefault()
    let next = index
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % genres.length
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + genres.length) % genres.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = genres.length - 1
    selectGenre(genres[next].id)
    tabRefs.current[next]?.focus()
  }

  const recommended = Array.from(
    new Set([
      ...selected.recommended.map((slug) => gameBySlug[slug]).filter(Boolean).map((game) => game.slug),
      ...games.filter((game) => game.genres.includes(selected.id)).map((game) => game.slug),
    ]),
  )
    .map((slug) => gameBySlug[slug])
    .filter(Boolean)
    .slice(0, 3)

  return (
    <>
      <PageIntro
        eyebrow="Genre atlas"
        breadcrumb="Genres"
        title="Learn the *language*."
        description="A genre is a set of promises: how you move, how you fight, how the world responds. These sixteen guides explain the mechanics beneath the labels — and point to dossiers that put them to work."
        image="/media/gallery/baldurs-gate-3-1.webp"
        imageAlt="Baldur's Gate 3 fantasy landscape"
        meta={[
          { label: 'Genres', value: '16' },
          { label: 'Mechanics mapped', value: '96' },
          { label: 'Dossiers linked', value: '28' },
          { label: 'Updated', value: '2026' },
        ]}
        actions={
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.14em] text-white/45">
            <Sparkles className="h-3.5 w-3.5 text-accent-soft" />
            Genres overlap — that is the point
          </span>
        }
      />

      <section className="py-12 sm:py-16">
        <div className="shell">
          <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-8">
            <div
              ref={tabListRef}
              className="hide-scrollbar flex gap-2 overflow-x-auto pb-1 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:flex-col lg:self-start lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0 lg:pr-1"
              role="tablist"
              aria-label="Game genres"
              aria-orientation="vertical"
            >
              {genres.map((genre, index) => {
                const active = genre.id === selected.id
                return (
                  <button
                    key={genre.id}
                    ref={(element) => {
                      tabRefs.current[index] = element
                    }}
                    type="button"
                    role="tab"
                    id={`genre-tab-${genre.id}`}
                    aria-selected={active}
                    aria-controls={`genre-panel-${genre.id}`}
                    tabIndex={active ? 0 : -1}
                    onClick={() => selectGenre(genre.id)}
                    onKeyDown={(event) => handleTabKeyDown(event, index)}
                    className={cn(
                      'group flex shrink-0 items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all duration-300 lg:w-full lg:px-4',
                      active
                        ? 'border-white/15 bg-white/[0.065]'
                        : 'border-white/[0.06] bg-white/[0.015] hover:border-white/12 hover:bg-white/[0.04]',
                    )}
                  >
                    <span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition',
                        active ? 'border-white/15 bg-white/[0.08]' : 'border-white/[0.08] bg-black/20',
                      )}
                      style={active ? { color: genre.accent } : undefined}
                    >
                      <GenreIcon name={genre.icon} className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0">
                      <span className={cn('block truncate text-[12px] font-medium', active ? 'text-white' : 'text-mist-bright')}>
                        {genre.shortName}
                      </span>
                      <span className="mt-0.5 hidden font-mono text-[7px] uppercase tracking-[0.16em] text-white/25 lg:block">
                        {String(index + 1).padStart(2, '0')} · {genre.tagline}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>

            <div
              role="tabpanel"
              id={`genre-panel-${selected.id}`}
              aria-labelledby={`genre-tab-${selected.id}`}
              className="min-w-0 overflow-hidden rounded-[1.6rem] border border-white/[0.09] bg-[#0d0f16]"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.38, ease: EASE }}
                >
                  <div className="relative aspect-[21/10] min-h-[240px] overflow-hidden sm:aspect-[21/8]">
                    <SafeImage
                      src={selected.image}
                      alt={`${selected.name} genre artwork`}
                      priority
                      className="absolute inset-0 h-full w-full"
                      imgClassName="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f16] via-[#0d0f16]/30 to-black/20" />
                    <div
                      className="absolute inset-0 opacity-35 mix-blend-color"
                      style={{ background: `linear-gradient(130deg, transparent 35%, ${selected.accent}66 100%)` }}
                    />
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 sm:p-7">
                      <span className="rounded-full border border-white/12 bg-black/35 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/55 backdrop-blur-md">
                        Genre {String(genres.findIndex((genre) => genre.id === selected.id) + 1).padStart(2, '0')}
                      </span>
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/35 backdrop-blur-md"
                        style={{ color: selected.accent }}
                      >
                        <GenreIcon name={selected.icon} className="h-4 w-4" />
                      </span>
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                      <p className="font-mono text-[8px] uppercase tracking-[0.18em]" style={{ color: selected.accent }}>
                        {selected.tagline}
                      </p>
                      <h2 className="mt-2 font-display text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-white">
                        {selected.name}
                      </h2>
                    </div>
                  </div>

                  <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[1.35fr_0.9fr] lg:p-9">
                    <div>
                      <div className="flex items-center gap-3">
                        <Layers3 className="h-3.5 w-3.5" style={{ color: selected.accent }} />
                        <p className="eyebrow">What it means</p>
                      </div>
                      <p className="mt-4 text-[13.5px] leading-[1.8] text-mist-bright">{selected.meaning}</p>
                      <div className="mt-7 flex items-center gap-3">
                        <Compass className="h-3.5 w-3.5" style={{ color: selected.accent }} />
                        <p className="eyebrow">How it plays</p>
                      </div>
                      <p className="mt-4 text-[12.5px] leading-[1.8] text-mist">{selected.gameplay}</p>

                      <div className="mt-8">
                        <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">Signature mechanics</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {selected.mechanics.map((mechanic) => (
                            <span
                              key={mechanic}
                              className="rounded-full border border-white/[0.09] bg-white/[0.03] px-3 py-1.5 text-[10px] text-white/55"
                            >
                              {mechanic}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <aside className="space-y-6">
                      <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-5">
                        <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">Why it feels different</p>
                        <ul className="mt-4 space-y-3">
                          {selected.unique.map((item) => (
                            <li key={item} className="flex items-start gap-2.5 text-[11.5px] leading-relaxed text-mist">
                              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full" style={{ background: selected.accent }} />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">Reference points</p>
                        <ul className="mt-3 space-y-2">
                          {selected.examples.map((example) => (
                            <li key={example} className="flex items-center justify-between gap-3 border-b border-white/[0.06] pb-2 text-[11px] text-white/50 last:border-0">
                              {example}
                              <span className="font-mono text-[8px] text-white/20">ref</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </aside>
                  </div>

                  <div className="border-t border-white/[0.08] p-5 sm:p-7 lg:p-9">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <p className="eyebrow">Recommended dossiers</p>
                        <h3 className="mt-2 font-display text-xl font-medium tracking-[-0.035em] text-white">
                          Start with these
                        </h3>
                      </div>
                      <Link
                        to={`/discover?genre=${selected.id}`}
                        className="inline-flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-white/40 transition hover:text-white"
                      >
                        All {selected.shortName} titles
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                      {recommended.map((game) => (
                        <Link
                          key={game.slug}
                          to={`/games/${game.slug}`}
                          className="group flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-2.5 transition hover:border-white/20 hover:bg-white/[0.05]"
                        >
                          <SafeImage
                            src={game.cover}
                            alt={`${game.title} cover`}
                            title={game.title}
                            className="h-[76px] w-[58px] shrink-0 rounded-lg border border-white/10"
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[12px] font-medium text-white">{game.title}</span>
                            <span className="mt-1 block truncate font-mono text-[8px] uppercase tracking-[0.12em] text-white/30">
                              {game.year} · {game.developer}
                            </span>
                            <span className="mt-2 block">
                              <ScoreBadge score={game.score} compact />
                            </span>
                          </span>
                          <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-white/25 transition group-hover:text-white" />
                        </Link>
                      ))}
                    </div>

                    {recommended.length === 0 ? (
                      <p className="mt-5 text-[11px] text-white/35">
                        No dossier in this archive is tagged with this genre yet.
                      </p>
                    ) : null}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-[10px] leading-relaxed text-white/30">
              Genre labels are editorial shorthand. Many games belong to several traditions at once — the
              dossier’s primary genre is simply the strongest organising idea, not the only one.
            </p>
            <Link
              to="/discover"
              className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-white/40 transition hover:text-white"
            >
              Browse the archive
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="shell">
          <div className="rounded-[1.5rem] border border-white/[0.08] bg-[#0b0d13] p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="eyebrow text-accent-soft/70">Cross-training</p>
                <h2 className="mt-3 font-display text-[clamp(1.6rem,3vw,2.3rem)] font-medium tracking-[-0.04em] text-white">
                  The best games steal from <span className="serif-accent text-white/50">other genres</span>.
                </h2>
                <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-mist">
                  A Soulslike with stealth. A shooter with RPG builds. A racing game with open-world
                  exploration. Follow the mechanics, not just the shelf label.
                </p>
              </div>
              <Link
                to="/discover?sort=year"
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/14 bg-white/[0.04] px-5 py-3 text-[12px] text-white transition hover:border-white/25 hover:bg-white/[0.08]"
              >
                Newest additions
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
