import { Link } from 'react-router-dom'
import {
  ArrowRight, Bell, CalendarClock, CheckCircle2, Compass, FilePlus2,
  Headset, Layers, MessagesSquare, Users2, Wrench,
} from 'lucide-react'
import { useStore } from '@/data/store'
import { ROLE_HOME } from '@/data/store'
import { Avatar, cx } from '@/ui/common'
import { useT } from '@/i18n'
import type { Lang } from '@/data/types'

const DAY_PERIOD = () => {
  const h = new Date().getHours()
  if (h < 5) return { en: 'Late night', hi: 'देर रात' }
  if (h < 12) return { en: 'Good morning', hi: 'सुप्रभात' }
  if (h < 17) return { en: 'Good afternoon', hi: 'नमस्कार' }
  return { en: 'Good evening', hi: 'शुभ संध्या' }
}

export default function HomePage() {
  const currentUser = useStore((s) => s.currentUser)
  const users = useStore((s) => s.users)
  const problems = useStore((s) => s.problems)
  const projects = useStore((s) => s.projects)
  const tasks = useStore((s) => s.tasks)
  const notifications = useStore((s) => s.notifications)
  const communities = useStore((s) => s.communities)
  const t = useT()

  if (!currentUser) return null
  const me = currentUser

  /* my data */
  const myProjects = projects.filter((p) => p.team.includes(me.id))
  const myTasks = tasks.filter((tk) => tk.assigneeId === me.id && tk.status !== 'Completed')
  const myProblems = problems.filter((p) => p.reporterId === me.id)
  const myNotifs = notifications.filter((n) => n.userId === me.id)
  const unread = myNotifs.filter((n) => !n.read).length
  const myCommunities = communities.filter((c) => c.memberIds.includes(me.id))
  const openProblems = problems.filter((p) => p.status === 'Under Review' || p.status === 'Matched')

  const greet = DAY_PERIOD()
  const greeting = useStore((s) => s.lang) === 'hi' ? greet.hi : (greet as Record<Lang | string, string>).en

  const firstName = me.name.split(' ')[0]
  const roleLabel = me.userType ?? me.title ?? ROLE_HOME[me.role]

  return (
    <div className="container-p max-w-7xl py-8">
      {/* ── greeting banner ── */}
      <div className="card relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-pine-50 via-transparent to-transparent" aria-hidden />
        <div className="relative flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-pine-900/45">{greeting}, {firstName}</div>
            <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-pine-900 sm:text-3xl">
              {myProjects.length > 0
                ? <>You have <span className="text-pine-700">{myProjects.length} active project{myProjects.length > 1 ? 's' : ''}</span> and {myTasks.length} open task{myTasks.length === 1 ? '' : 's'}.</>
                : myProblems.length > 0
                  ? <>Your reports are moving — {myProblems.length} problem{myProblems.length > 1 ? 's' : ''} in the pipeline.</>
                  : <>Ready to turn a real problem into a validated solution?</>}
            </h1>
            <p className="mt-1.5 text-sm text-pine-900/55">
              {roleLabel} · {t('hub')}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {unread > 0 && (
              <Link to="/notifications" className="btn border border-pine-900/15 bg-paper text-pine-900 hover:bg-pine-50">
                <Bell size={15} className="text-pine-700" /> {unread} new
              </Link>
            )}
            <Link to={ROLE_HOME[me.role]} className="btn-primary">
              My Dashboard <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── quick actions ── */}
      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { to: '/report', icon: FilePlus2, label: 'Report a problem', sub: 'AI analyzes it instantly', tone: 'bg-pine-50 text-pine-800 border-pine-700/20' },
          { to: '/discover', icon: Compass, label: 'Discover problems', sub: `${openProblems.length} open for matching`, tone: 'bg-royal-50 text-navy border-royal-200' },
          { to: '/knowledge', icon: MessagesSquare, label: 'Knowledge Ground', sub: 'Ask, share, learn', tone: 'bg-peach-50 text-pine-900 border-peach-200' },
          { to: '/workspace', icon: Wrench, label: 'My workspace', sub: myProjects.length ? 'Jump into your project' : 'Join a team to start', tone: 'bg-pine-900/5 text-pine-900 border-pine-900/10' },
        ].map((a) => (
          <Link key={a.to} to={a.to} className="card group flex items-start gap-3 p-4 transition hover:-translate-y-0.5 hover:shadow-card">
            <span className={cx('grid h-10 w-10 shrink-0 place-items-center rounded-xl border', a.tone)}>
              <a.icon size={18} />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-extrabold text-ink">{a.label}</span>
              <span className="mt-0.5 block truncate text-xs text-pine-900/55">{a.sub}</span>
            </span>
            <ArrowRight size={14} className="ml-auto mt-1 shrink-0 text-pine-900/25 transition group-hover:translate-x-0.5 group-hover:text-pine-700" />
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        {/* ── main column ── */}
        <div className="space-y-6">
          {/* my projects */}
          <section className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-extrabold text-ink">
                <Layers size={17} className="text-pine-700" /> My projects
              </h2>
              <Link to="/my-projects" className="text-xs font-bold text-pine-700 hover:underline">View all</Link>
            </div>
            {myProjects.length === 0 ? (
              <div className="mt-4 rounded-xl bg-pine-900/[0.04] p-5 text-sm text-pine-900/60">
                No projects yet. {me.role === 'student'
                  ? <>Find a problem on <Link to="/discover" className="link">Discover</Link> and build a team.</>
                  : <>Teams working on your reported problems will appear here.</>}
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {myProjects.slice(0, 3).map((p) => {
                  const problem = problems.find((x) => x.id === p.problemId)
                  const done = tasks.filter((tk) => tk.projectId === p.id && tk.status === 'Completed').length
                  const total = tasks.filter((tk) => tk.projectId === p.id).length
                  return (
                    <Link key={p.id} to={`/project/${p.id}`} className="block rounded-xl border border-pine-900/10 p-4 transition hover:border-pine-700/30 hover:bg-pine-50/50">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="chip bg-pine-900/5 text-pine-900/70">{p.domain === 'agri' ? '🌾 Agriculture' : '🏥 Healthcare'}</span>
                        <span className="chip bg-paper text-pine-900/60 ring-1 ring-pine-900/10">{p.stage} · {p.stageProgress}%</span>
                        {p.solutionStatus && <span className="chip bg-pine-50 text-pine-800">{p.solutionStatus}</span>}
                      </div>
                      <div className="mt-1.5 text-sm font-extrabold text-ink">{p.name}</div>
                      {problem && <div className="mt-0.5 text-xs text-pine-900/50">For: {problem.title.slice(0, 70)}{problem.title.length > 70 ? '…' : ''}</div>}
                      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-pine-900/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-pine-700 to-royal-600" style={{ width: `${p.stageProgress}%` }} />
                      </div>
                      <div className="mt-1.5 flex items-center justify-between text-[11px] font-semibold text-pine-900/50">
                        <span>{done}/{total} tasks done</span>
                        <span>{p.team.length} members · {p.validationStatus}</span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </section>

          {/* my tasks */}
          {myTasks.length > 0 && (
            <section className="card p-6">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-extrabold text-ink"><CheckCircle2 size={17} className="text-pine-700" /> My open tasks</h2>
                <Link to="/workspace" className="text-xs font-bold text-pine-700 hover:underline">Open workspace</Link>
              </div>
              <div className="mt-3 divide-y divide-pine-900/5">
                {myTasks.slice(0, 4).map((tk) => {
                  const prj = projects.find((p) => p.id === tk.projectId)
                  return (
                    <div key={tk.id} className="flex flex-wrap items-center gap-2.5 py-2.5">
                      <span className={cx('h-2 w-2 shrink-0 rounded-full', tk.priority === 'High' ? 'bg-rose-500' : tk.priority === 'Medium' ? 'bg-peach-400' : 'bg-pine-300')} />
                      <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink">{tk.title}</span>
                      <span className="chip bg-pine-900/5 text-pine-900/60">{prj?.name.split('—')[0].slice(0, 24)}</span>
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-pine-900/50"><CalendarClock size={12} /> {tk.deadline}</span>
                      <span className={cx('chip text-[10px]', tk.status === 'In Progress' ? 'bg-royal-100 text-royal-800' : 'bg-pine-900/5 text-pine-900/60')}>{tk.status}</span>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* my reported problems */}
          {myProblems.length > 0 && (
            <section className="card p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-extrabold text-ink">Problems I reported</h2>
                <Link to="/report" className="text-xs font-bold text-pine-700 hover:underline">+ Report another</Link>
              </div>
              <div className="mt-3 space-y-2.5">
                {myProblems.slice(0, 3).map((p) => (
                  <Link key={p.id} to={`/problem/${p.id}`} className="flex items-center gap-3 rounded-xl border border-pine-900/10 p-3.5 transition hover:border-pine-700/30 hover:bg-pine-50/50">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold text-ink">{p.title}</div>
                      <div className="mt-0.5 text-xs text-pine-900/50">{p.location} · {p.peopleAffected.toLocaleString('en-IN')} affected</div>
                    </div>
                    <span className="chip shrink-0 bg-pine-900 text-paper">{p.status}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ── side column ── */}
        <div className="space-y-6">
          {/* recent notifications */}
          <section className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-extrabold text-ink"><Bell size={17} className="text-pine-700" /> Recent activity</h2>
              <Link to="/notifications" className="text-xs font-bold text-pine-700 hover:underline">All</Link>
            </div>
            {myNotifs.length === 0 ? (
              <div className="mt-4 rounded-xl bg-pine-900/[0.04] p-5 text-sm text-pine-900/60">Nothing yet — activity on your problems, teams and communities will show here.</div>
            ) : (
              <div className="mt-3 space-y-2.5">
                {myNotifs.slice(0, 5).map((n) => (
                  <div key={n.id} className="flex items-start gap-2.5">
                    <span className={cx('mt-1.5 h-2 w-2 shrink-0 rounded-full', n.read ? 'bg-pine-900/20' : 'bg-pine-700')} />
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium leading-snug text-ink">{n.text}</div>
                      <div className="mt-0.5 text-[11px] text-pine-900/40">{n.at}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* my communities */}
          <section className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-extrabold text-ink"><Users2 size={17} className="text-pine-700" /> My communities</h2>
              <Link to="/discover" className="text-xs font-bold text-pine-700 hover:underline">Find more</Link>
            </div>
            {myCommunities.length === 0 ? (
              <div className="mt-4 rounded-xl bg-pine-900/[0.04] p-5 text-sm text-pine-900/60">
                Join a problem's community from any <Link to="/discover" className="link">problem page</Link>.
              </div>
            ) : (
              <div className="mt-3 space-y-2.5">
                {myCommunities.slice(0, 3).map((c) => (
                  <Link key={c.id} to={`/community/${c.id}`} className="flex items-center gap-3 rounded-xl border border-pine-900/10 p-3 transition hover:border-pine-700/30 hover:bg-pine-50/50">
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold text-ink">{c.name}</div>
                      <div className="mt-0.5 text-[11px] text-pine-900/50">{c.memberIds.length} members · {c.posts.length} posts</div>
                    </div>
                    <ArrowRight size={14} className="shrink-0 text-pine-900/25" />
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* team peek */}
          {myProjects[0] && (
            <section className="card p-6">
              <h2 className="font-extrabold text-ink">My team</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {myProjects[0].team.map((m) => {
                  const u = users.find((x) => x.id === m)
                  return u ? (
                    <span key={m} className="flex items-center gap-1.5 rounded-full bg-paper px-2.5 py-1.5 text-xs font-semibold text-ink ring-1 ring-pine-900/10">
                      <Avatar user={u} size={20} /> {u.name.split(' ')[0]}
                    </span>
                  ) : null
                })}
              </div>
              <Link to={`/project/${myProjects[0].id}`} className="btn-primary mt-4 w-full justify-center">Open workspace <ArrowRight size={14} /></Link>
            </section>
          )}

          {/* voice helpline — for users who may not type comfortably */}
          <section className="card flex items-start gap-3.5 p-5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-peach-100 text-pine-900 ring-1 ring-peach-200">
              <Headset size={22} />
            </span>
            <div className="min-w-0">
              <h2 className="text-[15px] font-extrabold text-ink">Voice Helpline</h2>
              <p className="mt-0.5 text-[13px] leading-snug text-pine-900/55">
                Toll-free 24/7 farmer hotline. Hindi voice notes & village visits — no typing needed.
              </p>
              <Link to="/helpline" className="btn-ghost mt-2.5 px-3 py-1.5 text-xs font-bold text-pine-800">
                📞 1800-266-4242 · Open helpline page
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
