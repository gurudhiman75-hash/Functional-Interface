CREATE TABLE IF NOT EXISTS content.current_affairs_selected_processing_runs (
  id UUID PRIMARY KEY,
  target_date DATE NOT NULL,
  requested_by UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued' CHECK (
    status IN ('queued', 'running', 'completed', 'failed')
  ),
  stage TEXT NOT NULL DEFAULT 'queued',
  result JSONB,
  failure TEXT,
  started_at TIMESTAMPTZ,
  heartbeat_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS current_affairs_selected_processing_runs_recent_idx
  ON content.current_affairs_selected_processing_runs(target_date DESC, created_at DESC);

CREATE UNIQUE INDEX IF NOT EXISTS current_affairs_selected_processing_runs_active_date_idx
  ON content.current_affairs_selected_processing_runs(target_date)
  WHERE status IN ('queued', 'running');

COMMENT ON TABLE content.current_affairs_selected_processing_runs IS
  'Durable CP057 run ledger for manually selected Current Affairs processing. Browser requests start/poll runs; canonical approval, learner publication and Question Bank promotion remain separate authorities.';
