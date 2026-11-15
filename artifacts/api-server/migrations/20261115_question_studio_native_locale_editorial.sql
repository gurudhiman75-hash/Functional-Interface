-- Review-only native language drafts. This migration is intentionally NOT auto-applied.
-- A draft references one exact immutable English generation-item version.
-- It never creates an approved Question Bank translation or student-visible item.
CREATE TABLE IF NOT EXISTS content.question_studio_native_locales (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_generation_version_id uuid NOT NULL REFERENCES content.generation_item_versions(id) ON DELETE RESTRICT,
  language_code varchar(2) NOT NULL CHECK (language_code IN ('hi','pa')),
  stem text NOT NULL,
  explanation text NOT NULL,
  options jsonb NOT NULL CHECK (jsonb_typeof(options) = 'array' AND jsonb_array_length(options) BETWEEN 2 AND 8),
  correct_index integer NOT NULL CHECK (correct_index BETWEEN 0 AND 7),
  status varchar(16) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','needs_fix','approved')),
  revision integer NOT NULL DEFAULT 1 CHECK (revision >= 1),
  change_reason text NOT NULL,
  editor_user_id uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  reviewer_user_id uuid REFERENCES identity.users(id) ON DELETE RESTRICT,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (source_generation_version_id, language_code)
);
CREATE INDEX IF NOT EXISTS question_studio_native_locales_editorial_idx
 ON content.question_studio_native_locales(source_generation_version_id,status);
-- Immutable audit trail of language edits and editorial decisions.
CREATE TABLE IF NOT EXISTS content.question_studio_native_locale_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  native_locale_id uuid NOT NULL REFERENCES content.question_studio_native_locales(id) ON DELETE RESTRICT,
  revision integer NOT NULL,
  action varchar(20) NOT NULL CHECK (action IN ('save_draft','approve','needs_fix','send_to_bank_review')),
  actor_user_id uuid NOT NULL REFERENCES identity.users(id) ON DELETE RESTRICT,
  reason text NOT NULL,
  snapshot jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS question_studio_native_locale_events_lookup_idx
 ON content.question_studio_native_locale_events(native_locale_id,created_at DESC);
