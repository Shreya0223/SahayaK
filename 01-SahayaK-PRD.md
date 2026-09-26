# SahayaK — Product Requirements Document (PRD)

**Version:** 2.0 · **Date:** September 2026 · **Sectors:** Agriculture & Healthcare

> **Assumptions this version is built on** (unconfirmed — flag anything wrong):
> Full platform vision retained, but scoped MVP-first. No payment/funds-movement features. Provider + Student experience is the v1 priority; Faculty is second; Industry and Admin are thin at first. Written as a real, deployable product — not only a hackathon demo, though it needs to demo well too. Solo-developer build, JS/TS stack.

---

## 1. Vision

SahayaK connects real, unresolved problems from farms, hospitals, and clinics with university students who have the skills to build working solutions — with AI handling triage and matching, faculty providing academic rigor, and industry stepping in only when specialist expertise is genuinely needed.

SahayaK is **not** a grievance portal. Every problem that enters is expected to leave as a shipped solution, a validated outcome, and a portfolio entry.

## 2. Problem Statement

Three groups operate in isolation: providers with real operational problems and no channel to affordable custom technology; students with technical skill and no supply of real, validated problems; faculty and industry with no structured way to find, mentor, and evaluate applied student work. SahayaK is the connective layer.

**The real risk isn't the software — it's the two-sided marketplace cold start.** Both a real provider and a critical mass of students need to show up close together in time, or the platform is empty on both sides. This PRD is written to de-risk that first, before investing in the automation layer.

## 3. MVP Scope Decision

Rather than build all 13 originally-envisioned features at once, this version separates:

- **MVP (Lean Core Loop):** tests whether a real provider will submit a real problem and real students will follow it through to something usable. Manual where automation isn't yet proven necessary.
- **Full Platform:** the complete vision, built out once the core loop has shown real usage.

Every feature below is tagged accordingly.

## 4. Target Users & Personas

**Provider — Farmer or Hospital/Clinic Administrator.** Needs to describe a problem in plain language, trust someone competent is working on it, and — for healthcare — never has to enter patient-identifiable data.

**Student.** Needs real problems for a portfolio, a clear sense of why they were matched, teammates, and mentorship that counts for something. *(Primary persona alongside Provider for v1.)*

**Faculty.** Needs visibility into progress without micromanaging, and a lightweight way to evaluate/approve. *(v1: thinner — feedback and approval only, no capacity-management tooling yet.)*

**Industry.** Contributes expertise/equipment/funding only where flagged as needed. *(Deferred past MVP.)*

**Admin.** Oversees quality and platform health. *(v1: minimal — a way to see everything and intervene, not a full analytics suite.)*

## 5. Scope

**In scope:** Agriculture and Healthcare only. The lifecycle Problem → AI Analysis → Student Matching → Team → Solution → Community Validation → Impact. AI as an assistive layer, never as the entity that builds or approves a solution.

**Explicitly out of scope (all versions):**
- Generic civic complaints/grievance redressal.
- Medical diagnosis, clinical decision support, or any patient-identifiable health data.
- Sectors outside Agriculture and Healthcare.
- **Any payment, funds transfer, invoicing, or procurement processing** — no subscriptions, no sponsorship deposits, no industry-funding transactions move through the platform. If money changes hands (e.g., an industry partner funds equipment), that's arranged and processed off-platform; SahayaK only records that a contribution was made.
- Industry involvement as a mandatory gate on any project.

## 6. Core User Flow

1. **Problem** — a provider submits a challenge.
2. **AI Analysis** — classification of category, priority, complexity, required skills, and (MVP: manual toggle; Full: AI-flagged) whether industry input is likely needed.
3. **Student Matching** — MVP: a ranked/filterable open list students browse and apply to. Full: AI-scored matches with a stated reason, surfaced proactively to relevant students.
4. **Team** — MVP: provider/admin manually accepts applicants into a team. Full: AI-suggested team composition plus auto-assigned faculty mentor.
5. **Solution** — a shared workspace with tasks and progress. Full: adds milestones, files, chat, and an AI project assistant.
6. **Community Validation** — provider marks Solved / Partially Solved / Not Solved.
7. **Impact** — outcomes roll up to a dashboard and to student portfolios.

## 7. Feature Requirements

Tag key: **[MVP]** ship first · **[FULL]** build after the core loop shows real usage.

### 7.1 Authentication & Role-Based Dashboards **[MVP]**
Five roles, distinct dashboards. Email verification before submitting/applying.

### 7.2 Submit Challenge **[MVP]**
Title, description, sector, category, location, urgency; optional media. Triggers analysis automatically.

### 7.3 AI Problem Analysis **[MVP, simplified]**
MVP: a single LLM call returns category, priority, complexity, and required skills — shown as-is, editable by admin. Full: adds recommended team size and an industry-support flag, with confidence scoring and re-run history.

### 7.4 AI Student Matching **[MVP: browse: FULL: scored matching]**
MVP: students browse/filter all open challenges and apply directly — no AI ranking yet. Full: AI produces a per-student match score and a plain-language reason, and proactively surfaces the opportunity.

### 7.5 Project Opportunities (Browse, Filter, Apply) **[MVP]**
Filter by sector, category, skill tag; one-click apply with an optional note.

### 7.6 Multidisciplinary Team Formation **[MVP: manual; FULL: assisted]**
MVP: provider/admin manually accepts applicants into a team; faculty mentor assigned manually. Full: pulls from AI matches automatically, auto-assigns mentor by specialization.

### 7.7 Project Workspace **[MVP: tasks only; FULL: full workspace]**
MVP: a task board (To Do/In Progress/Done) and a visible progress percentage. Full: adds milestones with approval gates, file storage, and team chat.

### 7.8 AI Project Assistant **[FULL]**
On-request roadmap and tech-stack suggestions. Never auto-applied to the workspace.

### 7.9 Faculty Mentorship **[MVP: comment/approve; FULL: full evaluation]**
MVP: faculty can leave feedback and mark a project complete. Full: adds formal milestone-by-milestone approval and capacity management.

### 7.10 Need-Based Industry Support **[FULL]**
Deferred until the core loop is proven — industry involvement adds coordination overhead the MVP doesn't need.

### 7.11 Community Validation **[MVP]**
Three-state outcome (Solved/Partially Solved/Not Solved) with optional comment, available once a project is marked Completed.

### 7.12 Impact Dashboard **[MVP: basic counts; FULL: full analytics]**
MVP: totals for problems submitted, projects completed, students engaged. Full: sector/month breakdowns and beneficiary tracking.

### 7.13 Student Portfolio **[MVP: basic; FULL: shareable/rich]**
MVP: a list of a student's completed projects. Full: a polished, shareable public page.

## 8. Success Metrics

**MVP-stage (does this loop work at all?):**
- ≥1 real provider submits a real, usable problem.
- ≥1 real student team applies, is accepted, and produces something the provider can evaluate.
- Time from submission to team formed (should be days, not weeks, even done manually).
- Provider's honest validation outcome (Solved/Partially/Not) on at least one real project.

**Full-platform stage:**
- % of challenges reaching a validated outcome.
- Active teams and students with ≥1 completed project.
- Faculty and industry participation rates.
- Beneficiaries reached (self-reported at validation).

## 9. Non-Functional Requirements

Mobile-first and responsive (providers are often on a phone in the field). No patient-identifiable data in any field, enforced in the UI, not only the schema. Role-based access control enforced server-side. Accessible (WCAG 2.1 AA) core flows.

## 10. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Marketplace cold start (empty on one or both sides) | MVP is deliberately manual/concierge-heavy — a human (you) can broker the first few matches by hand while validating the concept |
| Healthcare data privacy exposure | Field-level restriction + UI copy warning against patient-identifiable entries + admin review before publishing |
| Low-quality problem submissions | Admin triage; AI flags incomplete submissions |
| Student teams stalling | Faculty escalation path once Full features land; MVP relies on manual check-ins |
| Scope creep back to all 13 features at once | This document's MVP/FULL tags are the guardrail — resist building FULL items before the MVP loop has real usage data |

## 11. Open Questions

- Who verifies a hospital/clinic's identity before their challenge goes live?
- Should community validation ever open beyond the original provider?
- At what real-usage signal do we start building the FULL-tagged features?
