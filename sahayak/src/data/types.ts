export type Lang = 'en' | 'hi'

export type Role =
  | 'citizen'
  | 'farmer'
  | 'health_worker'
  | 'student'
  | 'faculty'
  | 'industry'
  | 'admin'

export type DomainId = 'agri' | 'health'

export type Urgency = 'low' | 'medium' | 'high' | 'critical'

export type ProblemStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Matched'
  | 'In Progress'
  | 'Expert Review'
  | 'Validating'
  | 'Solved'
  | 'Needs Improvement'

export type AiStatus = 'pending' | 'done'

export type CommunityPostKind = 'Update' | 'Question' | 'Offer Help' | 'Result'

export interface CommunityPost {
  id: string
  communityId: string
  authorId: string
  kind: CommunityPostKind
  text: string
  at: string
  likes: number
  likedBy?: string[]
}

export interface CommunityEvent {
  id: string
  communityId: string
  title: string
  when: string
  place: string
  rsvps: string[]
}

export interface ProblemCommunity {
  id: string
  problemId: string
  domain: DomainId
  name: string
  purpose: string
  memberIds: string[]
  coordinatorId: string
  posts: CommunityPost[]
  events: CommunityEvent[]
  resources: { id: string; title: string; kind: string }[]
  createdAt: string
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Review' | 'Completed'

export type LifecycleStage =
  | 'Problem Definition'
  | 'Planning'
  | 'Development'
  | 'Testing'
  | 'Prototype'
  | 'Deployment'

export type SolutionStatus = 'Solved' | 'Partially Solved' | 'Needs Improvement'

export interface User {
  id: string
  name: string
  role: Role
  avatar: string
  title: string
  institution?: string
  location: string
  verified?: boolean
  // student
  branch?: string
  year?: string
  skills?: string[]
  interests?: string[]
  domains?: DomainId[]
  projects?: string[]
  availability?: string
  projectType?: string
  // expert / faculty
  expertise?: string[]
  experience?: string
  // community
  userType?: string
  joined?: string
  bio?: string
  // onboarding flags
  onboarded?: boolean
  email?: string
}

export interface AiAnalysis {
  domainLabel: string
  category: string
  problemType: string
  priority: 'Medium Priority' | 'High Priority' | 'Critical Priority'
  priorityReasons: string[]
  duplicates: { id: string; title: string; similarity: number; status: ProblemStatus }[]
  knowledgeAreas: string[]
  requiredSkills: string[]
  disciplines: string[]
  recommendation: string
  summary: string
  impactNote?: string
  suggestTeamSize?: number
  notes: string[]
  at: string
}

export interface Problem {
  id: string
  title: string
  description: string
  domain: DomainId
  reporterId: string
  location: string
  urgency: Urgency
  peopleAffected: number
  existingAttempts: string
  contact: string
  imageTags?: string[]
  docs?: string[]
  video?: string
  status: ProblemStatus
  ai: AiStatus
  analysis?: AiAnalysis
  createdAt: string
  projectId?: string
  ratingAvg?: number
  feedbackCount?: number
  sensitive?: boolean
  savedBy?: string[]
  hiddenFromDiscover?: boolean
}

export interface Task {
  id: string
  projectId: string
  title: string
  assigneeId: string
  status: TaskStatus
  deadline: string
  priority: 'Low' | 'Medium' | 'High'
  tag?: string
}

export type MilestoneStatus = 'done' | 'active' | 'upcoming'

export interface Milestone {
  id: string
  projectId: string
  title: string
  status: MilestoneStatus
  progress?: number
  note?: string
}

export interface ChatMessage {
  id: string
  projectId: string
  authorId: string
  text: string
  at: string
  kind?: 'message' | 'system'
}

export interface FileItem {
  id: string
  projectId: string
  name: string
  kind: string
  size: string
  uploaderId: string
  at: string
  version?: number
}

export interface MentorNote {
  id: string
  projectId: string
  authorId: string
  text: string
  at: string
  type: 'feedback' | 'flag' | 'approval'
}

export interface Project {
  id: string
  problemId: string
  name: string
  domain: DomainId
  objective: string
  team: string[]
  mentorId?: string
  stage: LifecycleStage
  stageProgress: number
  validationStatus: 'Pending' | 'Requested' | 'Validated'
  solutionStatus?: SolutionStatus
  improvementCount?: number
  createdAt: string
  impact?: {
    peopleReached: number
    timeSaved: string
    costReduction: string
    satisfaction: number
    adoption: string
  }
}

export interface ExpertReview {
  id: string
  projectId: string
  problemId: string
  expertId: string
  status: 'Pending' | 'Approved' | 'Changes Requested'
  comment: string
  recommendations?: string[]
  at: string
}

export interface Feedback {
  id: string
  projectId: string
  problemId: string
  userId: string
  role: Role
  answers: { useful: number; easy: number; addresses: number }
  rating: number
  comment: string
  at: string
}

export interface KgPost {
  id: string
  community: DomainId
  topic: string
  kind: 'Question' | 'Resource' | 'Discussion' | 'Announcement' | 'Expert Insight'
  title: string
  excerpt: string
  authorId: string
  replies: number
  upvotes: number
  at: string
  projectId?: string
  saved?: boolean
  attachment?: string
}

export interface KgReply {
  id: string
  postId: string
  authorId: string
  text: string
  at: string
}

export interface Notification {
  id: string
  userId: string
  type:
    | 'match'
    | 'invite'
    | 'task'
    | 'deadline'
    | 'expert'
    | 'kg'
    | 'milestone'
  | 'validation'
  | 'solution'
  | 'community'
  | 'system'
  text: string
  at: string
  read: boolean
  link?: string
}
