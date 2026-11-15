import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'
import { EASE } from '@/lib/motion'
import { cn } from '@/lib/utils'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  once?: boolean
  amount?: number
}

export function Reveal({ children, className, delay = 0, y = 26, once = true, amount = 0.18 }: RevealProps) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerGroup({
  children,
  className,
  amount = 0.15,
}: {
  children: ReactNode
  className?: string
  amount?: number
}) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 22 },
        show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  )
}

function splitAccentParts(text: string) {
  const parts = text.split(/(\*[^*]+\*)/).filter(Boolean)
  const normalized: string[] = []

  for (const part of parts) {
    const previous = normalized[normalized.length - 1]
    const punctuation = previous?.startsWith('*') && !part.startsWith('*') ? part.match(/^[.,;:!?…]+/)?.[0] : null

    if (previous?.startsWith('*') && punctuation) {
      normalized[normalized.length - 1] = `${previous.slice(0, -1)}${punctuation}*`
      const rest = part.slice(punctuation.length)
      if (rest) normalized.push(rest)
      continue
    }

    normalized.push(part)
  }

  return normalized
}

export function WordsReveal({
  text,
  className,
  plainClassName,
}: {
  text: string
  className?: string
  plainClassName?: string
}) {
  const reduce = useReducedMotion()
  const parts = splitAccentParts(text)
  const plain = text.replace(/\*/g, '')

  if (reduce) {
    return (
      <span className={className}>
        {parts.map((part, index) =>
          part.startsWith('*') ? (
            <span key={index} className={cn('serif-accent text-accent-soft', plainClassName)}>
              {part.slice(1, -1)}
            </span>
          ) : (
            <span key={index}>{part}</span>
          ),
        )}
      </span>
    )
  }

  let wordIndex = 0

  return (
    <span className={className}>
      <span className="sr-only">{plain}</span>
      <motion.span
        aria-hidden="true"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="inline"
      >
        {parts.map((part, partIndex) => {
          const isAccent = part.startsWith('*')
          const content = isAccent ? part.slice(1, -1) : part
          const words = content.split(' ')
          const nextPart = parts[partIndex + 1]
          const nextIsPunctuation = Boolean(nextPart && /^[.,;:!?…]/.test(nextPart.trim()))
          return (
            <span key={partIndex} className={cn(isAccent && 'serif-accent text-accent-soft', isAccent && plainClassName)}>
              {words.map((word, index) => {
                const delay = Math.min(wordIndex, 18) * 0.035
                wordIndex += 1
                if (!word) return null
                return (
                  <span key={`${word}-${index}`} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
                    <motion.span
                      className="inline-block"
                      variants={{
                        hidden: { y: '115%' },
                        show: { y: 0, transition: { duration: 0.8, delay, ease: EASE } },
                      }}
                    >
                      {word}
                      {index < words.length - 1 ? '\u00A0' : nextPart && !nextIsPunctuation ? '\u00A0' : ''}
                    </motion.span>
                  </span>
                )
              })}
            </span>
          )
        })}
      </motion.span>
    </span>
  )
}
