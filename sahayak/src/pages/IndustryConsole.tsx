import { Link } from 'react-router-dom'
import { Building2, Handshake } from 'lucide-react'
import { useStore } from '@/data/store'
import { Bar, SectionHeading, Stat } from '@/ui/common'

export default function IndustryConsole() {
  const currentUser = useStore((s) => s.currentUser)
  const users = useStore((s) => s.users)
  const problems = useStore((s) => s.problems)
  const projects = useStore((s) => s.projects)

  const me = users.find((u) => u.id === currentUser?.id)
  const relevant = projects.filter((p) => p.domain === me?.domains?.[0])

  return (
    <div className="container-p max-w-6xl py-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-pine-900"><Building2 size={13} /> Industry / Startup / MSME</div>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-ink">{me?.institution}</h1>
          <p className="mt-1 text-sm text-pine-900/55">Optional, need-based participation — SahayaK never makes industry a dependency.</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-peach-200 bg-peach-50 p-5">
        <div className="flex items-start gap-3">
          <Handshake size={18} className="mt-0.5 shrink-0 text-pine-900" />
          <div className="text-sm leading-relaxed text-pine-900">
            <b>Your role here is opt-in.</b> Projects request industry input only when they genuinely need specialist
            resources, feasibility review or manufacturing guidance. Most projects complete without any industry
            involvement — expert faculty and community validation carry the core loop.
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Projects in your domain" value={relevant.length} sub="Available to browse" tone="sun" />
        <Stat label="Mentorship offers" value="0" sub="None requested so far" />
        <Stat label="Feasibility reviews" value="0" sub="Opt-in when teams ask" tone="royal" />
      </div>

      <div className="mt-8">
        <SectionHeading icon="🔍" title="Projects you could support" sub="Browse-only until a team explicitly requests help" />
        <div className="grid gap-4 md:grid-cols-2">
          {relevant.map((prj) => {
            const prob = problems.find((x) => x.id === prj.problemId)
            return (
              <Link key={prj.id} to={`/project/${prj.id}`} className="card block p-5 hover:shadow-card">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-extrabold text-ink">{prj.name}</span>
                  <span className="chip bg-pine-900/5 text-pine-900/70">{prj.stage}</span>
                </div>
                <div className="mt-1 text-xs text-pine-900/55">{prob?.title.slice(0, 80)}…</div>
                <div className="mt-3"><Bar value={prj.stageProgress} /></div>
              </Link>
            )
          })}
          {relevant.length === 0 && <div className="card p-6 text-sm text-pine-900/55">No projects in your domain yet.</div>}
        </div>
      </div>
    </div>
  )
}
