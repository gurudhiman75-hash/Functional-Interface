CREATE TABLE IF NOT EXISTS content.current_affairs_question_localizations (
  id UUID PRIMARY KEY,
  generation_item_id UUID NOT NULL
    REFERENCES content.generation_run_items(id) ON DELETE CASCADE,
  source_generation_version_id UUID NOT NULL
    REFERENCES content.generation_item_versions(id) ON DELETE CASCADE,
  event_id UUID NOT NULL
    REFERENCES content.current_affairs_events(id) ON DELETE RESTRICT,
  fact_id UUID
    REFERENCES content.current_affairs_facts(id) ON DELETE SET NULL,
  language_code TEXT NOT NULL CHECK (language_code IN ('hi', 'pa')),
  status TEXT NOT NULL DEFAULT 'needs_editorial' CHECK (
    status IN ('ready', 'needs_editorial', 'manual')
  ),
  localized_payload JSONB,
  localization_method TEXT NOT NULL DEFAULT 'deterministic_v1' CHECK (
    localization_method IN ('deterministic_v1', 'manual')
  ),
  input_fingerprint TEXT NOT NULL,
  quality_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  reviewed_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT current_affairs_question_localizations_output_required CHECK (
    status = 'needs_editorial'
    OR jsonb_typeof(localized_payload) = 'object'
  ),
  CONSTRAINT current_affairs_question_localizations_fingerprint_format
    CHECK (input_fingerprint ~ '^[a-f0-9]{64}$'),
  UNIQUE (source_generation_version_id, language_code)
);

CREATE INDEX IF NOT EXISTS current_affairs_question_localizations_item_idx
  ON content.current_affairs_question_localizations(generation_item_id, language_code, updated_at DESC);

CREATE INDEX IF NOT EXISTS current_affairs_question_localizations_event_idx
  ON content.current_affairs_question_localizations(event_id, language_code, status, updated_at DESC);

CREATE INDEX IF NOT EXISTS current_affairs_question_localizations_review_idx
  ON content.current_affairs_question_localizations(language_code, status, updated_at DESC)
  WHERE status='needs_editorial';

COMMENT ON TABLE content.current_affairs_question_localizations IS
  'Hindi/Punjabi Current Affairs question drafts tied to one immutable English generation_item_version. They remain outside canonical question_translations until a later release checkpoint.';
