import { createHash, timingSafeEqual } from 'node:crypto'
import type { Game, GameContent } from '../../src/data/types'

const REPO = process.env.GITHUB_ADMIN_REPO ?? 'ubaidsalmanloq-dotcom/gameverse'
const BRANCH = process.env.GITHUB_ADMIN_BRANCH ?? 'main'
const CONTENT_PATH = process.env.GITHUB_ADMIN_PATH ?? 'content/admin-content.json'
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const MAX_CONTENT_BYTES = 2_000_000

interface ApiRequest {
  method?: string
  headers: Record<string, string | string[] | undefined>
  body?: unknown
}

interface ApiResponse {
  status(code: number): ApiResponse
  json(body: unknown): void
  setHeader(name: string, value: string): void
}

interface StoredContent {
  version: number
  updatedAt: string
  updatedBy?: string
  overrides: Record<string, Game>
  custom: Game[]
  deleted: string[]
}

function defaultContent(): StoredContent {
  return {
    version: 1,
    updatedAt: '',
    overrides: {},
    custom: [],
    deleted: [],
  }
}

function normalizeContent(value: unknown): StoredContent {
  const source = (value && typeof value === 'object' ? value : {}) as Partial<StoredContent>
  return {
    version: source.version ?? 1,
    updatedAt: source.updatedAt ?? '',
    updatedBy: source.updatedBy,
    overrides: source.overrides && typeof source.overrides === 'object' ? source.overrides : {},
    custom: Array.isArray(source.custom) ? source.custom : [],
    deleted: Array.isArray(source.deleted) ? source.deleted : [],
  }
}

function safeEqual(a: string, b: string): boolean {
  const left = createHash('sha256').update(a).digest()
  const right = createHash('sha256').update(b).digest()
  return timingSafeEqual(left, right)
}

function isAuthorized(req: ApiRequest): boolean {
  const username = process.env.ADMIN_USERNAME
  const password = process.env.ADMIN_PASSWORD
  if (!username || !password) return false
  const header = req.headers.authorization
  if (typeof header !== 'string' || !header.startsWith('Basic ')) return false
  try {
    const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8')
    const split = decoded.indexOf(':')
    if (split < 0) return false
    return safeEqual(decoded.slice(0, split), username) && safeEqual(decoded.slice(split + 1), password)
  } catch {
    return false
  }
}

function validateGame(game: unknown, location: string): string | null {
  if (!game || typeof game !== 'object') return `${location} is not a game object`
  const entry = game as Partial<Game>
  if (typeof entry.slug !== 'string' || !SLUG_PATTERN.test(entry.slug)) return `${location} has an invalid slug`
  if (typeof entry.title !== 'string' || !entry.title.trim()) return `${location} is missing a title`
  if (typeof entry.year !== 'number' || !Number.isFinite(entry.year)) return `${location} has an invalid year`
  if (typeof entry.score !== 'number' || !Number.isFinite(entry.score)) return `${location} has an invalid score`
  if (!Array.isArray(entry.genres) || entry.genres.length === 0) return `${location} needs at least one genre`
  if (!Array.isArray(entry.platforms)) return `${location} is missing platforms`
  if (!Array.isArray(entry.gallery)) return `${location} is missing a gallery`
  if (typeof entry.cover !== 'string' || !entry.cover) return `${location} is missing a cover`
  if (typeof entry.hero !== 'string' || !entry.hero) return `${location} is missing a hero image`
  return null
}

function validateContent(value: unknown): { content?: StoredContent; error?: string } {
  const serialized = JSON.stringify(value)
  if (serialized.length > MAX_CONTENT_BYTES) return { error: 'Content payload is too large' }
  const source = value as Partial<StoredContent> | null
  if (!source || typeof source !== 'object' || Array.isArray(source)) return { error: 'Content must be an object' }
  if (!source.overrides || typeof source.overrides !== 'object' || Array.isArray(source.overrides)) {
    return { error: 'overrides must be an object' }
  }
  if (!Array.isArray(source.custom)) return { error: 'custom must be an array' }
  if (!Array.isArray(source.deleted)) return { error: 'deleted must be an array' }
  if (source.deleted.some((slug) => typeof slug !== 'string' || !SLUG_PATTERN.test(slug))) {
    return { error: 'deleted contains an invalid slug' }
  }
  const unusual = Object.entries(source.overrides)
  for (const [slug, game] of unusual) {
    if (!SLUG_PATTERN.test(slug)) return { error: `Invalid override slug: ${slug}` }
    const error = validateGame(game, `Override ${slug}`)
    if (error) return { error }
    if ((game as Partial<Game>).slug !== slug) return { error: `Override key ${slug} does not match game slug` }
  }
  for (const game of source.custom) {
    const error = validateGame(game, `Custom game ${(game as Partial<Game>)?.slug ?? 'unknown'}`)
    if (error) return { error }
  }
  return { content: normalizeContent(source) }
}

interface GithubInit {
  method?: string
  headers?: Record<string, string>
  body?: string
}

async function githubRequest(path: string, init?: GithubInit): Promise<Response> {
  const token = process.env.GITHUB_ADMIN_TOKEN
  if (!token) throw new Error('Admin token is not configured')
  return fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'gameverse-admin',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  })
}

async function readContent(): Promise<{ content: StoredContent; sha: string | null }> {
  const response = await githubRequest(CONTENT_PATH)
  if (response.status === 404) return { content: defaultContent(), sha: null }
  if (!response.ok) throw new Error(`GitHub read failed (${response.status})`)
  const payload = (await response.json()) as { content?: string; sha?: string }
  if (!payload.content) return { content: defaultContent(), sha: payload.sha ?? null }
  const raw = Buffer.from(payload.content, 'base64').toString('utf8')
  return { content: normalizeContent(JSON.parse(raw)), sha: payload.sha ?? null }
}

async function writeContent(content: StoredContent, sha: string | null, message: string) {
  const body: Record<string, string> = {
    message,
    branch: BRANCH,
    content: Buffer.from(`${JSON.stringify(content, null, 2)}\n`, 'utf8').toString('base64'),
  }
  if (sha) body.sha = sha
  const response = await githubRequest(CONTENT_PATH, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!response.ok) throw new Error(`GitHub write failed (${response.status})`)
  const payload = (await response.json()) as {
    content?: { sha?: string }
    commit?: { sha?: string; html_url?: string }
  }
  return {
    sha: payload.content?.sha ?? null,
    commit: payload.commit?.sha ?? null,
    commitUrl: payload.commit?.html_url ?? null,
  }
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Content-Type', 'application/json')

  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    res.status(503).json({ error: 'Admin is not configured' })
    return
  }
  if (!isAuthorized(req)) {
    res.setHeader('WWW-Authenticate', 'Basic realm="GAMEVERSE Admin", charset="UTF-8"')
    res.status(401).json({ error: 'Invalid credentials' })
    return
  }

  try {
    if (req.method === 'GET') {
      const { content, sha } = await readContent()
      res.status(200).json({ content, sha, path: CONTENT_PATH, repo: REPO })
      return
    }

    if (req.method === 'PUT') {
      const parsed = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
      const body = (parsed && typeof parsed === 'object' ? parsed : {}) as {
        content?: unknown
        sha?: string | null
        message?: string
      }
      const result = validateContent(body.content)
      if (result.error || !result.content) {
        res.status(400).json({ error: result.error ?? 'Invalid content' })
        return
      }
      const content: StoredContent = {
        ...result.content,
        updatedAt: new Date().toISOString(),
        updatedBy: process.env.ADMIN_USERNAME,
      }
      const message =
        typeof body.message === 'string' && body.message.trim()
          ? body.message.trim().slice(0, 140)
          : 'admin: update GAMEVERSE content'
      const written = await writeContent(content, body.sha ?? null, message)
      res.status(200).json({ content, ...written })
      return
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    const conflict = message.includes('(409)')
    res.status(conflict ? 409 : 500).json({
      error: conflict ? 'Content changed since you loaded it. Reload and try again.' : message,
    })
  }
}
