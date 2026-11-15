import { useEffect, useState } from 'react'
import { LogoMark } from './Logo'
import { cn } from '@/lib/utils'

interface SafeImageProps {
  src: string
  alt: string
  className?: string
  imgClassName?: string
  priority?: boolean
  sizes?: string
  title?: string
}

export function SafeImage({ src, alt, className, imgClassName, priority = false, sizes, title }: SafeImageProps) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [src])

  return (
    <div className={cn('relative overflow-hidden media-fallback', className)}>
      {!failed ? (
        <img
          src={src}
          alt={alt}
          className={cn('h-full w-full object-cover', imgClassName)}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          sizes={sizes}
          onError={() => setFailed(true)}
          draggable={false}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <LogoMark className="h-9 w-9 opacity-70" />
          <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/55">
            {title ?? alt}
          </span>
        </div>
      )}
    </div>
  )
}
