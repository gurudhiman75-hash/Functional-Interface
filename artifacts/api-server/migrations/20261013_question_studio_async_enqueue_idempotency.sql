-- Proposed only: do NOT apply before queue publisher, task receiver, and
-- end-to-end staging gates have passed. This migration makes enqueue retry
-- idempotency durable without changing existing Question Studio tables.
BEGIN;
CREATE TABLE IF NOT EXISTS content.generation_enqueue_idempotency (
  actor_firebase_uid text NOT NULL CHECK (length(actor_firebase_uid) BETWEEN 1 AND 128),
  idempotency_key text NOT NULL CHECK (length(idempotency_key) BETWEEN 8 AND 128),
  request_sha256 text NOT NULL CHECK (request_sha256 ~ '^[0-9a-f]{64}$'),
  generation_run_id uuid NOT NULL
    REFERENCES content.generation_runs(id) ON DELETE RESTRICT,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (actor_firebase_uid, idempotency_key),
  CONSTRAINT generation_enqueue_run_uq UNIQUE (generation_run_id)
);
CREATE INDEX IF NOT EXISTS generation_enqueue_created_at_idx
  ON content.generation_enqueue_idempotency(created_at);
COMMIT;
