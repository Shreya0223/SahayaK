import { Link } from 'react-router-dom'
import { CheckCheck } from 'lucide-react'
import { useStore } from '@/data/store'
import { SectionHeading, cx } from '@/ui/common'

const TYPE_ICON: Record<string, string> = {
  match: '🎯', invite: '🤝', task: '📋', deadline: '⏰', expert: '👨‍🏫',
  kg: '💬', milestone: '🏁', validation: '🧪', solution: '✅', system: '🔔',
}

export default function Notifications() {
  const currentUser = useStore((s) => s.currentUser)
  const notifications = useStore((s) => s.notifications)
  const markAllRead = useStore((s) => s.markAllRead)
  const markRead = useStore((s) => s.markRead)
  const mine = notifications.filter((n) => n.userId === currentUser?.id)

  return (
    <div className="container-p max-w-3xl py-8">
      <SectionHeading
        icon="🔔" title="Notifications"
        sub="Matches, invitations, tasks, deadlines, expert feedback, replies, milestones and validation requests"
        action={mine.some((n) => !n.read) && (
          <button className="btn-secondary text-xs" onClick={markAllRead}><CheckCheck size={14} /> Mark all read</button>
        )}
      />
      <div className="card divide-y divide-pine-900/5">
        {mine.map((n) => (
          <Link
            key={n.id} to={n.link ?? '#'} onClick={() => markRead(n.id)}
            className={cx('flex items-start gap-3 px-5 py-4 transition hover:bg-pine-900/[0.04]', !n.read && 'bg-pine-50/50')}
          >
            <span className="text-lg">{TYPE_ICON[n.type] ?? '🔔'}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium leading-snug text-ink">{n.text}</span>
              <span className="mt-0.5 block text-[11px] text-pine-900/45">{n.at}</span>
            </span>
            {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-pine-600" />}
          </Link>
        ))}
        {mine.length === 0 && <div className="p-10 text-center text-sm text-pine-900/45">Nothing here yet.</div>}
      </div>
    </div>
  )
}
