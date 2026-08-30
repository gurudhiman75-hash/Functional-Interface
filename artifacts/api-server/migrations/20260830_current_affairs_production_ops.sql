CREATE TABLE IF NOT EXISTS content.current_affairs_ops_runs (
  id UUID PRIMARY KEY,
  run_key TEXT NOT NULL UNIQUE,
  target_date DATE NOT NULL,
  trigger_mode TEXT NOT NULL CHECK (trigger_mode IN ('scheduled', 'manual')),
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'completed_with_errors', 'failed', 'skipped')),
  english_backfill_count INTEGER NOT NULL DEFAULT 0 CHECK (english_backfill_count >= 0),
  localized_backfill_count INTEGER NOT NULL DEFAULT 0 CHECK (localized_backfill_count >= 0),
  question_localization_count INTEGER NOT NULL DEFAULT 0 CHECK (question_localization_count >= 0),
  actions JSONB NOT NULL DEFAULT '[]'::jsonb,
  failure TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS current_affairs_ops_runs_target_idx
  ON content.current_affairs_ops_runs(target_date DESC, started_at DESC);

COMMENT ON TABLE content.current_affairs_ops_runs IS
  'CP025 bounded recovery audit. Recovery may backfill draft/current localization state only; it never approves releases, promotes questions or publishes learner content.';
