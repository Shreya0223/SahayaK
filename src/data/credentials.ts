import type { ExpertReview, Feedback, Project, Task, User } from './types'

export interface Credential {
  id: string
  icon: string
  title: string
  titleMr?: string
  titleHi?: string
  description: string
  evidence: string
  earnedOn: string
  level: 'Bronze' | 'Silver' | 'Gold'
  verifiedBy?: string
}

const LEVEL_ORDER = { Bronze: 0, Silver: 1, Gold: 2 }

function id(prefix: string, seed: string) {
  let h = 0
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) % 100000
  return `SK-CRED-${prefix}-${String(h).padStart(5, '0')}`
}

function levelOf(score: number): Credential['level'] {
  if (score >= 5) return 'Gold'
  if (score >= 3) return 'Silver'
  return 'Bronze'
}

export function deriveCredentials(
  me: User,
  projects: Project[],
  tasks: Task[],
  reviews: ExpertReview[],
  feedbacks: Feedback[],
): Credential[] {
  const out: Credential[] = []
  const myProjects = projects.filter((p) => p.team.includes(me.id))

  /* 1 · Validated solution shipped (community-confirmed) */
  const solved = myProjects.filter((p) => p.solutionStatus === 'Solved')
  if (solved.length > 0) {
    out.push({
      id: id('SOLVED', me.id + solved.length),
      icon: '🏆',
      title: 'Validated Solution Contributor',
      titleMr: 'पडताळलेल्या उपायाचे योगदानकर्ते',
      titleHi: 'सत्यापित समाधान योगदानकर्ता',
      description: `Contributed to ${solved.length} solution${solved.length > 1 ? 's' : ''} that the reporting community confirmed as Solved after real field testing.`,
      evidence: solved.map((p) => p.name).join(' · '),
      earnedOn: solved[0].createdAt,
      level: levelOf(solved.length + 1),
    })
  }

  /* 2 · Expert-approved work */
  const approved = myProjects.filter((p) =>
    reviews.some((r) => r.projectId === p.id && r.status === 'Approved'),
  )
  if (approved.length > 0) {
    const expertIds = approved.map((p) => p.mentorId).filter(Boolean) as string[]
    const expertNames = expertIds
      .map((eid) => projects.find((p) => p.mentorId === eid))
      .filter(Boolean).length
    out.push({
      id: id('EXPERT', me.id + approved.length),
      icon: '🎖️',
      title: 'Expert-Reviewed Work',
      titleMr: 'तज्ज्ञ-पडताळलेले कार्य',
      titleHi: 'विशेषज्ञ-सत्यापित कार्य',
      description: `Prototype work passed formal domain review by qualified faculty experts (${approved.length} project${approved.length > 1 ? 's' : ''}).`,
      evidence: `${expertNames > 0 ? `${expertNames} expert mentor(s) involved` : 'Faculty review board'} · ${approved.map((p) => p.name).join(' · ')}`,
      earnedOn: approved[0].createdAt,
      level: levelOf(approved.length + 1),
      verifiedBy: 'Faculty review board',
    })
  }

  /* 3 · Field validation endorsements (community feedback on their projects) */
  const endorsed = feedbacks.filter((f) => myProjects.some((p) => p.id === f.projectId))
  const avgRating = endorsed.length
    ? endorsed.reduce((a, f) => a + f.rating, 0) / endorsed.length
    : 0
  if (endorsed.length > 0 && avgRating >= 4) {
    out.push({
      id: id('FIELD', me.id + endorsed.length),
      icon: '🌾',
      title: 'Community Endorsed',
      titleMr: 'समुदाय-मान्यताप्राप्त',
      titleHi: 'समुदाय-समर्थित',
      description: `Field users rated their experience ${avgRating.toFixed(1)}/5 across ${endorsed.length} validation${endorsed.length > 1 ? 's' : ''} — usefulness, ease of use and problem fit.`,
      evidence: `${endorsed.length} community feedback record(s), avg ${avgRating.toFixed(1)}/5`,
      earnedOn: endorsed[0].at,
      level: levelOf(Math.floor(avgRating)),
      verifiedBy: 'Community validation',
    })
  }

  /* 4 · Completed task record */
  const doneTasks = tasks.filter((t) => t.assigneeId === me.id && t.status === 'Completed')
  if (doneTasks.length >= 3) {
    out.push({
      id: id('TASKS', me.id + doneTasks.length),
      icon: '✅',
      title: 'Reliable Contributor',
      titleMr: 'विश्वसार योगदानकर्ते',
      titleHi: 'विश्वसनीय योगदानकर्ता',
      description: `Completed ${doneTasks.length} assigned tasks on project teams with documented deadlines and peer-visible deliverables.`,
      evidence: doneTasks.slice(0, 3).map((t) => t.title).join(' · ') + (doneTasks.length > 3 ? ` +${doneTasks.length - 3} more` : ''),
      earnedOn: doneTasks[0].deadline,
      level: levelOf(Math.floor(doneTasks.length / 5)),
    })
  }

  /* 5 · Multidisciplinary collaboration */
  const multidisciplinary = myProjects.filter((p) => p.team.length >= 3)
  if (multidisciplinary.length > 0) {
    out.push({
      id: id('MULTI', me.id + multidisciplinary.length),
      icon: '🤝',
      title: 'Multidisciplinary Team Player',
      titleMr: 'बहुशाखीय संघ खेळाडू',
      titleHi: 'बहुविषयक टीम प्लेयर',
      description: `Worked in ${multidisciplinary.length} team${multidisciplinary.length > 1 ? 's' : ''} of 3+ members spanning agriculture, AI/ML, engineering, design and health disciplines.`,
      evidence: multidisciplinary.map((p) => `${p.name} (${p.team.length} members)`).join(' · '),
      earnedOn: multidisciplinary[0].createdAt,
      level: levelOf(multidisciplinary.length),
    })
  }

  /* 6 · Improvement-loop resilience (projects that came back and still shipped) */
  const resilient = myProjects.filter((p) => (p.improvementCount ?? 0) > 0 && p.solutionStatus === 'Solved')
  if (resilient.length > 0) {
    out.push({
      id: id('LOOP', me.id + resilient.length),
      icon: '🔁',
      title: 'Build–Test–Improve Resilience',
      titleMr: 'बांधकाम-चाचणी-सुधारणा तयारी',
      titleHi: 'बिल्ड-टेस्ट-इम्प्रूव लचक',
      description: `Took a solution through ${resilient.length} full improvement cycle(s) — sent back by the community, rebuilt, and validated as Solved.`,
      evidence: resilient.map((p) => `${p.name} (×${p.improvementCount} loop)`).join(' · '),
      earnedOn: resilient[0].createdAt,
      level: levelOf(resilient.length + 2),
    })
  }

  return out.sort((a, b) => LEVEL_ORDER[b.level] - LEVEL_ORDER[a.level])
}

export function credentialStats(creds: Credential[]) {
  const gold = creds.filter((c) => c.level === 'Gold').length
  const silver = creds.filter((c) => c.level === 'Silver').length
  const bronze = creds.filter((c) => c.level === 'Bronze').length
  return { gold, silver, bronze, total: creds.length }
}
