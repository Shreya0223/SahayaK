# SahayaK — Technical Requirements Document (TRD)

**Version:** 2.0 · **Date:** September 2026

> Supersedes the v1.0 TRD's NestJS/Kubernetes/microservices design, which assumed a funded multi-person team. This version is built for a solo developer working in JS/TS, using managed services to absorb infrastructure work rather than building it by hand.

---

## 1. Architecture Overview

```
                 ┌─────────────────────────────────────┐
                 │        Next.js App (Vercel)          │
                 │  React UI  +  API routes/Server Acts │
                 └──────────────────┬────────────────────┘
                                    │
                 ┌──────────────────▼────────────────────┐
                 │              Supabase                 │
                 │  Postgres (+pgvector) · Auth · Storage │
                 │  Realtime (chat, live status)          │
                 └──────────────────┬────────────────────┘
                                    │
                 ┌──────────────────▼────────────────────┐
                 │        Hosted LLM API (e.g. Claude)    │
                 │  classification · match reasoning ·    │
                 │  roadmap suggestions · embeddings      │
                 └─────────────────────────────────────────┘
```

One deployable app. No separate backend service, no message queue, no container orchestration — all deliberately deferred until real usage proves they're needed.

## 2. Tech Stack & Rationale

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js (App Router), TypeScript | Frontend + backend in one deployable; matches your existing React/Node fluency directly, no new mental model |
| Styling | Tailwind CSS | Fast to build role-based dashboards; matches the design brief's token approach |
| Data layer | Supabase (Postgres + `pgvector`) | Full relational DB, semantic-search-ready, without standing up and operating Postgres yourself |
| Auth | Supabase Auth | Signup/login/email verification/roles out of the box; still just JWTs under the hood, nothing exotic |
| File storage | Supabase Storage | Challenge media, project files — no separate S3 setup |
| Realtime | Supabase Realtime | Chat and live status updates via Postgres change subscriptions — no separate WebSocket server |
| API layer | Next.js server actions / route handlers (tRPC optional) | Avoids hand-rolled REST boilerplate; tRPC is a small, worthwhile learning curve given your TS stack if you want end-to-end type safety |
| AI/LLM | Hosted LLM API, called directly from server actions | No separate AI microservice — a function call with a schema-validated (zod) response is enough at this scale |
| Hosting | Vercel | Deploys directly from your Next.js repo; free tier covers MVP traffic |
| Background jobs | None at MVP | LLM calls run synchronously inside the request, with a loading state in the UI. Add a queue (e.g., Inngest or a simple cron) only when real latency complaints show up |

**Explicitly not doing at MVP, and why:** NestJS (extra framework for a solo dev with no team to divide services across), Kubernetes (nothing here needs orchestration at this scale), Redis (Supabase's cache-adjacent features and Postgres cover MVP needs), a dedicated vector database (`pgvector` on the same Postgres instance is enough until you're at a scale most side projects never reach).

## 3. System Components (as code, not services)

- **Auth:** Supabase-managed; a `profiles` table (keyed to `auth.users.id`) carries role and role-specific fields.
- **Challenges module:** CRUD via server actions; a status field drives the state machine (see App Flow doc).
- **AI module:** two functions — `analyzeChallenge()` (classification) and `generateEmbedding()` (for the FULL-stage matching feature) — both plain server-side functions calling the LLM API, not separate services.
- **Project workspace module:** tasks CRUD; FULL stage adds milestones/files/chat.
- **Validation module:** records the provider's Solved/Partially/Not-Solved outcome.
- **Dashboard module:** aggregation queries against Postgres (a materialized view once real data volume justifies it; a plain `COUNT`/`GROUP BY` query is fine at MVP scale).

## 4. AI — MVP vs Full

**MVP:** `analyzeChallenge()` sends the challenge text to the LLM, gets back `{category, priority, complexity, required_skills[]}` validated against a zod schema, with one retry on a malformed response. Shown as-is on the challenge detail page. No async job, no confidence scoring yet.

**Full:** adds `recommended_team_size`, `industry_support_needed`, and confidence scoring; adds the matching engine (`pgvector` cosine similarity between challenge and student-profile embeddings, blended with explicit skill-tag overlap into a composite score); adds the on-demand Project Assistant (roadmap/tech-stack suggestions, advisory only, never auto-written into the workspace).

## 5. Non-Functional Requirements

- **Security:** RLS (Row-Level Security) policies in Supabase enforce role-based access at the database level — write these deliberately, don't rely on the frontend to hide what a role shouldn't see.
- **Healthcare data:** no schema field for patient name/ID/diagnosis; UI copy actively warns providers against entering patient-identifiable text in free-form fields.
- **Performance:** MVP target is "feels responsive," not a formal SLA — a synchronous LLM call with a visible loading state is an acceptable UX at this stage.
- **Backups:** Supabase's automatic daily backups are sufficient at MVP; revisit only if/when you're handling data you couldn't afford to lose.

## 6. Testing & Deployment

- Deploy: push to `main` → Vercel auto-deploys. A `staging` branch/preview deployment for anything risky.
- Testing: unit tests for the AI response validator and the status state-machine transitions; Playwright for the critical end-to-end journeys (see the separate E2E setup).
- No CI/CD pipeline complexity beyond "tests must pass before merge" at this scale — add more process only when a second developer joins.

## 7. Upgrade Path (when to revisit this document)

Move the AI calls to a background job when real users report waiting; move to a dedicated vector database only if `pgvector` query times degrade at real scale; consider NestJS/a separate service only if you bring on a backend-focused teammate who'd benefit from that structure. Don't pre-build any of this — each is a rewrite trigger, not a day-one requirement.
