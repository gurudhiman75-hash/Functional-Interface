ALTER TABLE content.current_affairs_events
  ADD COLUMN IF NOT EXISTS learner_authoring_status TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS learner_authoring_version_id UUID;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'current_affairs_events_learner_authoring_status_check'
  ) THEN
    ALTER TABLE content.current_affairs_events
      ADD CONSTRAINT current_affairs_events_learner_authoring_status_check
      CHECK (learner_authoring_status IN ('pending', 'ready', 'needs_editorial', 'manual'));
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS content.current_affairs_authoring_versions (
  id UUID PRIMARY KEY,
  event_id UUID NOT NULL
    REFERENCES content.current_affairs_events(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL CHECK (version_number >= 1),
  status TEXT NOT NULL CHECK (status IN ('ready', 'needs_editorial', 'manual')),
  learner_title TEXT,
  learner_summary TEXT,
  learner_one_liner TEXT,
  template_id TEXT,
  authoring_method TEXT NOT NULL DEFAULT 'deterministic_facts_v1' CHECK (
    authoring_method IN ('deterministic_facts_v1', 'manual')
  ),
  source_title_similarity NUMERIC(5,4) NOT NULL DEFAULT 0
    CHECK (source_title_similarity >= 0 AND source_title_similarity <= 1),
  input_fingerprint TEXT NOT NULL,
  input_fact_snapshot JSONB NOT NULL DEFAULT '[]'::jsonb,
  reasons JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT current_affairs_authoring_version_output_required CHECK (
    status = 'needs_editorial'
    OR (BTRIM(COALESCE(learner_title, '')) <> '' AND BTRIM(COALESCE(learner_summary, '')) <> '')
  ),
  CONSTRAINT current_affairs_authoring_input_fingerprint_format
    CHECK (input_fingerprint ~ '^[a-f0-9]{64}$'),
  UNIQUE (event_id, version_number)
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'current_affairs_events_learner_authoring_version_fk'
  ) THEN
    ALTER TABLE content.current_affairs_events
      ADD CONSTRAINT current_affairs_events_learner_authoring_version_fk
      FOREIGN KEY (learner_authoring_version_id)
      REFERENCES content.current_affairs_authoring_versions(id)
      ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS current_affairs_authoring_versions_event_idx
  ON content.current_affairs_authoring_versions(event_id, version_number DESC);

CREATE INDEX IF NOT EXISTS current_affairs_events_authoring_queue_idx
  ON content.current_affairs_events(status, learner_authoring_status, event_date DESC)
  WHERE status='verified';

COMMENT ON TABLE content.current_affairs_authoring_versions IS
  'Auditable source-independent learner wording generated from verified fact snapshots. Source article/headline text remains in evidence records, not learner copy.';

COMMENT ON COLUMN content.current_affairs_events.learner_authoring_status IS
  'Controls automatic learner-content eligibility independently from factual verification.';
