CREATE TABLE IF NOT EXISTS content.learning_resources (
  id UUID PRIMARY KEY,
  public_code TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('current_affairs', 'notes', 'formula_sheet')),
  format TEXT NOT NULL CHECK (format IN ('article', 'pdf')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  language_code TEXT NOT NULL DEFAULT 'en',
  content_date DATE,
  body_markdown TEXT,
  content_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT learning_resources_public_code_format
    CHECK (public_code ~ '^[A-Z][A-Z0-9_-]{2,79}$'),
  CONSTRAINT learning_resources_content_required
    CHECK (
      NULLIF(BTRIM(COALESCE(body_markdown, '')), '') IS NOT NULL
      OR NULLIF(BTRIM(COALESCE(content_url, '')), '') IS NOT NULL
    ),
  CONSTRAINT learning_resources_safe_url
    CHECK (content_url IS NULL OR content_url ~ '^https://'),
  CONSTRAINT learning_resources_publish_state
    CHECK (
      (status = 'published' AND published_at IS NOT NULL)
      OR status <> 'published'
    ),
  CONSTRAINT learning_resources_expiry_order
    CHECK (expires_at IS NULL OR published_at IS NULL OR expires_at > published_at)
);

CREATE TABLE IF NOT EXISTS content.learning_resource_exams (
  resource_id UUID NOT NULL
    REFERENCES content.learning_resources(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL
    REFERENCES catalog.exams(id) ON DELETE CASCADE,
  PRIMARY KEY (resource_id, exam_id)
);

CREATE INDEX IF NOT EXISTS learning_resources_live_idx
  ON content.learning_resources(status, published_at DESC, content_date DESC);

CREATE INDEX IF NOT EXISTS learning_resources_language_idx
  ON content.learning_resources(language_code, status, published_at DESC);

CREATE INDEX IF NOT EXISTS learning_resource_exams_exam_idx
  ON content.learning_resource_exams(exam_id, resource_id);

COMMENT ON TABLE content.learning_resources IS
  'Publishable learner-facing articles and PDFs. Draft rows never appear in learner APIs.';

COMMENT ON TABLE content.learning_resource_exams IS
  'Optional canonical exam targeting for learning resources. No rows means the resource is general.';
