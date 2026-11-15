import { Search, SlidersHorizontal, Sparkles } from 'lucide-react'
import { CatalogExplorer } from '@/components/CatalogExplorer'
import { PageIntro } from '@/components/PageIntro'
import { games } from '@/data/games'
import { genres } from '@/data/genres'
import { developers } from '@/data/games'
import { useSEO } from '@/hooks/useSEO'

export function Discover() {
  useSEO({
    title: 'Discover Games — GAMEVERSE Archive',
    description:
      'Search and filter 28 curated game dossiers by genre, studio, release year, and popularity. Every entry includes story, gameplay, technology, and gallery context.',
    image: '/media/gallery/elden-ring-3.webp',
  })

  return (
    <>
      <PageIntro
        eyebrow="The complete archive"
        breadcrumb="Discover"
        title="Every world, *one archive*."
        description="Search the collection, follow a genre, or sort by era. Each dossier covers the same essentials — story, systems, craft, technology, and the context behind the game."
        image="/media/gallery/elden-ring-3.webp"
        imageAlt="Elden Ring landscape artwork"
        meta={[
          { label: 'Dossiers', value: String(games.length) },
          { label: 'Genres', value: String(genres.length) },
          { label: 'Studios', value: String(developers.length) },
          { label: 'Platforms', value: '04' },
        ]}
        actions={
          <>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.14em] text-white/45">
              <Search className="h-3.5 w-3.5 text-accent-soft" />
              Search titles, studios, genres
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.14em] text-white/45">
              <SlidersHorizontal className="h-3.5 w-3.5 text-accent-soft" />
              Filters sync to the URL
            </span>
          </>
        }
      />

      <section className="py-12 sm:py-16">
        <div className="shell">
          <CatalogExplorer
            initialVisible={9}
            showSearch
            syncUrl
            searchPlaceholder="Search titles, studios, genres…"
          />
          <div className="mt-10 flex flex-col gap-3 border-t border-white/[0.07] pt-6 sm:flex-row sm:items-start sm:justify-between">
            <p className="max-w-2xl text-[10px] leading-relaxed text-white/30">
              <span className="text-white/55">On scores:</span> GV ratings are GAMEVERSE editorial
              assessments — a compact signal of design craft and durability, not an average of external
              reviews. Read the dossier before treating any number as a recommendation.
            </p>
            <p className="flex shrink-0 items-center gap-2 font-mono text-[8px] uppercase tracking-[0.14em] text-white/25">
              <Sparkles className="h-3 w-3 text-accent-soft/70" />
              Curated, not exhaustive
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
