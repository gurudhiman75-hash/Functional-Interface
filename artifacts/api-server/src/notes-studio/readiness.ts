import { sqlClient } from '../lib/db';

export async function refreshNotesAuthoringReadiness(jobId: string, actorUserId: string) {
  const rows = await sqlClient`
    WITH readiness AS (
      SELECT
        job.state AS previous_state,
        EXISTS (
          SELECT 1
          FROM content.note_authoring_sources link
          JOIN content.source_documents document ON document.id = link.source_document_id
          WHERE link.job_id = ${jobId}::uuid
            AND link.inclusion_state = 'included'
            AND (
              (
                document.retention_mode = 'extracted_text'
                AND document.extraction_status = 'processed'
                AND LENGTH(COALESCE(document.extracted_text, '')) >= 100
              )
              OR EXISTS (
                SELECT 1
                FROM content.note_source_evidence_blocks block
                WHERE block.job_id = link.job_id
                  AND block.source_document_id = link.source_document_id
                  AND block.evidence_kind = 'editor_reference_note'
              )
            )
        ) AS has_sources,
        EXISTS (
          SELECT 1
          FROM content.note_source_claims claim
          JOIN content.note_source_claim_evidence mapping
            ON mapping.job_id = claim.job_id AND mapping.claim_id = claim.id
          JOIN content.note_source_evidence_blocks block
            ON block.job_id = mapping.job_id AND block.id = mapping.evidence_block_id
          JOIN content.note_authoring_sources link
            ON link.job_id = block.job_id AND link.source_document_id = block.source_document_id
          WHERE claim.job_id = ${jobId}::uuid
            AND claim.state = 'conflict'
            AND link.inclusion_state = 'included'
        ) AS has_active_conflict,
        EXISTS (
          SELECT 1
          FROM content.note_source_claims claim
          JOIN content.note_source_claim_evidence mapping
            ON mapping.job_id = claim.job_id AND mapping.claim_id = claim.id AND mapping.relation = 'supports'
          JOIN content.note_source_evidence_blocks block
            ON block.job_id = mapping.job_id AND block.id = mapping.evidence_block_id
          JOIN content.note_authoring_sources link
            ON link.job_id = block.job_id AND link.source_document_id = block.source_document_id
          WHERE claim.job_id = ${jobId}::uuid
            AND claim.state = 'accepted'
            AND link.inclusion_state = 'included'
        ) AS has_accepted_evidence,
        EXISTS (
          SELECT 1
          FROM content.note_coverage_plan_items item
          WHERE item.job_id = ${jobId}::uuid AND item.priority IN ('required', 'high')
        ) AS has_core_coverage,
        NOT EXISTS (
          SELECT 1
          FROM content.note_coverage_plan_items item
          WHERE item.job_id = ${jobId}::uuid
            AND item.priority IN ('required', 'high')
            AND NOT EXISTS (
              SELECT 1
              FROM content.note_coverage_item_claims coverage_claim
              JOIN content.note_source_claims claim
                ON claim.job_id = coverage_claim.job_id AND claim.id = coverage_claim.claim_id
              WHERE coverage_claim.job_id = item.job_id
                AND coverage_claim.coverage_item_id = item.id
                AND claim.state = 'accepted'
                AND EXISTS (
                  SELECT 1
                  FROM content.note_source_claim_evidence mapping
                  JOIN content.note_source_evidence_blocks block
                    ON block.job_id = mapping.job_id AND block.id = mapping.evidence_block_id
                  JOIN content.note_authoring_sources link
                    ON link.job_id = block.job_id AND link.source_document_id = block.source_document_id
                  WHERE mapping.job_id = claim.job_id
                    AND mapping.claim_id = claim.id
                    AND mapping.relation = 'supports'
                    AND link.inclusion_state = 'included'
                )
            )
        ) AS core_covered
      FROM content.note_authoring_jobs job
      WHERE job.id = ${jobId}::uuid
    ), decision AS (
      SELECT
        previous_state,
        CASE
          WHEN NOT has_sources THEN 'brief'
          WHEN has_active_conflict THEN 'evidence_ready'
          WHEN NOT has_accepted_evidence THEN 'sources_ready'
          WHEN NOT has_core_coverage OR NOT core_covered THEN 'evidence_ready'
          WHEN previous_state IN ('drafting', 'qa_required', 'review_ready', 'approved', 'materialized') THEN previous_state
          ELSE 'outline_ready'
        END AS next_state
      FROM readiness
    ), updated AS (
      UPDATE content.note_authoring_jobs job
      SET state = decision.next_state,
          updated_by = ${actorUserId}::uuid,
          updated_at = now()
      FROM decision
      WHERE job.id = ${jobId}::uuid
      RETURNING job.id::text AS id, decision.previous_state, job.state
    )
    SELECT * FROM updated
  `;
  const result = rows[0] ?? null;
  if (result && ['drafting', 'qa_required', 'review_ready', 'approved'].includes(String(result.previous_state))
    && ['brief', 'sources_ready', 'evidence_ready'].includes(String(result.state))) {
    await sqlClient`
      UPDATE content.note_sections
      SET state = 'needs_editorial',
          generation_metadata = generation_metadata || ${JSON.stringify({ staleBecauseEvidenceChanged: true })}::jsonb,
          updated_by = ${actorUserId}::uuid,
          updated_at = now()
      WHERE job_id = ${jobId}::uuid AND state <> 'needs_editorial'
    `;
  }
  return result;
}
