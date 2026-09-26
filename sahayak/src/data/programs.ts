import type { DomainId } from './types'

/* ─────────── Solution Blueprints ─────────── */

export interface Blueprint {
  id: string
  icon: string
  title: string
  domain: DomainId
  summary: string
  architecture: { step: string; detail: string }[]
  skills: string[]
  disciplines: string[]
  estDuration: string
  difficulty: 'Starter' | 'Intermediate' | 'Advanced'
  basedOn?: string
  adoption: number
  expertTip?: string
}

export const BLUEPRINTS: Blueprint[] = [
  {
    id: 'bp1',
    icon: '📷',
    title: 'Photo-based Crop Disease Screener',
    domain: 'agri',
    summary: 'Farmer photographs a suspect leaf → on-device/AI model screens for disease stage → advisory shown only after expert validation. Built for low-end phones and patchy networks.',
    architecture: [
      { step: 'Capture protocol', detail: '5-frame checklist (overview, underside, close-up, flash, scale) keeps field photos model-ready' },
      { step: 'Dataset & labels', detail: '2,000+ local images labeled with university pathology guidelines — not generic global datasets' },
      { step: 'Model layer', detail: 'CNN classifier (v2, 89–92% field accuracy) with explicit low-confidence fallback' },
      { step: 'Advisory gate', detail: 'Positive detections route to plant-pathology expert queue before treatment advice is shown' },
      { step: 'Farmer UI', detail: '3-tap flow, big icons, Marathi voice-note playback, works on 2G sync' },
    ],
    skills: ['Image Classification', 'Python', 'Machine Learning', 'Crop Disease Knowledge', 'Data Analysis', 'Figma'],
    disciplines: ['Agriculture', 'CSE — AI/ML', 'Biotechnology', 'Design (UX)'],
    estDuration: '10–14 weeks',
    difficulty: 'Intermediate',
    basedOn: 'Smart Crop Disease Early Detection',
    adoption: 12,
    expertTip: 'Never let the model recommend pesticide brands — university-published IPM advisories only.',
  },
  {
    id: 'bp2',
    icon: '⏰',
    title: 'Offline-first Follow-up Reminder Kit',
    domain: 'health',
    summary: 'PHC/ASHA workflow tool for visit reminders and attendance — deliberately stores zero clinical data. Queues SMS/notifications when network returns.',
    architecture: [
      { step: 'Scope fence', detail: 'Only opaque patient codes + visit dates + status. No symptoms, no diagnoses — keeps it outside clinical-data rules' },
      { step: 'Offline core', detail: 'Local-first storage with conflict-safe sync when connectivity returns' },
      { step: 'Reminder engine', detail: 'T-2 days + morning-of cadence (validated in ASHA interviews)' },
      { step: 'Consent trail', detail: 'Written PHC in-charge consent logged per deployment' },
      { step: 'Dashboard', detail: 'Overdue-list view for nurses, reconciliation under 30 seconds per entry' },
    ],
    skills: ['Flutter', 'Offline-first Apps', 'User Research', 'Statistics', 'APIs'],
    disciplines: ['CSE — Software', 'Data Science & Statistics', 'Design (UX)', 'Public Health'],
    estDuration: '8–10 weeks',
    difficulty: 'Starter',
    basedOn: 'CareFollow — Rural Follow-up Companion',
    adoption: 9,
    expertTip: 'Design for the register-reconciliation moment, not the demo. If entry takes >30s, the tool dies in week 2.',
  },
  {
    id: 'bp3',
    icon: '🛠️',
    title: 'Equipment Uptime & Calibration Tracker',
    domain: 'health',
    summary: 'QR-based condition logging for BP monitors, nebulizers and similar devices across sub-centers, with calibration-threshold flags and repair SLA visibility.',
    architecture: [
      { step: 'Device census', detail: 'Map every device, model and location across centers' },
      { step: 'QR logging', detail: '30-second condition log per device per week — printable QR stickers' },
      { step: 'Threshold engine', detail: 'Manufacturer-spec calibration limits (e.g. ±3 mmHg) with heat/dust warnings' },
      { step: 'Escalation', detail: 'Failed checks auto-flag to coordinator; repair SLA breach tracked' },
      { step: 'Uptime dashboard', detail: 'Per-device uptime % and center comparisons for planning' },
    ],
    skills: ['Sensor Calibration', 'Medical Device Basics', 'QR Systems', 'Dashboard Development', 'Survey Design'],
    disciplines: ['Biomedical Engineering', 'CSE — Software', 'Electronics & IoT'],
    estDuration: '8–12 weeks',
    difficulty: 'Intermediate',
    basedOn: 'EquipCare — PHC Device Uptime Tracker',
    adoption: 7,
    expertTip: 'Log error codes weekly — dust kills more devices than calibration drift.',
  },
  {
    id: 'bp4',
    icon: '🚜',
    title: 'Shared Machinery Booking & Care Network',
    domain: 'agri',
    summary: 'FPO-run booking calendar for rotavators/sprayers with maintenance logs and sowing-window alerts, replacing word-of-mouth scheduling.',
    architecture: [
      { step: 'Asset registry', detail: 'Machines, ownership, hourly rate, current status' },
      { step: 'Booking flow', detail: 'SMS + app booking with conflict resolution and fair-use queueing' },
      { step: 'Maintenance log', detail: 'Post-use condition photos trigger service reminders before breakdowns' },
      { step: 'Season planner', detail: 'Alerts before critical sowing/spraying windows at village level' },
    ],
    skills: ['Flutter', 'Scheduling Algorithms', 'Maintenance Planning', 'Field Data Collection'],
    disciplines: ['Mechanical', 'CSE — Software', 'Agriculture', 'Management'],
    estDuration: '8–10 weeks',
    difficulty: 'Starter',
    basedOn: 'Farm equipment booking challenge (Baramati)',
    adoption: 5,
    expertTip: 'Keep one offline register as fallback for the first season — trust builds before tech adoption.',
  },
  {
    id: 'bp5',
    icon: '🧊',
    title: 'Smallholder Cold-Storage Feasibility Kit',
    domain: 'agri',
    summary: 'Data + design toolkit for farmer groups deciding whether shared cold storage is viable — thermal sizing, cost model, and sorting/crating process design.',
    architecture: [
      { step: 'Loss audit', detail: 'Quantify post-harvest loss by crop, distance and season' },
      { step: 'Thermal sizing', detail: 'Cooling-load calculations for group-scale (5–10T) cold rooms' },
      { step: 'Cost model', detail: 'Capex/opex per crate stored, break-even vs middleman deductions' },
      { step: 'Process design', detail: 'Sorting + crating protocol so the cold room actually pays off' },
    ],
    skills: ['Cost Modeling', 'CAD', 'Survey Design', 'Data Analysis'],
    disciplines: ['Mechanical', 'Data Science & Statistics', 'Management', 'Agriculture'],
    estDuration: '6–8 weeks',
    difficulty: 'Advanced',
    basedOn: 'Post-harvest tomato loss challenge (Dharwad)',
    adoption: 4,
    expertTip: 'The process (sorting/crating) often saves more than the hardware — don\u2019t lead with the cold room.',
  },
]

/* ─────────── Grants ─────────── */

export interface Grant {
  id: string
  icon: string
  title: string
  funder: string
  type: 'Government' | 'CSR' | 'University' | 'Incubator'
  domain: DomainId
  amount: string
  deadline: string
  fit: number
  status: 'Open' | 'Closing soon' | 'Rolling'
  tags: string[]
  summary: string
  eligibleStages: string[]
}

export const GRANTS: Grant[] = [
  {
    id: 'g1',
    icon: '🏛️',
    title: 'Rural Agri-Tech Innovation Grant',
    funder: 'Ministry of Agriculture — Innovation Fund',
    type: 'Government',
    domain: 'agri',
    amount: '₹5–10 L',
    deadline: '30 Oct 2026',
    fit: 92,
    status: 'Closing soon',
    tags: ['crop health', 'smallholders', 'advisory tools'],
    summary: 'Supports field-validated digital tools that reduce crop loss for smallholders. Requires community validation evidence — SahayaK projects generate this automatically.',
    eligibleStages: ['Prototype', 'Testing', 'Deployment'],
  },
  {
    id: 'g2',
    icon: '🏥',
    title: 'Primary Healthcare Digitization Challenge',
    funder: 'State Health Mission',
    type: 'Government',
    domain: 'health',
    amount: '₹8 L + pilot district',
    deadline: '15 Nov 2026',
    fit: 88,
    status: 'Open',
    tags: ['PHC workflows', 'non-clinical', 'offline-first'],
    summary: 'Funds non-clinical workflow tools for PHCs: reminders, equipment uptime, referral coordination. Strict no-patient-data rule aligns with SahayaK privacy principles.',
    eligibleStages: ['Testing', 'Prototype'],
  },
  {
    id: 'g3',
    icon: '🤝',
    title: 'CSR: Agri-Rural Livelihood Fund',
    funder: 'Corporate CSR consortium',
    type: 'CSR',
    domain: 'agri',
    amount: '₹3–6 L',
    deadline: 'Rolling',
    fit: 76,
    status: 'Rolling',
    tags: ['post-harvest', 'FPO', 'equipment access'],
    summary: 'Funds shared-infrastructure pilots with farmer producer organizations. Prefers projects with measured cost-reduction evidence.',
    eligibleStages: ['Deployment', 'Testing'],
  },
  {
    id: 'g4',
    icon: '🎓',
    title: 'Student Social Innovation Seed Fund',
    funder: 'University incubation cell',
    type: 'University',
    domain: 'agri',
    amount: '₹50 K – ₹1.5 L',
    deadline: '10 Dec 2026',
    fit: 84,
    status: 'Open',
    tags: ['student teams', 'prototype', 'any domain'],
    summary: 'Seed money for multidisciplinary student teams taking a validated prototype toward field deployment. Expert mentor endorsement required — SahayaK review records qualify.',
    eligibleStages: ['Prototype'],
  },
  {
    id: 'g5',
    icon: '🚀',
    title: 'Biotech & Health Devices Incubation Cohort',
    funder: 'Regional biotech incubator',
    type: 'Incubator',
    domain: 'health',
    amount: 'Incubation + ₹2 L support',
    deadline: '5 Nov 2026',
    fit: 71,
    status: 'Closing soon',
    tags: ['medical devices', 'biomedical', 'maintenance'],
    summary: 'For device-adjacent projects (uptime, calibration, logistics) seeking lab access and manufacturing guidance. Industry participation here is opt-in, never required by SahayaK.',
    eligibleStages: ['Prototype', 'Deployment'],
  },
]
