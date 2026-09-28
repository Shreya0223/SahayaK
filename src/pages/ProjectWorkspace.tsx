import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowRight, FileText, Flag, Send, Star, Upload, Users2,
} from 'lucide-react'
import { useStore } from '@/data/store'
import { Avatar, Bar, FieldInfo, cx } from '@/ui/common'
import type { TaskStatus } from '@/data/types'

const STAGES = ['Problem Definition', 'Planning', 'Development', 'Testing', 'Prototype', 'Deployment'] as const
const TASK_COLS: { s: TaskStatus; tone: string }[] = [
  { s: 'To Do', tone: 'bg-pine-900/5 text-pine-900/70' },
  { s: 'In Progress', tone: 'bg-periwinkle text-navy' },
  { s: 'Review', tone: 'bg-peach-100 text-pine-900' },
  { s: 'Completed', tone: 'bg-pine-100 text-pine-800' },
]
const TABS = ['Overview', 'Tasks', 'Milestones', 'Files', 'Team Chat', 'Mentor Feedback', 'Validation'] as const

type Tab = (typeof TABS)[number]

export default function ProjectWorkspace() {
  const { id } = useParams()
  const project = useStore((s) => s.projects.find((p) => p.id === id))
  const problems = useStore((s) => s.problems)
  const users = useStore((s) => s.users)
  const tasks = useStore((s) => s.tasks)
  const milestones = useStore((s) => s.milestones)
  const chat = useStore((s) => s.chat)
  const files = useStore((s) => s.files)
  const mentorNotes = useStore((s) => s.mentorNotes)
  const reviews = useStore((s) => s.reviews)
  const feedbacks = useStore((s) => s.feedbacks)
  const currentUser = useStore((s) => s.currentUser)

  const updateTaskStatus = useStore((s) => s.updateTaskStatus)
  const postChat = useStore((s) => s.postChat)
  const uploadFile = useStore((s) => s.uploadFile)
  const requestValidation = useStore((s) => s.requestValidation)
  const submitReview = useStore((s) => s.submitReview)
  const submitFeedback = useStore((s) => s.submitFeedback)
  const setSolutionStatus = useStore((s) => s.setSolutionStatus)
  const reopenImprovement = useStore((s) => s.reopenImprovement)

  const [tab, setTab] = useState<Tab>('Overview')
  const [msg, setMsg] = useState('')
  const [newFile, setNewFile] = useState('')
  const [reviewComment, setReviewComment] = useState('')
  const [fbUseful, setFbUseful] = useState(4)
  const [fbEasy, setFbEasy] = useState(4)
  const [fbAddresses, setFbAddresses] = useState(4)
  const [fbComment, setFbComment] = useState('')

  if (!project) return <div className="container-p py-16 text-center text-pine-900/55">Project not found.</div>

  const problem = problems.find((p) => p.id === project.problemId)
  const team = users.filter((u) => project.team.includes(u.id))
  const mentor = users.find((u) => u.id === project.mentorId)
  const reporter = users.find((u) => u.id === problem?.reporterId)
  const myTasks = tasks.filter((t) => t.projectId === project.id)
  const myMilestones = milestones.filter((m) => m.projectId === project.id)
  const myChat = chat.filter((c) => c.projectId === project.id)
  const myFiles = files.filter((f) => f.projectId === project.id)
  const myNotes = mentorNotes.filter((n) => n.projectId === project.id)
  const myReviews = reviews.filter((r) => r.projectId === project.id)
  const myFeedback = feedbacks.filter((f) => f.projectId === project.id)

  const isMember = !!currentUser && project.team.includes(currentUser.id)
  const isFaculty = currentUser?.role === 'faculty' || currentUser?.role === 'admin'
  const isCommunityUser = !!currentUser && (currentUser.role === 'citizen' || currentUser.role === 'farmer' || currentUser.role === 'health_worker')
  const isReporter = currentUser?.id === problem?.reporterId

  const stageIdx = STAGES.indexOf(project.stage)
  const canValidate = isCommunityUser || isReporter

  const avg = (arr: number[]) => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : null

  /* ───────── helpers ───────── */
  const StarPicker = ({ value, set, label }: { value: number; set: (n: number) => void; label: string }) => (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-semibold text-pine-900/75">{label}</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => set(n)} aria-label={`${n} stars`}>
            <Star size={20} className={n <= value ? 'fill-peach-300 text-peach-300' : 'text-pine-900/30'} />
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="container-p max-w-7xl py-8">
      {/* header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip bg-pine-900/5 text-pine-900/70">{project.domain === 'agri' ? '🌾 Agriculture' : '🏥 Healthcare'} project</span>
            <span className="chip bg-pine-900 text-white">{project.stage}</span>
            <span className={cx('chip',
              project.solutionStatus === 'Solved' ? 'bg-pine-100 text-pine-800'
                : project.solutionStatus === 'Partially Solved' ? 'bg-peach-100 text-pine-900'
                  : project.solutionStatus === 'Needs Improvement' ? 'bg-rose-100 text-rose-700'
                    : 'bg-pine-900/5 text-pine-900/70')}>
              {project.solutionStatus ?? `Validation: ${project.validationStatus}`}
            </span>
            {project.improvementCount! > 0 && <span className="chip bg-peach-100 text-pine-900">Improve loop ×{project.improvementCount}</span>}
          </div>
          <h1 className="mt-2 text-2xl font-black tracking-tight text-ink sm:text-3xl">{project.name}</h1>
          {problem && (
            <Link to={`/problem/${problem.id}`} className="link mt-1 inline-flex items-center gap-1 text-xs">
              From problem: {problem.title.slice(0, 80)}… <ArrowRight size={12} />
            </Link>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {isMember && project.stage !== 'Deployment' && (
            <button className="btn-secondary" onClick={() => useStore.getState().advanceStage(project.id)}>
              Advance stage →
            </button>
          )}
          {isMember && project.validationStatus === 'Pending' && (
            <button className="btn-primary" onClick={() => requestValidation(project.id)}>
              Submit for expert + community validation
            </button>
          )}
        </div>
      </div>

      {/* lifecycle */}
      <div className="card mt-6 p-5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-widest text-pine-900/45">Project lifecycle</span>
          <span className="text-xs font-extrabold text-pine-700">{project.stageProgress}% overall</span>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
          {STAGES.map((s, i) => (
            <div key={s} className="text-center">
              <div className={cx('mx-auto grid h-8 w-8 place-items-center rounded-full text-xs font-black',
                i < stageIdx ? 'bg-pine-800 text-white' : i === stageIdx ? 'bg-pine-800 text-white ring-4 ring-pine-200' : 'bg-pine-900/5 text-pine-900/45')}>
                {i < stageIdx ? '✓' : i + 1}
              </div>
              <div className={cx('mt-1.5 text-[10px] font-bold leading-tight', i <= stageIdx ? 'text-ink' : 'text-pine-900/45')}>{s}</div>
            </div>
          ))}
        </div>
        <div className="mt-3"><Bar value={project.stageProgress} /></div>
      </div>

      {/* tabs */}
      <div className="mt-6 flex gap-1 overflow-x-auto border-b border-pine-900/10 pb-px">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={cx('whitespace-nowrap rounded-t-xl px-4 py-2.5 text-[13px] font-bold transition',
              tab === t ? 'border-x border-t border-pine-900/10 bg-paper text-pine-800' : 'text-pine-900/55 hover:text-ink')}>
            {t}
            {t === 'Validation' && project.validationStatus !== 'Pending' && <span className="ml-1.5 inline-block h-2 w-2 rounded-full bg-royal-500" />}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {/* ── OVERVIEW ── */}
        {tab === 'Overview' && (
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            <div className="space-y-6">
              <div className="card p-6">
                <h2 className="font-extrabold text-ink">Objective</h2>
                <p className="mt-2 text-sm leading-relaxed text-pine-900/70">{project.objective}</p>
                {problem && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-pine-900/[0.04] p-3">
                      <div className="text-[10px] font-bold uppercase text-pine-900/45">Original problem</div>
                      <p className="mt-1 text-xs leading-relaxed text-pine-900/70">{problem.description.slice(0, 180)}…</p>
                      <Link to={`/problem/${problem.id}`} className="link mt-1 inline-block text-xs">Read full problem</Link>
                    </div>
                    <div className="rounded-xl bg-pine-900/[0.04] p-3">
                      <div className="text-[10px] font-bold uppercase text-pine-900/45">Target users</div>
                      <p className="mt-1 text-xs leading-relaxed text-pine-900/70">
                        {problem.domain === 'agri' ? 'Smallholder farmers' : 'PHC / CHC health workers'} in {problem.location}
                        · {problem.peopleAffected.toLocaleString('en-IN')} people affected
                      </p>
                      <div className="mt-1.5 text-[10px] font-bold uppercase text-pine-900/45">Expected impact</div>
                      <p className="text-xs text-pine-900/70">{project.domain === 'agri' ? 'Reduced crop loss, faster expert-validated advisory' : 'Fewer missed follow-ups, less staff admin time'}</p>
                    </div>
                  </div>
                )}
                {problem?.analysis && (
                  <div className="mt-4">
                    <div className="text-[10px] font-bold uppercase text-pine-900/45">Skills this problem demanded</div>
                    <div className="mt-1.5"><FieldInfo items={problem.analysis.requiredSkills} tone="sky" /></div>
                  </div>
                )}
              </div>

              {project.impact && (
                <div className="card border-pine-700/20 bg-pine-50/50 p-6">
                  <h2 className="font-extrabold text-pine-900">📈 Measured impact (community-validated)</h2>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {[
                      ['People reached', project.impact.peopleReached.toLocaleString('en-IN')],
                      ['Time saved', project.impact.timeSaved],
                      ['Cost reduction', project.impact.costReduction],
                      ['Satisfaction', `${project.impact.satisfaction} / 5`],
                      ['Adoption', project.impact.adoption],
                    ].map(([l, v]) => (
                      <div key={l} className="rounded-xl bg-paper p-3 ring-1 ring-pine-200">
                        <div className="text-[10px] font-bold uppercase text-pine-900/45">{l}</div>
                        <div className="text-sm font-extrabold text-ink">{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="card p-5">
                <h2 className="flex items-center gap-2 font-extrabold text-ink"><Users2 size={16} className="text-pine-700" /> Team</h2>
                <div className="mt-3 space-y-2.5">
                  {team.map((t) => (
                    <div key={t.id} className="flex items-center gap-3">
                      <Avatar user={t} size={34} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-bold text-ink">{t.name} {t.id === currentUser?.id && <span className="text-pine-900/45">(you)</span>}</div>
                        <div className="truncate text-[11px] text-pine-900/55">{t.branch ?? t.title}</div>
                      </div>
                      <span className="chip bg-pine-50 text-pine-700">{t.availability ?? 'member'}</span>
                    </div>
                  ))}
                </div>
                {mentor && (
                  <div className="mt-4 border-t border-pine-900/5 pt-3">
                    <div className="text-[10px] font-bold uppercase text-pine-900/45">Expert mentor</div>
                    <div className="mt-2 flex items-center gap-3">
                      <Avatar user={mentor} size={34} />
                      <div>
                        <div className="text-sm font-bold text-ink">{mentor.name}</div>
                        <div className="text-[11px] text-pine-900/55">{mentor.title}</div>
                      </div>
                    </div>
                  </div>
                )}
                {reporter && (
                  <div className="mt-3 border-t border-pine-900/5 pt-3 text-xs text-pine-900/55">
                    Community reporter: <b className="text-ink">{reporter.name}</b> — receives progress updates & validates the solution.
                  </div>
                )}
              </div>

              <div className="card p-5">
                <h2 className="text-sm font-extrabold text-ink">Validation chain</h2>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center gap-2"><span className="chip bg-pine-100 text-pine-800">✓ Community reported</span></div>
                  <div className="flex items-center gap-2"><span className="chip bg-pine-100 text-pine-800">✓ AI triaged → expert-validated</span></div>
                  <div className="flex items-center gap-2"><span className="chip bg-pine-100 text-pine-800">✓ Multidisciplinary team formed</span></div>
                  <div className="flex items-center gap-2">
                    <span className={cx('chip', project.validationStatus === 'Validated' ? 'bg-pine-100 text-pine-800' : 'bg-pine-900/5 text-pine-900/55')}>
                      {project.validationStatus === 'Validated' ? '✓ Expert reviewed' : '⏳ Expert review'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cx('chip', project.solutionStatus === 'Solved' ? 'bg-pine-100 text-pine-800' : 'bg-pine-900/5 text-pine-900/55')}>
                      {project.solutionStatus === 'Solved' ? '✓ Community validated' : '⏳ Community validation'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TASKS ── */}
        {tab === 'Tasks' && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {TASK_COLS.map(({ s, tone }) => (
              <div key={s} className="rounded-2xl bg-pine-900/[0.04] p-3">
                <div className={cx('mb-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-extrabold', tone)}>{s} · {myTasks.filter((t) => t.status === s).length}</div>
                <div className="space-y-2.5">
                  {myTasks.filter((t) => t.status === s).map((t) => {
                    const assignee = users.find((u) => u.id === t.assigneeId)
                    return (
                      <div key={t.id} className="card p-3.5">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[13px] font-bold leading-snug text-ink">{t.title}</span>
                          {t.priority === 'High' && <span className="chip shrink-0 bg-rose-100 text-rose-700">{t.priority}</span>}
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-pine-900/55">
                            {assignee && <Avatar user={assignee} size={20} />} {assignee?.name.split(' ')[0]}
                          </span>
                          <span className="text-[11px] text-pine-900/45">{t.deadline}</span>
                        </div>
                        {isMember && (
                          <select
                            className="input mt-2 py-1.5 text-xs"
                            value={t.status}
                            onChange={(e) => updateTaskStatus(t.id, e.target.value as TaskStatus)}
                          >
                            {TASK_COLS.map(({ s: opt }) => <option key={opt} value={opt}>{opt}</option>)}
                          </select>
                        )}
                      </div>
                    )
                  })}
                  {myTasks.filter((t) => t.status === s).length === 0 && (
                    <div className="rounded-xl border border-dashed border-pine-900/20 p-4 text-center text-[11px] text-pine-900/45">—</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── MILESTONES ── */}
        {tab === 'Milestones' && (
          <div className="card mx-auto max-w-3xl p-6">
            <div className="space-y-0">
              {myMilestones.map((m, i) => (
                <div key={m.id} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < myMilestones.length - 1 && <span className="absolute left-[13px] top-7 h-full w-0.5 bg-pine-900/10" />}
                  <span className={cx('z-10 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-black',
                    m.status === 'done' ? 'bg-pine-800 text-white' : m.status === 'active' ? 'bg-peach-300 text-white' : 'bg-pine-900/10 text-pine-900/55')}>
                    {m.status === 'done' ? '✓' : m.status === 'active' ? '●' : '○'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-extrabold text-ink">{m.title}</span>
                      <span className={cx('chip',
                        m.status === 'done' ? 'bg-pine-100 text-pine-800' : m.status === 'active' ? 'bg-peach-100 text-pine-900' : 'bg-pine-900/5 text-pine-900/55')}>
                        {m.status === 'done' ? 'Completed' : m.status === 'active' ? `In progress${m.progress ? ` — ${m.progress}%` : ''}` : 'Upcoming'}
                      </span>
                    </div>
                    {m.note && <p className="mt-0.5 text-xs text-pine-900/55">{m.note}</p>}
                    {m.status === 'active' && m.progress !== undefined && <div className="mt-2"><Bar value={m.progress} color="bg-peach-300" /></div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FILES ── */}
        {tab === 'Files' && (
          <div className="card mx-auto max-w-3xl p-6">
            {isMember && (
              <div className="mb-4 flex gap-2">
                <input className="input" placeholder="File name e.g. prototype_v3.zip" value={newFile} onChange={(e) => setNewFile(e.target.value)} />
                <button className="btn-primary shrink-0" disabled={!newFile.trim()} onClick={() => { uploadFile(project.id, newFile.trim(), 'Upload'); setNewFile('') }}>
                  <Upload size={15} /> Upload work
                </button>
              </div>
            )}
            <div className="divide-y divide-pine-900/5">
              {myFiles.map((f) => {
                const u = users.find((x) => x.id === f.uploaderId)
                return (
                  <div key={f.id} className="flex items-center gap-3 py-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-pine-900/5 text-pine-900/55"><FileText size={16} /></span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-bold text-ink">{f.name} {f.version && <span className="chip ml-1 bg-pine-900/5 text-pine-900/55">v{f.version}</span>}</div>
                      <div className="text-[11px] text-pine-900/45">{f.kind} · {f.size} · {u?.name} · {f.at}</div>
                    </div>
                    <button className="btn-ghost text-xs">Download</button>
                  </div>
                )
              })}
              {myFiles.length === 0 && <div className="py-8 text-center text-sm text-pine-900/45">No files yet.</div>}
            </div>
          </div>
        )}

        {/* ── CHAT ── */}
        {tab === 'Team Chat' && (
          <div className="card mx-auto flex max-w-3xl flex-col p-0">
            <div className="max-h-[26rem] flex-1 space-y-4 overflow-y-auto p-5">
              {myChat.map((c) => {
                const u = users.find((x) => x.id === c.authorId)
                const mine = c.authorId === currentUser?.id
                return (
                  <div key={c.id} className={cx('flex gap-2.5', mine && 'flex-row-reverse')}>
                    {u && <Avatar user={u} size={30} />}
                    <div className={cx('max-w-[80%]', mine && 'text-right')}>
                      <div className="text-[11px] font-bold text-pine-900/45">
                        {u?.name} {u?.role === 'faculty' && <span className="chip ml-1 bg-royal-100 text-royal-800">Expert</span>} · {c.at}
                      </div>
                      <div className={cx('mt-1 inline-block rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed',
                        mine ? 'bg-pine-800 text-white' : u?.role === 'faculty' ? 'bg-royal-50 text-ink ring-1 ring-royal-200' : 'bg-pine-900/5 text-ink')}>
                        {c.text}
                      </div>
                    </div>
                  </div>
                )
              })}
              {myChat.length === 0 && <div className="py-10 text-center text-sm text-pine-900/45">No messages yet — say hello 👋</div>}
            </div>
            {isMember && (
              <form className="flex gap-2 border-t border-pine-900/5 p-3"
                onSubmit={(e) => { e.preventDefault(); if (msg.trim()) { postChat(project.id, msg.trim()); setMsg('') } }}>
                <input className="input" placeholder="Message your team & mentor…" value={msg} onChange={(e) => setMsg(e.target.value)} />
                <button className="btn-primary shrink-0 px-3.5" type="submit"><Send size={15} /></button>
              </form>
            )}
          </div>
        )}

        {/* ── MENTOR FEEDBACK ── */}
        {tab === 'Mentor Feedback' && (
          <div className="mx-auto max-w-3xl space-y-4">
            {myNotes.map((n) => {
              const a = users.find((x) => x.id === n.authorId)
              return (
                <div key={n.id} className={cx('card p-5', n.type === 'flag' && 'border-peach-300 bg-peach-50/70', n.type === 'approval' && 'border-pine-700/40 bg-pine-50/60')}>
                  <div className="flex items-center gap-2.5">
                    {a && <Avatar user={a} size={32} />}
                    <div className="flex-1">
                      <div className="text-sm font-extrabold text-ink">{a?.name}</div>
                      <div className="text-[11px] text-pine-900/45">{a?.title} · {n.at}</div>
                    </div>
                    <span className={cx('chip',
                      n.type === 'flag' ? 'bg-peach-100 text-pine-900' : n.type === 'approval' ? 'bg-pine-100 text-pine-800' : 'bg-pine-900/5 text-pine-900/70')}>
                      {n.type === 'feedback' ? '💬 Feedback' : n.type === 'flag' ? '⚠️ Flag' : '✅ Approval'}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-pine-900/75">{n.text}</p>
                </div>
              )
            })}
            {myNotes.length === 0 && <div className="card p-8 text-center text-sm text-pine-900/45">No mentor feedback yet.</div>}
            {myReviews.map((r) => {
              const a = users.find((x) => x.id === r.expertId)
              return (
                <div key={r.id} className={cx('card p-5', r.status === 'Approved' ? 'border-pine-700/40 bg-pine-50/60' : r.status === 'Changes Requested' ? 'border-rose-200 bg-rose-50/50' : '')}>
                  <div className="flex items-center gap-2.5">
                    {a && <Avatar user={a} size={32} />}
                    <div className="flex-1 text-sm font-extrabold text-ink">Expert Review — {r.status}</div>
                    <span className="text-[11px] text-pine-900/45">{r.at}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-pine-900/75">{r.comment}</p>
                  {r.recommendations?.map((rec) => (
                    <div key={rec} className="mt-1.5 flex items-start gap-1.5 text-xs text-pine-900/70"><ArrowRight size={11} className="mt-0.5 shrink-0 text-pine-700" /> {rec}</div>
                  ))}
                </div>
              )
            })}
          </div>
        )}

        {/* ── VALIDATION ── */}
        {tab === 'Validation' && (
          <div className="mx-auto max-w-3xl space-y-6">
            {/* expert review panel */}
            {isFaculty && (
              <div className="card border-royal-200 bg-royal-50/60 p-6">
                <h2 className="flex items-center gap-2 font-extrabold text-navy"><Flag size={16} /> Expert review (faculty only)</h2>
                <p className="mt-1 text-xs leading-relaxed text-royal-800">
                  Students build the technology/research component; qualified experts validate domain-specific decisions.
                </p>
                <div className="mt-3 grid gap-2 text-xs text-pine-900/70 sm:grid-cols-2">
                  <div className="rounded-lg bg-paper p-2.5">📁 Evidence: {myFiles.length} files, {myFeedback.length} field feedback entries</div>
                  <div className="rounded-lg bg-paper p-2.5">🧪 Progress: {project.stage} · {project.stageProgress}%</div>
                </div>
                <textarea className="input mt-3 min-h-24" placeholder="Domain assessment, risks, required changes…" value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} />
                <div className="mt-3 flex gap-2">
                  <button className="btn-primary" disabled={!reviewComment.trim()} onClick={() => { submitReview(project.id, 'Approved', reviewComment); setReviewComment('') }}>
                    Approve ✓
                  </button>
                  <button className="btn-secondary" disabled={!reviewComment.trim()} onClick={() => { submitReview(project.id, 'Changes Requested', reviewComment); setReviewComment('') }}>
                    Request changes
                  </button>
                </div>
              </div>
            )}

            {/* community testing */}
            <div className={cx('card p-6', canValidate && project.validationStatus !== 'Pending' && 'border-royal-300')}>
              <h2 className="flex items-center gap-2 font-extrabold text-ink">🧪 Test with real users</h2>
              <p className="mt-1 text-sm text-pine-900/55">
                The community who reported this problem field-tests the prototype. Their verdict decides the outcome.
              </p>

              {project.validationStatus === 'Pending' ? (
                <div className="mt-4 rounded-xl bg-pine-900/[0.04] p-4 text-sm text-pine-900/55">
                  Validation not yet requested. Team submits the prototype for testing first.
                </div>
              ) : (
                <>
                  <div className="mt-4 grid gap-2 sm:grid-cols-3">
                    {[
                      ['🧑‍🌾', 'Farmer', 'Tests in real field conditions'],
                      ['👩‍⚕️', 'Healthcare worker', 'Tests in actual workflow'],
                      ['👤', 'Community user', 'Tests ease of daily use'],
                    ].map(([ic, who, how]) => (
                      <div key={who} className="rounded-xl border border-pine-900/10 p-3 text-center">
                        <div className="text-xl">{ic}</div>
                        <div className="mt-1 text-xs font-extrabold text-ink">{who}</div>
                        <div className="text-[10px] text-pine-900/55">{how}</div>
                      </div>
                    ))}
                  </div>

                  {canValidate ? (
                    <div className="mt-5 rounded-2xl border border-royal-200 bg-royal-50/60 p-5">
                      <div className="text-sm font-extrabold text-navy">Your field feedback</div>
                      <div className="mt-3 space-y-3">
                        <StarPicker label="Was the solution useful?" value={fbUseful} set={setFbUseful} />
                        <StarPicker label="Was it easy to use?" value={fbEasy} set={setFbEasy} />
                        <StarPicker label="Did it address the original problem?" value={fbAddresses} set={setFbAddresses} />
                        <textarea className="input min-h-20" placeholder="What should be improved? What worked on the ground?" value={fbComment} onChange={(e) => setFbComment(e.target.value)} />
                        <button
                          className="btn-primary w-full"
                          disabled={!fbComment.trim()}
                          onClick={() => {
                            submitFeedback({
                              projectId: project.id, problemId: project.problemId,
                              answers: { useful: fbUseful, easy: fbEasy, addresses: fbAddresses },
                              rating: Math.round((fbUseful + fbEasy + fbAddresses) / 3), comment: fbComment,
                            })
                            setFbComment('')
                          }}
                        >
                          Submit feedback
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {myFeedback.map((f) => {
                        const u = users.find((x) => x.id === f.userId)
                        return (
                          <div key={f.id} className="rounded-xl border border-pine-900/10 p-3.5">
                            <div className="flex items-center gap-2">
                              {u && <Avatar user={u} size={26} />}
                              <span className="text-sm font-bold text-ink">{u?.name}</span>
                              <span className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((n) => <Star key={n} size={12} className={n <= f.rating ? 'fill-peach-300 text-peach-300' : 'text-pine-900/30'} />)}
                              </span>
                              <span className="ml-auto text-[11px] text-pine-900/45">{f.at}</span>
                            </div>
                            <p className="mt-1.5 text-sm text-pine-900/70">{f.comment}</p>
                          </div>
                        )
                      })}
                      {myFeedback.length === 0 && <div className="rounded-xl bg-pine-900/[0.04] p-4 text-sm text-pine-900/55">Awaiting first field feedback.</div>}
                    </div>
                  )}

                  {/* solution outcome */}
                  <div className="mt-6 rounded-2xl border border-pine-900/10 p-5">
                    <div className="text-sm font-extrabold text-ink">Solution status</div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                      {([
                        ['🟢', 'Solved', 'Fully addresses the original problem'],
                        ['🟡', 'Partially Solved', 'Helpful, more work needed'],
                        ['🔴', 'Needs Improvement', 'Returns to development'],
                      ] as const).map(([ic, label, desc]) => (
                        <button key={label} disabled={!isFaculty && !canValidate}
                          onClick={() => setSolutionStatus(project.id, label)}
                          className={cx('rounded-xl border p-3.5 text-left transition disabled:opacity-40',
                            project.solutionStatus === label ? 'border-pine-700 bg-pine-50 ring-1 ring-pine-700' : 'border-pine-900/10 hover:border-pine-900/20')}>
                          <div className="text-lg">{ic}</div>
                          <div className="mt-1 text-sm font-extrabold text-ink">{label}</div>
                          <div className="text-[10px] leading-snug text-pine-900/55">{desc}</div>
                        </button>
                      ))}
                    </div>
                    {project.solutionStatus === 'Needs Improvement' && (
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-rose-50 p-3">
                        <span className="text-xs font-bold text-rose-800">
                          BUILD → TEST → FEEDBACK → IMPROVE: this project re-enters Development → Testing → Validation.
                        </span>
                        <button className="btn-primary px-3 py-1.5 text-xs" onClick={() => reopenImprovement(project.id)}>Trigger improve loop</button>
                      </div>
                    )}
                    {!isFaculty && !canValidate && (
                      <p className="mt-2 text-[11px] text-pine-900/45">Only the reporting community and admins can set the final status. Experts approve the technical/domain side.</p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* feedback received summary */}
            {myFeedback.length > 0 && (
              <div className="card p-6">
                <h2 className="text-sm font-extrabold text-ink">Feedback summary</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-4">
                  <div className="rounded-xl bg-pine-50 p-3 text-center">
                    <div className="text-xl font-black text-pine-700">{avg(myFeedback.map((f) => f.rating))}</div>
                    <div className="text-[10px] font-bold uppercase text-pine-900/45">Avg rating</div>
                  </div>
                  <div className="rounded-xl bg-pine-900/[0.04] p-3 text-center">
                    <div className="text-xl font-black text-ink">{avg(myFeedback.map((f) => f.answers.useful))}</div>
                    <div className="text-[10px] font-bold uppercase text-pine-900/45">Useful</div>
                  </div>
                  <div className="rounded-xl bg-pine-900/[0.04] p-3 text-center">
                    <div className="text-xl font-black text-ink">{avg(myFeedback.map((f) => f.answers.easy))}</div>
                    <div className="text-[10px] font-bold uppercase text-pine-900/45">Easy to use</div>
                  </div>
                  <div className="rounded-xl bg-pine-900/[0.04] p-3 text-center">
                    <div className="text-xl font-black text-ink">{avg(myFeedback.map((f) => f.answers.addresses))}</div>
                    <div className="text-[10px] font-bold uppercase text-pine-900/45">Addresses problem</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
