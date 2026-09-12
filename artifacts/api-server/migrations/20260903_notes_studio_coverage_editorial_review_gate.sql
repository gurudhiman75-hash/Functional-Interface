ALTER TABLE content.note_coverage_plan_items
  ADD COLUMN IF NOT EXISTS coverage_review_state TEXT NOT NULL DEFAULT 'unreviewed',
  ADD COLUMN IF NOT EXISTS coverage_review_claim_ids TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS coverage_reviewed_by UUID,
  ADD COLUMN IF NOT EXISTS coverage_reviewed_at TIMESTAMPTZ;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'note_coverage_review_state_check'
      AND conrelid = 'content.note_coverage_plan_items'::regclass
  ) THEN
    ALTER TABLE content.note_coverage_plan_items
      ADD CONSTRAINT note_coverage_review_state_check
      CHECK (coverage_review_state IN ('unreviewed', 'confirmed'));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'note_coverage_reviewed_by_fk'
      AND conrelid = 'content.note_coverage_plan_items'::regclass
  ) THEN
    ALTER TABLE content.note_coverage_plan_items
      ADD CONSTRAINT note_coverage_reviewed_by_fk
      FOREIGN KEY (coverage_reviewed_by) REFERENCES identity.users(id) ON DELETE SET NULL;
  END IF;
END $$;

COMMENT ON COLUMN content.note_coverage_plan_items.coverage_review_state IS
  'Explicit editor decision that the currently linked accepted claims are sufficient for this syllabus target. Accepted links alone are partial coverage.';
COMMENT ON COLUMN content.note_coverage_plan_items.coverage_review_claim_ids IS
  'Deterministic comma-separated snapshot of accepted claim IDs with active support at the time coverage was confirmed. A changed snapshot invalidates confirmation.';
COMMENT ON COLUMN content.note_coverage_plan_items.coverage_reviewed_at IS
  'Timestamp of the most recent explicit coverage sufficiency review.';
