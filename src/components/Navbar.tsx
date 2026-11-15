import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { ArrowUpRight, Menu, Search, Shuffle, X } from 'lucide-react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { games } from '@/data/games'
import { genres } from '@/data/genres'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { EASE } from '@/lib/motion'
import { asset, cn } from '@/lib/utils'
import { Logo } from './Logo'
import { SearchOverlay } from './SearchOverlay'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Discover', to: '/discover' },
  { label: 'Genres', to: '/genres' },
  { label: 'AAA Games', to: '/aaa' },
  { label: 'Platforms', to: '/platforms' },
  { label: 'About', to: '/about' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 })
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useLockBodyScroll(mobileOpen)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setSearchOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      const isTyping =
        target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      } else if (event.key === '/' && !isTyping) {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', handleShortcut)
    return () => document.removeEventListener('keydown', handleShortcut)
  }, [])

  const openRandomGame = () => {
    const pool = games.filter((game) => game.slug !== location.pathname.split('/').pop())
    const game = pool[Math.floor(Math.random() * pool.length)] ?? games[0]
    navigate(`/games/${game.slug}`)
    setMobileOpen(false)
  }

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled || mobileOpen
            ? 'border-b border-white/[0.08] bg-[#08090d]/78 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.8)] backdrop-blur-xl'
            : 'border-b border-transparent bg-gradient-to-b from-black/45 to-transparent',
        )}
      >
        <motion.div
          className="absolute inset-x-0 top-0 z-10 h-px origin-left bg-gradient-to-r from-accent-soft via-accent to-transparent"
          style={{ scaleX: progress }}
          aria-hidden="true"
        />
        <div className="shell flex h-[72px] items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Logo />
            <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'group relative rounded-full px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.14em] transition-colors duration-300',
                      isActive ? 'text-white' : 'text-white/48 hover:text-white/90',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      <span
                        className={cn(
                          'absolute inset-x-3.5 -bottom-[3px] h-px origin-left bg-accent-soft transition-transform duration-300',
                          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                        )}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="group hidden h-9 items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.035] pl-3 pr-2 text-white/55 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white md:flex"
              aria-label="Open search"
            >
              <Search className="h-3.5 w-3.5" strokeWidth={1.7} />
              <span className="font-mono text-[9px] uppercase tracking-[0.12em]">Search</span>
              <kbd className="rounded-md border border-white/10 bg-black/30 px-1.5 py-1 font-mono text-[8px] text-white/35">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] text-white/65 transition hover:bg-white/[0.08] hover:text-white md:hidden"
              aria-label="Open search"
            >
              <Search className="h-4 w-4" strokeWidth={1.7} />
            </button>

            <button
              type="button"
              onClick={openRandomGame}
              className="group hidden h-9 items-center gap-2 rounded-full bg-[#f4f1ea] pl-3.5 pr-4 text-[10px] font-medium uppercase tracking-[0.1em] text-[#0a0a0f] transition hover:bg-accent-soft sm:flex"
              title="Open a random game dossier"
            >
              <Shuffle className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180" strokeWidth={1.8} />
              <span className="hidden xl:inline">Random game</span>
              <span className="xl:hidden">Shuffle</span>
            </button>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.035] text-white transition hover:bg-white/[0.08] lg:hidden"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col bg-[#08090d] pt-[72px] lg:hidden"
          >
            <div className="absolute inset-0 -z-10 overflow-hidden">
              <img
                src={asset('/media/gallery/elden-ring-3.webp')}
                alt=""
                className="h-full w-full object-cover opacity-[0.14]"
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#08090d]/40 via-[#08090d]/80 to-[#08090d]" />
            </div>

            <div className="shell flex flex-1 flex-col overflow-y-auto pb-8 pt-8">
              <nav aria-label="Mobile navigation" className="flex flex-col">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + index * 0.055, duration: 0.5, ease: EASE }}
                  >
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        cn(
                          'group flex items-center justify-between border-b border-white/[0.08] py-4',
                          isActive ? 'text-white' : 'text-white/55',
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <span className="flex items-baseline gap-3">
                            <span className="font-mono text-[9px] tracking-[0.15em] text-white/25">
                              0{index + 1}
                            </span>
                            <span className="font-display text-[clamp(1.8rem,7vw,2.8rem)] font-medium tracking-[-0.04em]">
                              {item.label}
                            </span>
                          </span>
                          <ArrowUpRight
                            className={cn(
                              'h-5 w-5 transition',
                              isActive ? 'text-accent-soft' : 'text-white/20 group-hover:text-white',
                            )}
                          />
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="mt-8"
              >
                <p className="eyebrow">Explore by genre</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {genres.slice(0, 8).map((genre) => (
                    <Link
                      key={genre.id}
                      to={`/genres?genre=${genre.id}`}
                      className="rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-2 text-[11px] text-white/65 transition hover:border-accent/40 hover:text-white"
                    >
                      {genre.shortName}
                    </Link>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.5 }}
                className="mt-auto flex flex-wrap items-center gap-3 pt-10"
              >
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false)
                    setSearchOpen(true)
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-xs text-white"
                >
                  <Search className="h-4 w-4" />
                  Search the archive
                </button>
                <Link
                  to="/discover"
                  className="inline-flex items-center gap-2 rounded-full bg-[#f4f1ea] px-5 py-3 text-xs font-medium text-[#0a0a0f]"
                >
                  Browse all games
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
