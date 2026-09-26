import { Link } from 'react-router-dom'
import {
  ArrowRight, BrainCircuit, FlaskConical, HandHeart, LineChart, ShieldCheck,
  TrendingUp, Users2,
} from 'lucide-react'
import { useStore } from '@/data/store'
import { Sparkline } from '@/ui/common'
import { LogoMark } from '@/ui/Logo'
import { LANGS, useT } from '@/i18n'

const JOURNEY: { icon: string; key: string }[] = [
  { icon: '🧑‍🌾', key: 'j.problem' },
  { icon: '🧠', key: 'j.ai' },
  { icon: '🧩', key: 'j.match' },
  { icon: '🤝', key: 'j.collab' },
  { icon: '🛠️', key: 'j.solution' },
  { icon: '✅', key: 'j.validation' },
  { icon: '📈', key: 'j.impact' },
]

export default function Landing() {
  const currentUser = useStore((s) => s.currentUser)
  const problems = useStore((s) => s.problems)
  const projects = useStore((s) => s.projects)
  const lang = useStore((s) => s.lang)
  const setLang = useStore((s) => s.setLang)
  const t = useT()

  return (
    <div className="min-h-screen bg-cream">
      {/* top bar (landing-local, mirrors app nav) */}
      <header className="border-b border-pine-900/10 bg-cream/95 backdrop-blur">
        <div className="container-p flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoMark size={40} className="rounded-xl bg-paper p-0.5 ring-1 ring-pine-900/10" />
            <span>
              <span className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-pine-800">SahayaK</span>
              </span>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-pine-900/50">
                📍 Pune Rural Hub (Bhor / Mulshi) <span className="opacity-50">▾</span>
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center rounded-full bg-pine-900/5 p-0.5 sm:flex" role="group" aria-label="Language">
              {LANGS.map((l) => (
                <button key={l.id} onClick={() => setLang(l.id)} aria-pressed={lang === l.id}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${lang === l.id ? 'bg-pine-900 text-paper' : 'text-pine-800/70 hover:text-pine-900'}`}>
                  {l.label}
                </button>
              ))}
            </div>
            {currentUser
              ? <Link to="/student" className="btn-primary">My Dashboard</Link>
              : <Link to="/auth" className="btn-primary">Sign in</Link>}
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="container-p pb-14 pt-12 sm:pt-16">
        <div className="mx-auto max-w-4xl">
          <span className="chip border border-pine-700/20 bg-pine-100 px-3 py-1.5 text-pine-800">
            ✅ {problems.length * 43 + 4} {t('landing.badge')}
          </span>
          <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-pine-900">{t('landing.h1a')}</span><br />
            <span className="text-pine-700">{t('landing.h1b')}</span><br />
            <span className="text-navy">{t('landing.h1c')}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-pine-900/65">
            {t('landing.sub')}
          </p>

          {/* field coverage card */}
          <div className="card mt-10 p-5 sm:p-6">
            <div className="flex items-center gap-3.5">
              <span className="grid h-12 w-12 place-items-center rounded-2xl border border-pine-900/10 bg-pine-50 text-2xl">🛡️</span>
              <div>
                <div className="text-[11px] font-black uppercase tracking-[0.14em] text-pine-900/45">{t('landing.coverage')}</div>
                <div className="text-xl font-extrabold text-pine-900">42 {t('landing.panchayats')}</div>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-pine-900/[0.04] px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-pine-900/60">{t('landing.prototypes')}</span>
                <span className="flex items-center gap-1.5 text-sm font-extrabold text-pine-700">
                  <TrendingUp size={15} /> +{projects.length * 4 + 6} {t('landing.thisMonth')}
                </span>
              </div>
              <div className="mt-2">
                <Sparkline />
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link to="/report" className="btn-primary justify-center rounded-full py-4 text-base">
              ⊕ {t('landing.cta1')}
            </Link>
            <Link to="/discover" className="btn-royal justify-center rounded-full py-4 text-base">
              ◎ {t('landing.cta2')}
            </Link>
          </div>
          <p className="mt-4 text-center text-sm text-pine-900/50">
            {t('landing.newHere')} <Link to="/knowledge" className="link">{t('landing.explore')}</Link> — {t('landing.or')}{' '}
            <Link to="/auth" className="link">{t('landing.signInAs')}</Link> {t('landing.walk')}
          </p>
        </div>
      </section>

      {/* journey */}
      <section className="border-y border-pine-900/10 bg-paper py-14">
        <div className="container-p">
          <h2 className="text-center font-display text-3xl font-extrabold tracking-tight text-pine-900">
            {t('landing.journeyTitle')}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-pine-900/55">
            {t('landing.journeySub')}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-1 gap-y-4">
            {JOURNEY.map((j, i) => (
              <div key={j.key} className="flex items-center">
                <div className="flex w-24 flex-col items-center gap-1.5 sm:w-28">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl border border-pine-900/10 bg-cream text-xl shadow-card">{j.icon}</span>
                  <span className="text-center text-[11px] font-extrabold leading-tight text-pine-900">{t(j.key)}</span>
                </div>
                {i < JOURNEY.length - 1 && <ArrowRight size={14} className="mb-6 shrink-0 text-pine-900/25" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* focus areas */}
      <section className="container-p py-14">
        <div className="grid gap-4 lg:grid-cols-2">
          {[
            { icon: '🌾', title: t('landing.agri'), to: '/discover', cta: t('landing.cta1') },
            { icon: '🏥', title: t('landing.health'), to: '/discover', cta: t('landing.cta2') },
          ].map((c) => (
            <div key={c.title} className="card p-6 sm:p-7">
              <div className="text-3xl">{c.icon}</div>
              <h3 className="mt-3 font-display text-xl font-extrabold text-pine-900">{c.title}</h3>
              <Link to={c.to} className="link mt-4 inline-flex items-center gap-1 text-sm">{c.cta} <ArrowRight size={13} /></Link>
            </div>
          ))}
        </div>
      </section>

      {/* principles */}
      <section className="border-y border-pine-900/10 bg-pine-900 py-14 text-paper">
        <div className="container-p">
          <h2 className="text-center font-display text-2xl font-extrabold tracking-tight">{t('landing.different')}</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: <BrainCircuit size={19} />, t: 'AI Challenge Intelligence', d: 'Every submission is analyzed for category, priority, duplicates, required expertise and skills.' },
              { icon: <Users2 size={19} />, t: 'Problem → Skills → People', d: 'Teams are complementary by skill, not appearance of diversity. The problem picks the branch mix.' },
              { icon: <FlaskConical size={19} />, t: 'Structured Workspace', d: 'Lifecycle, tasks, milestones, files, chat — plus domain Knowledge Ground communities.' },
              { icon: <ShieldCheck size={19} />, t: 'Expert Validation', d: 'Students build the technology; qualified experts remain responsible for domain validation.' },
              { icon: <HandHeart size={19} />, t: 'Community Testing', d: 'The reporting community field-tests every prototype. Build → Test → Feedback → Improve.' },
              { icon: <LineChart size={19} />, t: 'Real Impact Metrics', d: 'Technical success ≠ social impact. Adoption and satisfaction are tracked against the original problem.' },
            ].map((f) => (
              <div key={f.t} className="rounded-2xl bg-pine-800/60 p-5 ring-1 ring-paper/10">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-paper/10">{f.icon}</div>
                <h3 className="mt-3 font-extrabold">{f.t}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-paper/70">{f.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm font-semibold text-paper/80">
            «Students contribute the technology, research and prototypes — qualified experts validate every domain decision.»
          </p>
        </div>
      </section>

      {/* final CTA */}
      <section className="container-p py-14">
        <div className="card mx-auto max-w-3xl p-8 text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-pine-900">
            A real problem. The right knowledge. The right people.
          </h2>
          <p className="mt-3 text-sm text-pine-900/55">Walk the complete journey in under three minutes — no setup required.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/auth" className="btn-primary px-6 py-3.5 text-[15px]">Start the demo <ArrowRight size={16} /></Link>
            <Link to="/impact" className="btn-secondary px-6 py-3.5 text-[15px]">See live impact</Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-pine-900/10 bg-paper py-6">
        <div className="container-p flex flex-wrap items-center justify-between gap-2 text-[11px] text-pine-900/45">
          <span className="flex items-center gap-1.5 font-semibold text-pine-800"><LogoMark size={18} /> SahayaK — Collaborative Innovation Ecosystem</span>
          <span>Healthcare data protected · Hindi / English ready</span>
        </div>
      </footer>
    </div>
  )
}
