# SahayaK — Implementation Plan

**Version:** 2.0 · **Date:** September 2026

> Rewritten for a solo developer on the Next.js + Supabase stack. The earlier plan's 6-person, 2–3 week team sprint no longer applies if this is being built solo — that mismatch is called out directly rather than papered over.

---

## Top Priority: De-risk the Marketplace, Not the Tech

Before writing a line of code, the single biggest question is whether a real provider and real students will actually show up. Consider running a **manual pilot first**: find one real farmer/hospital contact, get one real problem description from them by phone or form, and manually recruit 2–3 students to work it — using a shared doc and a WhatsApp group instead of any software at all. If that doesn't work manually, no amount of AI matching will fix it. If it does work, you now have a real test case to build the MVP against instead of guessing at seed data.

## Phase 1 — Lean MVP (solo, realistic estimate: 3–5 weeks full-time / 6–10 weeks part-time)

**Week 1 — Foundation**
- Next.js + Supabase project setup, deployed to Vercel from day one (deploy early, not at the end).
- Auth + role-based profile completion (Provider, Student, Faculty).
- `challenges` table + Submit Challenge form.

**Week 2 — Core Loop**
- AI Analysis (single LLM call, zod-validated response) wired to challenge creation.
- Project Opportunities browse/filter + Apply.
- Manual "Accept & Form Team" action for providers/admin.

**Week 3 — Workspace & Validation**
- Task board (To Do/In Progress/Done) inside a project.
- Mark Completed → Community Validation (Solved/Partially/Not Solved).
- Basic Impact counts (simple queries, no dashboard polish yet).

**Weeks 4–5 (buffer / part-time weeks 6–10) — Real Usage**
- Run the actual pilot problem (from the manual test above, or a newly recruited one) through the real system end-to-end.
- Fix whatever breaks under real use — this always takes longer than the happy-path build did.
- Faculty feedback capability (free-text comments) if a real faculty contact is involved.

**Exit criteria:** one real problem, submitted by a real provider, is worked by a real student team through the actual platform, and validated with an honest outcome — not seeded data, not a simulated walkthrough.

## Phase 2 — Full Platform (only after Phase 1 shows real usage)

Build in this order, each gated on evidence the previous stage is actually being used, not on a calendar:

1. **Matching engine** (embeddings + scoring + reasons) — once enough real students and challenges exist for ranking to matter.
2. **Richer workspace** (milestones, files, chat, AI project assistant).
3. **Faculty evaluation flow** (formal milestone approval, capacity limits).
4. **Industry support** (only once there's a concrete case where a real project actually needs outside expertise).
5. **Notifications, full impact analytics, shareable student portfolios.**

Rough sizing if solo: 2–4 weeks per numbered item above, part-time-friendly since each is additive to a working system rather than a rewrite.

## If This Still Needs to Serve as an SIH Demo

Keep the MVP build and, separately, seed a demo dataset (fake but realistic challenges/students/teams) that exercises the FULL-stage UI even before it's wired to real logic — a demo doesn't need working AI matching, it needs to *look* like it works. Don't let demo polish consume the weeks that should go toward the real pilot; they serve different purposes and reusing the same seed data for both tends to blur that line.

## Cross-Phase Risks

| Risk | Notes |
|---|---|
| Solo capacity | This plan assumes no team. If a team materializes, Phase 2 compresses significantly — the earlier 6-person plan's estimates become relevant again |
| Real provider onboarding is slow | Start outreach in Week 1, not after the MVP is built — this is usually the longest pole, not the coding |
| LLM cost/reliability at real scale | Trivial at MVP volume; revisit only if usage grows meaningfully |
| Healthcare data-privacy review | Needed before any real hospital/clinic data flows through, not deferred to "later" |
