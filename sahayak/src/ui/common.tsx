import { Link } from 'react-router-dom'
import { clsx } from 'clsx'
import type { ReactNode } from 'react'
import type { Role } from '@/data/types'
import { ROLE_LABEL } from '@/data/store'

export function cx(...a: (string | false | null | undefined)[]) {
  return clsx(a)
}

export function RoleBadge({ role, className }: { role: Role; className?: string }) {
  const styles: Record<Role, string> = {
    citizen: 'bg-pine-100 text-pine-800', farmer: 'bg-peach-100 text-pine-800',
    health_worker: 'bg-periwinkle text-navy', student: 'bg-pine-800 text-paper',
    faculty: 'bg-royal-100 text-royal-800', industry: 'bg-peach-200 text-pine-900',
    admin: 'bg-pine-900 text-paper',
  }
  return (
    <span className={cx('chip', styles[role], className)}>{ROLE_LABEL[role]}</span>
  )
}

export function MatchRing({ value, size = 44, title }: { value: number; size?: number; title?: string }) {
  const r = (size - 8) / 2
  const c = 2 * Math.PI * r
  const color = value >= 85 ? '#22582e' : value >= 70 ? '#2e6b3a' : '#3743b8'
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} title={title ?? `${value}% match`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e4e0d3" strokeWidth="5" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - (c * value) / 100}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-[10px] font-bold text-ink">{value}%</span>
    </div>
  )
}

export function Bar({ value, color = 'bg-pine-600', height = 'h-2' }: { value: number; color?: string; height?: string }) {
  return (
    <div className={cx('w-full rounded-full bg-pine-900/10', height)}>
      <div className={cx('h-full rounded-full transition-all', color)} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  )
}

export function Stat({ label, value, sub, tone = 'pine' }: { label: string; value: ReactNode; sub?: string; tone?: 'pine' | 'royal' | 'sun' | 'rose' }) {
  const tones = {
    pine: 'text-pine-700', royal: 'text-navy', sun: 'text-peach-400', rose: 'text-rose-600',
  }
  return (
    <div className="card p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-pine-900/55">{label}</div>
      <div className={cx('mt-1 text-2xl font-extrabold', tones[tone])}>{value}</div>
      {sub && <div className="mt-0.5 text-xs text-pine-900/55">{sub}</div>}
    </div>
  )
}

export function FieldInfo({ items, tone = 'slate' }: { items: string[]; tone?: 'slate' | 'green' | 'amber' | 'sky' }) {
  const tones = {
    slate: 'bg-pine-900/5 text-pine-800', green: 'bg-pine-100 text-pine-800',
    amber: 'bg-peach-50 text-pine-800', sky: 'bg-periwinkle text-navy',
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((i) => <span key={i} className={cx('chip', tones[tone])}>{i}</span>)}
    </div>
  )
}

export function SectionHeading({ icon, title, sub, action }: { icon: string; title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="text-lg font-extrabold tracking-tight text-ink flex items-center gap-2">
          <span aria-hidden>{icon}</span>{title}
        </h2>
        {sub && <p className="mt-0.5 text-sm text-pine-900/55">{sub}</p>}
      </div>
      {action}
    </div>
  )
}

export function EmptyState({ icon = '🗂️', title, sub, action }: { icon?: string; title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="card grid place-items-center px-6 py-12 text-center">
      <div className="text-4xl" aria-hidden>{icon}</div>
      <h3 className="mt-3 font-bold text-ink">{title}</h3>
      {sub && <p className="mt-1 max-w-md text-sm text-pine-900/55">{sub}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Dots() {
  return (
    <span className="inline-flex items-center gap-1" aria-label="Loading">
      {[0, 150, 300].map((d) => (
        <span key={d} className="h-2 w-2 animate-pulse rounded-full bg-pine-800" style={{ animationDelay: `${d}ms` }} />
      ))}
    </span>
  )
}

export function Sparkline({ color = '#22582e', height = 44 }: { color?: string; height?: number }) {
  const w = 240
  const pts = [0, 0.18, 0.14, 0.3, 0.26, 0.45, 0.42, 0.62, 0.58, 0.8, 0.86]
  const max = Math.max(...pts)
  const step = w / (pts.length - 1)
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(i * step).toFixed(1)} ${(height - 4 - (p / max) * (height - 10)).toFixed(1)}`).join(' ')
  const lastX = w
  const lastY = height - 4 - (pts[pts.length - 1] / max) * (height - 10)
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="w-full" style={{ height }} preserveAspectRatio="none">
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx={lastX - 2} cy={lastY} r="3.5" fill={color} />
    </svg>
  )
}

export function LocationMap({ location, small = false }: { location: string; small?: boolean }) {
  const seeded = (s: string) => [...s].reduce((a, c) => a + c.charCodeAt(0), 0)
  const h = seeded(location) % 50
  return (
    <div
      className={cx(
        'relative overflow-hidden rounded-xl border border-pine-200/70 bg-gradient-to-br from-pine-50 via-paper to-peach-50',
        small ? 'h-16' : 'h-40',
      )}
      title={location}
    >
      <svg className="absolute inset-0 h-full w-full opacity-40" preserveAspectRatio="none" viewBox="0 0 100 60">
        <path d="M0 40 Q 25 20 50 34 T 100 26" stroke="#2e6b3a" strokeWidth="1.5" fill="none" />
        <path d="M0 52 Q 30 40 60 48 T 100 44" stroke="#8fb889" strokeWidth="1.5" fill="none" />
        <path d="M12 0 L 20 60" stroke="#b9d4b4" strokeWidth="1.2" fill="none" />
        <path d="M64 0 L 58 60" stroke="#b9d4b4" strokeWidth="1.2" fill="none" />
      </svg>
      <div className="absolute" style={{ left: `${18 + h * 0.55}%`, top: `${28 + (h % 22)}%` }}>
        <span className="relative grid h-4 w-4 place-items-center">
          <span className="absolute h-4 w-4 animate-ping rounded-full bg-navy/30" />
          <span className="h-2.5 w-2.5 rounded-full bg-navy ring-2 ring-paper" />
        </span>
      </div>
      <span className="absolute bottom-1.5 left-2 rounded-md bg-paper/85 px-1.5 py-0.5 text-[10px] font-semibold text-pine-800">
        📍 {location}
      </span>
    </div>
  )
}

export function Avatar({ user, size = 40 }: { user: { avatar: string; name: string; photo?: string }; size?: number }) {
  if (user.photo) {
    return (
      <img
        src={user.photo} alt={user.name} title={user.name}
        className="shrink-0 rounded-full object-cover ring-1 ring-pine-900/10"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full bg-pine-100 ring-1 ring-pine-900/10"
      style={{ width: size, height: size, fontSize: size * 0.5 }}
      title={user.name}
    >
      {user.avatar}
    </span>
  )
}

export function LinkCard({ to, children, className }: { to: string; children: ReactNode; className?: string }) {
  return (
    <Link to={to} className={cx('card block p-5 transition hover:-translate-y-0.5 hover:shadow-pop', className)}>
      {children}
    </Link>
  )
}
