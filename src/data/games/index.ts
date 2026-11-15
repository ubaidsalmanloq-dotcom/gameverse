import type { Game } from '../types'
import { aaaGames } from './aaa'
import { moreGames } from './more'

export const games: Game[] = [...aaaGames, ...moreGames]

export const gameBySlug = Object.fromEntries(games.map((game) => [game.slug, game]))

export const aaaCollection = games.filter((game) => game.aaa)

export const featuredGames = ['red-dead-redemption-2', 'cyberpunk-2077', 'elden-ring']

export function getGame(slug: string | undefined): Game | undefined {
  return slug ? gameBySlug[slug] : undefined
}

export function getSimilarGames(game: Game, limit = 3): Game[] {
  const explicit = game.similar.map((slug) => gameBySlug[slug]).filter(Boolean)
  if (explicit.length >= limit) return explicit.slice(0, limit)
  const fallback = games
    .filter((candidate) => candidate.slug !== game.slug && candidate.genres.some((g) => game.genres.includes(g)))
    .filter((candidate) => !explicit.some((entry) => entry.slug === candidate.slug))
    .sort((a, b) => b.popularity - a.popularity)
  return [...explicit, ...fallback].slice(0, limit)
}

export const developers = Array.from(new Set(games.map((game) => game.developer))).sort()
