import { useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity,
  Atom,
  Box,
  Brain,
  Camera,
  Cpu,
  Layers,
  Map,
  Network,
  Scan,
  Shuffle,
  Sun,
  type LucideIcon,
} from 'lucide-react'
import { systems } from '@/data/systems'
import { EASE } from '@/lib/motion'
import { cn } from '@/lib/utils'

const iconMap: Record<string, LucideIcon> = {
  Layers,
  Box,
  Cpu,
  Sun,
  Scan,
  Atom,
  Activity,
  Brain,
  Map,
  Network,
  Shuffle,
  Camera,
}

export function SystemsExplorer() {
  const [selectedId, setSelectedId] = useState(systems[0].id)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const selected = systems.find((system) => system.id === selectedId) ?? systems[0]
  const SelectedIcon = iconMap[selected.icon] ?? Layers

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End']
    if (!keys.includes(event.key)) return
    event.preventDefault()
    let next = index
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % systems.length
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index - 1 + systems.length) % systems.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = systems.length - 1
    setSelectedId(systems[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[330px_minmax(0,1fr)] lg:gap-8">
      <div
        className="hide-scrollbar flex gap-2 overflow-x-auto pb-1 lg:max-h-[620px] lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:pb-0 lg:pr-1"
        role="tablist"
        aria-label="How games work"
        aria-orientation="vertical"
      >
        {systems.map((system, index) => {
          const Icon = iconMap[system.icon] ?? Layers
          const active = system.id === selectedId
          return (
            <button
              key={system.id}
              ref={(element) => {
                tabRefs.current[index] = element
              }}
              type="button"
              role="tab"
              id={`system-tab-${system.id}`}
              aria-selected={active}
              aria-controls={`system-panel-${system.id}`}
              tabIndex={active ? 0 : -1}
              onClick={() => setSelectedId(system.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              className={cn(
                'group flex shrink-0 items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all duration-300 lg:w-full lg:px-4',
                active
                  ? 'border-white/15 bg-white/[0.065]'
                  : 'border-white/[0.06] bg-white/[0.015] hover:border-white/12 hover:bg-white/[0.04]',
              )}
            >
              <span
                className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition',
                  active ? 'border-white/15 bg-white/[0.08]' : 'border-white/[0.08] bg-black/20',
                )}
                style={active ? { color: system.accent } : undefined}
              >
                <Icon className="h-3.5 w-3.5" strokeWidth={1.6} />
              </span>
              <span className="min-w-0">
                <span className={cn('block truncate text-[12px] font-medium', active ? 'text-white' : 'text-mist-bright')}>
                  {system.name}
                </span>
                <span className="mt-0.5 hidden font-mono text-[7px] uppercase tracking-[0.16em] text-white/25 lg:block">
                  {String(index + 1).padStart(2, '0')} · {system.kicker}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <div
        className="relative min-h-[520px] overflow-hidden rounded-[1.6rem] border border-white/[0.09] bg-[#0d0f16]"
        role="tabpanel"
        id={`system-panel-${selected.id}`}
        aria-labelledby={`system-tab-${selected.id}`}
        tabIndex={0}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="relative flex h-full flex-col p-6 sm:p-8 lg:p-10"
          >
            <div
              className="absolute -right-20 -top-24 h-72 w-72 rounded-full blur-[100px]"
              style={{ background: `${selected.accent}24` }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-grid opacity-[0.12] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" aria-hidden="true" />

            <div className="relative flex items-start justify-between gap-4">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/12 bg-white/[0.05]"
                style={{ color: selected.accent }}
              >
                <SelectedIcon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/25">
                {String(systems.findIndex((system) => system.id === selected.id) + 1).padStart(2, '0')} / {systems.length}
              </span>
            </div>

            <div className="relative mt-7">
              <p className="eyebrow" style={{ color: selected.accent }}>
                {selected.kicker}
              </p>
              <h3 className="mt-3 font-display text-[clamp(1.8rem,3.6vw,2.8rem)] font-semibold leading-[1.02] tracking-[-0.045em] text-white">
                {selected.name}
              </h3>
              <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-mist-bright">{selected.summary}</p>
            </div>

            <p className="relative mt-5 max-w-2xl text-[12.5px] leading-relaxed text-mist">{selected.detail}</p>

            <div className="relative mt-8">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/30">The pipeline</p>
                <span className="h-px flex-1 bg-white/[0.08] ml-4" />
              </div>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                {selected.stages.map((stage, index) => (
                  <div
                    key={stage.label}
                    className="relative rounded-xl border border-white/[0.08] bg-white/[0.025] p-3.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[8px] tracking-[0.14em]" style={{ color: selected.accent }}>
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {index < selected.stages.length - 1 ? (
                        <span className="hidden h-px w-3 bg-white/15 lg:block" aria-hidden="true" />
                      ) : null}
                    </div>
                    <p className="mt-2 text-[11.5px] font-medium text-white">{stage.label}</p>
                    <p className="mt-1 text-[10px] leading-relaxed text-white/35">{stage.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mt-7 grid gap-2.5 sm:grid-cols-2">
              {selected.points.map((point) => (
                <div key={point} className="flex items-start gap-2.5 text-[11px] leading-relaxed text-mist">
                  <span
                    className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                    style={{ background: selected.accent }}
                    aria-hidden="true"
                  />
                  {point}
                </div>
              ))}
            </div>

            <div className="relative mt-auto flex items-center justify-between gap-4 border-t border-white/[0.08] pt-5 mt-8">
              <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">
                Explainer · not a spec sheet
              </span>
              <span className="font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">
                Use arrows to browse
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
