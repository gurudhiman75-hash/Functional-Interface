CREATE TABLE IF NOT EXISTS content.current_affairs_localizations (
  id UUID PRIMARY KEY,
  event_id UUID NOT NULL
    REFERENCES content.current_affairs_events(id) ON DELETE CASCADE,
  authoring_version_id UUID NOT NULL
    REFERENCES content.current_affairs_authoring_versions(id) ON DELETE CASCADE,
  language_code TEXT NOT NULL CHECK (language_code IN ('hi', 'pa')),
  status TEXT NOT NULL DEFAULT 'needs_editorial' CHECK (
    status IN ('ready', 'needs_editorial', 'manual')
  ),
  localized_title TEXT,
  localized_summary TEXT,
  localized_one_liner TEXT,
  template_id TEXT,
  localization_method TEXT NOT NULL DEFAULT 'deterministic_template_v1' CHECK (
    localization_method IN ('deterministic_template_v1', 'manual')
  ),
  input_fingerprint TEXT NOT NULL,
  fact_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb,
  quality_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  reviewed_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT current_affairs_localizations_output_required CHECK (
    status = 'needs_editorial'
    OR (
      BTRIM(COALESCE(localized_title, '')) <> ''
      AND BTRIM(COALESCE(localized_summary, '')) <> ''
    )
  ),
  CONSTRAINT current_affairs_localizations_fingerprint_format
    CHECK (input_fingerprint ~ '^[a-f0-9]{64}$'),
  UNIQUE (authoring_version_id, language_code)
);

CREATE INDEX IF NOT EXISTS current_affairs_localizations_event_language_idx
  ON content.current_affairs_localizations(event_id, language_code, updated_at DESC);

CREATE INDEX IF NOT EXISTS current_affairs_localizations_review_idx
  ON content.current_affairs_localizations(language_code, status, updated_at DESC)
  WHERE status='needs_editorial';

COMMENT ON TABLE content.current_affairs_localizations IS
  'Hindi/Punjabi learner wording tied to an immutable CP009 English authoring version, with parity/quality snapshots and no independent fact authoring.';
