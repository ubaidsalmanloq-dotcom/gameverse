import { ArrowUpRight, Check, Info, Minus, MonitorSmartphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageIntro } from '@/components/PageIntro'
import { PlatformVisual } from '@/components/PlatformVisual'
import { Reveal } from '@/components/Reveal'
import { platforms } from '@/data/platforms'
import { useSEO } from '@/hooks/useSEO'

const comparisonRows = [
  { label: 'Released', value: (platform: (typeof platforms)[number]) => platform.releaseYear },
  { label: 'Performance target', value: (platform: (typeof platforms)[number]) => platform.highlights[0]?.value ?? '—' },
  { label: 'Graphics approach', value: (platform: (typeof platforms)[number]) => platform.highlights[1]?.value ?? '—' },
  { label: 'Catalog & value', value: (platform: (typeof platforms)[number]) => platform.highlights[2]?.value ?? '—' },
  { label: 'Best for', value: (platform: (typeof platforms)[number]) => platform.bestFor },
]

export function Platforms() {
  useSEO({
    title: 'Platforms Compared — PC, PS5, Xbox, Switch | GAMEVERSE',
    description:
      'A practical comparison of PC, PlayStation 5, Xbox Series X|S, and Nintendo Switch: performance targets, libraries, strengths, trade-offs, and who each platform suits.',
    image: '/media/gallery/forza-horizon-5-4.webp',
  })

  return (
    <>
      <PageIntro
        eyebrow="Platform index"
        breadcrumb="Platforms"
        title="Every platform is a *trade-off*."
        description="There is no universal winner. PC offers the highest ceiling and the most variables. PlayStation leads with cinematic exclusives. Xbox leans on ecosystem value. Switch sells portability and invention. Choose the trade-offs that fit how you actually play."
        image="/media/gallery/forza-horizon-5-4.webp"
        imageAlt="Forza Horizon 5 racing scene"
        meta={[
          { label: 'Platforms', value: '04' },
          { label: 'Compared on', value: 'Practicality' },
          { label: 'Specs', value: 'Public data' },
          { label: 'Winner', value: 'Depends' },
        ]}
        actions={
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2.5 font-mono text-[8px] uppercase tracking-[0.14em] text-white/45">
            <Info className="h-3.5 w-3.5 text-accent-soft" />
            Not a buying recommendation
          </span>
        }
      />

      <section className="border-b border-white/[0.07] py-14">
        <div className="shell">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow">At a glance</p>
                <h2 className="display mt-3 text-[clamp(2rem,3.6vw,3.2rem)] text-white">
                  Four approaches, <span className="serif-accent text-white/45">one decision.</span>
                </h2>
              </div>
              <p className="max-w-sm text-[11px] leading-relaxed text-white/35">
                Specs do not tell the whole story. Library, friends, controller feel, subscription habits,
                and where you already own games matter just as much.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8 overflow-x-auto rounded-2xl border border-white/[0.09]">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.035]">
                    <th className="sticky left-0 z-10 min-w-[170px] bg-[#10121a] px-5 py-4 font-mono text-[8px] font-normal uppercase tracking-[0.18em] text-white/35">
                      Criterion
                    </th>
                    {platforms.map((platform) => (
                      <th key={platform.id} className="min-w-[190px] px-5 py-4 align-bottom">
                        <span className="flex items-center gap-2">
                          <span className="h-1.5 w-1.5 rounded-full" style={{ background: platform.accent }} />
                          <span className="font-display text-sm font-medium text-white">{platform.name}</span>
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonRows.map((row, index) => (
                    <tr
                      key={row.label}
                      className={index < comparisonRows.length - 1 ? 'border-b border-white/[0.06]' : ''}
                    >
                      <th
                        scope="row"
                        className="sticky left-0 z-10 bg-[#0c0e14] px-5 py-4 text-[10px] font-medium uppercase tracking-[0.1em] text-white/40"
                      >
                        {row.label}
                      </th>
                      {platforms.map((platform) => (
                        <td key={platform.id} className="px-5 py-4 align-top text-[11.5px] leading-relaxed text-mist">
                          {row.value(platform)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-16">
        <div className="shell space-y-20">
          {platforms.map((platform, index) => (
            <article key={platform.id} id={platform.id} className="scroll-mt-24">
              <div className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
                <Reveal>
                  <div>
                    <PlatformVisual platform={platform} />
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {platform.highlights.map((highlight) => (
                        <div key={highlight.label} className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-3">
                          <p className="font-mono text-[7px] uppercase tracking-[0.14em] text-white/30">{highlight.label}</p>
                          <p className="mt-1.5 text-[10px] leading-snug text-mist">{highlight.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={0.08}>
                  <div className="flex h-full flex-col">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[8px] tracking-[0.18em] text-white/25">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="h-px w-8" style={{ background: `${platform.accent}80` }} />
                      <p className="eyebrow" style={{ color: platform.accent }}>
                        {platform.eyebrow}
                      </p>
                    </div>
                    <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-white">
                      {platform.name}
                    </h2>
                    <p className="mt-2 font-display text-lg font-normal tracking-[-0.02em] text-white/45">
                      {platform.tagline}
                    </p>
                    <p className="mt-5 max-w-2xl text-[13px] leading-relaxed text-mist">{platform.description}</p>

                    <div className="mt-6 rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
                      <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/30">Best for</p>
                      <p className="mt-1.5 text-[12px] leading-relaxed text-mist-bright">{platform.bestFor}</p>
                    </div>
                  </div>
                </Reveal>
              </div>

              <div className="mt-8 grid gap-4 lg:grid-cols-3">
                <Reveal className="lg:col-span-1">
                  <div className="h-full rounded-xl border border-white/[0.08] bg-[#0c0e14] p-5">
                    <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">Reference specs</p>
                    <dl className="mt-4 space-y-3">
                      {platform.specs.map((spec) => (
                        <div key={spec.label} className="flex flex-col gap-0.5 border-b border-white/[0.06] pb-2.5 last:border-0 last:pb-0">
                          <dt className="font-mono text-[7px] uppercase tracking-[0.12em] text-white/25">{spec.label}</dt>
                          <dd className="text-[10.5px] leading-relaxed text-mist">{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </Reveal>

                <Reveal delay={0.06}>
                  <div className="h-full rounded-xl border border-white/[0.08] bg-[#0c0e14] p-5">
                    <p className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">
                      <Check className="h-3 w-3 text-[#8fd6b0]" />
                      Strengths
                    </p>
                    <ul className="mt-4 space-y-3">
                      {platform.strengths.map((strength) => (
                        <li key={strength} className="flex items-start gap-2.5 text-[11px] leading-relaxed text-mist">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#8fd6b0]" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>

                <Reveal delay={0.12}>
                  <div className="h-full rounded-xl border border-white/[0.08] bg-[#0c0e14] p-5">
                    <p className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">
                      <Minus className="h-3 w-3 text-[#d7a08e]" />
                      Trade-offs
                    </p>
                    <ul className="mt-4 space-y-3">
                      {platform.tradeoffs.map((tradeoff) => (
                        <li key={tradeoff} className="flex items-start gap-2.5 text-[11px] leading-relaxed text-mist">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#d7a08e]" />
                          {tradeoff}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 border-t border-white/[0.07] pt-4">
                      <p className="font-mono text-[7px] uppercase tracking-[0.14em] text-white/25">Signature games</p>
                      <p className="mt-2 text-[10px] leading-relaxed text-white/45">
                        {platform.signatureGames.join(' · ')}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pb-8">
        <div className="shell">
          <Reveal>
            <div className="rounded-2xl border border-white/[0.08] bg-[#0b0d13] p-6 sm:p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2">
                    <MonitorSmartphone className="h-4 w-4 text-accent-soft" />
                    <p className="eyebrow">Caveat</p>
                  </div>
                  <p className="mt-4 text-[12px] leading-relaxed text-mist">
                    Spec sheets are summaries, not guarantees. Actual performance varies by game, display,
                    settings, thermals, and patches. Platform catalogs and subscription terms change. Verify
                    current details with the platform holder before buying.
                  </p>
                </div>
                <Link
                  to="/discover"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/14 bg-white/[0.04] px-5 py-3 text-[12px] text-white transition hover:border-white/25 hover:bg-white/[0.08]"
                >
                  Browse all game dossiers
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
