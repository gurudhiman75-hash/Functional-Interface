ALTER TABLE content.note_source_evidence_blocks
  ADD COLUMN IF NOT EXISTS evidence_kind TEXT NOT NULL DEFAULT 'retained_excerpt',
  ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES identity.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

ALTER TABLE content.note_source_evidence_blocks
  DROP CONSTRAINT IF EXISTS note_source_evidence_blocks_char_start_check,
  DROP CONSTRAINT IF EXISTS note_source_evidence_blocks_char_end_check,
  DROP CONSTRAINT IF EXISTS note_source_evidence_kind_check,
  DROP CONSTRAINT IF EXISTS note_source_evidence_location_shape,
  DROP CONSTRAINT IF EXISTS note_source_reference_evidence_review_check;

ALTER TABLE content.note_source_evidence_blocks
  ALTER COLUMN char_start DROP NOT NULL,
  ALTER COLUMN char_end DROP NOT NULL;

ALTER TABLE content.note_source_evidence_blocks
  ADD CONSTRAINT note_source_evidence_kind_check
    CHECK (evidence_kind IN ('retained_excerpt', 'editor_reference_note')),
  ADD CONSTRAINT note_source_evidence_location_shape
    CHECK (
      (evidence_kind = 'retained_excerpt'
        AND char_start IS NOT NULL
        AND char_end IS NOT NULL
        AND char_start >= 0
        AND char_end > char_start)
      OR
      (evidence_kind = 'editor_reference_note'
        AND char_start IS NULL
        AND char_end IS NULL)
    ),
  ADD CONSTRAINT note_source_reference_evidence_review_check
    CHECK (
      evidence_kind <> 'editor_reference_note'
      OR reviewed_at IS NOT NULL
    );

COMMENT ON COLUMN content.note_source_evidence_blocks.evidence_kind IS
  'retained_excerpt stores authorized source wording; editor_reference_note stores an editor-authored factual paraphrase for a metadata-only reference source and must not contain copied publisher expression.';
COMMENT ON COLUMN content.note_source_evidence_blocks.reviewed_by IS
  'Editor who explicitly reviewed and authored a reference-evidence paraphrase. Null for automatically built retained excerpts.';
COMMENT ON COLUMN content.note_source_evidence_blocks.reviewed_at IS
  'Time of explicit reference-evidence review. Required for editor_reference_note blocks.';
COMMENT ON TABLE content.note_source_evidence_blocks IS
  'Bounded provenance-bearing evidence. Retained excerpts require extractable authorized source text; editor reference notes are editor-authored factual paraphrases tied to metadata-only sources without retaining publisher wording.';
