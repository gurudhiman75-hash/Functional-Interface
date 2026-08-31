ALTER TABLE content.current_affairs_automation_runs
  DROP CONSTRAINT IF EXISTS current_affairs_automation_runs_job_type_check;

ALTER TABLE content.current_affairs_automation_runs
  ADD CONSTRAINT current_affairs_automation_runs_job_type_check
  CHECK (job_type IN ('feed_ingestion', 'intelligence_processing', 'daily_compilation'));

ALTER TABLE content.current_affairs_automation_runs
  ADD COLUMN IF NOT EXISTS cluster_created_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS event_promoted_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS event_verified_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS compilation_created_count INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS question_created_count INTEGER NOT NULL DEFAULT 0;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'current_affairs_automation_runs_pipeline_counts_nonnegative'
  ) THEN
    ALTER TABLE content.current_affairs_automation_runs
      ADD CONSTRAINT current_affairs_automation_runs_pipeline_counts_nonnegative
      CHECK (
        cluster_created_count >= 0
        AND event_promoted_count >= 0
        AND event_verified_count >= 0
        AND compilation_created_count >= 0
        AND question_created_count >= 0
      );
  END IF;
END $$;

COMMENT ON COLUMN content.current_affairs_automation_runs.event_verified_count IS
  'Events automatically verified only after strict evidence and contradiction gates.';

COMMENT ON COLUMN content.current_affairs_automation_runs.compilation_created_count IS
  'Draft daily compilation manifests created by automation; this does not imply learner publication.';
