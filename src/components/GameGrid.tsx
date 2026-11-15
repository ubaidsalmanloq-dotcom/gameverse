import { AnimatePresence, motion } from 'framer-motion'
import { SearchX } from 'lucide-react'
import type { Game } from '@/data/types'
import { cn } from '@/lib/utils'
import { GameCard } from './GameCard'

interface GameGridProps {
  games: Game[]
  className?: string
  priorityCount?: number
  emptyMessage?: string
  onReset?: () => void
}

export function GameGrid({ games, className, priorityCount = 3, emptyMessage, onReset }: GameGridProps) {
  if (!games.length) {
    return (
      <div className={cn('flex min-h-[380px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/12 bg-white/[0.015] px-6 text-center', className)}>
        <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.04]">
          <SearchX className="h-6 w-6 text-mist" strokeWidth={1.4} />
        </span>
        <p className="font-display text-2xl font-medium tracking-[-0.03em] text-white">No signal found</p>
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-mist">
          {emptyMessage ?? 'Nothing in the archive matches those filters. Try another genre, studio, or title.'}
        </p>
        {onReset ? (
          <button
            type="button"
            onClick={onReset}
            className="mt-6 rounded-full border border-white/15 bg-white/[0.05] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-white/[0.1]"
          >
            Reset filters
          </button>
        ) : null}
      </div>
    )
  }

  return (
    <motion.div layout className={cn('grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3', className)}>
      <AnimatePresence mode="popLayout">
        {games.map((game, index) => (
          <GameCard key={game.slug} game={game} index={index} priority={index < priorityCount} />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
