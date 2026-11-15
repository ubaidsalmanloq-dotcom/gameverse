import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  wordmark?: boolean
  to?: string
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn('h-8 w-8', className)}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="gv-mark" x1="8" y1="4" x2="34" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e9e1ff" />
          <stop offset="0.55" stopColor="#b79cff" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <path d="M20 2.5 37.5 20 20 37.5 2.5 20 20 2.5Z" stroke="url(#gv-mark)" strokeWidth="1.4" opacity="0.85" />
      <path d="M20 10.5 29.5 20 20 29.5 10.5 20 20 10.5Z" fill="url(#gv-mark)" />
      <path d="M20 15.5 24.5 20 20 24.5 15.5 20 20 15.5Z" fill="#08090d" />
    </svg>
  )
}

export function Logo({ className, wordmark = true, to = '/' }: LogoProps) {
  return (
    <Link
      to={to}
      className={cn('group inline-flex items-center gap-3 rounded-md', className)}
      aria-label="GAMEVERSE home"
    >
      <span className="relative flex h-9 w-9 items-center justify-center">
        <LogoMark className="h-9 w-9 transition-transform duration-500 group-hover:rotate-45" />
        <span className="absolute inset-0 -z-10 rounded-full bg-accent/30 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </span>
      {wordmark ? (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[15px] font-semibold tracking-[0.28em] text-white">GAMEVERSE</span>
          <span className="mt-1 font-mono text-[7px] uppercase tracking-[0.38em] text-mist">The game encyclopedia</span>
        </span>
      ) : null}
    </Link>
  )
}
