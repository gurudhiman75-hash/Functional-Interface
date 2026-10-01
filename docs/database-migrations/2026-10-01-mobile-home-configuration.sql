BEGIN;

CREATE SCHEMA IF NOT EXISTS platform;

CREATE TABLE IF NOT EXISTS platform.mobile_home_configuration (
  singleton_key text PRIMARY KEY DEFAULT 'default' CHECK (singleton_key = 'default'),
  configuration jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by uuid NULL REFERENCES identity.users(id) ON DELETE SET NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO platform.mobile_home_configuration (singleton_key, configuration)
VALUES (
  'default',
  jsonb_build_object(
    'heroSlides', '[]'::jsonb,
    'featuredExamFamilyIds', '[]'::jsonb,
    'featuredTestSeriesIds', '[]'::jsonb,
    'sectionOrder', jsonb_build_array('hero','exam_categories','featured_test_series','continue_learning')
  )
)
ON CONFLICT (singleton_key) DO NOTHING;

COMMIT;
