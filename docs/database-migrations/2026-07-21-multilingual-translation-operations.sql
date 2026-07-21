-- Canonical multilingual translation operations
-- Additive PostgreSQL 17 migration for ExamTree.
-- This migration intentionally avoids procedural DO blocks so it can be parsed
-- by Neon migration tooling. It is safe to execute repeatedly.

ALTER TABLE catalog.languages
  ADD COLUMN IF NOT EXISTS direction varchar(3),
  ADD COLUMN IF NOT EXISTS script_code varchar(16),
  ADD COLUMN IF NOT EXISTS fallback_language_id uuid,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz;

UPDATE catalog.languages
SET direction = COALESCE(direction, 'ltr'),
    updated_at = COALESCE(updated_at, now()),
    script_code = CASE lower(code)
      WHEN 'en' THEN COALESCE(script_code, 'Latn')
      WHEN 'hi' THEN COALESCE(script_code, 'Deva')
      WHEN 'pa' THEN COALESCE(script_code, 'Guru')
      ELSE script_code
    END
WHERE direction IS NULL
   OR updated_at IS NULL
   OR script_code IS NULL;

ALTER TABLE catalog.languages
  ALTER COLUMN direction SET DEFAULT 'ltr',
  ALTER COLUMN direction SET NOT NULL,
  ALTER COLUMN updated_at SET DEFAULT now(),
  ALTER COLUMN updated_at SET NOT NULL;

ALTER TABLE catalog.languages
  DROP CONSTRAINT IF EXISTS languages_direction_check;
ALTER TABLE catalog.languages
  ADD CONSTRAINT languages_direction_check
  CHECK (direction IN ('ltr', 'rtl')) NOT VALID;
ALTER TABLE catalog.languages
  VALIDATE CONSTRAINT languages_direction_check;

ALTER TABLE catalog.languages
  DROP CONSTRAINT IF EXISTS languages_fallback_language_id_fkey;
ALTER TABLE catalog.languages
  ADD CONSTRAINT languages_fallback_language_id_fkey
  FOREIGN KEY (fallback_language_id)
  REFERENCES catalog.languages(id)
  ON DELETE SET NULL
  NOT VALID;
ALTER TABLE catalog.languages
  VALIDATE CONSTRAINT languages_fallback_language_id_fkey;

ALTER TABLE content.question_translations
  ADD COLUMN IF NOT EXISTS translator_user_id uuid,
  ADD COLUMN IF NOT EXISTS submitted_at timestamptz,
  ADD COLUMN IF NOT EXISTS quality_snapshot jsonb,
  ADD COLUMN IF NOT EXISTS created_at timestamptz,
  ADD COLUMN IF NOT EXISTS updated_at timestamptz;

UPDATE content.question_translations
SET quality_snapshot = COALESCE(quality_snapshot, '{}'::jsonb),
    created_at = COALESCE(created_at, now()),
    updated_at = COALESCE(updated_at, now())
WHERE quality_snapshot IS NULL
   OR created_at IS NULL
   OR updated_at IS NULL;

ALTER TABLE content.question_translations
  ALTER COLUMN quality_snapshot SET DEFAULT '{}'::jsonb,
  ALTER COLUMN quality_snapshot SET NOT NULL,
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN created_at SET NOT NULL,
  ALTER COLUMN updated_at SET DEFAULT now(),
  ALTER COLUMN updated_at SET NOT NULL;

ALTER TABLE content.question_translations
  DROP CONSTRAINT IF EXISTS question_translations_translator_user_id_fkey;
ALTER TABLE content.question_translations
  ADD CONSTRAINT question_translations_translator_user_id_fkey
  FOREIGN KEY (translator_user_id)
  REFERENCES identity.users(id)
  ON DELETE SET NULL
  NOT VALID;
ALTER TABLE content.question_translations
  VALIDATE CONSTRAINT question_translations_translator_user_id_fkey;

ALTER TABLE content.question_translations
  DROP CONSTRAINT IF EXISTS question_translations_status_check;
ALTER TABLE content.question_translations
  ADD CONSTRAINT question_translations_status_check
  CHECK (status IN ('draft', 'in_review', 'needs_fix', 'approved', 'rejected', 'archived'))
  NOT VALID;
ALTER TABLE content.question_translations
  VALIDATE CONSTRAINT question_translations_status_check;

CREATE TABLE IF NOT EXISTS content.question_translation_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_translation_id uuid NOT NULL
    REFERENCES content.question_translations(id) ON DELETE CASCADE,
  option_key varchar(32) NOT NULL,
  text text NOT NULL,
  sort_order integer NOT NULL CHECK (sort_order > 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT question_translation_options_translation_key
    UNIQUE (question_translation_id, option_key),
  CONSTRAINT question_translation_options_translation_order
    UNIQUE (question_translation_id, sort_order)
);

CREATE TABLE IF NOT EXISTS content.translation_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_text varchar(255) NOT NULL,
  language_id uuid NOT NULL REFERENCES catalog.languages(id) ON DELETE RESTRICT,
  preferred_text varchar(255) NOT NULL,
  forbidden_variants jsonb NOT NULL DEFAULT '[]'::jsonb,
  context_note text NOT NULL DEFAULT '',
  scope_taxonomy_node_id uuid REFERENCES catalog.taxonomy_nodes(id) ON DELETE SET NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES identity.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT translation_terms_forbidden_variants_array_check
    CHECK (jsonb_typeof(forbidden_variants) = 'array')
);

CREATE TABLE IF NOT EXISTS assessment.test_version_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_version_id uuid NOT NULL
    REFERENCES assessment.test_versions(id) ON DELETE CASCADE,
  language_id uuid NOT NULL REFERENCES catalog.languages(id) ON DELETE RESTRICT,
  title varchar(255) NOT NULL,
  description text NOT NULL DEFAULT '',
  instructions jsonb NOT NULL DEFAULT '{}'::jsonb,
  status varchar(32) NOT NULL DEFAULT 'draft',
  translator_user_id uuid REFERENCES identity.users(id) ON DELETE SET NULL,
  reviewer_user_id uuid REFERENCES identity.users(id) ON DELETE SET NULL,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  quality_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT test_version_translations_version_language_key
    UNIQUE (test_version_id, language_id),
  CONSTRAINT test_version_translations_status_check
    CHECK (status IN ('draft', 'in_review', 'needs_fix', 'approved', 'rejected', 'archived'))
);

CREATE TABLE IF NOT EXISTS assessment.test_section_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_section_id uuid NOT NULL
    REFERENCES assessment.test_sections(id) ON DELETE CASCADE,
  language_id uuid NOT NULL REFERENCES catalog.languages(id) ON DELETE RESTRICT,
  name varchar(255) NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT test_section_translations_section_language_key
    UNIQUE (test_section_id, language_id)
);

CREATE INDEX IF NOT EXISTS question_translations_language_status_idx
  ON content.question_translations (language_id, status, updated_at DESC);

CREATE INDEX IF NOT EXISTS question_translations_translator_idx
  ON content.question_translations (translator_user_id, status, updated_at DESC)
  WHERE translator_user_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS question_translation_options_translation_order_idx
  ON content.question_translation_options (question_translation_id, sort_order);

CREATE UNIQUE INDEX IF NOT EXISTS translation_terms_language_source_scope_key
  ON content.translation_terms (
    language_id,
    lower(source_text),
    COALESCE(scope_taxonomy_node_id, '00000000-0000-0000-0000-000000000000'::uuid)
  );

CREATE INDEX IF NOT EXISTS translation_terms_active_language_idx
  ON content.translation_terms (language_id, updated_at DESC)
  WHERE is_active;

CREATE INDEX IF NOT EXISTS test_version_translations_language_status_idx
  ON assessment.test_version_translations (language_id, status, updated_at DESC);

CREATE INDEX IF NOT EXISTS test_section_translations_section_idx
  ON assessment.test_section_translations (test_section_id, language_id);

INSERT INTO identity.permissions (key, description)
VALUES
  ('content.translations.read', 'View language coverage, translation queues, terminology and review history.'),
  ('content.translations.update', 'Create and edit question and test translations.'),
  ('content.translations.review', 'Assign, review, approve, reject and reopen translations.'),
  ('settings.languages.manage', 'Manage supported languages, exam mappings and terminology standards.')
ON CONFLICT (key) DO UPDATE
SET description = EXCLUDED.description;

WITH grants(role_key, permission_key) AS (
  VALUES
    ('super_admin', 'content.translations.read'),
    ('super_admin', 'content.translations.update'),
    ('super_admin', 'content.translations.review'),
    ('super_admin', 'settings.languages.manage'),
    ('content_admin', 'content.translations.read'),
    ('content_admin', 'content.translations.update'),
    ('content_admin', 'content.translations.review'),
    ('content_admin', 'settings.languages.manage'),
    ('content_author', 'content.translations.read'),
    ('content_author', 'content.translations.update'),
    ('content_reviewer', 'content.translations.read'),
    ('content_reviewer', 'content.translations.review'),
    ('test_manager', 'content.translations.read'),
    ('analyst', 'content.translations.read')
)
INSERT INTO identity.role_permissions (role_id, permission_id)
SELECT role.id, permission.id
FROM grants
JOIN identity.roles role ON role.key = grants.role_key
JOIN identity.permissions permission ON permission.key = grants.permission_key
ON CONFLICT DO NOTHING;
