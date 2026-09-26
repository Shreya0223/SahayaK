import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { useStore } from '@/data/store'
import { Bar, SectionHeading, Stat, cx } from '@/ui/common'
import type { ProblemStatus } from '@/data/types'

const COLUMNS: { s: ProblemStatus; tone: string }[] = [
  { s: 'Under Review', tone: 'bg-pine-900/5 text-pine-900/70' },
  { s: 'Matched', tone: 'bg-periwinkle text-navy' },
  { s: 'In Progress', tone: 'bg-peach-100 text-pine-900' },
  { s: 'Expert Review', tone: 'bg-royal-100 text-royal-800' },
  { s: 'Validating', tone: 'bg-peach-100 text-pine-900' },
  { s: 'Solved', tone: 'bg-pine-100 text-pine-800' },
]

export default function AdminDashboard() {
  const problems = useStore((s) => s.problems)
  const projects = useStore((s) => s.projects)
  const users = useStore((s) => s.users)
  const feedbacks = useStore((s) => s.feedbacks)
  const auditLog = useStore((s) => s.auditLog)
  const routeProblem = useStore((s) => s.routeProblem)

  const byDomain = (d: string) => problems.filter((p) => p.domain === d).length
  const priorityCounts = ['Critical Priority', 'High Priority', 'Medium Priority'].map(
    (pr) => problems.filter((p) => p.analysis?.priority === pr).length,
  )
  const locations = [...new Set(problems.map((p) => p.location.split(',')[0].trim()))]
  const solvedProjects = projects.filter((p) => p.solutionStatus === 'Solved')
  const avgSat = feedbacks.length ? (feedbacks.reduce((a, f) => a + f.rating, 0) / feedbacks.length).toFixed(1) : '—'

  return (
    <div className="container-p max-w-7xl py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-ink"><ShieldCheck size={13} /> Admin · Institution · Government</div>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-ink">Platform oversight</h1>
          <p className="mt-1 text-sm text-pine-900/55">Monitor problems, validate routing, moderate content and measure real impact.</p>
        </div>
        <div className="chip bg-pine-900/5 px-3 py-1.5 text-pine-900/70">RBAC enforced · audit trail active</div>
      </div>

      {/* KPI row */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total problems" value={problems.length} sub="All reported on platform" />
        <Stat label="Active projects" value={projects.filter((p) => p.solutionStatus !== 'Solved').length} sub="Teams working now" tone="royal" />
        <Stat label="Validated solutions" value={solvedProjects.length} sub="Community-confirmed" tone="pine" />
        <Stat label="Avg satisfaction" value={avgSat} sub="From field feedback" tone="sun" />
      </div>

      {/* problem pipeline */}
      <div className="mt-8">
        <SectionHeading icon="📋" title="Problem pipeline" sub="Validate, reroute or hold incoming problems" />
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          {COLUMNS.map(({ s, tone }) => {
            const list = problems.filter((p) => p.status === s)
            return (
              <div key={s} className="rounded-2xl bg-pine-900/[0.04] p-2.5">
                <div className={cx('mb-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-extrabold', tone)}>{s} · {list.length}</div>
                <div className="space-y-2">
                  {list.map((p) => (
                    <div key={p.id} className="card p-3">
                      <Link to={`/problem/${p.id}`} className="line-clamp-2 text-[12px] font-bold leading-snug text-ink hover:text-pine-700">{p.title}</Link>
                      <div className="mt-1.5 flex items-center justify-between text-[10px] text-pine-900/45">
                        <span>{p.domain === 'agri' ? '🌾' : '🏥'} {p.location.split(',')[0]}</span>
                        <span>👥 {p.peopleAffected >= 1000 ? `${(p.peopleAffected / 1000).toFixed(1)}k` : p.peopleAffected}</span>
                      </div>
                      {s === 'Under Review' && (
                        <div className="mt-2 flex gap-1">
                          <button className="btn-primary flex-1 px-1 py-1 text-[10px]" onClick={() => routeProblem(p.id, 'Matched')}>Validate</button>
                          <button className="btn-secondary flex-1 px-1 py-1 text-[10px]" onClick={() => routeProblem(p.id, 'Under Review')}>Hold</button>
                        </div>
                      )}
                    </div>
                  ))}
                  {list.length === 0 && <div className="rounded-xl border border-dashed border-pine-900/20 p-3 text-center text-[10px] text-pine-900/45">—</div>}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* analytics */}
        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="text-sm font-extrabold text-ink">Problems by domain</h2>
            <div className="mt-3 space-y-3">
              {[
                ['🌾 Agriculture & Genetics', byDomain('agri')],
                ['🏥 Healthcare & Biotech', byDomain('health')],
              ].map(([l, v]) => (
                <div key={l as string}>
                  <div className="flex justify-between text-xs font-bold text-pine-900/70"><span>{l}</span><span>{v} · {Math.round(((v as number) / problems.length) * 100)}%</span></div>
                  <div className="mt-1"><Bar value={((v as number) / problems.length) * 100} color={l === '🌾 Agriculture & Genetics' ? 'bg-pine-600' : 'bg-royal-500'} /></div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-sm font-extrabold text-ink">Priority distribution</h2>
            <div className="mt-3 flex h-40 items-end gap-6 px-4">
              {['Critical Priority', 'High Priority', 'Medium Priority'].map((pr, i) => (
                <div key={pr} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-xs font-black text-ink">{priorityCounts[i]}</span>
                  <div className={cx('w-full rounded-t-lg', ['bg-rose-500', 'bg-peach-300', 'bg-peach-200'][i])}
                    style={{ height: `${Math.max(6, (priorityCounts[i] / Math.max(...priorityCounts)) * 100)}%` }} />
                  <span className="text-center text-[9px] font-bold leading-tight text-pine-900/55">{pr.replace(' Priority', '')}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <h2 className="text-sm font-extrabold text-ink">Problems by location</h2>
            <div className="mt-3 space-y-2">
              {locations.map((loc) => {
                const n = problems.filter((p) => p.location.split(',')[0].trim() === loc).length
                return (
                  <div key={loc} className="flex items-center gap-3">
                    <span className="w-24 truncate text-xs font-bold text-pine-900/70">📍 {loc}</span>
                    <div className="flex-1"><Bar value={(n / problems.length) * 100} height="h-1.5" color="bg-peach-300" /></div>
                    <span className="text-xs font-black text-ink">{n}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* projects + audit */}
        <div className="space-y-6">
          <div className="card p-5">
            <h2 className="text-sm font-extrabold text-ink">Project monitoring</h2>
            <div className="mt-3 space-y-3">
              {projects.map((prj) => {
                const prob = problems.find((x) => x.id === prj.problemId)
                return (
                  <div key={prj.id} className="rounded-xl border border-pine-900/10 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <Link to={`/project/${prj.id}`} className="text-sm font-bold text-ink hover:text-pine-700">{prj.name}</Link>
                      <span className="chip bg-pine-900/5 text-pine-900/70">{prj.stage} · {prj.stageProgress}%</span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] text-pine-900/55">
                      <span>{prob?.domain === 'agri' ? '🌾' : '🏥'} {prj.team.length} members</span>
                      <span>· Mentor: {users.find((u) => u.id === prj.mentorId)?.name ?? '—'}</span>
                      <span className={cx('chip', prj.validationStatus === 'Validated' ? 'bg-pine-100 text-pine-800' : prj.validationStatus === 'Requested' ? 'bg-peach-100 text-pine-900' : 'bg-pine-900/5 text-pine-900/55')}>
                        Expert: {prj.validationStatus}
                      </span>
                      {prj.solutionStatus && <span className="chip bg-periwinkle text-navy">Solution: {prj.solutionStatus}</span>}
                    </div>
                    <div className="mt-2"><Bar value={prj.stageProgress} height="h-1.5" /></div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-ink">Audit & moderation log</h2>
              <span className="chip bg-pine-900/5 text-pine-900/70">{auditLog.length} events</span>
            </div>
            <div className="mt-3 max-h-72 space-y-2 overflow-y-auto pr-1">
              {auditLog.map((a) => (
                <div key={a.id} className="rounded-lg bg-pine-900/[0.04] px-3 py-2 text-xs">
                  <span className="font-bold text-ink">{a.actor}</span> — {a.action}
                  <span className="ml-1 text-pine-900/45">· {a.at}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
