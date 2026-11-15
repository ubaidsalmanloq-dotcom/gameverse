import type { ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Reveal, WordsReveal } from './Reveal'

interface PageIntroProps {
  eyebrow: string
  title: string
  description: string
  image?: string
  imageAlt?: string
  meta?: { label: string; value: string }[]
  actions?: ReactNode
  children?: ReactNode
  breadcrumb: string
  className?: string
  compact?: boolean
}

export function PageIntro({
  eyebrow,
  title,
  description,
  image,
  imageAlt = '',
  meta,
  actions,
  children,
  breadcrumb,
  className,
  compact = false,
}: PageIntroProps) {
  return (
    <section
      className={cn(
        'relative overflow-hidden border-b border-white/[0.07]',
        compact ? 'pb-14 pt-28 sm:pt-32' : 'pb-16 pt-32 sm:pb-20 sm:pt-40',
        className,
      )}
    >
      {image ? (
        <div className="absolute inset-0 -z-10">
          <img
            src={image}
            alt={imageAlt}
            className="h-full w-full scale-105 object-cover object-center opacity-40"
            fetchPriority="high"
            draggable={false}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#08090d_0%,rgba(8,9,13,0.88)_45%,rgba(8,9,13,0.35)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(0deg,#08090d_0%,rgba(8,9,13,0.55)_35%,rgba(8,9,13,0.45)_100%)]" />
          <div className="absolute inset-0 bg-grid opacity-[0.15] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
        </div>
      ) : (
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-grid opacity-[0.15] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
          <div className="absolute -left-40 top-0 h-[26rem] w-[26rem] rounded-full bg-accent/[0.07] blur-[120px]" />
        </div>
      )}

      <div className="shell">
        <Reveal y={14}>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">
            <Link to="/" className="transition hover:text-white/70">
              GAMEVERSE
            </Link>
            <span className="text-white/15">/</span>
            <span className="text-white/55">{breadcrumb}</span>
          </nav>
        </Reveal>

        <div className="mt-8 max-w-5xl">
          <Reveal y={16}>
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="eyebrow text-mist-bright">{eyebrow}</span>
            </div>
          </Reveal>

          <h1 className="display mt-6 text-[clamp(2.8rem,8vw,7rem)] font-semibold text-white">
            <WordsReveal text={title} />
          </h1>

          <Reveal delay={0.15}>
            <p className="mt-6 max-w-2xl text-pretty text-[14px] leading-relaxed text-mist sm:text-[15px]">
              {description}
            </p>
          </Reveal>

          {actions ? (
            <Reveal delay={0.22}>
              <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div>
            </Reveal>
          ) : null}
        </div>

        {meta?.length ? (
          <Reveal delay={0.25}>
            <dl className="mt-12 grid max-w-4xl grid-cols-2 gap-x-8 gap-y-6 border-t border-white/[0.1] pt-7 sm:grid-cols-4">
              {meta.map((item) => (
                <div key={item.label}>
                  <dt className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">{item.label}</dt>
                  <dd className="mt-2 font-display text-[clamp(1.4rem,2.4vw,2rem)] font-medium tracking-[-0.04em] text-white">
                    {item.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        ) : null}

        {children}
      </div>

      {image ? (
        <div
          className="pointer-events-none absolute -right-24 bottom-0 hidden items-end gap-3 pb-8 lg:flex"
          aria-hidden="true"
        >
          <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-white/20 [writing-mode:vertical-rl]">
            GAMEVERSE / EDITORIAL ARCHIVE
          </span>
          <ArrowUpRight className="h-4 w-4 text-white/20" />
        </div>
      ) : null}
    </section>
  )
}
