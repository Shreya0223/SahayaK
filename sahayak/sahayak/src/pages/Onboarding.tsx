import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useStore } from '@/data/store'
import { cx } from '@/ui/common'
import type { DomainId } from '@/data/types'

const SKILL_OPTIONS = [
  'Python', 'Machine Learning', 'Image Classification', 'Data Analysis', 'Flutter', 'React',
  'Offline-first Apps', 'APIs', 'Embedded Systems', 'Sensor Integration', 'CAD', '3D Printing',
  'Statistics', 'Survey Design', 'Figma', 'User Research', 'Field Data Collection',
  'Crop Disease Knowledge', 'Plant Tissue Culture', 'Medical Device Basics', 'Sensor Calibration',
  'Cost Modeling', 'Project Coordination',
]
const INTEREST_OPTIONS = [
  'Precision Agriculture', 'Plant Health', 'AI for Social Good', 'Computer Vision', 'Rural UX',
  'Inclusive Design', 'Public Health Analytics', 'Agri IoT', 'Medical Devices', 'Farm Machinery',
  'Post-harvest Tech', 'Diagnostics', 'Evidence & Evaluation', 'Appropriate Tech',
]
const AVAILABILITY = ['4–8 hrs/week', '10 hrs/week', '12 hrs/week', '15 hrs/week', '20 hrs/week', 'Flexible']
const EXPERTISE_OPTIONS = [
  'Plant Pathology', 'Crop Disease Diagnostics', 'AI/ML', 'Computer Vision', 'Precision Agriculture',
  'Public Health', 'Primary Healthcare Systems', 'Epidemiology', 'Medical Equipment', 'Biomedical Engineering',
  'Post-harvest Technology', 'Cold Chain', 'Health Data & Privacy', 'Soil Science', 'Entomology',
]
const COMMUNITY_TYPES = ['Farmer', 'Farmer Group / FPO', 'Village Committee', 'PHC / Health Institution', 'Community Health Centre', 'Citizen Volunteer']

function PillPicker({ options, selected, onToggle, max }: { options: string[]; selected: string[]; onToggle: (v: string) => void; max?: number }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => {
        const on = selected.includes(o)
        const disabled = !on && max !== undefined && selected.length >= max
        return (
          <button
            type="button" key={o} disabled={disabled}
            onClick={() => onToggle(o)}
            className={cx('chip border transition',
              on ? 'border-pine-700 bg-pine-800 text-white' : 'border-pine-900/10 bg-paper text-pine-900/70 hover:border-pine-400',
              disabled && 'opacity-40')}
          >
            {on && <Check size={11} />}{o}
          </button>
        )
      })}
    </div>
  )
}

export default function Onboarding() {
  const currentUser = useStore((s) => s.currentUser)
  const completeOnboarding = useStore((s) => s.completeOnboarding)
  const navigate = useNavigate()
  const role = currentUser?.role ?? 'citizen'

  const [step, setStep] = useState(0)
  const [form, setForm] = useState(() => ({
    institution: currentUser?.institution ?? '',
    branch: currentUser?.branch ?? '',
    year: currentUser?.year ?? '',
    location: currentUser?.location ?? '',
    skills: currentUser?.skills ?? [],
    interests: currentUser?.interests ?? [],
    domains: (currentUser?.domains ?? ['agri']) as DomainId[],
    projects: (currentUser?.projects ?? []).join('\n'),
    availability: currentUser?.availability ?? '10 hrs/week',
    projectType: currentUser?.projectType ?? '',
    expertise: currentUser?.expertise ?? [],
    experience: currentUser?.experience ?? '',
    userType: currentUser?.userType ?? '',
    consent: false,
  }))

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm((f) => ({ ...f, [k]: v }))
  const toggle = (k: 'skills' | 'interests' | 'expertise' | 'domains', v: any) =>
    setForm((f) => ({ ...f, [k]: f[k].includes(v) ? (f[k] as any[]).filter((x) => x !== v) : [...(f[k] as any[]), v] }))

  const finish = () => {
    const patch: any = { institution: form.institution, location: form.location }
    if (role === 'student') {
      Object.assign(patch, {
        branch: form.branch, year: form.year, skills: form.skills, interests: form.interests,
        domains: form.domains, projects: form.projects.split('\n').map((s) => s.trim()).filter(Boolean),
        availability: form.availability, projectType: form.projectType,
        title: `${form.branch || 'Student'}${form.year ? ` · ${form.year}` : ''}`,
      })
    } else if (role === 'faculty' || role === 'industry') {
      Object.assign(patch, { expertise: form.expertise, experience: form.experience, domains: form.domains })
    } else {
      Object.assign(patch, { userType: form.userType, domains: form.domains })
    }
    completeOnboarding(patch)
    navigate(role === 'student' ? '/student' : role === 'faculty' ? '/review' : role === 'admin' ? '/admin' : role === 'industry' ? '/industry' : '/community')
  }

  const steps = role === 'student'
    ? ['Academic profile', 'Skills & interests', 'Domains & availability']
    : role === 'faculty' || role === 'industry'
      ? ['Institution', 'Expertise & domains']
      : ['About you', 'Domain']

  const isStudent = role === 'student'
  const isExpert = role === 'faculty' || role === 'industry'

  return (
    <div className="container-p max-w-2xl py-10">
      <div className="mb-6 flex items-center gap-3">
        {(step > 0) && (
          <button className="btn-ghost" onClick={() => setStep((s) => s - 1)}><ArrowLeft size={15} /> Back</button>
        )}
        <div className="flex flex-1 gap-1.5">
          {steps.map((_, i) => (
            <div key={i} className={cx('h-1.5 flex-1 rounded-full', i <= step ? 'bg-pine-800' : 'bg-pine-900/10')} />
          ))}
        </div>
      </div>
      <h1 className="text-2xl font-extrabold tracking-tight text-ink">
        {steps[step]} <span className="text-sm font-semibold text-pine-900/45">· step {step + 1} of {steps.length}</span>
      </h1>
      <p className="mt-1 text-sm text-pine-900/55">
        {isStudent && 'This powers your AI problem and team recommendations — keep it honest and specific.'}
        {isExpert && 'Used to route review requests and validation to the right domain experts.'}
        {!isStudent && !isExpert && 'Used to route your problems to the right domain and keep you updated.'}
      </p>

      <div className="card mt-6 space-y-5 p-6">
        {step === 0 && isStudent && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Institution</label>
                <input className="input" value={form.institution} onChange={(e) => set('institution', e.target.value)} placeholder="e.g. COEP Technological University" />
              </div>
              <div>
                <label className="label">Branch / discipline</label>
                <input className="input" value={form.branch} onChange={(e) => set('branch', e.target.value)} placeholder="e.g. CSE — AI/ML, Agriculture, Biotech…" />
              </div>
              <div>
                <label className="label">Year</label>
                <input className="input" value={form.year} onChange={(e) => set('year', e.target.value)} placeholder="e.g. Final Year" />
              </div>
              <div>
                <label className="label">Preferred project type</label>
                <input className="input" value={form.projectType} onChange={(e) => set('projectType', e.target.value)} placeholder="e.g. Applied AI products" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Previous projects (one per line)</label>
                <textarea className="input min-h-24" value={form.projects} onChange={(e) => set('projects', e.target.value)} placeholder={'Plant disease classifier (coursework)\nHospital queue forecaster'} />
              </div>
              <div>
                <label className="label">Experience</label>
                <textarea className="input min-h-24" value={form.experience} onChange={(e) => set('experience', e.target.value)} placeholder="Internships, field work, clubs…" />
              </div>
            </div>
          </>
        )}

        {step === 0 && isExpert && (
          <>
            <div>
              <label className="label">Institution / Organization</label>
              <input className="input" value={form.institution} onChange={(e) => set('institution', e.target.value)} placeholder="e.g. MPKV Rahuri" />
            </div>
            <div>
              <label className="label">Years of experience</label>
              <input className="input" value={form.experience} onChange={(e) => set('experience', e.target.value)} placeholder="e.g. 12 years" />
            </div>
          </>
        )}

        {step === 0 && !isStudent && !isExpert && (
          <>
            <div>
              <span className="label">User type</span>
              <div className="flex flex-wrap gap-2">
                {COMMUNITY_TYPES.map((t) => (
                  <button type="button" key={t} onClick={() => set('userType', t)}
                    className={cx('chip border px-3 py-1.5', form.userType === t ? 'border-pine-700 bg-pine-800 text-white' : 'border-pine-900/10 bg-paper text-pine-900/70')}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Location (district, state)</label>
              <input className="input" value={form.location} onChange={(e) => set('location', e.target.value)} placeholder="e.g. Nashik, Maharashtra" />
            </div>
            <p className="rounded-xl bg-pine-900/[0.04] p-3 text-xs leading-relaxed text-pine-900/55">
              🔒 Privacy: submit only non-personal information about problems. Never share patient names, IDs or other
              sensitive data. Healthcare submissions are access-controlled.
            </p>
          </>
        )}

        {step === 1 && (
          isStudent ? (
            <>
              <div>
                <span className="label">Skills {form.skills.length > 0 && <span className="text-pine-700">· {form.skills.length} selected</span>}</span>
                <PillPicker options={SKILL_OPTIONS} selected={form.skills} onToggle={(v) => toggle('skills', v)} max={12} />
              </div>
              <div>
                <span className="label">Interests</span>
                <PillPicker options={INTEREST_OPTIONS} selected={form.interests} onToggle={(v) => toggle('interests', v)} max={6} />
              </div>
            </>
          ) : isExpert ? (
            <div>
              <span className="label">Expertise areas</span>
              <PillPicker options={EXPERTISE_OPTIONS} selected={form.expertise} onToggle={(v) => toggle('expertise', v)} max={8} />
            </div>
          ) : (
            <div>
              <span className="label">Which domain do your problems relate to?</span>
              <div className="grid gap-2 sm:grid-cols-2">
                {([['agri', '🌾', 'Agriculture & Genetics'], ['health', '🏥', 'Healthcare & Biotechnology']] as [DomainId, string, string][]).map(([d, ic, label]) => (
                  <button type="button" key={d} onClick={() => toggle('domains', d)}
                    className={cx('rounded-xl border p-4 text-left text-sm font-bold transition',
                      form.domains.includes(d) ? 'border-pine-700 bg-pine-50 text-pine-800' : 'border-pine-900/10 text-pine-900/70')}>
                    <span className="mr-1.5">{ic}</span>{label}
                  </button>
                ))}
              </div>
            </div>
          )
        )}

        {step === 2 && isStudent && (
          <>
            <div>
              <span className="label">Domains you want to work in</span>
              <div className="grid gap-2 sm:grid-cols-2">
                {([['agri', '🌾', 'Agriculture & Genetics'], ['health', '🏥', 'Healthcare & Biotechnology']] as [DomainId, string, string][]).map(([d, ic, label]) => (
                  <button type="button" key={d} onClick={() => toggle('domains', d)}
                    className={cx('rounded-xl border p-4 text-left text-sm font-bold transition',
                      form.domains.includes(d) ? 'border-pine-700 bg-pine-50 text-pine-800' : 'border-pine-900/10 text-pine-900/70')}>
                    <span className="mr-1.5">{ic}</span>{label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="label">Weekly availability</span>
              <div className="flex flex-wrap gap-2">
                {AVAILABILITY.map((a) => (
                  <button type="button" key={a} onClick={() => set('availability', a)}
                    className={cx('chip border px-3 py-1.5', form.availability === a ? 'border-pine-700 bg-pine-800 text-white' : 'border-pine-900/10 bg-paper text-pine-900/70')}>
                    {a}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === steps.length - 1 && (
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-pine-900/10 bg-pine-900/[0.04] p-3">
            <input type="checkbox" className="mt-0.5" checked={form.consent} onChange={(e) => set('consent', e.target.checked)} />
            <span className="text-xs leading-relaxed text-pine-900/70">
              I consent to SahayaK storing this profile to provide matching and collaboration features. I understand
              healthcare-related submissions must never contain patient-identifiable information, and that content may
              be moderated for safety.
            </span>
          </label>
        )}
      </div>

      <div className="mt-5 flex justify-end">
        {step < steps.length - 1 ? (
          <button className="btn-primary" onClick={() => setStep((s) => s + 1)}>Continue <ArrowRight size={15} /></button>
        ) : (
          <button className="btn-primary px-6" disabled={!form.consent} onClick={finish}>Enter SahayaK 🌿</button>
        )}
      </div>
    </div>
  )
}
