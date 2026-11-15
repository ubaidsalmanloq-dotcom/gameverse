import { ArrowLeft, ArrowUpRight, Compass, Shuffle } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { LogoMark } from '@/components/Logo'
import { games } from '@/data/games'
import { useSEO } from '@/hooks/useSEO'

export function NotFound() {
  const navigate = useNavigate()
  useSEO({
    title: 'Signal Lost — GAMEVERSE',
    description: 'This route does not exist in the GAMEVERSE archive. Return to the home page or discover a game dossier.',
  })

  const openRandomGame = () => {
    const game = games[Math.floor(Math.random() * games.length)]
    navigate(`/games/${game.slug}`)
  }

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pb-16 pt-28">
      <div className="absolute inset-0 -z-10">
        <img
          src="/media/gallery/control-2.webp"
          alt=""
          className="h-full w-full object-cover opacity-25"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#08090d_0%,rgba(8,9,13,0.85)_55%,rgba(8,9,13,0.4)_100%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090d] via-transparent to-[#08090d]/70" />
        <div className="absolute inset-0 bg-grid opacity-[0.15] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-[1fr_260px] lg:items-center">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <p className="eyebrow">Error 404 / signal lost</p>
            </div>
            <p className="mt-5 font-display text-[clamp(5rem,16vw,12rem)] font-semibold leading-[0.8] tracking-[-0.08em] text-white/10">
              404
            </p>
            <h1 className="display -mt-4 text-[clamp(2.6rem,7vw,5.6rem)] text-white">
              This room is not
              <br />
              in the <span className="serif-accent text-white/45">archive.</span>
            </h1>
            <p className="mt-5 max-w-lg text-[13px] leading-relaxed text-mist">
              The page may have moved, the dossier may not exist, or the URL may be incomplete. The archive
              is still open.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full bg-[#f4f1ea] px-5 py-3 text-[12px] font-medium text-[#0a0a0f] transition hover:bg-accent-soft"
              >
                <ArrowLeft className="h-4 w-4" />
                Back home
              </Link>
              <Link
                to="/discover"
                className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/[0.04] px-5 py-3 text-[12px] text-white transition hover:border-white/25 hover:bg-white/[0.08]"
              >
                <Compass className="h-4 w-4" />
                Browse dossiers
              </Link>
              <button
                type="button"
                onClick={openRandomGame}
                className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-3 text-[12px] text-white/65 transition hover:border-white/25 hover:text-white"
              >
                <Shuffle className="h-4 w-4" />
                Random game
              </button>
            </div>
          </div>

          <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-5">
            <span className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-black/25 backdrop-blur-md">
              <LogoMark className="h-10 w-10 opacity-60" />
            </span>
            <span className="font-mono text-[8px] uppercase tracking-[0.28em] text-white/25 [writing-mode:vertical-rl]">
              GAMEVERSE / ARCHIVE
            </span>
            <Link
              to="/about"
              className="inline-flex items-center gap-1.5 font-mono text-[8px] uppercase tracking-[0.14em] text-white/30 transition hover:text-white/70"
            >
              About
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
