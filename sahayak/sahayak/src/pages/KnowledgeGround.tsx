import { useMemo, useState } from 'react'
import { Bookmark, CheckCircle2, Send, Sparkles } from 'lucide-react'
import { useStore } from '@/data/store'
import { Avatar, cx } from '@/ui/common'
import type { DomainId, KgPost } from '@/data/types'

const KIND_TONE: Record<KgPost['kind'], string> = {
  Question: 'bg-periwinkle text-navy', Resource: 'bg-pine-100 text-pine-800',
  Discussion: 'bg-peach-100 text-pine-900', Announcement: 'bg-pine-900 text-white',
  'Expert Insight': 'bg-royal-100 text-royal-800',
}
const KINDS: KgPost['kind'][] = ['All' as never, 'Question', 'Resource', 'Discussion', 'Expert Insight', 'Announcement']

const TOPICS: Record<DomainId, string[]> = {
  agri: ['All topics', 'Crop Disease Diagnostics', 'Plant Pathology', 'Data Collection', 'Pest Management', 'Announcements'],
  health: ['All topics', 'Primary Healthcare Systems', 'Medical Equipment', 'Health Data & Privacy', 'Cross-Domain', 'Announcements'],
}

export default function KnowledgeGround() {
  const currentUser = useStore((s) => s.currentUser)
  const users = useStore((s) => s.users)
  const kgPosts = useStore((s) => s.kgPosts)
  const kgReplies = useStore((s) => s.kgReplies)
  const addKgPost = useStore((s) => s.addKgPost)
  const addKgReply = useStore((s) => s.addKgReply)
  const toggleSavePost = useStore((s) => s.toggleSavePost)

  const [community, setCommunity] = useState<DomainId>('agri')
  const [kind, setKind] = useState<string>('All')
  const [topic, setTopic] = useState('All topics')
  const [openPost, setOpenPost] = useState<string | null>(null)
  const [reply, setReply] = useState('')
  const [composerOpen, setComposerOpen] = useState(false)
  const [pKind, setPKind] = useState<KgPost['kind']>('Question')
  const [pTitle, setPTitle] = useState('')
  const [pBody, setPBody] = useState('')

  const posts = useMemo(
    () => kgPosts.filter((g) => g.community === community && (kind === 'All' || g.kind === kind) && (topic === 'All topics' || g.topic === topic)),
    [kgPosts, community, kind, topic],
  )

  const submitPost = () => {
    if (!pTitle.trim() || !pBody.trim()) return
    addKgPost({
      community,
      kind: pKind,
      topic: TOPICS[community][1],
      title: pTitle.trim(),
      excerpt: pBody.trim(),
    })
    setPTitle(''); setPBody(''); setComposerOpen(false)
  }

  return (
    <div className="container-p max-w-7xl py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-pine-700">Knowledge Ground</div>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-ink">Two communities, one knowledge base</h1>
          <p className="mt-1 text-sm font-semibold text-pine-900/55">«Focused within, connected across.»</p>
        </div>
        {currentUser && (
          <button className="btn-primary" onClick={() => setComposerOpen((v) => !v)}>
            {composerOpen ? 'Close' : 'Ask a question / Post knowledge'}
          </button>
        )}
      </div>

      {/* composer */}
      {composerOpen && currentUser && (
        <div className="card mt-5 space-y-3 p-5">
          <div className="flex flex-wrap gap-2">
            {(['Question', 'Resource', 'Discussion'] as KgPost['kind'][]).map((k) => (
              <button key={k} onClick={() => setPKind(k)}
                className={cx('chip border px-3 py-1.5', pKind === k ? 'border-pine-700 bg-pine-800 text-white' : 'border-pine-900/10 bg-paper text-pine-900/70')}>{k}</button>
            ))}
          </div>
          <input className="input" placeholder={pKind === 'Question' ? 'Ask a precise question…' : 'Give your post a clear title…'} value={pTitle} onChange={(e) => setPTitle(e.target.value)} />
          <textarea className="input min-h-24" placeholder="Add context — what you tried, what you need. Experts and students across both communities can respond." value={pBody} onChange={(e) => setPBody(e.target.value)} />
          <div className="flex justify-end">
            <button className="btn-primary" onClick={submitPost} disabled={!pTitle.trim() || !pBody.trim()}>
              <Send size={14} /> Post to {community === 'agri' ? 'Agriculture' : 'Healthcare'} community
            </button>
          </div>
        </div>
      )}

      {/* community switch */}
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {([['agri', '🌾', 'Agriculture & Genetics', 'from-pine-50', 'Crop diagnostics · soil · post-harvest · genetics'],
           ['health', '🏥', 'Healthcare & Biotechnology', 'from-royal-50', 'Primary care · devices · public health · privacy']] as const).map(([d, ic, label, grad, sub]) => (
          <button key={d} onClick={() => { setCommunity(d); setTopic('All topics'); setKind('All') }}
            className={cx('rounded-2xl border p-4 text-left transition',
              community === d ? 'border-pine-700 bg-gradient-to-r ' + grad + ' to-paper ring-1 ring-pine-700 shadow-card' : 'border-pine-900/10 bg-paper hover:border-pine-900/20')}>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{ic}</span>
              <span className="text-sm font-extrabold text-ink">{label}</span>
              {community === d && <CheckCircle2 size={15} className="ml-auto text-pine-700" />}
            </div>
            <div className="mt-1 text-[11px] text-pine-900/55">{sub} · {kgPosts.filter((g) => g.community === d).length} posts</div>
          </button>
        ))}
      </div>

      {/* filters */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        {KINDS.filter((k) => k !== ('All' as never)).map((k) => (
          <button key={k} onClick={() => setKind(kind === k ? 'All' : k)}
            className={cx('chip border px-3 py-1.5 transition', kind === k ? 'border-ink bg-pine-900 text-white' : 'border-pine-900/10 bg-paper text-pine-900/70 hover:border-pine-900/20')}>
            {k}
          </button>
        ))}
        <select className="input ml-auto w-48 py-1.5 text-xs" value={topic} onChange={(e) => setTopic(e.target.value)}>
          {TOPICS[community].map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>

      {/* posts */}
      <div className="mt-5 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-3">
          {posts.map((g) => {
            const author = users.find((u) => u.id === g.authorId)
            const isExpert = author?.role === 'faculty' || author?.role === 'admin'
            const replies = kgReplies.filter((r) => r.postId === g.id)
            const expanded = openPost === g.id
            return (
              <div key={g.id} className="card p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cx('chip', KIND_TONE[g.kind])}>{g.kind}</span>
                  <span className="chip bg-pine-900/5 text-pine-900/70">{g.topic}</span>
                  {g.projectId && <span className="chip bg-pine-50 text-pine-700">🛠️ project thread</span>}
                  <span className="ml-auto text-[11px] text-pine-900/45">{g.at}</span>
                </div>
                <h3 className="mt-2.5 text-[15px] font-extrabold leading-snug text-ink">{g.title}</h3>
                <p className={cx('mt-1.5 text-sm leading-relaxed text-pine-900/70', !expanded && 'line-clamp-2')}>{g.excerpt}</p>
                {g.attachment && (
                  <div className="mt-2 flex items-center gap-2 rounded-lg bg-pine-50 px-3 py-2 text-xs font-bold text-pine-800">
                    📄 {g.attachment} <span className="ml-auto font-semibold text-pine-700">Save resource</span>
                  </div>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-pine-900/5 pt-3">
                  {author && (
                    <span className="flex items-center gap-2">
                      <Avatar user={author} size={24} />
                      <span className="text-xs font-bold text-ink">{author.name}</span>
                      {isExpert && <span className="chip bg-royal-100 text-royal-800">✔ Expert / Faculty</span>}
                    </span>
                  )}
                  <span className="text-xs text-pine-900/45">▲ {g.upvotes}</span>
                  <button className="text-xs font-bold text-pine-900/55 hover:text-ink" onClick={() => setOpenPost(expanded ? null : g.id)}>
                    💬 {g.replies} replies
                  </button>
                  <button className="ml-auto text-pine-900/30 hover:text-peach-400" onClick={() => toggleSavePost(g.id)} aria-label="Save">
                    <Bookmark size={15} className={g.saved ? 'fill-peach-300 text-peach-300' : ''} />
                  </button>
                </div>

                {expanded && (
                  <div className="mt-3 space-y-3 border-t border-pine-900/5 pt-3">
                    {replies.map((r) => {
                      const ru = users.find((u) => u.id === r.authorId)
                      return (
                        <div key={r.id} className="flex gap-2.5">
                          {ru && <Avatar user={ru} size={26} />}
                          <div className="min-w-0 flex-1 rounded-xl bg-pine-900/[0.04] px-3.5 py-2.5">
                            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-ink">
                              {ru?.name}
                              {(ru?.role === 'faculty' || ru?.role === 'admin') && <span className="chip bg-royal-100 text-royal-800">Expert</span>}
                              <span className="font-normal text-pine-900/45">· {r.at}</span>
                            </div>
                            <p className="mt-1 text-[13px] leading-relaxed text-pine-900/70">{r.text}</p>
                          </div>
                        </div>
                      )
                    })}
                    {currentUser && (
                      <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (reply.trim()) { addKgReply(g.id, reply.trim()); setReply('') } }}>
                        <input className="input py-2 text-sm" placeholder="Write a reply…" value={reply} onChange={(e) => setReply(e.target.value)} />
                        <button className="btn-primary shrink-0 px-3" type="submit"><Send size={14} /></button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            )
          })}
          {posts.length === 0 && <div className="card p-10 text-center text-sm text-pine-900/45">No posts match these filters yet.</div>}
        </div>

        {/* sidebar */}
        <div className="space-y-4">
          <div className="card border-royal-200 bg-royal-50/60 p-5">
            <div className="flex items-center gap-2 text-sm font-extrabold text-navy"><Sparkles size={15} /> Request expert guidance</div>
            <p className="mt-1.5 text-xs leading-relaxed text-royal-800">
              Mark a question for expert attention — faculty in this community get notified and answer first. Expert
              answers carry a verified badge.
            </p>
            {currentUser && (
              <button className="btn-primary mt-3 w-full" onClick={() => { setComposerOpen(true); setPKind('Question') }}>
                Ask the experts
              </button>
            )}
          </div>
          <div className="card p-5">
            <div className="text-sm font-extrabold text-ink">Community guidelines</div>
            <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-pine-900/70">
              <li>• No patient-identifiable data — ever (healthcare community)</li>
              <li>• Cite sources for clinical/agronomic claims</li>
              <li>• Be specific: crop, district, device, workflow</li>
              <li>• Students: state what you tried before asking</li>
            </ul>
          </div>
          <div className="card bg-gradient-to-br from-pine-50 to-paper p-5">
            <div className="text-sm font-extrabold text-ink">Cross-community bridge</div>
            <p className="mt-1.5 text-xs leading-relaxed text-pine-900/70">
              Methods travel across domains — image diagnostics pipelines built for crop disease now inform medical
              device triage threads. «Focused within, connected across.»
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
