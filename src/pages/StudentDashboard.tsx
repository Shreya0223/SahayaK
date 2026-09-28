import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpenCheck, Sparkles } from 'lucide-react'
import { matchScoreFor, useStore } from '@/data/store'
import { Bar, MatchRing, SectionHeading, Stat } from '@/ui/common'
import { ProblemCard } from '@/pages/Discover'

export default function StudentDashboard() {
  const currentUser = useStore((s) => s.currentUser)
  const users = useStore((s) => s.users)
  const problems = useStore((s) => s.problems)
  const projects = useStore((s) => s.projects)
  const tasks = useStore((s) => s.tasks)

  const me = users.find((u) => u.id === currentUser?.id)
  const myProjects = projects.filter((p) => p.team.includes(me?.id ?? ''))
  const myTasks = tasks.filter((t) => t.assigneeId === me?.id && t.status !== 'Completed')
  const saved = problems.filter((p) => p.savedBy?.includes(me?.id ?? ''))

  const recommended = useMemo(() => {
    if (!me) return []
    return problems
      .filter((p) => ['Under Review', 'Matched', 'In Progress'].includes(p.status) || p.status === 'Needs Improvement')
      .map((p) => ({ p, score: matchScoreFor(me, p) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
  }, [problems, me])

  const topPicks = recommended.slice(0, 3)

  return (
    <div className="container-p max-w-7xl py-8">
      {/* header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-pine-700">Student dashboard</div>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-ink">Hi {me?.name.split(' ')[0]} 👋</h1>
          <p className="mt-1 text-sm text-pine-900/55">
            {me?.branch} · {me?.institution} · Available {me?.availability}
          </p>
        </div>
        <Link to="/profile" className="btn-secondary">Edit profile & skills</Link>
      </div>

      {/* profile completeness */}
      <div className="card mt-6 flex flex-wrap items-center gap-4 p-5">
        <div className="min-w-44 flex-1">
          <div className="flex items-center justify-between text-xs font-bold text-pine-900/55">
            <span>Profile strength (drives match quality)</span>
            <span>{[me?.branch, me?.institution, (me?.skills?.length ?? 0) > 3, (me?.projects?.length ?? 0) > 0, me?.availability].filter(Boolean).length}/5</span>
          </div>
          <div className="mt-2"><Bar value={[me?.branch, me?.institution, (me?.skills?.length ?? 0) > 3, (me?.projects?.length ?? 0) > 0, me?.availability].filter(Boolean).length * 20} /></div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(me?.skills ?? []).slice(0, 6).map((s) => <span key={s} className="chip bg-pine-50 text-pine-800">{s}</span>)}
          {(me?.skills?.length ?? 0) > 6 && <span className="chip bg-pine-900/5 text-pine-900/55">+{(me?.skills?.length ?? 0) - 6} more</span>}
        </div>
      </div>

      {/* stats */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Recommended for you" value={recommended.length} sub="AI-ranked by skills & interests" />
        <Stat label="Active projects" value={myProjects.length} sub="Multidisciplinary teams" tone="royal" />
        <Stat label="Open tasks" value={myTasks.length} sub="Assigned to you" tone="sun" />
        <Stat label="Saved problems" value={saved.length} sub="Bookmarked to revisit" tone="rose" />
      </div>

      {/* AI recommendation banner */}
      <div className="mt-6 rounded-2xl border border-pine-700/20 bg-gradient-to-r from-pine-50 to-royal-50 p-5">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-pine-800 text-white"><Sparkles size={17} /></div>
          <div>
            <div className="text-sm font-extrabold text-ink">Why these recommendations?</div>
            <p className="mt-1 text-xs leading-relaxed text-pine-900/70">
              Ranked using your <b>skills</b> ({(me?.skills ?? []).slice(0, 3).join(', ')}…), <b>interests</b>, <b>previous projects</b>,
              your <b>availability</b> ({me?.availability}) and selected <b>domains</b>. Match % shows skill overlap — the problem
              determines the skills, not your branch.
            </p>
          </div>
        </div>
      </div>

      {/* recommended problems */}
      <div className="mt-8">
        <SectionHeading
          icon="🎯" title="Recommended problems"
          sub="AI-ranked for your profile — join a team or save for later"
          action={<Link to="/discover" className="btn-secondary text-xs">Browse all <ArrowRight size={13} /></Link>}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {topPicks.map(({ p, score }) => <ProblemCard key={p.id} p={p} matchPct={score} />)}
        </div>
      </div>

      {/* my projects + saved */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div>
          <SectionHeading icon="🛠️" title="My teams & projects" sub="Active workspaces" />
          <div className="space-y-3">
            {myProjects.map((pr) => {
              const prob = problems.find((x) => x.id === pr.problemId)
              return (
                <Link key={pr.id} to={`/project/${pr.id}`} className="card block p-4 transition hover:-translate-y-0.5 hover:shadow-pop">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-extrabold text-ink">{pr.name}</span>
                    <span className="chip bg-pine-100 text-pine-800">{pr.stage} · {pr.stageProgress}%</span>
                  </div>
                  <div className="mt-1 text-xs text-pine-900/55">{prob?.domain === 'agri' ? '🌾' : '🏥'} {prob?.title.slice(0, 70)}…</div>
                  <div className="mt-2"><Bar value={pr.stageProgress} /></div>
                </Link>
              )
            })}
            {myProjects.length === 0 && (
              <div className="card p-5 text-sm text-pine-900/55">
                No active projects yet — open a recommended problem and use <b>Build Team</b>.
              </div>
            )}
          </div>
        </div>
        <div>
          <SectionHeading icon="⭐" title="Saved problems" sub="Bookmarked from Discover" />
          <div className="space-y-3">
            {saved.map((p) => (
              <Link key={p.id} to={`/problem/${p.id}`} className="card flex items-center justify-between gap-3 p-4 hover:shadow-card">
                <span className="min-w-0 flex-1 truncate text-sm font-bold text-ink">{p.title}</span>
                <MatchRing value={matchScoreFor(me!, p)} size={36} />
              </Link>
            ))}
            {saved.length === 0 && (
              <div className="card p-5 text-sm text-pine-900/55">
                Nothing saved yet. Use ☆ on problem cards in <Link to="/discover" className="link">Discover</Link>.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* KG nudge */}
      <div className="mt-8 card flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-royal-50 to-white p-5">
        <div className="flex items-center gap-3">
          <BookOpenCheck size={20} className="text-navy" />
          <div>
            <div className="text-sm font-extrabold text-ink">Knowledge Ground — your project's research home</div>
            <div className="text-xs text-pine-900/55">Ask questions, find resources, request expert guidance in your domain community.</div>
          </div>
        </div>
        <Link to="/knowledge" className="btn-primary">Open Knowledge Ground</Link>
      </div>
    </div>
  )
}
