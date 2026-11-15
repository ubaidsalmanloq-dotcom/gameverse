import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Building2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { genreById } from '@/data/genres'
import type { Game } from '@/data/types'
import { EASE } from '@/lib/motion'
import { PlatformList } from './PlatformBadge'
import { SafeImage } from './SafeImage'
import { ScoreBadge } from './ScoreBadge'

interface GameCardProps {
  game: Game
  index?: number
  priority?: boolean
}

export function GameCard({ game, index = 0, priority = false }: GameCardProps) {
  const reduce = useReducedMotion()
  const primaryGenre = genreById[game.primaryGenre]

  return (
    <motion.article
      layout={!reduce}
      initial={reduce ? undefined : { opacity: 0, y: 24 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.55, delay: reduce ? 0 : Math.min(index, 8) * 0.045, ease: EASE }}
      className="group relative h-full"
    >
      <Link
        to={`/games/${game.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-[1.35rem] border border-white/[0.075] bg-panel/70 transition-all duration-500 hover:-translate-y-1.5 hover:border-white/20 hover:bg-[#141621] hover:shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9),0_0_60px_-30px_rgba(139,92,246,0.45)]"
        aria-label={`${game.title} — view game dossier`}
      >
        <div className="relative aspect-[3/4] overflow-hidden bg-panel-2">
          <SafeImage
            src={game.cover}
            alt={`${game.title} cover artwork`}
            title={game.title}
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="absolute inset-0 h-full w-full"
            imgClassName="transition-transform duration-[1100ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.055]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-[#08090d]/20 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-white/[0.03] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
            <div className="flex flex-col items-start gap-2">
              <ScoreBadge score={game.score} />
              {game.aaa ? (
                <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-1 font-mono text-[8px] uppercase tracking-[0.18em] text-accent-soft backdrop-blur-md">
                  AAA
                </span>
              ) : null}
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white backdrop-blur-md transition-all duration-500 group-hover:border-white/40 group-hover:bg-white group-hover:text-black">
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.6} />
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-5 pt-14">
            <div className="mb-2 flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-white/55">
              <span>{game.year}</span>
              <span className="h-1 w-1 rounded-full bg-accent-soft/70" />
              <span>{primaryGenre?.name ?? 'Game'}</span>
            </div>
            <h3 className="font-display text-[clamp(1.35rem,2vw,1.7rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-white">
              {game.title}
            </h3>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5 pt-4">
          <p className="line-clamp-2 text-[12.5px] leading-relaxed text-mist">{game.shortDescription}</p>

          <div className="mt-auto flex items-end justify-between gap-3 border-t border-white/[0.07] pt-4">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] text-white/45">
                <Building2 className="h-3 w-3 shrink-0" strokeWidth={1.5} />
                <span className="truncate">{game.developer}</span>
              </div>
              <div className="mt-2">
                <PlatformList platforms={game.platforms} limit={3} />
              </div>
            </div>
            <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-white/30 transition-colors duration-300 group-hover:text-accent-soft">
              Dossier
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  )
}
