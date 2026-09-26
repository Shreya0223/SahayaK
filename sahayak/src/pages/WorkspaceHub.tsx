import { Navigate } from 'react-router-dom'
import { useStore } from '@/data/store'

export default function WorkspaceHub() {
  const currentUser = useStore((s) => s.currentUser)
  const projects = useStore((s) => s.projects)

  const mine = currentUser ? projects.find((p) => p.team.includes(currentUser.id) || p.mentorId === currentUser.id) : undefined
  if (mine) return <Navigate to={`/project/${mine.id}`} replace />

  return (
    <div className="container-p py-16 text-center">
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-pine-900">Workspace</h1>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-pine-900/60">
        You're not on a project team yet. Pick a problem in Discover, form a team, and your
        workspace with tasks, milestones and mentor feedback is created instantly.
      </p>
      <Navigate to="/discover" replace />
    </div>
  )
}
