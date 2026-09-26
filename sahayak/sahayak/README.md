# SahayaK

**From Societal Problems to Collaborative Solutions**

An AI-assisted problem-to-solution ecosystem for Agriculture & Healthcare.
Not a complaint portal: every problem becomes a structured, multidisciplinary project
taken through development → expert validation → community testing → impact measurement.

```
PROBLEM → EXPERTISE → PEOPLE → SOLUTION → VALIDATION → IMPACT
```

## Run it

```bash
cd sahayak
npm install
npm run dev      # http://localhost:5173
npm run build    # production build (dist/)
```

Requires Node 18+. No backend needed — state is an in-browser mock API (Zustand, persisted to localStorage). Reset the demo by clearing site data.

## 3-minute demo script

1. **Sign in → 🧑‍🌾 Farmer** (one-click). Report a new problem — fill the form, submit.
2. Watch **"Analyzing your problem…"** → AI Challenge Intelligence classifies it, sets priority, detects duplicates, identifies required skills.
3. **Sign in → 👩‍💻 Student**. Open the problem → *Show recommended members* → pick complementary students → **Build Team** → workspace is created.
4. In the workspace: move tasks across the board, send a team chat, upload a file, then **Submit for expert + community validation**.
5. **Sign in → 👩‍🏫 Expert**. Open `/review` → open the validation request → **Approve** (or request changes).
6. **Sign in → 🧑‍🌾 Farmer** again. Open the project → *Validation* tab → rate the prototype, leave field feedback → set **🟢 Solved** (or 🔴 Needs Improvement to trigger the BUILD → TEST → IMPROVE loop).
7. **Sign in → 🏛️ Admin**. See the problem pipeline, project monitoring, analytics and the audit trail. Check **Impact** for measured outcomes.

## Roles & RBAC

| Role | Home | Key permissions |
|---|---|---|
| Citizen / Farmer / Health worker | `/community` | Report problems, track, field-test & validate solutions |
| Student | `/student` | AI-matched problems, Build Team, workspace, tasks |
| Faculty / Domain expert | `/review` | Validate domain requirements, review milestones, approve solutions |
| Industry (optional) | `/industry` | Browse-only; help only when a team explicitly requests it |
| Admin / Government | `/admin` | Validate/reroute problems, monitor, analytics, audit & moderation |

Healthcare problems are flagged `sensitive`: contact details are hidden from students, no patient-identifiable fields exist anywhere, and privileged actions are audit-logged.

## Tech

Vite · React 19 · TypeScript (strict) · Tailwind CSS · Zustand (persisted) · React Router 7 · lucide-react

- `src/data/types.ts` — domain model
- `src/data/seed.ts` — realistic demo dataset (8 problems, 22 users, 4 projects, KG posts, feedback…)
- `src/data/store.ts` — mock API + deterministic AI analysis & matching engines
- `src/pages/*` — 17 screens wired to the store (no dead screens)

## Product principles baked into the UI

- «AI recommends; humans validate» — analysis panels always say who confirms.
- «The problem determines the required skills — not the student's branch.»
- «Students build the technology; qualified experts validate the domain.»
- Industry participation is optional and need-based — never a gate.
- «Technical Success ≠ Social Impact» — impact only counts after community validation.
