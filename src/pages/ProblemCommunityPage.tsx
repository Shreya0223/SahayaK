import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, BookOpen, CalendarDays, Check, FileText, Heart, MapPin,
  MessageSquarePlus, Users2,
} from 'lucide-react'
import { useStore } from '@/data/store'
import { Avatar, cx } from '@/ui/common'

const KIND_STYLE: Record<string, string> = {
  Update: 'bg-pine-100 text-pine-800 border-pine-700/20',
  Question: 'bg-royal-50 text-royal-700 border-royal-600/20',
  'Offer Help': 'bg-periwinkle-50 text-royal-700 border-royal-600/15',
  Result: 'bg-peach-100 text-peach-800 border-peach-700/25',
}

export default function ProblemCommunityPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const currentUser = useStore((s) => s.currentUser)
  const users = useStore((s) => s.users)
  const problems = useStore((s) => s.problems)
  const projects = useStore((s) => s.projects)
  const communities = useStore((s) => s.communities)
  const joinCommunity = useStore((s) => s.joinCommunity)
  const leaveCommunity = useStore((s) => s.leaveCommunity)
  const addCommunityPost = useStore((s) => s.addCommunityPost)
  const likeCommunityPost = useStore((s) => s.likeCommunityPost)
  const rsvpCommunityEvent = useStore((s) => s.rsvpCommunityEvent)

  const [draft, setDraft] = useState('')
  const [kind, setKind] = useState<'Update' | 'Question' | 'Offer Help' | 'Result'>('Question')
  const [showMembers, setShowMembers] = useState(false)

  const com = communities.find((c) => c.id === id)
  if (!com) {
    return (
      <div className="container-p py-16 text-center">
        <p className="text-sm text-pine-900/55">Community not found.</p>
        <Link to="/discover" className="btn-primary mt-4">Browse problems</Link>
      </div>
    )
  }

  const problem = problems.find((p) => p.id === com.problemId)
  const project = projects.find((p) => p.problemId === com.problemId)
  const coordinator = users.find((u) => u.id === com.coordinatorId)
  const isMember = !!currentUser && com.memberIds.includes(currentUser.id)
  const members = com.memberIds.map((m) => users.find((u) => u.id === m)).filter(Boolean) as NonNullable<typeof users[number]>[]

  const submitPost = () => {
    if (!currentUser) { navigate('/auth'); return }
    if (!draft.trim()) return
    if (!isMember) { joinCommunity(com.id) }
    addCommunityPost(com.id, kind, draft)
    setDraft('')
  }

  return (
    <div className="container-p max-w-6xl py-8">
      <button onClick={() => problem ? navigate(`/problem/${problem.id}`) : navigate('/discover')} className="flex items-center gap-1.5 text-xs font-semibold text-pine-900/55 hover:text-pine-900">
        <ArrowLeft size={14} /> Back to {problem ? 'problem' : 'discover'}
      </button>

      {/* header */}
      <header className="card mt-4 overflow-hidden">
        <div className="bg-gradient-to-r from-pine-900 to-royal-800 px-6 py-5 text-paper">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-paper/60">
                {com.domain === 'agri' ? '🌾 Agriculture community' : '🏥 Healthcare community'} · born from a reported problem
              </p>
              <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{com.name}</h1>
              <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-paper/75">{com.purpose}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-paper/15 px-3 py-1.5 text-xs font-bold">
                <Users2 size={13} /> {com.memberIds.length} members
              </span>
              {currentUser && !isMember && (
                <button onClick={() => joinCommunity(com.id)} className="btn bg-peach-400 px-4 py-2 text-xs font-bold text-pine-950 hover:bg-peach-300">
                  + Join this community
                </button>
              )}
              {currentUser && isMember && (
                <button onClick={() => leaveCommunity(com.id)} className="btn bg-paper/10 px-4 py-2 text-xs font-bold text-paper hover:bg-paper/20">
                  ✓ Member — leave
                </button>
              )}
            </div>
          </div>
        </div>

        {/* linked problem strip */}
        {problem && (
          <div className="flex flex-wrap items-center gap-3 border-b border-pine-900/10 bg-pine-50/70 px-6 py-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-pine-900/45">Origin problem</span>
            <Link to={`/problem/${problem.id}`} className="min-w-0 flex-1 truncate text-sm font-bold text-pine-900 hover:underline">
              {problem.title}
            </Link>
            <span className="chip shrink-0 bg-pine-900/5 text-pine-900/70">{problem.status}</span>
            {project && <Link to={`/project/${project.id}`} className="chip shrink-0 bg-royal-50 text-royal-700">Project: {project.name} →</Link>}
          </div>
        )}
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* feed */}
        <section>
          {/* composer */}
          <div className="card p-4">
            {currentUser ? (
              <>
                <div className="flex items-center gap-2">
                  <Avatar user={currentUser} size={32} />
                  <div className="flex flex-wrap gap-1.5">
                    {(['Question', 'Offer Help', 'Update', 'Result'] as const).map((k) => (
                      <button
                        key={k}
                        onClick={() => setKind(k)}
                        className={cx('rounded-full border px-2.5 py-1 text-[11px] font-bold transition-colors',
                          kind === k ? KIND_STYLE[k] : 'border-stone-200 bg-white text-pine-900/50 hover:text-pine-900')}
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={kind === 'Question' ? 'Ask the circle… plain words are fine'
                    : kind === 'Offer Help' ? 'What can you help with?'
                    : kind === 'Update' ? 'Share an update with the circle…'
                    : 'Share a field result — what worked, what did not…'}
                  rows={2}
                  className="input mt-2.5 resize-none text-sm"
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[11px] text-pine-900/45">
                    {com.domain === 'health' ? '🔒 No patient identifiers — circle guideline' : '📍 Village-level detail helps experts respond'}
                  </span>
                  <button onClick={submitPost} disabled={!draft.trim()} className="btn-primary flex items-center gap-1.5 px-4 py-2 text-xs disabled:opacity-40">
                    <MessageSquarePlus size={14} /> Post {isMember ? '' : '& join'}
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-pine-900/60">Sign in to post, RSVP and get updates from this circle.</p>
                <Link to="/auth" className="btn-primary px-4 py-2 text-xs">Sign in to participate</Link>
              </div>
            )}
          </div>

          {/* posts */}
          <div className="mt-4 space-y-3">
            {com.posts.map((p) => {
              const author = users.find((u) => u.id === p.authorId)
              const liked = !!currentUser && p.likedBy?.includes(currentUser.id)
              return (
                <article key={p.id} className="card p-4">
                  <div className="flex items-start gap-3">
                    {author && <Avatar user={author} size={36} />}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-extrabold text-ink">{author?.name ?? 'Member'}</span>
                        {author?.role === 'faculty' && <span className="chip bg-royal-50 text-royal-700">👨‍🏫 Expert</span>}
                        {author?.role === 'farmer' && <span className="chip bg-pine-50 text-pine-800">🧑‍🌾 Field voice</span>}
                        <span className={cx('chip border px-2 py-0.5 text-[10px]', KIND_STYLE[p.kind])}>{p.kind}</span>
                        <span className="text-[11px] text-pine-900/40">{p.at}</span>
                      </div>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-pine-900/75">{p.text}</p>
                      <button
                        onClick={() => currentUser ? likeCommunityPost(com.id, p.id) : navigate('/auth')}
                        className={cx('mt-2 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors',
                          liked ? 'bg-rose-50 text-rose-600' : 'text-pine-900/45 hover:bg-pine-900/5')}
                      >
                        <Heart size={13} className={liked ? 'fill-rose-500 text-rose-500' : ''} /> {p.likes}
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </section>

        {/* side */}
        <aside className="space-y-5">
          {/* events */}
          <div className="card p-5">
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-ink"><CalendarDays size={15} className="text-pine-700" /> Upcoming gatherings</h3>
            <div className="mt-3 space-y-3">
              {com.events.map((e) => {
                const going = !!currentUser && e.rsvps.includes(currentUser.id)
                return (
                  <div key={e.id} className="rounded-xl border border-pine-900/10 p-3">
                    <div className="text-sm font-bold text-ink">{e.title}</div>
                    <div className="mt-1 text-[11px] font-semibold text-pine-900/55">🗓 {e.when} · 📍 {e.place}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-[11px] text-pine-900/50">
                        <Users2 size={11} /> {e.rsvps.length} going
                      </span>
                      <button
                        onClick={() => currentUser ? rsvpCommunityEvent(com.id, e.id) : navigate('/auth')}
                        className={cx('rounded-full px-3 py-1 text-[11px] font-bold',
                          going ? 'bg-pine-800 text-paper' : 'bg-pine-900/5 text-pine-900/70 hover:bg-pine-900/10')}
                      >
                        {going ? <><Check size={11} className="inline" /> Going</> : 'RSVP'}
                      </button>
                    </div>
                  </div>
                )
              })}
              {com.events.length === 0 && <p className="text-xs text-pine-900/45">No gatherings scheduled yet.</p>}
            </div>
          </div>

          {/* coordinator + members */}
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-ink">Circle coordination</h3>
              <button onClick={() => setShowMembers((v) => !v)} className="text-[11px] font-bold text-royal-700 hover:underline">
                {showMembers ? 'Hide all' : `All ${com.memberIds.length}`}
              </button>
            </div>
            {coordinator && (
              <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-pine-50/70 p-2.5">
                <Avatar user={coordinator} size={34} />
                <div>
                  <div className="text-[13px] font-extrabold text-ink">{coordinator.name}</div>
                  <div className="text-[11px] text-pine-900/55">Community coordinator · {coordinator.title}</div>
                </div>
              </div>
            )}
            <div className={cx('mt-2 grid gap-1', showMembers ? 'grid-cols-1' : 'grid-cols-1')}>
              {members.filter((m) => m.id !== com.coordinatorId).slice(0, showMembers ? 20 : 4).map((m) => (
                <div key={m.id} className="flex items-center gap-2 px-1 py-1">
                  <Avatar user={m} size={24} />
                  <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-pine-900/75">{m.name}</span>
                  <span className="shrink-0 text-[10px] text-pine-900/40">{m.role === 'student' ? m.branch : m.userType ?? m.role}</span>
                </div>
              ))}
            </div>
            {!showMembers && com.memberIds.length > 5 && (
              <p className="mt-1 text-[11px] text-pine-900/40">+{com.memberIds.length - 5} more members</p>
            )}
          </div>

          {/* resources */}
          <div className="card p-5">
            <h3 className="flex items-center gap-2 text-sm font-extrabold text-ink"><BookOpen size={15} className="text-pine-700" /> Circle resources</h3>
            <div className="mt-3 space-y-2">
              {com.resources.map((r) => (
                <div key={r.id} className="flex items-center gap-2 rounded-lg bg-pine-900/[0.03] px-3 py-2">
                  <FileText size={13} className="shrink-0 text-pine-700" />
                  <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-pine-900/75">{r.title}</span>
                  <span className="chip shrink-0 bg-paper text-[10px] text-pine-900/55">{r.kind}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-pine-900/45">
              Resources stay inside the circle; wider knowledge goes to <Link to="/knowledge" className="font-semibold text-royal-700 hover:underline">Knowledge Ground</Link>.
            </p>
          </div>

          <p className="flex items-start gap-2 text-[11px] leading-relaxed text-pine-900/45">
            <MapPin size={12} className="mt-0.5 shrink-0" />
            Communities form automatically when a problem is reported — the people closest to the problem guide it; experts validate; students build.
          </p>
        </aside>
      </div>
    </div>
  )
}
