-- CI-only minimal schema mirror for live application enqueue/claim/review SQL.
-- Only executes in GitHub Actions disposable Postgres 17. Neither Neon branch
-- nor production will be connected by this workflow.
CREATE SCHEMA content;
CREATE SCHEMA platform;
CREATE TYPE generation_run_status AS ENUM (
 'draft','queued','running','paused','validation','review',
 'partially_approved','approved','failed','cancelled'
);
CREATE TYPE generation_item_status AS ENUM ('unreviewed','needs_fix','approved','rejected');
CREATE TYPE audit_actor_type AS ENUM ('user','system','integration');

CREATE TABLE content.generation_runs (
  id uuid PRIMARY KEY,
  public_code varchar(96) NOT NULL UNIQUE,
  requested_by uuid,
  status generation_run_status NOT NULL DEFAULT 'draft',
  attempt_number integer NOT NULL DEFAULT 1,
  prompt_snapshot text NOT NULL,
  request_snapshot jsonb NOT NULL,
  provider varchar(128),
  model varchar(128),
  prompt_tokens integer NOT NULL DEFAULT 0,
  completion_tokens integer NOT NULL DEFAULT 0,
  estimated_cost_paise integer,
  actual_cost_paise integer,
  due_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  failure_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE content.generation_run_items (
  id uuid PRIMARY KEY,
  generation_run_id uuid NOT NULL REFERENCES content.generation_runs(id) ON DELETE RESTRICT,
  item_number integer NOT NULL,
  status generation_item_status NOT NULL DEFAULT 'unreviewed',
  current_version_number integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (generation_run_id,item_number)
);
CREATE TABLE content.generation_item_versions (
  id uuid PRIMARY KEY,
  generation_item_id uuid NOT NULL REFERENCES content.generation_run_items(id) ON DELETE RESTRICT,
  version_number integer NOT NULL,
  payload jsonb NOT NULL,
  provider_item_id varchar(200),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (generation_item_id,version_number)
);
CREATE TABLE platform.audit_events (
  id uuid PRIMARY KEY,
  actor_type audit_actor_type NOT NULL,
  actor_user_id uuid,
  action_key varchar(256) NOT NULL,
  entity_type varchar(120) NOT NULL,
  entity_id uuid NOT NULL,
  reason text,
  summary text NOT NULL,
  metadata jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE platform.outbox_events (
  id uuid PRIMARY KEY,
  aggregate_type varchar(120) NOT NULL,
  aggregate_id uuid NOT NULL,
  event_type varchar(256) NOT NULL,
  payload jsonb NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  available_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  attempts integer NOT NULL DEFAULT 0,
  last_error text
);
