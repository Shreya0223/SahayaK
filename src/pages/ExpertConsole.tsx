import { Link } from 'react-router-dom'
import { Flag, GraduationCap, ShieldCheck } from 'lucide-react'
import { useStore } from '@/data/store'
import { Bar, SectionHeading, Stat } from '@/ui/common'

export default function ExpertConsole() {
  const currentUser = useStore((s) => s.currentUser)
  const users = useStore((s) => s.users)
  const problems = useStore((s) => s.problems)
  const projects = useStore((s) => s.projects)
  const reviews = useStore((s) => s.reviews)
  const milestones = useStore((s) => s.milestones)

  const me = users.find((u) => u.id === currentUser?.id)
  const mentorOf = projects.filter((p) => p.mentorId === me?.id)
  const pendingReviews = projects.filter((p) => p.validationStatus === 'Requested')
  const problemsToValidate = problems.filter((p) => p.ai === 'done' && (p.status === 'Under Review' || p.status === 'Matched'))
  const myReviews = reviews.filter((r) => r.expertId === me?.id)

  return (
    <div className="container-p max-w-7xl py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-navy">
            <GraduationCap size={13} /> Faculty / domain expert console
          </div>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-ink">Dr. {me?.name.replace(/^Dr\.\s*/, '')}</h1>
          <p className="mt-1 text-sm text-pine-900/55">{me?.title} · {me?.institution}</p>
        </div>
        <div className="chip bg-royal-100 px-3 py-1.5 text-royal-800">
          «Students build the technology; experts validate the domain.»
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Projects mentoring" value={mentorOf.length} sub="As expert mentor" tone="royal" />
        <Stat label="Validation requests" value={pendingReviews.length} sub="Prototypes awaiting review" tone="sun" />
        <Stat label="Problems to validate" value={problemsToValidate.length} sub="Domain check needed" tone="rose" />
        <Stat label="Reviews submitted" value={myReviews.length} sub="All time" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <SectionHeading icon="🧪" title="Validation requests" sub="Prototype evidence, progress and risks in one view" />
          <div className="space-y-4">
            {pendingReviews.map((prj) => {
              const prob = problems.find((x) => x.id === prj.problemId)
              const team = users.filter((u) => prj.team.includes(u.id))
              const ms = milestones.filter((m) => m.projectId === prj.id)
              return (
                <div key={prj.id} className="card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-extrabold text-ink">{prj.name}</span>
                    <span className="chip bg-peach-100 text-pine-900">Review requested</span>
                  </div>
                  <div className="mt-1 text-xs text-pine-900/55">{prob?.domain === 'agri' ? '🌾' : '🏥'} {prob?.title.slice(0, 76)}…</div>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-pine-900/[0.04] p-2">
                      <div className="text-sm font-black text-ink">{prj.stageProgress}%</div>
                      <div className="text-[9px] font-bold uppercase text-pine-900/45">Progress</div>
                    </div>
                    <div className="rounded-xl bg-pine-900/[0.04] p-2">
                      <div className="text-sm font-black text-ink">{prj.team.length}</div>
                      <div className="text-[9px] font-bold uppercase text-pine-900/45">Members</div>
                    </div>
                    <div className="rounded-xl bg-pine-900/[0.04] p-2">
                      <div className="text-sm font-black text-ink">{team.filter((t) => t.role === 'student').length} disciplines</div>
                      <div className="text-[9px] font-bold uppercase text-pine-900/45">Coverage</div>
                    </div>
    </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {team.map((t) => <span key={t.id} className="chip bg-pine-900/5 text-pine-900/70">{t.avatar} {t.name.split(' ')[0]} · {t.branch?.split(' ')[0]}</span>)}
                  </div>
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-pine-900/45"><span>Milestones</span><span>{ms.filter((m) => m.status === 'done').length}/{ms.length}</span></div>
                    <div className="mt-1"><Bar value={(ms.filter((m) => m.status === 'done').length / Math.max(1, ms.length)) * 100} color="bg-royal-500" /></div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link to={`/project/${prj.id}`} className="btn-primary flex-1 justify-center">Open review panel <Flag size={14} /></Link>
                  </div>
                  <p className="mt-2 text-[10px] leading-relaxed text-pine-900/45">
                    You will see problem, proposed solution, team, evidence, progress, prototype and risks — then approve or request changes.
                  </p>
                </div>
              )
            })}
            {pendingReviews.length === 0 && (
              <div className="card p-6 text-sm text-pine-900/55">No pending validation requests. Teams will notify you when a prototype is ready.</div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <SectionHeading icon="🔍" title="Problems needing domain validation" sub="Confirm AI-identified expertise & skills are correct" />
            <div className="space-y-3">
              {problemsToValidate.map((p) => (
                <Link key={p.id} to={`/problem/${p.id}`} className="card block p-4 hover:shadow-card">
                  <div className="flex items-center justify-between gap-2">
                    <span className="min-w-0 flex-1 truncate text-sm font-bold text-ink">{p.title}</span>
                    <span className="chip bg-peach-100 text-pine-900">{p.analysis?.priority}</span>
                  </div>
                  <div className="mt-1 text-[11px] text-pine-900/55">📍 {p.location} · AI identified: {p.analysis?.knowledgeAreas.slice(0, 3).join(', ')}</div>
                </Link>
              ))}
              {problemsToValidate.length === 0 && <div className="card p-5 text-sm text-pine-900/55">Nothing waiting for domain validation.</div>}
            </div>
          </div>

          <div>
            <SectionHeading icon="🛠️" title="Milestone checkpoints" sub="Approvals across your mentored projects" />
            <div className="card divide-y divide-pine-900/5">
              {mentorOf.flatMap((prj) =>
                milestones.filter((m) => m.projectId === prj.id && m.status === 'active').map((m) => (
                  <div key={m.id} className="flex items-center gap-3 p-4">
                    <span className="chip bg-peach-100 text-pine-900">{m.title}</span>
                    <span className="min-w-0 flex-1 truncate text-xs text-pine-900/55">{prj.name}</span>
                    <span className="text-xs font-extrabold text-ink">{m.progress ?? 0}%</span>
                    <Link to={`/project/${prj.id}`} className="btn-ghost text-xs">Review</Link>
                  </div>
                )),
              )}
              {mentorOf.flatMap((prj) => milestones.filter((m) => m.projectId === prj.id && m.status === 'active')).length === 0 && (
                <div className="p-5 text-sm text-pine-900/55">No active milestones in your mentored projects.</div>
              )}
            </div>
          </div>

          <div className="card border-royal-200 bg-royal-50/60 p-5">
            <div className="flex items-center gap-2 text-sm font-extrabold text-navy"><ShieldCheck size={15} /> Reviewer principle</div>
            <p className="mt-1.5 text-xs leading-relaxed text-royal-800">
              Approving a project means the <i>domain assumptions and outputs</i> are professionally sound — not that the
              software is bug-free. Flag risks early; community validation still decides real-world success.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
