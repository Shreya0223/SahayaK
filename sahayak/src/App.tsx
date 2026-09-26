import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import type { ReactElement } from 'react'
import { Link, NavLink, Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import {
  Award, Bell, ChevronDown, Compass, FilePlus2, Grid3x3, Headset, Home, LayoutDashboard,
  LogOut, MessagesSquare, MapPin, Target, Users, Eye, Layers, Briefcase, Wrench, UserRound,
} from 'lucide-react'
import { useStore, ROLE_HOME, ROLE_LABEL } from '@/data/store'
import { Avatar, cx } from '@/ui/common'
import { LogoMark } from '@/ui/Logo'
import PortfolioModal from '@/ui/PortfolioModal'
import HomeDockHost from '@/ui/HomeDock'
import { LANGS, useT } from '@/i18n'

import Landing from '@/pages/Landing'
import Auth from '@/pages/Auth'
import HomePage from '@/pages/Home'
import Onboarding from '@/pages/Onboarding'
import ReportProblem from '@/pages/ReportProblem'
import ProblemDetail from '@/pages/ProblemDetail'
import Discover from '@/pages/Discover'
import StudentDashboard from '@/pages/StudentDashboard'
import CommunityDashboard from '@/pages/CommunityDashboard'
import ProjectWorkspace from '@/pages/ProjectWorkspace'
import ExpertConsole from '@/pages/ExpertConsole'
import IndustryConsole from '@/pages/IndustryConsole'
import AdminDashboard from '@/pages/AdminDashboard'
import KnowledgeGround from '@/pages/KnowledgeGround'
import MyProjects from '@/pages/MyProjects'
import Teams from '@/pages/Teams'
import Impact from '@/pages/Impact'
import Notifications from '@/pages/Notifications'
import Profile from '@/pages/Profile'
import Blueprints from '@/pages/Blueprints'
import Grants from '@/pages/Grants'
import WorkspaceHub from '@/pages/WorkspaceHub'
import ProblemCommunityPage from '@/pages/ProblemCommunityPage'
import VoiceHelpline from '@/pages/VoiceHelpline'
import AiAdvisor from '@/ui/AiAdvisor'

const NAV = [
  { to: '/', key: 'nav.home', icon: Home },
  { to: '/report', key: 'nav.report', icon: FilePlus2 },
  { to: '/my-projects', key: 'nav.projects', icon: LayoutDashboard },
  { to: '/blueprints', key: 'nav.blueprints', icon: Layers, fallback: 'Blueprints' },
  { to: '/grants', key: 'nav.grants', icon: Briefcase, fallback: 'Grants' },
  { to: '/workspace', key: 'nav.workspace', icon: Wrench, fallback: 'Workspace' },
]

const MORE_LINKS = [
  { to: '/discover', key: 'nav.discover', icon: Compass },
  { to: '/knowledge', key: 'nav.knowledge', icon: MessagesSquare },
  { to: '/helpline', key: 'nav.helpline', icon: Headset, fallback: 'Voice Helpline' },
  { to: '/teams', key: 'nav.teams', icon: Users },
  { to: '/impact', key: 'nav.impact', icon: Target },
]

function TopNav() {
  const currentUser = useStore((s) => s.currentUser)
  const notifications = useStore((s) => s.notifications)
  const markAllRead = useStore((s) => s.markAllRead)
  const markRead = useStore((s) => s.markRead)
  const logout = useStore((s) => s.logout)
  const navigate = useNavigate()
  const location = useLocation()
  const t = useT()
  const lang = useStore((s) => s.lang)
  const setLang = useStore((s) => s.setLang)
  const [notifOpen, setNotifOpen] = useState(false)
  const [roleOpen, setRoleOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const unread = currentUser ? notifications.filter((n) => n.userId === currentUser.id && !n.read).length : 0
  const mine = currentUser ? notifications.filter((n) => n.userId === currentUser.id) : []
  const isMoreRoute = MORE_LINKS.some((l) => l.to === location.pathname) || ['/profile'].includes(location.pathname)

  return (
    <header className="sticky top-0 z-40 border-b border-pine-900/10 bg-cream/95 backdrop-blur">
      {/* row 1: brand, hub, lang, bell, avatar */}
      <div className="container-p flex h-14 items-center gap-3">
        <Link to="/" className="flex items-center gap-2.5">
          <LogoMark size={38} className="rounded-xl bg-paper p-0.5 ring-1 ring-pine-900/10" />
          <span>
            <span className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-pine-800">SahayaK</span>
            </span>
          </span>
        </Link>
        <button className="hidden items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-pine-800 hover:bg-pine-100/70 md:flex">
          <MapPin size={12} /> {t('hub')}
          <ChevronDown size={12} className="opacity-50" />
        </button>

        <div className="ml-auto flex items-center gap-2">
          <AiAdvisor />
          <div className="hidden items-center rounded-full bg-pine-900/5 p-0.5 sm:flex" role="group" aria-label="Language">
            {LANGS.map((l) => (
              <button
                key={l.id}
                onClick={() => setLang(l.id)}
                aria-pressed={lang === l.id}
                className={cx('rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors',
                  lang === l.id ? 'bg-pine-900 text-paper' : 'text-pine-800/70 hover:text-pine-900')}
              >
                {l.label}
              </button>
            ))}
          </div>
          {currentUser && (
            <div className="relative">
              <button className="relative grid h-9 w-9 place-items-center rounded-full hover:bg-pine-100/70" onClick={() => setNotifOpen((v) => !v)} aria-label="Notifications">
                <Bell size={17} />
                {unread > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-600 ring-2 ring-cream" />}
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 top-11 z-40 w-80 animate-fade-up overflow-hidden rounded-2xl border border-pine-900/10 bg-paper shadow-pop sm:w-96">                      <div className="flex items-center justify-between border-b border-pine-900/10 px-4 py-3">
                      <span className="text-sm font-bold">{t('notif.title')}</span>
                      <button className="text-xs font-semibold text-pine-700 hover:underline" onClick={markAllRead}>{t('notif.markAll')}</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {mine.length === 0 && <div className="px-4 py-8 text-center text-sm text-pine-900/40">{t('notif.none')}</div>}
                      {mine.slice(0, 12).map((n) => (
                        <button
                          key={n.id}
                          className={cx('flex w-full items-start gap-3 border-b border-pine-900/5 px-4 py-3 text-left hover:bg-pine-50', !n.read && 'bg-pine-50/70')}
                          onClick={() => { markRead(n.id); setNotifOpen(false); if (n.link) navigate(n.link) }}
                        >
                          <span className={cx('mt-1.5 h-2 w-2 shrink-0 rounded-full', n.read ? 'bg-pine-900/20' : 'bg-pine-700')} />
                          <span className="min-w-0 flex-1">
                            <span className="block text-[13px] font-medium leading-snug text-ink">{n.text}</span>
                            <span className="mt-0.5 block text-[11px] text-pine-900/40">{n.at}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                    <Link to="/notifications" onClick={() => setNotifOpen(false)} className="block bg-pine-50 px-4 py-2.5 text-center text-xs font-bold text-pine-800 hover:bg-pine-100">
                      {t('notif.viewAll')}
                    </Link>
                  </div>
                </>
              )}
            </div>
          )}
          {currentUser ? (
            <div className="relative">
              <button onClick={() => setRoleOpen((v) => !v)} className="flex items-center gap-2 rounded-full hover:opacity-90" aria-label="Account / view as">
                <span className="relative">
                  <Avatar user={currentUser} size={34} />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-pine-600 ring-2 ring-cream" />
                </span>
              </button>
              {roleOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setRoleOpen(false)} />
                  <div className="absolute right-0 top-11 z-40 w-72 animate-fade-up overflow-hidden rounded-2xl border border-pine-900/10 bg-paper shadow-pop">
                    <div className="border-b border-pine-900/10 px-4 py-3.5">
                      <div className="text-sm font-bold text-ink">{currentUser.name}</div>
                      <div className="mt-0.5 text-[11px] leading-snug text-pine-900/50">
                        {currentUser.institution ?? currentUser.location}
                      </div>
                      <span className="chip mt-2 inline-flex bg-pine-100 text-[10px] font-bold uppercase tracking-wide text-pine-800">
                        {ROLE_LABEL[currentUser.role]} account active
                      </span>
                    </div>
                    <div className="border-b border-pine-900/10 p-2">
                      <Link to="/profile" onClick={() => setRoleOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-semibold text-pine-900/80 hover:bg-pine-50">
                        <UserRound size={15} className="text-pine-700" /> {t('profile.settings')}
                      </Link>
                      <button
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-semibold text-pine-900/80 hover:bg-pine-50"
                        onClick={() => {
                          setRoleOpen(false)
                          window.dispatchEvent(new CustomEvent('sahayak:portfolio', { detail: currentUser.id }))
                        }}
                      >
                        <Award size={15} className="text-pine-700" /> {t('portfolio.entry')}
                      </button>
                    </div>
                    <div className="p-2">
                      <button
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-bold text-rose-700 hover:bg-rose-50"
                        onClick={() => { logout(); setRoleOpen(false); navigate('/') }}
                      >
                        <LogOut size={15} /> {t('auth.signout')}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link to="/auth" className="btn-primary px-4 py-1.5 text-[13px]">Sign in</Link>
          )}
        </div>
      </div>

      {/* row 2: pill nav + More Pages */}
      <nav className="border-t border-pine-900/5 bg-cream/80">
        <div className="container-p flex items-center gap-1 py-1.5">
          <div className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
            {NAV.map(({ to, key, icon: Icon, fallback }) => (
              <NavLink
                key={to} to={to} end={to === '/'}
                className={({ isActive }) =>
                  cx('flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors',
                    isActive ? 'bg-pine-800 text-paper shadow-card' : 'text-pine-900/70 hover:bg-pine-100/70')}
              >
                <Icon size={14} className="shrink-0" />
                {t(key) === key ? fallback : t(key)}
              </NavLink>
            ))}
          </div>
          <div className="relative shrink-0">
            <button
              onClick={() => setMoreOpen((v) => !v)}
              className={cx('flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-semibold transition-colors',
                moreOpen || isMoreRoute ? 'bg-pine-800 text-paper shadow-card' : 'text-pine-900/70 hover:bg-pine-100/70')}
            >
              <Grid3x3 size={14} /> {t('nav.more')} <ChevronDown size={13} className={cx('transition-transform', moreOpen && 'rotate-180')} />
            </button>
            {moreOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setMoreOpen(false)} />
                <div className="absolute right-0 top-11 z-40 w-56 animate-fade-up overflow-hidden rounded-2xl border border-pine-900/10 bg-paper shadow-pop">
                  {MORE_LINKS.map(({ to, key, icon: Icon }) => (
                    <NavLink
                      key={to} to={to}
                      className={({ isActive }) =>
                        cx('flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold',
                          isActive ? 'bg-pine-50 text-pine-900' : 'text-pine-900/70 hover:bg-pine-50')}
                      >
                        <Icon size={15} className="text-pine-700" /> {t(key)}
                      </NavLink>
                    ))}
                  {currentUser && (
                    <>
                      <div className="mx-3 border-t border-pine-900/10" />
                      <NavLink to={ROLE_HOME[currentUser.role]} className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold text-pine-900/70 hover:bg-pine-50">
                        <LayoutDashboard size={15} className="text-pine-700" /> {t('nav.dashboard')}
                      </NavLink>
                      <NavLink to="/profile" className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold text-pine-900/70 hover:bg-pine-50">
                        <Eye size={15} className="text-pine-700" /> {t('profile.settings')}
                      </NavLink>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

    </header>
  )
}

function Shell() {
  const toast = useStore((s) => s.toast)
  const setToast = useStore((s) => s.setToast)
  const t = useT()
  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <TopNav />
      <main className="flex-1">
        <HomeDockHost>
          <Outlet />
        </HomeDockHost>
      </main>
      <footer className="border-t border-pine-900/10 bg-paper py-5">
        <div className="container-p flex flex-wrap items-center justify-between gap-2 text-[11px] text-pine-900/45">
          <span className="flex items-center gap-1.5 font-semibold text-pine-800"><LogoMark size={16} /> SahayaK · {t('hub')}</span>
          <span>{t('foot.privacy')}</span>
        </div>
      </footer>
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-[70] w-max max-w-[92vw] -translate-x-1/2 animate-fade-up">
          <div className="flex items-center gap-3 rounded-full bg-pine-900 px-4 py-3 text-sm font-semibold text-paper shadow-pop">
            <span>{toast}</span>
            <button onClick={() => setToast(null)} className="text-paper/70 hover:text-paper" aria-label="Dismiss"><ChevronDown size={14} className="rotate-180" /></button>
          </div>
        </div>
      )}
    </div>
  )
}

/* Signed-in users get the in-app home; visitors see the marketing landing. */
function HomeOrLanding() {
  const currentUser = useStore((s) => s.currentUser)
  return currentUser ? <HomePage /> : <Landing />
}

function RequireAuth({ children }: { children: ReactElement }) {
  const currentUser = useStore((s) => s.currentUser)
  if (!currentUser) return <Navigate to="/auth" replace />
  return children
}

function RequireRole({ roles, children }: { roles: string[]; children: ReactElement }) {
  const currentUser = useStore((s) => s.currentUser)
  if (!currentUser) return <Navigate to="/auth" replace />
  if (!roles.includes(currentUser.role)) return <Navigate to={ROLE_HOME[currentUser.role]} replace />
  return children
}

export default function App() {
  const [portfolioUser, setPortfolioUser] = useState<string | null>(null)
  // Account menu requests the portfolio through a custom event so the modal
  // lives above every route, including the landing and auth pages.
  useEffect(() => {
    const open = (e: Event) => setPortfolioUser((e as CustomEvent<string>).detail)
    window.addEventListener('sahayak:portfolio', open)
    return () => window.removeEventListener('sahayak:portfolio', open)
  }, [])
  return (
    <>
      {portfolioUser && <PortfolioModal userId={portfolioUser} onClose={() => setPortfolioUser(null)} />}
      <Routes>
        <Route path="/" element={<HomeOrLanding />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route element={<Shell />}>
          <Route path="/onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />
          <Route path="/report" element={<ReportProblem />} />
          <Route path="/problem/:id" element={<ProblemDetail />} />
          <Route path="/community/:id" element={<ProblemCommunityPage />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/project/:id" element={<ProjectWorkspace />} />
          <Route path="/knowledge" element={<KnowledgeGround />} />
          <Route path="/helpline" element={<VoiceHelpline />} />
          <Route path="/my-projects" element={<RequireAuth><MyProjects /></RequireAuth>} />
          <Route path="/teams" element={<RequireAuth><Teams /></RequireAuth>} />
          <Route path="/impact" element={<Impact />} />
          <Route path="/blueprints" element={<Blueprints />} />
          <Route path="/grants" element={<Grants />} />
          <Route path="/workspace" element={<RequireAuth><WorkspaceHub /></RequireAuth>} />
          <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/student" element={<RequireRole roles={['student']}><StudentDashboard /></RequireRole>} />
          <Route path="/community" element={<RequireRole roles={['citizen', 'farmer', 'health_worker']}><CommunityDashboard /></RequireRole>} />
          <Route path="/review" element={<RequireRole roles={['faculty', 'admin']}><ExpertConsole /></RequireRole>} />
          <Route path="/industry" element={<RequireRole roles={['industry']}><IndustryConsole /></RequireRole>} />
          <Route path="/admin" element={<RequireRole roles={['admin']}><AdminDashboard /></RequireRole>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <ToastHost />
    </>
  )
}

function ToastHost() {
  const toast = useStore((s) => s.toast)
  const setToast = useStore((s) => s.setToast)
  if (!toast) return null
  return (
    <div className="fixed bottom-5 left-1/2 z-[70] w-max max-w-[92vw] -translate-x-1/2 animate-fade-up">
      <div className="flex items-center gap-3 rounded-full bg-pine-900 px-4 py-3 text-sm font-semibold text-paper shadow-pop">
        <span>{toast}</span>
        <button onClick={() => setToast(null)} className="text-paper/70 hover:text-paper" aria-label="Dismiss">✕</button>
      </div>
    </div>
  )
}
