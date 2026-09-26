import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  ArrowRight, Bell, CheckCircle2, Compass, FilePlus2, Headset, Home,
  Layers, MessagesSquare, PanelLeftClose, PanelLeftOpen, Users2, Wrench, X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useStore } from '@/data/store'
import { Avatar, cx } from '@/ui/common'

const DAY_PERIOD = () => {
  const h = new Date().getHours()
  if (h < 5) return { en: 'Late night', hi: 'देर रात' }
  if (h < 12) return { en: 'Good morning', hi: 'सुप्रभात' }
  if (h < 17) return { en: 'Good afternoon', hi: 'नमस्कार' }
  return { en: 'Good evening', hi: 'शुभ संध्या' }
}

function DockHead({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-pine-900/45">
      <Icon size={12} className="text-pine-600" /> {label}
    </div>
  )
}

/* Compact version of the Home page that lives beside every route. */
function DockContent({ onNavigate }: { onNavigate?: () => void }) {
  const currentUser = useStore((s) => s.currentUser)
  const projects = useStore((s) => s.projects)
  const tasks = useStore((s) => s.tasks)
  const notifications = useStore((s) => s.notifications)
  const communities = useStore((s) => s.communities)
  const lang = useStore((s) => s.lang)
  if (!currentUser) return null
  const me = currentUser

  const myProjects = projects.filter((p) => p.team.includes(me.id))
  const myTasks = tasks.filter((tk) => tk.assigneeId === me.id && tk.status !== 'Completed')
  const myNotifs = notifications.filter((n) => n.userId === me.id)
  const myCommunities = communities.filter((c) => c.memberIds.includes(me.id))

  const greet = DAY_PERIOD()
  const greeting = lang === 'hi' ? greet.hi : greet.en

  const actions = [
    { to: '/report', icon: FilePlus2, label: 'Report issue', tone: 'text-pine-800' },
    { to: '/discover', icon: Compass, label: 'Discover', tone: 'text-navy' },
    { to: '/knowledge', icon: MessagesSquare, label: 'Knowledge', tone: 'text-pine-900' },
    { to: '/workspace', icon: Wrench, label: 'Workspace', tone: 'text-pine-900' },
  ]

  return (
    <div className="space-y-3">
      {/* user mini-card */}
      <div className="card p-4">
        <div className="flex items-center gap-3">
          <Avatar user={me} size={38} />
          <div className="min-w-0">
            <div className="truncate text-sm font-extrabold text-ink">{me.name}</div>
            <div className="truncate text-[11px] text-pine-900/50">{greeting} · {me.userType ?? me.title ?? 'Member'}</div>
          </div>
        </div>
        <Link to="/" onClick={onNavigate} className="btn-ghost mt-3 w-full justify-center text-xs font-bold">
          Open full home <ArrowRight size={13} />
        </Link>
      </div>

      {/* quick actions */}
      <div className="grid grid-cols-2 gap-2">
        {actions.map((a) => (
          <Link
            key={a.to} to={a.to} onClick={onNavigate}
            className="flex items-center gap-2 rounded-xl border border-pine-900/10 bg-paper px-3 py-2.5 text-xs font-bold text-ink transition hover:border-pine-700/30 hover:bg-pine-50"
          >
            <a.icon size={14} className={cx('shrink-0', a.tone)} /> {a.label}
          </Link>
        ))}
      </div>

      {/* my projects */}
      {myProjects.length > 0 && (
        <section className="card p-4">
          <DockHead icon={Layers} label={`My projects (${myProjects.length})`} />
          <div className="mt-2 space-y-1.5">
            {myProjects.slice(0, 2).map((p) => (
              <Link key={p.id} to={`/project/${p.id}`} onClick={onNavigate} className="block rounded-lg p-1.5 transition hover:bg-pine-50">
                <div className="truncate text-xs font-bold text-ink">{p.name}</div>
                <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-pine-900/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-pine-700 to-royal-600" style={{ width: `${p.stageProgress}%` }} />
                </div>
                <div className="mt-1 text-[10px] font-semibold text-pine-900/45">{p.stage} · {p.stageProgress}%</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* open tasks */}
      {myTasks.length > 0 && (
        <section className="card p-4">
          <DockHead icon={CheckCircle2} label={`Open tasks (${myTasks.length})`} />
          <div className="mt-1.5 divide-y divide-pine-900/5">
            {myTasks.slice(0, 3).map((tk) => (
              <Link key={tk.id} to="/workspace" onClick={onNavigate} className="flex items-center gap-2 py-2">
                <span className={cx('h-1.5 w-1.5 shrink-0 rounded-full', tk.priority === 'High' ? 'bg-rose-500' : 'bg-peach-400')} />
                <span className="min-w-0 flex-1 truncate text-xs font-semibold text-ink">{tk.title}</span>
                <span className="shrink-0 text-[10px] text-pine-900/40">{tk.deadline}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* recent activity */}
      <section className="card p-4">
        <DockHead icon={Bell} label="Activity" />
        {myNotifs.length === 0 ? (
          <p className="mt-2 text-xs leading-snug text-pine-900/45">Nothing yet — updates on your problems, teams and communities will show here.</p>
        ) : (
          <div className="mt-2 space-y-2">
            {myNotifs.slice(0, 3).map((n) => (
              <Link key={n.id} to="/notifications" onClick={onNavigate} className="flex items-start gap-2">
                <span className={cx('mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full', n.read ? 'bg-pine-900/20' : 'bg-pine-700')} />
                <span className="min-w-0">
                  <span className="line-clamp-2 block text-xs font-medium leading-snug text-ink">{n.text}</span>
                  <span className="mt-0.5 block text-[10px] text-pine-900/40">{n.at}</span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* my communities */}
      {myCommunities.length > 0 && (
        <section className="card p-4">
          <DockHead icon={Users2} label={`My communities (${myCommunities.length})`} />
          <div className="mt-2 space-y-1">
            {myCommunities.slice(0, 2).map((c) => (
              <Link key={c.id} to={`/community/${c.id}`} onClick={onNavigate} className="flex items-center justify-between gap-2 rounded-lg p-1.5 transition hover:bg-pine-50">
                <span className="truncate text-xs font-bold text-ink">{c.name}</span>
                <span className="shrink-0 text-[10px] font-semibold text-pine-900/40">{c.memberIds.length} members</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* voice helpline */}
      <Link to="/helpline" onClick={onNavigate} className="card flex items-center gap-3 p-4 transition hover:bg-pine-50/60">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-peach-100 text-pine-900 ring-1 ring-peach-200">
          <Headset size={16} />
        </span>
        <span className="min-w-0">
          <span className="block text-xs font-extrabold text-ink">Voice Helpline</span>
          <span className="block truncate text-[10px] text-pine-900/50">Toll-free 24/7 · 📞 1800-266-4242</span>
        </span>
      </Link>
    </div>
  )
}

/*
 * HomeDockHost — renders the compact Home panel beside the routed page.
 * Hidden on the home route itself (the full page lives there) and for
 * signed-out visitors. Desktop: sticky side rail, collapsible.
 * Mobile: floating Home button opening a left drawer.
 */
export default function HomeDockHost({ children }: { children: ReactNode }) {
  const currentUser = useStore((s) => s.currentUser)
  const { pathname } = useLocation()
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sk-dock-collapsed') === '1')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const toggleCollapse = () => {
    setCollapsed((v) => {
      localStorage.setItem('sk-dock-collapsed', v ? '0' : '1')
      return !v
    })
  }

  if (!currentUser || pathname === '/') return <>{children}</>

  return (
    <>
      <div className="mx-auto flex w-full max-w-[1720px] items-start">
        {!collapsed && (
          <aside className="sticky top-[108px] z-20 hidden max-h-[calc(100vh-124px)] w-[302px] shrink-0 overflow-y-auto p-3 pr-0 xl:block">
            <div className="relative">
              <button
                onClick={toggleCollapse} title="Hide home panel" aria-label="Hide home panel"
                className="absolute -right-1 -top-1 z-10 grid h-7 w-7 place-items-center rounded-full border border-pine-900/10 bg-paper text-pine-700 shadow-card transition hover:bg-pine-50"
              >
                <PanelLeftClose size={14} />
              </button>
              <DockContent />
            </div>
          </aside>
        )}
        <div className="min-w-0 flex-1">{children}</div>
      </div>

      {/* desktop restore pill when collapsed */}
      {collapsed && (
        <button
          onClick={toggleCollapse} aria-label="Show home panel"
          className="fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-1 rounded-2xl border border-pine-900/10 bg-paper px-3 py-3 text-[10px] font-extrabold text-pine-800 shadow-pop transition hover:bg-pine-50 xl:flex"
        >
          <PanelLeftOpen size={16} /> Home
        </button>
      )}

      {/* mobile floating home button */}
      <button
        onClick={() => setDrawerOpen(true)} aria-label="Open home panel"
        className="fixed bottom-5 left-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-pine-800 text-paper shadow-pop transition hover:bg-pine-900 xl:hidden"
      >
        <Home size={20} />
      </button>

      {/* mobile drawer */}
      {drawerOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-pine-900/40 backdrop-blur-sm xl:hidden" onClick={() => setDrawerOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 w-[320px] max-w-[88vw] overflow-y-auto bg-cream p-3 shadow-2xl xl:hidden">
            <div className="mb-2 flex items-center justify-between px-1">
              <span className="text-xs font-extrabold uppercase tracking-widest text-pine-900/50">Home</span>
              <button onClick={() => setDrawerOpen(false)} className="grid h-8 w-8 place-items-center rounded-full text-pine-800 hover:bg-pine-100" aria-label="Close home panel">
                <X size={16} />
              </button>
            </div>
            <DockContent onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </>
      )}
    </>
  )
}
