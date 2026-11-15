import type { Transition, Variants } from 'framer-motion'

export const EASE = [0.22, 1, 0.36, 1] as const

export const smoothTransition: Transition = {
  duration: 0.7,
  ease: EASE,
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: smoothTransition },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
}

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.075, delayChildren: 0.08 },
  },
}

export const scaleReveal: Variants = {
  hidden: { opacity: 0, scale: 0.97 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: EASE } },
}
