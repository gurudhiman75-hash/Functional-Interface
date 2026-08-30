import { randomUUID } from 'node:crypto';
import { Router, type IRouter, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';
import {
  evaluateNotesSectionQuality,
  notesQualityEvidenceFingerprint,
  type NotesSectionQualityInput,
  type QualityClaimInput,
} from '../notes-studio/quality-gates';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

class NotesStudioQualityError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new NotesStudioQualityError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof NotesStudioQualityError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'NOTES_STUDIO_QUALITY_FAILED' });
}

async function loadJob(jobId: string) {
  const rows = await sqlClient`
    SELECT id::text AS id, title, state, source_language AS "sourceLanguage"
    FROM content.note_authoring_jobs
    WHERE id = ${jobId}::uuid
    LIMIT 1
  `;
  if (!rows[0]) throw new NotesStudioQualityError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
  return rows[0] as Record<string, unknown>;
}

async function activeConflictCount(jobId: string): Promise<number> {
  const rows = await sqlClient`
    SELECT COUNT(*)::int AS count
    FROM content.note_source_claims claim
    WHERE claim.job_id = ${jobId}::uuid
      AND claim.state = 'conflict'
      AND EXISTS (
        SELECT 1
        FROM content.note_source_claim_evidence mapping
        JOIN content.note_source_evidence_blocks block
          ON block.job_id = mapping.job_id AND block.id = mapping.evidence_block_id
        JOIN content.note_authoring_sources link
          ON link.job_id = block.job_id AND link.source_document_id = block.source_document_id
        WHERE mapping.job_id = claim.job_id
          AND mapping.claim_id = claim.id
          AND link.inclusion_state = 'included'
      )
  `;
  return Number(rows[0]?.count ?? 0);
}

async function loadQualityInput(jobId: string, sectionId: string): Promise<{ input: NotesSectionQualityInput; outputFingerprint: string }> {
  const sectionRows = await sqlClient`
    SELECT
      section.id::text AS id,
      section.markdown,
      section.state,
      section.output_fingerprint AS "outputFingerprint",
      section.coverage_item_id::text AS "coverageItemId",
      coverage.priority AS "coveragePriority",
      coverage.planned_depth AS "plannedDepth"
    FROM content.note_sections section
    JOIN content.note_coverage_plan_items coverage
      ON coverage.job_id = section.job_id AND coverage.id = section.coverage_item_id
    WHERE section.job_id = ${jobId}::uuid AND section.id = ${sectionId}::uuid
    LIMIT 1
  `;
  const section = sectionRows[0] as Record<string, unknown> | undefined;
  if (!section) throw new NotesStudioQualityError('SECTION_NOT_FOUND', 'Section not found.', 404);
  if (String(section.state) === 'accepted') {
    throw new NotesStudioQualityError('SECTION_ALREADY_ACCEPTED', 'Accepted sections are immutable at this QA checkpoint.', 409);
  }

  const claimRows = await sqlClient`
    SELECT
      claim.id::text AS "claimId",
      claim.claim_text AS "claimText",
      claim.state AS "claimState",
      EXISTS (
        SELECT 1
        FROM content.note_coverage_item_claims coverage_claim
        WHERE coverage_claim.job_id = claim.job_id
          AND coverage_claim.coverage_item_id = ${String(section.coverageItemId)}::uuid
          AND coverage_claim.claim_id = claim.id
      ) AS "coverageLinked",
      CASE WHEN source_link.source_document_id IS NOT NULL THEN block.source_document_id::text ELSE NULL END AS "sourceId",
      CASE WHEN source_link.source_document_id IS NOT NULL THEN block.excerpt ELSE NULL END AS excerpt,
      CASE WHEN source_link.source_document_id IS NOT NULL THEN block.excerpt_hash ELSE NULL END AS "excerptHash"
    FROM content.note_section_claims section_claim
    JOIN content.note_source_claims claim
      ON claim.job_id = section_claim.job_id AND claim.id = section_claim.claim_id
    LEFT JOIN content.note_source_claim_evidence mapping
      ON mapping.job_id = claim.job_id
      AND mapping.claim_id = claim.id
      AND mapping.relation = 'supports'
    LEFT JOIN content.note_source_evidence_blocks block
      ON block.job_id = mapping.job_id AND block.id = mapping.evidence_block_id
    LEFT JOIN content.note_authoring_sources source_link
      ON source_link.job_id = block.job_id
      AND source_link.source_document_id = block.source_document_id
      AND source_link.inclusion_state = 'included'
    WHERE section_claim.job_id = ${jobId}::uuid
      AND section_claim.section_id = ${sectionId}::uuid
    ORDER BY section_claim.position, block.block_index NULLS LAST
  `;

  const claimsById = new Map<string, QualityClaimInput>();
  for (const row of claimRows) {
    const claimId = String(row.claimId);
    const existing = claimsById.get(claimId) ?? {
      id: claimId,
      text: String(row.claimText ?? ''),
      state: String(row.claimState ?? ''),
      coverageLinked: Boolean(row.coverageLinked),
      activeSupportCount: 0,
      supportEvidence: [],
    };
    if (row.sourceId && row.excerpt && row.excerptHash) {
      const key = `${row.sourceId}:${row.excerptHash}`;
      if (!existing.supportEvidence.some((evidence) => `${evidence.sourceId}:${evidence.excerptHash}` === key)) {
        existing.supportEvidence.push({
          sourceId: String(row.sourceId),
          excerpt: String(row.excerpt),
          excerptHash: String(row.excerptHash),
        });
      }
    }
    existing.activeSupportCount = existing.supportEvidence.length;
    claimsById.set(claimId, existing);
  }

  const siblingRows = await sqlClient`
    SELECT id::text AS id, markdown
    FROM content.note_sections
    WHERE job_id = ${jobId}::uuid AND id <> ${sectionId}::uuid
    ORDER BY sort_order, created_at
  `;

  return {
    input: {
      sectionId,
      markdown: String(section.markdown ?? ''),
      coveragePriority: String(section.coveragePriority ?? ''),
      plannedDepth: String(section.plannedDepth ?? 'standard'),
      claims: [...claimsById.values()],
      activeConflictCount: await activeConflictCount(jobId),
      siblingSections: siblingRows.map((row) => ({ id: String(row.id), markdown: String(row.markdown ?? '') })),
    },
    outputFingerprint: String(section.outputFingerprint ?? ''),
  };
}

async function refreshQualityReadiness(jobId: string, actorUserId: string) {
  const conflicts = await activeConflictCount(jobId);
  const rows = await sqlClient`
    WITH progress AS (
      SELECT
        COUNT(*) FILTER (WHERE coverage.priority IN ('required', 'high'))::int AS core_count,
        COUNT(*) FILTER (
          WHERE coverage.priority IN ('required', 'high')
            AND EXISTS (
              SELECT 1 FROM content.note_sections section
              WHERE section.job_id = coverage.job_id
                AND section.coverage_item_id = coverage.id
                AND LENGTH(section.markdown) > 0
            )
        )::int AS core_drafted,
        COUNT(*) FILTER (
          WHERE coverage.priority IN ('required', 'high')
            AND EXISTS (
              SELECT 1 FROM content.note_sections section
              WHERE section.job_id = coverage.job_id
                AND section.coverage_item_id = coverage.id
                AND section.state = 'qa_passed'
            )
        )::int AS core_passed,
        (SELECT COUNT(*)::int FROM content.note_sections section WHERE section.job_id = ${jobId}::uuid) AS section_count,
        (SELECT COUNT(*)::int FROM content.note_sections section WHERE section.job_id = ${jobId}::uuid AND section.state = 'qa_passed') AS section_passed
      FROM content.note_coverage_plan_items coverage
      WHERE coverage.job_id = ${jobId}::uuid
    )
    UPDATE content.note_authoring_jobs job
    SET state = CASE
      WHEN ${conflicts}::int > 0 THEN 'evidence_ready'
      WHEN progress.core_count = 0 OR progress.core_drafted < progress.core_count THEN 'drafting'
      WHEN progress.core_passed = progress.core_count AND progress.section_passed = progress.section_count THEN 'review_ready'
      ELSE 'qa_required'
    END,
    updated_by = ${actorUserId}::uuid,
    updated_at = now()
    FROM progress
    WHERE job.id = ${jobId}::uuid
      AND job.state NOT IN ('approved', 'materialized')
    RETURNING job.state
  `;
  return rows[0]?.state ?? null;
}

async function audit(actorUserId: string, actionKey: string, jobId: string, summary: string, metadata: Record<string, unknown>) {
  await sqlClient`
    INSERT INTO platform.audit_events (
      id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
    ) VALUES (
      ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
      ${actionKey}, 'note_authoring_job', ${jobId}::uuid, ${summary}, ${JSON.stringify(metadata)}
    )
  `;
}

async function runSectionQuality(jobId: string, sectionId: string, actorUserId: string) {
  const job = await loadJob(jobId);
  if (['approved', 'materialized'].includes(String(job.state))) {
    throw new NotesStudioQualityError('QUALITY_STATE_LOCKED', 'Approved or materialized jobs cannot be re-opened by NS-005 QA.', 409);
  }
  const { input, outputFingerprint } = await loadQualityInput(jobId, sectionId);
  if (!/^[0-9a-f]{64}$/.test(outputFingerprint)) {
    throw new NotesStudioQualityError('SECTION_FINGERPRINT_INVALID', 'Section output fingerprint is missing or invalid.', 409);
  }
  const evaluation = evaluateNotesSectionQuality(input);
  const evidenceFingerprint = notesQualityEvidenceFingerprint(input);
  const runId = randomUUID();

  await sqlClient.begin(async (tx) => {
    await tx`
      INSERT INTO content.note_quality_runs (
        id, job_id, section_id, section_output_fingerprint, evidence_fingerprint,
        policy_version, status, warning_count, fail_count, created_by, created_at
      ) VALUES (
        ${runId}::uuid, ${jobId}::uuid, ${sectionId}::uuid, ${outputFingerprint}, ${evidenceFingerprint},
        ${evaluation.policyVersion}, ${evaluation.passed ? 'passed' : 'failed'},
        ${evaluation.warningCount}, ${evaluation.failCount}, ${actorUserId}::uuid, now()
      )
    `;
    for (const check of evaluation.checks) {
      await tx`
        INSERT INTO content.note_quality_checks (
          run_id, check_code, label, status, blocking, summary, metrics, created_at
        ) VALUES (
          ${runId}::uuid, ${check.code}, ${check.label}, ${check.status}, ${check.blocking},
          ${check.summary}, ${JSON.stringify(check.metrics)}, now()
        )
      `;
    }
    const updated = await tx`
      UPDATE content.note_sections
      SET state = ${evaluation.passed ? 'qa_passed' : 'needs_editorial'},
          updated_by = ${actorUserId}::uuid,
          updated_at = now()
      WHERE job_id = ${jobId}::uuid
        AND id = ${sectionId}::uuid
        AND output_fingerprint = ${outputFingerprint}
      RETURNING id::text AS id
    `;
    if (!updated[0]) {
      throw new NotesStudioQualityError('SECTION_CHANGED_DURING_QA', 'The section changed while QA was running. Refresh and run the gates again.', 409);
    }
  });

  const jobState = await refreshQualityReadiness(jobId, actorUserId);
  await audit(actorUserId, 'notes_studio.quality.run', jobId, evaluation.passed ? 'Notes Studio section passed deterministic quality gates' : 'Notes Studio section failed deterministic quality gates', {
    sectionId,
    runId,
    status: evaluation.passed ? 'passed' : 'failed',
    policyVersion: evaluation.policyVersion,
    sectionOutputFingerprint: outputFingerprint,
    evidenceFingerprint,
    warningCount: evaluation.warningCount,
    failCount: evaluation.failCount,
    learnerPublished: false,
  });
  return { runId, evaluation, jobState };
}

async function loadQualityWorkspace(jobId: string) {
  const job = await loadJob(jobId);
  const sections = await sqlClient`
    SELECT
      section.id::text AS id,
      section.coverage_item_id::text AS "coverageItemId",
      coverage.title AS "coverageTitle",
      coverage.priority,
      coverage.planned_depth AS "plannedDepth",
      section.title,
      section.state,
      section.output_fingerprint AS "outputFingerprint",
      section.updated_at AS "updatedAt",
      latest.id::text AS "latestRunId",
      latest.status AS "qualityStatus",
      latest.policy_version AS "policyVersion",
      latest.section_output_fingerprint AS "qualityOutputFingerprint",
      latest.evidence_fingerprint AS "evidenceFingerprint",
      latest.warning_count AS "warningCount",
      latest.fail_count AS "failCount",
      latest.created_at AS "qualityRanAt"
    FROM content.note_sections section
    JOIN content.note_coverage_plan_items coverage
      ON coverage.job_id = section.job_id AND coverage.id = section.coverage_item_id
    LEFT JOIN LATERAL (
      SELECT run.*
      FROM content.note_quality_runs run
      WHERE run.job_id = section.job_id AND run.section_id = section.id
      ORDER BY run.created_at DESC, run.id DESC
      LIMIT 1
    ) latest ON true
    WHERE section.job_id = ${jobId}::uuid
    ORDER BY section.sort_order, section.created_at
  `;
  const runIds = sections.map((section) => String(section.latestRunId ?? '')).filter(Boolean);
  const checkRows = runIds.length === 0 ? [] : await sqlClient`
    SELECT
      run_id::text AS "runId",
      check_code AS code,
      label,
      status,
      blocking,
      summary,
      metrics
    FROM content.note_quality_checks
    WHERE run_id = ANY(${runIds}::uuid[])
    ORDER BY run_id, check_code
  `;
  const checksByRun = new Map<string, Array<(typeof checkRows)[number]>>();
  for (const check of checkRows) {
    const key = String(check.runId);
    const bucket = checksByRun.get(key) ?? [];
    bucket.push(check);
    checksByRun.set(key, bucket);
  }

  const coverageRows = await sqlClient`
    SELECT
      COUNT(*) FILTER (WHERE priority IN ('required', 'high'))::int AS "coreCount",
      COUNT(*) FILTER (
        WHERE priority IN ('required', 'high')
          AND EXISTS (
            SELECT 1 FROM content.note_sections section
            WHERE section.job_id = coverage.job_id AND section.coverage_item_id = coverage.id
          )
      )::int AS "coreDrafted",
      COUNT(*) FILTER (
        WHERE priority IN ('required', 'high')
          AND EXISTS (
            SELECT 1 FROM content.note_sections section
            WHERE section.job_id = coverage.job_id AND section.coverage_item_id = coverage.id AND section.state = 'qa_passed'
          )
      )::int AS "corePassed"
    FROM content.note_coverage_plan_items coverage
    WHERE job_id = ${jobId}::uuid
  `;
  const conflicts = await activeConflictCount(jobId);
  const enriched = sections.map((section) => ({
    ...section,
    qualityCurrent: Boolean(section.latestRunId)
      && String(section.outputFingerprint) === String(section.qualityOutputFingerprint)
      && (String(section.qualityStatus) !== 'passed' || String(section.state) === 'qa_passed'),
    checks: checksByRun.get(String(section.latestRunId ?? '')) ?? [],
  }));
  const failedSections = enriched.filter((section) => section.qualityStatus === 'failed' && section.qualityCurrent).length;
  const warningCount = enriched.reduce((sum, section) => sum + (section.qualityCurrent ? Number(section.warningCount ?? 0) : 0), 0);
  return {
    job,
    sections: enriched,
    summary: {
      coreCount: Number(coverageRows[0]?.coreCount ?? 0),
      coreDrafted: Number(coverageRows[0]?.coreDrafted ?? 0),
      corePassed: Number(coverageRows[0]?.corePassed ?? 0),
      sectionCount: sections.length,
      qaPassedSections: sections.filter((section) => section.state === 'qa_passed').length,
      failedSections,
      warningCount,
      activeConflictCount: conflicts,
      reviewReady: String(job.state) === 'review_ready',
    },
  };
}

router.use(authenticate);

router.get('/jobs/:jobId/quality', requireAdminPermission('content.questions.read'), async (req, res) => {
  try {
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    res.json(await loadQualityWorkspace(jobId));
  } catch (error) {
    sendError(res, error, 'Unable to load Notes Studio quality workspace');
  }
});

router.post('/jobs/:jobId/sections/:sectionId/quality/run', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new NotesStudioQualityError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    const sectionId = uuid(req.params.sectionId, 'Section ID');
    await runSectionQuality(jobId, sectionId, actorUserId);
    res.json(await loadQualityWorkspace(jobId));
  } catch (error) {
    sendError(res, error, 'Unable to run Notes Studio quality gates');
  }
});

router.post('/jobs/:jobId/quality/run-all', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new NotesStudioQualityError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    const job = await loadJob(jobId);
    if (['approved', 'materialized'].includes(String(job.state))) {
      throw new NotesStudioQualityError('QUALITY_STATE_LOCKED', 'Approved or materialized jobs cannot be re-opened by NS-005 QA.', 409);
    }
    const sections = await sqlClient`
      SELECT id::text AS id
      FROM content.note_sections
      WHERE job_id = ${jobId}::uuid AND state <> 'accepted'
      ORDER BY sort_order, created_at
    `;
    if (sections.length === 0) throw new NotesStudioQualityError('NO_SECTIONS', 'Draft sections before running quality gates.', 409);
    for (const section of sections) await runSectionQuality(jobId, String(section.id), actorUserId);
    res.json(await loadQualityWorkspace(jobId));
  } catch (error) {
    sendError(res, error, 'Unable to run Notes Studio quality gates');
  }
});

export default router;
