import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  Check,
  Database,
  Eye,
  EyeOff,
  Gamepad2,
  Github,
  Loader2,
  Lock,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldCheck,
  Trash2,
  TriangleAlert,
  X,
} from 'lucide-react'
import { GameEditor } from '@/components/admin/GameEditor'
import { Logo, LogoMark } from '@/components/Logo'
import { SafeImage } from '@/components/SafeImage'
import { ApiError, encodeAuth, fetchContent, saveContent } from '@/admin/api'
import { builtInGames } from '@/data/games'
import { mergeGameCatalog, normalizeContent } from '@/data/games/merge'
import type { Game, GameContent } from '@/data/types'
import { useSEO } from '@/hooks/useSEO'
import { cn } from '@/lib/utils'

const AUTH_KEY = 'gv-admin-auth'
const REPO_URL = 'https://github.com/ubaidsalmanloq-dotcom/gameverse'

type Status = 'login' | 'loading' | 'ready' | 'error'
type Filter = 'all' | 'aaa' | 'custom' | 'edited' | 'deleted'

interface EditorState {
  game: Game
  isNew: boolean
  isBuiltIn: boolean
  originalSlug: string
}

const filters: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All dossiers' },
  { id: 'aaa', label: 'AAA' },
  { id: 'custom', label: 'Custom' },
  { id: 'edited', label: 'Edited' },
  { id: 'deleted', label: 'Removed' },
]

function readAuth(): string | null {
  try {
    return sessionStorage.getItem(AUTH_KEY)
  } catch {
    return null
  }
}

function newGameDraft(): Game {
  return {
    slug: '',
    title: '',
    year: new Date().getFullYear(),
    releaseDate: '',
    developer: '',
    publisher: '',
    genres: ['action'],
    primaryGenre: 'action',
    platforms: ['PC'],
    platformNote: '',
    modes: ['Single-player'],
    score: 8,
    tagline: '',
    shortDescription: '',
    overview: '',
    story: '',
    spoiler: '',
    gameplay: [{ title: 'Combat', body: '' }],
    features: [{ title: '', body: '' }],
    engine: '',
    storage: '',
    cover: '',
    hero: '',
    keyArt: '',
    gallery: [],
    accent: '#8b5cf6',
    aaa: false,
    popularity: 50,
    similar: [],
  }
}

function cloneContent(content: GameContent): GameContent {
  return {
    ...content,
    overrides: { ...content.overrides },
    custom: [...content.custom],
    deleted: [...content.deleted],
  }
}

function LoginScreen({
  loading,
  error,
  onLogin,
}: {
  loading: boolean
  error: string
  onLogin: (username: string, password: string) => void
}) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(139,92,246,0.16),transparent_45%)]" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-[0.14] [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]" />
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <div className="rounded-3xl border border-white/10 bg-[#0d0f16]/90 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10">
              <Lock className="h-5 w-5 text-accent-soft" />
            </span>
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.28em] text-accent-soft/80">Restricted access</p>
              <h1 className="font-display text-2xl font-semibold tracking-[-0.04em] text-white">Control Room</h1>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-white/45">
            Sign in to manage dossiers. Changes are committed to GitHub and deployed automatically.
          </p>

          <form
            className="mt-7 space-y-4"
            onSubmit={(event) => {
              event.preventDefault()
              onLogin(username.trim(), password)
            }}
          >
            <label className="block">
              <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">Username</span>
              <input
                value={username}
                autoComplete="username"
                onChange={(event) => setUsername(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#08090d] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-accent/60 focus:ring-2 focus:ring-accent/15"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">Password</span>
              <span className="relative block">
                <input
                  type={visible ? 'text' : 'password'}
                  value={password}
                  autoComplete="current-password"
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#08090d] px-4 py-3 pr-12 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-accent/60 focus:ring-2 focus:ring-accent/15"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setVisible((value) => !value)}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-white/35 transition hover:text-white/70"
                  aria-label={visible ? 'Hide password' : 'Show password'}
                >
                  {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
            </label>

            {error ? (
              <div className="flex items-start gap-2 rounded-xl border border-red-400/25 bg-red-400/[0.07] px-3 py-2.5 text-xs leading-relaxed text-red-200">
                <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading || !password}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#f4f1ea] px-5 py-3 text-sm font-medium text-[#0a0a0f] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              {loading ? 'Verifying...' : 'Enter control room'}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-[11px] text-white/30">
            <Link to="/" className="transition hover:text-white/65">
              Back to site
            </Link>
            <span className="font-mono text-[8px] uppercase tracking-[0.18em]">Admin · Upload access</span>
          </div>
        </div>
        <p className="mt-5 text-center text-[11px] leading-relaxed text-white/25">
          Admin tools are served from the Vercel deployment. Content changes create a GitHub commit.
        </p>
      </div>
    </div>
  )
}

function StatusChip({ tone, children }: { tone: 'accent' | 'amber' | 'neutral' | 'red'; children: ReactNode }) {
  const tones = {
    accent: 'border-accent/35 bg-accent/10 text-accent-soft',
    amber: 'border-amber-300/30 bg-amber-300/[0.08] text-amber-200',
    neutral: 'border-white/10 bg-white/[0.03] text-white/40',
    red: 'border-red-400/30 bg-red-400/[0.08] text-red-200',
  }
  return (
    <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.16em]', tones[tone])}>
      {children}
    </span>
  )
}

export default function Admin() {
  useSEO({
    title: 'Control Room — GAMEVERSE',
    description: 'Private GAMEVERSE administration.',
  })

  useEffect(() => {
    const meta = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    const previous = meta?.getAttribute('content') ?? null
    if (meta) meta.setAttribute('content', 'noindex,nofollow')
    else {
      const created = document.createElement('meta')
      created.name = 'robots'
      created.content = 'noindex,nofollow'
      document.head.appendChild(created)
    }
    return () => {
      if (meta && previous !== null) meta.setAttribute('content', previous)
    }
  }, [])

  const [auth, setAuth] = useState<string | null>(() => readAuth())
  const [status, setStatus] = useState<Status>(() => (readAuth() ? 'loading' : 'login'))
  const [loginError, setLoginError] = useState('')
  const [actionError, setActionError] = useState('')
  const [notice, setNotice] = useState('')
  const [commitUrl, setCommitUrl] = useState<string | null>(null)
  const [content, setContent] = useState<GameContent | null>(null)
  const [sha, setSha] = useState<string | null>(null)
  const [editor, setEditor] = useState<EditorState | null>(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [busy, setBusy] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [deleting, setDeleting] = useState<Game | null>(null)

  const builtInBySlug = useMemo(() => Object.fromEntries(builtInGames.map((game) => [game.slug, game])), [])
  const builtInSlugs = useMemo(() => new Set(builtInGames.map((game) => game.slug)), [builtInGames])

  const load = useCallback(async (authHeader: string, silent = false) => {
    if (!silent) setStatus('loading')
    setActionError('')
    try {
      const response = await fetchContent(authHeader)
      setContent(normalizeContent(response.content))
      setSha(response.sha)
      setAuth(authHeader)
      setStatus('ready')
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        sessionStorage.removeItem(AUTH_KEY)
        setAuth(null)
        setStatus('login')
        setLoginError('Invalid username or password.')
        return
      }
      setActionError(error instanceof Error ? error.message : 'Could not load content.')
      setStatus(silent ? 'ready' : 'error')
    }
  }, [])

  useEffect(() => {
    const stored = readAuth()
    if (stored) void load(stored)
  }, [load])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 12000)
    return () => window.clearTimeout(timer)
  }, [notice])

  const handleLogin = async (username: string, password: string) => {
    if (!username || !password) {
      setLoginError('Enter your username and password.')
      return
    }
    setLoginError('')
    setStatus('loading')
    let header = ''
    try {
      header = encodeAuth(username, password)
    } catch {
      setStatus('login')
      setLoginError('Credentials must use standard characters.')
      return
    }
    try {
      const response = await fetchContent(header)
      sessionStorage.setItem(AUTH_KEY, header)
      setAuth(header)
      setContent(normalizeContent(response.content))
      setSha(response.sha)
      setStatus('ready')
    } catch (error) {
      setStatus('login')
      if (error instanceof ApiError && error.status === 401) {
        setLoginError('Invalid username or password.')
      } else if (error instanceof ApiError && error.status === 404) {
        setLoginError('Admin API is not available on this host. Use the Vercel deployment.')
      } else if (error instanceof ApiError && error.status === 503) {
        setLoginError('Admin is not configured yet. Set the Vercel environment variables and redeploy.')
      } else {
        setLoginError(error instanceof Error ? error.message : 'Login failed.')
      }
    }
  }

  const signOut = () => {
    sessionStorage.removeItem(AUTH_KEY)
    setAuth(null)
    setContent(null)
    setSha(null)
    setEditor(null)
    setStatus('login')
    setLoginError('')
  }

  const mergedGames = useMemo(() => (content ? mergeGameCatalog(builtInGames, content) : []), [content])
  const customSlugs = useMemo(() => new Set(content?.custom.map((game) => game.slug) ?? []), [content])
  const overrideSlugs = useMemo(() => new Set(Object.keys(content?.overrides ?? {})), [content])
  const deletedSlugs = useMemo(() => new Set(content?.deleted ?? []), [content])

  const allGamesBySlug = useMemo(() => Object.fromEntries([...builtInGames, ...mergedGames].map((game) => [game.slug, game])), [mergedGames])

  const stats = useMemo(
    () => ({
      total: mergedGames.length,
      aaa: mergedGames.filter((game) => game.aaa).length,
      custom: content?.custom.length ?? 0,
      edited: Object.keys(content?.overrides ?? {}).length,
      removed: content?.deleted.length ?? 0,
    }),
    [mergedGames, content],
  )

  const visibleGames = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const base =
      filter === 'deleted'
        ? [...deletedSlugs].map((slug) => allGamesBySlug[slug] ?? builtInBySlug[slug]).filter(Boolean)
        : mergedGames.filter((game) => {
            if (filter === 'aaa') return game.aaa
            if (filter === 'custom') return customSlugs.has(game.slug)
            if (filter === 'edited') return overrideSlugs.has(game.slug)
            return true
          })
    if (!needle) return base
    return base.filter((game) =>
      `${game.title} ${game.slug} ${game.developer} ${game.publisher}`.toLowerCase().includes(needle),
    )
  }, [allGamesBySlug, builtInBySlug, customSlugs, deletedSlugs, filter, mergedGames, overrideSlugs, query])

  const persist = async (next: GameContent, message: string): Promise<boolean> => {
    if (!auth) return false
    setBusy(true)
    setActionError('')
    try {
      const response = await saveContent(auth, { ...next, updatedAt: new Date().toISOString() }, sha, message)
      setContent(normalizeContent(response.content))
      setSha(response.sha)
      setCommitUrl(response.commitUrl)
      setNotice('Published to GitHub. Vercel and GitHub Pages are rebuilding now.')
      return true
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setActionError('Content changed elsewhere. Reloading the latest version — try again.')
        await load(auth, true)
      } else {
        setActionError(error instanceof Error ? error.message : 'Could not publish changes.')
      }
      return false
    } finally {
      setBusy(false)
    }
  }

  const startNew = () => {
    const game = newGameDraft()
    setEditor({ game, isNew: true, isBuiltIn: false, originalSlug: game.slug })
  }

  const startEdit = (game: Game) => {
    const isCustom = customSlugs.has(game.slug)
    setEditor({ game, isNew: false, isBuiltIn: !isCustom && builtInSlugs.has(game.slug), originalSlug: game.slug })
  }

  const saveEditor = async (draft: Game) => {
    if (!content || !editor) return
    const next = cloneContent(content)
    if (editor.isNew) {
      next.custom.push(draft)
      next.deleted = next.deleted.filter((slug) => slug !== draft.slug)
    } else if (editor.isBuiltIn) {
      next.overrides[editor.originalSlug] = draft
      next.deleted = next.deleted.filter((slug) => slug !== editor.originalSlug)
    } else {
      next.custom = next.custom.map((game) => (game.slug === editor.originalSlug ? draft : game))
    }
    const published = await persist(next, `admin: ${editor.isNew ? 'add' : 'update'} ${draft.slug}`)
    if (published) setEditor(null)
  }

  const confirmDelete = async () => {
    if (!deleting || !content) return
    const next = cloneContent(content)
    if (customSlugs.has(deleting.slug)) {
      next.custom = next.custom.filter((game) => game.slug !== deleting.slug)
    } else {
      delete next.overrides[deleting.slug]
      if (!next.deleted.includes(deleting.slug)) next.deleted.push(deleting.slug)
    }
    const published = await persist(next, `admin: remove ${deleting.slug}`)
    if (published) setDeleting(null)
  }

  const resetOverride = async (game: Game) => {
    if (!content) return
    const next = cloneContent(content)
    delete next.overrides[game.slug]
    const published = await persist(next, `admin: reset ${game.slug}`)
    if (published) setNotice(`Restored the original ${game.title} dossier. Rebuilding now.`)
  }

  const restoreGame = async (game: Game) => {
    if (!content) return
    const next = cloneContent(content)
    next.deleted = next.deleted.filter((slug) => slug !== game.slug)
    const published = await persist(next, `admin: restore ${game.slug}`)
    if (published) setNotice(`Restored ${game.title}. Rebuilding now.`)
  }

  const refresh = async () => {
    if (!auth || refreshing) return
    setRefreshing(true)
    await load(auth, true)
    setRefreshing(false)
  }

  if (status === 'login') {
    return <LoginScreen loading={false} error={loginError} onLogin={handleLogin} />
  }

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#08090d]">
        <span className="relative flex h-12 w-12 items-center justify-center">
          <span className="absolute inset-0 animate-ping rounded-full border border-accent/30" />
          <LogoMark className="h-9 w-9 animate-pulse" />
        </span>
        <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/35">Opening the control room</p>
      </div>
    )
  }

  if (status === 'error' || !content) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0d0f16] p-7 text-center">
          <TriangleAlert className="mx-auto h-8 w-8 text-amber-300" />
          <h1 className="mt-4 font-display text-2xl font-semibold text-white">Control room unavailable</h1>
          <p className="mt-2 text-sm leading-relaxed text-white/45">{actionError || 'Could not load admin content.'}</p>
          <div className="mt-6 flex justify-center gap-2">
            <button
              type="button"
              onClick={() => auth && load(auth)}
              className="inline-flex items-center gap-2 rounded-full bg-[#f4f1ea] px-5 py-2.5 text-xs font-medium text-[#0a0a0f] transition hover:bg-white"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry
            </button>
            <button
              type="button"
              onClick={signOut}
              className="rounded-full border border-white/10 px-4 py-2.5 text-xs text-white/55 transition hover:border-white/25 hover:text-white"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (editor) {
    return (
      <div className="min-h-screen bg-[#08090d] text-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <GameEditor
            key={`${editor.isNew ? 'new' : 'edit'}-${editor.originalSlug}`}
            game={editor.game}
            isNew={editor.isNew}
            existingSlugs={Array.from(new Set([...builtInGames.map((game) => game.slug), ...content.custom.map((game) => game.slug)]))}
            saving={busy}
            onCancel={() => setEditor(null)}
            onSave={saveEditor}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#08090d] text-white">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#08090d]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Logo />
            <span className="hidden rounded-full border border-accent/30 bg-accent/[0.08] px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.2em] text-accent-soft sm:inline-flex">
              Control room
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-white/55 transition hover:border-white/25 hover:text-white"
            >
              View site <ArrowUpRight className="h-3 w-3" />
            </Link>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-white/55 transition hover:border-white/25 hover:text-white"
            >
              <Github className="h-3 w-3" /> Repo
            </a>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-white/55 transition hover:border-white/25 hover:text-white"
            >
              <LogOut className="h-3 w-3" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-accent-soft/80">GAMEVERSE administration</p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-[-0.045em] text-white sm:text-4xl">Dossier control room</h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/40">
              Edit the archive, add new games, or remove dossiers. Every publish creates a GitHub commit and triggers both deployments.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={refresh}
              disabled={refreshing || busy}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-xs text-white/55 transition hover:border-white/25 hover:text-white disabled:opacity-50"
            >
              <RefreshCw className={cn('h-3.5 w-3.5', refreshing && 'animate-spin')} /> Refresh
            </button>
            <button
              type="button"
              onClick={startNew}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-full bg-[#f4f1ea] px-5 py-2.5 text-xs font-medium text-[#0a0a0f] transition hover:bg-white disabled:opacity-50"
            >
              <Plus className="h-3.5 w-3.5" /> New game
            </button>
          </div>
        </div>

        {notice ? (
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.06] px-4 py-3 text-xs text-emerald-100">
            <Check className="h-4 w-4 shrink-0" />
            <span className="min-w-0 flex-1">{notice}</span>
            {commitUrl ? (
              <a href={commitUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-emerald-200 underline-offset-4 hover:underline">
                View commit <ArrowUpRight className="h-3 w-3" />
              </a>
            ) : null}
            <button type="button" onClick={() => setNotice('')} aria-label="Dismiss notice" className="text-emerald-200/60 hover:text-emerald-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : null}

        {actionError ? (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-400/25 bg-red-400/[0.06] px-4 py-3 text-xs leading-relaxed text-red-100">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
            <span className="min-w-0 flex-1">{actionError}</span>
            <button type="button" onClick={() => setActionError('')} aria-label="Dismiss error" className="text-red-200/60 hover:text-red-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : null}

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { label: 'Live dossiers', value: stats.total, icon: Gamepad2 },
            { label: 'AAA features', value: stats.aaa, icon: ShieldCheck },
            { label: 'Custom games', value: stats.custom, icon: Plus },
            { label: 'Edited built-ins', value: stats.edited, icon: Pencil },
            { label: 'Removed', value: stats.removed, icon: Trash2 },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-[#0d0f16]/80 p-4">
              <div className="flex items-center justify-between text-white/30">
                <span className="font-mono text-[8px] uppercase tracking-[0.18em]">{label}</span>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <p className="mt-3 font-display text-3xl font-semibold tracking-[-0.04em] text-white">{value}</p>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search title, slug, developer..."
              className="w-full rounded-full border border-white/10 bg-[#0b0d13] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-accent/60"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 rounded-full border border-white/10 bg-[#0b0d13] p-1.5">
            {filters.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setFilter(entry.id)}
                className={cn(
                  'rounded-full px-3.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] transition',
                  filter === entry.id ? 'bg-white/[0.09] text-white' : 'text-white/35 hover:text-white/70',
                )}
              >
                {entry.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f16]/70">
          <div className="hidden grid-cols-[minmax(0,1fr)_120px_130px_150px] gap-4 border-b border-white/[0.07] px-5 py-3 font-mono text-[8px] uppercase tracking-[0.18em] text-white/25 md:grid">
            <span>Dossier</span>
            <span>Score</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>

          {visibleGames.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <Database className="mx-auto h-7 w-7 text-white/20" />
              <p className="mt-3 text-sm text-white/40">{filter === 'deleted' ? 'No removed dossiers.' : 'No dossiers match this view.'}</p>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {visibleGames.map((game) => {
                const isCustom = customSlugs.has(game.slug)
                const isEdited = overrideSlugs.has(game.slug)
                const isRemoved = filter === 'deleted' || deletedSlugs.has(game.slug)
                return (
                  <div
                    key={game.slug}
                    className={cn(
                      'grid gap-4 px-4 py-4 transition hover:bg-white/[0.015] md:grid-cols-[minmax(0,1fr)_120px_130px_150px] md:items-center md:px-5',
                      isRemoved && 'opacity-65',
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <SafeImage
                        src={game.cover || '/favicon.svg'}
                        alt=""
                        title={game.title}
                        className="h-16 w-12 shrink-0 rounded-lg border border-white/10"
                      />
                      <div className="min-w-0">
                        <p className="truncate font-display text-sm font-medium text-white">{game.title}</p>
                        <p className="mt-0.5 truncate font-mono text-[9px] uppercase tracking-[0.14em] text-white/30">
                          {game.year} · {game.developer}
                        </p>
                        <p className="mt-1 truncate text-[11px] text-white/25">/{game.slug}</p>
                      </div>
                    </div>

                    <div className="hidden md:block">
                      <span className="font-mono text-sm text-white/80">GV {game.score.toFixed(1)}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 md:block">
                      {isRemoved ? <StatusChip tone="red">Removed</StatusChip> : null}
                      {!isRemoved && isCustom ? <StatusChip tone="accent">Custom</StatusChip> : null}
                      {!isRemoved && isEdited ? <StatusChip tone="amber">Edited</StatusChip> : null}
                      {!isRemoved && !isCustom && !isEdited ? <StatusChip tone="neutral">Built-in</StatusChip> : null}
                      {game.aaa ? <span className="ml-1 hidden font-mono text-[8px] uppercase tracking-[0.14em] text-white/25 md:inline">AAA</span> : null}
                    </div>

                    <div className="flex items-center justify-start gap-1.5 md:justify-end">
                      {isRemoved ? (
                        <button
                          type="button"
                          onClick={() => restoreGame(game)}
                          disabled={busy}
                          className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 px-3 py-1.5 text-[10px] text-emerald-200 transition hover:bg-emerald-400/10 disabled:opacity-50"
                        >
                          <RotateCcw className="h-3 w-3" /> Restore
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(game)}
                            disabled={busy}
                            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[10px] text-white/55 transition hover:border-white/25 hover:text-white disabled:opacity-50"
                          >
                            <Pencil className="h-3 w-3" /> Edit
                          </button>
                          {isEdited ? (
                            <button
                              type="button"
                              onClick={() => resetOverride(game)}
                              disabled={busy}
                              title="Reset to the built-in dossier"
                              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-white/35 transition hover:border-white/25 hover:text-white disabled:opacity-50"
                            >
                              <RotateCcw className="h-3 w-3" />
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => setDeleting(game)}
                            disabled={busy}
                            title="Remove this dossier"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-white/35 transition hover:border-red-400/40 hover:text-red-300 disabled:opacity-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <p className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-white/25">
          <ShieldCheck className="h-3 w-3" />
          Publishing requires the admin token stored in Vercel environment variables. No credentials ship to the browser.
        </p>
      </main>

      {deleting ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#0d0f16] p-6 shadow-2xl">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-red-400/30 bg-red-400/10">
                <Trash2 className="h-4 w-4 text-red-300" />
              </span>
              <div>
                <h2 className="font-display text-lg font-medium text-white">Remove dossier?</h2>
                <p className="text-xs text-white/35">This takes {deleting.title} offline.</p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-white/40">
              Built-in games can be restored from the Removed filter. Custom games are deleted permanently.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleting(null)}
                disabled={busy}
                className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/55 transition hover:border-white/25 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-full bg-red-400/90 px-4 py-2 text-xs font-medium text-[#190708] transition hover:bg-red-300 disabled:opacity-50"
              >
                {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
