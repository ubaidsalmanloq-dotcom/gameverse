import { ArrowUpRight, Compass, Layers3, MonitorSmartphone, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { AaaRail } from '@/components/AaaRail'
import { ButtonLink } from '@/components/ButtonLink'
import { CatalogExplorer } from '@/components/CatalogExplorer'
import { Hero } from '@/components/Hero'
import { PlatformVisual } from '@/components/PlatformVisual'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/Reveal'
import { SectionHeading } from '@/components/SectionHeading'
import { SystemsExplorer } from '@/components/SystemsExplorer'
import { genreById } from '@/data/genres'
import { platforms } from '@/data/platforms'
import { systems } from '@/data/systems'
import { useSEO } from '@/hooks/useSEO'
import type { GenreId } from '@/data/types'

const homeGenres: GenreId[] = [
  'action',
  'adventure',
  'rpg',
  'fps',
  'open-world',
  'racing',
  'sports',
  'strategy',
  'simulation',
  'horror',
  'multiplayer',
]

const featuredGenreIds: GenreId[] = ['open-world', 'rpg', 'soulslike', 'horror', 'racing', 'multiplayer']

export function Home() {
  useSEO({
    title: 'GAMEVERSE — The Cinematic Game Encyclopedia',
    description:
      'Explore 28 curated game dossiers, 16 genres, 12 systems, and 4 platforms. GAMEVERSE is an independent, context-first encyclopedia of modern games.',
    image: '/media/gallery/red-dead-redemption-2-3.webp',
  })

  return (
    <>
      <Hero />

      <section id="discover" className="relative scroll-mt-24 pb-24 pt-16 sm:pt-20">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <SectionHeading
              eyebrow="The archive"
              index="01"
              title="Find your next *world*."
              description="A working collection of modern games worth studying — filter by genre, search by studio, and open a dossier for the full picture."
            />
            <Reveal className="lg:pb-2">
              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-2 font-mono text-[8px] uppercase tracking-[0.14em] text-white/40">
                  <Layers3 className="h-3 w-3 text-accent-soft" />
                  28 dossiers
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-2 font-mono text-[8px] uppercase tracking-[0.14em] text-white/40">
                  <Sparkles className="h-3 w-3 text-accent-soft" />
                  Editorial, not aggregated
                </span>
              </div>
            </Reveal>
          </div>

          <div className="mt-10">
            <CatalogExplorer
              initialVisible={6}
              genreFilters={homeGenres}
              compactFilters
              showSearch
            />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.07] pt-5">
            <p className="max-w-2xl text-[10px] leading-relaxed text-white/30">
              GV scores are GAMEVERSE editorial assessments based on design, craft, and lasting impact —
              not review aggregates. They are a navigational aid, not a verdict.
            </p>
            <Link
              to="/discover"
              className="inline-flex shrink-0 items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-mist transition hover:text-white"
            >
              Full archive
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="relative border-y border-white/[0.07] bg-[#0a0b10] py-20 sm:py-24">
        <div className="absolute inset-0 bg-grid opacity-[0.08]" aria-hidden="true" />
        <div className="shell relative">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="AAA dossier"
              index="02"
              title="The blockbuster *canon*."
              description="High-budget games at the centre of the medium. Not because budget equals quality — because scale, craft, and risk deserve close reading."
              className="max-w-3xl"
            />
            <Reveal delay={0.1} className="shrink-0 sm:pb-2">
              <ButtonLink to="/aaa" variant="secondary" size="sm">
                All 15 dossiers
              </ButtonLink>
            </Reveal>
          </div>
          <div className="mt-10">
            <AaaRail />
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="shell">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Genre atlas"
              index="03"
              title="Learn the *language*."
              description="Genres are not boxes; they are design conversations. Start with the mechanics, the pacing, and the feeling each one chases."
              className="max-w-3xl"
            />
            <Reveal delay={0.1} className="shrink-0 sm:pb-2">
              <ButtonLink to="/genres" variant="secondary" size="sm">
                Explore all 16
              </ButtonLink>
            </Reveal>
          </div>

          <StaggerGroup className="mt-10 grid gap-4 md:grid-cols-12">
            {featuredGenreIds.map((id, index) => {
              const genre = genreById[id]
              if (!genre) return null
              const large = index < 2
              return (
                <StaggerItem
                  key={genre.id}
                  className={
                    index === 0
                      ? 'md:col-span-7 md:row-span-2'
                      : index === 1
                        ? 'md:col-span-5'
                        : index === 2
                          ? 'md:col-span-5'
                          : 'md:col-span-4'
                  }
                >
                  <Link
                    to={`/genres?genre=${genre.id}`}
                    className={`group relative flex h-full min-h-[250px] flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-panel p-6 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 ${
                      large ? 'sm:min-h-[300px]' : ''
                    } ${index === 0 ? 'md:min-h-[520px]' : ''}`}
                  >
                    <img
                      src={genre.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover opacity-35 transition-all duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 group-hover:opacity-45"
                      loading="lazy"
                      aria-hidden="true"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-[#08090d]/45 to-black/15" />
                    <div
                      className="absolute inset-0 opacity-40 mix-blend-color"
                      style={{ background: `linear-gradient(155deg, transparent 25%, ${genre.accent}55 100%)` }}
                      aria-hidden="true"
                    />

                    <div className="relative flex items-start justify-between gap-4">
                      <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/40">
                        {String(index + 1).padStart(2, '0')} / {genre.shortName}
                      </span>
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/80 transition group-hover:bg-white group-hover:text-black">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>

                    <div className="relative mt-16">
                      <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.16em]" style={{ color: genre.accent }}>
                        {genre.tagline}
                      </p>
                      <h3
                        className={`font-display font-semibold leading-[0.98] tracking-[-0.045em] text-white ${
                          index === 0 ? 'text-[clamp(2.4rem,4.5vw,4rem)]' : 'text-[clamp(1.6rem,2.6vw,2.2rem)]'
                        }`}
                      >
                        {large ? genre.name : genre.shortName}
                      </h3>
                      {index === 0 ? (
                        <>
                          <p className="mt-4 max-w-md text-[13px] leading-relaxed text-white/50">{genre.meaning}</p>
                          <div className="mt-6 flex flex-wrap gap-1.5">
                            {genre.mechanics.slice(0, 4).map((mechanic) => (
                              <span
                                key={mechanic}
                                className="rounded-full border border-white/10 bg-black/25 px-2.5 py-1 text-[9px] text-white/50 backdrop-blur-sm"
                              >
                                {mechanic}
                              </span>
                            ))}
                          </div>
                        </>
                      ) : null}
                      <span className="mt-5 inline-flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.16em] text-white/35 transition group-hover:text-white/75">
                        Break down the genre
                        <Compass className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              )
            })}
          </StaggerGroup>
        </div>
      </section>

      <section className="relative border-y border-white/[0.07] bg-[#0a0b10] py-24">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
            <SectionHeading
              eyebrow="Under the hood"
              index="04"
              title="How games actually *work*."
              description="Rendering, physics, AI, streaming, and the other machinery behind the frame. A plain-language field guide to the craft."
            />
            <Reveal className="lg:pb-2">
              <p className="text-[12px] leading-relaxed text-mist">
                Twelve systems explained from first principles — what each one does, why studios care, and
                where the trade-offs live.
              </p>
            </Reveal>
          </div>

          <div className="mt-10">
            <SystemsExplorer />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">
              {systems.length} system guides · updated for the current generation
            </span>
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-white/40 transition hover:text-white"
            >
              How we research
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="shell">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Platform index"
              index="05"
              title="Pick your *battlefield*."
              description="Every platform is a set of trade-offs. We compare the practical differences instead of crowning a universal winner."
              className="max-w-3xl"
            />
            <Reveal delay={0.1} className="shrink-0 sm:pb-2">
              <ButtonLink to="/platforms" variant="secondary" size="sm">
                Compare platforms
              </ButtonLink>
            </Reveal>
          </div>

          <StaggerGroup className="mt-10 grid gap-4 sm:grid-cols-2">
            {platforms.map((platform) => (
              <StaggerItem key={platform.id}>
                <Link
                  to={`/platforms#${platform.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-white/[0.08] bg-panel/60 p-3 transition-all duration-500 hover:-translate-y-1 hover:border-white/20"
                >
                  <PlatformVisual platform={platform} compact />
                  <div className="flex flex-1 items-start justify-between gap-5 px-3 pb-2 pt-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-2xl font-medium tracking-[-0.04em] text-white">
                          {platform.name}
                        </h3>
                        <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[7px] uppercase tracking-[0.14em] text-white/35">
                          {platform.releaseYear}
                        </span>
                      </div>
                      <p className="mt-2 max-w-md text-[12px] leading-relaxed text-mist">{platform.tagline}</p>
                      <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.14em] text-white/25">
                        Best for · {platform.bestFor}
                      </p>
                    </div>
                    <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/12 text-white/60 transition group-hover:bg-white group-hover:text-black">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <p className="mt-4 flex items-center gap-2 text-[10px] text-white/30">
            <MonitorSmartphone className="h-3.5 w-3.5" />
            Specs summarized from platform documentation and public technical disclosures. See the full
            comparison for caveats.
          </p>
        </div>
      </section>

      <section className="pb-8">
        <div className="shell">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.09] bg-[#0d0f16] px-6 py-16 sm:px-12 lg:px-20 lg:py-24">
              <div className="absolute inset-0 bg-grid opacity-[0.12] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" aria-hidden="true" />
              <div className="absolute -right-32 -top-40 h-[28rem] w-[28rem] rounded-full bg-accent/[0.11] blur-[120px]" aria-hidden="true" />
              <div className="relative max-w-3xl">
                <p className="eyebrow text-accent-soft/70">The dossier standard</p>
                <h2 className="display mt-5 text-[clamp(2.5rem,5.5vw,5rem)] text-white">
                  Context over
                  <br />
                  <span className="serif-accent text-white/45">hype.</span>
                </h2>
                <p className="mt-6 max-w-xl text-[14px] leading-relaxed text-mist">
                  No infinite feeds, no fabricated review scores, no pretending that one number can hold a
                  game. Just carefully written dossiers about worlds, systems, and the choices behind them.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <ButtonLink to="/discover" size="lg">
                    Start exploring
                  </ButtonLink>
                  <ButtonLink to="/about" variant="secondary" size="lg">
                    Our editorial approach
                  </ButtonLink>
                </div>
              </div>
              <p className="absolute bottom-8 right-8 hidden max-w-[220px] text-right font-mono text-[8px] uppercase leading-relaxed tracking-[0.16em] text-white/25 md:block">
                An independent encyclopedia
                <br />
                of modern games
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
