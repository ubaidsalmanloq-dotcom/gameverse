import { shortPlatform } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function PlatformBadge({
  platform,
  className,
  compact = false,
}: {
  platform: string
  className?: string
  compact?: boolean
}) {
  return (
    <span
      title={platform}
      className={cn(
        'inline-flex items-center justify-center rounded-[5px] border border-white/12 bg-white/[0.035] font-mono uppercase tracking-[0.1em] text-mist-bright',
        compact ? 'h-5 px-1.5 text-[8px]' : 'h-6 px-2 text-[9px]',
        className,
      )}
    >
      {shortPlatform(platform)}
    </span>
  )
}

export function PlatformList({
  platforms,
  limit = 4,
  compact = true,
  className,
}: {
  platforms: string[]
  limit?: number
  compact?: boolean
  className?: string
}) {
  const shown = platforms.slice(0, limit)
  const remaining = platforms.length - shown.length
  return (
    <span className={cn('inline-flex flex-wrap items-center gap-1', className)}>
      {shown.map((platform) => (
        <PlatformBadge key={platform} platform={platform} compact={compact} />
      ))}
      {remaining > 0 ? (
        <span className="font-mono text-[9px] tracking-[0.1em] text-white/40" title={platforms.slice(limit).join(', ')}>
          +{remaining}
        </span>
      ) : null}
    </span>
  )
}
