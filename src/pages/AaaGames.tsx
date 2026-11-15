import { ArrowUpRight, Building2, Clapperboard, Gauge, Layers3 } from 'lucide-react'
import { CatalogExplorer } from '@/components/CatalogExplorer'
import { PageIntro } from '@/components/PageIntro'
import { Reveal } from '@/components/Reveal'
import { aaaCollection } from '@/data/games'
import { useSEO } from '@/hooks/useSEO'
import type { GenreId } from '@/data/types'

const aaaFilters: GenreId[] = [
  'action',
  'adventure',
  'rpg',
  'fps',
  'tps',
  'open-world',
  'survival',
  'horror',
  'racing',
  'stealth',
  'soulslike',
  'multiplayer',
  'strategy',
]

const pillars = [
  {
    icon: Building2,
    title: 'Scale',
    body: 'Hundreds of developers, multi-year production, and external partners. Scale changes the logistics of every decision.',
  },
  {
    icon: Layers3,
    title: 'Craft',
    body: 'Animation, sound, rendering, and accessibility budgets that can support detail at a rare level of finish.',
  },
  {
    icon: Gauge,
    title: 'Risk',
    body: 'Large teams and long timelines make each release a commercial gamble. That pressure shapes which games get made.',
  },
]

export function AaaGames() {
  useSEO({
    title: 'AAA Games — The Blockbuster Canon | GAMEVERSE',
    description:
      'Fifteen AAA game dossiers, examined for design, technology, and production context. AAA describes scale and budget — not an automatic mark of quality.',
    image: '/media/gallery/cyberpunk-2077-4.webp',
  })

  return (
    <>
      <PageIntro
        eyebrow="The blockbuster canon"
        breadcrumb="AAA Games"
        title="Big worlds. *Bigger* stakes."
        description="AAA is a production category, not a quality badge. These are games built at industrial scale — and the ones in this archive are here because their craft, systems, or cultural footprint reward a closer look."
        image="/media/gallery/cyberpunk-2077-4.webp"
        imageAlt="Cyberpunk 2077 Night City artwork"
        meta={[
          { label: 'Dossiers', value: '15' },
          { label: 'Earliest entry', value: '2013' },
          { label: 'Latest entry', value: '2024' },
          { label: 'Standard', value: 'Editorial' },
        ]}
        actions={
          <>
            <a
              href="#aaa-collection"
              className="inline-flex items-center gap-2 rounded-full bg-[#f4f1ea] px-5 py-3 text-[13px] font-medium text-[#0a0a0f] transition hover:bg-accent-soft"
            >
              Enter the collection
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.14em] text-white/45">
              <Clapperboard className="h-3.5 w-3.5 text-accent-soft" />
              Budget is context, not a score
            </span>
          </>
        }
      />

      <section className="border-b border-white/[0.07] py-16">
        <div className="shell">
          <Reveal>
            <div className="mb-10 flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="eyebrow text-mist-bright">What AAA actually means</span>
            </div>
          </Reveal>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] md:grid-cols-3">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={index * 0.07}>
                <div className="h-full bg-[#0b0d13] p-7 sm:p-8">
                  <div className="flex items-center justify-between">
                    <pillar.icon className="h-5 w-5 text-accent-soft/80" strokeWidth={1.5} />
                    <span className="font-mono text-[8px] tracking-[0.16em] text-white/25">0{index + 1}</span>
                  </div>
                  <h2 className="mt-8 font-display text-2xl font-medium tracking-[-0.04em] text-white">{pillar.title}</h2>
                  <p className="mt-3 text-[12.5px] leading-relaxed text-mist">{pillar.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-3xl text-[11px] leading-relaxed text-white/35">
              The collection mixes era-defining open worlds with focused action games because the AAA label
              covers both. It is deliberately selective: missing a commercially successful game does not mean
              it was overlooked; it means this archive is curated, not exhaustive.
            </p>
          </Reveal>
        </div>
      </section>

      <section id="aaa-collection" className="scroll-mt-24 py-16">
        <div className="shell">
          <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">The collection</p>
              <h2 className="display mt-4 text-[clamp(2.2rem,4vw,3.6rem)] text-white">
                Fifteen dossiers, <span className="serif-accent text-white/45">one standard.</span>
              </h2>
            </div>
            <p className="max-w-xs text-[11px] leading-relaxed text-white/35">
              Filter by genre, search by title or studio, and sort by era. All entries include a full editorial
              dossier.
            </p>
          </div>
          <CatalogExplorer
            source={aaaCollection}
            genreFilters={aaaFilters}
            initialVisible={9}
            showSearch
            compactFilters
            searchPlaceholder="Search AAA titles or studios…"
          />
          <div className="mt-8 border-t border-white/[0.07] pt-5">
            <p className="max-w-2xl text-[10px] leading-relaxed text-white/30">
              Release dates and platform availability can change with re-releases, remasters, and storefront
              delistings. Check the current storefront for the version you intend to play.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
