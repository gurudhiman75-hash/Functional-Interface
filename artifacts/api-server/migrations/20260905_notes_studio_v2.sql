BEGIN;

CREATE SCHEMA IF NOT EXISTS notes_studio_v2;

DO $$ BEGIN
  CREATE TYPE notes_studio_v2.confidence AS ENUM ('confirmed', 'disputed', 'single-source');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE notes_studio_v2.exam_frequency AS ENUM ('high', 'medium', 'low');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE notes_studio_v2.note_level AS ENUM ('topic', 'subcategory');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE notes_studio_v2.note_status AS ENUM ('draft', 'in-review', 'published');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE notes_studio_v2.contradiction_status AS ENUM ('open', 'resolved');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE notes_studio_v2.figure_status AS ENUM ('needed', 'created');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  CREATE TYPE notes_studio_v2.source_type AS ENUM ('textbook', 'reference', 'academic', 'other');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS notes_studio_v2.periods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  order_index integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT notes_studio_v2_periods_name_uq UNIQUE (name)
);
CREATE INDEX IF NOT EXISTS notes_studio_v2_periods_order_idx ON notes_studio_v2.periods(order_index);

CREATE TABLE IF NOT EXISTS notes_studio_v2.period_sub_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period_id uuid NOT NULL REFERENCES notes_studio_v2.periods(id) ON DELETE CASCADE,
  name text NOT NULL,
  order_index integer NOT NULL,
  CONSTRAINT notes_studio_v2_subcategories_period_name_uq UNIQUE (period_id, name)
);
CREATE INDEX IF NOT EXISTS notes_studio_v2_subcategories_period_order_idx
  ON notes_studio_v2.period_sub_categories(period_id, order_index);

CREATE TABLE IF NOT EXISTS notes_studio_v2.corpus_docs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period_id uuid NOT NULL REFERENCES notes_studio_v2.periods(id) ON DELETE RESTRICT,
  title text NOT NULL,
  source_type notes_studio_v2.source_type NOT NULL,
  file_path text NOT NULL,
  sub_category_hints jsonb,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS notes_studio_v2_corpus_period_idx
  ON notes_studio_v2.corpus_docs(period_id, uploaded_at);

CREATE TABLE IF NOT EXISTS notes_studio_v2.facts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period_id uuid NOT NULL REFERENCES notes_studio_v2.periods(id) ON DELETE RESTRICT,
  sub_category_id uuid NOT NULL REFERENCES notes_studio_v2.period_sub_categories(id) ON DELETE RESTRICT,
  stable_code text NOT NULL,
  claim text NOT NULL,
  entities jsonb NOT NULL DEFAULT '[]'::jsonb,
  date_or_era text,
  confidence notes_studio_v2.confidence NOT NULL DEFAULT 'single-source',
  exam_frequency notes_studio_v2.exam_frequency,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT notes_studio_v2_facts_stable_code_uq UNIQUE (stable_code)
);
CREATE INDEX IF NOT EXISTS notes_studio_v2_facts_graph_idx
  ON notes_studio_v2.facts(period_id, sub_category_id, confidence);

CREATE TABLE IF NOT EXISTS notes_studio_v2.fact_source_refs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fact_id uuid NOT NULL REFERENCES notes_studio_v2.facts(id) ON DELETE CASCADE,
  corpus_doc_id uuid NOT NULL REFERENCES notes_studio_v2.corpus_docs(id) ON DELETE RESTRICT,
  locator text NOT NULL,
  extracted_text text,
  CONSTRAINT notes_studio_v2_fact_source_ref_uq UNIQUE (fact_id, corpus_doc_id, locator)
);
CREATE INDEX IF NOT EXISTS notes_studio_v2_fact_source_refs_fact_idx
  ON notes_studio_v2.fact_source_refs(fact_id);
CREATE INDEX IF NOT EXISTS notes_studio_v2_fact_source_refs_corpus_idx
  ON notes_studio_v2.fact_source_refs(corpus_doc_id);

CREATE TABLE IF NOT EXISTS notes_studio_v2.contradiction_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period_id uuid NOT NULL REFERENCES notes_studio_v2.periods(id) ON DELETE RESTRICT,
  sub_category_id uuid NOT NULL REFERENCES notes_studio_v2.period_sub_categories(id) ON DELETE RESTRICT,
  status notes_studio_v2.contradiction_status NOT NULL DEFAULT 'open',
  resolved_fact_id uuid REFERENCES notes_studio_v2.facts(id) ON DELETE SET NULL,
  resolution_note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);
CREATE INDEX IF NOT EXISTS notes_studio_v2_contradictions_worklist_idx
  ON notes_studio_v2.contradiction_groups(status, created_at);

CREATE TABLE IF NOT EXISTS notes_studio_v2.contradiction_group_facts (
  contradiction_group_id uuid NOT NULL REFERENCES notes_studio_v2.contradiction_groups(id) ON DELETE CASCADE,
  fact_id uuid NOT NULL REFERENCES notes_studio_v2.facts(id) ON DELETE RESTRICT,
  PRIMARY KEY (contradiction_group_id, fact_id)
);

CREATE TABLE IF NOT EXISTS notes_studio_v2.style_specs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tone text,
  sentence_length text,
  terminology_conventions jsonb,
  example_structure text,
  avoid jsonb,
  exemplar_note_version_ids jsonb,
  is_active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT notes_studio_v2_sentence_length_ck CHECK (sentence_length IS NULL OR sentence_length IN ('short', 'medium', 'mixed'))
);
CREATE UNIQUE INDEX IF NOT EXISTS notes_studio_v2_one_active_style_uq
  ON notes_studio_v2.style_specs(is_active) WHERE is_active = true;

CREATE TABLE IF NOT EXISTS notes_studio_v2.style_bootstrap_rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  style_spec_id uuid NOT NULL REFERENCES notes_studio_v2.style_specs(id) ON DELETE CASCADE,
  round_number integer NOT NULL,
  variants jsonb NOT NULL,
  selected_variant_label text,
  admin_edits text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT notes_studio_v2_style_round_uq UNIQUE (style_spec_id, round_number),
  CONSTRAINT notes_studio_v2_style_round_number_ck CHECK (round_number BETWEEN 1 AND 3)
);

CREATE TABLE IF NOT EXISTS notes_studio_v2.notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period_id uuid NOT NULL REFERENCES notes_studio_v2.periods(id) ON DELETE RESTRICT,
  sub_category_id uuid REFERENCES notes_studio_v2.period_sub_categories(id) ON DELETE RESTRICT,
  level notes_studio_v2.note_level NOT NULL,
  current_version_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS notes_studio_v2_notes_period_idx
  ON notes_studio_v2.notes(period_id, level);
CREATE UNIQUE INDEX IF NOT EXISTS notes_studio_v2_notes_topic_target_uq
  ON notes_studio_v2.notes(period_id) WHERE level = 'topic' AND sub_category_id IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS notes_studio_v2_notes_subcategory_target_uq
  ON notes_studio_v2.notes(period_id, sub_category_id) WHERE level = 'subcategory';

CREATE TABLE IF NOT EXISTS notes_studio_v2.note_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id uuid NOT NULL REFERENCES notes_studio_v2.notes(id) ON DELETE RESTRICT,
  version_number integer NOT NULL,
  blocks_by_language jsonb NOT NULL,
  style_spec_id uuid REFERENCES notes_studio_v2.style_specs(id) ON DELETE SET NULL,
  generated_from_fact_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  status notes_studio_v2.note_status NOT NULL DEFAULT 'draft',
  created_by text,
  created_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz,
  CONSTRAINT notes_studio_v2_note_versions_number_uq UNIQUE (note_id, version_number)
);
CREATE INDEX IF NOT EXISTS notes_studio_v2_note_versions_review_idx
  ON notes_studio_v2.note_versions(status, created_at);

DO $$ BEGIN
  ALTER TABLE notes_studio_v2.notes
    ADD CONSTRAINT notes_studio_v2_notes_current_version_fk
    FOREIGN KEY (current_version_id) REFERENCES notes_studio_v2.note_versions(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS notes_studio_v2.note_figures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_version_id uuid NOT NULL REFERENCES notes_studio_v2.note_versions(id) ON DELETE CASCADE,
  block_ref text NOT NULL,
  placeholder_description text NOT NULL,
  svg_ref text,
  status notes_studio_v2.figure_status NOT NULL DEFAULT 'needed',
  CONSTRAINT notes_studio_v2_note_figures_block_uq UNIQUE (note_version_id, block_ref)
);
CREATE INDEX IF NOT EXISTS notes_studio_v2_note_figures_worklist_idx
  ON notes_studio_v2.note_figures(status);

COMMIT;
