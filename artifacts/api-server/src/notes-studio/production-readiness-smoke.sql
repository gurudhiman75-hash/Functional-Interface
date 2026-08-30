\set ON_ERROR_STOP on

INSERT INTO identity.users (id) VALUES ('00000000-0000-4000-8000-000000000001') ON CONFLICT DO NOTHING;

INSERT INTO content.source_documents (
  id, source_type, source_uri, title, publisher, mime_type, content_hash,
  rights_basis, retention_mode, extraction_status, extracted_text, extraction_metadata,
  created_by, created_at, updated_at
) VALUES (
  '10000000-0000-4000-8000-000000000001', 'web', 'https://example.com/source', 'Seed source', 'ExamTree QA', 'text/html', repeat('a', 64),
  'user_supplied', 'extracted_text', 'processed', repeat('Seed evidence text for Notes Studio lifecycle validation. ', 6), '{}'::jsonb,
  '00000000-0000-4000-8000-000000000001', now(), now()
);

INSERT INTO content.note_authoring_jobs (
  id, title, source_language, state, brief, target_resource_id,
  created_by, updated_by, created_at, updated_at
) VALUES (
  '20000000-0000-4000-8000-000000000001', 'NS-008 seeded lifecycle', 'en', 'brief',
  '{"topicLabel":"Seed topic","depth":"standard","learnerLevel":"standard","examIds":[]}'::jsonb, null,
  '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', now(), now()
);

INSERT INTO content.note_authoring_sources (
  job_id, source_document_id, inclusion_state, relevance_score, position, added_by, added_at, updated_at
) VALUES (
  '20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'included', 100, 0,
  '00000000-0000-4000-8000-000000000001', now(), now()
);
UPDATE content.note_authoring_jobs SET state = 'sources_ready' WHERE id = '20000000-0000-4000-8000-000000000001';

INSERT INTO content.note_source_evidence_blocks (
  id, job_id, source_document_id, block_index, excerpt, excerpt_hash, char_start, char_end, locator
) VALUES (
  '30000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001',
  '10000000-0000-4000-8000-000000000001', 0,
  'Punjab has five major historic river names used in standard geography notes.', repeat('b', 64), 0, 72,
  '{"kind":"character_range","start":0,"end":72}'::jsonb
);

INSERT INTO content.note_source_claims (
  id, job_id, claim_text, claim_hash, state, confidence, editorial_note, created_by, updated_by
) VALUES (
  '40000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001',
  'Punjab geography notes commonly organize the river system around five historic river names.', repeat('c', 64),
  'accepted', 0.990, 'Seeded accepted claim', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001'
);
INSERT INTO content.note_source_claim_evidence (job_id, claim_id, evidence_block_id, relation, created_by)
VALUES (
  '20000000-0000-4000-8000-000000000001', '40000000-0000-4000-8000-000000000001',
  '30000000-0000-4000-8000-000000000001', 'supports', '00000000-0000-4000-8000-000000000001'
);
UPDATE content.note_authoring_jobs SET state = 'evidence_ready' WHERE id = '20000000-0000-4000-8000-000000000001';

INSERT INTO content.note_coverage_plan_items (
  id, job_id, title, syllabus_ref, priority, planned_depth, exam_rationale, sort_order, created_by, updated_by
) VALUES (
  '50000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001',
  'Punjab river-system foundation', 'Static GK / Punjab Geography', 'required', 'standard', 'Frequently examinable foundation fact', 0,
  '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001'
);
INSERT INTO content.note_coverage_item_claims (job_id, coverage_item_id, claim_id, created_by)
VALUES (
  '20000000-0000-4000-8000-000000000001', '50000000-0000-4000-8000-000000000001',
  '40000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001'
);
UPDATE content.note_authoring_jobs SET state = 'outline_ready' WHERE id = '20000000-0000-4000-8000-000000000001';

INSERT INTO content.note_sections (
  id, job_id, coverage_item_id, title, sort_order, state, markdown,
  input_fingerprint, output_fingerprint, prompt_version, provider, model, generation_metadata,
  created_by, updated_by
) VALUES (
  '60000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001',
  '50000000-0000-4000-8000-000000000001', 'Punjab river-system foundation', 0, 'qa_passed',
  'Punjab geography notes commonly organize the river system around five historic river names.',
  repeat('d', 64), repeat('e', 64), 'notes-section-v1', 'openai', 'seed-model', '{"seeded":true}'::jsonb,
  '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001'
);
INSERT INTO content.note_section_claims (job_id, section_id, claim_id, position, role)
VALUES (
  '20000000-0000-4000-8000-000000000001', '60000000-0000-4000-8000-000000000001',
  '40000000-0000-4000-8000-000000000001', 0, 'core'
);
INSERT INTO content.note_quality_runs (
  id, job_id, section_id, section_output_fingerprint, evidence_fingerprint, policy_version,
  verifier_provider, verifier_model, verifier_prompt_version, verifier_metadata, status,
  warning_count, fail_count, created_by
) VALUES (
  '70000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001',
  '60000000-0000-4000-8000-000000000001', repeat('e', 64), repeat('f', 64), 'notes-qa-v1',
  'openai', 'seed-verifier', 'notes-qa-grounding-v1', '{"seeded":true}'::jsonb, 'passed', 0, 0,
  '00000000-0000-4000-8000-000000000001'
);
INSERT INTO content.note_quality_checks (run_id, check_code, label, status, blocking, summary)
VALUES ('70000000-0000-4000-8000-000000000001', 'grounding', 'Grounding', 'pass', true, 'Seeded grounding passed.');
UPDATE content.note_authoring_jobs SET state = 'review_ready' WHERE id = '20000000-0000-4000-8000-000000000001';

INSERT INTO content.note_approved_versions (
  id, job_id, source_language, learner_title, learner_summary, body_markdown,
  content_hash, approval_fingerprint, brief_snapshot, exam_ids, section_manifest, qa_manifest,
  approved_by, approved_at
) VALUES (
  '80000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000001', 'en',
  'Punjab River System', 'Seeded learner summary.', '## Punjab river-system foundation\n\nPunjab geography notes commonly organize the river system around five historic river names.',
  repeat('1', 64), repeat('2', 64), '{"topicLabel":"Seed topic"}'::jsonb, '[]'::jsonb,
  '[{"id":"60000000-0000-4000-8000-000000000001","outputFingerprint":"eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"}]'::jsonb,
  '[{"qualityRunId":"70000000-0000-4000-8000-000000000001","evidenceFingerprint":"ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"}]'::jsonb,
  '00000000-0000-4000-8000-000000000001', now()
);
UPDATE content.note_authoring_jobs SET state = 'approved' WHERE id = '20000000-0000-4000-8000-000000000001';

INSERT INTO content.learning_resources (
  id, public_code, category, format, title, summary, language_code, body_markdown, status,
  created_by, updated_by, created_at, updated_at
) VALUES (
  '90000000-0000-4000-8000-000000000001', 'NOTE_NS008_SOURCE', 'notes', 'article', 'Punjab River System',
  'Seeded learner summary.', 'en', '## Punjab river-system foundation\n\nPunjab geography notes commonly organize the river system around five historic river names.',
  'draft', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', now(), now()
);
INSERT INTO content.learning_resource_exams (resource_id, exam_id)
VALUES ('90000000-0000-4000-8000-000000000001', 'aaaaaaaa-0000-4000-8000-000000000001');
INSERT INTO content.note_materializations (approved_version_id, resource_id, materialized_by)
VALUES ('80000000-0000-4000-8000-000000000001', '90000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001');
UPDATE content.note_authoring_jobs SET state = 'materialized', target_resource_id = '90000000-0000-4000-8000-000000000001' WHERE id = '20000000-0000-4000-8000-000000000001';

INSERT INTO content.learning_resources (
  id, public_code, category, format, title, summary, language_code, body_markdown, status,
  created_by, updated_by, created_at, updated_at
) VALUES (
  '90000000-0000-4000-8000-000000000002', 'NOTE_NS008_HI', 'notes', 'article', 'पंजाब नदी तंत्र',
  'परीक्षा के लिए संक्षिप्त सार।', 'hi', '## पंजाब नदी तंत्र\n\nपंजाब के भूगोल में पाँच ऐतिहासिक नदी नामों का अध्ययन किया जाता है।',
  'draft', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001', now(), now()
);
INSERT INTO content.note_localizations (
  id, approved_version_id, language_code, state, title, summary, body_markdown,
  source_content_hash, content_hash, quality, generation_metadata, materialized_resource_id,
  created_by, updated_by
) VALUES (
  'a0000000-0000-4000-8000-000000000001', '80000000-0000-4000-8000-000000000001', 'hi', 'materialized',
  'पंजाब नदी तंत्र', 'परीक्षा के लिए संक्षिप्त सार।', '## पंजाब नदी तंत्र\n\nपंजाब के भूगोल में पाँच ऐतिहासिक नदी नामों का अध्ययन किया जाता है।',
  repeat('1', 64), repeat('3', 64), '{"ready":true}'::jsonb, '{"mode":"seed"}'::jsonb,
  '90000000-0000-4000-8000-000000000002', '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001'
);

INSERT INTO content.note_publish_handoffs (
  id, approved_version_id, localization_id, resource_id, variant_key, language_code,
  frozen_content_hash, resource_snapshot, handed_off_by
) VALUES (
  'b0000000-0000-4000-8000-000000000001', '80000000-0000-4000-8000-000000000001', null,
  '90000000-0000-4000-8000-000000000001', 'source', 'en', repeat('1', 64),
  '{"status":"draft","publicCode":"NOTE_NS008_SOURCE"}'::jsonb, '00000000-0000-4000-8000-000000000001'
), (
  'b0000000-0000-4000-8000-000000000002', '80000000-0000-4000-8000-000000000001',
  'a0000000-0000-4000-8000-000000000001', '90000000-0000-4000-8000-000000000002', 'hi', 'hi', repeat('3', 64),
  '{"status":"draft","publicCode":"NOTE_NS008_HI"}'::jsonb, '00000000-0000-4000-8000-000000000001'
);

DO $$
DECLARE
  version_no INTEGER;
BEGIN
  SELECT version_number INTO version_no FROM content.note_approved_versions WHERE id = '80000000-0000-4000-8000-000000000001';
  IF version_no <> 1 THEN RAISE EXCEPTION 'initial approved version number was not frozen from job revision'; END IF;
END $$;

DO $$
BEGIN
  BEGIN
    UPDATE content.learning_resources SET title = 'ILLEGAL DRIFT' WHERE id = '90000000-0000-4000-8000-000000000001';
    RAISE EXCEPTION 'content freeze did not fire';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM = 'content freeze did not fire' OR position('materialized learner copy is frozen' in SQLERRM) = 0 THEN RAISE; END IF;
  END;
END $$;

UPDATE content.learning_resources
SET status = 'published', published_at = now(), updated_at = now()
WHERE id = '90000000-0000-4000-8000-000000000001';

DO $$
BEGIN
  BEGIN
    DELETE FROM content.learning_resource_exams WHERE resource_id = '90000000-0000-4000-8000-000000000001';
    RAISE EXCEPTION 'exam-target freeze did not fire';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM = 'exam-target freeze did not fire' OR position('exam targets are frozen' in SQLERRM) = 0 THEN RAISE; END IF;
  END;
END $$;

INSERT INTO content.note_authoring_jobs (
  id, title, source_language, state, brief, revision_number,
  predecessor_approved_version_id, lineage_root_approved_version_id, revision_reason,
  created_by, updated_by
) VALUES (
  '20000000-0000-4000-8000-000000000002', 'NS-008 seeded lifecycle · revision 2', 'en', 'brief',
  '{"topicLabel":"Seed topic","depth":"standard","learnerLevel":"standard","examIds":[]}'::jsonb, 2,
  '80000000-0000-4000-8000-000000000001', '80000000-0000-4000-8000-000000000001', 'Refresh the note for a new evidence cycle.',
  '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001'
);
INSERT INTO content.note_authoring_sources (
  job_id, source_document_id, inclusion_state, relevance_score, position, added_by
) VALUES (
  '20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'included', 100, 0,
  '00000000-0000-4000-8000-000000000001'
);

DO $$
DECLARE
  evidence_count INTEGER;
  section_count INTEGER;
  qa_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO evidence_count FROM content.note_source_claims WHERE job_id = '20000000-0000-4000-8000-000000000002';
  SELECT COUNT(*) INTO section_count FROM content.note_sections WHERE job_id = '20000000-0000-4000-8000-000000000002';
  SELECT COUNT(*) INTO qa_count FROM content.note_quality_runs WHERE job_id = '20000000-0000-4000-8000-000000000002';
  IF evidence_count <> 0 OR section_count <> 0 OR qa_count <> 0 THEN
    RAISE EXCEPTION 'successor inherited evidence, sections or QA';
  END IF;
END $$;

DO $$
BEGIN
  BEGIN
    UPDATE content.note_authoring_jobs SET revision_reason = 'mutated' WHERE id = '20000000-0000-4000-8000-000000000002';
    RAISE EXCEPTION 'lineage mutation guard did not fire';
  EXCEPTION WHEN OTHERS THEN
    IF SQLERRM = 'lineage mutation guard did not fire' OR position('revision lineage is immutable' in SQLERRM) = 0 THEN RAISE; END IF;
  END;
END $$;

DO $$
BEGIN
  BEGIN
    INSERT INTO content.note_authoring_jobs (
      id, title, source_language, state, brief, revision_number,
      predecessor_approved_version_id, lineage_root_approved_version_id, revision_reason,
      created_by, updated_by
    ) VALUES (
      '20000000-0000-4000-8000-000000000003', 'Illegal fork', 'en', 'brief', '{}'::jsonb, 2,
      '80000000-0000-4000-8000-000000000001', '80000000-0000-4000-8000-000000000001', 'Should be rejected.',
      '00000000-0000-4000-8000-000000000001', '00000000-0000-4000-8000-000000000001'
    );
    RAISE EXCEPTION 'successor uniqueness guard did not fire';
  EXCEPTION WHEN unique_violation THEN
    NULL;
  END;
END $$;

DO $$
DECLARE
  handoff_count INTEGER;
  source_status TEXT;
BEGIN
  SELECT COUNT(*) INTO handoff_count FROM content.note_publish_handoffs WHERE approved_version_id = '80000000-0000-4000-8000-000000000001';
  SELECT status INTO source_status FROM content.learning_resources WHERE id = '90000000-0000-4000-8000-000000000001';
  IF handoff_count <> 2 THEN RAISE EXCEPTION 'expected source + Hindi release handoffs'; END IF;
  IF source_status <> 'published' THEN RAISE EXCEPTION 'canonical status transition was unexpectedly blocked'; END IF;
END $$;

SELECT 'Notes Studio NS-008 seeded PostgreSQL lifecycle passed' AS result;
