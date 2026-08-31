import { randomUUID } from 'node:crypto';
import { Router, type IRouter, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';
import {
  normalizeResearchRestartReason,
  researchRestartAllowed,
  researchRestartDiscardTotal,
  researchRestartTargetState,
  type ResearchRestartDiscardCounts,
} from '../notes-studio/research-restart';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

class ResearchRestartError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new ResearchRestartError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function optionalUuid(value: unknown, label: string): string | null {
  const candidate = text(value, 80);
  if (!candidate) return null;
  if (!uuidPattern.test(candidate)) throw new ResearchRestartError('INVALID_ID', `${label} is invalid.`);
  return candidate;
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof ResearchRestartError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'NOTES_STUDIO_RESEARCH_RESTART_FAILED' });
}

router.use(authenticate);

router.get('/jobs/:jobId/research-restarts', requireAdminPermission('content.questions.read'), async (req, res) => {
  try {
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    const jobRows = await sqlClient`
      SELECT id::text AS id, title, state
      FROM content.note_authoring_jobs
      WHERE id = ${jobId}::uuid
      LIMIT 1
    `;
    if (!jobRows[0]) throw new ResearchRestartError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
    const restarts = await sqlClient`
      SELECT
        restart.id::text AS id,
        restart.restart_number AS "restartNumber",
        restart.from_state AS "fromState",
        restart.to_state AS "toState",
        restart.reason,
        restart.coverage_item_id::text AS "coverageItemId",
        restart.recommended_source_document_id::text AS "recommendedSourceDocumentId",
        restart.discard_snapshot AS "discardSnapshot",
        restart.intent_snapshot AS "intentSnapshot",
        restart.created_by::text AS "createdBy",
        restart.created_at AS "createdAt",
        source.title AS "recommendedSourceTitle"
      FROM content.note_research_restarts restart
      LEFT JOIN content.source_documents source ON source.id = restart.recommended_source_document_id
      WHERE restart.job_id = ${jobId}::uuid
      ORDER BY restart.restart_number DESC, restart.created_at DESC
      LIMIT 100
    `;
    res.json({ job: jobRows[0], restarts, immutableHistory: true });
  } catch (error) {
    sendError(res, error, 'Unable to load Notes Studio research restart history');
  }
});

router.post('/jobs/:jobId/research-restart', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new ResearchRestartError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    const reason = normalizeResearchRestartReason(req.body?.reason);
    if (reason.length < 4) throw new ResearchRestartError('RESEARCH_RESTART_REASON_REQUIRED', 'Enter a research restart reason of at least 4 characters.');
    const coverageItemId = optionalUuid(req.body?.coverageItemId, 'Coverage item ID');
    const recommendedSourceId = optionalUuid(req.body?.recommendedSourceId, 'Recommended source ID');
    const restartId = randomUUID();

    const result = await sqlClient.begin(async (tx) => {
      const jobRows = await tx`
        SELECT
          job.id::text AS id,
          job.title,
          job.state,
          EXISTS (SELECT 1 FROM content.note_approved_versions version WHERE version.job_id = job.id) AS "hasApprovedVersion",
          COALESCE((
            SELECT COUNT(*)
            FROM content.note_authoring_sources link
            JOIN content.source_documents document ON document.id = link.source_document_id
            WHERE link.job_id = job.id
              AND link.inclusion_state = 'included'
              AND document.retention_mode = 'extracted_text'
              AND document.extraction_status = 'processed'
              AND LENGTH(COALESCE(document.extracted_text, '')) >= 100
          ), 0)::int AS "generationReadySourceCount"
        FROM content.note_authoring_jobs job
        WHERE job.id = ${jobId}::uuid
        FOR UPDATE
      `;
      const job = jobRows[0];
      if (!job) throw new ResearchRestartError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
      if (job.hasApprovedVersion === true || ['approved', 'materialized'].includes(String(job.state))) {
        throw new ResearchRestartError(
          'APPROVED_JOB_REQUIRES_SUCCESSOR',
          'Approved/materialized Notes Studio work is immutable. Create the existing successor revision instead of restarting research in place.',
          409,
        );
      }
      if (!researchRestartAllowed(job.state)) {
        throw new ResearchRestartError(
          'RESEARCH_RESTART_NOT_REQUIRED',
          'Research restart is available only after evidence work has begun and before approval. Brief/source-ready jobs can edit their source pack directly.',
          409,
        );
      }

      let coverageIntent: Record<string, unknown> | null = null;
      if (coverageItemId) {
        const coverageRows = await tx`
          SELECT id::text AS id, title, syllabus_ref AS "syllabusRef", priority,
                 planned_depth AS "plannedDepth", exam_rationale AS "examRationale"
          FROM content.note_coverage_plan_items
          WHERE id = ${coverageItemId}::uuid AND job_id = ${jobId}::uuid
          LIMIT 1
        `;
        if (!coverageRows[0]) throw new ResearchRestartError('COVERAGE_ITEM_NOT_FOUND', 'Coverage item does not belong to this authoring job.', 404);
        coverageIntent = coverageRows[0] as Record<string, unknown>;
      }

      let sourceIntent: Record<string, unknown> | null = null;
      if (recommendedSourceId) {
        const sourceRows = await tx`
          SELECT
            document.id::text AS id,
            document.title,
            document.publisher,
            document.source_uri AS "sourceUri",
            document.content_hash AS "contentHash",
            document.rights_basis AS "rightsBasis",
            document.retention_mode AS "retentionMode",
            document.extraction_status AS "extractionStatus",
            LENGTH(COALESCE(document.extracted_text, ''))::int AS "retainedCharCount",
            EXISTS (
              SELECT 1 FROM content.note_authoring_sources link
              WHERE link.job_id = ${jobId}::uuid AND link.source_document_id = document.id
            ) AS "alreadyAttached"
          FROM content.source_documents document
          WHERE document.id = ${recommendedSourceId}::uuid
          LIMIT 1
        `;
        const source = sourceRows[0];
        if (!source) throw new ResearchRestartError('SOURCE_NOT_FOUND', 'Recommended governed source was not found.', 404);
        const generationReady = source.retentionMode === 'extracted_text'
          && source.extractionStatus === 'processed'
          && Number(source.retainedCharCount ?? 0) >= 100;
        if (!generationReady) {
          throw new ResearchRestartError('SOURCE_NOT_GENERATION_READY', 'Research restart intent must reference a governed generation-ready source.', 409);
        }
        sourceIntent = {
          id: source.id,
          title: source.title,
          publisher: source.publisher,
          sourceUri: source.sourceUri,
          contentHash: source.contentHash,
          rightsBasis: source.rightsBasis,
          alreadyAttached: source.alreadyAttached === true,
          generationReady: true,
        };
      }

      const countRows = await tx`
        SELECT
          (SELECT COUNT(*) FROM content.note_source_evidence_blocks WHERE job_id = ${jobId}::uuid)::int AS "evidenceBlocks",
          (SELECT COUNT(*) FROM content.note_source_claims WHERE job_id = ${jobId}::uuid)::int AS claims,
          (SELECT COUNT(*) FROM content.note_coverage_item_claims WHERE job_id = ${jobId}::uuid)::int AS "coverageMappings",
          (SELECT COUNT(*) FROM content.note_sections WHERE job_id = ${jobId}::uuid)::int AS sections,
          (SELECT COUNT(*) FROM content.note_quality_runs WHERE job_id = ${jobId}::uuid)::int AS "qualityRuns",
          (SELECT COUNT(*) FROM content.note_generation_events WHERE job_id = ${jobId}::uuid)::int AS "generationEvents"
      `;
      const counts = countRows[0] as unknown as ResearchRestartDiscardCounts;
      const targetState = researchRestartTargetState(Number(job.generationReadySourceCount ?? 0));
      const restartNumberRows = await tx`
        SELECT COALESCE(MAX(restart_number), 0)::int + 1 AS next
        FROM content.note_research_restarts
        WHERE job_id = ${jobId}::uuid
      `;
      const restartNumber = Number(restartNumberRows[0]?.next ?? 1);
      const intentSnapshot = {
        coverage: coverageIntent,
        recommendedSource: sourceIntent,
        recommendedSourceAttachedAutomatically: false,
        coveragePlanPreserved: true,
      };

      await tx`
        INSERT INTO content.note_research_restarts (
          id, job_id, restart_number, from_state, to_state, reason,
          coverage_item_id, recommended_source_document_id,
          discard_snapshot, intent_snapshot, created_by, created_at
        ) VALUES (
          ${restartId}::uuid, ${jobId}::uuid, ${restartNumber}, ${String(job.state)}, ${targetState}, ${reason},
          ${coverageItemId}::uuid, ${recommendedSourceId}::uuid,
          ${JSON.stringify({ ...counts, total: researchRestartDiscardTotal(counts) })},
          ${JSON.stringify(intentSnapshot)}, ${actorUserId}::uuid, now()
        )
      `;

      await tx`DELETE FROM content.note_generation_events WHERE job_id = ${jobId}::uuid`;
      await tx`DELETE FROM content.note_sections WHERE job_id = ${jobId}::uuid`;
      await tx`DELETE FROM content.note_coverage_item_claims WHERE job_id = ${jobId}::uuid`;
      await tx`DELETE FROM content.note_source_claims WHERE job_id = ${jobId}::uuid`;
      await tx`DELETE FROM content.note_source_evidence_blocks WHERE job_id = ${jobId}::uuid`;
      await tx`
        UPDATE content.note_authoring_jobs
        SET state = ${targetState}, updated_by = ${actorUserId}::uuid, updated_at = now()
        WHERE id = ${jobId}::uuid
      `;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
          'notes_studio.research.restarted', 'note_authoring_job', ${jobId}::uuid,
          ${`Restarted Notes Studio research from ${String(job.state)} to ${targetState}`},
          ${JSON.stringify({
            restartId,
            restartNumber,
            reason,
            fromState: job.state,
            toState: targetState,
            coverageItemId,
            recommendedSourceId,
            discardCounts: counts,
            coveragePlanPreserved: true,
            sourcePackPreserved: true,
            recommendedSourceAttachedAutomatically: false,
          })}
        )
      `;

      return {
        restartId,
        restartNumber,
        jobId,
        fromState: String(job.state),
        toState: targetState,
        reason,
        discardCounts: counts,
        discardedTotal: researchRestartDiscardTotal(counts),
        coveragePlanPreserved: true,
        sourcePackPreserved: true,
        recommendedSourceAttachedAutomatically: false,
        recommendedSourceId,
        coverageItemId,
      };
    });

    res.status(201).json({
      restart: result,
      automaticSourceAttachment: false,
      automaticEvidenceAcceptance: false,
      automaticGeneration: false,
      nextAction: 'Review the preserved source pack, explicitly attach any new governed source, then rebuild evidence from the complete pack.',
    });
  } catch (error) {
    sendError(res, error, 'Unable to restart Notes Studio research');
  }
});

export default router;
