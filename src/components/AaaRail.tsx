import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Layers3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { aaaCollection } from '@/data/games'
import { genreById } from '@/data/genres'
import { cn } from '@/lib/utils'
import { SafeImage } from './SafeImage'
import { ScoreBadge } from './ScoreBadge'
import { PlatformList } from './PlatformBadge'

export function AaaRail() {
  const railRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const updateProgress = useCallback(() => {
    const rail = railRef.current
    if (!rail) return
    const max = rail.scrollWidth - rail.clientWidth
    const value = max > 0 ? rail.scrollLeft / max : 0
    setProgress(value)
    setAtStart(rail.scrollLeft < 8)
    setAtEnd(max - rail.scrollLeft < 8)
  }, [])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    updateProgress()
    rail.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => {
      rail.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [updateProgress])

  const scrollByCard = (direction: number) => {
    const rail = railRef.current
    if (!rail) return
    const card = rail.querySelector<HTMLElement>('[data-rail-card]')
    const amount = card ? card.offsetWidth + 20 : rail.clientWidth * 0.8
    rail.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">
          <Layers3 className="h-3 w-3 text-accent-soft" />
          {aaaCollection.length} blockbuster dossiers
        </div>
        <div className="flex items-center gap-2">
          <span className="mr-2 hidden font-mono text-[8px] uppercase tracking-[0.14em] text-white/25 sm:block">
            Drag or use arrows
          </span>
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={atStart}
            aria-label="Scroll AAA games left"
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full border transition',
              atStart
                ? 'cursor-not-allowed border-white/[0.06] text-white/20'
                : 'border-white/12 bg-white/[0.03] text-white hover:border-white/25 hover:bg-white/[0.07]',
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={atEnd}
            aria-label="Scroll AAA games right"
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full border transition',
              atEnd
                ? 'cursor-not-allowed border-white/[0.06] text-white/20'
                : 'border-white/12 bg-white/[0.03] text-white hover:border-white/25 hover:bg-white/[0.07]',
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={railRef}
        className="hide-scrollbar -mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-2"
        role="region"
        aria-label="AAA games collection"
      >
        {aaaCollection.map((game, index) => (
          <Link
            key={game.slug}
            to={`/games/${game.slug}`}
            data-rail-card
            className="group relative flex w-[82vw] max-w-[480px] shrink-0 snap-start flex-col overflow-hidden rounded-[1.4rem] border border-white/[0.08] bg-panel transition-all duration-500 hover:-translate-y-1 hover:border-white/20 sm:w-[62vw] lg:w-[34vw] xl:w-[30vw]"
            aria-label={`${game.title} — AAA game dossier`}
          >
            <div className="relative aspect-[16/11] overflow-hidden">
              <SafeImage
                src={game.hero}
                alt={`${game.title} in-game artwork`}
                title={game.title}
                sizes="(max-width: 640px) 82vw, (max-width: 1024px) 62vw, 34vw"
                className="absolute inset-0 h-full w-full"
                imgClassName="transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b10] via-[#0a0b10]/25 to-black/10" />
              <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5">
                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-white/12 bg-black/35 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.16em] text-white/65 backdrop-blur-md">
                    {game.year}
                  </span>
                  <ScoreBadge score={game.score} compact />
                </div>
                <span className="font-mono text-[9px] tracking-[0.16em] text-white/30">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                <p className="mb-2 font-mono text-[8px] uppercase tracking-[0.18em] text-accent-soft/85">
                  {genreById[game.primaryGenre]?.name}
                </p>
                <h3 className="font-display text-[clamp(1.5rem,2.6vw,2.2rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-white">
                  {game.title}
                </h3>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="truncate text-[11px] text-white/45">{game.developer}</span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white transition group-hover:bg-white group-hover:text-black">
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/[0.07] px-5 py-3.5">
              <PlatformList platforms={game.platforms} limit={4} />
              <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/25 transition group-hover:text-white/60">
                View dossier
              </span>
            </div>
          </Link>
        ))}

        <Link
          to="/aaa"
          data-rail-card
          className="group flex min-h-[300px] w-[70vw] max-w-[340px] shrink-0 snap-start flex-col justify-between rounded-[1.4rem] border border-dashed border-white/12 bg-white/[0.02] p-6 transition hover:border-accent/40 hover:bg-accent/[0.04] sm:w-[42vw] lg:w-[24vw]"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.03] text-accent-soft">
            <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
          </span>
          <div>
            <p className="eyebrow text-white/30">The full collection</p>
            <p className="mt-3 font-display text-3xl font-medium leading-[1.05] tracking-[-0.04em] text-white">
              Every AAA dossier,{' '}
              <span className="serif-accent text-accent-soft">uncompromised</span>.
            </p>
            <span className="mt-6 inline-flex items-center gap-2 text-[11px] text-mist transition group-hover:text-white">
              Enter the collection
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </Link>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <div className="relative h-px flex-1 overflow-hidden bg-white/[0.08]">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-accent to-accent-soft transition-[width] duration-200"
            style={{ width: `${Math.max(6, progress * 100)}%` }}
          />
        </div>
        <span className="font-mono text-[8px] tracking-[0.16em] text-white/25">
          {String(Math.round(progress * 100)).padStart(2, '0')}%
        </span>
      </div>
    </div>
  )
}
