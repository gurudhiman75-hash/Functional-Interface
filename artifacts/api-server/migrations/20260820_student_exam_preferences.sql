CREATE TABLE IF NOT EXISTS identity.student_exam_preferences (
  user_id UUID NOT NULL REFERENCES identity.users(id) ON DELETE CASCADE,
  exam_id UUID NOT NULL REFERENCES catalog.exams(id) ON DELETE CASCADE,
  position SMALLINT NOT NULL CHECK (position >= 0 AND position < 12),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, exam_id),
  UNIQUE (user_id, position)
);

CREATE INDEX IF NOT EXISTS student_exam_preferences_exam_idx
  ON identity.student_exam_preferences(exam_id);

COMMENT ON TABLE identity.student_exam_preferences IS
  'Learner-selected canonical exams used to personalise discovery without inferred profiling.';
