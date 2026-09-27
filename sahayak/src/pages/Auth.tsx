import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check, Lock, MailCheck, ShieldCheck } from 'lucide-react'
import { useStore, ROLE_LABEL, ROLE_HOME } from '@/data/store'
import { supabase } from '@/lib/supabase'
import { cx } from '@/ui/common'
import { LogoMark } from '@/ui/Logo'
import type { Role } from '@/data/types'

type Mode = 'login' | 'register' | 'forgot'
type VerifyStep =
  | { kind: 'none' }
  | { kind: 'awaiting'; email: string; name: string; role: Role; code: string; expiresAt: number; via: VerifySender; real: boolean }
  | { kind: 'done' }
type VerifySender = 'login' | 'register'

/* Seeded demo accounts have no real inbox — they keep the on-screen demo-inbox
 * code. Every other address gets a REAL 6-digit code emailed via Supabase Auth. */
const SUPABASE_DEMO_EMAILS = new Set([
  'ramesh@example.in',
  'kavita@example.gov.in',
  'maitreyee@example.edu',
  'sunanda@example.edu',
  'neeraj@agrisense.example',
  'admin@sahayak.org',
])
type GooglePicker = { open: boolean }

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

/* Google accounts the mock OAuth picker offers (all seeded demo users). */
const GOOGLE_ACCOUNTS = [
  { email: 'ramesh@example.in', name: 'Ramesh Patil', avatar: '🧑‍🌾', role: 'farmer' as Role, label: 'Farmer account' },
  { email: 'maitreyee@example.edu', name: 'Maitreyee Joshi', avatar: '👩‍💻', role: 'student' as Role, label: 'Student · BIT Mesra' },
  { email: 'kavita@example.gov.in', name: 'Dr. Kavita Rao', avatar: '👩‍⚕️', role: 'health_worker' as Role, label: 'Health worker · Dumka PHC' },
  { email: 'sunanda@example.edu', name: 'Dr. Sunanda Mane', avatar: '👩‍🏫', role: 'faculty' as Role, label: 'Expert · Faculty' },
  { email: 'admin@sahayak.org', name: 'Dr. Meera Iyer', avatar: '🏛️', role: 'admin' as Role, label: 'Admin · Govt' },
]

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
  const [googlePicker, setGooglePicker] = useState<GooglePicker>({ open: false })
  const [sending, setSending] = useState(false)
  const [checking, setChecking] = useState(false)
  const [linkNotice, setLinkNotice] = useState('')
  const login = useStore((s) => s.login)
  const register = useStore((s) => s.register)
  const navigate = useNavigate()
  const location = useLocation()

  /* Supabase email links land back on /auth with a status hash. Translate it into
     a friendly banner so link-based returns are never a dead end. */
  useEffect(() => {
    const hash = window.location.hash
    if (!hash || hash.length < 2) return
    const p = new URLSearchParams(hash.slice(1))
    const err = p.get('error_description') || p.get('error')
    if (err) {
      setLinkNotice(/expired|invalid/i.test(err)
        ? 'That email link has expired or was already used — request a new code below.'
        : `Email link problem: ${err}`)
    } else if (p.get('access_token') || p.get('message')) {
      setLinkNotice('Email confirmed via link ✓ — continue below.')
    }
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }, [])

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

  const startVerification = async (via: VerifySender, emailOverride?: string) => {
    const em = (emailOverride ?? email).trim().toLowerCase()
    if (!em || !em.includes('@')) { setCodeError('Enter a valid email to verify.'); return }
    setCodeError('')
    setCodeInput('')
    if (SUPABASE_DEMO_EMAILS.has(em)) {
      setVerify({ kind: 'awaiting', email: em, name: name.trim(), role, code: makeCode(em), expiresAt: Date.now() + CODE_TTL_MS, via, real: false })
      return
    }
    /* Real verification — Supabase Auth emails a 6-digit OTP to the user's inbox. */
    setVerify({ kind: 'awaiting', email: em, name: name.trim(), role, code: '', expiresAt: Date.now() + CODE_TTL_MS, via, real: true })
    setSending(true)
    const { error } = await supabase.auth.signInWithOtp({ email: em, options: { shouldCreateUser: true } })
    setSending(false)
    if (error) {
      setVerify({ kind: 'none' })
      setCodeError(`Could not send the verification email: ${error.message}`)
    }
  }

  const finishVerification = async () => {
    if (verify.kind !== 'awaiting') return
    const submitted = codeInput.replace(/\D/g, '')
    if (Date.now() > verify.expiresAt) { setCodeError('Code expired — resend a new one.'); return }
    if (verify.real) {
      setChecking(true)
      const { error } = await supabase.auth.verifyOtp({ email: verify.email, token: submitted, type: 'email' })
      setChecking(false)
      if (error) { setCodeError(error.message || 'Incorrect or expired code. Check your inbox and try again.'); return }
    } else if (submitted !== verify.code) {
      setCodeError('Incorrect code. Check the 6 digits and try again.')
      return
    }
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

  const resendCode = async () => {
    if (verify.kind !== 'awaiting') return
    setCodeInput('')
    setCodeError('')
    if (verify.real) {
      setSending(true)
      const { error } = await supabase.auth.signInWithOtp({ email: verify.email, options: { shouldCreateUser: true } })
      setSending(false)
      if (error) { setCodeError(`Could not resend: ${error.message}`); return }
    }
    setVerify({ ...verify, code: verify.real ? '' : makeCode(verify.email), expiresAt: Date.now() + CODE_TTL_MS })
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

  /* ── Mock Google OAuth: pick an account → session created as Google-verified. ── */
  const handleGooglePick = (acc: (typeof GOOGLE_ACCOUNTS)[number]) => {
    const u = login(acc.email, acc.name)
    if (u) {
      useStore.setState((s) => ({
        currentUser: s.currentUser ? { ...s.currentUser, emailVerified: true, provider: 'google' } : s.currentUser,
        users: s.users.map((x) => (x.id === u.id ? { ...x, emailVerified: true, provider: 'google' as const } : x)),
      }))
      setGooglePicker({ open: false })
      go()
    }
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
          <div className="mt-8 space-y-3.5 text-sm text-pine-100/90">
            {['Turn local challenges into meaningful solutions',
              'Connect with the right experts, universities & organizations',
              'Collaborate, build and validate solutions that create real impact'].map((t) => (
              <div key={t} className="flex items-start gap-2.5">
                <Check size={15} className="mt-0.5 shrink-0 text-pine-400" /> {t}
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

          {linkNotice && (
            <div className="mb-4 flex items-start gap-2.5 rounded-2xl border border-pine-700/25 bg-pine-100 p-4 text-[13px] leading-relaxed text-pine-900">
              <MailCheck size={15} className="mt-0.5 shrink-0" />
              <span className="flex-1">{linkNotice}</span>
              <button onClick={() => setLinkNotice('')} className="text-pine-900/40 hover:text-ink" aria-label="Dismiss">✕</button>
            </div>
          )}

          {verify.kind === 'awaiting' ? (
            <div className="mt-2">
              <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-pine-100 text-pine-800 ring-1 ring-pine-700/20">
                <MailCheck size={26} />
              </span>
              <h2 className="text-center text-2xl font-extrabold tracking-tight text-ink">Verify your email</h2>
              <p className="mt-1 text-center text-sm text-pine-900/55">
                {verify.real
                  ? <>We emailed a 6-digit code to <b className="text-pine-900">{verify.email}</b>. Check your inbox (and spam) and enter it below.</>
                  : <>We sent a 6-digit code to <b className="text-pine-900">{verify.email}</b>. Enter it below to continue.</>}
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
                <button type="submit" className="btn-primary w-full py-3" disabled={codeInput.length !== 6 || checking || sending}>
                  {checking ? 'Verifying…' : sending ? 'Sending…' : 'Verify & continue'} <ArrowRight size={15} />
                </button>
              </form>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-pine-900/45">
                  {Math.max(0, Math.ceil((verify.expiresAt - now) / 1000))}s remaining
                </span>
                <button className="font-semibold text-pine-700 hover:underline" onClick={resendCode} disabled={sending}>{sending ? 'Sending…' : 'Resend code'}</button>
              </div>
              {verify.real ? (
                <div className="mt-4 rounded-2xl border border-dashed border-pine-700/40 bg-pine-50/60 p-3.5 text-[12px] leading-relaxed text-pine-900/65">
                  <b className="text-pine-800">Real email verification:</b> the code was sent to your actual inbox —
                  it expires in a few minutes. Didn't arrive? Check spam, or use <b>Resend code</b>.
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-pine-700/40 bg-pine-50/60 p-3.5 text-[12px] leading-relaxed text-pine-900/65">
                  <b className="text-pine-800">Demo inbox:</b> your code is{' '}
                  <span className="select-all font-extrabold tracking-widest text-pine-900">{verify.code}</span>
                  {' '}(demo account — no real email is sent).
                </div>
              )}
              <div className="mt-3 text-center text-xs">
                <button className="font-semibold text-pine-700 hover:underline" onClick={() => { setVerify({ kind: 'none' }); setCodeError('') }}>← Use a different email</button>
              </div>
            </div>
          ) : (
          <>

          {/* Google sign-in */}
          {mode !== 'forgot' && (
            <button
              onClick={() => setGooglePicker({ open: true })}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-xl border border-pine-900/15 bg-paper px-4 py-3 text-sm font-bold text-ink shadow-sm transition hover:bg-pine-50"
            >
              <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
              Continue with Google
            </button>
          )}

          {/* mock Google account picker */}
          {googlePicker.open && (
            <div className="fixed inset-0 z-[90] grid place-items-center bg-pine-900/45 p-4 backdrop-blur-sm" onClick={() => setGooglePicker({ open: false })}>
              <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="text-center">
                  <svg className="mx-auto" width="26" height="26" viewBox="0 0 48 48" aria-hidden>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                  <h3 className="mt-3 text-lg font-extrabold text-ink">Choose an account</h3>
                  <p className="text-xs text-pine-900/50">to continue to SahayaK</p>
                </div>
                <div className="mt-4 space-y-1">
                  {GOOGLE_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.email}
                      onClick={() => handleGooglePick(acc)}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-pine-50"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pine-100 text-lg ring-1 ring-pine-900/10">{acc.avatar}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-bold text-ink">{acc.name}</span>
                        <span className="block truncate text-xs text-pine-900/50">{acc.email}</span>
                      </span>
                      <span className="chip shrink-0 bg-pine-900/5 text-[10px] text-pine-900/60">{acc.label}</span>
                    </button>
                  ))}
                </div>
                <p className="mt-4 border-t border-pine-900/10 pt-3 text-center text-[11px] leading-relaxed text-pine-900/45">
                  Demo OAuth — accounts are seeded demo users, no real Google data is accessed.
                </p>
              </div>
            </div>
          )}

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-pine-900/10" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-pine-900/40">or use email</span>
            <span className="h-px flex-1 bg-pine-900/10" />
          </div>

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
                  {codeError && <p className="mt-1.5 text-xs font-semibold text-rose-700">{codeError}</p>}
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
                  {codeError && <p className="mt-1.5 text-xs font-semibold text-rose-700">{codeError}</p>}
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
