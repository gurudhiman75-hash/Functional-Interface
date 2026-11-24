-- Optional admin-uploaded logo per exam (small data URL; shown on student store/tests cards).
ALTER TABLE catalog.exams ADD COLUMN IF NOT EXISTS logo_data_url text;
ALTER TABLE catalog.exams ADD COLUMN IF NOT EXISTS logo_alt text;
