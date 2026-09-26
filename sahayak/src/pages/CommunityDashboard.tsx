import { Link } from 'react-router-dom'
import { FilePlus2, Star, Users2 } from 'lucide-react'
import { useStore } from '@/data/store'
import { SectionHeading, Stat, cx } from '@/ui/common'
import type { Project } from '@/data/types'

const STATUS_STEP: Record<string, number> = {
  'Submitted': 1, 'Under Review': 1, 'Matched': 2, 'In Progress': 3,
  'Expert Review': 4, 'Validating': 5, 'Solved': 6, 'Needs Improvement': 3,
}

function Track({ status }: { status: string }) {
  const step = STATUS_STEP[status] ?? 0
  return (
    <div className="flex items-center gap-1">
      {['Reported', 'Validated', 'Team', 'Building', 'Review', 'Validate', 'Solved'].map((s, i) => (
        <div key={s} className="flex flex-1 flex-col items-center gap-1">
          <span className={cx('h-2 w-full rounded-full', i < step ? 'bg-pine-600' : 'bg-pine-900/10')} />
          <span className={cx('text-[9px] font-bold', i < step ? 'text-pine-700' : 'text-pine-900/30')}>{s}</span>
        </div>
      ))}
    </div>
  )
}

export default function CommunityDashboard() {
  const currentUser = useStore((s) => s.currentUser)
  const users = useStore((s) => s.users)
  const problems = useStore((s) => s.problems)
  const projects = useStore((s) => s.projects)
  const communities = useStore((s) => s.communities)
  const me = users.find((u) => u.id === currentUser?.id)
  const mine = problems.filter((p) => p.reporterId === me?.id)
  const isFarmer = me?.role === 'farmer'

  const actionable = mine.filter((p) => ['Validating', 'Solved', 'Needs Improvement'].includes(p.status))
  const projectFor = (pid?: string): Project | undefined => projects.find((x) => x.problemId === pid)

  return (
    <div className="container-p max-w-6xl py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-pine-700">
            {isFarmer ? '🌾 Farmer dashboard' : me?.role === 'health_worker' ? '🏥 Healthcare dashboard' : '👤 Community dashboard'}
          </div>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-ink">Namaste, {me?.name.split(' ')[0]}</h1>
          <p className="mt-1 text-sm text-pine-900/55">{me?.location} · Track your problems from report to validated solution.</p>
        </div>
        <Link to="/report" className="btn-primary"><FilePlus2 size={15} /> Report a new problem</Link>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Problems reported" value={mine.length} sub="All time" />
        <Stat label="Being solved" value={mine.filter((p) => ['In Progress', 'Expert Review', 'Matched'].includes(p.status)).length} sub="Teams actively working" tone="royal" />
        <Stat label="Validated solutions" value={mine.filter((p) => p.status === 'Solved').length} sub="Confirmed by the community" tone="pine" />
      </div>

      {isFarmer && (
        <div className="mt-6 rounded-2xl border border-peach-200 bg-peach-50 p-5">
          <div className="text-sm font-extrabold text-pine-900">🌾 Simple mode — what you can do here</div>
          <div className="mt-2 grid gap-2 text-xs text-pine-900 sm:grid-cols-3">
            <div className="rounded-xl bg-paper/70 p-3">📸 <b>Report</b> a problem with photos — write in your own words, AI will understand.</div>
            <div className="rounded-xl bg-paper/70 p-3">🤝 <b>Track</b> — see which student team and expert mentor are working, and how far they've reached.</div>
            <div className="rounded-xl bg-paper/70 p-3">✅ <b>Test & rate</b> — when a prototype is ready, try it and tell the team if it truly helps.</div>
          </div>
        </div>
      )}

      {/* my communities */}
      {(() => {
        const myComs = communities.filter((c) => currentUser && c.memberIds.includes(currentUser.id))
        if (myComs.length === 0) return null
        return (
          <div className="mt-8">
            <SectionHeading icon="🤝" title="My problem communities" sub="Circles around your reported problems — coordinate, share field updates, meet the team" />
            <div className="grid gap-4 sm:grid-cols-2">
              {myComs.map((c) => (
                <Link key={c.id} to={`/community/${c.id}`} className="card group p-5 transition-shadow hover:shadow-card-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-lg">{c.domain === 'agri' ? '🌾' : '🏥'}</span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-pine-900/55"><Users2 size={12} /> {c.memberIds.length} members</span>
                  </div>
                  <h3 className="mt-2 font-display text-base font-extrabold text-pine-900 group-hover:underline">{c.name}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-pine-900/55">{c.purpose}</p>
                  <div className="mt-3 flex items-center gap-3 text-[11px] font-semibold text-pine-900/50">
                    <span>💬 {c.posts.length} posts</span>
                    <span>🗓 {c.events.length} events</span>
                    <span className="ml-auto text-royal-700">Open circle →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )
      })()}

      {/* my problems */}
      <div className="mt-8">
        <SectionHeading icon="📋" title="My reported problems" sub="Full journey from report to measured impact" />
        <div className="space-y-4">
          {mine.map((p) => {
            const prj = projectFor(p.id)
            const team = prj ? users.filter((u) => prj.team.includes(u.id)) : []
            const mentor = users.find((u) => u.id === prj?.mentorId)
            const needsFeedback = actionable.some((a) => a.id === p.id)
            return (
              <div key={p.id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="chip bg-pine-900/5 text-pine-900/70">{p.domain === 'agri' ? '🌾 Agriculture' : '🏥 Healthcare'}</span>
                      <span className={cx('chip',
                        p.status === 'Solved' ? 'bg-pine-100 text-pine-800'
                          : p.status === 'Needs Improvement' ? 'bg-rose-100 text-rose-700'
                            : p.status === 'Validating' ? 'bg-periwinkle text-navy' : 'bg-pine-900/5 text-pine-900/70')}>
                        {p.status}
                      </span>
                    </div>
                    <h3 className="mt-2 text-[15px] font-extrabold leading-snug text-ink">{p.title}</h3>
                    <div className="mt-1 text-xs text-pine-900/55">📍 {p.location} · Reported {p.createdAt}</div>
                  </div>
                  <Link to={`/problem/${p.id}`} className="btn-secondary shrink-0 text-xs">View details</Link>
                </div>

                <div className="mt-4"><Track status={p.status} /></div>

                {(() => {
                  const com = communities.find((c) => c.problemId === p.id)
                  if (!com) return null
                  return (
                    <Link to={`/community/${com.id}`} className="mt-3 flex items-center gap-2 rounded-xl bg-gradient-to-r from-pine-50 to-royal-50 px-3 py-2 text-xs font-bold text-pine-800 ring-1 ring-pine-700/15 hover:from-pine-100 hover:to-royal-100">
                      <Users2 size={13} /> “{com.name}” — {com.memberIds.length} members, {com.posts.length} posts
                      <span className="ml-auto text-royal-700">Open →</span>
                    </Link>
                  )
                })()}

                {prj && (
                  <div className="mt-4 grid gap-3 rounded-xl border border-pine-900/10 bg-pine-900/[0.04] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
                    <div>
                      <div className="text-xs font-bold text-pine-900/55">🛠️ {prj.name} — {prj.stage} ({prj.stageProgress}%)</div>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        {team.map((t) => (
                          <span key={t.id} className="chip bg-paper text-pine-900/75 ring-1 ring-pine-900/10">{t.avatar} {t.name.split(' ')[0]} · {t.branch ?? t.title}</span>
                        ))}
                        {mentor && <span className="chip bg-royal-100 text-royal-800">👨‍🏫 Mentor: {mentor.name}</span>}
                      </div>
                    </div>
                    <Link to={`/project/${prj.id}`} className="btn-secondary text-xs">Open project</Link>
                  </div>
                )}

                {needsFeedback && prj && (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-royal-200 bg-royal-50 p-3">
                    <span className="text-xs font-bold text-navy">
                      {p.status === 'Validating' ? '🧪 Your testing is requested — try the prototype and share feedback.' : `Solution status: ${prj.solutionStatus}.`}
                    </span>
                    <Link to={`/project/${prj.id}`} className="btn-primary px-3 py-1.5 text-xs">Give feedback / validate</Link>
                  </div>
                )}

                {(p.ratingAvg ?? 0) > 0 && (
                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-peach-400">
                    <Star size={13} className="fill-peach-300 text-peach-300" /> {p.ratingAvg} community rating · {p.feedbackCount} validations
                  </div>
                )}
              </div>
            )
          })}
          {mine.length === 0 && (
            <div className="card p-8 text-center text-sm text-pine-900/55">
              You haven't reported any problems yet. <Link to="/report" className="link">Report your first problem</Link> — AI will guide you.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
