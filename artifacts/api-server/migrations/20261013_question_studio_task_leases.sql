-- PROPOSED ONLY. Do not apply to Neon until the task receiver and
-- idempotent review-commit implementation are validated on a temporary branch.
BEGIN;
CREATE TABLE IF NOT EXISTS content.generation_run_task_leases (
  generation_run_id uuid PRIMARY KEY
    REFERENCES content.generation_runs(id) ON DELETE RESTRICT,
  lease_token uuid NOT NULL,
  attempt_number integer NOT NULL CHECK (attempt_number BETWEEN 1 AND 3),
  claimed_at timestamptz NOT NULL DEFAULT now(),
  lease_expires_at timestamptz NOT NULL,
  completed_at timestamptz,
  CONSTRAINT generation_task_lease_expiry_ck CHECK (lease_expires_at > claimed_at)
);
CREATE INDEX IF NOT EXISTS generation_run_task_leases_expiry_idx
  ON content.generation_run_task_leases(lease_expires_at)
  WHERE completed_at IS NULL;
COMMIT;
