-- Historical recovery: seven exact, independently validated legacy single-question results.
-- Additive/idempotent: keeps original scores and result_snapshot unchanged.
-- The eighth legacy result lacks questionReview and MUST NOT be reconstructed.
-- All seven mappings were checked against test version, hashed legacy question ID,
-- exact stem/section/options, answer key and score on 2026-10-10.
-- Run in a controlled maintenance window after reviewing the preview.
WITH target(attempt_id, question_version_id, legacy_question_id) AS (
  VALUES
  ('016a0096-e312-44a2-8169-c4c4273d4e74'::uuid, '0e58d235-c58b-4be9-845d-289a46156bc8'::uuid, 2071537097::bigint),
  ('f3bbdce8-f080-449f-a628-737d84a09cfd'::uuid, '0e58d235-c58b-4be9-845d-289a46156bc8'::uuid, 2071537097::bigint),
  ('6beb70fb-0175-4c8a-862c-fc009aec226a'::uuid, '0e58d235-c58b-4be9-845d-289a46156bc8'::uuid, 2071537097::bigint),
  ('41c627b7-5bf2-4253-9da0-501fe1f59485'::uuid, '0e58d235-c58b-4be9-845d-289a46156bc8'::uuid, 2071537097::bigint),
  ('62a64f7d-e3af-4c53-8d82-559d5a7ffe67'::uuid, '48f94866-b481-4ae7-aca6-2b1bb26acda2'::uuid, 3688837751::bigint),
  ('bbdfb64d-281e-42ef-b04f-57290be00491'::uuid, '48f94866-b481-4ae7-aca6-2b1bb26acda2'::uuid, 3688837751::bigint),
  ('468fde18-cc7c-4a50-9c51-830cc4b271a8'::uuid, '0e58d235-c58b-4be9-845d-289a46156bc8'::uuid, 2071537097::bigint)
),
candidate AS (
  SELECT t.attempt_id, t.question_version_id, a.submitted_at, a.raw_score,
    a.correct_count, a.incorrect_count, a.unattempted_count,
    a.result_snapshot->'questionReview'->0 AS review,
    q.marks, q.negative_marks, o.option_keys, o.option_texts,
    o.correct_option_index, o.correct_options
  FROM target t
  JOIN learning.attempts a ON a.id=t.attempt_id AND a.status='evaluated'
  JOIN assessment.test_publications p ON p.id=a.test_publication_id
  JOIN assessment.test_questions q ON q.test_version_id=p.test_version_id AND q.question_version_id=t.question_version_id
  JOIN assessment.test_sections section ON section.id=q.test_section_id
  JOIN content.question_versions v ON v.id=q.question_version_id
  JOIN LATERAL (
    SELECT array_agg(opt.option_key ORDER BY opt.sort_order) AS option_keys,
      jsonb_agg(opt.text ORDER BY opt.sort_order) AS option_texts,
      array_position(array_agg(opt.is_correct ORDER BY opt.sort_order),true)-1 AS correct_option_index,
      count(*) FILTER (WHERE opt.is_correct)::integer AS correct_options
    FROM content.question_options opt WHERE opt.question_version_id=t.question_version_id
  ) o ON true
  WHERE NOT EXISTS (SELECT 1 FROM learning.attempt_responses r WHERE r.attempt_id=t.attempt_id)
    AND jsonb_typeof(a.result_snapshot->'questionReview')='array'
    AND jsonb_array_length(a.result_snapshot->'questionReview')=1
    AND (a.result_snapshot->'questionReview'->0->>'questionId')::bigint=t.legacy_question_id
    AND a.result_snapshot->'questionReview'->0->>'section'=section.name
    AND a.result_snapshot->'questionReview'->0->>'text'=v.stem
    AND a.result_snapshot->'questionReview'->0->'options'=o.option_texts
    AND (a.result_snapshot->'questionReview'->0->>'correct')::int=o.correct_option_index
    AND o.correct_options=1
),
eligible AS (
  SELECT *, (review->>'selected')::int AS selected
  FROM candidate
  WHERE ((review->>'selected') IS NULL OR (review->>'selected')::int BETWEEN 0 AND cardinality(option_keys)-1)
    AND (
      CASE WHEN review->>'selected' IS NULL THEN 0::numeric
        WHEN (review->>'selected')::int=correct_option_index THEN marks
        ELSE -negative_marks END
      )=raw_score
    AND correct_count=(CASE WHEN review->>'selected' IS NOT NULL AND (review->>'selected')::int=correct_option_index THEN 1 ELSE 0 END)
    AND incorrect_count=(CASE WHEN review->>'selected' IS NOT NULL AND (review->>'selected')::int<>correct_option_index THEN 1 ELSE 0 END)
    AND unattempted_count=(CASE WHEN review->>'selected' IS NULL THEN 1 ELSE 0 END)
),
gate AS (SELECT count(*)::int AS count FROM eligible),
inserted AS (
  INSERT INTO learning.attempt_responses (
    attempt_id,question_version_id,response,selected_option_keys,is_correct,
    awarded_marks,time_spent_seconds,answered_at,updated_at
  )
  SELECT e.attempt_id,e.question_version_id,
    jsonb_build_object(
      'selectedOptionIndex',e.selected,
      'selectedOptionKey',CASE WHEN e.selected IS NULL THEN NULL ELSE e.option_keys[e.selected+1] END,
      'flagged',COALESCE((e.review->>'flagged')::boolean,false),
      'recoverySource','legacy_result_snapshot.questionReview',
      'exactAnswerTimestampAvailable',false
    ),
    CASE WHEN e.selected IS NULL THEN '[]'::jsonb ELSE to_jsonb(ARRAY[e.option_keys[e.selected+1]]) END,
    CASE WHEN e.selected IS NULL THEN NULL ELSE e.selected=e.correct_option_index END,
    CASE WHEN e.selected IS NULL THEN 0::numeric
      WHEN e.selected=e.correct_option_index THEN e.marks ELSE -e.negative_marks END,
    0,NULL,now()
  FROM eligible e CROSS JOIN gate g WHERE g.count=7
  ON CONFLICT (attempt_id,question_version_id) DO NOTHING
  RETURNING attempt_id
),
audited AS (
  INSERT INTO platform.audit_events (
    id,actor_type,action_key,entity_type,entity_id,reason,summary,metadata
  )
  SELECT gen_random_uuid(),'system'::audit_actor_type,
    'student.attempt.legacy_response_recovered','attempt',i.attempt_id,
    'Exact historic question response reconstructed from stored result snapshot',
    'Recovered missing canonical question response without changing result score',
    jsonb_build_object('source','legacy_result_snapshot.questionReview',
      'canonicalScoreUnchanged',true,'answerTimeKnown',false)
  FROM inserted i
  RETURNING id
)
SELECT (SELECT count FROM gate) AS verified_candidates,
 (SELECT count(*)::int FROM inserted) AS responses_inserted,
 (SELECT count(*)::int FROM audited) AS audit_events_written;