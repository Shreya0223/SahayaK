import { useState } from 'react'
import { BadgeCheck, Download, GraduationCap, Share2, X } from 'lucide-react'
import { useStore, ROLE_LABEL } from '@/data/store'
import { deriveCredentials } from '@/data/credentials'
import { Avatar, cx } from '@/ui/common'

export default function PortfolioModal({ userId, onClose }: { userId: string; onClose: () => void }) {
  const me = useStore((s) => s.users.find((u) => u.id === userId))
  const projects = useStore((s) => s.projects)
  const tasks = useStore((s) => s.tasks)
  const reviews = useStore((s) => s.reviews)
  const feedbacks = useStore((s) => s.feedbacks)
  const [copied, setCopied] = useState(false)

  if (!me) return null

  const isStudent = me.role === 'student'
  const credentials = isStudent ? deriveCredentials(me, projects, tasks, reviews, feedbacks) : []
  const myProjects = projects.filter((p) => p.team.includes(me.id) || p.mentorId === me.id)
  const skills = me.skills ?? me.expertise ?? []

  const share = () => {
    const text = `SahayaK Portfolio — ${me.name} (${ROLE_LABEL[me.role]})${me.institution ? ` · ${me.institution}` : ''}. ${credentials.length} verified credential(s), ${myProjects.length} field project(s). Verified on SahayaK.`
    navigator.clipboard?.writeText(text).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-pine-900/45 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <div className="relative max-h-[88vh] w-full max-w-2xl animate-fade-up overflow-y-auto rounded-3xl bg-paper shadow-pop">
        {/* header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-pine-900/10 bg-paper/95 px-6 py-4 backdrop-blur">
          <h2 className="font-display text-lg font-extrabold tracking-tight text-ink">
            {isStudent ? 'Student Portfolio & Credential' : 'Portfolio & Credentials'}
          </h2>
          <button onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-full text-pine-900/60 hover:bg-pine-50">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5">
          {/* identity */}
          <div className="flex flex-wrap items-start gap-4">
            <Avatar user={me} size={72} />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-black tracking-tight text-ink">{me.name}</h3>
                {me.verified && (
                  <span className="chip bg-pine-100 text-pine-800">
                    <BadgeCheck size={12} className="inline" /> Verified {ROLE_LABEL[me.role]}
                  </span>
                )}
              </div>
              <div className="mt-0.5 text-sm text-pine-900/60">{me.title ?? me.userType}</div>
              {me.institution && (
                <div className="mt-1 flex items-start gap-1.5 text-sm font-semibold text-pine-900/75">
                  <GraduationCap size={15} className="mt-0.5 shrink-0 text-pine-700" />
                  <span>{me.institution}{me.location ? `, ${me.location}` : ''}</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={share} className="btn-ghost px-3.5 py-2 text-[13px]">
                <Share2 size={14} /> {copied ? 'Copied ✓' : 'Share'}
              </button>
              <button onClick={() => window.print()} className="btn-primary px-3.5 py-2 text-[13px]">
                <Download size={14} /> Certificate
              </button>
            </div>
          </div>

          {/* bio quote */}
          {(me.bio || me.projects?.length) && (
            <p className="mt-5 border-l-2 border-pine-200 pl-4 text-[15px] italic leading-relaxed text-pine-900/70">
              “{me.bio ?? `Active SahayaK contributor — ${myProjects.length} project(s) from reported field problems.`}”
            </p>
          )}

          {/* achievement chips */}
          {credentials.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {credentials.map((c) => (
                <span key={c.id} className={cx('chip px-3 py-1.5',
                  c.level === 'Gold' ? 'bg-peach-100 text-pine-900' : c.level === 'Silver' ? 'bg-pine-50 text-pine-800' : 'bg-pine-900/5 text-pine-900/75')}>
                  {c.icon} {c.title}
                </span>
              ))}
            </div>
          ) : me.expertise && me.expertise.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {me.expertise.map((e) => (
                <span key={e} className="chip bg-pine-50 px-3 py-1.5 text-pine-800">✔ {e}</span>
              ))}
            </div>
          ) : null}

          {/* skills */}
          {skills.length > 0 && (
            <div className="mt-6">
              <div className="text-[11px] font-bold uppercase tracking-widest text-pine-900/45">
                {isStudent ? 'Field-proven skills' : 'Areas of expertise'}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {skills.map((s) => <span key={s} className="chip bg-pine-50 text-pine-800">{s}</span>)}
              </div>
            </div>
          )}

          {/* verified field projects */}
          <div className="mt-6">
            <div className="text-[11px] font-bold uppercase tracking-widest text-pine-900/45">
              {isStudent ? 'Verified field projects (capstone portfolio)' : 'Assigned projects'}
            </div>
            {myProjects.length === 0 ? (
              <div className="mt-2 rounded-xl bg-pine-900/[0.04] p-4 text-sm text-pine-900/55">
                No field projects yet — projects appear here once they pass expert validation.
              </div>
            ) : (
              <div className="mt-2 space-y-2">
                {myProjects.map((p) => (
                  <div key={p.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-pine-900/10 px-3.5 py-2.5">
                    <span className="min-w-0 flex-1 truncate text-sm font-bold text-ink">{p.name}</span>
                    <span className="chip bg-pine-900/5 text-[10px] text-pine-900/60">{p.stage}</span>
                    {p.solutionStatus
                      ? <span className="chip bg-pine-100 text-[10px] text-pine-800">✔ {p.solutionStatus}</span>
                      : <span className="chip bg-paper text-[10px] text-pine-900/55 ring-1 ring-pine-900/10">{p.validationStatus}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
