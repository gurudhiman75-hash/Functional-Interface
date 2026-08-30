CREATE SCHEMA IF NOT EXISTS identity;
CREATE SCHEMA IF NOT EXISTS content;
CREATE SCHEMA IF NOT EXISTS platform;

CREATE TABLE IF NOT EXISTS identity.users (
  id UUID PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS content.learning_resources (
  id UUID PRIMARY KEY,
  public_code TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  format TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL DEFAULT '',
  language_code TEXT NOT NULL,
  content_date DATE,
  body_markdown TEXT,
  content_url TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS content.learning_resource_exams (
  resource_id UUID NOT NULL REFERENCES content.learning_resources(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL,
  PRIMARY KEY (resource_id, exam_id)
);
