import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BrainCircuit, CheckCircle2, Info, Mic } from 'lucide-react'
import { useStore, runAiAnalysis } from '@/data/store'
import { cx } from '@/ui/common'
import { useT } from '@/i18n'
import type { DomainId, Urgency } from '@/data/types'

const ANALYZE_KEYS = ['an.1', 'an.2', 'an.3', 'an.4', 'an.5']

const PRESETS: { label: string; icon: string; tone: 'pine' | 'peach' | 'peri'; domain: DomainId; title: string; description: string; people: string }[] = [
  {
    label: 'ठिबक गाळ (Drip Silt)', icon: '🌾', tone: 'pine', domain: 'agri',
    title: 'Drip irrigation nozzles clog with red soil within 2 days — manual cleaning takes 4 hours every morning',
    description: 'During the monsoon, our drip irrigation nozzles get blocked with red soil within 2 days, and manual cleaning takes 4 hours every morning across our 5-acre plot. Three other farms on the same line face the same issue.',
    people: '85',
  },
  {
    label: 'English Agri', icon: '🌾', tone: 'peach', domain: 'agri',
    title: 'Repeated crop disease affecting small farmers with limited access to timely expert guidance',
    description: 'Every monsoon, downy mildew hits our grape vines. By the time an expert visits, the disease has already spread. We spray blind and lose 30–40% of the crop. We need early detection and same-day guidance.',
    people: '420',
  },
  {
    label: 'Clinic Cold Carrier', icon: '🏥', tone: 'peri', domain: 'health',
    title: 'Vaccine cold-box temperature is invisible during village rounds — spoilage found only at the PHC',
    description: 'Our ASHA workers carry vaccines in cold boxes on 6–8 km village rounds. There is no way to know if the temperature stayed safe until the return trip, when spoilage is discovered. We need an affordable temperature log + alert.',
    people: '950',
  },
]

const STEP_KEYS = ['s1', 's2', 's3', 's4'] as const

const URGENCIES: { v: Urgency; label: string }[] = [
  { v: 'low', label: 'Low' }, { v: 'medium', label: 'Medium' }, { v: 'high', label: 'High' }, { v: 'critical', label: 'Critical' },
]

export default function ReportProblem() {
  const currentUser = useStore((s) => s.currentUser)
  const addProblem = useStore((s) => s.addProblem)
  const navigate = useNavigate()
  const t = useT()

  const [step, setStep] = useState(0)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [domain, setDomain] = useState<DomainId>('agri')
  const [location, setLocation] = useState(currentUser?.location === 'India' ? '' : currentUser?.location ?? '')
  const [images, setImages] = useState<string[]>([])
  const [docs, setDocs] = useState<string[]>([])
  const [urgency, setUrgency] = useState<Urgency>('high')
  const [people, setPeople] = useState('200')
  const [attempts, setAttempts] = useState('')
  const [contact, setContact] = useState(currentUser?.email ?? '')
  const [consent, setConsent] = useState(false)
  const [phase, setPhase] = useState<'form' | 'analyzing' | 'done'>('form')
  const [stepIdx, setStepIdx] = useState(0)
  const [newId, setNewId] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<ReturnType<typeof runAiAnalysis> | null>(null)
  const [voiceNote, setVoiceNote] = useState<string | null>(null)

  const applyPreset = (p: typeof PRESETS[number]) => {
    setDomain(p.domain); setTitle(p.title); setDescription(p.description); setPeople(p.people)
    setLocation('Bhor, Pune Rural')
  }
  const addImage = () => setImages((x) => [...x, `field_photo_${x.length + 1}.jpg`])
  const addDoc = () => setDocs((x) => [...x, `supporting_doc_${x.length + 1}.pdf`])

  const canNext = [title.trim() !== '', location.trim() !== '' && people !== '', true, consent][step]

  const submit = () => {
    if (!currentUser) { navigate('/auth'); return }
    const p = addProblem({
      title, description, domain, location: location || 'India',
      urgency, peopleAffected: parseInt(people) || 0,
      existingAttempts: attempts, contact,
      imageTags: images, docs, video: voiceNote ? 'voice_note.webm' : undefined,
    })
    setNewId(p.id)
    setPhase('analyzing')
  }

  useEffect(() => {
    if (phase !== 'analyzing') return
    if (stepIdx < ANALYZE_KEYS.length) {
      const t = setTimeout(() => setStepIdx((i) => i + 1), 750)
      return () => clearTimeout(t)
    }
    const p = useStore.getState().problems.find((x) => x.id === newId)
    if (p) {
      useStore.getState().analyzeProblem(p.id)
      setAnalysis(runAiAnalysis({
        title, description, domain, location: location || 'India', urgency,
        peopleAffected: parseInt(people) || 0, existingAttempts: attempts, contact,
      }))
    }
    const t = setTimeout(() => setPhase('done'), 600)
    return () => clearTimeout(t)
  }, [phase, stepIdx, newId, title, description, domain, location, urgency, people, attempts, contact])

  /* ── analyzing overlay ── */
  if (phase === 'analyzing') {
    return (
      <div className="container-p flex min-h-[70vh] max-w-2xl flex-col items-center justify-center py-16 text-center">
        <div className="grid h-20 w-20 animate-pulse place-items-center rounded-3xl bg-pine-800 text-paper shadow-pop">
          <BrainCircuit size={36} />
        </div>
        <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-pine-900">{t('report.analyzing')}</h1>
        <p className="mt-1 text-sm text-pine-900/55">{t('report.aiWorking')}</p>
        <div className="mt-8 w-full max-w-md space-y-2 text-left">
          {ANALYZE_KEYS.map((s, i) => (
            <div key={s} className={cx('flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition-all',
              i < stepIdx ? 'border-pine-700/20 bg-pine-100 text-pine-800' : i === stepIdx ? 'border-pine-900/15 bg-paper text-ink' : 'border-pine-900/5 bg-pine-900/[0.03] text-pine-900/30')}>
              {i < stepIdx ? <CheckCircle2 size={16} className="text-pine-700" /> : <span className="h-4 w-4 rounded-full border-2 border-current" />}
              {t(s)}
            </div>
          ))}
        </div>
      </div>
    )
  }

  /* ── result ── */
  if (phase === 'done' && analysis) {
    return (
      <div className="container-p max-w-3xl py-10">
        <div className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-pine-800 text-paper"><CheckCircle2 size={28} /></div>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-pine-900">{t('report.done')}</h1>
          <p className="mt-1 text-sm text-pine-900/55">Admins and matched students have been notified. Here's what the AI understood.</p>
        </div>
        <div className="card mt-8 p-6">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-pine-700">
            <BrainCircuit size={14} /> AI Challenge Intelligence
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div><div className="text-[11px] font-bold uppercase text-pine-900/40">Domain</div><div className="mt-0.5 font-extrabold text-pine-900">{analysis.domainLabel}</div></div>
            <div><div className="text-[11px] font-bold uppercase text-pine-900/40">Category</div><div className="mt-0.5 font-extrabold text-pine-900">{analysis.category}</div></div>
            <div><div className="text-[11px] font-bold uppercase text-pine-900/40">Priority</div><div className="mt-0.5 font-extrabold text-rose-700">{analysis.priority}</div></div>
          </div>
          <div className="mt-4"><div className="text-[11px] font-bold uppercase text-pine-900/40">Required skills identified</div><div className="mt-1.5 text-sm font-semibold text-pine-900/75">{analysis.requiredSkills.join(' · ')}</div></div>
          <div className="mt-4 rounded-2xl bg-pine-100 p-4 text-sm leading-relaxed text-pine-900">
            {analysis.recommendation} <b>AI recommends; humans validate.</b>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to={`/problem/${newId}`} className="btn-primary px-5 py-3">View full analysis & matches</Link>
          <Link to={currentUser?.role === 'student' ? '/student' : '/community'} className="btn-secondary px-5 py-3">Go to my dashboard</Link>
        </div>
      </div>
    )
  }

  /* ── wizard ── */
  return (
    <div className="container-p max-w-3xl py-8">
      <span className="chip border border-pine-700/20 bg-pine-100 px-3 py-1.5 text-pine-800">🛡️ {t('report.badge')}</span>
      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-pine-900">{t('report.title')}</h1>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-pine-900/60">
        {t('report.sub')}
      </p>
      <p className="mt-3 flex items-center gap-2 text-sm text-pine-900/60">
        <span className="h-2 w-2 rounded-full bg-pine-500" /> 142 {t('report.mentorsReview')}
      </p>

      {/* demo presets */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-black uppercase tracking-widest text-pine-900/40">{t('report.presets')}</span>
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => applyPreset(p)}
            className={cx('chip px-3 py-2 text-[12px] font-bold transition hover:-translate-y-0.5',
              p.tone === 'pine' && 'bg-pine-800 text-paper',
              p.tone === 'peach' && 'bg-peach-100 text-pine-900',
              p.tone === 'peri' && 'bg-periwinkle text-navy')}
          >
            {p.icon} {p.label}
          </button>
        ))}
      </div>

      {/* wizard card */}
      <div className="card mt-6 p-6 sm:p-7">
        {/* step header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pine-900 text-[13px] font-black text-paper">{step + 1}</span>
            <h2 className="font-display text-xl font-extrabold text-pine-900">{t(STEP_KEYS[step])}</h2>
          </div>
          <span className="text-[12px] font-semibold text-pine-900/45">{t('report.step')} {step + 1} {t('report.of')} {STEP_KEYS.length}</span>
        </div>

        <div className="mt-6">
          {step === 0 && (
            <>
              <div className="flex items-center justify-between gap-2">
                <label className="label mb-0" htmlFor="pdesc">{t('report.describe')}</label>
                <span className="chip bg-pine-100 text-pine-800">{t('report.plainOk')}</span>
              </div>
              <textarea
                id="pdesc" className="input mt-2 min-h-32 text-[15px]"
                value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., During the monsoon, our drip irrigation nozzles get blocked with red soil within 2 days, and manual cleaning takes 4 hours every morning…"
              />
              <button
                type="button" onClick={() => setVoiceNote((v) => (v ? null : `voice_note_${Date.now() % 1000}.webm`))}
                className={cx('mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border py-3.5 text-sm font-bold transition',
                  voiceNote ? 'border-pine-700 bg-pine-100 text-pine-900' : 'border-peach-200 bg-peach-50 text-pine-900 hover:border-peach-300')}
              >
                <Mic size={16} className="text-rose-600" />
                {voiceNote ? t('report.voiceDone') : t('report.voice')}
              </button>
              <div className="mt-4">
                <label className="label" htmlFor="ptitle">{t('report.titleField')}</label>
                <input id="ptitle" className="input" value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Drip nozzles clog every 2 days in monsoon" />
              </div>
            </>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <span className="label">Domain</span>
                  <div className="grid grid-cols-2 gap-2">
                    {([['agri', '🌾', t('dom.agri')], ['health', '🏥', t('dom.health')]] as [DomainId, string, string][]).map(([d, ic, l]) => (
                      <button type="button" key={d} onClick={() => setDomain(d)}
                        className={cx('rounded-2xl border px-3 py-2.5 text-sm font-bold transition',
                          domain === d ? 'border-pine-700 bg-pine-100 text-pine-900 ring-1 ring-pine-700' : 'border-pine-900/15 text-pine-900/60 hover:border-pine-500')}>
                        {ic} {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="ploc">{t('report.location')}</label>
                  <input id="ploc" className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Bhor, Pune Rural" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <span className="label">{t('report.urgency')}</span>
                  <div className="flex gap-2">
                    {URGENCIES.map((u) => (
                      <button type="button" key={u.v} onClick={() => setUrgency(u.v)}
                        className={cx('chip flex-1 justify-center border px-2 py-2', urgency === u.v ? 'border-pine-800 bg-pine-800 text-paper' : 'border-pine-900/15 bg-paper text-pine-900/60')}>
                        {t(`u.${u.v}`)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="label" htmlFor="ppl">{t('report.people')}</label>
                  <input id="ppl" className="input" type="number" min={1} value={people} onChange={(e) => setPeople(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="pcontact">{t('report.contact')}</label>
                <input id="pcontact" className="input" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="+91 …" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <button type="button" onClick={addImage} className="rounded-2xl border border-dashed border-pine-900/25 px-3 py-4 text-sm font-bold text-pine-900/70 hover:border-pine-500 hover:text-pine-800">
                  📷 {t('report.addPhoto')} {images.length > 0 && <span className="chip ml-1 bg-pine-100 text-pine-800">{images.length}</span>}
                </button>
                <button type="button" onClick={addDoc} className="rounded-2xl border border-dashed border-pine-900/25 px-3 py-4 text-sm font-bold text-pine-900/70 hover:border-pine-500 hover:text-pine-800">
                  📄 {t('report.addDoc')} {docs.length > 0 && <span className="chip ml-1 bg-pine-100 text-pine-800">{docs.length}</span>}
                </button>
                {voiceNote && <div className="rounded-2xl border border-pine-700/20 bg-pine-100 px-3 py-4 text-center text-sm font-bold text-pine-900">🎙️ Voice note attached</div>}
              </div>
              {(images.length > 0 || docs.length > 0) && (
                <div className="flex flex-wrap gap-1.5">
                  {images.map((i) => <span key={i} className="chip bg-pine-900/5 text-pine-800">🖼️ {i}</span>)}
                  {docs.map((d) => <span key={d} className="chip bg-pine-900/5 text-pine-800">📄 {d}</span>)}
                </div>
              )}
              <div>
                <label className="label" htmlFor="patt">{t('report.tried')}</label>
                <textarea id="patt" className="input min-h-20" value={attempts} onChange={(e) => setAttempts(e.target.value)}
                  placeholder="Phone calls, local repairs, apps, committees — anything you attempted before this." />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-2xl bg-pine-900/[0.04] p-4">
                <div className="text-[11px] font-black uppercase tracking-widest text-pine-900/40">{t('report.review')}</div>
                <div className="mt-2 text-sm font-extrabold text-pine-900">{title || '(no title yet)'}</div>
                <p className="mt-1 line-clamp-3 text-[13px] text-pine-900/60">{description}</p>
                <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-pine-900/50">
                  <span className="chip bg-paper text-pine-800">{domain === 'agri' ? '🌾 Agriculture' : '🏥 Healthcare'}</span>
                  <span className="chip bg-paper text-pine-800">📍 {location || '—'}</span>
                  <span className="chip bg-paper text-pine-800">🔥 {urgency}</span>
                  <span className="chip bg-paper text-pine-800">👥 {people} affected</span>
                  {voiceNote && <span className="chip bg-paper text-pine-800">🎙️ voice note</span>}
                </div>
              </div>
              <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-pine-900/15 bg-paper p-4">
                <input type="checkbox" className="mt-0.5" checked={consent} onChange={(e) => setConsent(e.target.checked)} />                  <span className="text-xs leading-relaxed text-pine-900/60">{t('report.consent')}</span>
              </label>
              {domain === 'health' && (
                <div className="flex items-start gap-2.5 rounded-2xl border border-periwinkle bg-royal-50 p-4 text-[13px] text-navy">
                  <Info size={16} className="mt-0.5 shrink-0" />
                  <span><b>Healthcare privacy:</b> describe workflows, equipment and systems only — never patient names, IDs or photos.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* footer */}
        <div className="mt-7 flex items-center justify-between gap-3 border-t border-pine-900/10 pt-5">
          <button className="btn-ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>← {t('report.back')}</button>
          <div className="flex items-center gap-1.5">
            {STEP_KEYS.map((_, i) => (
              <span key={i} className={cx('h-2 rounded-full transition-all', i === step ? 'w-6 bg-pine-800' : 'w-2 bg-pine-900/15')} />
            ))}
          </div>
          {step < STEP_KEYS.length - 1 ? (
            <button className="btn-primary" disabled={!canNext} onClick={() => setStep((s) => s + 1)}>{t('report.next')} →</button>
          ) : (
            <button className="btn-primary" disabled={!consent || !title || !description} onClick={submit}>
              {t('report.submit')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
