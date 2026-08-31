CREATE TABLE IF NOT EXISTS content.current_affairs_learning_attempts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES identity.users(id) ON DELETE CASCADE,
  client_attempt_id UUID NOT NULL,
  attempt_type TEXT NOT NULL CHECK (attempt_type IN ('quiz','revision')),
  quiz_delivery_id UUID REFERENCES content.current_affairs_quiz_deliveries(id) ON DELETE RESTRICT,
  language_code TEXT NOT NULL CHECK (language_code IN ('en','hi','pa')),
  total_count INTEGER NOT NULL CHECK (total_count >= 1),
  correct_count INTEGER NOT NULL CHECK (correct_count >= 0),
  wrong_count INTEGER NOT NULL CHECK (wrong_count >= 0),
  unanswered_count INTEGER NOT NULL CHECK (unanswered_count >= 0),
  score_percent NUMERIC(6,2) NOT NULL CHECK (score_percent BETWEEN 0 AND 100),
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT current_affairs_learning_attempt_count_total CHECK (
    correct_count + wrong_count + unanswered_count = total_count
  ),
  CONSTRAINT current_affairs_learning_attempt_delivery_shape CHECK (
    (attempt_type='quiz' AND quiz_delivery_id IS NOT NULL)
    OR (attempt_type='revision' AND quiz_delivery_id IS NULL)
  ),
  UNIQUE (user_id, client_attempt_id)
);

CREATE INDEX IF NOT EXISTS current_affairs_learning_attempts_user_idx
  ON content.current_affairs_learning_attempts(user_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS current_affairs_learning_attempts_delivery_idx
  ON content.current_affairs_learning_attempts(quiz_delivery_id, user_id, submitted_at DESC)
  WHERE quiz_delivery_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS content.current_affairs_learning_attempt_items (
  attempt_id UUID NOT NULL
    REFERENCES content.current_affairs_learning_attempts(id) ON DELETE CASCADE,
  quiz_delivery_item_id UUID NOT NULL
    REFERENCES content.current_affairs_quiz_delivery_items(id) ON DELETE RESTRICT,
  selected_index SMALLINT CHECK (selected_index BETWEEN 0 AND 7),
  correct_index SMALLINT NOT NULL CHECK (correct_index BETWEEN 0 AND 7),
  result TEXT NOT NULL CHECK (result IN ('correct','wrong','unanswered')),
  revision_stage_before SMALLINT NOT NULL CHECK (revision_stage_before BETWEEN 0 AND 5),
  revision_stage_after SMALLINT NOT NULL CHECK (revision_stage_after BETWEEN 0 AND 5),
  next_review_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (attempt_id, quiz_delivery_item_id)
);

CREATE INDEX IF NOT EXISTS current_affairs_learning_attempt_items_item_idx
  ON content.current_affairs_learning_attempt_items(quiz_delivery_item_id, created_at DESC);

CREATE TABLE IF NOT EXISTS content.current_affairs_revision_schedule (
  user_id UUID NOT NULL REFERENCES identity.users(id) ON DELETE CASCADE,
  quiz_delivery_item_id UUID NOT NULL
    REFERENCES content.current_affairs_quiz_delivery_items(id) ON DELETE RESTRICT,
  stage SMALLINT NOT NULL DEFAULT 0 CHECK (stage BETWEEN 0 AND 5),
  review_count INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0),
  correct_streak INTEGER NOT NULL DEFAULT 0 CHECK (correct_streak >= 0),
  last_result TEXT NOT NULL CHECK (last_result IN ('correct','wrong','unanswered')),
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_reviewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  next_review_at TIMESTAMPTZ NOT NULL,
  last_attempt_id UUID NOT NULL
    REFERENCES content.current_affairs_learning_attempts(id) ON DELETE RESTRICT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, quiz_delivery_item_id)
);

CREATE INDEX IF NOT EXISTS current_affairs_revision_schedule_due_idx
  ON content.current_affairs_revision_schedule(user_id, next_review_at, stage);

CREATE OR REPLACE FUNCTION content.guard_current_affairs_attempt_item()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  attempt_row RECORD;
  item_row RECORD;
  expected_correct_index INTEGER;
  expected_result TEXT;
BEGIN
  SELECT attempt_type, quiz_delivery_id INTO attempt_row
  FROM content.current_affairs_learning_attempts
  WHERE id=NEW.attempt_id;
  IF attempt_row.attempt_type IS NULL THEN
    RAISE EXCEPTION 'Current Affairs learning attempt does not exist';
  END IF;

  SELECT item.quiz_delivery_id, delivery.status AS delivery_status, release.status AS release_status,
         (item.english_payload->>'correctIndex')::int AS correct_index
  INTO item_row
  FROM content.current_affairs_quiz_delivery_items item
  JOIN content.current_affairs_quiz_deliveries delivery ON delivery.id=item.quiz_delivery_id
  JOIN content.current_affairs_releases release ON release.id=delivery.release_id
  WHERE item.id=NEW.quiz_delivery_item_id;

  IF item_row.quiz_delivery_id IS NULL OR item_row.delivery_status <> 'published' OR item_row.release_status <> 'approved' THEN
    RAISE EXCEPTION 'Current Affairs learning attempts can only reference active published quiz items';
  END IF;
  IF attempt_row.attempt_type='quiz' AND item_row.quiz_delivery_id IS DISTINCT FROM attempt_row.quiz_delivery_id THEN
    RAISE EXCEPTION 'Quiz attempt item does not belong to the submitted quiz delivery';
  END IF;

  expected_correct_index := item_row.correct_index;
  IF NEW.correct_index IS DISTINCT FROM expected_correct_index THEN
    RAISE EXCEPTION 'Stored Current Affairs attempt answer key does not match immutable quiz delivery snapshot';
  END IF;
  expected_result := CASE
    WHEN NEW.selected_index IS NULL THEN 'unanswered'
    WHEN NEW.selected_index = expected_correct_index THEN 'correct'
    ELSE 'wrong'
  END;
  IF NEW.result IS DISTINCT FROM expected_result THEN
    RAISE EXCEPTION 'Stored Current Affairs attempt result is inconsistent with selected/correct answer indexes';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS current_affairs_attempt_item_guard
  ON content.current_affairs_learning_attempt_items;
CREATE TRIGGER current_affairs_attempt_item_guard
BEFORE INSERT ON content.current_affairs_learning_attempt_items
FOR EACH ROW
EXECUTE FUNCTION content.guard_current_affairs_attempt_item();

COMMENT ON TABLE content.current_affairs_learning_attempts IS
  'Authenticated learner Current Affairs quiz/revision submissions. client_attempt_id makes mobile/web retries idempotent.';
COMMENT ON TABLE content.current_affairs_revision_schedule IS
  'Per-learner per-question spaced-repetition state. Correct due reviews progress through D3/D7/D15/D30/D60; wrong/unanswered responses reset to next-day recovery.';
