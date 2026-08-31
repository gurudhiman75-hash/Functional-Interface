CREATE TABLE IF NOT EXISTS content.current_affairs_learner_preferences (
  user_id UUID PRIMARY KEY REFERENCES identity.users(id) ON DELETE CASCADE,
  daily_question_target SMALLINT NOT NULL DEFAULT 20 CHECK (daily_question_target BETWEEN 5 AND 100),
  preferred_language TEXT NOT NULL DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi', 'pa')),
  preferred_exam_family TEXT NOT NULL DEFAULT 'general' CHECK (preferred_exam_family IN ('ssc', 'banking', 'punjab', 'railways', 'general')),
  revision_signal_enabled BOOLEAN NOT NULL DEFAULT true,
  daily_pack_signal_enabled BOOLEAN NOT NULL DEFAULT true,
  study_target_signal_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS content.current_affairs_saved_items (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES identity.users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('learning_resource', 'quiz_delivery_item')),
  learning_resource_id UUID REFERENCES content.learning_resources(id) ON DELETE CASCADE,
  quiz_delivery_item_id UUID REFERENCES content.current_affairs_quiz_delivery_items(id) ON DELETE CASCADE,
  save_mode TEXT NOT NULL CHECK (save_mode IN ('bookmark', 'revise_later')),
  review_after TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT current_affairs_saved_items_target_shape CHECK (
    (target_type='learning_resource' AND learning_resource_id IS NOT NULL AND quiz_delivery_item_id IS NULL)
    OR
    (target_type='quiz_delivery_item' AND quiz_delivery_item_id IS NOT NULL AND learning_resource_id IS NULL)
  ),
  CONSTRAINT current_affairs_saved_items_review_shape CHECK (
    (save_mode='bookmark' AND review_after IS NULL)
    OR
    (save_mode='revise_later' AND review_after IS NOT NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS current_affairs_saved_items_resource_unique_idx
  ON content.current_affairs_saved_items(user_id, learning_resource_id)
  WHERE learning_resource_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS current_affairs_saved_items_quiz_item_unique_idx
  ON content.current_affairs_saved_items(user_id, quiz_delivery_item_id)
  WHERE quiz_delivery_item_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS current_affairs_saved_items_review_due_idx
  ON content.current_affairs_saved_items(user_id, review_after)
  WHERE save_mode='revise_later';

CREATE INDEX IF NOT EXISTS current_affairs_saved_items_user_mode_idx
  ON content.current_affairs_saved_items(user_id, save_mode, updated_at DESC);
