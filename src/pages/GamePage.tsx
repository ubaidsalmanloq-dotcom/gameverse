import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
  Building2,
  Calendar,
  ChevronDown,
  Cpu,
  Expand,
  Eye,
  EyeOff,
  Gamepad2,
  HardDrive,
  Monitor,
  Sparkles,
  Tag,
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { ButtonLink } from '@/components/ButtonLink'
import { GameCard } from '@/components/GameCard'
import { Lightbox } from '@/components/Lightbox'
import { PlatformList } from '@/components/PlatformBadge'
import { Reveal, WordsReveal } from '@/components/Reveal'
import { SafeImage } from '@/components/SafeImage'
import { ScoreBadge } from '@/components/ScoreBadge'
import { games, getGame, getSimilarGames } from '@/data/games'
import { genreById } from '@/data/genres'
import { useSEO } from '@/hooks/useSEO'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { cn, formatScore } from '@/lib/utils'
import { NotFound } from './NotFound'

const dossierSections = [
  { id: 'overview', label: 'Overview' },
  { id: 'story', label: 'Story' },
  { id: 'gameplay', label: 'Gameplay' },
  { id: 'features', label: 'Features' },
  { id: 'technology', label: 'Technology' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'similar', label: 'Similar' },
]

const sectionIds = dossierSections.map((section) => section.id)

function DossierHeading({
  index,
  eyebrow,
  title,
  description,
}: {
  index: string
  eyebrow: string
  title: string
  description?: string
}) {
  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[9px] tracking-[0.18em] text-white/25">{index}</span>
        <span className="h-px w-8 bg-white/15" />
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <h2 className="display mt-4 text-[clamp(2rem,4.2vw,3.7rem)] text-white">
        <WordsReveal text={title} />
      </h2>
      {description ? <p className="mt-4 max-w-2xl text-[12.5px] leading-relaxed text-mist">{description}</p> : null}
    </div>
  )
}

function useSavedGame(slug: string | undefined) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!slug) return
    try {
      const stored = window.localStorage.getItem('gameverse:collection')
      const parsed: unknown = stored ? JSON.parse(stored) : []
      setSaved(Array.isArray(parsed) && parsed.includes(slug))
    } catch {
      setSaved(false)
    }
  }, [slug])

  const toggle = () => {
    if (!slug) return
    setSaved((current) => {
      const next = !current
      try {
        const stored = window.localStorage.getItem('gameverse:collection')
        const parsed: unknown = stored ? JSON.parse(stored) : []
        const list = Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
        const updated = next ? Array.from(new Set([...list, slug])) : list.filter((item) => item !== slug)
        window.localStorage.setItem('gameverse:collection', JSON.stringify(updated))
      } catch {
        // Saving still works for this session even if local storage is blocked.
      }
      return next
    })
  }

  return { saved, toggle }
}

export function GamePage() {
  const { slug } = useParams<{ slug: string }>()
  const game = getGame(slug)
  const activeSection = useScrollSpy(sectionIds, 160)
  const { saved, toggle } = useSavedGame(slug)
  const [spoilerOpen, setSpoilerOpen] = useState(false)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)

  useSEO({
    title: game ? `${game.title} — GAMEVERSE Dossier` : 'Game Not Found — GAMEVERSE',
    description: game
      ? `${game.shortDescription} Read the GAMEVERSE dossier: story, gameplay, features, technology, and platform context.`
      : 'The requested game dossier could not be found in the GAMEVERSE archive.',
    image: game?.hero,
  })

  useEffect(() => {
    if (!game) return
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'VideoGame',
      name: game.title,
      description: game.shortDescription,
      image: `${window.location.origin}${game.hero}`,
      url: window.location.href,
      genre: game.genres.map((id) => genreById[id]?.name).filter(Boolean),
      gamePlatform: game.platforms,
      publisher: { '@type': 'Organization', name: game.publisher },
      author: { '@type': 'Organization', name: game.developer },
      applicationCategory: 'Game',
    }
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'gameverse-game-schema'
    script.text = JSON.stringify(schema)
    document.head.appendChild(script)
    return () => {
      document.getElementById('gameverse-game-schema')?.remove()
    }
  }, [game])

  useEffect(() => {
    setSpoilerOpen(false)
    setGalleryOpen(false)
    setGalleryIndex(0)
  }, [slug])

  if (!game) {
    return <NotFound />
  }

  const similar = getSimilarGames(game, 3)
  const gameIndex = games.findIndex((entry) => entry.slug === game.slug)
  const previousGame = gameIndex > 0 ? games[gameIndex - 1] : null
  const nextGame = gameIndex >= 0 && gameIndex < games.length - 1 ? games[gameIndex + 1] : null
  const primaryGenre = genreById[game.primaryGenre]
  const gallery = game.gallery ?? []

  return (
    <>
      <section className="relative flex min-h-[94svh] flex-col overflow-hidden pb-8 pt-[72px]">
        <div className="absolute inset-0 -z-10">
          <SafeImage
            src={game.hero}
            alt={`${game.title} artwork`}
            title={game.title}
            priority
            className="absolute inset-0 h-full w-full"
            imgClassName="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,9,13,0.97)_0%,rgba(8,9,13,0.78)_42%,rgba(8,9,13,0.2)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,#08090d_0%,rgba(8,9,13,0.82)_18%,rgba(8,9,13,0.05)_60%,rgba(8,9,13,0.55)_100%)]" />
          <div className="absolute inset-0 bg-grid opacity-[0.12] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]" />
          <div
            className="absolute -left-40 top-1/3 h-[32rem] w-[32rem] rounded-full opacity-20 blur-[120px]"
            style={{ background: game.accent }}
          />
        </div>

        <div className="shell flex flex-1 flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3 pt-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.16em] text-white/35">
              <Link to="/" className="transition hover:text-white/70">Home</Link>
              <span className="text-white/15">/</span>
              <Link to="/discover" className="transition hover:text-white/70">Discover</Link>
              <span className="text-white/15">/</span>
              <span className="max-w-[180px] truncate text-white/60">{game.title}</span>
            </nav>
            <div className="flex items-center gap-2">
              {game.aaa ? (
                <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-accent-soft backdrop-blur-md">
                  AAA dossier
                </span>
              ) : null}
              <span className="rounded-full border border-white/12 bg-black/30 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-white/50 backdrop-blur-md">
                {game.year}
              </span>
            </div>
          </div>

          <div className="grid flex-1 items-end gap-10 pb-6 pt-16 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-16 lg:pt-20">
            <div className="max-w-5xl">
              <Reveal y={18}>
                <div className="flex flex-wrap items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.16em] text-white/45">
                  <span>{primaryGenre?.name ?? 'Game'}</span>
                  <span className="h-1 w-1 rounded-full bg-accent-soft/70" />
                  <span>{game.developer}</span>
                  <span className="h-1 w-1 rounded-full bg-white/20" />
                  <span>{game.releaseDate}</span>
                </div>
              </Reveal>

              <h1 className="display mt-5 text-[clamp(2.8rem,7.5vw,6.6rem)] font-semibold text-white">
                <WordsReveal text={game.title} />
              </h1>

              <Reveal delay={0.1}>
                <p className="mt-5 max-w-2xl font-serif text-[clamp(1.25rem,2.4vw,1.9rem)] italic leading-snug tracking-[-0.02em] text-white/55">
                  {game.tagline}
                </p>
              </Reveal>

              <Reveal delay={0.18}>
                <div className="mt-7 flex flex-wrap items-center gap-2.5">
                  <PlatformList platforms={game.platforms} limit={6} />
                  <span className="h-4 w-px bg-white/12" />
                  {game.modes.map((mode) => (
                    <span key={mode} className="rounded-full border border-white/10 bg-white/[0.035] px-2.5 py-1 text-[9px] text-white/50">
                      {mode}
                    </span>
                  ))}
                </div>
              </Reveal>

              <Reveal delay={0.25}>
                <div className="mt-9 flex flex-wrap items-center gap-3">
                  <a
                    href="#overview"
                    className="inline-flex items-center gap-2 rounded-full bg-[#f4f1ea] px-5 py-3 text-[12px] font-medium text-[#0a0a0f] transition hover:bg-accent-soft"
                  >
                    Read the dossier
                    <ChevronDown className="h-4 w-4" />
                  </a>
                  <button
                    type="button"
                    onClick={toggle}
                    aria-pressed={saved}
                    className={cn(
                      'inline-flex items-center gap-2 rounded-full border px-5 py-3 text-[12px] font-medium transition',
                      saved
                        ? 'border-accent/40 bg-accent/[0.1] text-accent-soft'
                        : 'border-white/14 bg-white/[0.04] text-white hover:border-white/25 hover:bg-white/[0.08]',
                    )}
                  >
                    {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                    {saved ? 'In your collection' : 'Save dossier'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGalleryIndex(0)
                      setGalleryOpen(true)
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/20 px-5 py-3 text-[12px] text-white/75 backdrop-blur-md transition hover:border-white/25 hover:text-white"
                  >
                    <Expand className="h-3.5 w-3.5" />
                    View gallery
                  </button>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.2} className="hidden lg:block">
              <div className="rounded-2xl border border-white/12 bg-black/30 p-5 backdrop-blur-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/35">GV editorial score</p>
                    <p className="mt-2 font-display text-6xl font-semibold tracking-[-0.06em] text-white">
                      {formatScore(game.score)}
                    </p>
                  </div>
                  <span className="font-mono text-[9px] tracking-[0.12em] text-white/30">/ 10</span>
                </div>
                <p className="mt-3 text-[9.5px] leading-relaxed text-white/35">
                  GAMEVERSE assessment — not a review aggregate. Read the dossier for context.
                </p>
                <div className="mt-5 border-t border-white/10 pt-4">
                  <dl className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <dt className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/30">Publisher</dt>
                      <dd className="text-right text-[10px] text-white/65">{game.publisher}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <dt className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/30">Engine</dt>
                      <dd className="text-right text-[10px] text-white/65">{game.engine}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <dt className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/30">Storage</dt>
                      <dd className="text-right text-[10px] text-white/65">{game.storage}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#08090d] to-transparent" />
      </section>

      <nav
        aria-label="Dossier sections"
        className="sticky top-[72px] z-30 border-y border-white/[0.08] bg-[#08090d]/90 backdrop-blur-xl"
      >
        <div className="shell flex items-center justify-between gap-4">
          <div className="hide-scrollbar flex flex-1 items-center gap-1 overflow-x-auto py-1">
            {dossierSections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                aria-current={activeSection === section.id ? 'true' : undefined}
                className={cn(
                  'relative shrink-0 px-3 py-4 font-mono text-[8px] uppercase tracking-[0.16em] transition',
                  activeSection === section.id ? 'text-white' : 'text-white/35 hover:text-white/75',
                )}
              >
                {section.label}
                <span
                  className={cn(
                    'absolute inset-x-3 bottom-0 h-px origin-left bg-accent-soft transition-transform duration-300',
                    activeSection === section.id ? 'scale-x-100' : 'scale-x-0',
                  )}
                />
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={toggle}
            aria-pressed={saved}
            className="hidden shrink-0 items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-white/40 transition hover:text-white sm:flex"
          >
            {saved ? <BookmarkCheck className="h-3.5 w-3.5 text-accent-soft" /> : <Bookmark className="h-3.5 w-3.5" />}
            {saved ? 'Saved' : 'Save'}
          </button>
          <span className="hidden font-mono text-[8px] tracking-[0.14em] text-white/20 md:block">
            {String(gameIndex + 1).padStart(2, '0')} / {String(games.length).padStart(2, '0')}
          </span>
        </div>
      </nav>

      <section id="overview" className="scroll-mt-36 py-16 sm:py-20">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_310px] lg:gap-16">
            <div>
              <DossierHeading
                index="01"
                eyebrow="Overview"
                title="The big *picture*."
                description="What the game is, what it is trying to do, and why it belongs in the archive."
              />
              <div className="mt-7 space-y-5 text-[13.5px] leading-[1.85] text-mist">
                <p className="text-[15px] leading-[1.8] text-mist-bright">{game.shortDescription}</p>
                <p>{game.overview}</p>
              </div>

              <div className="mt-9 flex flex-wrap gap-2">
                {game.genres.map((id) => {
                  const genre = genreById[id]
                  if (!genre) return null
                  return (
                    <Link
                      key={id}
                      to={`/genres?genre=${id}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.09] bg-white/[0.025] px-3 py-1.5 text-[10px] text-white/50 transition hover:border-accent/35 hover:text-white"
                    >
                      <Tag className="h-3 w-3" />
                      {genre.name}
                    </Link>
                  )
                })}
              </div>
            </div>

            <aside className="lg:sticky lg:top-[150px] lg:self-start">
              <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e14] p-5 sm:p-6">
                <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">At a glance</p>
                <dl className="mt-5 space-y-4">
                  <MetaRow icon={Calendar} label="Release" value={`${game.releaseDate}`} />
                  <MetaRow icon={Building2} label="Developer" value={game.developer} />
                  <MetaRow icon={Sparkles} label="Publisher" value={game.publisher} />
                  <MetaRow icon={Gamepad2} label="Modes" value={game.modes.join(' · ')} />
                  <MetaRow icon={Cpu} label="Engine" value={game.engine} />
                  <MetaRow icon={HardDrive} label="Storage" value={game.storage} />
                  <MetaRow icon={Monitor} label="Platforms" value={game.platforms.join(' · ')} />
                </dl>
                {game.platformNote ? (
                  <p className="mt-5 border-t border-white/[0.07] pt-4 text-[9.5px] leading-relaxed text-white/30">
                    {game.platformNote}
                  </p>
                ) : null}
                <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
                  <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/30">GV score</span>
                  <ScoreBadge score={game.score} compact />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section id="story" className="scroll-mt-36 border-t border-white/[0.06] bg-[#0a0b10] py-16 sm:py-20">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <DossierHeading
              index="02"
              eyebrow="Story & world"
              title="The premise, *unspoiled*."
            />
            <div>
              <p className="text-[13.5px] leading-[1.9] text-mist-bright">{game.story}</p>
              {game.spoiler ? (
                <div className="mt-7 rounded-xl border border-white/[0.09] bg-white/[0.025]">
                  <button
                    type="button"
                    onClick={() => setSpoilerOpen((open) => !open)}
                    aria-expanded={spoilerOpen}
                    aria-controls="spoiler-note"
                    className="flex w-full items-center justify-between gap-4 p-4 text-left"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/25 text-accent-soft/80">
                        {spoilerOpen ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </span>
                      <span>
                        <span className="block text-[11px] font-medium text-white">Spoiler-sensitive note</span>
                        <span className="mt-0.5 block font-mono text-[7.5px] uppercase tracking-[0.14em] text-white/30">
                          {spoilerOpen ? 'Visible — click to hide' : 'Hidden by default'}
                        </span>
                      </span>
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 shrink-0 text-white/30 transition-transform duration-300',
                        spoilerOpen ? 'rotate-180' : '',
                      )}
                    />
                  </button>
                  <div id="spoiler-note" hidden={!spoilerOpen} className="px-4 pb-4">
                    <p className="rounded-lg border border-white/[0.06] bg-black/25 p-3.5 text-[11px] leading-relaxed text-white/50">
                      {game.spoiler}
                    </p>
                  </div>
                </div>
              ) : null}
              <p className="mt-5 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.14em] text-white/25">
                <EyeOff className="h-3 w-3" />
                Story sections are written to preserve late-game turns.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="gameplay" className="scroll-mt-36 py-16 sm:py-20">
        <div className="shell">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <DossierHeading
              index="03"
              eyebrow="Gameplay"
              title="The verbs that *matter*."
              description="A dossier-level breakdown of the loops and systems that structure play."
            />
            <span className="shrink-0 font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">
              {game.gameplay.length} pillars
            </span>
          </div>
          <div className="mt-9 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-3">
            {game.gameplay.map((pillar, index) => (
              <div key={pillar.title} className="group bg-[#0b0d13] p-5 transition hover:bg-[#0e1019] sm:p-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[8px] tracking-[0.16em] text-white/25">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-accent-soft/60" />
                </div>
                <h3 className="mt-6 font-display text-lg font-medium tracking-[-0.03em] text-white">{pillar.title}</h3>
                <p className="mt-2 text-[11.5px] leading-relaxed text-mist">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-36 border-y border-white/[0.06] bg-[#0a0b10] py-16 sm:py-20">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <DossierHeading
              index="04"
              eyebrow="Signature features"
              title="What sets it *apart*."
              description="The design decisions that define the experience — from structure to feel."
            />
            <div>
              {game.features.map((feature, index) => (
                <Reveal key={feature.title} delay={index * 0.04}>
                  <div className="grid gap-3 border-b border-white/[0.08] py-5 first:pt-0 sm:grid-cols-[42px_1fr] sm:gap-5">
                    <span className="font-mono text-[9px] tracking-[0.16em] text-white/25">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="text-[13px] font-medium text-white">{feature.title}</h3>
                      <p className="mt-1.5 max-w-xl text-[11.5px] leading-relaxed text-mist">{feature.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="technology" className="scroll-mt-36 py-16 sm:py-20">
        <div className="shell">
          <DossierHeading
            index="05"
            eyebrow="Technology"
            title="Under the *frame*."
            description="The engine, the footprint, and the public PC targets. Requirements are approximate and can change with updates."
          />

          <div className="mt-9 grid gap-4 sm:grid-cols-3">
            <TechFact icon={Cpu} label="Engine" value={game.engine} note="As publicly identified; some studios use proprietary or hybrid tech." />
            <TechFact icon={HardDrive} label="Install footprint" value={game.storage} note="Approximate published storage; expansions and patches can add more." />
            <TechFact icon={Monitor} label="Platforms" value={`${game.platforms.length} listed`} note={game.platformNote ?? 'Availability can vary by region, storefront, and version.'} />
          </div>

          {game.requirements ? (
            <div className="mt-8">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">PC requirements</p>
                <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/20">Public listing · approximate</p>
              </div>
              <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
                <table className="w-full min-w-[640px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-white/[0.08] bg-white/[0.03]">
                      <th scope="col" className="w-[120px] px-4 py-3 font-mono text-[8px] font-normal uppercase tracking-[0.14em] text-white/30">
                        Component
                      </th>
                      <th scope="col" className="px-4 py-3 font-mono text-[8px] font-normal uppercase tracking-[0.14em] text-white/30">
                        Minimum
                      </th>
                      <th scope="col" className="px-4 py-3 font-mono text-[8px] font-normal uppercase tracking-[0.14em] text-white/30">
                        Recommended
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['OS', game.requirements.minimum.os, game.requirements.recommended.os],
                      ['CPU', game.requirements.minimum.cpu, game.requirements.recommended.cpu],
                      ['GPU', game.requirements.minimum.gpu, game.requirements.recommended.gpu],
                      ['Memory', game.requirements.minimum.ram, game.requirements.recommended.ram],
                      ['Storage', game.requirements.minimum.storage, game.requirements.recommended.storage],
                    ].map(([label, minimum, recommended]) => (
                      <tr key={label} className="border-b border-white/[0.05] last:border-0">
                        <th scope="row" className="px-4 py-3 text-[10px] font-medium text-white/60">{label}</th>
                        <td className="px-4 py-3 text-[10.5px] leading-relaxed text-mist">{minimum}</td>
                        <td className="px-4 py-3 text-[10.5px] leading-relaxed text-mist">{recommended}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[9.5px] leading-relaxed text-white/25">
                Sources: public publisher/storefront listings. A “minimum” label does not guarantee a specific
                resolution or frame rate; check the current listing before installing.
              </p>
            </div>
          ) : (
            <p className="mt-8 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-[11px] text-mist">
              No public PC requirement listing is available for this entry. Check the storefront for current
              details.
            </p>
          )}
        </div>
      </section>

      <section id="gallery" className="scroll-mt-36 border-y border-white/[0.06] bg-[#0a0b10] py-16 sm:py-20">
        <div className="shell">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <DossierHeading
              index="06"
              eyebrow="Gallery"
              title="The world, *framed*."
              description="Publisher-provided artwork and in-game captures. Select an image to open the full-screen viewer."
            />
            <span className="shrink-0 font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">
              {gallery.length} frames
            </span>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {gallery.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => {
                  setGalleryIndex(index)
                  setGalleryOpen(true)
                }}
                aria-label={`Open ${game.title} gallery image ${index + 1}`}
                className={cn(
                  'group relative overflow-hidden rounded-xl border border-white/[0.08] bg-panel text-left transition hover:border-white/25',
                  index === 0 ? 'col-span-2 row-span-2 aspect-square sm:aspect-[4/3] lg:aspect-auto' : 'aspect-[4/3]',
                )}
              >
                <SafeImage
                  src={image}
                  alt={`${game.title} gallery image ${index + 1}`}
                  title={game.title}
                  sizes={index === 0 ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 1024px) 50vw, 25vw'}
                  className="absolute inset-0 h-full w-full"
                  imgClassName="transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition group-hover:opacity-80" />
                <span className="absolute bottom-3 left-3 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.14em] text-white/70">
                  Frame {String(index + 1).padStart(2, '0')}
                </span>
                <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white opacity-0 backdrop-blur-md transition group-hover:opacity-100">
                  <Expand className="h-3.5 w-3.5" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="similar" className="scroll-mt-36 py-16 sm:py-20">
        <div className="shell">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <DossierHeading
              index="07"
              eyebrow="Similar worlds"
              title="Keep *exploring*."
              description="Dossiers with shared DNA — mechanically, tonally, or both."
            />
            <ButtonLink to="/discover" variant="secondary" size="sm" className="shrink-0">
              Full archive
            </ButtonLink>
          </div>

          <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {similar.map((similarGame, index) => (
              <GameCard key={similarGame.slug} game={similarGame} index={index} />
            ))}
          </div>

          <div className="mt-14 grid gap-3 border-t border-white/[0.08] pt-8 sm:grid-cols-2">
            {previousGame ? (
              <Link
                to={`/games/${previousGame.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                <SafeImage
                  src={previousGame.hero}
                  alt=""
                  title={previousGame.title}
                  className="h-[68px] w-[100px] shrink-0 rounded-lg border border-white/10"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5 font-mono text-[7.5px] uppercase tracking-[0.14em] text-white/30">
                    <ArrowLeft className="h-3 w-3" />
                    Previous dossier
                  </span>
                  <span className="mt-1 block truncate text-[13px] font-medium text-white">{previousGame.title}</span>
                </span>
              </Link>
            ) : (
              <Link
                to="/aaa"
                className="group flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                <span className="flex h-[68px] w-[100px] shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/20">
                  <ArrowLeft className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-mono text-[7.5px] uppercase tracking-[0.14em] text-white/30">Start of the archive</span>
                  <span className="mt-1 block text-[13px] font-medium text-white">AAA collection</span>
                </span>
              </Link>
            )}

            {nextGame ? (
              <Link
                to={`/games/${nextGame.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-right transition hover:border-white/20 hover:bg-white/[0.04] sm:flex-row-reverse"
              >
                <SafeImage
                  src={nextGame.hero}
                  alt=""
                  title={nextGame.title}
                  className="h-[68px] w-[100px] shrink-0 rounded-lg border border-white/10"
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-end gap-1.5 font-mono text-[7.5px] uppercase tracking-[0.14em] text-white/30">
                    Next dossier
                    <ArrowRight className="h-3 w-3" />
                  </span>
                  <span className="mt-1 block truncate text-[13px] font-medium text-white">{nextGame.title}</span>
                </span>
              </Link>
            ) : (
              <Link
                to="/discover"
                className="group flex items-center justify-end gap-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3 text-right transition hover:border-white/20 hover:bg-white/[0.04]"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-end gap-1.5 font-mono text-[7.5px] uppercase tracking-[0.14em] text-white/30">
                    End of the archive
                    <ArrowRight className="h-3 w-3" />
                  </span>
                  <span className="mt-1 block text-[13px] font-medium text-white">Back to Discover</span>
                </span>
                <span className="flex h-[68px] w-[100px] shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/20">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </Link>
            )}
          </div>
        </div>
      </section>

      <Lightbox
        images={gallery.map((image, index) => ({
          src: image,
          alt: `${game.title} gallery image ${index + 1}`,
          caption: `${game.title} — publisher artwork / in-game capture`,
        }))}
        startIndex={galleryIndex}
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        title={game.title}
      />
    </>
  )
}

function MetaRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/30" strokeWidth={1.6} />
      <div className="min-w-0">
        <dt className="font-mono text-[7.5px] uppercase tracking-[0.14em] text-white/25">{label}</dt>
        <dd className="mt-1 text-[10.5px] leading-relaxed text-mist-bright">{value}</dd>
      </div>
    </div>
  )
}

function TechFact({
  icon: Icon,
  label,
  value,
  note,
}: {
  icon: typeof Cpu
  label: string
  value: string
  note: string
}) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#0c0e14] p-4">
      <div className="flex items-center gap-2 text-white/30">
        <Icon className="h-3.5 w-3.5" strokeWidth={1.6} />
        <span className="font-mono text-[7.5px] uppercase tracking-[0.14em]">{label}</span>
      </div>
      <p className="mt-3 font-display text-lg font-medium tracking-[-0.03em] text-white">{value}</p>
      <p className="mt-1.5 text-[9.5px] leading-relaxed text-white/30">{note}</p>
    </div>
  )
}
