CREATE TABLE IF NOT EXISTS content.note_approved_versions (
  id UUID PRIMARY KEY,
  job_id UUID NOT NULL UNIQUE REFERENCES content.note_authoring_jobs(id) ON DELETE RESTRICT,
  version_number INTEGER NOT NULL DEFAULT 1 CHECK (version_number >= 1),
  source_language TEXT NOT NULL,
  learner_title TEXT NOT NULL,
  learner_summary TEXT NOT NULL DEFAULT '',
  body_markdown TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  approval_fingerprint TEXT NOT NULL,
  brief_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  exam_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  section_manifest JSONB NOT NULL DEFAULT '[]'::jsonb,
  qa_manifest JSONB NOT NULL DEFAULT '[]'::jsonb,
  approved_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT note_approved_versions_content_hash CHECK (content_hash ~ '^[0-9a-f]{64}$'),
  CONSTRAINT note_approved_versions_approval_hash CHECK (approval_fingerprint ~ '^[0-9a-f]{64}$'),
  CONSTRAINT note_approved_versions_title_length CHECK (char_length(learner_title) BETWEEN 3 AND 200),
  CONSTRAINT note_approved_versions_body_length CHECK (char_length(body_markdown) BETWEEN 1 AND 100000),
  UNIQUE (job_id, version_number)
);

CREATE TABLE IF NOT EXISTS content.note_materializations (
  approved_version_id UUID PRIMARY KEY REFERENCES content.note_approved_versions(id) ON DELETE RESTRICT,
  resource_id UUID NOT NULL UNIQUE REFERENCES content.learning_resources(id) ON DELETE RESTRICT,
  materialized_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  materialized_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS content.note_localizations (
  id UUID PRIMARY KEY,
  approved_version_id UUID NOT NULL REFERENCES content.note_approved_versions(id) ON DELETE RESTRICT,
  language_code TEXT NOT NULL CHECK (language_code IN ('hi', 'pa')),
  state TEXT NOT NULL DEFAULT 'needs_editorial' CHECK (state IN ('needs_editorial', 'ready', 'materialized')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  body_markdown TEXT NOT NULL,
  source_content_hash TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  quality JSONB NOT NULL DEFAULT '{}'::jsonb,
  generation_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  materialized_resource_id UUID UNIQUE REFERENCES content.learning_resources(id) ON DELETE SET NULL,
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT note_localizations_source_hash CHECK (source_content_hash ~ '^[0-9a-f]{64}$'),
  CONSTRAINT note_localizations_content_hash CHECK (content_hash ~ '^[0-9a-f]{64}$'),
  CONSTRAINT note_localizations_title_length CHECK (char_length(title) BETWEEN 1 AND 240),
  CONSTRAINT note_localizations_body_length CHECK (char_length(body_markdown) BETWEEN 1 AND 100000),
  UNIQUE (approved_version_id, language_code)
);

CREATE INDEX IF NOT EXISTS note_approved_versions_job_idx
  ON content.note_approved_versions(job_id, approved_at DESC);
CREATE INDEX IF NOT EXISTS note_localizations_version_state_idx
  ON content.note_localizations(approved_version_id, state, language_code);

CREATE OR REPLACE FUNCTION content.prevent_note_approved_version_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'note_approved_versions are immutable; create a new authoring job/version instead';
END;
$$;

DROP TRIGGER IF EXISTS note_approved_versions_immutable_update ON content.note_approved_versions;
CREATE TRIGGER note_approved_versions_immutable_update
BEFORE UPDATE OR DELETE ON content.note_approved_versions
FOR EACH ROW EXECUTE FUNCTION content.prevent_note_approved_version_mutation();

CREATE OR REPLACE FUNCTION content.prevent_materialized_note_localization_edit()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF OLD.state = 'materialized' AND (
    OLD.title IS DISTINCT FROM NEW.title
    OR OLD.summary IS DISTINCT FROM NEW.summary
    OR OLD.body_markdown IS DISTINCT FROM NEW.body_markdown
    OR OLD.source_content_hash IS DISTINCT FROM NEW.source_content_hash
    OR OLD.content_hash IS DISTINCT FROM NEW.content_hash
    OR OLD.language_code IS DISTINCT FROM NEW.language_code
  ) THEN
    RAISE EXCEPTION 'materialized note localizations are frozen; create a replacement approved source version instead';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS note_localizations_materialized_freeze ON content.note_localizations;
CREATE TRIGGER note_localizations_materialized_freeze
BEFORE UPDATE ON content.note_localizations
FOR EACH ROW EXECUTE FUNCTION content.prevent_materialized_note_localization_edit();

COMMENT ON TABLE content.note_approved_versions IS
  'Immutable source-language Notes Studio learner versions frozen only after all section QA passes and editorial approval.';
COMMENT ON TABLE content.note_materializations IS
  'Exactly-once mapping from an immutable approved note version to its canonical draft learning resource.';
COMMENT ON TABLE content.note_localizations IS
  'Hindi/Punjabi learner-note localizations tied to one immutable approved source-language version; materialized rows are frozen.';
