CREATE TABLE IF NOT EXISTS attempt_drafts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  test_id TEXT NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  test_name TEXT NOT NULL,
  category TEXT NOT NULL,
  attempt_type TEXT NOT NULL CHECK (attempt_type IN ('REAL', 'PRACTICE')),
  original_attempt_id TEXT,
  state JSONB NOT NULL,
  version INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'paused')),
  last_device TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMP,
  CONSTRAINT attempt_drafts_user_test_type_original_unique
    UNIQUE NULLS NOT DISTINCT (user_id, test_id, attempt_type, original_attempt_id)
);

CREATE INDEX IF NOT EXISTS attempt_drafts_user_updated_idx
  ON attempt_drafts(user_id, updated_at DESC);

CREATE INDEX IF NOT EXISTS attempt_drafts_user_test_idx
  ON attempt_drafts(user_id, test_id);

CREATE OR REPLACE FUNCTION set_attempt_drafts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS attempt_drafts_set_updated_at ON attempt_drafts;

CREATE TRIGGER attempt_drafts_set_updated_at
BEFORE UPDATE ON attempt_drafts
FOR EACH ROW
EXECUTE FUNCTION set_attempt_drafts_updated_at();
