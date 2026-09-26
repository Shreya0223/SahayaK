import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  AiAnalysis, CommunityPostKind, DomainId, ExpertReview, Feedback, KgPost, KgReply,
  Notification, Problem, ProblemCommunity, Project, Role, Task, TaskStatus, User, Lang,
} from './types'
import {
  CHAT, FEEDBACKS, FILES, KG_POSTS, KG_REPLIES, MENTOR_NOTES, MILESTONES,
  NOTIFICATIONS, PROBLEMS, PROBLEM_COMMUNITIES, PROJECTS, REVIEWS, TASKS, USERS,
} from './seed'

export const uid = (p: string) => `${p}_${Math.random().toString(36).slice(2, 8)}`
export const nowStamp = () =>
  new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
export const timeNow = () =>
  new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })

/* ───────────────── Problem communities (every problem gets one) ───────────────── */

/** Build a starter community for a problem that doesn't have a hand-crafted one. */
export function starterCommunity(p: Problem): ProblemCommunity {
  const short = p.title.length > 40 ? p.title.slice(0, 40).trim() + '…' : p.title
  const circle = p.domain === 'agri' ? 'Field Circle' : 'Care Circle'
  const id = uid('pc')
  return {
    id,
    problemId: p.id,
    domain: p.domain,
    name: `${short} — ${circle}`,
    purpose: `Community circle for “${p.title}”. Reporters, neighbours, students and domain experts coordinate here: field updates, questions, offers of help and honest results.`,
    memberIds: [p.reporterId],
    coordinatorId: p.reporterId,
    posts: [{
      id: uid('cp'), communityId: id, authorId: p.reporterId, kind: 'Update', likes: 0,
      at: 'Just now',
      text: `Welcome to this circle. I reported “${p.title}” — post updates, questions and offers to help here so everyone working on this stays on the same page.`,
    }],
    events: [],
    resources: [{ id: uid('cr'), title: 'Community ground rules — be specific, be respectful, share results', kind: 'Guide' }],
    createdAt: p.createdAt,
  }
}

/** Guarantee one community per problem — used at init and to heal stale persisted sessions. */
export function ensureAllCommunities(problems: Problem[], existing: ProblemCommunity[]): ProblemCommunity[] {
  const have = new Set(existing.map((c) => c.problemId))
  const missing = problems.filter((p) => !have.has(p.id)).map((p) => starterCommunity(p))
  return missing.length ? [...existing, ...missing] : existing
}

/* ───────────────── AI Challenge Intelligence (deterministic demo engine) ───────────────── */

interface Profile {
  domainLabel: string
  categories: { key: string; category: string; type: string; areas: string[]; skills: string[] }[]
  expertise: string[]
  disciplines: string[]
  notes: string[]
}

const PROFILES: Record<DomainId, Record<string, Profile>> = {
  agri: {
    default: {
      domainLabel: 'Agriculture',
      categories: [
        {
          key: 'crop', category: 'Crop Health', type: 'Disease Detection / Advisory',
          areas: ['Plant Pathology', 'Image Analysis', 'AI/ML', 'Agronomy'],
          skills: ['Image Classification', 'Python', 'Machine Learning', 'Crop Disease Knowledge', 'Data Analysis'],
        },
        {
          key: 'postharvest', category: 'Post-harvest & Supply Chain', type: 'Storage / Logistics Optimization',
          areas: ['Post-harvest Technology', 'Cold Chain Design', 'Thermal Engineering', 'Data Analysis'],
          skills: ['CAD', 'Thermal Calculations', 'Cost Modeling', 'Survey Design', 'Supply Chain Analysis'],
        },
        {
          key: 'equipment', category: 'Farm Machinery & Access', type: 'Booking / Maintenance Platform',
          areas: ['Mechanical Maintenance', 'Operations Research', 'Software Engineering'],
          skills: ['Flutter', 'APIs', 'Scheduling Algorithms', 'Maintenance Planning', 'Field Testing'],
        },
        {
          key: 'pest', category: 'Pest Surveillance', type: 'Monitoring / Early Warning',
          areas: ['Entomology', 'IoT Sensing', 'Data Aggregation'],
          skills: ['Embedded Systems', 'Sensor Integration', 'Data Analysis', 'SMS/Alert Systems'],
        },
      ],
      expertise: ['Agriculture', 'Plant Pathology', 'AI/ML', 'Image Processing', 'Biotechnology'],
      disciplines: ['Agriculture', 'CSE — AI/ML', 'Biotechnology', 'Electronics & IoT', 'Design (UX)'],
      notes: [
        'AI recommends; humans validate — a plant pathology expert must confirm all field diagnoses.',
        'This challenge would benefit from a multidisciplinary team: field data, AI model, hardware and farmer-facing design.',
      ],
    },
  },
  health: {
    default: {
      domainLabel: 'Healthcare',
      categories: [
        {
          key: 'followup', category: 'Primary Healthcare Operations', type: 'Reminders / Tracking (non-clinical)',
          areas: ['Public Health', 'Human-Centered Design', 'Offline-first Software'],
          skills: ['Flutter', 'Offline-first Apps', 'User Research', 'Statistics', 'Privacy-by-design'],
        },
        {
          key: 'equipment', category: 'Medical Equipment Management', type: 'Maintenance Tracking',
          areas: ['Biomedical Engineering', 'Device Calibration', 'Software Engineering'],
          skills: ['Sensor Calibration', 'Medical Device Basics', 'Dashboard Development', 'QR Systems'],
        },
        {
          key: 'referral', category: 'Referral & Coordination', type: 'Workflow / Status Tracking',
          areas: ['Health Systems', 'Process Design', 'Interoperability'],
          skills: ['Process Mapping', 'APIs', 'Flutter', 'Health Systems Knowledge'],
        },
      ],
      expertise: ['Public Health', 'Biomedical Engineering', 'Health Systems', 'Software Engineering'],
      disciplines: ['Biomedical Engineering', 'CSE — Software', 'Data Science & Statistics', 'Design (UX)'],
      notes: [
        'AI does NOT make medical diagnoses. Clinical decisions remain with qualified medical professionals only.',
        'No patient-identifiable data may be stored or shared. Strict access controls apply (RBAC).',
        'This challenge would benefit from a multidisciplinary team: health systems, software, statistics and design.',
      ],
    },
  },
}

export interface ProblemDraft {
  title: string
  description: string
  domain: DomainId
  location: string
  urgency: Problem['urgency']
  peopleAffected: number
  existingAttempts: string
  contact: string
  imageTags?: string[]
  docs?: string[]
  video?: string
}

function classify(draft: ProblemDraft): Profile['categories'][number] {
  const text = `${draft.title} ${draft.description}`.toLowerCase()
  const p = PROFILES[draft.domain].default
  const score = (words: string[]) => words.reduce((n, w) => n + (text.includes(w) ? 1 : 0), 0)
  if (draft.domain === 'agri') {
    const cats = p.categories
    const s = [
      score(['mildew', 'disease', 'leaf', 'crop health', 'blight', 'rust', 'infection', 'vine']),
      score(['post-harvest', 'storage', 'spoil', 'cold', 'market', 'crate']),
      score(['equipment', 'machine', 'rotavator', 'repair', 'booking', 'tractor', 'sprayer']),
      score(['pest', 'fly', 'trap', 'grub', 'insect', 'borer']),
    ]
    const max = Math.max(...s)
    if (s[1] === max && max > 0) return cats[1]
    if (s[2] === max && max > 0) return cats[2]
    if (s[3] === max && max > 0) return cats[3]
    return cats[0]
  }
  const cats = p.categories
  const s = [
    score(['follow-up', 'followup', 'reminder', 'register', 'visit', 'attendance']),
    score(['nebulizer', 'monitor', 'calibrat', 'device', 'equipment', 'repair']),
    score(['referral', 'coordination', 'slip', 'transfer', 'hospital']),
  ]
  const max = Math.max(...s)
  if (s[1] === max && max > 0) return cats[1]
  if (s[2] === max && max > 0) return cats[2]
  return cats[0]
}

function priorityFor(draft: ProblemDraft): AiAnalysis['priority'] {
  let score = 0
  if (draft.urgency === 'critical') score += 3
  else if (draft.urgency === 'high') score += 2
  else if (draft.urgency === 'medium') score += 1
  if (draft.peopleAffected >= 1000) score += 2
  else if (draft.peopleAffected >= 200) score += 1
  const t = draft.description.toLowerCase()
  if (t.includes('every monsoon') || t.includes('recurring') || t.includes('repeated') || t.includes('every season')) score += 1
  return score >= 4 ? 'Critical Priority' : score >= 2 ? 'High Priority' : 'Medium Priority'
}

function reasonsFor(draft: ProblemDraft, priority: AiAnalysis['priority']): string[] {
  const r: string[] = []
  r.push(`${draft.peopleAffected.toLocaleString('en-IN')} people affected`)
  r.push(draft.peopleAffected >= 300 ? 'Significant potential economic impact' : 'Direct livelihood impact reported')
  if (priority !== 'Medium Priority') r.push('Recurring / seasonal pattern reported')
  r.push(`Reporter urgency: ${draft.urgency}`)
  return r
}

function duplicatesFor(draft: ProblemDraft, excludeId?: string): AiAnalysis['duplicates'] {
  const tokens = `${draft.title} ${draft.description}`.toLowerCase().split(/\W+/).filter((w) => w.length > 4)
  return PROBLEMS.filter((p) => p.id !== excludeId)
    .map((p) => {
      const pt = `${p.title} ${p.description}`.toLowerCase()
      const overlap = tokens.filter((w) => pt.includes(w)).length
      const sim = Math.min(88, 34 + overlap * 6 + (p.domain === draft.domain ? 8 : 0))
      return { id: p.id, title: p.title, similarity: sim, status: p.status }
    })
    .filter((d) => d.similarity >= 42)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 2)
}

export function runAiAnalysis(draft: ProblemDraft): AiAnalysis {
  const prof = PROFILES[draft.domain].default
  const cat = classify(draft)
  const priority = priorityFor(draft)
  return {
    domainLabel: prof.domainLabel,
    category: cat.category,
    problemType: cat.type,
    priority,
    priorityReasons: reasonsFor(draft, priority),
    duplicates: duplicatesFor(draft),
    knowledgeAreas: cat.areas,
    requiredSkills: cat.skills,
    disciplines: prof.disciplines,
    recommendation: 'This challenge would benefit from a multidisciplinary team with complementary skills.',
    summary: `AI classifies this as a ${cat.category.toLowerCase()} challenge (${cat.type.toLowerCase()}) in ${prof.domainLabel}. Skills and disciplines below are suggestions for admin/expert validation — the problem determines the required skills, not a student's branch.`,
    impactNote: draft.peopleAffected >= 500 ? 'Potential to reach 500+ people if solved' : 'Focused local impact potential',
    suggestTeamSize: 4,
    notes: prof.notes,
    at: new Date().toISOString(),
  }
}

/* ───────────────── Skill→People matching ───────────────── */

export interface MatchResult {
  user: User
  matchPct: number
  skillsMatched: string[]
  reasons: string[]
  roleFit: string
}

export function matchPeople(skills: string[], domain: DomainId, team: string[] = []): MatchResult[] {
  const needed = skills.map((s) => s.toLowerCase())
  return USERS.filter((u) => u.role === 'student' && !team.includes(u.id))
    .map((u) => {
      const owned = (u.skills ?? []).map((s) => s.toLowerCase())
      const skillsMatched = needed.filter((n) => owned.some((o) => o.includes(n) || n.includes(o.split(' ')[0])))
      let pct = 34 + skillsMatched.length * 13 + (u.domains?.includes(domain) ? 8 : 0)
      if ((u.availability ?? '').startsWith('1') || (u.availability ?? '').startsWith('2')) pct += 4
      if (u.projects?.length) pct += 3
      pct = Math.min(96, pct)
      const reasons: string[] = []
      if (skillsMatched.length) reasons.push(`Skills: ${skillsMatched.slice(0, 3).join(', ')}`)
      if (u.domains?.includes(domain)) reasons.push('Active in this domain')
      if (u.projects?.length) reasons.push(`Previous projects (${u.projects.length})`)
      if ((u.availability ?? '').includes('20')) reasons.push('High availability (20 hrs/wk)')
      return {
        user: u,
        matchPct: pct,
        skillsMatched,
        reasons: reasons.length ? reasons : ['Interested in this domain'],
        roleFit: skillsMatched.length > 2 ? 'Core skill owner' : skillsMatched.length ? 'Supporting skill' : 'Adjacent expertise',
      }
    })
    .sort((a, b) => b.matchPct - a.matchPct)
}

export function matchScoreFor(user: User, p: Problem): number {
  if (user.role !== 'student' || !p.analysis) return 0
  const needed = p.analysis.requiredSkills.map((s) => s.toLowerCase())
  const owned = (user.skills ?? []).map((s) => s.toLowerCase())
  const hits = needed.filter((n) => owned.some((o) => o.includes(n) || n.includes(o.split(' ')[0]))).length
  let pct = 30 + hits * 14
  if (user.domains?.includes(p.domain)) pct += 8
  if ((user.interests ?? []).join(' ').toLowerCase().includes(p.domain === 'agri' ? 'agri' : 'health')) pct += 4
  if (user.projects?.length) pct += 4
  if (['In Progress', 'Matched'].includes(p.status)) pct -= 6
  return Math.max(28, Math.min(97, pct))
}

/* ───────────────── Store ───────────────── */

interface State {
  hydrated: boolean
  currentUser: User | null
  users: User[]
  problems: Problem[]
  projects: Project[]
  tasks: Task[]
  milestones: typeof MILESTONES
  chat: typeof CHAT
  files: typeof FILES
  mentorNotes: typeof MENTOR_NOTES
  reviews: ExpertReview[]
  feedbacks: Feedback[]
  kgPosts: KgPost[]
  kgReplies: KgReply[]
  communities: ProblemCommunity[]
  notifications: Notification[]
  auditLog: { id: string; at: string; actor: string; action: string }[]
  toast: string | null
  lang: Lang

  login: (email: string, name?: string) => User | null
  demoLogin: (role: Role) => void
  logout: () => void
  register: (name: string, role: Role, email: string) => User
  completeOnboarding: (patch: Partial<User>) => void
  updateProfile: (patch: Partial<User>) => void
  setToast: (t: string | null) => void
  setLang: (l: Lang) => void

  addProblem: (draft: ProblemDraft) => Problem
  analyzeProblem: (id: string) => void
  routeProblem: (id: string, status: Problem['status']) => void
  saveProblem: (id: string) => void
  assignMentor: (problemId: string, mentorId: string) => void

  createProject: (problemId: string, name: string, memberIds: string[], mentorId?: string) => Project
  joinProject: (projectId: string) => void
  inviteMember: (projectId: string, userId: string) => void
  advanceStage: (projectId: string) => void
  updateTaskStatus: (taskId: string, status: TaskStatus) => void
  addTask: (projectId: string, title: string, assigneeId: string, priority: Task['priority'], deadline: string) => void
  postChat: (projectId: string, text: string) => void
  uploadFile: (projectId: string, name: string, kind: string) => void
  requestValidation: (projectId: string) => void

  submitReview: (projectId: string, status: 'Approved' | 'Changes Requested', comment: string) => void
  submitFeedback: (input: { projectId: string; problemId: string; answers: Feedback['answers']; rating: number; comment: string }) => void
  setSolutionStatus: (projectId: string, s: 'Solved' | 'Partially Solved' | 'Needs Improvement') => void
  reopenImprovement: (projectId: string) => void

  addKgPost: (post: Pick<KgPost, 'community' | 'topic' | 'kind' | 'title' | 'excerpt'>) => void
  addKgReply: (postId: string, text: string) => void
  toggleSavePost: (postId: string) => void

  joinCommunity: (communityId: string) => void
  leaveCommunity: (communityId: string) => void
  addCommunityPost: (communityId: string, kind: CommunityPostKind, text: string) => void
  likeCommunityPost: (communityId: string, postId: string) => void
  rsvpCommunityEvent: (communityId: string, eventId: string) => void

  notify: (userId: string, n: Omit<Notification, 'id' | 'userId' | 'read' | 'at'> & { at?: string }) => void
  markAllRead: () => void
  markRead: (id: string) => void
  audit: (action: string) => void
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      hydrated: false,
      currentUser: null,
      users: USERS,
      problems: PROBLEMS,
      projects: PROJECTS,
      tasks: TASKS,
      milestones: MILESTONES,
      chat: CHAT,
      files: FILES,
      mentorNotes: MENTOR_NOTES,
      reviews: REVIEWS,
      feedbacks: FEEDBACKS,
      kgPosts: KG_POSTS,
      kgReplies: KG_REPLIES,
      communities: ensureAllCommunities(PROBLEMS, PROBLEM_COMMUNITIES),
      notifications: NOTIFICATIONS,
      auditLog: [
        { id: 'a0', at: '15 Sep 2026 · 11:00', actor: 'Dr. Meera Iyer', action: 'Routed problem p4 to student matching after domain validation' },
      ],
      toast: null,
      lang: 'en',

      /* ── auth ── */
      login: (email, name) => {
        const e = email.trim().toLowerCase()
        const found = get().users.find((u) => u.email?.toLowerCase() === e)
        if (found) { set({ currentUser: found }); return found }
        // demo: any email logs in as matching seed user or creates a citizen
        const fallback = name?.toLowerCase().includes('farm')
        const u: User = {
          id: uid('u'), name: name || 'Guest User', role: fallback ? 'farmer' : 'citizen',
          avatar: fallback ? '🧑‍🌾' : '👤', title: 'Community Member', userType: 'Citizen',
          location: 'India', joined: nowStamp(), email,
        }
        set((s) => ({ currentUser: u, users: [...s.users, u] }))
        return u
      },
      demoLogin: (role) => {
        const map: Record<Role, string> = {
          farmer: 'u_farmer1', citizen: 'u_citizen1', health_worker: 'u_health1',
          student: 'u_s2', faculty: 'u_f1', industry: 'u_i1', admin: 'u_admin',
        }
        const u = get().users.find((x) => x.id === map[role])
        if (u) set({ currentUser: u })
      },
      logout: () => set({ currentUser: null }),
      register: (name, role, email) => {
        const avatars: Record<Role, string> = {
          farmer: '🧑‍🌾', citizen: '👤', health_worker: '👩‍⚕️', student: '👨‍🎓',
          faculty: '👩‍🏫', industry: '🧑‍💼', admin: '🏛️',
        }
        const u: User = {
          id: uid('u'), name, role, email, avatar: avatars[role],
          title: role === 'student' ? 'Student' : role === 'faculty' ? 'Faculty / Domain Expert' : 'Community Member',
          location: 'India', joined: nowStamp(),
        }
        set((s) => ({ currentUser: u, users: [...s.users, u] }))
        return u
      },
      completeOnboarding: (patch) =>
        set((s) => {
          if (!s.currentUser) return s
          const updated = { ...s.currentUser, ...patch, onboarded: true }
          return { currentUser: updated, users: s.users.map((u) => (u.id === updated.id ? updated : u)) }
        }),
      updateProfile: (patch) =>
        set((s) => {
          if (!s.currentUser) return s
          const updated = { ...s.currentUser, ...patch }
          return { currentUser: updated, users: s.users.map((u) => (u.id === updated.id ? updated : u)) }
        }),
      setToast: (t) => set({ toast: t }),
      setLang: (l) => set({ lang: l }),

      /* ── problems ── */
      addProblem: (draft) => {
        const cu = get().currentUser!
        const p: Problem = {
          id: uid('p'), ...draft, reporterId: cu.id, status: 'Under Review', ai: 'pending',
          createdAt: nowStamp(),
        }
        const community = starterCommunity(p)
        set((s) => ({ problems: [p, ...s.problems], communities: [community, ...s.communities] }))
        get().audit(`Problem submitted: “${draft.title.slice(0, 48)}…” by ${cu.name} — community “${community.name.slice(0, 40)}” created`)
        // notify admins of new submission
        get().users.filter((u) => u.role === 'admin').forEach((a) =>
          get().notify(a.id, { type: 'system', text: `New problem submitted: ${draft.title.slice(0, 60)}`, link: '/admin' }))
        return p
      },
      analyzeProblem: (id) =>
        set((s) => ({
          problems: s.problems.map((p) => {
            if (p.id !== id) return p
            const a = runAiAnalysis(p)
            return { ...p, analysis: a, ai: 'done' }
          }),
        })),
      routeProblem: (id, status) => {
        set((s) => ({ problems: s.problems.map((p) => (p.id === id ? { ...p, status } : p)) }))
        const p = get().problems.find((x) => x.id === id)
        get().audit(`Problem “${p?.title.slice(0, 40)}…” status → ${status}`)
        // notify reporter
        if (p) get().notify(p.reporterId, { type: 'system', text: `Your problem “${p.title.slice(0, 44)}…” is now: ${status}`, link: `/problem/${p.id}` })
        // notify matched students
        if (status === 'Matched') {
          get().users.filter((u) => u.role === 'student').forEach((u) =>
            get().notify(u.id, { type: 'match', text: `New problem matched to your skills: ${p?.title.slice(0, 52)}`, link: `/problem/${id}` }))
        }
      },
      saveProblem: (id) =>
        set((s) => {
          const cu = s.currentUser
          if (!cu) return s
          return {
            problems: s.problems.map((p) =>
              p.id === id ? { ...p, savedBy: p.savedBy?.includes(cu.id) ? p.savedBy.filter((x) => x !== cu.id) : [...(p.savedBy ?? []), cu.id] } : p),
          }
        }),
      assignMentor: (problemId, mentorId) => {
        set((s) => ({
          projects: s.projects.map((pr) => (pr.problemId === problemId ? { ...pr, mentorId } : pr)),
        }))
        const m = get().users.find((u) => u.id === mentorId)
        if (m) get().notify(m.id, { type: 'expert', text: 'You have been assigned as mentor on a new project', link: '/review' })
      },

      /* ── projects ── */
      createProject: (problemId, name, memberIds, mentorId) => {
        const prob = get().problems.find((p) => p.id === problemId)!
        const prj: Project = {
          id: uid('prj'), problemId, name, domain: prob.domain,
          objective: `Solve: ${prob.title.slice(0, 110)}…`,
          team: memberIds, mentorId, stage: 'Planning', stageProgress: 15,
          validationStatus: 'Pending', createdAt: nowStamp(), improvementCount: 0,
        }
        const stages: Task[] = [
          { id: uid('t'), projectId: prj.id, title: 'Define problem scope with reporter interviews', assigneeId: memberIds[0], status: 'To Do', deadline: '+ 1 week', priority: 'High', tag: 'Research' },
          { id: uid('t'), projectId: prj.id, title: 'Map required skills to task plan', assigneeId: memberIds[1] ?? memberIds[0], status: 'To Do', deadline: '+ 2 weeks', priority: 'Medium', tag: 'Planning' },
        ]
        set((s) => ({
          projects: [prj, ...s.projects],
          tasks: [...s.tasks, ...stages],
          problems: s.problems.map((p) => (p.id === problemId ? { ...p, status: 'In Progress', projectId: prj.id } : p)),
        }))
        get().audit(`Team formed for “${prob.title.slice(0, 40)}…” — project “${name}”`)
        memberIds.forEach((m) => get().notify(m, { type: 'invite', text: `You joined “${name}” — workspace created`, link: `/project/${prj.id}` }))
        if (mentorId) get().notify(mentorId, { type: 'expert', text: `Mentor request: ${name}`, link: `/project/${prj.id}` })
        get().notify(prob.reporterId, { type: 'solution', text: `A team started working on your problem: ${name}`, link: `/project/${prj.id}` })
        return prj
      },
      joinProject: (projectId) => {
        const cu = get().currentUser!
        set((s) => ({
          projects: s.projects.map((p) => (p.id === projectId && !p.team.includes(cu.id) ? { ...p, team: [...p.team, cu.id] } : p)),
        }))
        const prj = get().projects.find((p) => p.id === projectId)
        get().notify(cu.id, { type: 'invite', text: `Welcome to the team — ${prj?.name}`, link: `/project/${projectId}` })
      },
      inviteMember: (projectId, userId) => {
        const prj = get().projects.find((p) => p.id === projectId)
        const u = get().users.find((x) => x.id === userId)
        if (!prj || !u) return
        get().notify(userId, { type: 'invite', text: `Team invitation: ${prj.name} — ${u.name}, you were invited`, link: `/project/${projectId}` })
        set((s) => ({
          projects: s.projects.map((p) => (p.id === projectId && !p.team.includes(userId) ? { ...p, team: [...p.team, userId] } : p)),
        }))
        get().setToast(`${u.name} was added to the team`)
      },
      advanceStage: (projectId) => {
        const order: Project['stage'][] = ['Problem Definition', 'Planning', 'Development', 'Testing', 'Prototype', 'Deployment']
        const prj = get().projects.find((p) => p.id === projectId)
        if (!prj || prj.stage === 'Deployment') return
        const next = order[Math.min(order.indexOf(prj.stage) + 1, order.length - 1)]
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId ? { ...p, stage: next, stageProgress: Math.min(100, p.stageProgress + 20) } : p),
        }))
        const upd = get().projects.find((p) => p.id === projectId)!
        prj.team.forEach((m) => get().notify(m, { type: 'milestone', text: `${upd.name} moved to stage: ${next}`, link: `/project/${projectId}` }))
      },
      updateTaskStatus: (taskId, status) => set((s) => ({ tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)) })),
      addTask: (projectId, title, assigneeId, priority, deadline) =>
        set((s) => ({ tasks: [...s.tasks, { id: uid('t'), projectId, title, assigneeId, status: 'To Do', deadline, priority }] })),
      postChat: (projectId, text) => {
        const cu = get().currentUser!
        set((s) => ({ chat: [...s.chat, { id: uid('c'), projectId, authorId: cu.id, text, at: `${nowStamp()}, ${timeNow()}` }] }))
        const prj = get().projects.find((p) => p.id === projectId)
        prj?.team.filter((m) => m !== cu.id).forEach((m) =>
          get().notify(m, { type: 'kg', text: `${cu.name} in ${prj.name}: ${text.slice(0, 50)}`, link: `/project/${projectId}` }))
      },
      uploadFile: (projectId, name, kind) => {
        const cu = get().currentUser!
        set((s) => ({ files: [...s.files, { id: uid('f'), projectId, name, kind, size: '—', uploaderId: cu.id, at: nowStamp() }] }))
        get().audit(`File uploaded to project ${projectId}: ${name}`)
      },
      requestValidation: (projectId) => {
        set((s) => ({
          projects: s.projects.map((p) => (p.id === projectId ? { ...p, validationStatus: 'Requested' } : p)),
        }))
        const prj = get().projects.find((p) => p.id === projectId)
        const problem = get().problems.find((p) => p.id === prj?.problemId)
        if (problem) {
          set((s) => ({ problems: s.problems.map((p) => (p.id === problem.id ? { ...p, status: 'Validating' } : p)) }))
        }
        // notify domain experts + reporter
        get().users.filter((u) => u.role === 'faculty').forEach((f) =>
          get().notify(f.id, { type: 'validation', text: `Validation request: ${prj?.name} — expert review needed`, link: '/review' }))
        if (problem) get().notify(problem.reporterId, { type: 'validation', text: `${prj?.name} is ready for community testing — your feedback is requested`, link: `/project/${projectId}` })
        get().setToast('Validation requested — experts and the community have been notified')
      },

      /* ── review / feedback / loop ── */
      submitReview: (projectId, status, comment) => {
        const cu = get().currentUser!
        const prj = get().projects.find((p) => p.id === projectId)
        if (!prj) return
        const review: ExpertReview = {
          id: uid('r'), projectId, problemId: prj.problemId, expertId: cu.id, status, comment, at: nowStamp(),
        }
        set((s) => ({ reviews: [review, ...s.reviews] }))
        prj.team.forEach((m) => get().notify(m, { type: 'expert', text: `Expert review on ${prj.name}: ${status}`, link: `/project/${projectId}` }))
        const problem = get().problems.find((p) => p.id === prj.problemId)
        if (problem) get().notify(problem.reporterId, { type: 'expert', text: `An expert ${status === 'Approved' ? 'approved' : 'requested changes on'} ${prj.name}`, link: `/project/${projectId}` })
        get().audit(`Expert review (${status}) on ${prj.name} by ${cu.name}`)
        get().setToast(status === 'Approved' ? 'Review submitted: Approved ✓' : 'Changes requested — team notified')
      },
      submitFeedback: ({ projectId, problemId, answers, rating, comment }) => {
        const cu = get().currentUser!
        const fb: Feedback = { id: uid('fb'), projectId, problemId, userId: cu.id, role: cu.role, answers, rating, comment, at: nowStamp() }
        set((s) => ({ feedbacks: [fb, ...s.feedbacks] }))
        const prj = get().projects.find((p) => p.id === projectId)
        if (prj) {
          prj.team.forEach((m) => get().notify(m, { type: 'solution', text: `New field feedback (${rating}★) on ${prj.name}`, link: `/project/${projectId}` }))
        }
        get().setToast('Thank you! Your feedback was shared with the team.')
      },
      setSolutionStatus: (projectId, sol) => {
        set((s) => ({
          projects: s.projects.map((p) => (p.id === projectId ? { ...p, solutionStatus: sol, validationStatus: 'Validated' } : p)),
          problems: s.problems.map((p) => {
            const prj = s.projects.find((x) => x.id === projectId)
            return prj && p.id === prj.problemId ? { ...p, status: sol === 'Needs Improvement' ? 'Needs Improvement' : 'Solved' } : p
          }),
        }))
        const prj = get().projects.find((p) => p.id === projectId)
        const problem = get().problems.find((p) => p.id === prj?.problemId)
        if (prj) {
          prj.team.forEach((m) => get().notify(m, { type: 'solution', text: `Solution status: ${sol} — ${prj.name}`, link: `/project/${projectId}` }))
          if (sol === 'Needs Improvement') get().reopenImprovement(projectId)
        }
        if (problem) get().audit(`Community validation: ${sol} for “${problem.title.slice(0, 40)}…”`)
      },
      reopenImprovement: (projectId) => {
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId ? { ...p, stage: 'Development', stageProgress: Math.min(p.stageProgress, 55), improvementCount: (p.improvementCount ?? 0) + 1 } : p),
          tasks: s.tasks.map((t) => (t.projectId === projectId && t.status === 'Review' ? { ...t, status: 'In Progress' } : t)),
        }))
        const prj = get().projects.find((p) => p.id === projectId)
        prj?.team.forEach((m) => get().notify(m, { type: 'task', text: `BUILD → TEST → IMPROVE loop: ${prj.name} sent back to Development`, link: `/project/${projectId}` }))
        get().setToast('Sent back to Development → Testing → Validation (improve loop)')
      },

      /* ── knowledge ground ── */
      addKgPost: (post) => {
        const cu = get().currentUser!
        const p: KgPost = { id: uid('g'), ...post, authorId: cu.id, replies: 0, upvotes: 0, at: nowStamp() }
        set((s) => ({ kgPosts: [p, ...s.kgPosts] }))
        get().setToast('Posted to Knowledge Ground')
      },
      addKgReply: (postId, text) => {
        const cu = get().currentUser!
        set((s) => ({
          kgReplies: [...s.kgReplies, { id: uid('kr'), postId, authorId: cu.id, text, at: nowStamp() }],
          kgPosts: s.kgPosts.map((g) => (g.id === postId ? { ...g, replies: g.replies + 1 } : g)),
        }))
        const post = get().kgPosts.find((g) => g.id === postId)
        if (post && post.authorId !== cu.id) {
          get().notify(post.authorId, { type: 'kg', text: `${cu.name} replied to your Knowledge Ground post`, link: '/knowledge' })
        }
      },
      toggleSavePost: (postId) =>
        set((s) => ({ kgPosts: s.kgPosts.map((g) => (g.id === postId ? { ...g, saved: !g.saved } : g)) })),

      /* ── problem communities ── */
      joinCommunity: (communityId) => {
        const cu = get().currentUser
        if (!cu) return
        const com = get().communities.find((c) => c.id === communityId)
        if (!com || com.memberIds.includes(cu.id)) return
        set((s) => ({
          communities: s.communities.map((c) =>
            c.id === communityId ? { ...c, memberIds: [...c.memberIds, cu.id] } : c),
        }))
        // notify the coordinator + community members about the new member
        const others = com.memberIds.filter((m) => m !== cu.id)
        const coord = com.coordinatorId
        if (coord !== cu.id) get().notify(coord, { type: 'community', text: `${cu.name} joined the community “${com.name}”`, link: `/community/${com.id}` })
        others.slice(0, 6).forEach((m) =>
          get().notify(m, { type: 'community', text: `${cu.name} joined “${com.name}”`, link: `/community/${com.id}` }))
        get().notify(cu.id, { type: 'community', text: `Welcome to “${com.name}” — introduce yourself in the feed`, link: `/community/${com.id}` })
        get().audit(`${cu.name} joined problem community “${com.name}”`)
        get().setToast(`Joined “${com.name}” — ${com.memberIds.length + 1} members now`)
      },
      leaveCommunity: (communityId) => {
        const cu = get().currentUser
        if (!cu) return
        const com = get().communities.find((c) => c.id === communityId)
        if (!com) return
        set((s) => ({
          communities: s.communities.map((c) =>
            c.id === communityId ? { ...c, memberIds: c.memberIds.filter((m) => m !== cu.id) } : c),
        }))
        get().setToast(`Left “${com.name}”`)
      },
      addCommunityPost: (communityId, kind, text) => {
        const cu = get().currentUser
        if (!cu || !text.trim()) return
        const post = { id: uid('cp'), communityId, authorId: cu.id, kind, text: text.trim(), at: `Just now`, likes: 0 }
        set((s) => ({
          communities: s.communities.map((c) =>
            c.id === communityId ? { ...c, posts: [post, ...c.posts] } : c),
        }))
        const com = get().communities.find((c) => c.id === communityId)
        com?.memberIds.filter((m) => m !== cu.id).slice(0, 8).forEach((m) =>
          get().notify(m, { type: 'community', text: `${cu.name} posted in “${com.name}”: ${text.slice(0, 48)}`, link: `/community/${com.id}` }))
      },
      likeCommunityPost: (communityId, postId) => {
        const cu = get().currentUser
        if (!cu) return
        set((s) => ({
          communities: s.communities.map((c) =>
            c.id === communityId
              ? { ...c, posts: c.posts.map((p) => {
                  if (p.id !== postId) return p
                  const liked = p.likedBy?.includes(cu.id)
                  return { ...p, likes: liked ? p.likes - 1 : p.likes + 1, likedBy: liked ? (p.likedBy ?? []).filter((x) => x !== cu.id) : [...(p.likedBy ?? []), cu.id] }
                }) }
              : c),
        }))
      },
      rsvpCommunityEvent: (communityId, eventId) => {
        const cu = get().currentUser
        if (!cu) return
        set((s) => ({
          communities: s.communities.map((c) =>
            c.id === communityId
              ? { ...c, events: c.events.map((e) =>
                  e.id === eventId
                    ? { ...e, rsvps: e.rsvps.includes(cu.id) ? e.rsvps.filter((x) => x !== cu.id) : [...e.rsvps, cu.id] }
                    : e), }
              : c),
        }))
        const com = get().communities.find((c) => c.id === communityId)
        const ev = com?.events.find((e) => e.id === eventId)
        if (ev && !ev.rsvps.includes(cu.id)) get().setToast(`You're going to “${ev.title}” — reminder will appear in notifications`)
      },

      /* ── notifications & audit ── */
      notify: (userId, n) =>
        set((s) => ({
          notifications: [{ id: uid('nt'), userId, at: n.at ?? 'Just now', read: false, type: n.type, text: n.text, link: n.link }, ...s.notifications],
        })),
      markAllRead: () =>
        set((s) => ({ notifications: s.notifications.map((n) => (n.userId === s.currentUser?.id ? { ...n, read: true } : n)) })),
      markRead: (id) => set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
      audit: (action) =>
        set((s) => ({
          auditLog: [{ id: uid('a'), at: `${nowStamp()} · ${timeNow()}`, actor: s.currentUser?.name ?? 'System', action }, ...s.auditLog],
        })),
    }),
    {
      name: 'sahayak-v1',
      partialize: (s) => ({
        lang: s.lang,
        currentUser: s.currentUser, users: s.users, problems: s.problems, projects: s.projects,
        tasks: s.tasks, chat: s.chat, files: s.files, mentorNotes: s.mentorNotes, reviews: s.reviews,
        feedbacks: s.feedbacks, kgPosts: s.kgPosts, kgReplies: s.kgReplies, communities: s.communities, notifications: s.notifications,
        auditLog: s.auditLog, milestones: s.milestones,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return
        state.hydrated = true
        // heal sessions persisted before a problem/community was added
        const healed = ensureAllCommunities(state.problems, state.communities)
        if (healed !== state.communities) state.communities = healed
      },
    },
  ),
)

/* ───────────────── RBAC helpers ───────────────── */

export const isCommunity = (r?: Role) => r === 'citizen' || r === 'farmer' || r === 'health_worker'
export const isStudent = (r?: Role) => r === 'student'
export const isExpert = (r?: Role) => r === 'faculty'
export const canSubmitProblem = (r?: Role) => isCommunity(r)
export const canReview = (r?: Role) => r === 'faculty' || r === 'admin'
export const canValidateSolution = (r?: Role) => isCommunity(r) || r === 'admin'
export const canSeeSensitiveHealth = (r?: Role) => r === 'health_worker' || r === 'faculty' || r === 'admin'

export const ROLE_LABEL: Record<Role, string> = {
  citizen: 'Community / Citizen', farmer: 'Farmer', health_worker: 'Healthcare Institution / Worker',
  student: 'Student', faculty: 'Faculty / Domain Expert', industry: 'Industry / Startup / MSME',
  admin: 'Admin / Institution / Government',
}

export const ROLE_HOME: Record<Role, string> = {
  citizen: '/community', farmer: '/community', health_worker: '/community',
  student: '/student', faculty: '/review', industry: '/industry', admin: '/admin',
}
