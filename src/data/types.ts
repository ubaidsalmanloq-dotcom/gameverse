export type GenreId =
  | 'action'
  | 'adventure'
  | 'rpg'
  | 'fps'
  | 'tps'
  | 'open-world'
  | 'survival'
  | 'horror'
  | 'racing'
  | 'sports'
  | 'strategy'
  | 'simulation'
  | 'fighting'
  | 'stealth'
  | 'soulslike'
  | 'multiplayer'

export interface PcRequirement {
  os: string
  cpu: string
  gpu: string
  ram: string
  storage: string
}

export interface GameplayPillar {
  title: string
  body: string
}

export interface Feature {
  title: string
  body: string
}

export interface Game {
  slug: string
  title: string
  year: number
  releaseDate: string
  developer: string
  publisher: string
  genres: GenreId[]
  primaryGenre: GenreId
  platforms: string[]
  platformNote?: string
  modes: string[]
  score: number
  tagline: string
  shortDescription: string
  overview: string
  story: string
  spoiler?: string
  gameplay: GameplayPillar[]
  features: Feature[]
  engine: string
  storage: string
  requirements?: {
    minimum: PcRequirement
    recommended: PcRequirement
  }
  cover: string
  hero: string
  keyArt: string
  gallery: string[]
  accent: string
  aaa: boolean
  popularity: number
  similar: string[]
}

export interface Genre {
  id: GenreId
  name: string
  shortName: string
  tagline: string
  meaning: string
  gameplay: string
  mechanics: string[]
  unique: string[]
  examples: string[]
  recommended: string[]
  icon: string
  image: string
  accent: string
}

export interface SystemTopic {
  id: string
  name: string
  kicker: string
  summary: string
  detail: string
  points: string[]
  stages: { label: string; detail: string }[]
  icon: string
  accent: string
}

export interface PlatformInfo {
  id: string
  name: string
  eyebrow: string
  releaseYear: string
  tagline: string
  description: string
  specs: { label: string; value: string }[]
  highlights: { label: string; value: string }[]
  strengths: string[]
  tradeoffs: string[]
  signatureGames: string[]
  accent: string
  bestFor: string
}
