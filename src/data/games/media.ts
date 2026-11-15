import type { Game } from '../types'

export const shot = (slug: string, n: number) => `/media/gallery/${slug}-${n}.webp`
export const cover = (slug: string) => `/media/cover/${slug}.webp`
export const keyArt = (slug: string) => `/media/hero/${slug}.webp`

export function galleryOf(slug: string, heroShot: number): string[] {
  return [heroShot, 1, 2, 3, 4]
    .filter((n, i, arr) => arr.indexOf(n) === i)
    .map((n) => shot(slug, n))
}

export const makeGame = (game: Game): Game => game
