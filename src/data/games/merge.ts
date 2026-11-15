import type { Game, GameContent } from '../types'

export const emptyContent = (): GameContent => ({
  version: 1,
  updatedAt: new Date().toISOString(),
  overrides: {},
  custom: [],
  deleted: [],
})

export function mergeGameCatalog(builtIn: Game[], content: GameContent): Game[] {
  const deleted = new Set(content.deleted ?? [])
  const overrides = content.overrides ?? {}
  const custom = (content.custom ?? []).filter((game) => game?.slug && !deleted.has(game.slug))
  const mergedBuiltIn = builtIn
    .filter((game) => !deleted.has(game.slug))
    .map((game) => overrides[game.slug] ?? game)
  const builtInSlugs = new Set(mergedBuiltIn.map((game) => game.slug))
  return [...mergedBuiltIn, ...custom.filter((game) => !builtInSlugs.has(game.slug))]
}

export function normalizeContent(value: unknown): GameContent {
  const source = (value && typeof value === 'object' ? value : {}) as Partial<GameContent>
  return {
    version: source.version ?? 1,
    updatedAt: source.updatedAt ?? '',
    updatedBy: source.updatedBy,
    overrides: source.overrides && typeof source.overrides === 'object' ? source.overrides : {},
    custom: Array.isArray(source.custom) ? source.custom : [],
    deleted: Array.isArray(source.deleted) ? source.deleted : [],
  }
}
