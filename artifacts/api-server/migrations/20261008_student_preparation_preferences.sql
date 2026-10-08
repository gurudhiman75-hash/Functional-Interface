CREATE TABLE IF NOT EXISTS identity.student_preparation_preferences (
  user_id UUID PRIMARY KEY REFERENCES identity.student_profiles(user_id) ON DELETE CASCADE,
  categories TEXT[] NOT NULL DEFAULT '{}',
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (categories <@ ARRAY['ssc','banking','punjab-government','railways','insurance','other']::text[])
);
