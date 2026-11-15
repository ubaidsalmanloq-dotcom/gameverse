import { Star } from 'lucide-react'
import { formatScore } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function ScoreBadge({ score, className, compact = false }: { score: number; className?: string; compact?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-black/40 px-2.5 py-1 backdrop-blur-md',
        compact ? 'text-[10px]' : 'text-[11px]',
        className,
      )}
      title="GAMEVERSE editorial score — not a review aggregate"
      aria-label={`GAMEVERSE editorial score ${formatScore(score)} out of 10`}
    >
      <Star className="h-3 w-3 fill-accent-soft text-accent-soft" strokeWidth={1.5} />
      <span className="font-mono font-medium tracking-[0.08em] text-white">
        <span className="mr-1 text-white/45">GV</span>
        {formatScore(score)}
      </span>
    </span>
  )
}
