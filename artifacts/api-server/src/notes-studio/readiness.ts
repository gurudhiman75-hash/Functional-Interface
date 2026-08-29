import { sqlClient } from '../lib/db';

export async function refreshNotesAuthoringReadiness(jobId: string, actorUserId: string) {
  const rows = await sqlClient`
    WITH readiness AS (
      SELECT
        EXISTS (
          SELECT 1
          FROM content.note_authoring_sources link
          JOIN content.source_documents document ON document.id = link.source_document_id
          WHERE link.job_id = ${jobId}::uuid
            AND link.inclusion_state = 'included'
            AND document.retention_mode = 'extracted_text'
            AND document.extraction_status = 'processed'
            AND LENGTH(COALESCE(document.extracted_text, '')) >= 100
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
    )
    UPDATE content.note_authoring_jobs job
    SET state = CASE
      WHEN NOT readiness.has_sources THEN 'brief'
      WHEN readiness.has_active_conflict THEN 'evidence_ready'
      WHEN NOT readiness.has_accepted_evidence THEN 'sources_ready'
      WHEN readiness.has_core_coverage AND readiness.core_covered THEN 'outline_ready'
      ELSE 'evidence_ready'
    END,
    updated_by = ${actorUserId}::uuid,
    updated_at = now()
    FROM readiness
    WHERE job.id = ${jobId}::uuid
      AND job.state IN ('brief', 'sources_ready', 'evidence_ready', 'outline_ready')
    RETURNING job.id::text AS id, job.state
  `;
  return rows[0] ?? null;
}
