import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Footer } from '@/components/Footer'
import { LogoMark } from '@/components/Logo'
import { Navbar } from '@/components/Navbar'

const Home = lazy(() => import('@/pages/Home').then((module) => ({ default: module.Home })))
const Discover = lazy(() => import('@/pages/Discover').then((module) => ({ default: module.Discover })))
const AaaGames = lazy(() => import('@/pages/AaaGames').then((module) => ({ default: module.AaaGames })))
const Genres = lazy(() => import('@/pages/Genres').then((module) => ({ default: module.Genres })))
const Platforms = lazy(() => import('@/pages/Platforms').then((module) => ({ default: module.Platforms })))
const About = lazy(() => import('@/pages/About').then((module) => ({ default: module.About })))
const GamePage = lazy(() => import('@/pages/GamePage').then((module) => ({ default: module.GamePage })))
const NotFound = lazy(() => import('@/pages/NotFound').then((module) => ({ default: module.NotFound })))
const Admin = lazy(() => import('@/pages/Admin'))
const adminEnabled = import.meta.env.VITE_ENABLE_ADMIN === 'true'

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    let cancelled = false
    let attempts = 0

    const scrollToTarget = () => {
      if (cancelled) return
      if (hash) {
        const id = decodeURIComponent(hash.replace('#', ''))
        const element = document.getElementById(id)
        if (element) {
          element.scrollIntoView({ block: 'start', behavior: 'smooth' })
          return
        }
        if (attempts < 12) {
          attempts += 1
          window.setTimeout(scrollToTarget, 110)
        }
        return
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }

    scrollToTarget()
    return () => {
      cancelled = true
    }
  }, [pathname, hash])

  return null
}

function RouteFallback() {
  return (
    <div className="flex min-h-[80svh] items-center justify-center pt-24">
      <div className="flex flex-col items-center gap-4">
        <span className="relative flex h-12 w-12 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full border border-accent/30" />
          <LogoMark className="h-8 w-8 animate-pulse" />
        </span>
        <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-white/30">Opening the archive</span>
      </div>
    </div>
  )
}

function Application() {
  const { pathname } = useLocation()
  const isAdmin = adminEnabled && pathname === '/admin'

  if (isAdmin) {
    return (
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
    )
  }

  return (
    <div className="grain relative min-h-screen overflow-x-clip">
      <div className="ambient-glow" aria-hidden="true" />
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[110] -translate-y-24 rounded-full bg-[#f4f1ea] px-4 py-2 text-xs font-medium text-[#0a0a0f] transition focus:translate-y-0"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/aaa" element={<AaaGames />} />
            <Route path="/genres" element={<Genres />} />
            <Route path="/platforms" element={<Platforms />} />
            <Route path="/about" element={<About />} />
            <Route path="/games/:slug" element={<GamePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '') || '/'}>
      <ScrollToTop />
      <Application />
    </BrowserRouter>
  )
}
