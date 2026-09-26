import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Lock, MailCheck, ShieldCheck } from 'lucide-react'
import { useStore, ROLE_LABEL, ROLE_HOME } from '@/data/store'
import { cx } from '@/ui/common'
import { LogoMark } from '@/ui/Logo'
import type { Role } from '@/data/types'

type Mode = 'login' | 'register' | 'forgot'
type VerifyStep =
  | { kind: 'none' }
  | { kind: 'awaiting'; email: string; name: string; role: Role; code: string; expiresAt: number; via: 'login' | 'register' }
  | { kind: 'done' }

/* Deterministic 6-digit code so the demo is repeatable (shown on-screen for judges). */
const makeCode = (email: string) => {
  let h = 0
  for (const c of email.toLowerCase()) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return String(100000 + (h % 900000))
}
const CODE_TTL_MS = 5 * 60 * 1000

const DEMO_ACCOUNTS: { role: Role; label: string; icon: string; email: string }[] = [
  { role: 'farmer', label: 'Farmer', icon: '🧑‍🌾', email: 'ramesh@example.in' },
  { role: 'health_worker', label: 'Health Worker', icon: '👩‍⚕️', email: 'kavita@example.gov.in' },
  { role: 'student', label: 'Student', icon: '👩‍💻', email: 'maitreyee@example.edu' },
  { role: 'faculty', label: 'Expert / Faculty', icon: '👩‍🏫', email: 'sunanda@example.edu' },
  { role: 'industry', label: 'Industry (optional)', icon: '🧑‍💼', email: 'neeraj@agrisense.example' },
  { role: 'admin', label: 'Admin / Govt', icon: '🏛️', email: 'admin@sahayak.org' },
]

const ROLES_FOR_REGISTER: Role[] = ['citizen', 'farmer', 'health_worker', 'student', 'faculty', 'industry']

export default function Auth() {
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<Role>('student')
  const [sent, setSent] = useState(false)
  const [lockedRole, setLockedRole] = useState<Role | null>(null)
  const [verify, setVerify] = useState<VerifyStep>({ kind: 'none' })
  const [codeInput, setCodeInput] = useState('')
  const [codeError, setCodeError] = useState('')
  const [now, setNow] = useState(Date.now())
  const timerRef = useRef<number | null>(null)
  const login = useStore((s) => s.login)
  const register = useStore((s) => s.register)
  const navigate = useNavigate()
  const location = useLocation()

  /* A role requested from the VIEW AS strip must be confirmed here — the session
     never switches without an explicit sign-in for that role. */
  useEffect(() => {
    const state = (location.state ?? {}) as { viewAs?: Role }
    if (state.viewAs) {
      setLockedRole(state.viewAs)
      setMode('login')
    }
  }, [location.state])

  /* countdown ticker while a code is pending */
  useEffect(() => {
    if (verify.kind !== 'awaiting') return
    timerRef.current = window.setInterval(() => setNow(Date.now()), 1000)
    return () => { if (timerRef.current) window.clearInterval(timerRef.current) }
  }, [verify.kind])

  const startVerification = (via: 'login' | 'register', emailOverride?: string) => {
    const em = (emailOverride ?? email).trim().toLowerCase()
    if (!em || !em.includes('@')) { setCodeError('Enter a valid email to verify.'); return }
    setCodeError('')
    setCodeInput('')
    setVerify({ kind: 'awaiting', email: em, name: name.trim(), role, code: makeCode(em), expiresAt: Date.now() + CODE_TTL_MS, via })
  }

  const finishVerification = () => {
    if (verify.kind !== 'awaiting') return
    const submitted = codeInput.replace(/\D/g, '')
    if (Date.now() > verify.expiresAt) { setCodeError('Code expired — resend a new one.'); return }
    if (submitted !== verify.code) { setCodeError('Incorrect code. Check the 6 digits and try again.'); return }
    const v = verify
    setVerify({ kind: 'done' })
    if (v.via === 'login') {
      const u = login(v.email, v.name)
      if (u) go()
    } else {
      register(v.name || 'New User', v.role, v.email)
      go()
    }
  }

  const resendCode = () => {
    if (verify.kind !== 'awaiting') return
    setVerify({ ...verify, code: makeCode(verify.email), expiresAt: Date.now() + CODE_TTL_MS })
    setCodeInput('')
    setCodeError('')
  }

  const go = () => {
    const u = useStore.getState().currentUser
    if (!u || !u.onboarded) navigate('/onboarding')
    else navigate(ROLE_HOME[u.role])
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const u = useStore.getState().users.find((x) => x.email?.toLowerCase() === email.trim().toLowerCase())
    if (!u) { setCodeError('No account found for this email. Try a demo account below.'); return }
    startVerification('login')
  }
  const handleDemo = (r: Role) => {
    /* If arriving via "view as X", only that role's account unlocks the session. */
    if (lockedRole && r !== lockedRole) return
    /* Demo accounts verify too — one extra click, code shown in the demo inbox. */
    const acc = DEMO_ACCOUNTS.find((d) => d.role === r)
    startVerification('login', acc?.email)
  }
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setCodeError('Please enter your full name.'); return }
    startVerification('register')
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* left brand panel */}
      <div className="relative hidden overflow-hidden bg-pine-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0 opacity-25" aria-hidden>
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-pine-800 blur-3xl" />
          <div className="absolute -bottom-24 -left-10 h-80 w-80 rounded-full bg-navy blur-3xl" />
        </div>
        <Link to="/" className="relative flex items-center gap-2.5">
          <LogoMark size={40} className="rounded-xl bg-paper p-0.5 ring-1 ring-paper/20" />
          <span className="text-lg font-extrabold tracking-tight">SahayaK</span>
        </Link>
        <div className="relative max-w-md">
          <h1 className="text-3xl font-black leading-snug tracking-tight">
            A real problem. The right knowledge. The right people. A validated solution.
          </h1>
          <div className="mt-8 space-y-3 text-sm text-pine-900/30">
            {['AI understands each problem and identifies the skills required',
              'Multidisciplinary student teams build with expert mentors',
              'Communities field-test and validate every solution',
              'Impact is measured against the original problem'].map((t) => (
              <div key={t} className="flex items-center gap-2.5">
                <Check size={15} className="shrink-0 text-pine-400" /> {t}
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex items-center gap-2 text-xs text-pine-900/45">
          <ShieldCheck size={14} className="text-pine-400" /> Role-based access · Healthcare data stays protected
        </div>
      </div>

      {/* right form panel */}
      <div className="flex flex-col justify-center px-5 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto w-full max-w-md">
          <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-pine-900/55 hover:text-ink lg:hidden">
            <ArrowLeft size={14} /> Back to home
          </Link>

          {verify.kind === 'awaiting' ? (
            <div className="mt-2">
              <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-pine-100 text-pine-800 ring-1 ring-pine-700/20">
                <MailCheck size={26} />
              </span>
              <h2 className="text-center text-2xl font-extrabold tracking-tight text-ink">Verify your email</h2>
              <p className="mt-1 text-center text-sm text-pine-900/55">
                We sent a 6-digit code to <b className="text-pine-900">{verify.email}</b>. Enter it below to continue.
              </p>
              <form
                className="mt-6 space-y-4"
                onSubmit={(e) => { e.preventDefault(); finishVerification() }}
              >
                <div>
                  <label className="label" htmlFor="code">Verification code</label>
                  <input
                    id="code" className="input text-center text-lg font-extrabold tracking-[0.45em]" inputMode="numeric"
                    placeholder="······" maxLength={6} value={codeInput} autoFocus
                    onChange={(e) => { setCodeInput(e.target.value.replace(/\D/g, '')); setCodeError('') }}
                  />
                  {codeError && <p className="mt-1.5 text-xs font-semibold text-rose-700">{codeError}</p>}
                </div>
                <button type="submit" className="btn-primary w-full py-3" disabled={codeInput.length !== 6}>
                  Verify & continue <ArrowRight size={15} />
                </button>
              </form>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-pine-900/45">
                  {Math.max(0, Math.ceil((verify.expiresAt - now) / 1000))}s remaining
                </span>
                <button className="font-semibold text-pine-700 hover:underline" onClick={resendCode}>Resend code</button>
              </div>
              <div className="mt-4 rounded-2xl border border-dashed border-pine-700/40 bg-pine-50/60 p-3.5 text-[12px] leading-relaxed text-pine-900/65">
                <b className="text-pine-800">Demo inbox:</b> your code is{' '}
                <span className="select-all font-extrabold tracking-widest text-pine-900">{verify.code}</span>
                {' '}(no real email is sent in this prototype).
              </div>
              <div className="mt-3 text-center text-xs">
                <button className="font-semibold text-pine-700 hover:underline" onClick={() => { setVerify({ kind: 'none' }); setCodeError('') }}>← Use a different email</button>
              </div>
            </div>
          ) : (
          <>

          {mode === 'login' && (
            <>
              <h2 className="text-2xl font-extrabold tracking-tight text-ink">Welcome back</h2>
              <p className="mt-1 text-sm text-pine-900/55">Sign in to continue your journey from problem to impact.</p>
              {lockedRole && (
                <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-pine-700/25 bg-pine-100 p-4 text-[13px] leading-relaxed text-pine-900">
                  <Lock size={15} className="mt-0.5 shrink-0" />
                  <span>
                    Role switching requires sign-in. Authenticate with a <b>{ROLE_LABEL[lockedRole]}</b> account
                    to continue as that role.
                  </span>
                </div>
              )}
              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                <div>
                  <label className="label" htmlFor="email">Email</label>
                  <input id="email" className="input" type="email" placeholder="you@example.in" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="label" htmlFor="pw">Password</label>
                  <input id="pw" className="input" type="password" placeholder="••••••••" defaultValue="demo-access" />
                </div>
                <button type="submit" className="btn-primary w-full py-3">Sign in <ArrowRight size={15} /></button>
              </form>
              <div className="mt-3 flex justify-between text-xs">
                <button className="font-semibold text-pine-700 hover:underline" onClick={() => setMode('forgot')}>Forgot password?</button>
                <button className="font-semibold text-pine-700 hover:underline" onClick={() => setMode('register')}>Create an account</button>
              </div>
            </>
          )}

          {mode === 'register' && (
            <>
              <h2 className="text-2xl font-extrabold tracking-tight text-ink">Create your account</h2>
              <p className="mt-1 text-sm text-pine-900/55">Choose how you want to participate — a short onboarding follows.</p>
              <form onSubmit={handleRegister} className="mt-6 space-y-4">
                <div>
                  <label className="label" htmlFor="rname">Full name</label>
                  <input id="rname" className="input" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>
                <div>
                  <label className="label" htmlFor="remail">Email</label>
                  <input id="remail" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.in" />
                </div>
                <div>
                  <span className="label">I am a…</span>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES_FOR_REGISTER.map((r) => (
                      <button
                        type="button" key={r} onClick={() => setRole(r)}
                        className={cx('rounded-xl border px-3 py-2.5 text-left text-[13px] font-semibold transition',
                          role === r ? 'border-pine-700 bg-pine-50 text-pine-800 ring-1 ring-pine-700' : 'border-pine-900/10 bg-paper text-pine-900/70 hover:border-pine-900/20')}
                      >
                        {ROLE_LABEL[r]}
                      </button>
                    ))}
                  </div>
                </div>
                <button type="submit" className="btn-primary w-full py-3">Continue <ArrowRight size={15} /></button>
              </form>
              <div className="mt-3 text-xs">
                <button className="font-semibold text-pine-700 hover:underline" onClick={() => setMode('login')}>Already have an account? Sign in</button>
              </div>
            </>
          )}

          {mode === 'forgot' && (
            <>
              <h2 className="text-2xl font-extrabold tracking-tight text-ink">Reset password</h2>
              <p className="mt-1 text-sm text-pine-900/55">Enter your email and we'll send a reset link.</p>
              {sent ? (
                <div className="card mt-6 p-5 text-sm text-pine-900/70">
                  📬 If an account exists for <b>{email || 'your email'}</b>, a reset link is on its way. (Demo — no email is actually sent.)
                </div>
              ) : (
                <form className="mt-6 space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
                  <div>
                    <label className="label" htmlFor="femail">Email</label>
                    <input id="femail" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.in" />
                  </div>
                  <button className="btn-primary w-full py-3">Send reset link</button>
                </form>
              )}
              <div className="mt-3 text-xs">
                <button className="font-semibold text-pine-700 hover:underline" onClick={() => setMode('login')}>← Back to sign in</button>
              </div>
            </>
          )}

          </>
          )}

          {/* demo accounts */}
          <div className="mt-8 rounded-2xl border border-dashed border-pine-700/40 bg-pine-50/60 p-4">
            <div className="text-xs font-bold uppercase tracking-wide text-pine-800">Demo — one-click sign in</div>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {DEMO_ACCOUNTS.map((d) => (
                <button
                  key={d.role} onClick={() => handleDemo(d.role)}
                  className="rounded-xl border border-pine-700/20 bg-paper px-2 py-2.5 text-center transition hover:-translate-y-0.5 hover:shadow-card"
                >
                  <span className="block text-xl">{d.icon}</span>
                  <span className="mt-0.5 block text-[11px] font-bold text-ink">{d.label}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-pine-900/55">
              Each account demonstrates its role's permissions: farmers report & validate, students build, experts review,
              admins monitor. No real credentials or personal data are used.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
