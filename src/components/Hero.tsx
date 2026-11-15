import { useEffect, useRef, useState } from 'react'
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Compass, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { featuredGames, gameBySlug, games } from '@/data/games'
import { genres } from '@/data/genres'
import { EASE } from '@/lib/motion'
import { formatScore } from '@/lib/utils'
import { ButtonLink } from './ButtonLink'
import { ScoreBadge } from './ScoreBadge'
import { SafeImage } from './SafeImage'

const featured = featuredGames.map((slug) => gameBySlug[slug]).filter(Boolean)

const titleContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
}

const titleItem = {
  hidden: { y: '110%' },
  show: { y: 0, transition: { duration: 1.05, ease: EASE } },
}

const fadeItem = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
}

export function Hero() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '16%'])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 90])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65, 1], [1, 1, 0])

  const game = featured[active] ?? featured[0]

  useEffect(() => {
    if (paused || reduce) return
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % featured.length)
    }, 7500)
    return () => window.clearInterval(timer)
  }, [paused, reduce])

  const handleStep = (direction: number) => {
    setActive((current) => (current + direction + featured.length) % featured.length)
  }

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-label="GAMEVERSE featured games"
    >
      <motion.div className="absolute inset-0 -z-10" style={reduce ? undefined : { y: backgroundY }}>
        {featured.map((featuredGame, index) => (
          <motion.div
            key={featuredGame.slug}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: index === active ? 1 : 0 }}
            transition={{ duration: 1.35, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            <motion.img
              src={featuredGame.hero}
              alt=""
              className="h-[112%] w-full object-cover object-center"
              initial={false}
              animate={reduce ? undefined : { scale: index === active ? 1.055 : 1.0 }}
              transition={{ duration: 8, ease: 'linear' }}
              loading={index === 0 ? 'eager' : 'eager'}
              fetchPriority={index === 0 ? 'high' : 'auto'}
              draggable={false}
            />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,9,13,0.95)_0%,rgba(8,9,13,0.72)_38%,rgba(8,9,13,0.18)_70%,rgba(8,9,13,0.55)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,#08090d_0%,rgba(8,9,13,0.85)_16%,rgba(8,9,13,0.05)_55%,rgba(8,9,13,0.45)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(8,9,13,0.55)_100%)]" />
        <div className="absolute inset-0 bg-grid opacity-[0.18] [mask-image:linear-gradient(to_bottom,black,transparent_65%)]" />
        <div className="absolute -left-40 top-1/3 h-[30rem] w-[30rem] rounded-full bg-accent/[0.09] blur-[120px]" />
      </motion.div>

      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="shell relative flex flex-1 flex-col justify-end pb-8 pt-32 sm:pb-10 lg:pb-0 lg:pt-36"
      >
        <div className="grid flex-1 items-end gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
          <motion.div
            variants={titleContainer}
            initial={reduce ? false : 'hidden'}
            animate="show"
            className="relative z-10 max-w-[1000px] pb-8 lg:pb-20"
          >
            <motion.div variants={fadeItem} className="mb-7 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2.5 rounded-full border border-white/12 bg-black/25 px-3.5 py-2 backdrop-blur-md">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-soft opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-soft" />
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/75">Featured game</span>
              </span>
              <span className="hidden h-px w-12 bg-white/20 sm:block" />
              <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">
                {game?.title}
              </span>
            </motion.div>

            <h1 className="display text-[clamp(3.4rem,10.2vw,9.2rem)] font-semibold text-white">
              <span className="block overflow-hidden pb-[0.08em]">
                <motion.span variants={titleItem} className="block">
                  THE WORLD
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.1em]">
                <motion.span variants={titleItem} className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span className="serif-accent mr-1 text-[0.52em] font-normal normal-case tracking-[-0.03em] text-white/45">
                    of
                  </span>
                  <span className="text-gradient">GAMING</span>
                </motion.span>
              </span>
            </h1>

            <motion.p
              variants={fadeItem}
              className="mt-7 max-w-[540px] text-pretty text-[14px] leading-relaxed text-white/60 sm:text-[15px]"
            >
              Step inside the worlds behind the screen. {games.length} meticulously profiled titles, 16 genres,
              and the technology that makes play possible — curated for people who take games seriously.
            </motion.p>

            <motion.div variants={fadeItem} className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonLink to="/discover" size="lg" icon={<ArrowUpRight className="h-4 w-4" strokeWidth={1.7} />}>
                Explore Games
              </ButtonLink>
              <ButtonLink
                to="/genres"
                variant="secondary"
                size="lg"
                icon={<Compass className="h-4 w-4" strokeWidth={1.6} />}
              >
                Discover Genres
              </ButtonLink>
            </motion.div>

            <motion.div variants={fadeItem} className="mt-12 flex items-center gap-6 lg:mt-14">
              <a
                href="#discover"
                className="group flex items-center gap-4 text-white/50 transition hover:text-white"
                aria-label="Scroll to discover games"
              >
                <span className="relative flex h-11 w-6 items-start justify-center overflow-hidden rounded-full border border-white/20 py-2">
                  <span className="h-2 w-0.5 animate-scroll-pulse rounded-full bg-accent-soft" />
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.22em]">Scroll to explore</span>
                <ArrowDown className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:translate-y-0.5 group-hover:opacity-100" />
              </a>

              <div className="hidden h-8 w-px bg-white/10 sm:block" />

              <div className="hidden items-center gap-5 sm:flex">
                {[
                  [String(games.length).padStart(2, '0'), 'Titles'],
                  [String(genres.length).padStart(2, '0'), 'Genres'],
                  ['04', 'Platforms'],
                ].map(([value, label]) => (
                  <div key={label} className="flex flex-col gap-1">
                    <span className="font-display text-sm font-medium text-white/85">{value}</span>
                    <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/30">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {game ? (
            <motion.aside
              initial={reduce ? false : { opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.7, ease: EASE }}
              className="hidden pb-20 lg:block"
            >
              <div className="relative">
                <span className="absolute -left-5 top-0 h-px w-3 bg-white/20" />
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-white/40">On the cover</span>
                  <ScoreBadge score={game.score} compact />
                </div>

                <div className="group block overflow-hidden rounded-2xl border border-white/12 bg-black/25 p-2.5 backdrop-blur-xl transition-colors duration-500 hover:border-white/25">
                  <Link
                    to={`/games/${game.slug}`}
                    className="block"
                    aria-label={`Open the ${game.title} dossier`}
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-xl">
                      <SafeImage
                        key={game.slug}
                        src={game.cover}
                        alt={`${game.title} cover`}
                        title={game.title}
                        priority
                        className="absolute inset-0 h-full w-full"
                        imgClassName="transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/0 to-black/15" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/50">
                          {game.year} · {game.developer}
                        </p>
                        <p className="mt-1.5 font-display text-lg font-medium leading-tight tracking-[-0.03em] text-white">
                          {game.title}
                        </p>
                      </div>
                      <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur-md transition group-hover:bg-white group-hover:text-black">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>

                  <div className="flex items-center justify-between px-1.5 pb-0.5 pt-3.5">
                    <Link
                      to={`/games/${game.slug}`}
                      className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/40 transition group-hover:text-accent-soft"
                    >
                      View dossier
                    </Link>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleStep(-1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-white/25 hover:text-white"
                        aria-label="Previous featured game"
                      >
                        <ArrowLeft className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStep(1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-white/25 hover:text-white"
                        aria-label="Next featured game"
                      >
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5" role="tablist" aria-label="Featured game selection">
                    {featured.map((item, index) => (
                      <button
                        key={item.slug}
                        type="button"
                        role="tab"
                        aria-selected={index === active}
                        aria-label={`Feature ${item.title}`}
                        onClick={() => setActive(index)}
                        className={`h-1 rounded-full transition-all duration-500 ${
                          index === active ? 'w-7 bg-accent-soft' : 'w-2.5 bg-white/20 hover:bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[8px] tracking-[0.18em] text-white/30">
                    {String(active + 1).padStart(2, '0')} / {String(featured.length).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </motion.aside>
          ) : null}
        </div>

        <div className="relative flex items-center justify-between border-t border-white/10 py-4 lg:py-5">
          <div className="hidden items-center gap-3 sm:flex">
            <Play className="h-3 w-3 fill-white/60 text-white/60" />
            <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">
              An independent game encyclopedia
            </span>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">
              {game ? `Featuring ${game.title}` : 'Curated with care'}
            </span>
            <span className="mx-2 h-1 w-1 rounded-full bg-white/20" />
            <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">
              Editorial score {game ? formatScore(game.score) : '—'}
            </span>
          </div>
          <Link
            to={game ? `/games/${game.slug}` : '/discover'}
            className="ml-auto inline-flex shrink-0 items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/45 transition hover:text-white md:ml-0"
          >
            Enter the archive
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </motion.div>

      <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 rotate-180 lg:block [writing-mode:vertical-rl]">
        <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-white/20">
          The game encyclopedia · Est. 2026
        </span>
      </div>
    </section>
  )
}
