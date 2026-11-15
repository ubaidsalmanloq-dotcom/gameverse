import { useState } from 'react'
import {
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  Compass,
  Eye,
  FileCheck2,
  Flag,
  Info,
  Quote,
  ShieldCheck,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { ButtonLink } from '@/components/ButtonLink'
import { PageIntro } from '@/components/PageIntro'
import { Reveal, StaggerGroup, StaggerItem } from '@/components/Reveal'
import { games } from '@/data/games'
import { genres } from '@/data/genres'
import { systems } from '@/data/systems'
import { useSEO } from '@/hooks/useSEO'
import { cn } from '@/lib/utils'

const principles = [
  {
    icon: Compass,
    title: 'Context over consensus',
    body: 'A game is more than its reception. Dossiers explain the design intent, the production context, and the experience — not just whether it was liked.',
  },
  {
    icon: Eye,
    title: 'Spoilers are opt-in',
    body: 'Story sections describe premise and themes. Late-game turns stay behind an explicit spoiler control. No ending is dropped without warning.',
  },
  {
    icon: ShieldCheck,
    title: 'Specs stay approximate',
    body: 'PC requirements come from public listings and can change. They are guidance, not a guarantee. Always check the current storefront.',
  },
  {
    icon: FileCheck2,
    title: 'Numbers carry caveats',
    body: 'The GV score is a compact editorial signal. It is not an aggregate, a user rating, or a substitute for reading the dossier.',
  },
]

const processSteps = [
  {
    title: 'Selection',
    body: 'Games are chosen for design influence, cultural footprint, or technical interest. The archive is curated, not exhaustive.',
  },
  {
    title: 'Research',
    body: 'Public developer interviews, storefront listings, technical documentation, and editorial analysis form the evidence base.',
  },
  {
    title: 'Writing',
    body: 'Each dossier separates premise, story, gameplay, features, technology, and platform context so claims stay legible.',
  },
  {
    title: 'Review',
    body: 'Names, dates, and requirements are checked against public sources. Uncertain details are framed as approximate or omitted.',
  },
]

const faqs = [
  {
    question: 'What is the GV score, exactly?',
    answer:
      'It is GAMEVERSE’s editorial assessment of a game’s design craft, coherence, and lasting impact, expressed on a 10-point scale. It is not an average of critics, a user score, or a Metacritic/OpenCritic aggregate. Use it as a navigational signal, then read the dossier.',
  },
  {
    question: 'Are the PC requirements official?',
    answer:
      'They are approximate summaries based on public storefront listings and publisher information. Requirements change with patches, DLC, and re-releases. Check the storefront for the exact version you plan to run.',
  },
  {
    question: 'How were the games selected?',
    answer:
      'The archive favours games with a clear design point of view, technical relevance, or lasting influence. It mixes blockbuster titles with smaller games. Commercial success alone is not the criterion, and the collection is deliberately not a complete release database.',
  },
  {
    question: 'Why do some games include platform notes?',
    answer:
      'A platform note clarifies backward compatibility, re-release availability, or a meaningful version difference. It is not a performance review of every port. Where availability can change, verify it with the storefront.',
  },
  {
    question: 'Where does the artwork come from?',
    answer:
      'Artwork is used for editorial identification and commentary. Images are sourced from publisher storefront assets or official game materials, and all titles remain the property of their respective rights holders. GAMEVERSE claims no ownership over them.',
  },
  {
    question: 'Is this an official publisher or platform site?',
    answer:
      'No. GAMEVERSE is an independent editorial concept and this build is a front-end demonstration. It is not affiliated with Rockstar, CD Projekt, FromSoftware, Sony, Microsoft, Nintendo, or any other publisher or platform holder.',
  },
]

export function About() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  useSEO({
    title: 'About & Editorial Policy — GAMEVERSE',
    description:
      'How GAMEVERSE builds its game dossiers: editorial scores, sourcing, spoiler policy, platform caveats, and the principles behind the archive.',
    image: '/media/gallery/control-2.webp',
  })

  return (
    <>
      <PageIntro
        eyebrow="About the archive"
        breadcrumb="About"
        title="Context over *hype*."
        description="GAMEVERSE is a reading-first game encyclopedia: dossiers built around design, story, technology, and the choices that shape play. No infinite feed. No invented consensus. No score without a rationale."
        image="/media/gallery/control-2.webp"
        imageAlt="Control's brutalist interior"
        meta={[
          { label: 'Dossiers', value: String(games.length) },
          { label: 'Genres', value: String(genres.length) },
          { label: 'Systems', value: String(systems.length) },
          { label: 'Platforms', value: '04' },
        ]}
        actions={
          <>
            <ButtonLink to="/discover" size="md">
              Browse the archive
            </ButtonLink>
            <a
              href="#editorial-policy"
              className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/[0.04] px-5 py-3 text-[13px] text-white transition hover:border-white/25 hover:bg-white/[0.08]"
            >
              Read the policy
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </>
        }
      />

      <section id="editorial-policy" className="scroll-mt-24 border-b border-white/[0.07] py-16">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
            <Reveal>
              <div>
                <div className="flex items-center gap-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <p className="eyebrow">The premise</p>
                </div>
                <h2 className="display mt-5 text-[clamp(2.3rem,4.5vw,4.2rem)] text-white">
                  A game deserves
                  <br />
                  more than a <span className="serif-accent text-white/45">number.</span>
                </h2>
                <div className="mt-6 space-y-4 text-[13.5px] leading-[1.85] text-mist">
                  <p>
                    Most game coverage is built for velocity: a release date, a verdict, a score, the next
                    thing. GAMEVERSE is built for the opposite pace. Each dossier slows down long enough to
                    explain what a game is doing, how its systems fit together, and why its world looks and
                    feels the way it does.
                  </p>
                  <p>
                    This is an independent editorial demonstration. Dossiers synthesize publicly available
                    material — developer interviews, storefront data, technical documentation, and design
                    analysis. They are not presented as firsthand reviews of every title, and they are not
                    sponsored by any publisher or platform holder.
                  </p>
                  <p>
                    The collection is intentionally curated. A missing game is not a judgment; it simply
                    means the archive is not trying to be a complete release database. The goal is depth,
                    not coverage.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0d0f16] p-6 sm:p-7">
                <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-accent/[0.12] blur-[70px]" aria-hidden="true" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/35">Score ledger</span>
                    <span className="rounded-full border border-accent/25 bg-accent/[0.08] px-2.5 py-1 font-mono text-[7px] uppercase tracking-[0.14em] text-accent-soft">
                      GV / editorial
                    </span>
                  </div>
                  <p className="mt-6 font-display text-6xl font-semibold tracking-[-0.06em] text-white">
                    9.8<span className="ml-1 align-top font-mono text-xs font-normal tracking-normal text-white/30">/10</span>
                  </p>
                  <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-white/25">Example scale</p>
                  <p className="mt-5 text-[12px] leading-relaxed text-mist">
                    Scores reflect design coherence, execution, and durability — the things that remain after
                    the launch window. They are deliberately conservative and always attached to a written
                    dossier.
                  </p>
                  <ul className="mt-5 space-y-2.5">
                    {[
                      'Not a critics’ average',
                      'Not a user score',
                      'Not a buying instruction',
                      'Not a substitute for context',
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-[10.5px] text-white/50">
                        <Check className="h-3 w-3 shrink-0 text-accent-soft" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 flex items-start gap-2 border-t border-white/[0.08] pt-4 text-[9px] leading-relaxed text-white/30">
                    <Info className="mt-0.5 h-3 w-3 shrink-0" />
                    Scale illustration only. Read the individual dossier for the reasoning behind a score.
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="shell">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Editorial principles</p>
              <h2 className="display mt-4 text-[clamp(2rem,3.6vw,3.2rem)] text-white">
                What we <span className="serif-accent text-white/45">optimise for.</span>
              </h2>
            </div>
            <p className="max-w-sm text-[11px] leading-relaxed text-white/35">
              Four commitments that shape every dossier, filter, and disclaimer on the site.
            </p>
          </div>

          <StaggerGroup className="mt-9 grid gap-4 sm:grid-cols-2">
            {principles.map((principle, index) => (
              <StaggerItem key={principle.title}>
                <div className="group h-full rounded-2xl border border-white/[0.08] bg-[#0c0e14] p-6 transition hover:border-white/20 sm:p-7">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-accent-soft">
                      <principle.icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                    </span>
                    <span className="font-mono text-[8px] tracking-[0.16em] text-white/20">0{index + 1}</span>
                  </div>
                  <h3 className="mt-6 font-display text-xl font-medium tracking-[-0.035em] text-white">{principle.title}</h3>
                  <p className="mt-2.5 text-[12px] leading-relaxed text-mist">{principle.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="relative border-y border-white/[0.07] bg-[#0a0b10] py-16">
        <div className="absolute inset-0 bg-grid opacity-[0.07]" aria-hidden="true" />
        <div className="shell relative">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <Reveal>
              <div>
                <div className="flex items-center gap-3">
                  <BookOpen className="h-3.5 w-3.5 text-accent-soft" />
                  <p className="eyebrow">The dossier process</p>
                </div>
                <h2 className="display mt-5 text-[clamp(2.1rem,4vw,3.6rem)] text-white">
                  Slow on purpose.
                </h2>
                <p className="mt-4 max-w-sm text-[12.5px] leading-relaxed text-mist">
                  A dossier is structured so you can read what you need: the premise, the systems, the
                  technology, or the platform context. Spoilers stay out of the way until you ask.
                </p>
                <div className="mt-7 flex items-start gap-3 rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent-soft/80" />
                  <p className="text-[10.5px] leading-relaxed text-white/40">
                    This build is a front-end demonstration. There is no editorial CMS, no analytics script,
                    and no submission backend.
                  </p>
                </div>
              </div>
            </Reveal>

            <div>
              {processSteps.map((step, index) => (
                <Reveal key={step.title} delay={index * 0.06}>
                  <div className="grid gap-4 border-b border-white/[0.08] py-5 first:pt-0 sm:grid-cols-[52px_1fr] sm:gap-6">
                    <span className="font-mono text-[10px] tracking-[0.16em] text-white/25">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="flex items-center gap-2.5 font-display text-lg font-medium tracking-[-0.03em] text-white">
                        {step.title}
                        {index === processSteps.length - 1 ? (
                          <span className="rounded-full border border-accent/25 bg-accent/[0.08] px-2 py-0.5 font-mono text-[7px] uppercase tracking-[0.12em] text-accent-soft">
                            final
                          </span>
                        ) : null}
                      </h3>
                      <p className="mt-1.5 max-w-xl text-[11.5px] leading-relaxed text-mist">{step.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
            <Reveal>
              <div>
                <p className="eyebrow">Questions</p>
                <h2 className="display mt-4 text-[clamp(2rem,3.6vw,3.2rem)] text-white">
                  The fine <span className="serif-accent text-white/45">print.</span>
                </h2>
                <p className="mt-4 max-w-sm text-[12px] leading-relaxed text-mist">
                  What the scores mean, where the data comes from, and what this archive is not.
                </p>
              </div>
            </Reveal>

            <div className="rounded-2xl border border-white/[0.08] bg-[#0c0e14]">
              {faqs.map((faq, index) => {
                const open = openFaq === index
                return (
                  <div key={faq.question} className={cn('border-b border-white/[0.07] last:border-0')}>
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpenFaq(open ? null : index)}
                        aria-expanded={open}
                        aria-controls={`faq-panel-${index}`}
                        id={`faq-trigger-${index}`}
                        className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left transition hover:bg-white/[0.02] sm:px-6"
                      >
                        <span className={cn('text-[12.5px] font-medium', open ? 'text-white' : 'text-mist-bright')}>
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={cn(
                            'h-4 w-4 shrink-0 transition-transform duration-300',
                            open ? 'rotate-180 text-accent-soft' : 'text-white/30',
                          )}
                        />
                      </button>
                    </h3>
                    <div
                      id={`faq-panel-${index}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${index}`}
                      hidden={!open}
                      className="px-5 pb-5 sm:px-6"
                    >
                      <p className="max-w-2xl text-[11.5px] leading-[1.8] text-mist">{faq.answer}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <Reveal>
            <div className="mt-12 flex flex-col gap-5 rounded-2xl border border-white/[0.08] bg-[#0d0f16] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-accent-soft">
                  <Flag className="h-4 w-4" strokeWidth={1.5} />
                </span>
                <div>
                  <p className="text-[13px] font-medium text-white">Something look wrong?</p>
                  <p className="mt-1 max-w-xl text-[11px] leading-relaxed text-mist">
                    This demo has no corrections inbox. In a production build, corrections would be logged
                    with a visible changelog and dated edits — not silently overwritten.
                  </p>
                </div>
              </div>
              <Link
                to="/discover"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#f4f1ea] px-5 py-3 text-[12px] font-medium text-[#0a0a0f] transition hover:bg-accent-soft"
              >
                Browse dossiers
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-8">
        <div className="shell">
          <div className="flex items-center justify-center gap-4 rounded-2xl border border-white/[0.08] bg-gradient-to-r from-[#0b0d13] via-[#10101a] to-[#0b0d13] p-8 text-center">
            <Quote className="hidden h-8 w-8 shrink-0 text-accent/30 sm:block" strokeWidth={1.2} />
            <p className="max-w-2xl font-display text-[clamp(1.2rem,2.4vw,1.7rem)] font-normal leading-snug tracking-[-0.025em] text-white/65">
              “The point is not to agree with the archive. The point is to leave with a better question
              about the game.”
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
