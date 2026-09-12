\set ON_ERROR_STOP on

-- NS-028 proves the rights-safe reference-only path can traverse the persisted
-- Notes Studio lifecycle without manufacturing retained publisher text.
INSERT INTO identity.users (id)
VALUES ('00000000-0000-4000-8000-000000000001')
ON CONFLICT DO NOTHING;

INSERT INTO content.source_documents (
  id, source_type, source_uri, title, publisher, mime_type, content_hash,
  rights_basis, retention_mode, extraction_status, extracted_text, extraction_metadata,
  created_by, created_at, updated_at
) VALUES
(
  '11000000-0000-4000-8000-000000000001', 'web', 'https://reference-a.example.org/topic',
  'Reference lifecycle source A', 'Reference Authority A', 'text/html', repeat('4', 64),
  'reference_only', 'metadata_only', 'metadata_only', null,
  '{"referenceOnly":true,"publisherTextRetained":false}'::jsonb,
  '00000000-0000-4000-8000-000000000001', now(), now()
),
(
  '11000000-0000-4000-8000-000000000002', 'web', 'https://reference-b.example.edu/topic',
  'Reference lifecycle source B', 'Reference Authority B', 'text/html', repeat('5', 64),
  'reference_only', 'metadata_only', 'metadata_only', null,
  '{"referenceOnly":true,"publisherTextRetained":false}'::jsonb,
  '00000000-0000-4000-8000-000000000001', now(), now()
);

INSERT INTO content.note_authoring_jobs (
  id, title, source_language, state, brief, target_resource_id,
  created_by, updated_by, created_at, updated_at
) VALUES (
  '21000000-0000-4000-8000-000000000001', 'NS-028 reference-only lifecycle', 'en', 'brief',
  '{"topicLabel":"Reference lifecycle fixture","depth":"comprehensive","learnerLevel":"standard","examIds":[],"sourcePackTemplate":"official_first"}'::jsonb,
  null, '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', now(), now()
);

INSERT INTO content.note_authoring_sources (
  job_id, source_document_id, inclusion_state, relevance_score, position, source_role,
  added_by, added_at, updated_at
) VALUES
(
  '21000000-0000-4000-8000-000000000001', '11000000-0000-4000-8000-000000000001',
  'included', 100, 0, 'primary_authority', '00000000-0000-4000-8000-000000000001', now(), now()
),
(
  '21000000-0000-4000-8000-000000000001', '11000000-0000-4000-8000-000000000002',
  'included', 95, 1, 'core_reference', '00000000-0000-4000-8000-000000000001', now(), now()
);

INSERT INTO content.note_source_evidence_blocks (
  id, job_id, source_document_id, block_index, excerpt, excerpt_hash,
  char_start, char_end, locator, evidence_kind, reviewed_by, reviewed_at
) VALUES
(
  '31000000-0000-4000-8000-000000000001', '21000000-0000-4000-8000-000000000001',
  '11000000-0000-4000-8000-000000000001', 0,
  'Editor-reviewed factual paraphrase A for the reference-only lifecycle fixture.', repeat('6', 64),
  null, null, '{"kind":"section","label":"Reference section A"}'::jsonb,
  'editor_reference_note', '00000000-0000-4000-8000-000000000001', now()
),
(
  '31000000-0000-4000-8000-000000000002', '21000000-0000-4000-8000-000000000001',
  '11000000-0000-4000-8000-000000000002', 0,
  'Editor-reviewed factual paraphrase B for the independent reference source.', repeat('7', 64),
  null, null, '{"kind":"section","label":"Reference section B"}'::jsonb,
  'editor_reference_note', '00000000-0000-4000-8000-000000000001', now()
);

UPDATE content.note_authoring_jobs
SET state = 'sources_ready', updated_at = now()
WHERE id = '21000000-0000-4000-8000-000000000001';

INSERT INTO content.note_source_claims (
  id, job_id, claim_text, claim_hash, state, confidence, editorial_note, created_by, updated_by
) VALUES
(
  '41000000-0000-4000-8000-000000000001', '21000000-0000-4000-8000-000000000001',
  'The first governed reference supports the fixture foundation fact.', repeat('8', 64),
  'accepted', 0.990, 'NS-028 accepted reference-backed claim A',
  '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001'
),
(
  '41000000-0000-4000-8000-000000000002', '21000000-0000-4000-8000-000000000001',
  'The second independent reference supports the fixture comparison fact.', repeat('9', 64),
  'accepted', 0.990, 'NS-028 accepted reference-backed claim B',
  '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001'
);

INSERT INTO content.note_source_claim_evidence (job_id, claim_id, evidence_block_id, relation, created_by)
VALUES
(
  '21000000-0000-4000-8000-000000000001', '41000000-0000-4000-8000-000000000001',
  '31000000-0000-4000-8000-000000000001', 'supports', '00000000-0000-4000-8000-000000000001'
),
(
  '21000000-0000-4000-8000-000000000001', '41000000-0000-4000-8000-000000000002',
  '31000000-0000-4000-8000-000000000002', 'supports', '00000000-0000-4000-8000-000000000001'
);

UPDATE content.note_authoring_jobs
SET state = 'evidence_ready', updated_at = now()
WHERE id = '21000000-0000-4000-8000-000000000001';

INSERT INTO content.note_coverage_plan_items (
  id, job_id, title, syllabus_ref, priority, planned_depth, exam_rationale, sort_order, created_by, updated_by
) VALUES (
  '51000000-0000-4000-8000-000000000001', '21000000-0000-4000-8000-000000000001',
  'Reference-backed lifecycle coverage', 'Production smoke / reference evidence', 'required', 'standard',
  'Proves reference-only evidence can support normal learner-note lifecycle state.', 0,
  '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001'
);

INSERT INTO content.note_coverage_item_claims (job_id, coverage_item_id, claim_id, created_by)
VALUES
(
  '21000000-0000-4000-8000-000000000001', '51000000-0000-4000-8000-000000000001',
  '41000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001'
),
(
  '21000000-0000-4000-8000-000000000001', '51000000-0000-4000-8000-000000000001',
  '41000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001'
);

UPDATE content.note_authoring_jobs
SET state = 'outline_ready', updated_at = now()
WHERE id = '21000000-0000-4000-8000-000000000001';

INSERT INTO content.note_sections (
  id, job_id, coverage_item_id, title, sort_order, state, markdown,
  input_fingerprint, output_fingerprint, prompt_version, provider, model, generation_metadata,
  created_by, updated_by
) VALUES (
  '61000000-0000-4000-8000-000000000001', '21000000-0000-4000-8000-000000000001',
  '51000000-0000-4000-8000-000000000001', 'Reference-backed lifecycle coverage', 0, 'qa_passed',
  'The first governed reference supports the fixture foundation fact. The second independent reference supports the fixture comparison fact.',
  repeat('a', 64), repeat('b', 64), 'notes-section-v1', 'openai', 'seed-model',
  '{"seeded":true,"rawSourceTextSent":false,"referenceEvidence":true}'::jsonb,
  '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001'
);

INSERT INTO content.note_section_claims (job_id, section_id, claim_id, position, role)
VALUES
(
  '21000000-0000-4000-8000-000000000001', '61000000-0000-4000-8000-000000000001',
  '41000000-0000-4000-8000-000000000001', 0, 'core'
),
(
  '21000000-0000-4000-8000-000000000001', '61000000-0000-4000-8000-000000000001',
  '41000000-0000-4000-8000-000000000002', 1, 'core'
);

INSERT INTO content.note_quality_runs (
  id, job_id, section_id, section_output_fingerprint, evidence_fingerprint, policy_version,
  verifier_provider, verifier_model, verifier_prompt_version, verifier_metadata, status,
  warning_count, fail_count, created_by
) VALUES (
  '71000000-0000-4000-8000-000000000001', '21000000-0000-4000-8000-000000000001',
  '61000000-0000-4000-8000-000000000001', repeat('b', 64), repeat('c', 64), 'notes-qa-v1',
  'openai', 'seed-verifier', 'notes-qa-grounding-v1',
  '{"seeded":true,"rawSourceTextSent":false,"acceptedClaimsOnly":true,"referenceEvidence":true}'::jsonb,
  'passed', 0, 0, '00000000-0000-4000-8000-000000000001'
);

INSERT INTO content.note_quality_checks (run_id, check_code, label, status, blocking, summary)
VALUES (
  '71000000-0000-4000-8000-000000000001', 'grounding', 'Grounding', 'pass', true,
  'Reference-backed seeded grounding passed.'
);

UPDATE content.note_authoring_jobs
SET state = 'review_ready', updated_at = now()
WHERE id = '21000000-0000-4000-8000-000000000001';

INSERT INTO content.note_approved_versions (
  id, job_id, source_language, learner_title, learner_summary, body_markdown,
  content_hash, approval_fingerprint, brief_snapshot, exam_ids, section_manifest, qa_manifest,
  approved_by, approved_at
) VALUES (
  '81000000-0000-4000-8000-000000000001', '21000000-0000-4000-8000-000000000001', 'en',
  'Reference Evidence Lifecycle', 'Seeded reference-only learner summary.',
  '## Reference-backed lifecycle coverage\n\nThe first governed reference supports the fixture foundation fact. The second independent reference supports the fixture comparison fact.',
  repeat('d', 64), repeat('e', 64),
  '{"topicLabel":"Reference lifecycle fixture","sourcePackTemplate":"official_first"}'::jsonb, '[]'::jsonb,
  '[{"id":"61000000-0000-4000-8000-000000000001","outputFingerprint":"bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"}]'::jsonb,
  '[{"qualityRunId":"71000000-0000-4000-8000-000000000001","evidenceFingerprint":"cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc"}]'::jsonb,
  '00000000-0000-4000-8000-000000000001', now()
);

UPDATE content.note_authoring_jobs
SET state = 'approved', updated_at = now()
WHERE id = '21000000-0000-4000-8000-000000000001';

INSERT INTO content.learning_resources (
  id, public_code, category, format, title, summary, language_code, body_markdown, status,
  created_by, updated_by, created_at, updated_at
) VALUES (
  '91000000-0000-4000-8000-000000000001', 'NOTE_NS028_REFERENCE', 'notes', 'article',
  'Reference Evidence Lifecycle', 'Seeded reference-only learner summary.', 'en',
  '## Reference-backed lifecycle coverage\n\nThe first governed reference supports the fixture foundation fact. The second independent reference supports the fixture comparison fact.',
  'draft', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', now(), now()
);

INSERT INTO content.note_materializations (approved_version_id, resource_id, materialized_by)
VALUES (
  '81000000-0000-4000-8000-000000000001', '91000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000001'
);

UPDATE content.note_authoring_jobs
SET state = 'materialized', target_resource_id = '91000000-0000-4000-8000-000000000001', updated_at = now()
WHERE id = '21000000-0000-4000-8000-000000000001';

DO $$
DECLARE
  retained_source_count INTEGER;
  reference_block_count INTEGER;
  active_supported_claim_count INTEGER;
  final_job_state TEXT;
  final_resource_status TEXT;
BEGIN
  SELECT COUNT(*)::int INTO retained_source_count
  FROM content.source_documents
  WHERE id IN (
    '11000000-0000-4000-8000-000000000001'::uuid,
    '11000000-0000-4000-8000-000000000002'::uuid
  )
    AND (retention_mode <> 'metadata_only' OR extracted_text IS NOT NULL);
  IF retained_source_count <> 0 THEN
    RAISE EXCEPTION 'NS-028 reference sources unexpectedly retained publisher text';
  END IF;

  SELECT COUNT(*)::int INTO reference_block_count
  FROM content.note_source_evidence_blocks
  WHERE job_id = '21000000-0000-4000-8000-000000000001'::uuid
    AND evidence_kind = 'editor_reference_note'
    AND reviewed_at IS NOT NULL
    AND char_start IS NULL
    AND char_end IS NULL;
  IF reference_block_count <> 2 THEN
    RAISE EXCEPTION 'NS-028 reviewed reference evidence count mismatch: %', reference_block_count;
  END IF;

  SELECT COUNT(DISTINCT claim.id)::int INTO active_supported_claim_count
  FROM content.note_source_claims claim
  JOIN content.note_source_claim_evidence mapping
    ON mapping.job_id = claim.job_id AND mapping.claim_id = claim.id AND mapping.relation = 'supports'
  JOIN content.note_source_evidence_blocks block
    ON block.job_id = mapping.job_id AND block.id = mapping.evidence_block_id
  JOIN content.note_authoring_sources link
    ON link.job_id = block.job_id AND link.source_document_id = block.source_document_id
  WHERE claim.job_id = '21000000-0000-4000-8000-000000000001'::uuid
    AND claim.state = 'accepted'
    AND block.evidence_kind = 'editor_reference_note'
    AND link.inclusion_state = 'included';
  IF active_supported_claim_count <> 2 THEN
    RAISE EXCEPTION 'NS-028 active reference-backed accepted claim count mismatch: %', active_supported_claim_count;
  END IF;

  SELECT state INTO final_job_state
  FROM content.note_authoring_jobs
  WHERE id = '21000000-0000-4000-8000-000000000001'::uuid;
  IF final_job_state <> 'materialized' THEN
    RAISE EXCEPTION 'NS-028 reference lifecycle did not reach materialized state: %', final_job_state;
  END IF;

  SELECT status INTO final_resource_status
  FROM content.learning_resources
  WHERE id = '91000000-0000-4000-8000-000000000001'::uuid;
  IF final_resource_status <> 'draft' THEN
    RAISE EXCEPTION 'NS-028 materialization crossed publication boundary: %', final_resource_status;
  END IF;
END $$;

SELECT 'Notes Studio NS-028 reference-evidence production lifecycle passed' AS result;
