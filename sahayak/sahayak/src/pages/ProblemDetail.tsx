import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowRight, BrainCircuit, Check, FileText, Flag, Image as ImageIcon, Info, Lightbulb,
  Lock, Users2, Video,
} from 'lucide-react'
import { matchPeople, useStore } from '@/data/store'
import { Avatar, FieldInfo, LocationMap, MatchRing, cx } from '@/ui/common'

const PRIORITY_TONE: Record<string, string> = {
  'Critical Priority': 'bg-rose-100 text-rose-700', 'High Priority': 'bg-peach-100 text-pine-900',
  'Medium Priority': 'bg-peach-100 text-pine-900',
}

function Pipeline() {
  const stages = [
    { icon: '🧩', label: 'Knowledge Areas', tone: 'bg-royal-50 text-navy border-royal-200' },
    { icon: '🛠️', label: 'Required Skills', tone: 'bg-royal-50 text-navy border-royal-200' },
    { icon: '🎓', label: 'Disciplines', tone: 'bg-peach-50 text-pine-900 border-peach-200' },
    { icon: '🤝', label: 'Suitable People', tone: 'bg-pine-50 text-pine-900 border-pine-700/20' },
  ]
  return (
    <div className="rounded-2xl border border-pine-900/10 bg-gradient-to-br from-pine-50 to-pine-50/40 p-4">
      <div className="mb-3 text-[11px] font-bold uppercase tracking-widest text-pine-900/55">
        Problem → Knowledge → Skills → People
      </div>
      <div className="grid gap-2 md:grid-cols-4">
        {stages.map((s, i) => (
          <div key={s.label} className="relative">
            <div className={cx('rounded-xl border p-3', s.tone)}>
              <div className="text-lg">{s.icon}</div>
              <div className="mt-1 text-xs font-extrabold">{s.label}</div>
            </div>
            {i < stages.length - 1 && (
              <ArrowRight size={14} className="absolute -right-[13px] top-1/2 z-10 hidden -translate-y-1/2 text-pine-900/45 md:block" />
            )}
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs font-semibold text-pine-900/55">
        «The problem determines the required skills — not simply the student's branch.»
      </p>
    </div>
  )
}

/* Inline community card — joins the per-problem community from the problem page */
function ProblemCommunityCard({ problemId }: { problemId: string }) {
  const community = useStore((s) => s.communities.find((c) => c.problemId === problemId))
  const users = useStore((s) => s.users)
  const joinCommunity = useStore((s) => s.joinCommunity)
  const currentUser = useStore((s) => s.currentUser)
  const navigate = useNavigate()

  if (!community) {
    return (
      <div className="card p-5">
        <div className="text-[11px] font-bold uppercase text-pine-900/45">Problem community</div>
        <p className="mt-2 text-xs leading-relaxed text-pine-900/55">
          A community circle forms here once the problem is validated — farmers, students and experts
          coordinating in one place.
        </p>
      </div>
    )
  }

  const isMember = !!currentUser && community.memberIds.includes(currentUser.id)
  const faces = community.memberIds.slice(0, 5).map((m) => users.find((u) => u.id === m)).filter(Boolean)
  const latest = community.posts[0]

  return (
    <div className="card overflow-hidden">
      <div className="bg-gradient-to-r from-pine-800 to-royal-700 px-5 py-4 text-paper">
        <div className="text-[10px] font-black uppercase tracking-widest text-paper/60">Problem community</div>
        <div className="mt-0.5 font-display text-base font-extrabold">{community.name}</div>
        <div className="mt-1 flex items-center gap-2 text-[11px] text-paper/70">
          <Users2 size={12} /> {community.memberIds.length} members · {community.posts.length} posts · {community.events.length} events
        </div>
      </div>
      <div className="p-5">
        {faces.length > 0 && (
          <div className="flex items-center">
            {faces.map((u, i) => (
              <span key={u!.id} className={cx('-ml-1.5 inline-flex rounded-full ring-2 ring-paper', i === 0 && 'ml-0')}>
                <Avatar user={u!} size={28} />
              </span>
            ))}
            <span className="ml-2 text-[11px] font-semibold text-pine-900/55">
              {users.find((u) => u.id === community.coordinatorId)?.name} coordinates
            </span>
          </div>
        )}
        {latest && (
          <div className="mt-3 rounded-xl bg-pine-900/[0.03] p-3">
            <p className="line-clamp-2 text-[12px] leading-relaxed text-pine-900/70">
              <b className="text-pine-900">{users.find((u) => u.id === latest.authorId)?.name}:</b> {latest.text}
            </p>
          </div>
        )}
        <div className="mt-3 flex gap-2">
          {isMember ? (
            <Link to={`/community/${community.id}`} className="btn-primary flex-1 justify-center">Open community <ArrowRight size={14} /></Link>
          ) : (
            <>
              <button
                className="btn-primary flex-1 justify-center"
                onClick={() => currentUser ? joinCommunity(community.id) : navigate('/auth')}
              >
                + Join community
              </button>
              <Link to={`/community/${community.id}`} className="btn justify-center border border-pine-900/15 bg-white px-3 text-pine-900 hover:bg-pine-50">
                Peek inside
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ProblemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const problem = useStore((s) => s.problems.find((p) => p.id === id))
  const users = useStore((s) => s.users)
  const projects = useStore((s) => s.projects)
  const currentUser = useStore((s) => s.currentUser)
  const saveProblem = useStore((s) => s.saveProblem)
  const createProject = useStore((s) => s.createProject)
  const routeProblem = useStore((s) => s.routeProblem)
  const setToast = useStore((s) => s.setToast)

  const [picked, setPicked] = useState<string[]>([])
  const [showMatcher, setShowMatcher] = useState(false)
  const [projectName, setProjectName] = useState('')

  const reporter = users.find((u) => u.id === problem?.reporterId)
  const existingProject = projects.find((p) => p.problemId === id)
  const isStudent = currentUser?.role === 'student'
  const isAdmin = currentUser?.role === 'admin'
  const canSeeSensitive = currentUser && ['health_worker', 'faculty', 'admin'].includes(currentUser.role)

  const matches = useMemo(
    () => problem?.analysis ? matchPeople(problem.analysis.requiredSkills, problem.domain, existingProject?.team ?? []) : [],
    [problem?.analysis, problem?.domain, existingProject?.team],
  )

  if (!problem) return <div className="container-p py-16 text-center text-pine-900/55">Problem not found.</div>

  const saved = problem.savedBy?.includes(currentUser?.id ?? '')

  const togglePick = (uid2: string) =>
    setPicked((p) => (p.includes(uid2) ? p.filter((x) => x !== uid2) : [...p, uid2]))

  const buildTeam = () => {
    if (!currentUser) { navigate('/auth'); return }
    const team = picked.length ? picked : matches.slice(0, 4).map((m) => m.user.id)
    const name = projectName.trim() || `Project ${problem.title.split('—')[0].split(':')[0].slice(0, 36)}`
    const prj = createProject(problem.id, name, Array.from(new Set([currentUser.id, ...team])))
    setPicked([])
    navigate(`/project/${prj.id}`)
  }

  return (
    <div className="container-p max-w-6xl py-8">
      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip bg-pine-900/5 text-pine-900/75">{problem.domain === 'agri' ? '🌾 Agriculture & Genetics' : '🏥 Healthcare & Biotech'}</span>
            <span className={cx('chip', PRIORITY_TONE[problem.analysis?.priority ?? ''] ?? 'bg-pine-900/5 text-pine-900/70')}>
              {problem.analysis?.priority ?? 'Priority pending'}
            </span>
            <span className="chip bg-pine-900 text-white">{problem.status}</span>
            {problem.sensitive && <span className="chip bg-periwinkle text-navy">🔒 Access-controlled</span>}
          </div>
          <h1 className="mt-3 text-2xl font-black leading-snug tracking-tight text-ink sm:text-3xl">{problem.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-pine-900/55">
            <span>📍 {problem.location}</span>
            <span>👥 {problem.peopleAffected.toLocaleString('en-IN')} people affected</span>
            <span>🕒 Reported {problem.createdAt} by {reporter?.name} ({reporter ? reporter.userType ?? reporter.role : 'community'})</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {isStudent && (
            <button className="btn-secondary" onClick={() => saveProblem(problem.id)}>
              {saved ? '★ Saved' : '☆ Save'}
            </button>
          )}
          {isAdmin && problem.status === 'Under Review' && (
            <div className="flex gap-2">
              <button className="btn-primary" onClick={() => { routeProblem(problem.id, 'Matched'); setToast('Problem validated → open for matching') }}>Validate & open for matching</button>
              <button className="btn-secondary" onClick={() => { routeProblem(problem.id, 'Under Review'); setToast('Kept under review — reporter notified') }}>Hold</button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* main column */}
        <div className="space-y-6">
          {/* description */}
          <div className="card p-6">
            <h2 className="font-extrabold text-ink">The problem, in the reporter's words</h2>
            <p className="mt-2 text-sm leading-relaxed text-pine-900/70">{problem.description}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-pine-900/[0.04] p-3">
                <div className="text-[11px] font-bold uppercase text-pine-900/45">Existing attempts</div>
                <p className="mt-1 text-xs leading-relaxed text-pine-900/70">{problem.existingAttempts}</p>
              </div>
              <div className="rounded-xl bg-pine-900/[0.04] p-3">
                <div className="text-[11px] font-bold uppercase text-pine-900/45">Urgency & scale</div>
                <p className="mt-1 text-xs leading-relaxed text-pine-900/70">Urgency: {problem.urgency}. {problem.peopleAffected.toLocaleString('en-IN')} people affected across the reported area.</p>
              </div>
            </div>
            {(problem.imageTags?.length || problem.docs?.length || problem.video) && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {problem.imageTags?.map((i) => <span key={i} className="chip bg-pine-900/5 text-pine-900/70"><ImageIcon size={10} /> {i}</span>)}
                {problem.docs?.map((d) => <span key={d} className="chip bg-pine-900/5 text-pine-900/70"><FileText size={10} /> {d}</span>)}
                {problem.video && <span className="chip bg-pine-900/5 text-pine-900/70"><Video size={10} /> {problem.video}</span>}
              </div>
            )}
          </div>

          {/* AI analysis */}
          {problem.ai === 'done' && problem.analysis ? (
            <div className="card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-pine-900/5 bg-gradient-to-r from-pine-50 to-paper px-6 py-4">
                <BrainCircuit size={17} className="text-pine-700" />
                <h2 className="font-extrabold text-ink">AI Challenge Intelligence</h2>
                <span className="chip ml-auto bg-paper text-pine-900/55 ring-1 ring-pine-900/10">demo engine · v2.1</span>
              </div>
              <div className="space-y-5 p-6">
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    ['Domain', problem.analysis.domainLabel],
                    ['Category', problem.analysis.category],
                    ['Problem type', problem.analysis.problemType],
                  ].map(([l, v]) => (
                    <div key={l} className="rounded-xl border border-pine-900/10 p-3">
                      <div className="text-[10px] font-bold uppercase tracking-wide text-pine-900/45">{l}</div>
                      <div className="mt-0.5 text-sm font-extrabold text-ink">{v}</div>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wide text-pine-900/45">Why this priority</div>
                  <ul className="mt-1.5 space-y-1">
                    {problem.analysis.priorityReasons.map((r) => (
                      <li key={r} className="flex items-center gap-2 text-sm text-pine-900/70"><Check size={13} className="text-pine-700" />{r}</li>
                    ))}
                  </ul>
                </div>

                <Pipeline />

                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wide text-pine-900/45">Required expertise (validated by experts)</div>
                    <div className="mt-1.5"><FieldInfo items={problem.analysis.knowledgeAreas} tone="green" /></div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wide text-pine-900/45">Required skills</div>
                    <div className="mt-1.5"><FieldInfo items={problem.analysis.requiredSkills} tone="sky" /></div>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wide text-pine-900/45">Disciplines involved</div>
                    <div className="mt-1.5"><FieldInfo items={problem.analysis.disciplines} tone="amber" /></div>
                  </div>
                </div>

                {problem.analysis.duplicates.length > 0 && (
                  <div className="rounded-xl border border-peach-200 bg-peach-50 p-3">
                    <div className="text-xs font-extrabold text-pine-900">{problem.analysis.duplicates.length} similar challenge{problem.analysis.duplicates.length > 1 ? 's' : ''} found</div>
                    <div className="mt-2 space-y-1.5">
                      {problem.analysis.duplicates.map((d) => (
                        <Link key={d.id} to={`/problem/${d.id}`} className="flex items-center justify-between gap-3 rounded-lg bg-paper/70 px-3 py-2 text-xs hover:bg-paper">
                          <span className="min-w-0 flex-1 truncate font-semibold text-ink">{d.title}</span>
                          <span className="chip shrink-0 bg-pine-900/5 text-pine-900/70">{d.similarity}% similar · {d.status}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <div className="rounded-xl bg-pine-50 p-4">
                  <div className="flex items-start gap-2 text-sm leading-relaxed text-pine-900">
                    <Lightbulb size={15} className="mt-0.5 shrink-0" />
                    <span><b>AI recommendation:</b> {problem.analysis.recommendation}</span>
                  </div>
                  {problem.analysis.notes.map((n) => (
                    <div key={n} className="mt-2 flex items-start gap-2 text-xs leading-relaxed text-pine-800">
                      <Info size={12} className="mt-0.5 shrink-0" /> {n}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="card p-6">
              <div className="flex items-center gap-2 text-sm font-bold text-pine-900/55">
                <BrainCircuit size={16} className="animate-pulse text-pine-700" /> AI analysis in progress…
              </div>
            </div>
          )}

          {/* team matching */}
          {problem.ai === 'done' && (
            <div className="card p-6" id="team">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="flex items-center gap-2 font-extrabold text-ink"><Users2 size={17} className="text-pine-700" /> AI-assisted team matching</h2>
                  <p className="mt-0.5 text-xs text-pine-900/55">Ranked by skill compatibility, complementary expertise, interests and availability.</p>
                </div>
                {isStudent && !existingProject && (
                  <button className="btn-secondary" onClick={() => setShowMatcher((v) => !v)}>
                    {showMatcher ? 'Hide recommendations' : 'Show recommended members'}
                  </button>
                )}
              </div>

              {existingProject ? (
                <div className="mt-4 rounded-xl border border-pine-700/20 bg-pine-50 p-4">
                  <div className="text-sm font-extrabold text-pine-900">Team formed → {existingProject.name}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {existingProject.team.map((m) => {
                      const u = users.find((x) => x.id === m)
                      return u ? <span key={m} className="flex items-center gap-1.5 rounded-full bg-paper px-2 py-1 text-xs font-semibold text-ink ring-1 ring-pine-700/20"><Avatar user={u} size={20} /> {u.name}</span> : null
                    })}
                  </div>
                  <Link to={`/project/${existingProject.id}`} className="btn-primary mt-3">Open project workspace <ArrowRight size={14} /></Link>
                </div>
              ) : showMatcher ? (
                <div className="mt-4 space-y-3">
                  {matches.map((m) => (
                    <div key={m.user.id} className="flex flex-wrap items-center gap-3 rounded-xl border border-pine-900/10 p-3.5">
                      <MatchRing value={m.matchPct} />
                      <Avatar user={m.user} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-extrabold text-ink">{m.user.name}</span>
                          <span className="chip bg-pine-900/5 text-pine-900/70">{m.user.branch}</span>
                          <span className="chip bg-royal-100 text-royal-800">{m.roleFit}</span>
                        </div>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {m.reasons.map((r) => <span key={r} className="chip bg-pine-50 text-pine-800">{r}</span>)}
                        </div>
                      </div>
                      {isStudent && (
                        <div className="flex gap-2">
                          <button className="btn-ghost text-xs" onClick={() => navigate('/profile/' + m.user.id === '' ? '' : '/teams')}>View</button>
                          <button
                            className={cx('btn px-3 py-2 text-xs font-bold', picked.includes(m.user.id) ? 'bg-pine-800 text-white' : 'bg-pine-900/5 text-pine-900/75 hover:bg-pine-900/10')}
                            onClick={() => togglePick(m.user.id)}
                          >
                            {picked.includes(m.user.id) ? '✓ Selected' : 'Add to team'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {isStudent && (
                    <div className="rounded-2xl border border-pine-700/20 bg-pine-50/60 p-4">
                      <label className="label" htmlFor="prjname">Project name</label>
                      <input id="prjname" className="input mb-3" value={projectName} onChange={(e) => setProjectName(e.target.value)}
                        placeholder={`e.g. Smart ${problem.domain === 'agri' ? 'Crop Disease' : 'Health Tooling'} — ${problem.location.split(',')[0]}`} />
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs text-pine-900/55">
                          {picked.length ? `${picked.length} members selected` : 'No selection → top 4 AI matches are used'}
                        </span>
                        <button className="btn-primary" onClick={buildTeam}>Build Team 🤝</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-4 rounded-xl bg-pine-900/[0.04] p-4 text-sm text-pine-900/55">
                  {isStudent
                    ? 'Open the AI matcher to see ranked students for this problem, then build a complementary team.'
                    : 'Students will see AI-ranked teammates here once matching starts. Experts validate the final composition.'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* side column */}
        <div className="space-y-6">
          <div className="card overflow-hidden">
            <LocationMap location={problem.location} />
            <div className="p-4">
              <div className="text-[11px] font-bold uppercase text-pine-900/45">Location</div>
              <div className="text-sm font-bold text-ink">{problem.location}</div>
            </div>
          </div>

          <div className="card p-5">
            <div className="text-[11px] font-bold uppercase text-pine-900/45">Reported by</div>
            {reporter && (
              <div className="mt-2 flex items-center gap-3">
                <Avatar user={reporter} size={42} />
                <div>
                  <div className="text-sm font-extrabold text-ink">{reporter.name}</div>
                  <div className="text-xs text-pine-900/55">{reporter.title}</div>
                </div>
              </div>
            )}
            <div className="mt-3 border-t border-pine-900/5 pt-3 text-xs text-pine-900/55">
              {problem.sensitive && !canSeeSensitive
                ? '🔒 Contact details restricted — shared with validated teams and experts only (healthcare privacy).'
                : `Contact shared with validated teams only: ${problem.contact}`}
            </div>
          </div>

          {problem.sensitive && (
            <div className="card border-royal-200 bg-royal-50/60 p-5">
              <div className="flex items-center gap-2 text-sm font-extrabold text-navy"><Lock size={14} /> Protected healthcare challenge</div>
              <p className="mt-1.5 text-xs leading-relaxed text-navy">
                No patient-identifiable data is stored or displayed. Solution teams see workflows and equipment data only.
                Access is role-restricted and audited by admins.
              </p>
            </div>
          )}

          <div className="card p-5">
            <div className="text-[11px] font-bold uppercase text-pine-900/45">Lifecycle</div>
            <div className="mt-3 space-y-2.5">
              {['Submitted', 'AI Analyzed', 'Matched', 'In Progress', 'Expert Review', 'Validating', 'Solved'].map((st, i, arr) => {
                const order = ['Submitted', 'Under Review', 'Matched', 'In Progress', 'Expert Review', 'Validating', 'Solved']
                const cur = order.indexOf(problem.status === 'Needs Improvement' ? 'In Progress' : problem.status)
                const done = i <= Math.max(cur, problem.status === 'Solved' ? 6 : cur)
                return (
                  <div key={st} className="flex items-center gap-2.5">
                    <span className={cx('grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold', done ? 'bg-pine-800 text-white' : 'bg-pine-900/10 text-pine-900/55')}>{done ? '✓' : i + 1}</span>
                    <span className={cx('text-xs font-semibold', done ? 'text-ink' : 'text-pine-900/45')}>{st}</span>
                    {i < arr.length - 1 && <span className={cx('h-px flex-1', done ? 'bg-pine-300' : 'bg-pine-900/10')} />}
                  </div>
                )
              })}
            </div>
          </div>

          {/* expert quick actions */}
          {currentUser?.role === 'faculty' && problem.ai === 'done' && (
            <div className="card border-royal-200 bg-royal-50/60 p-5">
              <div className="flex items-center gap-2 text-sm font-extrabold text-navy"><Flag size={14} /> Expert validation</div>
              <p className="mt-1 text-xs text-royal-800">Validate that the AI-identified expertise and skills are domain-correct.</p>
              <button className="btn-primary mt-3 w-full" onClick={() => { routeProblem(problem.id, 'Matched'); setToast('Domain requirements validated by expert') }}>
                Validate domain requirements
              </button>
            </div>
          )}

          {/* problem community */}
          <ProblemCommunityCard problemId={problem.id} />
        </div>
      </div>
    </div>
  )
}
