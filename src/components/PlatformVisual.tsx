import type { PlatformInfo } from '@/data/types'
import { cn } from '@/lib/utils'

const marks: Record<string, string> = {
  pc: 'PC',
  ps5: 'PS5',
  xbox: 'XBOX',
  switch: 'SWITCH',
}

export function PlatformVisual({
  platform,
  className,
  compact = false,
}: {
  platform: PlatformInfo
  className?: string
  compact?: boolean
}) {
  const mark = marks[platform.id] ?? platform.name

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-[#0a0c12]',
        compact ? 'min-h-[170px] rounded-xl' : 'min-h-[240px] rounded-2xl',
        className,
      )}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 90% at 82% 10%, ${platform.accent}38 0%, transparent 58%), linear-gradient(145deg, #141620 0%, #090a0f 70%)`,
        }}
      />
      <div className="absolute inset-0 bg-grid opacity-[0.2] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div
        className="absolute -right-16 -top-20 h-56 w-56 rounded-full border opacity-30"
        style={{ borderColor: platform.accent }}
      />
      <div
        className="absolute -right-6 -top-10 h-40 w-40 rounded-full border opacity-20"
        style={{ borderColor: platform.accent }}
      />
      <div className="absolute left-5 top-5 flex items-center gap-2">
        <span className="h-1 w-1 rounded-full" style={{ background: platform.accent }} />
        <span className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/40">{platform.releaseYear}</span>
      </div>
      <div className="absolute right-5 top-5 font-mono text-[7px] uppercase tracking-[0.2em] text-white/25">
        {platform.eyebrow}
      </div>
      <p
        className={cn(
          'absolute bottom-4 left-4 right-4 select-none whitespace-nowrap font-display font-semibold leading-[0.8] tracking-[-0.075em] text-white/[0.84]',
          compact ? 'text-[clamp(3rem,7vw,5.2rem)]' : 'text-[clamp(4rem,9vw,7.5rem)]',
        )}
      >
        {mark}
      </p>
      <div className="absolute inset-x-5 bottom-4 flex items-center justify-between">
        <span className="h-px w-10" style={{ background: `${platform.accent}80` }} />
        <span className="font-mono text-[7px] uppercase tracking-[0.18em] text-white/25">GV / PLATFORM</span>
      </div>
    </div>
  )
}
