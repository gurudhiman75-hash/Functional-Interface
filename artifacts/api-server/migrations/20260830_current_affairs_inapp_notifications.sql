ALTER TABLE content.current_affairs_learner_preferences
  ADD COLUMN IF NOT EXISTS in_app_notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS quiet_hours_start TEXT NOT NULL DEFAULT '22:00',
  ADD COLUMN IF NOT EXISTS quiet_hours_end TEXT NOT NULL DEFAULT '07:00',
  ADD COLUMN IF NOT EXISTS daily_notification_cap SMALLINT NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS notification_gap_minutes SMALLINT NOT NULL DEFAULT 180,
  ADD COLUMN IF NOT EXISTS notifications_muted_until TIMESTAMPTZ;

ALTER TABLE content.current_affairs_learner_preferences
  DROP CONSTRAINT IF EXISTS current_affairs_learner_preferences_quiet_start_check,
  ADD CONSTRAINT current_affairs_learner_preferences_quiet_start_check
    CHECK (quiet_hours_start ~ '^(?:[01][0-9]|2[0-3]):[0-5][0-9]$'),
  DROP CONSTRAINT IF EXISTS current_affairs_learner_preferences_quiet_end_check,
  ADD CONSTRAINT current_affairs_learner_preferences_quiet_end_check
    CHECK (quiet_hours_end ~ '^(?:[01][0-9]|2[0-3]):[0-5][0-9]$'),
  DROP CONSTRAINT IF EXISTS current_affairs_learner_preferences_daily_notification_cap_check,
  ADD CONSTRAINT current_affairs_learner_preferences_daily_notification_cap_check
    CHECK (daily_notification_cap BETWEEN 1 AND 8),
  DROP CONSTRAINT IF EXISTS current_affairs_learner_preferences_notification_gap_minutes_check,
  ADD CONSTRAINT current_affairs_learner_preferences_notification_gap_minutes_check
    CHECK (notification_gap_minutes BETWEEN 60 AND 720);

CREATE TABLE IF NOT EXISTS content.current_affairs_inapp_notifications (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES identity.users(id) ON DELETE CASCADE,
  signal_key TEXT NOT NULL,
  signal_type TEXT NOT NULL CHECK (signal_type IN ('revision_due', 'recovery_due', 'daily_target', 'daily_pack', 'saved_review')),
  urgency TEXT NOT NULL CHECK (urgency IN ('high', 'normal')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  deep_link TEXT NOT NULL,
  source_quiz_code TEXT,
  signal_count INTEGER NOT NULL DEFAULT 1 CHECK (signal_count >= 0),
  status TEXT NOT NULL DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'dismissed')),
  delivered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  read_at TIMESTAMPTZ,
  dismissed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, signal_key),
  CONSTRAINT current_affairs_inapp_notification_source_shape CHECK (
    (signal_type='daily_pack' AND source_quiz_code IS NOT NULL)
    OR (signal_type<>'daily_pack' AND source_quiz_code IS NULL)
  ),
  CONSTRAINT current_affairs_inapp_notification_state_shape CHECK (
    (status='unread' AND read_at IS NULL AND dismissed_at IS NULL)
    OR (status='read' AND read_at IS NOT NULL AND dismissed_at IS NULL)
    OR (status='dismissed' AND dismissed_at IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS current_affairs_inapp_notifications_inbox_idx
  ON content.current_affairs_inapp_notifications(user_id, status, delivered_at DESC);

CREATE INDEX IF NOT EXISTS current_affairs_inapp_notifications_daily_cap_idx
  ON content.current_affairs_inapp_notifications(user_id, delivered_at DESC);

CREATE TABLE IF NOT EXISTS content.current_affairs_notification_runs (
  id UUID PRIMARY KEY,
  run_key TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'completed_with_errors', 'failed', 'skipped')),
  candidate_user_count INTEGER NOT NULL DEFAULT 0,
  evaluated_user_count INTEGER NOT NULL DEFAULT 0,
  delivered_count INTEGER NOT NULL DEFAULT 0,
  suppressed_count INTEGER NOT NULL DEFAULT 0,
  error_count INTEGER NOT NULL DEFAULT 0,
  stats JSONB NOT NULL DEFAULT '{}'::jsonb,
  failure TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS current_affairs_notification_runs_started_idx
  ON content.current_affairs_notification_runs(started_at DESC);
