CREATE TABLE IF NOT EXISTS content.current_affairs_automation_runs (
  id UUID PRIMARY KEY,
  run_key TEXT NOT NULL UNIQUE,
  job_type TEXT NOT NULL CHECK (job_type IN ('feed_ingestion')),
  status TEXT NOT NULL DEFAULT 'running' CHECK (
    status IN ('running', 'completed', 'completed_with_errors', 'failed', 'skipped')
  ),
  slot_started_at TIMESTAMPTZ NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  source_count INTEGER NOT NULL DEFAULT 0 CHECK (source_count >= 0),
  success_count INTEGER NOT NULL DEFAULT 0 CHECK (success_count >= 0),
  failure_count INTEGER NOT NULL DEFAULT 0 CHECK (failure_count >= 0),
  candidate_created_count INTEGER NOT NULL DEFAULT 0 CHECK (candidate_created_count >= 0),
  candidate_updated_count INTEGER NOT NULL DEFAULT 0 CHECK (candidate_updated_count >= 0),
  stats JSONB NOT NULL DEFAULT '{}'::jsonb,
  failure_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE content.current_affairs_sources
  ADD COLUMN IF NOT EXISTS last_ingested_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS last_ingestion_status TEXT,
  ADD COLUMN IF NOT EXISTS last_ingestion_error TEXT;

CREATE INDEX IF NOT EXISTS current_affairs_automation_runs_recent_idx
  ON content.current_affairs_automation_runs(started_at DESC, job_type, status);

CREATE INDEX IF NOT EXISTS current_affairs_sources_ingestion_due_idx
  ON content.current_affairs_sources(is_active, ingestion_mode, last_ingested_at)
  WHERE feed_url IS NOT NULL;

COMMENT ON TABLE content.current_affairs_automation_runs IS
  'Idempotent scheduled Current Affairs automation runs. run_key prevents duplicate processing of the same schedule slot.';

COMMENT ON COLUMN content.current_affairs_sources.last_ingested_at IS
  'Most recent successful or attempted scheduled feed ingestion time for operational visibility.';
