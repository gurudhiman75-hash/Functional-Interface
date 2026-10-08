CREATE TABLE IF NOT EXISTS identity.student_profile_details (
  user_id UUID PRIMARY KEY REFERENCES identity.student_profiles(user_id) ON DELETE CASCADE,
  full_name TEXT,
  date_of_birth DATE,
  state TEXT,
  city TEXT,
  address TEXT,
  social_category TEXT CHECK (social_category IS NULL OR social_category IN ('General','SC','ST','OBC','EWS','BC','Other')),
  preferred_language_code TEXT NOT NULL DEFAULT 'en' CHECK (preferred_language_code IN ('en','hi','pa')),
  avatar_key TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
