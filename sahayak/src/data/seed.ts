import type {
  User, Problem, Project, Task, Milestone, ChatMessage, FileItem,
  MentorNote, ExpertReview, Feedback, KgPost, KgReply, Notification, ProblemCommunity,
} from './types'

/* ───────────────────────── USERS ───────────────────────── */

export const USERS: User[] = [
  { id: 'u_admin', name: 'Dr. Meera Iyer', role: 'admin', avatar: '🏛️', title: 'District Program Officer', institution: 'Zilla Parishad · Govt. of Maharashtra', location: 'Pune, MH', verified: true, onboarded: true, email: 'admin@sahayak.org' },

  // Community
  { id: 'u_farmer1', name: 'Ramesh Patil', role: 'farmer', avatar: '🧑‍🌾', title: 'Grape Farmer · 2.5 acres', userType: 'Farmer', location: 'Nashik, MH', joined: 'Mar 2026', onboarded: true, bio: 'Grows Thomson Seedless grapes. Facing recurring downy mildew losses every monsoon.', email: 'ramesh@example.in' },
  { id: 'u_farmer2', name: 'Savita Hosamani', role: 'farmer', avatar: '👩‍🌾', title: 'Tomato & Groundnut Farmer', userType: 'Farmer', location: 'Dharwad, KA', joined: 'Jul 2026', onboarded: true, bio: 'Smallholder, sells at Dharwad APMC. Frustrated by post-harvest losses.' },
  { id: 'u_farmer3', name: 'Vilas Jadhav', role: 'farmer', avatar: '🧑‍🌾', title: 'Citrus Farmer', userType: 'Farmer', location: 'Nagpur, MH', joined: 'Jan 2026', onboarded: true },
  { id: 'u_citizen1', name: 'Anita Deshmukh', role: 'citizen', avatar: '👩', title: 'Village Committee Volunteer', userType: 'Community Volunteer', location: 'Baramati, MH', joined: 'Jun 2026', onboarded: true },
  { id: 'u_health1', name: 'Dr. Kavita Rao', role: 'health_worker', avatar: '👩‍⚕️', title: 'Medical Officer · Rural PHC', userType: 'PHC / Health Institution', location: 'Bidar, KA', joined: 'Apr 2026', verified: true, onboarded: true, bio: 'Runs OPD + follow-up for 14 villages. Paper registers, no follow-up tracking.' },
  { id: 'u_health2', name: 'Dr. Imran Shaikh', role: 'health_worker', avatar: '👨‍⚕️', title: 'CHC Coordinator', userType: 'Community Health Centre', location: 'Osmanabad, MH', joined: 'May 2026', verified: true, onboarded: true },

  // Students
  { id: 'u_s1', name: 'Aarav Kulkarni', role: 'student', avatar: '👨‍🎓', title: 'B.Tech Agriculture · 3rd Year', branch: 'Agriculture', institution: 'MPKV Rahuri', location: 'Rahuri, MH', skills: ['Crop Disease Identification', 'Soil Science', 'Field Data Collection', 'Agri Extension'], interests: ['Precision Agriculture', 'Plant Health'], domains: ['agri'], projects: ['Soil moisture mapper (college project)', 'IPM survey, 40 farms'], availability: '15 hrs/week', projectType: 'Field-ready tools', joined: 'Feb 2026', onboarded: true, email: 'aarav@example.edu' },
  { id: 'u_s2', name: 'Maitreyee Joshi', role: 'student', avatar: '👩‍💻', title: 'B.Tech CSE (AI/ML) · Final Year', branch: 'CSE — AI/ML', institution: 'COEP Technological University', location: 'Pune, MH', skills: ['Python', 'Machine Learning', 'Image Classification', 'Model Deployment', 'Data Analysis'], interests: ['AI for Social Good', 'Computer Vision'], domains: ['agri', 'health'], projects: ['Plant disease classifier (coursework)', 'Hospital queue forecaster'], availability: '20 hrs/week', projectType: 'Applied AI products', joined: 'Feb 2026', onboarded: true, email: 'maitreyee@example.edu' },
  { id: 'u_s3', name: 'Riya Sharma', role: 'student', avatar: '👩‍🔬', title: 'B.Tech Biotechnology · 2nd Year', branch: 'Biotechnology', institution: 'VIT Pune', location: 'Pune, MH', skills: ['Pathogen Identification', 'PCR Basics', 'Lab Protocols', 'Plant Tissue Culture'], interests: ['Plant Pathogens', 'Diagnostics'], domains: ['agri', 'health'], projects: ['Antimicrobial assay mini-project'], availability: '10 hrs/week', projectType: 'Lab + research support', joined: 'Mar 2026', onboarded: true },
  { id: 'u_s4', name: 'Kabir Malhotra', role: 'student', avatar: '👨‍🔧', title: 'B.E. Electronics · 3rd Year', branch: 'Electronics & IoT', institution: 'Walchand College Sangli', location: 'Sangli, MH', skills: ['Embedded Systems', 'Sensor Integration', 'LoRa', 'Circuit Design', 'Firmware'], interests: ['Agri IoT', 'Medical Devices'], domains: ['agri', 'health'], projects: ['Solar soil sensor node', 'Smart drip controller'], availability: '12 hrs/week', projectType: 'Hardware prototypes', joined: 'Feb 2026', onboarded: true },
  { id: 'u_s5', name: 'Devika Nair', role: 'student', avatar: '👩‍🎨', title: 'B.Des UX · 3rd Year', branch: 'Design (UX)', institution: 'MIT Institute of Design', location: 'Pune, MH', skills: ['Figma', 'User Research', 'Accessibility', 'Prototyping', 'Hindi/Marathi UX Copy'], interests: ['Inclusive Design', 'Rural UX'], domains: ['agri', 'health'], projects: ['ASHA worker app redesign study'], availability: '8 hrs/week', projectType: 'Field-tested interfaces', joined: 'Apr 2026', onboarded: true },
  { id: 'u_s6', name: 'Arjun Reddy', role: 'student', avatar: '👨‍🏭', title: 'B.Tech Mechanical · Final Year', branch: 'Mechanical', institution: 'NIT Warangal', location: 'Warangal, TS', skills: ['CAD', '3D Printing', 'Machine Design', 'Maintenance Planning'], interests: ['Farm Machinery', 'Appropriate Tech'], domains: ['agri'], projects: ['Low-cost maize sheller'], availability: '14 hrs/week', projectType: 'Machines & tools', joined: 'Mar 2026', onboarded: true },
  { id: 'u_s7', name: 'Sneha Kulkarni', role: 'student', avatar: '👩‍📊', title: 'M.Sc Data Science · 1st Year', branch: 'Data Science & Statistics', institution: 'IISER Pune', location: 'Pune, MH', skills: ['Statistics', 'R', 'Data Visualization', 'Survey Design', 'Epidemiology Basics'], interests: ['Public Health Analytics'], domains: ['agri', 'health'], projects: ['Anganwadi growth-data study'], availability: '10 hrs/week', projectType: 'Evidence & evaluation', joined: 'Apr 2026', onboarded: true },
  { id: 'u_s8', name: 'Vikram Hegde', role: 'student', avatar: '🧑‍⚕️', title: 'B.Tech Biomedical · Final Year', branch: 'Biomedical Engineering', institution: 'Manipal Institute of Technology', location: 'Manipal, KA', skills: ['Medical Device Basics', 'Sensor Calibration', 'ISO 13485 Awareness', 'MATLAB'], interests: ['Rural Medical Devices'], domains: ['health'], projects: ['Infant warmer alarm retrofit'], availability: '16 hrs/week', projectType: 'Clinical engineering', joined: 'Feb 2026', onboarded: true },
  { id: 'u_s9', name: 'Farhan Ali', role: 'student', avatar: '🧑‍💻', title: 'B.Tech CSE · 3rd Year', branch: 'CSE — Software', institution: 'SGGS Nanded', location: 'Nanded, MH', skills: ['Flutter', 'React', 'Offline-first Apps', 'APIs', 'Firebase'], interests: ['Offline-first Products'], domains: ['agri', 'health'], projects: ['Kirana store ledger app'], availability: '18 hrs/week', projectType: 'Mobile + web apps', joined: 'Mar 2026', onboarded: true },

  // Faculty / Experts
  { id: 'u_f1', name: 'Dr. Sunanda Deshpande', role: 'faculty', avatar: '👩‍🏫', title: 'Associate Professor · Plant Pathology', institution: 'MPKV Rahuri', location: 'Rahuri, MH', expertise: ['Plant Pathology', 'Crop Disease Diagnostics', 'Fungicide Resistance'], experience: '20 years', domains: ['agri'], verified: true, onboarded: true },
  { id: 'u_f2', name: 'Dr. Rohan Kumar', role: 'faculty', avatar: '👨‍🔬', title: 'Assistant Professor · Agri-AI Lab', institution: 'IIT Bombay', location: 'Mumbai, MH', expertise: ['AI/ML', 'Computer Vision', 'Precision Agriculture'], experience: '9 years', domains: ['agri'], verified: true, onboarded: true },
  { id: 'u_f3', name: 'Dr. Meenal Kulkarni', role: 'faculty', avatar: '👩‍⚕️', title: 'Professor · Community Medicine', institution: 'Dr. DY Patil Medical College', location: 'Pune, MH', expertise: ['Public Health', 'Primary Healthcare Systems', 'Epidemiology'], experience: '18 years', domains: ['health'], verified: true, onboarded: true },
  { id: 'u_f4', name: 'Dr. Suresh Mane', role: 'faculty', avatar: '👨‍⚕️', title: 'Clinical Engineer · Biomedical Dept.', institution: 'AIIMS Nagpur', location: 'Nagpur, MH', expertise: ['Medical Equipment', 'Biomedical Engineering', 'Device Maintenance'], experience: '15 years', domains: ['health'], verified: true, onboarded: true },
  { id: 'u_f5', name: 'Prof. Leena George', role: 'faculty', avatar: '👩‍🌾', title: 'Professor · Post-harvest Technology', institution: 'Dr. PDKV Akola', location: 'Akola, MH', expertise: ['Post-harvest Technology', 'Cold Chain', 'Horticulture'], experience: '22 years', domains: ['agri'], verified: true, onboarded: true },

  // Industry (optional, need-based)
  { id: 'u_i1', name: 'Neeraj Shah', role: 'industry', avatar: '🧑‍💼', title: 'Founder · AgriSense Instruments (startup)', institution: 'AgriSense', location: 'Pune, MH', expertise: ['Sensor Products', 'Agri Hardware', 'Go-to-market'], experience: '12 years', domains: ['agri'], onboarded: true },
  { id: 'u_i2', name: 'Priya Menon', role: 'industry', avatar: '👩‍💼', title: 'Product Lead · MedTech MSME', institution: 'CarePoint Devices', location: 'Bengaluru, KA', expertise: ['Medical Device Product', 'Manufacturing', 'Compliance'], experience: '14 years', domains: ['health'], onboarded: true },
]

/* ───────────────────────── PROBLEMS ───────────────────────── */

export const PROBLEMS: Problem[] = [
  {
    id: 'p1',
    title: 'Repeated grape downy mildew outbreaks — farmers lose 30–40% of yield waiting for expert advice',
    description: 'Every monsoon, downy mildew hits our grape vines. By the time an expert visits or we reach the university lab, the disease has already spread across the farm. Most small farmers around me cannot identify the early signs on the underside of leaves, and we end up spraying blind — wasting money and losing 30–40% of the crop. We need a way to detect it early and get guidance the same day.',
    domain: 'agri', reporterId: 'u_farmer1', location: 'Nashik, Maharashtra', urgency: 'high', peopleAffected: 420,
    existingAttempts: 'Phone calls to Krishi Vigyan Kendra (slow); WhatsApp photos to a private agronomist (₹300 per query, unreliable); one pesticide dealer whose advice is biased.',
    contact: 'Ramesh Patil · +91 98••• ••210 · nashikgrapes@example.in',
    imageTags: ['leaf_underside_spots.jpg', 'vineyard_row.jpg'], docs: ['yield_loss_record_2025.pdf'], video: 'outbreak_walkthrough.mp4',
    status: 'In Progress', ai: 'done', createdAt: '2 Aug 2026', projectId: 'prj1',
  },
  {
    id: 'p2',
    title: 'Post-harvest tomato losses exceed 25% — no affordable cold storage within 30 km',
    description: 'Tomatoes spoil between harvest and market. Middlemen deduct heavily for damage. A shared small-scale cold room or even a simple sorting+crating system would save a large part of our income, but we do not know what is feasible for a farmer group of ~60 families.',
    domain: 'agri', reporterId: 'u_farmer2', location: 'Dharwad, Karnataka', urgency: 'medium', peopleAffected: 610,
    existingAttempts: 'Group approached a cold-storage company (too expensive); plastic crates bought once but poorly used without a sorting process.',
    contact: 'Savita Hosamani · +91 97••• ••443',
    imageTags: ['crates_damaged.jpg', 'market_queue.jpg'],
    status: 'Matched', ai: 'done', createdAt: '28 Aug 2026',
  },
  {
    id: 'p3',
    title: 'Shared farm equipment (rotavator, sprayer) often idle or broken — no local repair or booking system',
    description: 'Our village FPO owns a rotavator and two power sprayers, shared by 85 farmers. Bookings happen by word of mouth, machines break mid-season, and repairs mean travelling 40 km. Farmers miss the critical window for sowing/spraying.',
    domain: 'agri', reporterId: 'u_citizen1', location: 'Baramati, Maharashtra', urgency: 'medium', peopleAffected: 85,
    existingAttempts: 'A register book at the FPO office (often outdated); one repair trip per season on average.',
    contact: 'Anita Deshmukh · baramatifpo@example.in',
    status: 'Under Review', ai: 'done', createdAt: '5 Sep 2026',
  },
  {
    id: 'p4',
    title: 'Rural PHC patients skip follow-up visits — paper registers, no reminder or tracking system',
    description: 'Our PHC serves 14 villages. Patients with BP, diabetes and TB follow-ups routinely miss visits because there is no reminder mechanism and our paper register cannot flag who is overdue. Nurses spend hours reconciling registers. We are NOT looking for anything that stores clinical details — just visit reminders and attendance tracking.',
    domain: 'health', reporterId: 'u_health1', location: 'Bidar, Karnataka', urgency: 'high', peopleAffected: 3200,
    existingAttempts: 'ASHA workers phone patients manually (covers <20%); SMS from district system only for TB program.',
    contact: 'Dr. Kavita Rao · phc.bidar@example.gov.in',
    docs: ['register_photo_deidentified.jpg'],
    status: 'In Progress', ai: 'done', createdAt: '20 Aug 2026', projectId: 'prj2', sensitive: true,
  },
  {
    id: 'p5',
    title: 'Nebulizers & BP monitors at 6 sub-centers often uncalibrated or unserviceable for weeks',
    description: 'Devices fail calibration checks but no one knows until a nurse complains. Repair vendors take 2–6 weeks. We need a simple way to log device condition, flag failures early, and track repair status across 6 sub-centers.',
    domain: 'health', reporterId: 'u_health2', location: 'Osmanabad, Maharashtra', urgency: 'high', peopleAffected: 950,
    existingAttempts: 'Excel sheet maintained inconsistently by one staff member.',
    contact: 'Dr. Imran Shaikh · chc.osmanabad@example.gov.in',
    imageTags: ['device_sticker.jpg'],
    status: 'Expert Review', ai: 'done', createdAt: '15 Aug 2026', projectId: 'prj3', sensitive: true, hiddenFromDiscover: true,
  },
  {
    id: 'p6',
    title: 'Referral coordination PHC → district hospital: delays, lost paperwork, no status visibility',
    description: 'When we refer a patient to the district hospital, the paper referral slip is all we have. Families lose slips, hospitals have no confirmation, and follow-up loops back to us blind. We need coordination tracking, not clinical data exchange.',
    domain: 'health', reporterId: 'u_health1', location: 'Bidar → Kalaburagi, Karnataka', urgency: 'critical', peopleAffected: 1400,
    existingAttempts: 'Phone calls between MOs; WhatsApp photos of slips (inconsistent).',
    contact: 'Dr. Kavita Rao · phc.bidar@example.gov.in',
    status: 'Under Review', ai: 'done', createdAt: '10 Sep 2026', sensitive: true,
  },
  {
    id: 'p7',
    title: 'Fruit fly trap counts unreadable at scale — farmers need simple aggregated alerts',
    description: 'We installed pheromone traps but reading and recording counts weekly across 30+ orchards never happens consistently, so alerts come too late.',
    domain: 'agri', reporterId: 'u_farmer3', location: 'Nagpur, Maharashtra', urgency: 'medium', peopleAffected: 130,
    existingAttempts: 'Paper tally sheets; one NGO data entry attempt that stopped after 2 months.',
    contact: 'Vilas Jadhav · +91 90••• ••771',
    status: 'Solved', ai: 'done', createdAt: '12 Feb 2026', projectId: 'prj4', ratingAvg: 4.6, feedbackCount: 38,
  },
  {
    id: 'p8',
    title: 'White grub infestation rising in groundnut — farmers cannot identify early soil signs',
    description: 'Plants wilt in patches and by then grubs have already damaged roots. We need an early identification method and advisory before sowing next season.',
    domain: 'agri', reporterId: 'u_farmer2', location: 'Dharwad, Karnataka', urgency: 'high', peopleAffected: 240,
    existingAttempts: 'Soil drenching with chemicals after visible damage (too late, costly).',
    contact: 'Savita Hosamani · +91 97••• ••443',
    status: 'Under Review', ai: 'done', createdAt: '12 Sep 2026',
  },
]

/* ───────────────────────── PROJECTS ───────────────────────── */

export const PROJECTS: Project[] = [
  {
    id: 'prj1', problemId: 'p1', name: 'Smart Crop Disease Early Detection', domain: 'agri',
    objective: 'Give farmers same-day, photo-based downy mildew early detection with a treatment advisory validated by plant pathologists.',
    team: ['u_s1', 'u_s2', 'u_s3', 'u_s4', 'u_s5'], mentorId: 'u_f1',
    stage: 'Prototype', stageProgress: 70, validationStatus: 'Pending', createdAt: '9 Aug 2026', improvementCount: 0,
  },
  {
    id: 'prj2', problemId: 'p4', name: 'CareFollow — Rural Follow-up Companion', domain: 'health',
    objective: 'An offline-first visit reminder + attendance tracker for PHC follow-ups, with zero clinical data storage.',
    team: ['u_s7', 'u_s9', 'u_s5'], mentorId: 'u_f3',
    stage: 'Development', stageProgress: 45, validationStatus: 'Pending', createdAt: '30 Aug 2026', improvementCount: 0,
  },
  {
    id: 'prj3', problemId: 'p5', name: 'EquipCare — PHC Device Uptime Tracker', domain: 'health',
    objective: 'Simple device-condition logging, calibration flags and repair tracking across 6 sub-centers.',
    team: ['u_s8', 'u_s4', 'u_s2'], mentorId: 'u_f4',
    stage: 'Testing', stageProgress: 80, validationStatus: 'Requested', createdAt: '25 Aug 2026', improvementCount: 0,
  },
  {
    id: 'prj4', problemId: 'p7', name: 'TrapWatch — Fruit Fly Alert Aggregation', domain: 'agri',
    objective: 'Weekly trap-count photos → digitized counts → orchard-level alert SMS in Marathi.',
    team: ['u_s2', 'u_s6', 'u_s1'], mentorId: 'u_f5',
    stage: 'Deployment', stageProgress: 100, validationStatus: 'Validated', solutionStatus: 'Solved', createdAt: '20 Feb 2026', improvementCount: 1,
    impact: { peopleReached: 130, timeSaved: '6 hrs/week across 30 orchards', costReduction: '₹1,800/season pesticide overspray avoided', satisfaction: 4.6, adoption: '31 of 38 farmers active weekly' },
  },
]

/* ───────────────────────── TASKS ───────────────────────── */

export const TASKS: Task[] = [
  { id: 't1', projectId: 'prj1', title: 'Collect 2,000+ labeled leaf images (3 districts)', assigneeId: 'u_s1', status: 'Completed', deadline: '24 Aug 2026', priority: 'High', tag: 'Data' },
  { id: 't2', projectId: 'prj1', title: 'Research downy mildew progression & spray windows', assigneeId: 'u_s3', status: 'Completed', deadline: '26 Aug 2026', priority: 'Medium', tag: 'Research' },
  { id: 't3', projectId: 'prj1', title: 'Build CNN classifier v2 (target ≥92% field accuracy)', assigneeId: 'u_s2', status: 'In Progress', deadline: '30 Sep 2026', priority: 'High', tag: 'AI Model' },
  { id: 't4', projectId: 'prj1', title: 'Design low-literacy farmer interface (Marathi-first)', assigneeId: 'u_s5', status: 'In Progress', deadline: '2 Oct 2026', priority: 'Medium', tag: 'Design' },
  { id: 't5', projectId: 'prj1', title: 'Assemble LoRa field camera node (solar)', assigneeId: 'u_s4', status: 'Review', deadline: '28 Sep 2026', priority: 'High', tag: 'Hardware' },
  { id: 't6', projectId: 'prj1', title: 'Field-test prototype with 10 farmers', assigneeId: 'u_s1', status: 'To Do', deadline: '18 Oct 2026', priority: 'High', tag: 'Field' },

  { id: 't7', projectId: 'prj2', title: 'Interview 8 ASHA workers on reminder workflows', assigneeId: 'u_s7', status: 'Completed', deadline: '6 Sep 2026', priority: 'High', tag: 'Research' },
  { id: 't8', projectId: 'prj2', title: 'Offline-first app skeleton (Flutter)', assigneeId: 'u_s9', status: 'In Progress', deadline: '5 Oct 2026', priority: 'High', tag: 'App' },
  { id: 't9', projectId: 'prj2', title: 'Privacy review — ensure zero clinical data fields', assigneeId: 'u_s7', status: 'To Do', deadline: '10 Oct 2026', priority: 'Critical' as never, tag: 'Privacy' },
  { id: 't10', projectId: 'prj2', title: 'Low-literacy reminder UI mockups', assigneeId: 'u_s5', status: 'Review', deadline: '1 Oct 2026', priority: 'Medium', tag: 'Design' },

  { id: 't11', projectId: 'prj3', title: 'Map devices across 6 sub-centers', assigneeId: 'u_s8', status: 'Completed', deadline: '30 Aug 2026', priority: 'High', tag: 'Survey' },
  { id: 't12', projectId: 'prj3', title: 'QR-based condition logging prototype', assigneeId: 'u_s4', status: 'Completed', deadline: '8 Sep 2026', priority: 'High', tag: 'Hardware' },
  { id: 't13', projectId: 'prj3', title: 'Pilot in 2 sub-centers (4 weeks)', assigneeId: 'u_s8', status: 'In Progress', deadline: '6 Oct 2026', priority: 'High', tag: 'Pilot' },
  { id: 't14', projectId: 'prj3', title: 'Dashboard for CHC coordinator', assigneeId: 'u_s2', status: 'Review', deadline: '29 Sep 2026', priority: 'Medium', tag: 'Dashboard' },

  { id: 't15', projectId: 'prj4', title: 'Trap photo → count pipeline', assigneeId: 'u_s2', status: 'Completed', deadline: '10 Mar 2026', priority: 'High', tag: 'AI Model' },
  { id: 't16', projectId: 'prj4', title: 'Marathi SMS alert integration', assigneeId: 'u_s6', status: 'Completed', deadline: '20 Mar 2026', priority: 'High', tag: 'Field' },
  { id: 't17', projectId: 'prj4', title: 'Train 30 orchard owners on weekly photo', assigneeId: 'u_s1', status: 'Completed', deadline: '1 Apr 2026', priority: 'Medium', tag: 'Field' },
]

export const MILESTONES: Milestone[] = [
  { id: 'm1', projectId: 'prj1', title: 'Problem Validation', status: 'done', note: 'Expert + 20 farmer interviews confirmed early-detection gap' },
  { id: 'm2', projectId: 'prj1', title: 'Research', status: 'done', note: 'Dataset v3 collected; literature review complete' },
  { id: 'm3', projectId: 'prj1', title: 'Prototype', status: 'active', progress: 70, note: 'Classifier v2 at 89% val accuracy; UI draft done' },
  { id: 'm4', projectId: 'prj1', title: 'Field Testing', status: 'upcoming', note: '10 farms, Nashik cluster' },
  { id: 'm5', projectId: 'prj2', title: 'Problem Validation', status: 'done', note: 'PHC workflows mapped; privacy constraints agreed' },
  { id: 'm6', projectId: 'prj2', title: 'Research', status: 'done', note: '8 ASHA interviews; reminder timing study' },
  { id: 'm7', projectId: 'prj2', title: 'Prototype', status: 'active', progress: 45 },
  { id: 'm8', projectId: 'prj2', title: 'Field Testing', status: 'upcoming' },
  { id: 'm9', projectId: 'prj3', title: 'Problem Validation', status: 'done' },
  { id: 'm10', projectId: 'prj3', title: 'Prototype', status: 'done', progress: 100 },
  { id: 'm11', projectId: 'prj3', title: 'Field Testing', status: 'active', progress: 60, note: 'Pilot running in 2 sub-centers' },
  { id: 'm12', projectId: 'prj3', title: 'Expert Review', status: 'upcoming', note: 'Requested — awaiting Dr. Mane' },
  { id: 'm13', projectId: 'prj4', title: 'Prototype', status: 'done', progress: 100 },
  { id: 'm14', projectId: 'prj4', title: 'Field Testing', status: 'done' },
  { id: 'm15', projectId: 'prj4', title: 'Community Validation', status: 'done', note: '38 farmers rated 4.6/5 — Solved' },
]

/* ───────────────────────── COLLABORATION ───────────────────────── */

export const CHAT: ChatMessage[] = [
  { id: 'c1', projectId: 'prj1', authorId: 'u_s1', text: 'Uploaded the labeled dataset v3 — 2,180 images from 3 districts. Underside shots are now 40% of the set.', at: '27 Aug, 10:12' },
  { id: 'c2', projectId: 'prj1', authorId: 'u_s3', text: 'Nice. Lab confirmed two of our "suspected" samples were actually downy mildew at oil-spot stage — good for early detection classes.', at: '27 Aug, 11:40' },
  { id: 'c3', projectId: 'prj1', authorId: 'u_s2', text: 'Training v2 tonight. v1 confused early-stage with nutrient deficiency — adding those negatives to the set.', at: '27 Aug, 19:05' },
  { id: 'c4', projectId: 'prj1', authorId: 'u_f1', text: 'Reminder: the advisory must always show a "confirm with local KVK expert" step for positive detections. AI screens — humans confirm. 🌾', at: '28 Aug, 09:30' },
  { id: 'c5', projectId: 'prj1', authorId: 'u_s4', text: 'LoRa node prototype logs photos + temp/RH. Schematic in files — Kabir requests review before PCB order.', at: '29 Aug, 16:22' },
  { id: 'c6', projectId: 'prj1', authorId: 'u_s5', text: 'Draft farmer flow ready — 3 taps max, big icons, Marathi voice note playback. Feedback welcome in Mentor Feedback tab.', at: '30 Aug, 12:00' },
  { id: 'c7', projectId: 'prj1', authorId: 'u_s2', text: 'v2: 89% val accuracy. Main errors are low-light images. Suggest adding flash guidance for farmers.', at: '2 Sep, 21:14' },
  { id: 'c8', projectId: 'prj1', authorId: 'u_s1', text: 'Good idea — Devika is adding a photo guide. Field test with 10 farmers planned mid-Oct.', at: '3 Sep, 08:47' },

  { id: 'c9', projectId: 'prj2', authorId: 'u_s7', text: 'Reminder-window analysis: 2 days before + morning-of works best per ASHA interviews.', at: '8 Sep, 15:30' },
  { id: 'c10', projectId: 'prj2', authorId: 'u_f3', text: 'Please keep the app strictly visit-reminders + attendance. No symptoms, no diagnoses — that keeps it outside clinical-data rules.', at: '9 Sep, 10:02' },
  { id: 'c11', projectId: 'prj2', authorId: 'u_s9', text: 'Understood. Schema has only: patient code (opaque), visit date, status. Syncs when network returns.', at: '9 Sep, 11:15' },

  { id: 'c12', projectId: 'prj3', authorId: 'u_s8', text: 'Pilot week 2: 41 device logs, 3 calibration failures caught early. Coordinator dashboard draft in files.', at: '12 Sep, 17:45' },
  { id: 'c13', projectId: 'prj3', authorId: 'u_f4', text: 'Excellent. For the review, show me the calibration thresholds you used against manufacturer specs.', at: '13 Sep, 09:20' },
  { id: 'c14', projectId: 'prj3', authorId: 'u_s2', text: 'Dashboard now shows uptime % per device + repair SLA breaches. Snapshot uploaded.', at: '14 Sep, 20:03' },
]

export const FILES: FileItem[] = [
  { id: 'f1', projectId: 'prj1', name: 'downy_mildew_dataset_v3.zip', kind: 'Dataset', size: '480 MB', uploaderId: 'u_s1', at: '27 Aug', version: 3 },
  { id: 'f2', projectId: 'prj1', name: 'model_card_v2.pdf', kind: 'Document', size: '1.2 MB', uploaderId: 'u_s2', at: '2 Sep', version: 2 },
  { id: 'f3', projectId: 'prj1', name: 'farmer_app_flow.fig', kind: 'Design', size: '14 MB', uploaderId: 'u_s5', at: '30 Aug' },
  { id: 'f4', projectId: 'prj1', name: 'field_node_schematic_v2.pdf', kind: 'Document', size: '820 KB', uploaderId: 'u_s4', at: '29 Aug', version: 2 },
  { id: 'f5', projectId: 'prj2', name: 'asha_interview_summary.pdf', kind: 'Document', size: '640 KB', uploaderId: 'u_s7', at: '7 Sep' },
  { id: 'f6', projectId: 'prj3', name: 'calibration_thresholds.pdf', kind: 'Document', size: '510 KB', uploaderId: 'u_s8', at: '13 Sep' },
  { id: 'f7', projectId: 'prj3', name: 'uptime_dashboard_prototype.png', kind: 'Image', size: '2.1 MB', uploaderId: 'u_s2', at: '14 Sep' },
]

export const MENTOR_NOTES: MentorNote[] = [
  { id: 'n1', projectId: 'prj1', authorId: 'u_f1', text: 'Spray-window logic looks right, but your dataset is biased toward late-stage images — collect more oil-spot stage samples before field trials.', at: '1 Sep, 09:10', type: 'feedback' },
  { id: 'n2', projectId: 'prj1', authorId: 'u_f1', text: 'Flag: do not let the app recommend any specific pesticide brand. Use only IPM-aligned, university-published advisories.', at: '1 Sep, 09:14', type: 'flag' },
  { id: 'n3', projectId: 'prj2', authorId: 'u_f3', text: 'Good call keeping clinical data out. For the pilot, get written consent from the PHC in-charge and log it in your files.', at: '10 Sep, 10:30', type: 'feedback' },
  { id: 'n4', projectId: 'prj3', authorId: 'u_f4', text: 'Calibration thresholds match manufacturer specs — approved to proceed to the remaining 4 sub-centers after review meeting.', at: '15 Sep, 11:00', type: 'approval' },
]

export const REVIEWS: ExpertReview[] = [
  { id: 'r1', projectId: 'prj4', problemId: 'p7', expertId: 'u_f5', status: 'Approved', comment: 'Trap-count pipeline and Marathi alerts are sound. Advisory language verified against university IPM guidelines. Approve for community validation.', recommendations: ['Add weekly SMS digest for orchard groups', 'Publish count thresholds for Nagpur climate zone'], at: '2 Apr 2026' },
  { id: 'r2', projectId: 'prj3', problemId: 'p5', expertId: 'u_f4', status: 'Pending', comment: 'Review requested — evaluating calibration thresholds, pilot data and repair-SLA logic.', at: '15 Sep 2026' },
]

export const FEEDBACKS: Feedback[] = [
  { id: 'fb1', projectId: 'prj4', problemId: 'p7', userId: 'u_farmer3', role: 'farmer', answers: { useful: 5, easy: 4, addresses: 5 }, rating: 5, comment: 'We now get the alert before the swarm peaks. First season I did not lose a single crate to fruit fly.', at: '18 Apr 2026' },
  { id: 'fb2', projectId: 'prj4', problemId: 'p7', userId: 'u_citizen1', role: 'citizen', answers: { useful: 4, easy: 4, addresses: 4 }, rating: 4, comment: 'Very useful. Weekly photo habit took 2 weeks to build for older farmers.', at: '21 Apr 2026' },
  { id: 'fb3', projectId: 'prj4', problemId: 'p7', userId: 'u_farmer1', role: 'farmer', answers: { useful: 5, easy: 5, addresses: 4 }, rating: 5, comment: 'Simple and in Marathi. Request: also support grape pests next.', at: '25 Apr 2026' },
]

/* ───────────────────────── KNOWLEDGE GROUND ───────────────────────── */

export const KG_POSTS: KgPost[] = [
  { id: 'g1', community: 'agri', topic: 'Crop Disease Diagnostics', kind: 'Question', title: 'Best dataset sources for Indian grape leaf disease images beyond PlantVillage?', excerpt: 'PlantVillage images are too "clean" for field conditions. Where are people getting realistic Indian field images — ICAR? crowdsourced?', authorId: 'u_s2', replies: 6, upvotes: 24, at: '28 Aug 2026', projectId: 'prj1' },
  { id: 'g2', community: 'agri', topic: 'Plant Pathology', kind: 'Expert Insight', title: 'Reading downy mildew sporulation on the underside — 3 field cues students often miss', excerpt: '1) Oily/angular "oil-spot" lesions on top before any sporulation below. 2) White downy growth appears in humid dawn hours only. 3) Check 5 leaves per vine, not one.', authorId: 'u_f1', replies: 9, upvotes: 58, at: '25 Aug 2026' },
  { id: 'g3', community: 'agri', topic: 'Plant Pathology', kind: 'Resource', title: 'ICAR Grape Disease Compendium (2025) + standardized image capture guidelines', excerpt: 'University-published reference for lesion identification stages and photo standards — use this for dataset labeling consistency.', authorId: 'u_f1', replies: 2, upvotes: 41, at: '20 Aug 2026', attachment: 'grape_disease_compendium_2025.pdf' },
  { id: 'g4', community: 'agri', topic: 'Data Collection', kind: 'Discussion', title: 'Our field photo checklist: 5 frames, consistent angle, flash rules', excerpt: 'Sharing the protocol we built for prj1 — one overview, one underside, one close-up, one with flash, one with a coin for scale.', authorId: 'u_s1', replies: 4, upvotes: 19, at: '30 Aug 2026', projectId: 'prj1' },
  { id: 'g5', community: 'agri', topic: 'Announcements', kind: 'Announcement', title: 'Agri & Genetics community — expert clinic every 1st Saturday, 4 PM', excerpt: 'Bring field photos, dataset questions and prototype doubts. Dr. Deshpande and Dr. Kumar rotate as clinic leads.', authorId: 'u_admin', replies: 3, upvotes: 33, at: '1 Sep 2026' },
  { id: 'g6', community: 'agri', topic: 'Pest Management', kind: 'Question', title: 'Is white grub damage reversible if caught late in groundnut?', excerpt: 'Seeing wilt patches in my field now. Is treatment still worth it, or should I focus on next-season prevention?', authorId: 'u_farmer2', replies: 3, upvotes: 11, at: '13 Sep 2026' },

  { id: 'g7', community: 'health', topic: 'Primary Healthcare Systems', kind: 'Expert Insight', title: 'Designing follow-up tools PHC staff actually keep using — 5 lessons from immunization dashboards', excerpt: 'If a nurse needs >30 seconds per entry, the tool dies in week 2. Design for the register-reconciliation moment, not the demo.', authorId: 'u_f3', replies: 7, upvotes: 52, at: '5 Sep 2026' },
  { id: 'g8', community: 'health', topic: 'Medical Equipment', kind: 'Resource', title: 'WHO basic device maintenance checklist (mirrored, print-ready)', excerpt: 'Use alongside your calibration thresholds for BP monitors and nebulizers. English + Marathi translation included.', authorId: 'u_f4', replies: 2, upvotes: 37, at: '2 Sep 2026', attachment: 'who_device_maintenance_checklist.pdf' },
  { id: 'g9', community: 'health', topic: 'Medical Equipment', kind: 'Question', title: 'Acceptable drift thresholds for digital BP monitors in field conditions?', excerpt: 'For our sub-center tracker: is ±3 mmHg a reasonable flag threshold for arm devices, and what about high heat + dust?', authorId: 'u_s8', replies: 5, upvotes: 21, at: '10 Sep 2026', projectId: 'prj3' },
  { id: 'g10', community: 'health', topic: 'Health Data & Privacy', kind: 'Discussion', title: 'Paper register → tablet: pilot observations from 2 PHCs (fully de-identified)', excerpt: 'Aggregated only: entry time dropped 41% vs paper. No patient-level data shared anywhere — summary stats only, per community guidelines.', authorId: 'u_s7', replies: 6, upvotes: 29, at: '12 Sep 2026', projectId: 'prj2' },
  { id: 'g11', community: 'health', topic: 'Announcements', kind: 'Announcement', title: 'Healthcare community guidelines — zero patient identifiers, ever', excerpt: 'No names, faces, IDs, or record numbers in posts, images or datasets. De-identified aggregates only. Moderators will remove violations and notify the user.', authorId: 'u_admin', replies: 1, upvotes: 46, at: '1 Sep 2026' },
  { id: 'g12', community: 'health', topic: 'Cross-Domain', kind: 'Discussion', title: 'What healthcare tooling can borrow from plant-disease image pipelines', excerpt: 'Same recipe: constrained capture protocols + small curated datasets + expert-validated labels + confidence display + human confirmation step. «Focused within, connected across.»', authorId: 'u_s2', replies: 8, upvotes: 44, at: '8 Sep 2026' },
]

export const KG_REPLIES: KgReply[] = [
  { id: 'kr1', postId: 'g1', authorId: 'u_f2', text: 'ICAR-NCIPM shares some under request. But honestly, your own field collection (like Aarav\'s protocol post) beats everything — that\'s why your v2 is improving.', at: '29 Aug 2026' },
  { id: 'kr2', postId: 'g1', authorId: 'u_s3', text: 'The compendium in g3 has capture standards that fixed our labeling disagreements.', at: '29 Aug 2026' },
  { id: 'kr3', postId: 'g9', authorId: 'u_f4', text: '±3 mmHg is reasonable for arm devices per BHS protocol. Add a temperature warning above 40°C storage — dust is a bigger killer than drift; log error codes weekly.', at: '11 Sep 2026' },
  { id: 'kr4', postId: 'g9', authorId: 'u_s4', text: 'Thanks — adding both. I\'ll post the updated thresholds doc to the project files.', at: '11 Sep 2026' },
  { id: 'kr5', postId: 'g6', authorId: 'u_f1', text: 'Late detection: protect the remaining plants and prepare for next season (summer ploughing + clean seed). Treatment after wilting rarely pays back. Please post photos in a new question — I\'ll review.', at: '13 Sep 2026' },
]

/* ───────────────────────── NOTIFICATIONS ───────────────────────── */

export const NOTIFICATIONS: Notification[] = [
  { id: 'nt1', userId: 'u_s2', type: 'match', text: '92% skill match — Post-harvest tomato cold storage (Dharwad) needs your ML + data skills', at: '1 hr ago', read: false, link: '/problem/p2' },
  { id: 'nt2', userId: 'u_s2', type: 'deadline', text: 'Task due in 11 days: “Build CNN classifier v2” — Smart Crop Disease Early Detection', at: 'Today', read: false, link: '/project/prj1' },
  { id: 'nt3', userId: 'u_s2', type: 'expert', text: 'Dr. Sunanda Deshpande flagged a dataset bias in prj1 — see Mentor Feedback', at: 'Yesterday', read: false, link: '/project/prj1' },
  { id: 'nt4', userId: 'u_s2', type: 'kg', text: 'Dr. Rohan Kumar replied to your Knowledge Ground question', at: '2 days ago', read: true, link: '/knowledge' },
  { id: 'nt5', userId: 'u_s2', type: 'milestone', text: 'Prototype milestone is 70% complete — field testing coming up', at: '3 days ago', read: true, link: '/project/prj1' },
  { id: 'nt6', userId: 'u_s8', type: 'validation', text: 'Expert review requested for EquipCare — Dr. Suresh Mane will evaluate', at: '4 days ago', read: true, link: '/project/prj3' },
  { id: 'nt7', userId: 'u_farmer1', type: 'task', text: 'Your problem has an active team — prototype is 70% complete', at: '1 day ago', read: false, link: '/project/prj1' },
  { id: 'nt8', userId: 'u_f1', type: 'expert', text: 'Review request: Smart Crop Disease Early Detection prototype (due after field tests)', at: 'Today', read: false, link: '/project/prj1' },
  { id: 'nt9', userId: 'u_health1', type: 'solution', text: 'CareFollow entered development — you can track progress in My Problems', at: '1 week ago', read: true, link: '/project/prj2' },
  { id: 'nt10', userId: 'u_admin', type: 'system', text: '2 problems awaiting validation/routing: Referral coordination (Bidar), Farm equipment booking (Baramati)', at: 'Today', read: false, link: '/admin' },
  { id: 'nt11', userId: 'u_s1', type: 'invite', text: 'Team invitation: EquipCare dashboard needs field-data input — view details', at: '2 days ago', read: true, link: '/project/prj3' },
]

/* ───────────────── PROBLEM COMMUNITIES ───────────────── */

export const PROBLEM_COMMUNITIES: ProblemCommunity[] = [
  {
    id: 'pc1', problemId: 'p1', domain: 'agri',
    name: 'Nashik Grape Health Circle',
    purpose: 'Farmers, students and plant-pathology experts working together on downy mildew early detection — field photos, spray windows, outbreak reports and honest results.',
    memberIds: ['u_farmer1', 'u_farmer3', 'u_farmer2', 'u_s1', 'u_s2', 'u_s3', 'u_s5', 'u_f1', 'u_f2', 'u_citizen1'],
    coordinatorId: 'u_farmer1',
    createdAt: '4 Aug 2026',
    posts: [
      { id: 'cp1', communityId: 'pc1', authorId: 'u_f1', kind: 'Update', text: 'Monsoon advisory: current humidity is ideal for downy mildew sporulation. Photograph the underside of 5 leaves per vine at dawn — the team\'s screening model needs exactly these shots. Samples with oil-spot lesions top-side are highest priority.', at: '2 days ago', likes: 14 },
      { id: 'cp2', communityId: 'pc1', authorId: 'u_farmer3', kind: 'Question', text: 'My Nagpur citrus block shows similar oily spots — is the screening approach transferable to citrus or is the model grape-only for now?', at: '3 days ago', likes: 6 },
      { id: 'cp3', communityId: 'pc1', authorId: 'u_s2', kind: 'Offer Help', text: 'We are expanding the classifier to 3 more diseases this month. If anyone has clear underside photos with date + village name, send them here — labeled field data from your farms directly improves your local accuracy.', at: '5 days ago', likes: 19 },
      { id: 'cp4', communityId: 'pc1', authorId: 'u_farmer1', kind: 'Result', text: 'Update from my 2.5 acres: used the 5-frame photo protocol and got same-day guidance instead of waiting a week for a farm visit. Sprayed only the affected blocks — saved roughly ₹9,000 this round vs blanket spraying.', at: '1 week ago', likes: 31 },
      { id: 'cp5', communityId: 'pc1', authorId: 'u_s5', kind: 'Offer Help', text: 'Redesigning the photo-capture screen with bigger buttons and Marathi voice guidance. Looking for 2 farmers willing to test a paper mockup on their phones for 10 minutes — anyone free this week?', at: '1 week ago', likes: 8 },
    ],
    events: [
      { id: 'ce1', communityId: 'pc1', title: 'Dawn photo walk — vineyard scouting with the team', when: 'Sat 26 Sep · 6:30 AM', place: 'Ramesh\'s farm, Dindori Rd, Nashik', rsvps: ['u_farmer1', 'u_s1', 'u_s3', 'u_farmer3'] },
      { id: 'ce2', communityId: 'pc1', title: 'Expert clinic: reading sporulation signs (bring your photos)', when: 'Sat 3 Oct · 4:00 PM', place: 'Online · Marathi', rsvps: ['u_farmer2', 'u_s2', 'u_farmer1'] },
    ],
    resources: [
      { id: 'cr1', title: '5-frame field photo protocol (printable, Marathi + Hindi)', kind: 'Guide' },
      { id: 'cr2', title: 'ICAR Grape Disease Compendium 2025', kind: 'Reference' },
      { id: 'cr3', title: 'Spray window calendar — Nashik zone', kind: 'Calendar' },
    ],
  },
  {
    id: 'pc2', problemId: 'p5', domain: 'health',
    name: 'Bidar PHC Equipment Circle',
    purpose: 'PHC staff, biomedical students and clinical engineers keeping rural equipment alive — uptime logs, calibration thresholds, repair escalations. Zero patient data, ever.',
    memberIds: ['u_health1', 'u_health2', 'u_s8', 'u_s4', 'u_s7', 'u_f4', 'u_i2'],
    coordinatorId: 'u_health1',
    createdAt: '20 Aug 2026',
    posts: [
      { id: 'cp6', communityId: 'pc2', authorId: 'u_f4', kind: 'Update', text: 'Reminder from the expert review: ±3 mmHg is the right drift flag for arm BP monitors, but log error codes weekly — in Bidar\'s heat + dust, error codes predict failure better than drift. Template is in Resources.', at: '1 day ago', likes: 11 },
      { id: 'cp7', communityId: 'pc2', authorId: 'u_health2', kind: 'Question', text: 'Two nebulizer compressors at Osmanabad CHC show intermittent pressure loss. Log them here or open a separate problem? Coordination question for the circle.', at: '2 days ago', likes: 4 },
      { id: 'cp8', communityId: 'pc2', authorId: 'u_s8', kind: 'Offer Help', text: 'I will be at the Bidar PHC this Friday with the calibration kit. If any sub-center wants their BP monitors checked same-day, message here — I can carry 6 devices on the route.', at: '4 days ago', likes: 9 },
      { id: 'cp9', communityId: 'pc2', authorId: 'u_health1', kind: 'Result', text: 'Month 2 numbers for our 14 villages: device uptime is up from 71% to 89%, and repair turnaround dropped from 3 weeks to 6 days. The QR log took nurses under 30 seconds per entry after the redesign.', at: '6 days ago', likes: 27 },
    ],
    events: [
      { id: 'ce3', communityId: 'pc2', title: 'Calibration camp — bring devices from your sub-center', when: 'Fri 25 Sep · 10:00 AM', place: 'Bidar Rural PHC', rsvps: ['u_health1', 'u_s8', 'u_s4'] },
      { id: 'ce4', communityId: 'pc2', title: 'Review: uptime dashboard walkthrough with Dr. Mane', when: 'Tue 29 Sep · 5:00 PM', place: 'Online · English', rsvps: ['u_health2', 'u_s7'] },
    ],
    resources: [
      { id: 'cr4', title: 'WHO device maintenance checklist (EN + MR, print-ready)', kind: 'Checklist' },
      { id: 'cr5', title: 'Weekly error-code log template', kind: 'Template' },
      { id: 'cr6', title: 'Calibration thresholds quick card — BP / nebulizer / pulse-ox', kind: 'Reference' },
    ],
  },
]

/* Baseline stats for impact dashboard (prior cohorts) */
export const IMPACT_BASE = {
  problemsAllTime: 68,
  studentImpacted: 240,
  institutions: 12,
  history: [
    { m: 'Apr', solved: 2, partial: 1, projects: 4 },
    { m: 'May', solved: 3, partial: 1, projects: 6 },
    { m: 'Jun', solved: 2, partial: 2, projects: 7 },
    { m: 'Jul', solved: 4, partial: 1, projects: 9 },
    { m: 'Aug', solved: 3, partial: 2, projects: 11 },
    { m: 'Sep', solved: 5, partial: 1, projects: 12 },
  ],
}
