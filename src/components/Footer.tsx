import { useState, type FormEvent } from 'react'
import { ArrowUpRight, Check, Shuffle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { games } from '@/data/games'
import { genres } from '@/data/genres'
import { Logo } from './Logo'

const exploreLinks = [
  { label: 'Discover all games', to: '/discover' },
  { label: 'AAA dossiers', to: '/aaa' },
  { label: 'Genres explained', to: '/genres' },
  { label: 'Platform guide', to: '/platforms' },
  { label: 'About GAMEVERSE', to: '/about' },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())
    if (!valid) {
      setError('Enter a valid email address.')
      return
    }
    try {
      window.localStorage.setItem('gameverse:newsletter', email.trim())
    } catch {
      // Local storage can be unavailable in private mode; the confirmation still works for this session.
    }
    setError('')
    setSubscribed(true)
  }

  const openRandomGame = () => {
    const game = games[Math.floor(Math.random() * games.length)]
    navigate(`/games/${game.slug}`)
  }

  return (
    <footer className="relative mt-28 overflow-hidden border-t border-white/[0.08] bg-[#07080b]">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[28rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.08] blur-[130px]" />
        <div className="absolute inset-0 bg-grid opacity-[0.12] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
      </div>

      <div className="shell pt-16 sm:pt-20">
        <div className="grid gap-12 border-b border-white/[0.08] pb-14 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:gap-16">
          <div>
            <Logo />
            <p className="mt-6 max-w-sm text-[13px] leading-relaxed text-mist">
              A curated encyclopedia of modern games — the worlds, the craft, and the technology behind
              play. Built for readers who want context, not hype.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={openRandomGame}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.035] px-4 py-2.5 text-[11px] text-white/80 transition hover:border-white/25 hover:bg-white/[0.07] hover:text-white"
              >
                <Shuffle className="h-3.5 w-3.5" strokeWidth={1.7} />
                Random dossier
              </button>
              <Link
                to="/discover"
                className="inline-flex items-center gap-1.5 text-[11px] text-white/45 transition hover:text-white"
              >
                Browse the archive
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div>
            <p className="eyebrow">Explore</p>
            <ul className="mt-5 space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="link-underline inline-block text-[13px] text-mist transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">Genres</p>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">
              {genres.slice(0, 10).map((genre) => (
                <li key={genre.id}>
                  <Link
                    to={`/genres?genre=${genre.id}`}
                    className="text-[12px] text-mist transition hover:text-white"
                  >
                    {genre.shortName}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to="/genres"
              className="mt-5 inline-flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.16em] text-accent-soft/80 transition hover:text-accent-soft"
            >
              All genres
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="grid gap-8 border-b border-white/[0.08] py-10 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
          <div>
            <p className="eyebrow text-accent-soft/70">The dispatch</p>
            <h2 className="mt-3 font-display text-[clamp(1.7rem,3vw,2.5rem)] font-medium leading-[1.05] tracking-[-0.04em] text-white">
              One considered email.
              <br />
              <span className="serif-accent text-white/55">No noise.</span>
            </h2>
            <p className="mt-3 max-w-md text-[12.5px] leading-relaxed text-mist">
              A monthly note on the dossiers, systems, and design ideas worth your time. This demo stores
              your signup locally in the browser.
            </p>
          </div>

          <div>
            {subscribed ? (
              <div className="flex items-start gap-3 rounded-2xl border border-accent/25 bg-accent/[0.06] p-5">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[#0a0a0f]">
                  <Check className="h-4 w-4" strokeWidth={2.2} />
                </span>
                <div>
                  <p className="text-sm font-medium text-white">You’re on the local list.</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-mist">
                    Since this is a front-end demo, no email is actually sent. The confirmation is saved on
                    this device.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubscribed(false)
                      setEmail('')
                    }}
                    className="mt-3 font-mono text-[8px] uppercase tracking-[0.16em] text-accent-soft transition hover:text-white"
                  >
                    Use another email
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} noValidate>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <label htmlFor="footer-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="footer-email"
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      if (error) setError('')
                    }}
                    placeholder="you@example.com"
                    autoComplete="email"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? 'footer-email-error' : undefined}
                    className="h-12 flex-1 rounded-full border border-white/12 bg-white/[0.035] px-5 text-[13px] text-white placeholder:text-white/25 transition focus:border-accent/60 focus:bg-white/[0.05] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="h-12 shrink-0 rounded-full bg-[#f4f1ea] px-6 text-[12px] font-medium text-[#0a0a0f] transition hover:bg-accent-soft"
                  >
                    Join the dispatch
                  </button>
                </div>
                {error ? (
                  <p id="footer-email-error" className="mt-2 pl-5 text-[11px] text-[#f79b8b]" role="alert">
                    {error}
                  </p>
                ) : (
                  <p className="mt-2 pl-5 font-mono text-[8px] uppercase tracking-[0.14em] text-white/25">
                    Monthly · unsubscribe anytime · no tracking pixels here
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        <div className="py-8">
          <p className="max-w-3xl text-[10px] leading-relaxed text-white/30">
            GAMEVERSE is an independent editorial concept. All game artwork, trademarks, and titles belong
            to their respective publishers and developers. GV scores are GAMEVERSE editorial assessments,
            not review aggregates; PC requirements are approximate and may change with updates. This site is
            a demonstration and is not affiliated with any platform holder or publisher.
          </p>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/[0.08] py-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">
            © 2026 GAMEVERSE · Built for the curious
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/about" className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/30 transition hover:text-white/70">
              Editorial policy
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/30 transition hover:text-white/70"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>

      <div className="shell pointer-events-none select-none overflow-hidden pb-2">
        <p
          className="whitespace-nowrap text-center font-display text-[clamp(4rem,15vw,14rem)] font-semibold leading-[0.72] tracking-[-0.07em] text-white/[0.035]"
          aria-hidden="true"
        >
          GAMEVERSE
        </p>
      </div>
    </footer>
  )
}
