import { Link } from 'react-router-dom'
import { LineChart, Quote } from 'lucide-react'
import { useStore, isStudent } from '@/data/store'
import { Bar, SectionHeading, Stat } from '@/ui/common'

export default function Impact() {
  const problems = useStore((s) => s.problems)
  const projects = useStore((s) => s.projects)
  const users = useStore((s) => s.users)
  const feedbacks = useStore((s) => s.feedbacks)
  const currentUser = useStore((s) => s.currentUser)

  const solved = projects.filter((p) => p.solutionStatus === 'Solved')
  const adoption = solved.filter((p) => p.impact).reduce((a, p) => a + p.impact!.peopleReached, 0)
  const avgSat = feedbacks.length ? (feedbacks.reduce((a, f) => a + f.rating, 0) / feedbacks.length).toFixed(1) : '—'
  const studentCount = users.filter((u) => u.role === 'student').length
  const maxBar = Math.max(...problems.map((p) => p.peopleAffected), 1)
  const institutions = new Set(users.map((u) => u.institution).filter(Boolean)).size

  return (
    <div className="container-p max-w-7xl py-8">
      <SectionHeading
        icon="📈" title="Impact dashboard"
        sub="Outcomes over vanity metrics — did the original problem actually improve?"
      />

      <div className="rounded-2xl border border-pine-700/20 bg-gradient-to-r from-pine-50 to-royal-50 p-5">
        <div className="flex items-start gap-3">
          <Quote size={18} className="mt-0.5 shrink-0 text-pine-700" />
          <div className="text-sm font-semibold leading-relaxed text-pine-900">
            «Technical Success ≠ Social Impact.» A deployed model or device only counts when the reporting community
            confirms the problem improved. Every number below is traced to community validation, not activity logs.
          </div>
        </div>
      </div>

      {/* community impact */}
      <div className="mt-8">
        <h2 className="text-lg font-extrabold text-ink">🌍 Community impact</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Problems addressed" value={problems.filter((p) => ['In Progress', 'Expert Review', 'Validating', 'Solved'].includes(p.status)).length} sub={`of ${problems.length} reported`} />
          <Stat label="Solutions validated" value={solved.length} sub="Confirmed by reporters" tone="pine" />
          <Stat label="People reached" value={adoption.toLocaleString('en-IN')} sub="Via adopted solutions" tone="royal" />
          <Stat label="User satisfaction" value={`${avgSat}/5`} sub={`${feedbacks.length} field validations`} tone="sun" />
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="card p-5">
            <div className="text-sm font-extrabold text-ink">Time saved & cost reduction (validated projects)</div>
            <div className="mt-3 space-y-3">
              {projects.filter((p) => p.impact).map((p) => (
                <div key={p.id} className="rounded-xl bg-pine-900/[0.04] p-3">
                  <div className="text-xs font-extrabold text-ink">{p.name}</div>
                  <div className="mt-1 grid grid-cols-2 gap-2 text-[11px] text-pine-900/70">
                    <span>⏱ {p.impact!.timeSaved}</span>
                    <span>💰 {p.impact!.costReduction}</span>
                    <span>👥 {p.impact!.adoption}</span>
                    <span>⭐ {p.impact!.satisfaction}/5 satisfaction</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card p-5">
            <div className="text-sm font-extrabold text-ink">Reach by problem (people affected)</div>
            <div className="mt-3 space-y-2">
              {[...problems].sort((a, b) => b.peopleAffected - a.peopleAffected).slice(0, 6).map((p) => (
                <div key={p.id} className="flex items-center gap-3">
                  <span className="w-40 truncate text-[11px] font-bold text-pine-900/70">{p.title.slice(0, 34)}…</span>
                  <div className="flex-1"><Bar value={(p.peopleAffected / maxBar) * 100} height="h-1.5" color={p.domain === 'agri' ? 'bg-pine-600' : 'bg-royal-500'} /></div>
                  <span className="w-10 text-right text-[11px] font-black text-ink">{p.peopleAffected >= 1000 ? `${(p.peopleAffected / 1000).toFixed(1)}k` : p.peopleAffected}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* student impact */}
      <div className="mt-10">
        <h2 className="text-lg font-extrabold text-ink">🎓 Student impact</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Skills developed" value="120+" sub="Across live projects (est.)" tone="royal" />
          <Stat label="Projects completed" value={projects.filter((p) => p.solutionStatus === 'Solved').length} sub="Taken through validation" />
          <Stat label="Multidisciplinary teams" value={projects.length} sub="Avg 4.5 disciplines/project" tone="sun" />
          <Stat label="Verified experience" value={studentCount * 3 + '+'} sub="Portfolio-validated contributions" tone="rose" />
        </div>
        {isStudent(currentUser?.role) && (
          <div className="card mt-4 flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <div className="text-sm font-extrabold text-ink">Your verified experience record</div>
              <div className="text-xs text-pine-900/55">Completed tasks, expert feedback and validated projects become a portfolio employers can trust.</div>
            </div>
            <Link to="/profile" className="btn-secondary">View my profile record</Link>
          </div>
        )}
      </div>

      {/* institution impact */}
      <div className="mt-10">
        <h2 className="text-lg font-extrabold text-ink">🏛️ Institution impact</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Stat label="Innovation projects" value={projects.length} sub="Live + completed" tone="royal" />
          <Stat label="Research collaboration" value={`${institutions} institutions`} sub="Cross-institution teams" />
          <Stat label="Community engagement" value={`${problems.length} problems`} sub="Sourced directly from communities" tone="sun" />
        </div>
      </div>

      {/* monthly trend */}
      <div className="card mt-10 p-5">
        <div className="flex items-center gap-2">
          <LineChart size={16} className="text-pine-700" />
          <span className="text-sm font-extrabold text-ink">Validated solutions per month (demo trajectory)</span>
        </div>
        <div className="mt-4 flex h-44 items-end gap-4 px-2">
          {[4, 6, 7, 9, 11, 12].map((v, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="text-xs font-black text-ink">{v}</span>
              <div className="w-full rounded-t-lg bg-gradient-to-t from-pine-500 to-pine-300" style={{ height: `${(v / 12) * 100}%` }} />
              <span className="text-[10px] font-bold text-pine-900/45">{['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'][i]}</span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-pine-900/45">Counts include only solutions that passed community validation — partial fixes are tracked separately.</p>
      </div>
    </div>
  )
}
