# SahayaK — App Flow Document

**Version:** 2.0 · **Date:** September 2026

> Flows below are annotated **[MVP]** where the step ships first in a simplified/manual form, and **[FULL]** where it's a later addition. Nothing here should be built as FULL before the MVP path has real usage.

---

## 1. Master Lifecycle

```
Draft → Submitted → AI Analyzed → [FULL: Matching] → Team Formed → In Progress
      → [FULL: Under Review gate] → Completed → Community Validation → Closed
```

MVP collapses "Matching" into "students browse and apply" and skips a formal Under-Review gate — the provider or admin marks a project Completed directly once satisfied.

## 2. Onboarding & Authentication **[MVP]**

```
Landing Page → "Get Started" → Choose Role
   (Provider / Student / Faculty / Industry*)
        → Signup (Supabase Auth) → Email verification
        → Role-specific profile fields
        → Role-based Dashboard
```
*Industry signup exists in the schema from day one but the role's dashboard/flow is FULL-stage — an early signup just sits ready for when that feature ships.* Admin is provisioned directly, not via public signup.

## 3. Provider Flow

```
Dashboard
  → "Submit a Challenge" → fill form → Submit → status: Submitted
      → [MVP] AI Analysis runs (single LLM call) → status: AI Analyzed
  → View challenge detail
      → See AI Analysis (category, priority, skills)
      → [MVP] See list of student applications received
      → [FULL] See AI-ranked Student Matches with score + reason
      → "Accept & Form Team" (MVP: manual pick from applicants;
         FULL: pull from AI matches) → status: Team Formed
  → Track Project → view task board + progress %
  → Mark Completed (MVP: provider's own call;
     FULL: gated on faculty approval)
  → Community Validation → Solved / Partially Solved / Not Solved
```

## 4. Student Flow

```
Dashboard
  → Edit profile (skills, interests)
  → "Project Opportunities"
      → [MVP] Browse all open challenges, filter by sector/skill
      → [FULL] "Matched for You" — AI-ranked with score + reason
      → Apply (optional note) → status: Pending
  → Notified: Accepted into a Team
  → "My Team" → Task board
      → Claim/update tasks (To Do → In Progress → Done)
      → [FULL] Milestones, AI roadmap suggestions, team chat, files
  → Project Completed → repeat until validated
  → "My Portfolio" → completed project appears with outcome
```

## 5. Faculty Flow **[MVP: thin]**

```
Dashboard
  → "My Teams" — teams you've been manually looped into
  → Open a team → leave feedback (free text)
  → [FULL] Approve/reject milestones; formal evaluation; capacity limits
```

## 6. Industry Flow **[FULL — not in MVP]**

```
Dashboard (exists, mostly empty at MVP)
  → [FULL] "Support Requests" — flagged challenges matching stated expertise
  → [FULL] "Offer Support" → mentorship / equipment / funding (funding is
     recorded as a fact, never processed as a transaction on-platform)
```

## 7. Admin Flow **[MVP: minimal]**

```
Dashboard
  → "Problems" — table of all challenges, manual status override
  → "Users" — verify Provider accounts
  → [FULL] "Community Validation" moderation queue
  → [FULL] Full Impact Dashboard / audit log
```

## 8. Cross-Cutting

**Notifications [FULL]:** MVP relies on you (the operator) checking in manually and emailing people directly; an automated notification system is a FULL-stage addition once the loop is proven worth automating.

**Community Validation [MVP]:** reachable once a project is marked Completed; scoped to the original provider only at MVP — widening to other beneficiaries is a FULL-stage open question.

**Impact Dashboard [MVP: simple counts]:** recalculates from a plain query on every load at MVP scale; becomes a scheduled materialized-view refresh only once data volume justifies it.
