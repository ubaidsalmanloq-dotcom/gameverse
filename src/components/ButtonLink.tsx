import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonLinkProps {
  to: string
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: ReactNode
  external?: boolean
  className?: string
  onClick?: () => void
}

const variants = {
  primary:
    'bg-[#f4f1ea] text-[#0a0a0f] hover:bg-accent-soft hover:text-[#0a0a0f] shadow-[0_12px_36px_-12px_rgba(196,181,253,0.4)]',
  secondary:
    'border border-white/15 bg-white/[0.045] text-white hover:bg-white/[0.09] hover:border-white/25 backdrop-blur-md',
  ghost: 'text-mist-bright hover:text-white',
}

const sizes = {
  sm: 'px-4 py-2.5 text-[12px]',
  md: 'px-5 py-3 text-[13px]',
  lg: 'px-7 py-4 text-sm',
}

export function ButtonLink({
  to,
  children,
  variant = 'primary',
  size = 'md',
  icon,
  external,
  className,
  onClick,
}: ButtonLinkProps) {
  const classes = cn(
    'group inline-flex items-center justify-center gap-2.5 rounded-full font-medium tracking-[-0.01em] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-soft',
    variants[variant],
    sizes[size],
    className,
  )

  const content = (
    <>
      <span>{children}</span>
      <span className={cn('transition-transform duration-300 group-hover:translate-x-0.5', variant === 'ghost' && 'opacity-60')}>
        {icon ?? <ArrowUpRight className="h-4 w-4" strokeWidth={1.7} />}
      </span>
    </>
  )

  if (external) {
    return (
      <a href={to} className={classes} target="_blank" rel="noreferrer noopener" onClick={onClick}>
        {content}
      </a>
    )
  }

  return (
    <Link to={to} className={classes} onClick={onClick}>
      {content}
    </Link>
  )
}
