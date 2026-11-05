-- PROPOSED ONLY. Do not apply to production without an approved rollout.
-- Durable parent + child reservation. No trigger, dispatcher or publication.
BEGIN;
CREATE TABLE IF NOT EXISTS content.generation_bulk_operations (
  id uuid PRIMARY KEY,
  actor_firebase_uid text NOT NULL CHECK (length(actor_firebase_uid) BETWEEN 1 AND 128),
  requested_by uuid NOT NULL,
  idempotency_key text NOT NULL CHECK (length(idempotency_key) BETWEEN 8 AND 128),
  request_sha256 text NOT NULL CHECK (request_sha256 ~ '^[0-9a-f]{64}$'),
  canonical_request jsonb NOT NULL CHECK (jsonb_typeof(canonical_request) = 'object'),
  requested_count integer NOT NULL CHECK (requested_count BETWEEN 1 AND 250),
  child_count integer NOT NULL CHECK (child_count BETWEEN 1 AND 13),
  status text NOT NULL DEFAULT 'planned'
    CHECK (status IN ('planned','in_progress','completed','partial_failure','cancelled')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT qs_bulk_idempotency_unique UNIQUE (actor_firebase_uid,idempotency_key)
);
CREATE TABLE IF NOT EXISTS content.generation_bulk_children (
  operation_id uuid NOT NULL REFERENCES content.generation_bulk_operations(id) ON DELETE RESTRICT,
  batch_index integer NOT NULL CHECK (batch_index BETWEEN 0 AND 12),
  requested_count integer NOT NULL CHECK (requested_count BETWEEN 1 AND 20),
  selected_cp_ids jsonb NOT NULL CHECK (jsonb_typeof(selected_cp_ids) = 'array'),
  idempotency_key text NOT NULL CHECK (length(idempotency_key) BETWEEN 8 AND 128),
  generation_run_id uuid UNIQUE REFERENCES content.generation_runs(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'planned'
    CHECK (status IN ('planned','reserved','dispatch_requested','queued','running',
                      'review','completed','failed','cancelled','needs_reconciliation')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY(operation_id,batch_index),
  CONSTRAINT qs_bulk_child_idempotency_unique UNIQUE(idempotency_key),
  CONSTRAINT qs_bulk_child_run_status_check CHECK (
    (generation_run_id IS NULL AND status IN ('planned','needs_reconciliation','cancelled'))
    OR generation_run_id IS NOT NULL
  )
);
CREATE INDEX IF NOT EXISTS qs_bulk_parent_created_idx
  ON content.generation_bulk_operations(requested_by,created_at DESC);
COMMIT;
