CREATE TABLE IF NOT EXISTS content.current_affairs_compilations (
  id UUID PRIMARY KEY,
  public_code TEXT NOT NULL UNIQUE,
  period_type TEXT NOT NULL CHECK (period_type IN ('daily', 'weekly', 'monthly')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  exam_family_key TEXT NOT NULL CHECK (
    exam_family_key IN ('ssc', 'banking', 'punjab', 'railways', 'general')
  ),
  language_code TEXT NOT NULL DEFAULT 'en',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (
    status IN ('draft', 'published', 'archived')
  ),
  event_count INTEGER NOT NULL DEFAULT 0 CHECK (event_count >= 0),
  learning_resource_id UUID
    REFERENCES content.learning_resources(id) ON DELETE SET NULL,
  question_run_id UUID
    REFERENCES content.generation_runs(id) ON DELETE SET NULL,
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT current_affairs_compilation_period_order
    CHECK (period_end >= period_start),
  CONSTRAINT current_affairs_compilation_code_format
    CHECK (public_code ~ '^CA-(D|W|M)-[0-9]{8}-[A-Z0-9_-]{2,24}$'),
  UNIQUE (period_type, period_start, period_end, exam_family_key, language_code)
);

CREATE TABLE IF NOT EXISTS content.current_affairs_compilation_events (
  compilation_id UUID NOT NULL
    REFERENCES content.current_affairs_compilations(id) ON DELETE CASCADE,
  event_id UUID NOT NULL
    REFERENCES content.current_affairs_events(id) ON DELETE RESTRICT,
  sort_order INTEGER NOT NULL CHECK (sort_order >= 1),
  relevance_score SMALLINT NOT NULL CHECK (relevance_score BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (compilation_id, event_id),
  UNIQUE (compilation_id, sort_order)
);

CREATE TABLE IF NOT EXISTS content.current_affairs_question_links (
  event_id UUID NOT NULL
    REFERENCES content.current_affairs_events(id) ON DELETE RESTRICT,
  fact_id UUID
    REFERENCES content.current_affairs_facts(id) ON DELETE SET NULL,
  generation_run_id UUID NOT NULL
    REFERENCES content.generation_runs(id) ON DELETE CASCADE,
  generation_item_id UUID NOT NULL
    REFERENCES content.generation_run_items(id) ON DELETE CASCADE,
  question_family TEXT NOT NULL CHECK (
    question_family IN ('CA-QL-001', 'CA-QL-002')
  ),
  fact_key TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (generation_item_id),
  UNIQUE (event_id, generation_item_id)
);

CREATE INDEX IF NOT EXISTS current_affairs_compilations_period_idx
  ON content.current_affairs_compilations(period_end DESC, period_type, exam_family_key, status);

CREATE INDEX IF NOT EXISTS current_affairs_compilation_events_event_idx
  ON content.current_affairs_compilation_events(event_id, compilation_id);

CREATE INDEX IF NOT EXISTS current_affairs_question_links_event_idx
  ON content.current_affairs_question_links(event_id, created_at DESC);

CREATE INDEX IF NOT EXISTS current_affairs_question_links_run_idx
  ON content.current_affairs_question_links(generation_run_id, generation_item_id);

COMMENT ON TABLE content.current_affairs_compilations IS
  'Reproducible daily, weekly and monthly Current Affairs compilation manifests linked to learner resources.';

COMMENT ON TABLE content.current_affairs_compilation_events IS
  'Frozen event membership and relevance ordering for a Current Affairs compilation.';

COMMENT ON TABLE content.current_affairs_question_links IS
  'Provenance bridge from verified Current Affairs facts/events into the existing Question Studio generation review lifecycle.';
