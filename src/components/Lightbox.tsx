import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { EASE } from '@/lib/motion'
import { cn } from '@/lib/utils'

export interface LightboxImage {
  src: string
  alt: string
  caption?: string
}

interface LightboxProps {
  images: LightboxImage[]
  startIndex: number
  open: boolean
  onClose: () => void
  title?: string
}

export function Lightbox({ images, startIndex, open, onClose, title }: LightboxProps) {
  const [current, setCurrent] = useState(startIndex)
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  useLockBodyScroll(open)

  useEffect(() => {
    if (open) {
      setCurrent(startIndex)
      previousFocus.current = document.activeElement as HTMLElement
      const timer = window.setTimeout(() => closeRef.current?.focus(), 40)
      return () => window.clearTimeout(timer)
    }
    previousFocus.current?.focus?.()
  }, [open, startIndex])

  const step = useCallback(
    (direction: number) => {
      setCurrent((value) => (value + direction + images.length) % Math.max(images.length, 1))
    },
    [images.length],
  )

  useEffect(() => {
    if (!open) return
    const handleKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') step(-1)
      if (event.key === 'ArrowRight') step(1)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onClose, step])

  const handleDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return
    const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    if (!focusables?.length) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  if (typeof document === 'undefined' || !images.length) return null

  const image = images[current]

  return createPortal(
    <AnimatePresence>
      {open && image ? (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-[#05060a]/94 p-4 backdrop-blur-xl sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose()
          }}
          role="presentation"
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={title ? `${title} gallery` : 'Image gallery'}
            tabIndex={-1}
            onKeyDown={handleDialogKeyDown}
            className="relative flex h-full max-h-[92vh] w-full max-w-6xl flex-col justify-center"
          >
            <div className="mb-3 flex items-center justify-between gap-4 px-1">
              <div className="min-w-0">
                {title ? (
                  <p className="truncate font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">{title}</p>
                ) : null}
                <p className="mt-1 font-mono text-[10px] tracking-[0.14em] text-white/65">
                  {String(current + 1).padStart(2, '0')}
                  <span className="mx-1 text-white/25">/</span>
                  {String(images.length).padStart(2, '0')}
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close gallery"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] text-white transition hover:border-white/30 hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-black">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  initial={{ opacity: 0, scale: 1.01 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className="max-h-[68vh] w-full object-contain"
                  draggable={false}
                />
              </AnimatePresence>
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous image"
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-md transition hover:bg-white hover:text-black"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next image"
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-md transition hover:bg-white hover:text-black"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {image.caption ? (
              <p className="mt-3 px-1 text-[11px] text-white/40">{image.caption}</p>
            ) : null}

            <div className="mt-4 flex items-center justify-center gap-2">
              {images.map((item, index) => (
                <button
                  key={item.src}
                  type="button"
                  onClick={() => setCurrent(index)}
                  aria-label={`View image ${index + 1}`}
                  aria-current={index === current ? 'true' : undefined}
                  className={cn(
                    'h-12 w-16 overflow-hidden rounded-md border transition sm:h-14 sm:w-20',
                    index === current
                      ? 'border-accent-soft opacity-100'
                      : 'border-white/10 opacity-45 hover:opacity-80',
                  )}
                >
                  <img src={item.src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
