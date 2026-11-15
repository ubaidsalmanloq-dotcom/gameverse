import type { Game } from '@/data/types'

export function cn(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ')
}

export function asset(path: string): string {
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('data:') || path.startsWith('blob:')) return path
  const base = import.meta.env.BASE_URL
  const clean = path.replace(/^\/+/, '')
  return base.endsWith('/') ? `${base}${clean}` : `${base}/${clean}`
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function formatScore(score: number): string {
  return score.toFixed(1)
}

const platformShortNames: Record<string, string> = {
  PC: 'PC',
  PS3: 'PS3',
  PS4: 'PS4',
  PS5: 'PS5',
  'PlayStation 5': 'PS5',
  'PlayStation 4': 'PS4',
  'Xbox 360': '360',
  'Xbox One': 'XB1',
  'Xbox Series X|S': 'XSX',
  'Nintendo Switch': 'NSW',
}

export function shortPlatform(platform: string): string {
  return platformShortNames[platform] ?? platform
}

export function genreLabelList(game: Game, genreNames: Record<string, string>): string[] {
  return game.genres.map((id) => genreNames[id]).filter(Boolean)
}

export function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function initials(value: string): string {
  return value
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 3)
    .toUpperCase()
}
