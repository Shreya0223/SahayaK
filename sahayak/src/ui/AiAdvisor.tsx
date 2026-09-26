import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Route, Send, Sparkles, X } from 'lucide-react'
import { useStore } from '@/data/store'
import { cx } from '@/ui/common'

interface Msg { from: 'you' | 'ai'; text: string }

/* Deterministic on-device "advisor" — no network, no external AI. */
function advise(q: string): string {
  const s = q.toLowerCase()
  if (/blueprint|start|how do i begin|template/.test(s))
    return 'Open Blueprints in the nav — pick a proven architecture (e.g. Photo-based Crop Disease Screener), hit “Use”, then find a matching problem in Discover. You still go through expert review and community validation.'
  if (/grant|fund|money|scholarship|budget/.test(s))
    return 'Check Grants for calls matching your project stage. Your SahayaK evidence pack — expert approval, community ratings, impact metrics — is exactly what funders ask for. Funding is optional; projects can start without it.'
  if (/team|teammate|partner|who/.test(s))
    return 'Open any problem in Discover → the AI matcher ranks students by complementary skills, not branch. Aim for coverage of all required skills with minimal overlap — that beats a bigger team.'
  if (/crop|disease|farm|soil|irrigat/.test(s))
    return 'For crop-health problems, the winning pattern is: field photos + local expert labeling + on-device screening + advisory gated by a plant pathologist. The Blueprints tab has the full architecture.'
  if (/health|phc|patient|clinic|medical/.test(s))
    return 'Healthcare projects must stay non-clinical: workflow tools, reminders, equipment uptime, logistics. Patients never expose data to students — experts hold the clinical line. See the Offline-first Follow-up Kit blueprint.'
  if (/validate|review|expert/.test(s))
    return 'Request review from your workspace once a milestone is demo-ready. Experts approve or request changes with comments; community validation happens after, with real users rating usefulness.'
  return 'Describe your goal — “find a teammate for an image-classification project”, “which grant fits a PHC workflow tool?” — and I’ll point you to the right tab. I can also explain the problem → skills → people pipeline.'
}

export default function AiAdvisor() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: 'ai', text: 'Hi! I’m the SahayaK Advisor. Ask me how to start a project, find a team, pick a blueprint, or locate grants for validated work.' },
  ])
  const boxRef = useRef<HTMLDivElement>(null)
  const currentUser = useStore((s) => s.currentUser)

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight })
  }, [msgs, open])

  const send = () => {
    const q = input.trim()
    if (!q) return
    setMsgs((m) => [...m, { from: 'you', text: q }, { from: 'ai', text: advise(q) }])
    setInput('')
  }

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cx(
          'hidden items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-bold transition-colors lg:flex',
          open ? 'border-pine-900 bg-pine-900 text-white' : 'border-stone-200 bg-white text-pine-900 hover:border-pine-700/40',
        )}
        title="SahayaK AI Advisor"
      >
        <Sparkles size={15} className={open ? 'text-white' : 'text-royal-600'} /> AI Advisor
      </button>

      {open && (
        <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)}>
          <div
            className="absolute right-4 top-20 flex w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-card-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between bg-gradient-to-r from-pine-900 to-royal-800 px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-peach-300" />
                <span className="font-display text-sm font-bold text-white">AI Advisor</span>
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold text-white/80">
                  on-device demo
                </span>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-full p-1 text-white/70 hover:bg-white/10 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div ref={boxRef} className="max-h-72 space-y-2.5 overflow-y-auto bg-stone-50/60 p-3.5">
              {msgs.map((m, i) => (
                <div key={i} className={cx('flex', m.from === 'you' ? 'justify-end' : 'justify-start')}>
                  <p
                    className={cx(
                      'max-w-[85%] rounded-2xl px-3 py-2 text-[12.5px] leading-relaxed',
                      m.from === 'you'
                        ? 'rounded-br-md bg-pine-900 text-white'
                        : 'rounded-bl-md border border-stone-200 bg-white text-pine-900/80',
                    )}
                  >
                    {m.text}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-100 p-3">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder={currentUser?.role === 'student' ? 'Ask about teams, blueprints, grants…' : 'Ask about problems, experts, hubs…'}
                  className="min-w-0 flex-1 rounded-full border border-stone-200 bg-stone-50 px-3.5 py-2 text-[13px] text-pine-900 outline-none placeholder:text-pine-900/35 focus:border-pine-700/40 focus:bg-white"
                />
                <button onClick={send} className="btn shrink-0 bg-royal-600 px-3 py-2 text-white hover:bg-royal-700" title="Send">
                  <Send size={15} />
                </button>
              </div>
              <p className="mt-2 text-[10.5px] leading-relaxed text-pine-900/40">
                AI recommends; humans validate. The advisor never makes medical or agronomic decisions.
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 border-t border-stone-100 bg-stone-50/60 py-2 text-[11px] font-semibold text-royal-700">
              <Link to="/blueprints" onClick={() => setOpen(false)} className="flex items-center gap-1 hover:underline">
                <Route size={12} /> Blueprints
              </Link>
              <Link to="/grants" onClick={() => setOpen(false)} className="flex items-center gap-1 hover:underline">
                <GraduationCap size={12} /> Grants
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
