import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { WordsReveal } from './Reveal'

interface SectionHeadingProps {
  eyebrow: string
  index?: string
  title: string
  description?: string
  actions?: ReactNode
  align?: 'left' | 'center'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  titleClassName?: string
}

export function SectionHeading({
  eyebrow,
  index,
  title,
  description,
  actions,
  align = 'left',
  size = 'md',
  className,
  titleClassName,
}: SectionHeadingProps) {
  const titleSize =
    size === 'lg'
      ? 'text-[clamp(2.8rem,6vw,5.8rem)]'
      : size === 'sm'
        ? 'text-[clamp(1.9rem,3.6vw,3rem)]'
        : 'text-[clamp(2.3rem,4.6vw,4.2rem)]'

  return (
    <div className={cn('flex flex-col gap-8', align === 'center' && 'items-center text-center', className)}>
      <div className={cn('w-full', align === 'center' && 'flex flex-col items-center')}>
        <div className={cn('flex items-center gap-3', align === 'center' && 'justify-center')}>
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="eyebrow text-mist-bright">{eyebrow}</span>
          {index ? (
            <>
              <span className="h-px w-10 bg-white/15" />
              <span className="font-mono text-[10px] tracking-[0.18em] text-white/35">{index}</span>
            </>
          ) : null}
        </div>

        <h2 className={cn('display mt-5 max-w-4xl text-balance text-white', titleSize, titleClassName)}>
          <WordsReveal text={title} />
        </h2>

        {description ? (
          <p className={cn('mt-6 max-w-2xl text-pretty text-[15px] leading-relaxed text-mist', align === 'center' && 'mx-auto')}>
            {description}
          </p>
        ) : null}
      </div>

      {actions ? <div className={cn('flex flex-wrap items-center gap-3', align === 'center' && 'justify-center')}>{actions}</div> : null}
    </div>
  )
}
