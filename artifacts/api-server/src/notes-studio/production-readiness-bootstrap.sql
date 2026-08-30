CREATE SCHEMA IF NOT EXISTS identity;
CREATE SCHEMA IF NOT EXISTS content;
CREATE SCHEMA IF NOT EXISTS platform;
CREATE SCHEMA IF NOT EXISTS catalog;

CREATE TABLE IF NOT EXISTS identity.users (
  id UUID PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS catalog.exam_families (
  id UUID PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS catalog.exams (
  id UUID PRIMARY KEY,
  family_id UUID NOT NULL REFERENCES catalog.exam_families(id) ON DELETE RESTRICT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS catalog.exam_versions (
  id UUID PRIMARY KEY,
  exam_id UUID NOT NULL REFERENCES catalog.exams(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL DEFAULT 1,
  name TEXT NOT NULL,
  is_current BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS catalog.languages (
  id UUID PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  native_name TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS catalog.taxonomy_nodes (
  id UUID PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  node_type TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS catalog.taxonomy_edges (
  parent_id UUID NOT NULL REFERENCES catalog.taxonomy_nodes(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES catalog.taxonomy_nodes(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (parent_id, child_id)
);

CREATE TABLE IF NOT EXISTS catalog.exam_taxonomy_nodes (
  exam_version_id UUID NOT NULL REFERENCES catalog.exam_versions(id) ON DELETE CASCADE,
  taxonomy_node_id UUID NOT NULL REFERENCES catalog.taxonomy_nodes(id) ON DELETE CASCADE,
  display_name_override TEXT,
  target_coverage INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  PRIMARY KEY (exam_version_id, taxonomy_node_id)
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
