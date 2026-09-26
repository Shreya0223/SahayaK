import { Link } from 'react-router-dom'
import { useStore, isCommunity } from '@/data/store'
import { Bar, EmptyState, SectionHeading, cx } from '@/ui/common'
import type { Project } from '@/data/types'

export function ProjectRow({ prj }: { prj: Project }) {
  const problems = useStore((s) => s.problems)
  const users = useStore((s) => s.users)
  const prob = problems.find((x) => x.id === prj.problemId)
  const mentor = users.find((u) => u.id === prj.mentorId)
  return (
    <Link to={`/project/${prj.id}`} className="card block p-5 transition hover:-translate-y-0.5 hover:shadow-pop">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[15px] font-extrabold text-ink">{prj.name}</span>
        <span className={cx('chip',
          prj.solutionStatus === 'Solved' ? 'bg-pine-100 text-pine-800' : prj.solutionStatus === 'Needs Improvement' ? 'bg-rose-100 text-rose-700' : 'bg-pine-900/5 text-pine-900/70')}>
          {prj.solutionStatus ?? `${prj.stage} · ${prj.stageProgress}%`}
        </span>
      </div>
      <div className="mt-1 text-xs text-pine-900/55">
        {prob?.domain === 'agri' ? '🌾' : '🏥'} {prob?.title.slice(0, 84)}…
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex-1"><Bar value={prj.stageProgress} /></div>
        <span className="text-[11px] font-bold text-pine-900/55">{prj.team.length} members{mentor ? ` · 👨‍🏫 ${mentor.name.split(' ')[0]}` : ''}</span>
      </div>
    </Link>
  )
}

export default function MyProjects() {
  const currentUser = useStore((s) => s.currentUser)
  const users = useStore((s) => s.users)
  const projects = useStore((s) => s.projects)
  const problems = useStore((s) => s.problems)
  const me = users.find((u) => u.id === currentUser?.id)

  const mine = projects.filter((p) => p.team.includes(me?.id ?? ''))
  const mentoring = projects.filter((p) => p.mentorId === me?.id)
  const reported = problems.filter((p) => p.reporterId === me?.id && p.projectId)
  const reportedProjects = projects.filter((p) => reported.some((r) => r.projectId === p.id))
  const isFaculty = me?.role === 'faculty'
  const showList = isFaculty ? mentoring : isCommunity(me?.role) ? reportedProjects : mine

  return (
    <div className="container-p max-w-5xl py-8">
      <SectionHeading
        icon="🛠️" title="My projects"
        sub={isFaculty ? 'Projects you mentor as domain expert'
          : isCommunity(me?.role) ? 'Projects working on problems you reported'
            : 'Teams you are part of'}
      />
      <div className="space-y-4">
        {showList.map((prj) => <ProjectRow key={prj.id} prj={prj} />)}
        {showList.length === 0 && (
          <EmptyState
            icon="🧩" title="No projects here yet"
            sub={isCommunity(me?.role)
              ? 'When a team starts working on one of your reported problems, it appears here.'
              : 'Join a team from Discover Problems, or build one from a problem page.'}
            action={<Link to="/discover" className="btn-primary">Discover problems</Link>}
          />
        )}
      </div>
    </div>
  )
}
