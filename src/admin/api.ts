import type { GameContent } from '@/data/types'
import { normalizeContent } from '@/data/games/merge'

export interface ContentResponse {
  content: GameContent
  sha: string | null
  path: string
  repo: string
}

export interface SaveResponse {
  content: GameContent
  sha: string | null
  commit: string | null
  commitUrl: string | null
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function encodeAuth(username: string, password: string): string {
  return `Basic ${btoa(`${username}:${password}`)}`
}

async function request<T>(auth: string, init?: RequestInit): Promise<T> {
  const response = await fetch('/api/admin/content', {
    ...init,
    headers: {
      Authorization: auth,
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
    },
    cache: 'no-store',
  })
  let payload: unknown = null
  try {
    payload = await response.json()
  } catch {
    payload = null
  }
  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'error' in payload && typeof payload.error === 'string'
        ? payload.error
        : `Request failed (${response.status})`
    throw new ApiError(message, response.status)
  }
  return payload as T
}

export async function fetchContent(auth: string): Promise<ContentResponse> {
  const response = await request<ContentResponse>(auth)
  return { ...response, content: normalizeContent(response.content) }
}

export async function saveContent(
  auth: string,
  content: GameContent,
  sha: string | null,
  message?: string,
): Promise<SaveResponse> {
  const response = await request<SaveResponse>(auth, {
    method: 'PUT',
    body: JSON.stringify({ content, sha, message }),
  })
  return { ...response, content: normalizeContent(response.content) }
}
