import { useState, type ReactNode } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  Gamepad2,
  Image as ImageIcon,
  Plus,
  Save,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { SafeImage } from '@/components/SafeImage'
import { genres } from '@/data/genres'
import type { Feature, Game, GameplayPillar, GenreId, PcRequirement } from '@/data/types'
import { cn } from '@/lib/utils'

type Tab = 'basics' | 'story' | 'gameplay' | 'media'

interface GameEditorProps {
  game: Game
  isNew: boolean
  existingSlugs: string[]
  saving: boolean
  onCancel: () => void
  onSave: (game: Game) => void
}

const inputClass =
  'w-full rounded-xl border border-white/10 bg-[#0a0c12] px-3.5 py-2.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-accent/60 focus:ring-2 focus:ring-accent/15'
const labelClass = 'mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-white/40'
const sectionClass = 'rounded-2xl border border-white/10 bg-[#0d0f16]/80 p-5 sm:p-6'
const tabs: { id: Tab; label: string }[] = [
  { id: 'basics', label: 'Basics' },
  { id: 'story', label: 'Story' },
  { id: 'gameplay', label: 'Gameplay' },
  { id: 'media', label: 'Media & Tech' },
]

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function isAssetUrl(value: string): boolean {
  return value.startsWith('/') || /^https?:\/\//i.test(value) || value.startsWith('data:image/')
}

function validateDraft(draft: Game, isNew: boolean, existingSlugs: string[]): string[] {
  const errors: string[] = []
  if (!draft.title.trim()) errors.push('Title is required.')
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(draft.slug)) errors.push('Slug must use lowercase letters, numbers, and hyphens.')
  if (isNew && existingSlugs.includes(draft.slug)) errors.push('That slug already exists. Choose a unique slug.')
  if (!draft.developer.trim()) errors.push('Developer is required.')
  if (!draft.publisher.trim()) errors.push('Publisher is required.')
  if (!draft.tagline.trim()) errors.push('Tagline is required.')
  if (!draft.shortDescription.trim()) errors.push('Short description is required.')
  if (!draft.overview.trim()) errors.push('Overview is required.')
  if (!draft.story.trim()) errors.push('Story section is required.')
  if (!Number.isFinite(draft.year) || draft.year < 1950 || draft.year > 2100) errors.push('Year must be between 1950 and 2100.')
  if (!Number.isFinite(draft.score) || draft.score < 0 || draft.score > 10) errors.push('Score must be between 0 and 10.')
  if (!Number.isFinite(draft.popularity) || draft.popularity < 0 || draft.popularity > 100) errors.push('Popularity must be between 0 and 100.')
  if (draft.genres.length === 0) errors.push('Select at least one genre.')
  if (!draft.genres.includes(draft.primaryGenre)) errors.push('Primary genre must be one of the selected genres.')
  if (draft.platforms.length === 0) errors.push('Add at least one platform.')
  if (!draft.cover.trim() || !isAssetUrl(draft.cover)) errors.push('Cover must be a valid relative or http(s) image URL.')
  if (!draft.hero.trim() || !isAssetUrl(draft.hero)) errors.push('Hero image must be a valid relative or http(s) image URL.')
  if (draft.keyArt.trim() && !isAssetUrl(draft.keyArt)) errors.push('Key art must be a valid relative or http(s) image URL.')
  if (draft.gallery.some((image) => !isAssetUrl(image))) errors.push('Every gallery entry must be a valid image URL.')
  if (draft.gameplay.some((pillar) => !pillar.title.trim() || !pillar.body.trim())) errors.push('Complete or remove empty gameplay pillars.')
  if (draft.features.some((feature) => !feature.title.trim() || !feature.body.trim())) errors.push('Complete or remove empty features.')
  return errors
}

function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string
  hint?: string
  children: ReactNode
  className?: string
}) {
  return (
    <label className={cn('block', className)}>
      <span className={labelClass}>{label}</span>
      {children}
      {hint ? <span className="mt-1.5 block text-[11px] leading-relaxed text-white/30">{hint}</span> : null}
    </label>
  )
}

function TagField({
  label,
  initialValue,
  placeholder,
  onChange,
}: {
  label: string
  initialValue: string[]
  placeholder?: string
  onChange: (value: string[]) => void
}) {
  const [text, setText] = useState(initialValue.join(', '))
  return (
    <Field label={label} hint="Separate entries with commas.">
      <input
        className={inputClass}
        value={text}
        placeholder={placeholder}
        onChange={(event) => {
          setText(event.target.value)
          onChange(
            event.target.value
              .split(',')
              .map((entry) => entry.trim())
              .filter(Boolean),
          )
        }}
      />
    </Field>
  )
}

function GalleryField({ value, onChange }: { value: string[]; onChange: (value: string[]) => void }) {
  const [text, setText] = useState(value.join('\n'))
  return (
    <Field label="Gallery images" hint="One image URL per line.">
      <textarea
        className={cn(inputClass, 'min-h-28 resize-y font-mono text-xs leading-relaxed')}
        value={text}
        onChange={(event) => {
          setText(event.target.value)
          onChange(
            event.target.value
              .split('\n')
              .map((entry) => entry.trim())
              .filter(Boolean),
          )
        }}
      />
    </Field>
  )
}

export function GameEditor({ game, isNew, existingSlugs, saving, onCancel, onSave }: GameEditorProps) {
  const [draft, setDraft] = useState<Game>(game)
  const [tab, setTab] = useState<Tab>('basics')
  const [errors, setErrors] = useState<string[]>([])

  const update = (patch: Partial<Game>) => setDraft((current) => ({ ...current, ...patch }))

  const toggleGenre = (id: GenreId) => {
    setDraft((current) => {
      const selected = current.genres.includes(id)
      const nextGenres = selected ? current.genres.filter((genre) => genre !== id) : [...current.genres, id]
      const primaryGenre = nextGenres.includes(current.primaryGenre) ? current.primaryGenre : nextGenres[0] ?? 'action'
      return { ...current, genres: nextGenres, primaryGenre }
    })
  }

  const updatePillar = (index: number, patch: Partial<GameplayPillar>) => {
    setDraft((current) => ({
      ...current,
      gameplay: current.gameplay.map((pillar, i) => (i === index ? { ...pillar, ...patch } : pillar)),
    }))
  }

  const updateFeature = (index: number, patch: Partial<Feature>) => {
    setDraft((current) => ({
      ...current,
      features: current.features.map((feature, i) => (i === index ? { ...feature, ...patch } : feature)),
    }))
  }

  const emptyRequirement: PcRequirement = { os: '', cpu: '', gpu: '', ram: '', storage: '' }

  const updateRequirement = (kind: 'minimum' | 'recommended', field: keyof PcRequirement, value: string) => {
    setDraft((current) => {
      const requirements = current.requirements ?? { minimum: { ...emptyRequirement }, recommended: { ...emptyRequirement } }
      return {
        ...current,
        requirements: { ...requirements, [kind]: { ...requirements[kind], [field]: value } },
      }
    })
  }

  const submit = () => {
    const nextErrors = validateDraft(draft, isNew, existingSlugs)
    setErrors(nextErrors)
    if (nextErrors.length > 0) {
      setTab('basics')
      return
    }
    onSave({ ...draft, slug: slugify(draft.slug) })
  }

  const titleChanged = (value: string) => {
    update({ title: value, ...(isNew && !draft.slug ? { slug: slugify(value) } : {}) })
  }

  return (
    <div className="pb-32">
      <div className="sticky top-0 z-30 -mx-4 border-b border-white/10 bg-[#08090d]/90 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/60 transition hover:border-white/25 hover:text-white"
              aria-label="Back to games"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-accent-soft/80">
                {isNew ? 'New dossier' : 'Editing dossier'}
              </p>
              <h1 className="truncate font-display text-xl font-semibold tracking-[-0.03em] text-white sm:text-2xl">
                {draft.title || 'Untitled game'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/60 transition hover:border-white/25 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full bg-[#f4f1ea] px-5 py-2 text-xs font-medium text-[#0a0a0f] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <div className="mb-5 flex flex-wrap gap-1.5 rounded-full border border-white/10 bg-[#0b0d13] p-1.5">
            {tabs.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setTab(entry.id)}
                className={cn(
                  'rounded-full px-4 py-2 font-mono text-[9px] uppercase tracking-[0.16em] transition',
                  tab === entry.id ? 'bg-white/[0.09] text-white' : 'text-white/40 hover:text-white/75',
                )}
              >
                {entry.label}
              </button>
            ))}
          </div>

          {errors.length > 0 ? (
            <div className="mb-5 rounded-2xl border border-red-400/25 bg-red-400/[0.06] p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-red-200">
                <AlertTriangle className="h-4 w-4" />
                Fix these before publishing
              </div>
              <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-red-100/70">
                {errors.map((error) => (
                  <li key={error}>• {error}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {tab === 'basics' ? (
            <div className="space-y-5">
              <div className={sectionClass}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Title" className="sm:col-span-2">
                    <input className={inputClass} value={draft.title} onChange={(event) => titleChanged(event.target.value)} />
                  </Field>
                  <Field label="Slug" hint={isNew ? 'Permanent URL identifier.' : 'Slugs are permanent after creation.'}>
                    <input
                      className={cn(inputClass, !isNew && 'cursor-not-allowed text-white/45')}
                      value={draft.slug}
                      readOnly={!isNew}
                      onChange={(event) => update({ slug: event.target.value })}
                    />
                  </Field>
                  <Field label="Release date">
                    <input
                      className={inputClass}
                      value={draft.releaseDate}
                      placeholder="October 26, 2018"
                      onChange={(event) => update({ releaseDate: event.target.value })}
                    />
                  </Field>
                  <Field label="Year">
                    <input
                      type="number"
                      className={inputClass}
                      value={draft.year}
                      onChange={(event) => update({ year: Number(event.target.value) })}
                    />
                  </Field>
                  <Field label="GV score" hint="Editorial score out of 10, not an aggregate.">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      className={inputClass}
                      value={draft.score}
                      onChange={(event) => update({ score: Number(event.target.value) })}
                    />
                  </Field>
                  <Field label="Developer">
                    <input
                      className={inputClass}
                      value={draft.developer}
                      onChange={(event) => update({ developer: event.target.value })}
                    />
                  </Field>
                  <Field label="Publisher">
                    <input
                      className={inputClass}
                      value={draft.publisher}
                      onChange={(event) => update({ publisher: event.target.value })}
                    />
                  </Field>
                  <Field label="Tagline" className="sm:col-span-2">
                    <input
                      className={inputClass}
                      value={draft.tagline}
                      placeholder="The frontier, rendered in blood and starlight."
                      onChange={(event) => update({ tagline: event.target.value })}
                    />
                  </Field>
                  <Field label="Short description" className="sm:col-span-2">
                    <textarea
                      className={cn(inputClass, 'min-h-24 resize-y')}
                      value={draft.shortDescription}
                      onChange={(event) => update({ shortDescription: event.target.value })}
                    />
                  </Field>
                  <Field label="Overview" className="sm:col-span-2">
                    <textarea
                      className={cn(inputClass, 'min-h-32 resize-y')}
                      value={draft.overview}
                      onChange={(event) => update({ overview: event.target.value })}
                    />
                  </Field>
                </div>
              </div>

              <div className={sectionClass}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-base font-medium text-white">Classification</h2>
                    <p className="mt-1 text-xs text-white/35">Genres power discovery, filtering, and related dossiers.</p>
                  </div>
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-white/60">
                    <input
                      type="checkbox"
                      checked={draft.aaa}
                      onChange={(event) => update({ aaa: event.target.checked })}
                      className="h-4 w-4 accent-[#a78bfa]"
                    />
                    AAA feature
                  </label>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {genres.map((genre) => {
                    const selected = draft.genres.includes(genre.id)
                    return (
                      <button
                        key={genre.id}
                        type="button"
                        onClick={() => toggleGenre(genre.id)}
                        className={cn(
                          'rounded-full border px-3 py-1.5 text-[11px] transition',
                          selected
                            ? 'border-accent/60 bg-accent/15 text-accent-soft'
                            : 'border-white/10 text-white/40 hover:border-white/25 hover:text-white/70',
                        )}
                      >
                        {genre.name}
                      </button>
                    )
                  })}
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label="Primary genre">
                    <select
                      className={inputClass}
                      value={draft.primaryGenre}
                      onChange={(event) => update({ primaryGenre: event.target.value as GenreId })}
                    >
                      {draft.genres.map((id) => (
                        <option key={id} value={id}>
                          {genres.find((genre) => genre.id === id)?.name ?? id}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Popularity" hint="0–100, used for ranking and fallbacks.">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className={inputClass}
                      value={draft.popularity}
                      onChange={(event) => update({ popularity: Number(event.target.value) })}
                    />
                  </Field>
                  <TagField
                    label="Platforms"
                    initialValue={draft.platforms}
                    placeholder="PC, PS5, Xbox Series X|S"
                    onChange={(platforms) => update({ platforms })}
                  />
                  <TagField
                    label="Modes"
                    initialValue={draft.modes}
                    placeholder="Single-player, Co-op"
                    onChange={(modes) => update({ modes })}
                  />
                  <TagField
                    label="Similar dossier slugs"
                    initialValue={draft.similar}
                    placeholder="gta-v, the-witcher-3"
                    onChange={(similar) => update({ similar })}
                  />
                  <Field label="Accent color">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={/^#[0-9a-f]{6}$/i.test(draft.accent) ? draft.accent : '#8b5cf6'}
                        onChange={(event) => update({ accent: event.target.value })}
                        className="h-10 w-12 cursor-pointer rounded-lg border border-white/10 bg-transparent"
                      />
                      <input
                        className={inputClass}
                        value={draft.accent}
                        onChange={(event) => update({ accent: event.target.value })}
                      />
                    </div>
                  </Field>
                  <Field label="Platform note" className="sm:col-span-2">
                    <textarea
                      className={cn(inputClass, 'min-h-20 resize-y')}
                      value={draft.platformNote ?? ''}
                      onChange={(event) => update({ platformNote: event.target.value })}
                    />
                  </Field>
                </div>
              </div>
            </div>
          ) : null}

          {tab === 'story' ? (
            <div className={sectionClass}>
              <div className="grid gap-5">
                <Field label="Story" hint="Premise and themes. Keep late-game turns out of this field.">
                  <textarea
                    className={cn(inputClass, 'min-h-56 resize-y')}
                    value={draft.story}
                    onChange={(event) => update({ story: event.target.value })}
                  />
                </Field>
                <Field label="Spoiler note" hint="Shown behind the spoiler control on the public dossier.">
                  <textarea
                    className={cn(inputClass, 'min-h-28 resize-y')}
                    value={draft.spoiler ?? ''}
                    onChange={(event) => update({ spoiler: event.target.value })}
                  />
                </Field>
              </div>
            </div>
          ) : null}

          {tab === 'gameplay' ? (
            <div className="space-y-5">
              <div className={sectionClass}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-base font-medium text-white">Gameplay pillars</h2>
                    <p className="mt-1 text-xs text-white/35">The systems that define how the game plays.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => update({ gameplay: [...draft.gameplay, { title: '', body: '' }] })}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-white/60 transition hover:border-white/25 hover:text-white"
                  >
                    <Plus className="h-3 w-3" /> Add pillar
                  </button>
                </div>
                <div className="mt-5 space-y-4">
                  {draft.gameplay.map((pillar, index) => (
                    <div key={index} className="rounded-xl border border-white/[0.07] bg-black/20 p-4">
                      <div className="flex items-start gap-3">
                        <div className="min-w-0 flex-1 space-y-3">
                          <input
                            className={inputClass}
                            value={pillar.title}
                            placeholder="Combat, Exploration, Progression..."
                            onChange={(event) => updatePillar(index, { title: event.target.value })}
                          />
                          <textarea
                            className={cn(inputClass, 'min-h-20 resize-y')}
                            value={pillar.body}
                            placeholder="Describe the mechanic and why it matters."
                            onChange={(event) => updatePillar(index, { body: event.target.value })}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => update({ gameplay: draft.gameplay.filter((_, i) => i !== index) })}
                          className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-white/35 transition hover:border-red-400/40 hover:text-red-300"
                          aria-label="Remove pillar"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={sectionClass}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-base font-medium text-white">Features</h2>
                    <p className="mt-1 text-xs text-white/35">Standout design details and technical claims.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => update({ features: [...draft.features, { title: '', body: '' }] })}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-white/60 transition hover:border-white/25 hover:text-white"
                  >
                    <Plus className="h-3 w-3" /> Add feature
                  </button>
                </div>
                <div className="mt-5 space-y-4">
                  {draft.features.map((feature, index) => (
                    <div key={index} className="rounded-xl border border-white/[0.07] bg-black/20 p-4">
                      <div className="flex items-start gap-3">
                        <div className="min-w-0 flex-1 space-y-3">
                          <input
                            className={inputClass}
                            value={feature.title}
                            placeholder="A living simulation"
                            onChange={(event) => updateFeature(index, { title: event.target.value })}
                          />
                          <textarea
                            className={cn(inputClass, 'min-h-20 resize-y')}
                            value={feature.body}
                            placeholder="Explain the feature with specific, verifiable detail."
                            onChange={(event) => updateFeature(index, { body: event.target.value })}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => update({ features: draft.features.filter((_, i) => i !== index) })}
                          className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 text-white/35 transition hover:border-red-400/40 hover:text-red-300"
                          aria-label="Remove feature"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {tab === 'media' ? (
            <div className="space-y-5">
              <div className={sectionClass}>
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-accent-soft" />
                  <h2 className="font-display text-base font-medium text-white">Artwork</h2>
                </div>
                <div className="mt-5 grid gap-4">
                  <Field label="Cover image" hint="Portrait art. Relative paths like /media/cover/slug.webp also work.">
                    <input className={inputClass} value={draft.cover} onChange={(event) => update({ cover: event.target.value })} />
                  </Field>
                  <Field label="Hero image">
                    <input className={inputClass} value={draft.hero} onChange={(event) => update({ hero: event.target.value })} />
                  </Field>
                  <Field label="Key art">
                    <input className={inputClass} value={draft.keyArt} onChange={(event) => update({ keyArt: event.target.value })} />
                  </Field>
                  <GalleryField value={draft.gallery} onChange={(gallery) => update({ gallery })} />
                </div>
              </div>

              <div className={sectionClass}>
                <h2 className="font-display text-base font-medium text-white">Technical</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Field label="Engine">
                    <input className={inputClass} value={draft.engine} onChange={(event) => update({ engine: event.target.value })} />
                  </Field>
                  <Field label="Storage">
                    <input className={inputClass} value={draft.storage} onChange={(event) => update({ storage: event.target.value })} />
                  </Field>
                </div>

                <label className="mt-5 flex cursor-pointer items-center gap-2 text-xs text-white/60">
                  <input
                    type="checkbox"
                    checked={Boolean(draft.requirements)}
                    onChange={(event) =>
                      update({
                        requirements: event.target.checked
                          ? { minimum: { ...emptyRequirement }, recommended: { ...emptyRequirement } }
                          : undefined,
                      })
                    }
                    className="h-4 w-4 accent-[#a78bfa]"
                  />
                  Include PC requirements
                </label>

                {draft.requirements ? (
                  <div className="mt-5 grid gap-5 lg:grid-cols-2">
                    {(['minimum', 'recommended'] as const).map((kind) => (
                      <div key={kind} className="rounded-xl border border-white/[0.07] bg-black/20 p-4">
                        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">{kind}</p>
                        <div className="mt-4 space-y-3">
                          {(
                            [
                              ['os', 'OS'],
                              ['cpu', 'CPU'],
                              ['gpu', 'GPU'],
                              ['ram', 'RAM'],
                              ['storage', 'Storage'],
                            ] as [keyof PcRequirement, string][]
                          ).map(([field, label]) => (
                            <Field key={field} label={label}>
                              <input
                                className={cn(inputClass, 'py-2 text-xs')}
                                value={draft.requirements?.[kind][field] ?? ''}
                                onChange={(event) => updateRequirement(kind, field, event.target.value)}
                              />
                            </Field>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-4">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d0f16]">
              <SafeImage
                src={draft.cover || '/favicon.svg'}
                alt={draft.title || 'Cover preview'}
                title="Cover preview"
                className="aspect-[4/5] w-full"
              />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/35">
                      {draft.year || 'Year'} · {draft.developer || 'Developer'}
                    </p>
                    <h3 className="mt-1.5 truncate font-display text-lg font-medium tracking-[-0.03em] text-white">
                      {draft.title || 'Untitled game'}
                    </h3>
                  </div>
                  <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-1 font-mono text-[9px] text-accent-soft">
                    {Number.isFinite(draft.score) ? draft.score.toFixed(1) : '—'}
                  </span>
                </div>
                <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-white/45">
                  {draft.shortDescription || 'Short description preview appears here.'}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {draft.genres.slice(0, 4).map((id) => (
                    <span key={id} className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] text-white/40">
                      {genres.find((genre) => genre.id === id)?.name ?? id}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0d0f16]/80 p-4 text-xs leading-relaxed text-white/40">
              <div className="flex items-center gap-2 text-white/70">
                <Sparkles className="h-3.5 w-3.5 text-accent-soft" />
                Publishing flow
              </div>
              <p className="mt-2">
                Publishing commits <span className="font-mono text-[10px] text-white/60">content/admin-content.json</span> to GitHub.
                Vercel and GitHub Pages rebuild automatically.
              </p>
              <div className="mt-3 flex items-center gap-2 text-[11px] text-white/30">
                <Gamepad2 className="h-3.5 w-3.5" />
                One dossier per save.
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
