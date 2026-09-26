import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Compass, Search, Users2 } from 'lucide-react'
import { matchScoreFor, useStore } from '@/data/store'
import { FieldInfo, MatchRing } from '@/ui/common'
import type { DomainId, ProblemStatus } from '@/data/types'

const STATUSES: (ProblemStatus | 'All')[] = ['All', 'Under Review', 'Matched', 'In Progress', 'Expert Review', 'Validating', 'Solved', 'Needs Improvement']

export function ProblemCard({ p, matchPct }: { p: ReturnType<typeof useStore.getState>['problems'][number]; matchPct?: number }) {
  const cu = useStore((s) => s.currentUser)
  const saveProblem = useStore((s) => s.saveProblem)
  const community = useStore((s) => s.communities.find((c) => c.problemId === p.id))
  const saved = p.savedBy?.includes(cu?.id ?? '')
  return (
    <div className="card flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="chip bg-pine-900/5 text-pine-900/70">{p.domain === 'agri' ? '🌾 Agriculture' : '🏥 Healthcare'}</span>
            <span className="chip bg-pine-900 text-white">{p.status}</span>
            {p.analysis?.priority && <span className="chip bg-peach-100 text-pine-900">{p.analysis.priority}</span>}
          </div>
          <h3 className="mt-2 line-clamp-2 text-[15px] font-extrabold leading-snug text-ink">{p.title}</h3>
          <div className="mt-1 flex items-center gap-3 text-[11px] text-pine-900/55">
            <span>📍 {p.location}</span>
            <span>👥 {p.peopleAffected.toLocaleString('en-IN')} affected</span>
          </div>
          {community && (
            <Link
              to={`/community/${community.id}`}
              className="mt-2 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pine-50 to-royal-50 px-2.5 py-1 text-[11px] font-bold text-pine-800 ring-1 ring-pine-700/15 hover:from-pine-100 hover:to-royal-100"
              title={community.name}
            >
              <Users2 size={11} /> {community.memberIds.length}-member community active
            </Link>
          )}
        </div>
        {matchPct !== undefined && <MatchRing value={matchPct} />}
      </div>
      {p.analysis && (
        <div className="mt-3">
          <FieldInfo items={p.analysis.requiredSkills.slice(0, 4)} tone="sky" />
        </div>
      )}
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-pine-900/5 pt-3">
        <span className="text-[11px] font-semibold text-pine-900/45">
          {p.projectId ? '🤝 Team working' : p.status === 'Under Review' ? '⏳ Awaiting admin validation' : '🔍 Open for matching'}
        </span>
        <div className="flex items-center gap-1.5">
          {cu?.role === 'student' && (
            <button className="btn-ghost px-2 py-1.5 text-xs" onClick={() => saveProblem(p.id)}>{saved ? '★' : '☆'}</button>
          )}
          <Link to={`/problem/${p.id}`} className="btn-secondary px-3 py-1.5 text-xs">View Problem</Link>
        </div>
      </div>
    </div>
  )
}

export default function Discover() {
  const problems = useStore((s) => s.problems)
  const users = useStore((s) => s.users)
  const currentUser = useStore((s) => s.currentUser)
  const [q, setQ] = useState('')
  const [domain, setDomain] = useState<DomainId | 'all'>('all')
  const [status, setStatus] = useState<ProblemStatus | 'all'>('all')
  const [sort, setSort] = useState<'match' | 'priority' | 'recent'>('match')

  const filtered = useMemo(() => {
    const cu = users.find((u) => u.id === currentUser?.id)
    let list = problems.filter((p) =>
      (domain === 'all' || p.domain === domain) &&
      (status === 'all' || p.status === status) &&
      (q === '' || `${p.title} ${p.description} ${p.location}`.toLowerCase().includes(q.toLowerCase())))
    const prioRank: Record<string, number> = { 'Critical Priority': 3, 'High Priority': 2, 'Medium Priority': 1 }
    if (sort === 'match' && cu?.role === 'student') {
      list = [...list].sort((a, b) => matchScoreFor(cu, b) - matchScoreFor(cu, a))
    } else if (sort === 'priority') {
      list = [...list].sort((a, b) => (prioRank[b.analysis?.priority ?? ''] ?? 0) - (prioRank[a.analysis?.priority ?? ''] ?? 0))
    }
    return list
  }, [problems, users, currentUser, q, domain, status, sort])

  return (
    <div className="container-p max-w-7xl py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-pine-700"><Compass size={13} /> Discover</div>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-ink">Problems waiting for solvers</h1>
          <p className="mt-1 text-sm text-pine-900/55">Every problem here was reported by a real community and validated by admins/experts before work begins.</p>
        </div>
      </div>

      {/* filters */}
      <div className="card mt-6 space-y-3 p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-pine-900/45" />
            <input className="input pl-9" placeholder="Search problems, crops, equipment, locations…" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <select className="input sm:w-44" value={domain} onChange={(e) => setDomain(e.target.value as DomainId | 'all')}>
            <option value="all">All domains</option>
            <option value="agri">🌾 Agriculture</option>
            <option value="health">🏥 Healthcare</option>
          </select>
          <select className="input sm:w-44" value={status} onChange={(e) => setStatus(e.target.value as ProblemStatus | 'all')}>
            <option value="all">All statuses</option>
            {STATUSES.slice(1).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="input sm:w-40" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)}>
            <option value="match">Best match</option>
            <option value="priority">Highest priority</option>
            <option value="recent">Most recent</option>
          </select>
        </div>
      </div>

      {/* grid */}
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => (
          <ProblemCard key={p.id} p={p} matchPct={currentUser?.role === 'student' ? matchScoreFor(users.find((u) => u.id === currentUser.id)!, p) : undefined} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="card mt-6 grid place-items-center p-12 text-center text-sm text-pine-900/45">No problems match your filters.</div>
      )}
    </div>
  )
}
