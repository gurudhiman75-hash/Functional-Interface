CREATE TABLE IF NOT EXISTS content.note_planning_batches (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  exam_id UUID NOT NULL REFERENCES catalog.exams(id) ON DELETE RESTRICT,
  exam_version_id UUID NOT NULL REFERENCES catalog.exam_versions(id) ON DELETE RESTRICT,
  root_taxonomy_node_id UUID NOT NULL REFERENCES catalog.taxonomy_nodes(id) ON DELETE RESTRICT,
  source_language TEXT NOT NULL DEFAULT 'en',
  depth TEXT NOT NULL CHECK (depth IN ('quick_revision', 'standard', 'comprehensive')),
  learner_level TEXT NOT NULL CHECK (learner_level IN ('foundation', 'standard', 'advanced')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  selection_policy JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS content.note_planning_items (
  id UUID PRIMARY KEY,
  batch_id UUID NOT NULL REFERENCES content.note_planning_batches(id) ON DELETE CASCADE,
  taxonomy_node_id UUID NOT NULL REFERENCES catalog.taxonomy_nodes(id) ON DELETE RESTRICT,
  taxonomy_snapshot JSONB NOT NULL,
  target_coverage INTEGER NOT NULL DEFAULT 0 CHECK (target_coverage >= 0),
  priority INTEGER NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5),
  position INTEGER NOT NULL DEFAULT 0,
  item_state TEXT NOT NULL DEFAULT 'planned' CHECK (item_state IN ('planned', 'job_created', 'skipped')),
  authoring_job_id UUID UNIQUE REFERENCES content.note_authoring_jobs(id) ON DELETE RESTRICT,
  created_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (batch_id, taxonomy_node_id),
  CONSTRAINT note_planning_item_job_state CHECK (
    (item_state = 'job_created' AND authoring_job_id IS NOT NULL)
    OR (item_state IN ('planned', 'skipped') AND authoring_job_id IS NULL)
  )
);

CREATE INDEX IF NOT EXISTS note_planning_batches_exam_idx
  ON content.note_planning_batches(exam_version_id, status, updated_at DESC);
CREATE INDEX IF NOT EXISTS note_planning_batches_root_idx
  ON content.note_planning_batches(root_taxonomy_node_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS note_planning_items_batch_idx
  ON content.note_planning_items(batch_id, item_state, priority DESC, position);
CREATE INDEX IF NOT EXISTS note_planning_items_taxonomy_idx
  ON content.note_planning_items(taxonomy_node_id, item_state);

COMMENT ON TABLE content.note_planning_batches IS
  'Governed syllabus/taxonomy planning batches for scaling Notes Studio authoring. A batch plans work only; it does not ingest sources, generate, approve or publish learner content.';
COMMENT ON TABLE content.note_planning_items IS
  'Frozen taxonomy planning units. Creating an authoring job from an item starts the normal Notes Studio pipeline at brief state.';
