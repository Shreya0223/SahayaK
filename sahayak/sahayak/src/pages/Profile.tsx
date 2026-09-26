import { useState } from 'react'
import { BadgeCheck, Copy, Download, Lock, ShieldCheck } from 'lucide-react'
import { useStore, ROLE_LABEL } from '@/data/store'
import { deriveCredentials, credentialStats } from '@/data/credentials'
import type { Credential } from '@/data/credentials'
import { Avatar, RoleBadge, cx } from '@/ui/common'

const SKILL_OPTIONS = [
  'Python', 'Machine Learning', 'Image Classification', 'Data Analysis', 'Flutter', 'React',
  'Offline-first Apps', 'APIs', 'Embedded Systems', 'Sensor Integration', 'CAD', 'Statistics',
  'Survey Design', 'Figma', 'User Research', 'Field Data Collection', 'Crop Disease Knowledge',
  'Plant Tissue Culture', 'Medical Device Basics', 'Sensor Calibration', 'Cost Modeling',
]

export default function Profile() {
  const currentUser = useStore((s) => s.currentUser)
  const updateProfile = useStore((s) => s.updateProfile)
  const users = useStore((s) => s.users)
  const problems = useStore((s) => s.problems)
  const projects = useStore((s) => s.projects)

  const me = users.find((u) => u.id === currentUser?.id)
  const [skills, setSkills] = useState<string[]>(me?.skills ?? [])
  const [availability, setAvailability] = useState(me?.availability ?? '')
  const [saved, setSaved] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const reviews = useStore((s) => s.reviews)
  const feedbacks = useStore((s) => s.feedbacks)
  const tasks = useStore((s) => s.tasks)

  if (!me) return null
  const myProblems = problems.filter((p) => p.reporterId === me.id)
  const myProjects = projects.filter((p) => p.team.includes(me.id) || p.mentorId === me.id)

  const isStudent = me.role === 'student'
  const credentials: Credential[] = isStudent
    ? deriveCredentials(me, projects, tasks, reviews, feedbacks)
    : []
  const credStats = credentialStats(credentials)

  const copyCredential = (c: Credential) => {
    const text = `SahayaK Credential ${c.id} — ${c.title} (${c.level}). ${c.description} Evidence: ${c.evidence}. Verified on SahayaK, the collaborative innovation ecosystem.`
    navigator.clipboard?.writeText(text).catch(() => {})
    setCopiedId(c.id)
    setTimeout(() => setCopiedId(null), 1600)
  }

  const toggleSkill = (s: string) =>
    setSkills((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]))

  return (
    <div className="container-p max-w-4xl py-8">
      {/* identity card */}
      <div className="card p-6">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar user={me} size={64} />
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-black tracking-tight text-ink">{me.name}</h1>
            <p className="text-sm text-pine-900/55">{me.title} {me.institution && `· ${me.institution}`}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <RoleBadge role={me.role} />
              {me.verified && <span className="chip bg-pine-100 text-pine-800">✔ Verified</span>}
              {me.expertise?.slice(0, 3).map((e) => <span key={e} className="chip bg-royal-50 text-royal-800">{e}</span>)}
            </div>
          </div>
        </div>
      </div>

      {/* credentials (students only) */}
      {isStudent && (
        <div className="mt-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-ink">
                <BadgeCheck size={19} className="text-pine-700" /> Verified credentials
              </h2>
              <p className="mt-0.5 text-sm text-pine-900/55">
                Earned from real platform activity — never self-declared. Every credential links to the
                project, expert review or community feedback that proves it.
              </p>
            </div>
            {credentials.length > 0 && (
              <div className="flex gap-2 text-center">
                {([['Gold', credStats.gold, 'bg-peach-200 text-pine-900'], ['Silver', credStats.silver, 'bg-pine-900/10 text-pine-800'], ['Bronze', credStats.bronze, 'bg-peach-50 text-pine-900']] as const).map(([label, n, tone]) => (
                  <div key={label} className={cx('rounded-2xl px-4 py-2', tone)}>
                    <div className="text-lg font-black leading-none">{n}</div>
                    <div className="mt-0.5 text-[9px] font-bold uppercase tracking-widest">{label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {credentials.length === 0 ? (
            <div className="card mt-4 p-6 text-sm text-pine-900/55">
              No credentials yet. Join a project team, complete tasks and pass expert review — verified
              credentials appear here automatically as your work ships.
            </div>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {credentials.map((c) => (
                <div key={c.id} className={cx('card p-5', c.level === 'Gold' && 'border-peach-300', c.level === 'Silver' && 'border-pine-300')}>
                  <div className="flex items-start gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-pine-50 text-xl ring-1 ring-pine-900/10">{c.icon}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-[15px] font-extrabold leading-snug text-ink">{c.title}</h3>
                        <span className={cx('chip',
                          c.level === 'Gold' ? 'bg-peach-200 text-pine-900' : c.level === 'Silver' ? 'bg-pine-900/10 text-pine-800' : 'bg-peach-50 text-pine-900')}>
                          {c.level}
                        </span>
                      </div>
                      <p className="mt-1 text-[13px] leading-relaxed text-pine-900/65">{c.description}</p>
                      <div className="mt-2 rounded-xl bg-pine-900/[0.04] p-2.5">
                        <div className="text-[9px] font-bold uppercase tracking-widest text-pine-900/40">Evidence</div>
                        <div className="mt-0.5 text-[11px] font-semibold leading-snug text-pine-900/70">{c.evidence}</div>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-semibold text-pine-900/45">
                        <span className="font-mono">{c.id}</span>
                        {c.verifiedBy && <span>✔ {c.verifiedBy}</span>}
                        <span>Earned {c.earnedOn}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2 border-t border-pine-900/5 pt-3">
                    <button className="btn-ghost px-3 py-1.5 text-xs" onClick={() => copyCredential(c)}>
                      <Copy size={13} /> {copiedId === c.id ? 'Copied ✓' : 'Share'}
                    </button>
                    <button className="btn-ghost px-3 py-1.5 text-xs" onClick={() => window.print()}>
                      <Download size={13} /> Export
                    </button>
                    <span className="ml-auto self-center text-[10px] font-bold text-pine-700">🔗 Verifiable on SahayaK</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* role-specific info */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {me.role === 'student' && (
          <>
            <div className="card p-5">
              <h2 className="text-sm font-extrabold text-ink">Academic profile</h2>
              <dl className="mt-3 space-y-2 text-sm">
                {[['Institution', me.institution], ['Branch', me.branch], ['Year', me.year], ['Availability', me.availability], ['Preferred project type', me.projectType]].map(([k, v]) => (
                  v ? <div key={k} className="flex justify-between gap-3"><dt className="text-pine-900/55">{k}</dt><dd className="text-right font-bold text-ink">{v}</dd></div> : null
                ))}
              </dl>
              <div className="mt-3">
                <div className="text-[10px] font-bold uppercase text-pine-900/45">Previous projects</div>
                <ul className="mt-1 space-y-1 text-xs text-pine-900/70">
                  {me.projects?.map((p) => <li key={p}>• {p}</li>)}
                </ul>
              </div>
            </div>
            <div className="card p-5">
              <h2 className="text-sm font-extrabold text-ink">Skills & matching</h2>
              <p className="mt-1 text-xs text-pine-900/55">These drive your AI match %. Keep them honest — the problem determines required skills, not your branch.</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {SKILL_OPTIONS.map((s) => (
                  <button key={s} onClick={() => toggleSkill(s)}
                    className={cx('chip border', skills.includes(s) ? 'border-pine-700 bg-pine-800 text-white' : 'border-pine-900/10 bg-paper text-pine-900/70')}>
                    {s}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <span className="label">Availability</span>
                <div className="flex flex-wrap gap-1.5">
                  {['4–8 hrs/week', '10 hrs/week', '15 hrs/week', '20 hrs/week'].map((a) => (
                    <button key={a} onClick={() => setAvailability(a)}
                      className={cx('chip border', availability === a ? 'border-pine-700 bg-pine-800 text-white' : 'border-pine-900/10 bg-paper text-pine-900/70')}>{a}</button>
                  ))}
                </div>
              </div>
              <button className="btn-primary mt-4 w-full" onClick={() => { updateProfile({ skills, availability }); setSaved(true); setTimeout(() => setSaved(false), 2000) }}>
                {saved ? 'Saved ✓' : 'Save profile changes'}
              </button>
            </div>
          </>
        )}

        {(me.role === 'faculty' || me.role === 'industry') && (
          <div className="card p-5 md:col-span-2">
            <h2 className="text-sm font-extrabold text-ink">Expertise</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {me.expertise?.map((e) => <span key={e} className="chip bg-royal-100 text-royal-800">{e}</span>)}
            </div>
            <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <div className="flex justify-between"><span className="text-pine-900/55">Experience</span><b className="text-ink">{me.experience}</b></div>
              <div className="flex justify-between"><span className="text-pine-900/55">Institution</span><b className="text-ink">{me.institution}</b></div>
            </div>
          </div>
        )}

        {(me.role === 'citizen' || me.role === 'farmer' || me.role === 'health_worker') && (
          <div className="card p-5 md:col-span-2">
            <h2 className="text-sm font-extrabold text-ink">Community profile</h2>
            <div className="mt-2 grid gap-2 text-sm sm:grid-cols-3">
              <div className="flex justify-between"><span className="text-pine-900/55">User type</span><b className="text-ink">{me.userType}</b></div>
              <div className="flex justify-between"><span className="text-pine-900/55">Location</span><b className="text-ink">{me.location}</b></div>
              <div className="flex justify-between"><span className="text-pine-900/55">Member since</span><b className="text-ink">{me.joined}</b></div>
            </div>
          </div>
        )}

        <div className="card p-5">
          <h2 className="text-sm font-extrabold text-ink">Activity</h2>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-pine-900/[0.04] p-3"><div className="text-xl font-black text-ink">{myProblems.length}</div><div className="text-[10px] font-bold uppercase text-pine-900/45">Problems</div></div>
            <div className="rounded-xl bg-pine-900/[0.04] p-3"><div className="text-xl font-black text-ink">{myProjects.length}</div><div className="text-[10px] font-bold uppercase text-pine-900/45">Projects</div></div>
            <div className="rounded-xl bg-pine-900/[0.04] p-3"><div className="text-xl font-black text-ink">{(me.domains ?? []).length}</div><div className="text-[10px] font-bold uppercase text-pine-900/45">Domains</div></div>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="flex items-center gap-2 text-sm font-extrabold text-ink"><ShieldCheck size={15} className="text-pine-700" /> Privacy, consent & RBAC</h2>
          <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-pine-900/70">
            <li className="flex gap-1.5"><Lock size={11} className="mt-0.5 shrink-0" /> Your data is used only for matching and collaboration.</li>
            <li className="flex gap-1.5"><Lock size={11} className="mt-0.5 shrink-0" /> Healthcare problems are access-controlled: no patient-identifiable fields exist anywhere in SahayaK.</li>
            <li className="flex gap-1.5"><Lock size={11} className="mt-0.5 shrink-0" /> You can request deletion of your profile and submissions at any time (demo: data resets on browser clear).</li>
            <li className="flex gap-1.5"><Lock size={11} className="mt-0.5 shrink-0" /> All privileged actions (routing, reviews, deletions) are written to the admin audit log.</li>
          </ul>
          <div className="mt-3 rounded-xl bg-pine-900/[0.04] p-3 text-[11px] font-semibold text-pine-900/55">
            Signed in as: {ROLE_LABEL[me.role]} · RBAC limits visible actions to this role.
          </div>
        </div>
      </div>
    </div>
  )
}
