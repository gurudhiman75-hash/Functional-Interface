CREATE TABLE IF NOT EXISTS content.current_affairs_story_threads (
  id UUID PRIMARY KEY,
  public_code TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  anchor_event_id UUID NOT NULL
    REFERENCES content.current_affairs_events(id) ON DELETE RESTRICT,
  latest_event_id UUID NOT NULL
    REFERENCES content.current_affairs_events(id) ON DELETE RESTRICT,
  anchor_title TEXT NOT NULL,
  started_on DATE NOT NULL,
  latest_on DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'locked', 'archived')),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT current_affairs_story_threads_date_order CHECK (latest_on >= started_on),
  CONSTRAINT current_affairs_story_threads_public_code_format CHECK (
    public_code ~ '^CA-ST-[0-9]{8}-[A-F0-9]{8}$'
  )
);

CREATE TABLE IF NOT EXISTS content.current_affairs_story_thread_events (
  thread_id UUID NOT NULL
    REFERENCES content.current_affairs_story_threads(id) ON DELETE CASCADE,
  event_id UUID NOT NULL
    REFERENCES content.current_affairs_events(id) ON DELETE RESTRICT,
  member_role TEXT NOT NULL CHECK (member_role IN ('anchor', 'update')),
  similarity_score NUMERIC(6,5) NOT NULL DEFAULT 1 CHECK (similarity_score BETWEEN 0 AND 1),
  auto_linked BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (thread_id, event_id),
  UNIQUE (event_id)
);

CREATE INDEX IF NOT EXISTS current_affairs_story_threads_latest_idx
  ON content.current_affairs_story_threads(status, latest_on DESC, category);

CREATE INDEX IF NOT EXISTS current_affairs_story_thread_events_event_idx
  ON content.current_affairs_story_thread_events(event_id, thread_id);

COMMENT ON TABLE content.current_affairs_story_threads IS
  'Cross-day Current Affairs story/evolution threads. Rollups may collapse multiple verified events in one thread to the latest event inside the requested period.';

COMMENT ON COLUMN content.current_affairs_story_thread_events.similarity_score IS
  'Conservative deterministic same-story score recorded for audit. Anchor events use 1.0.';
