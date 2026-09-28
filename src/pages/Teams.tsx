import { Link } from 'react-router-dom'
import { useStore } from '@/data/store'
import { Avatar, Bar, SectionHeading } from '@/ui/common'

export default function Teams() {
  const projects = useStore((s) => s.projects)
  const problems = useStore((s) => s.problems)
  const users = useStore((s) => s.users)

  return (
    <div className="container-p max-w-6xl py-8">
      <SectionHeading
        icon="🤝" title="Teams"
        sub="Multidisciplinary teams formed around problems — branch diversity that follows the required skills"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((prj) => {
          const prob = problems.find((x) => x.id === prj.problemId)
          const team = users.filter((u) => prj.team.includes(u.id))
          const mentor = users.find((u) => u.id === prj.mentorId)
          const branches = [...new Set(team.map((t) => t.branch?.split(' ')[0] ?? t.title))]
          return (
            <div key={prj.id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Link to={`/project/${prj.id}`} className="text-[15px] font-extrabold text-ink hover:text-pine-700">{prj.name}</Link>
                <span className="chip bg-pine-900/5 text-pine-900/70">{prj.stage}</span>
              </div>
              <div className="mt-1 text-xs text-pine-900/55">{prob?.domain === 'agri' ? '🌾 Agriculture' : '🏥 Healthcare'} · {prob?.location}</div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {team.map((t) => (
                  <span key={t.id} className="flex items-center gap-1.5 rounded-full bg-pine-900/[0.04] py-1 pl-1 pr-2.5 ring-1 ring-pine-900/10">
                    <Avatar user={t} size={22} />
                    <span className="text-[11px] font-bold text-ink">{t.name.split(' ')[0]}</span>
                    <span className="text-[10px] text-pine-900/45">{t.branch?.split(' ')[0] ?? t.userType}</span>
                  </span>
                ))}
                {mentor && <span className="chip bg-royal-100 text-royal-800">👨‍🏫 {mentor.name.split(' ')[0]}</span>}
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                {branches.map((b) => <span key={b} className="chip bg-pine-50 text-pine-800">{b}</span>)}
              </div>
              <div className="mt-3"><Bar value={prj.stageProgress} height="h-1.5" /></div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
