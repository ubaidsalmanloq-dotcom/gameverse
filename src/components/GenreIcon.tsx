import {
  Compass,
  Cpu,
  Crosshair,
  Dices,
  EyeOff,
  Flame,
  Focus,
  Gauge,
  Ghost,
  Globe2,
  Puzzle,
  Skull,
  Swords,
  Trophy,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Swords,
  Compass,
  Dices,
  Crosshair,
  Focus,
  Globe2,
  Flame,
  Ghost,
  Gauge,
  Trophy,
  Puzzle,
  Cpu,
  Zap,
  EyeOff,
  Skull,
  Users,
}

export function GenreIcon({ name, className }: { name: string; className?: string }) {
  const Icon = iconMap[name] ?? Dices
  return <Icon className={className} strokeWidth={1.5} />
}
