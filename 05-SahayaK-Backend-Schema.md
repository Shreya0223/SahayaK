# SahayaK — Backend Schema

**Version:** 2.0 · **Date:** September 2026 · **Database:** Supabase (Postgres + `pgvector`)

> Tables are tagged **[MVP]** (build now) or **[FULL]** (add later — the MVP tables are designed so these bolt on without breaking anything). Auth is Supabase-managed (`auth.users`), so there's no hand-rolled `users` table or password hashing.

---

## 1. Entity Overview

```
auth.users (Supabase-managed)
  └─ profiles [MVP] ─┬─ provider_details [MVP]
                     ├─ student_details [MVP]
                     ├─ faculty_details [MVP]
                     └─ industry_details [FULL]

challenges [MVP] ─ ai_analyses [MVP] (1:1)
challenges >─ applications [MVP] ─< profiles (students)
challenges >─ student_matches [FULL] ─< profiles (students)
challenges ─ teams [MVP] (1:1) ─< team_members [MVP]
teams ─ projects [MVP] (1:1) ─< tasks [MVP]
                              ├─< milestones [FULL]
                              ├─< project_files [FULL]
                              ├─< chat_messages [FULL]
                              └─< ai_assistant_suggestions [FULL]
projects ─< community_validations [MVP]
challenges/projects >─ industry_support_requests [FULL] ─< industry_contributions [FULL]
```

No table anywhere contains a patient name, patient ID, or clinical-record field. Healthcare challenges are restricted at the application layer to operational categories only.

## 2. MVP Tables

```sql
-- PROFILES (extends Supabase auth.users)

CREATE TYPE user_role AS ENUM ('provider', 'student', 'faculty', 'industry', 'admin');

CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        user_role NOT NULL,
  full_name   TEXT NOT NULL,
  phone       TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TYPE provider_type AS ENUM ('farmer', 'hospital', 'clinic');
CREATE TYPE sector AS ENUM ('agriculture', 'healthcare');

CREATE TABLE provider_details (
  profile_id        UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  provider_type     provider_type NOT NULL,
  organization_name TEXT,
  sector            sector NOT NULL,
  location          TEXT,
  verified_by_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE student_details (
  profile_id    UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  university    TEXT NOT NULL,
  department    TEXT NOT NULL,
  year_of_study SMALLINT,
  skills        TEXT[] NOT NULL DEFAULT '{}',
  interests     TEXT[] NOT NULL DEFAULT '{}',
  bio           TEXT,
  -- FULL: profile_embedding VECTOR(1536)  -- added when matching engine ships
  availability  TEXT NOT NULL DEFAULT 'available'
);

CREATE TABLE faculty_details (
  profile_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  university TEXT NOT NULL,
  department TEXT NOT NULL
);


-- CHALLENGES & ANALYSIS

CREATE TYPE urgency AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE challenge_status AS ENUM (
  'draft', 'submitted', 'ai_analyzed', 'team_formed',
  'in_progress', 'completed', 'closed'
);

CREATE TABLE challenges (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id  UUID NOT NULL REFERENCES profiles(id),
  title        TEXT NOT NULL,
  description  TEXT NOT NULL,
  sector       sector NOT NULL,
  category     TEXT NOT NULL,          -- operational categories only, esp. for healthcare
  location     TEXT,
  urgency      urgency NOT NULL DEFAULT 'medium',
  media_urls   TEXT[] DEFAULT '{}',     -- Supabase Storage object paths
  status       challenge_status NOT NULL DEFAULT 'draft',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_challenges_status ON challenges(status);

CREATE TYPE complexity AS ENUM ('low', 'medium', 'high');

CREATE TABLE ai_analyses (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id     UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  category         TEXT NOT NULL,
  priority         TEXT NOT NULL,
  required_skills  TEXT[] NOT NULL DEFAULT '{}',
  complexity       complexity NOT NULL,
  raw_model_output JSONB,
  -- FULL: recommended_team_size, industry_support_needed, confidence_score
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- APPLICATIONS & TEAMS

CREATE TYPE application_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');

CREATE TABLE applications (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  student_id   UUID NOT NULL REFERENCES profiles(id),
  message      TEXT,
  status       application_status NOT NULL DEFAULT 'pending',
  applied_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (challenge_id, student_id)
);

CREATE TABLE teams (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id      UUID NOT NULL UNIQUE REFERENCES challenges(id),
  faculty_mentor_id UUID REFERENCES profiles(id),
  name              TEXT NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE team_members (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id    UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES profiles(id),
  joined_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (team_id, student_id)
);


-- PROJECTS & TASKS

CREATE TYPE project_status AS ENUM ('active', 'completed');

CREATE TABLE projects (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id          UUID NOT NULL UNIQUE REFERENCES teams(id),
  challenge_id     UUID NOT NULL REFERENCES challenges(id),
  progress_percent SMALLINT NOT NULL DEFAULT 0,
  status           project_status NOT NULL DEFAULT 'active',
  started_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  actual_end_date  DATE
);

CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done');

CREATE TABLE tasks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  assigned_to UUID REFERENCES profiles(id),
  status      task_status NOT NULL DEFAULT 'todo',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- VALIDATION

CREATE TYPE validation_outcome AS ENUM ('solved', 'partially_solved', 'not_solved');

CREATE TABLE community_validations (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id   UUID NOT NULL REFERENCES projects(id),
  validated_by UUID NOT NULL REFERENCES profiles(id),
  outcome      validation_outcome NOT NULL,
  comment      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## 3. Row-Level Security (illustrative)

```sql
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;

-- Providers can read/write only their own challenges
CREATE POLICY "provider_owns_challenge" ON challenges
  FOR ALL USING (provider_id = auth.uid());

-- Anyone authenticated can read submitted/open challenges (for students to browse)
CREATE POLICY "students_browse_open_challenges" ON challenges
  FOR SELECT USING (status != 'draft');
```
Write policies like this per table before shipping — don't rely on the frontend to hide what a role shouldn't reach.

## 4. FULL-Stage Additions (bolt-on, non-breaking)

Add when the matching engine, workspace richness, industry flow, and faculty evaluation ship:
`profile_embedding VECTOR(1536)` on `student_details` · `student_matches` (challenge↔student score + reason) · `recommended_team_size`/`industry_support_needed`/`confidence_score` on `ai_analyses` · `milestones`, `project_files`, `chat_messages`, `ai_assistant_suggestions` under `projects` · `industry_details`, `industry_support_requests`, `industry_contributions` · `notifications` · `audit_logs`.

## 5. Notes

- `applications` and `team_members` carry `UNIQUE` constraints so a student can't double-apply or double-join.
- `teams.challenge_id` and `projects.team_id` are `UNIQUE` — one team per challenge, one project per team, enforced at the database level.
- No `beneficiaries_reached` table — it's a provider-reported number captured on `community_validations` when that field is added, since it can't be reliably derived from platform data alone.
