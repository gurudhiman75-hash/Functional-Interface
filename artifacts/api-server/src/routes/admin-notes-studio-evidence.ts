import { randomUUID } from 'node:crypto';
import { Router, type IRouter, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';
import {
  coverageTargetsFromBrief,
  evidenceRunInputHash,
  extractEvidenceCandidates,
  shouldMapClaimToCoverage,
} from '../notes-studio/evidence-map';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const evidenceStates = new Set(['candidate', 'accepted', 'rejected']);
const EXTRACTOR_VERSION = 'notes-evidence-v1';
const MAX_CLAIMS_PER_SOURCE = 180;
const MAX_UNIQUE_CLAIMS_PER_RUN = 900;
const MAX_COVERAGE_TARGETS = 30;

type DbJob = {
  id: string;
  title: string;
  state: string;
  brief: Record<string, unknown>;
};

type DbSource = {
  id: string;
  title: string;
  contentHash: string;
  extractedText: string;
};

type MergedClaim = {
  normalizedKey: string;
  claimText: string;
  claimType: 'definition' | 'provision' | 'statistic' | 'date_fact' | 'fact';
  confidence: number;
  supports: Array<{
    sourceId: string;
    sourceTitle: string;
    excerpt: string;
    excerptHash: string;
    location: Record<string, unknown>;
  }>;
};

class EvidenceError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function id(value: unknown, label: string): string {
  const parsed = text(value, 80);
  if (!uuidPattern.test(parsed)) throw new EvidenceError('INVALID_ID', `${label} is invalid.`);
  return parsed;
}

function bool(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof EvidenceError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'NOTES_EVIDENCE_FAILED' });
}

async function loadJob(jobId: string): Promise<DbJob | null> {
  const rows = await sqlClient`
    SELECT id::text AS id, title, state, brief
    FROM content.note_authoring_jobs
    WHERE id = ${jobId}::uuid
    LIMIT 1
  `;
  if (!rows[0]) return null;
  return {
    id: String(rows[0].id),
    title: String(rows[0].title),
    state: String(rows[0].state),
    brief: asRecord(rows[0].brief),
  };
}

async function latestCompletedRun(jobId: string) {
  const rows = await sqlClient`
    SELECT
      id::text AS id,
      job_id::text AS "jobId",
      input_hash AS "inputHash",
      extractor_version AS "extractorVersion",
      status,
      source_count AS "sourceCount",
      claim_count AS "claimCount",
      support_count AS "supportCount",
      coverage_target_count AS "coverageTargetCount",
      coverage_mapped_count AS "coverageMappedCount",
      started_at AS "startedAt",
      finished_at AS "finishedAt"
    FROM content.note_evidence_runs
    WHERE job_id = ${jobId}::uuid AND status = 'completed'
    ORDER BY finished_at DESC NULLS LAST, started_at DESC
    LIMIT 1
  `;
  return rows[0] ?? null;
}

async function refreshEvidenceReadiness(jobId: string, actorUserId: string) {
  const run = await latestCompletedRun(jobId);
  if (!run) return;
  const rows = await sqlClient`
    SELECT
      COUNT(*) FILTER (WHERE target.required)::int AS "requiredCount",
      COUNT(*) FILTER (
        WHERE target.required
          AND EXISTS (
            SELECT 1
            FROM content.note_claim_coverage mapping
            JOIN content.note_evidence_claims claim ON claim.id = mapping.claim_id
            WHERE mapping.run_id = ${String(run.id)}::uuid
              AND mapping.target_id = target.id
              AND claim.evidence_state = 'accepted'
          )
      )::int AS "coveredRequiredCount",
      COUNT(*) FILTER (
        WHERE EXISTS (
          SELECT 1
          FROM content.note_claim_coverage mapping
          JOIN content.note_evidence_claims claim ON claim.id = mapping.claim_id
          WHERE mapping.run_id = ${String(run.id)}::uuid
            AND mapping.target_id = target.id
            AND claim.evidence_state = 'accepted'
        )
      )::int AS "coveredTargetCount",
      COUNT(*)::int AS "targetCount"
    FROM content.note_coverage_targets target
    WHERE target.job_id = ${jobId}::uuid
  `;
  const required = Number(rows[0]?.requiredCount ?? 0);
  const coveredRequired = Number(rows[0]?.coveredRequiredCount ?? 0);
  const acceptedRows = await sqlClient`
    SELECT COUNT(*)::int AS count
    FROM content.note_evidence_claims
    WHERE run_id = ${String(run.id)}::uuid AND evidence_state = 'accepted'
  `;
  const accepted = Number(acceptedRows[0]?.count ?? 0);
  const ready = accepted > 0 && required > 0 && coveredRequired === required;
  await sqlClient`
    UPDATE content.note_authoring_jobs
    SET state = ${ready ? 'evidence_ready' : 'sources_ready'},
        updated_by = ${actorUserId}::uuid,
        updated_at = now()
    WHERE id = ${jobId}::uuid
      AND state IN ('brief', 'sources_ready', 'evidence_ready')
  `;
}

async function evidencePayload(jobId: string) {
  const [job, run] = await Promise.all([loadJob(jobId), latestCompletedRun(jobId)]);
  if (!job) throw new EvidenceError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);

  const targets = await sqlClient`
    SELECT
      target.id::text AS id,
      target.target_key AS "targetKey",
      target.label,
      target.source_kind AS "sourceKind",
      target.required,
      target.position,
      COUNT(mapping.claim_id)::int AS "mappedClaimCount",
      COUNT(mapping.claim_id) FILTER (WHERE claim.evidence_state = 'accepted')::int AS "acceptedClaimCount",
      COALESCE(MAX(mapping.score), 0)::float8 AS "bestScore"
    FROM content.note_coverage_targets target
    LEFT JOIN content.note_claim_coverage mapping
      ON mapping.target_id = target.id
      AND (${run ? String(run.id) : null}::uuid IS NOT NULL AND mapping.run_id = ${run ? String(run.id) : null}::uuid)
    LEFT JOIN content.note_evidence_claims claim ON claim.id = mapping.claim_id
    WHERE target.job_id = ${jobId}::uuid
    GROUP BY target.id
    ORDER BY target.position, target.created_at
  `;

  let claims: unknown[] = [];
  let supports: unknown[] = [];
  if (run) {
    claims = await sqlClient`
      SELECT
        claim.id::text AS id,
        claim.normalized_key AS "normalizedKey",
        claim.claim_text AS "claimText",
        claim.claim_type AS "claimType",
        claim.evidence_state AS "evidenceState",
        claim.extraction_method AS "extractionMethod",
        claim.confidence::float8 AS confidence,
        claim.reviewed_at AS "reviewedAt",
        COUNT(DISTINCT support.source_document_id)::int AS "sourceCount",
        COALESCE(
          array_agg(DISTINCT target.label ORDER BY target.label)
            FILTER (WHERE target.id IS NOT NULL),
          '{}'
        ) AS "coverageLabels"
      FROM content.note_evidence_claims claim
      LEFT JOIN content.note_evidence_support support ON support.claim_id = claim.id AND support.relation = 'support'
      LEFT JOIN content.note_claim_coverage mapping ON mapping.claim_id = claim.id AND mapping.run_id = claim.run_id
      LEFT JOIN content.note_coverage_targets target ON target.id = mapping.target_id
      WHERE claim.run_id = ${String(run.id)}::uuid
      GROUP BY claim.id
      ORDER BY
        CASE claim.evidence_state WHEN 'accepted' THEN 0 WHEN 'candidate' THEN 1 ELSE 2 END,
        COUNT(DISTINCT support.source_document_id) DESC,
        claim.confidence DESC,
        claim.created_at
      LIMIT 1200
    `;
    supports = await sqlClient`
      SELECT
        support.id::text AS id,
        support.claim_id::text AS "claimId",
        support.source_document_id::text AS "sourceId",
        document.title AS "sourceTitle",
        support.relation,
        support.evidence_excerpt AS excerpt,
        support.source_location AS location
      FROM content.note_evidence_support support
      JOIN content.source_documents document ON document.id = support.source_document_id
      JOIN content.note_evidence_claims claim ON claim.id = support.claim_id
      WHERE claim.run_id = ${String(run.id)}::uuid
      ORDER BY claim.created_at, document.title, support.created_at
      LIMIT 3000
    `;
  }

  const targetRows = targets as Array<Record<string, unknown>>;
  const requiredCount = targetRows.filter((target) => Boolean(target.required)).length;
  const coveredRequiredCount = targetRows.filter((target) => Boolean(target.required) && Number(target.acceptedClaimCount ?? 0) > 0).length;
  const claimRows = claims as Array<Record<string, unknown>>;
  const acceptedCount = claimRows.filter((claim) => claim.evidenceState === 'accepted').length;
  const candidateCount = claimRows.filter((claim) => claim.evidenceState === 'candidate').length;
  const rejectedCount = claimRows.filter((claim) => claim.evidenceState === 'rejected').length;

  return {
    job,
    latestRun: run,
    summary: {
      claimCount: claimRows.length,
      acceptedCount,
      candidateCount,
      rejectedCount,
      targetCount: targetRows.length,
      requiredCount,
      coveredRequiredCount,
      evidenceReady: acceptedCount > 0 && requiredCount > 0 && coveredRequiredCount === requiredCount,
    },
    coverageTargets: targets,
    claims,
    supports,
  };
}

router.use(authenticate);

router.get('/jobs/:id/evidence', requireAdminPermission('content.questions.read'), async (req, res) => {
  try {
    const jobId = id(req.params.id, 'Authoring job ID');
    res.json(await evidencePayload(jobId));
  } catch (error) {
    sendError(res, error, 'Unable to load Notes Studio evidence map');
  }
});

router.post('/jobs/:id/evidence/extract', requireAdminPermission('content.questions.update'), async (req, res) => {
  const runId = randomUUID();
  let insertedRun = false;
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new EvidenceError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = id(req.params.id, 'Authoring job ID');
    const job = await loadJob(jobId);
    if (!job) throw new EvidenceError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);

    const sourceRows = await sqlClient`
      SELECT
        document.id::text AS id,
        document.title,
        document.content_hash AS "contentHash",
        document.extracted_text AS "extractedText"
      FROM content.note_authoring_sources link
      JOIN content.source_documents document ON document.id = link.source_document_id
      WHERE link.job_id = ${jobId}::uuid
        AND link.inclusion_state = 'included'
        AND document.retention_mode = 'extracted_text'
        AND document.extraction_status = 'processed'
        AND LENGTH(COALESCE(document.extracted_text, '')) >= 100
      ORDER BY link.position, link.added_at
    `;
    const sources: DbSource[] = sourceRows.map((row) => ({
      id: String(row.id),
      title: String(row.title),
      contentHash: String(row.contentHash),
      extractedText: String(row.extractedText ?? ''),
    }));
    if (sources.length === 0) {
      throw new EvidenceError('NO_GENERATABLE_SOURCES', 'Include at least one processed rights-retainable source before extracting evidence.', 409);
    }

    const inputHash = evidenceRunInputHash({
      jobId,
      brief: job.brief,
      extractorVersion: EXTRACTOR_VERSION,
      sources: sources.map((source) => ({ id: source.id, contentHash: source.contentHash })),
    });
    const existingRows = await sqlClient`
      SELECT id::text AS id
      FROM content.note_evidence_runs
      WHERE job_id = ${jobId}::uuid AND input_hash = ${inputHash} AND status = 'completed'
      LIMIT 1
    `;
    if (existingRows[0]) {
      res.json({ ...(await evidencePayload(jobId)), idempotent: true });
      return;
    }

    const merged = new Map<string, MergedClaim>();
    for (const source of sources) {
      const candidates = extractEvidenceCandidates(source.extractedText, MAX_CLAIMS_PER_SOURCE);
      for (const candidate of candidates) {
        const current = merged.get(candidate.normalizedKey);
        const support = {
          sourceId: source.id,
          sourceTitle: source.title,
          excerpt: candidate.excerpt,
          excerptHash: candidate.excerptHash,
          location: candidate.location as unknown as Record<string, unknown>,
        };
        if (current) {
          if (!current.supports.some((item) => item.sourceId === source.id && item.excerptHash === support.excerptHash)) {
            current.supports.push(support);
          }
          current.confidence = Math.max(current.confidence, candidate.confidence);
        } else if (merged.size < MAX_UNIQUE_CLAIMS_PER_RUN) {
          merged.set(candidate.normalizedKey, {
            normalizedKey: candidate.normalizedKey,
            claimText: candidate.claimText,
            claimType: candidate.claimType,
            confidence: candidate.confidence,
            supports: [support],
          });
        }
      }
    }
    if (merged.size === 0) throw new EvidenceError('NO_EVIDENCE_CANDIDATES', 'The included source text did not yield usable evidence candidates.', 409);

    const topicLabel = text(job.brief.topicLabel, 240) || job.title;
    const syllabusEmphasis = text(job.brief.syllabusEmphasis, 3000);
    const targetSeeds = coverageTargetsFromBrief({ topicLabel, syllabusEmphasis }).slice(0, MAX_COVERAGE_TARGETS);
    const claims = [...merged.values()];

    await sqlClient.begin(async (tx) => {
      for (const seed of targetSeeds) {
        await tx`
          INSERT INTO content.note_coverage_targets (
            id, job_id, target_key, label, source_kind, required, position, created_by, created_at, updated_at
          ) VALUES (
            ${randomUUID()}::uuid, ${jobId}::uuid, ${seed.targetKey}, ${seed.label}, ${seed.sourceKind},
            ${seed.required}, ${seed.position}, ${actorUserId}::uuid, now(), now()
          ) ON CONFLICT (job_id, target_key) DO NOTHING
        `;
      }
      const targetRows = await tx`
        SELECT id::text AS id, label
        FROM content.note_coverage_targets
        WHERE job_id = ${jobId}::uuid
        ORDER BY position, created_at
      `;

      await tx`
        INSERT INTO content.note_evidence_runs (
          id, job_id, input_hash, extractor_version, status, source_count,
          claim_count, support_count, coverage_target_count, coverage_mapped_count,
          created_by, started_at
        ) VALUES (
          ${runId}::uuid, ${jobId}::uuid, ${inputHash}, ${EXTRACTOR_VERSION}, 'running', ${sources.length},
          0, 0, ${targetRows.length}, 0, ${actorUserId}::uuid, now()
        )
      `;
      insertedRun = true;

      const insertedClaims: Array<{ id: string; claim: MergedClaim; state: string }> = [];
      let supportCount = 0;
      for (const claim of claims) {
        const distinctSourceCount = new Set(claim.supports.map((support) => support.sourceId)).size;
        const state = distinctSourceCount >= 2 ? 'accepted' : 'candidate';
        const claimId = randomUUID();
        await tx`
          INSERT INTO content.note_evidence_claims (
            id, run_id, job_id, normalized_key, claim_text, claim_type, evidence_state,
            extraction_method, confidence, created_by, created_at, updated_at
          ) VALUES (
            ${claimId}::uuid, ${runId}::uuid, ${jobId}::uuid, ${claim.normalizedKey}, ${claim.claimText},
            ${claim.claimType}, ${state}, ${EXTRACTOR_VERSION}, ${claim.confidence}, ${actorUserId}::uuid, now(), now()
          )
        `;
        insertedClaims.push({ id: claimId, claim, state });
        for (const support of claim.supports) {
          await tx`
            INSERT INTO content.note_evidence_support (
              id, claim_id, source_document_id, relation, evidence_excerpt, excerpt_hash, source_location, created_at
            ) VALUES (
              ${randomUUID()}::uuid, ${claimId}::uuid, ${support.sourceId}::uuid, 'support',
              ${support.excerpt}, ${support.excerptHash}, ${JSON.stringify(support.location)}, now()
            ) ON CONFLICT (claim_id, source_document_id, excerpt_hash) DO NOTHING
          `;
          supportCount += 1;
        }
      }

      let mappedCount = 0;
      for (const target of targetRows) {
        for (const inserted of insertedClaims) {
          const mapping = shouldMapClaimToCoverage(inserted.claim.claimText, String(target.label));
          if (!mapping.map) continue;
          await tx`
            INSERT INTO content.note_claim_coverage (
              run_id, target_id, claim_id, score, mapping_method, created_at
            ) VALUES (
              ${runId}::uuid, ${String(target.id)}::uuid, ${inserted.id}::uuid,
              ${mapping.score}, 'token_overlap_v1', now()
            ) ON CONFLICT (run_id, target_id, claim_id) DO NOTHING
          `;
          mappedCount += 1;
        }
      }

      await tx`
        UPDATE content.note_evidence_runs
        SET status = 'completed', claim_count = ${insertedClaims.length}, support_count = ${supportCount},
            coverage_target_count = ${targetRows.length}, coverage_mapped_count = ${mappedCount},
            finished_at = now()
        WHERE id = ${runId}::uuid
      `;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
          'notes_studio.evidence.extracted', 'note_authoring_job', ${jobId}::uuid,
          ${`Extracted ${insertedClaims.length} Notes Studio evidence claims from ${sources.length} sources`},
          ${JSON.stringify({ runId, inputHash, extractorVersion: EXTRACTOR_VERSION, supportCount, mappedCount })}
        )
      `;
    });

    await refreshEvidenceReadiness(jobId, actorUserId);
    res.status(201).json({ ...(await evidencePayload(jobId)), idempotent: false });
  } catch (error) {
    if (insertedRun) {
      try {
        await sqlClient`
          UPDATE content.note_evidence_runs
          SET status = 'failed', failure_reason = ${error instanceof Error ? error.message.slice(0, 1000) : 'Evidence extraction failed'}, finished_at = now()
          WHERE id = ${runId}::uuid AND status = 'running'
        `;
      } catch (recordError) {
        console.error('Unable to record Notes Studio evidence failure', recordError);
      }
    }
    sendError(res, error, 'Unable to extract Notes Studio evidence');
  }
});

router.patch('/jobs/:jobId/evidence/claims/:claimId', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new EvidenceError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = id(req.params.jobId, 'Authoring job ID');
    const claimId = id(req.params.claimId, 'Evidence claim ID');
    const state = text(req.body?.evidenceState, 20).toLowerCase();
    if (!evidenceStates.has(state)) throw new EvidenceError('INVALID_EVIDENCE_STATE', 'Choose candidate, accepted or rejected.');
    const run = await latestCompletedRun(jobId);
    if (!run) throw new EvidenceError('EVIDENCE_RUN_REQUIRED', 'Extract evidence before reviewing claims.', 409);
    const rows = await sqlClient`
      UPDATE content.note_evidence_claims
      SET evidence_state = ${state}, reviewed_by = ${actorUserId}::uuid, reviewed_at = now(), updated_at = now()
      WHERE id = ${claimId}::uuid AND job_id = ${jobId}::uuid AND run_id = ${String(run.id)}::uuid
      RETURNING id::text AS id
    `;
    if (!rows[0]) throw new EvidenceError('CLAIM_NOT_FOUND', 'Evidence claim was not found in the current evidence run.', 404);
    await sqlClient`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
        'notes_studio.evidence.reviewed', 'note_evidence_claim', ${claimId}::uuid,
        ${`Changed Notes Studio evidence claim to ${state}`}, ${JSON.stringify({ jobId, runId: String(run.id), evidenceState: state })}
      )
    `;
    await refreshEvidenceReadiness(jobId, actorUserId);
    res.json(await evidencePayload(jobId));
  } catch (error) {
    sendError(res, error, 'Unable to review Notes Studio evidence claim');
  }
});

router.post('/jobs/:jobId/coverage-targets', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new EvidenceError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = id(req.params.jobId, 'Authoring job ID');
    if (!await loadJob(jobId)) throw new EvidenceError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
    const label = text(req.body?.label, 240);
    if (label.length < 3) throw new EvidenceError('COVERAGE_LABEL_REQUIRED', 'Enter a meaningful coverage target.');
    const required = bool(req.body?.required, true);
    const targetKey = (await import('../notes-studio/evidence-map')).evidenceClaimKey(label);
    const countRows = await sqlClient`SELECT COUNT(*)::int AS count FROM content.note_coverage_targets WHERE job_id = ${jobId}::uuid`;
    if (Number(countRows[0]?.count ?? 0) >= MAX_COVERAGE_TARGETS) throw new EvidenceError('COVERAGE_TARGET_LIMIT', `Choose up to ${MAX_COVERAGE_TARGETS} coverage targets.`);
    const targetId = randomUUID();
    const rows = await sqlClient`
      INSERT INTO content.note_coverage_targets (
        id, job_id, target_key, label, source_kind, required, position, created_by, created_at, updated_at
      ) VALUES (
        ${targetId}::uuid, ${jobId}::uuid, ${targetKey}, ${label}, 'manual', ${required},
        COALESCE((SELECT MAX(position) + 1 FROM content.note_coverage_targets WHERE job_id = ${jobId}::uuid), 0),
        ${actorUserId}::uuid, now(), now()
      ) ON CONFLICT (job_id, target_key) DO NOTHING
      RETURNING id::text AS id
    `;
    const actualTargetId = String(rows[0]?.id ?? '');
    if (!actualTargetId) throw new EvidenceError('COVERAGE_TARGET_EXISTS', 'That coverage target already exists.', 409);

    const run = await latestCompletedRun(jobId);
    if (run) {
      const claims = await sqlClient`
        SELECT id::text AS id, claim_text AS "claimText"
        FROM content.note_evidence_claims
        WHERE run_id = ${String(run.id)}::uuid AND evidence_state <> 'rejected'
      `;
      for (const claim of claims) {
        const mapping = shouldMapClaimToCoverage(String(claim.claimText), label);
        if (!mapping.map) continue;
        await sqlClient`
          INSERT INTO content.note_claim_coverage (run_id, target_id, claim_id, score, mapping_method, created_at)
          VALUES (${String(run.id)}::uuid, ${actualTargetId}::uuid, ${String(claim.id)}::uuid, ${mapping.score}, 'token_overlap_v1', now())
          ON CONFLICT (run_id, target_id, claim_id) DO NOTHING
        `;
      }
    }
    await refreshEvidenceReadiness(jobId, actorUserId);
    res.status(201).json(await evidencePayload(jobId));
  } catch (error) {
    sendError(res, error, 'Unable to add Notes Studio coverage target');
  }
});

router.patch('/jobs/:jobId/coverage-targets/:targetId', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new EvidenceError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = id(req.params.jobId, 'Authoring job ID');
    const targetId = id(req.params.targetId, 'Coverage target ID');
    if (typeof req.body?.required !== 'boolean') throw new EvidenceError('COVERAGE_REQUIRED_FLAG', 'Coverage target required state must be true or false.');
    const rows = await sqlClient`
      UPDATE content.note_coverage_targets
      SET required = ${req.body.required}, updated_at = now()
      WHERE id = ${targetId}::uuid AND job_id = ${jobId}::uuid
      RETURNING id::text AS id
    `;
    if (!rows[0]) throw new EvidenceError('COVERAGE_TARGET_NOT_FOUND', 'Coverage target not found.', 404);
    await sqlClient`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
        'notes_studio.coverage.required.changed', 'note_authoring_job', ${jobId}::uuid,
        ${`Changed Notes Studio coverage target requirement to ${req.body.required}`},
        ${JSON.stringify({ targetId, required: req.body.required })}
      )
    `;
    await refreshEvidenceReadiness(jobId, actorUserId);
    res.json(await evidencePayload(jobId));
  } catch (error) {
    sendError(res, error, 'Unable to update Notes Studio coverage target');
  }
});

router.post('/jobs/:jobId/coverage-targets/:targetId/claims/:claimId', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new EvidenceError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = id(req.params.jobId, 'Authoring job ID');
    const targetId = id(req.params.targetId, 'Coverage target ID');
    const claimId = id(req.params.claimId, 'Evidence claim ID');
    const run = await latestCompletedRun(jobId);
    if (!run) throw new EvidenceError('EVIDENCE_RUN_REQUIRED', 'Extract evidence before mapping claims.', 409);
    const checks = await Promise.all([
      sqlClient`SELECT id FROM content.note_coverage_targets WHERE id = ${targetId}::uuid AND job_id = ${jobId}::uuid LIMIT 1`,
      sqlClient`SELECT id FROM content.note_evidence_claims WHERE id = ${claimId}::uuid AND job_id = ${jobId}::uuid AND run_id = ${String(run.id)}::uuid LIMIT 1`,
    ]);
    if (!checks[0][0] || !checks[1][0]) throw new EvidenceError('COVERAGE_MAPPING_INVALID', 'Target or evidence claim is not part of the current authoring job.', 404);
    await sqlClient`
      INSERT INTO content.note_claim_coverage (run_id, target_id, claim_id, score, mapping_method, created_at)
      VALUES (${String(run.id)}::uuid, ${targetId}::uuid, ${claimId}::uuid, 1, 'manual', now())
      ON CONFLICT (run_id, target_id, claim_id)
      DO UPDATE SET score = 1, mapping_method = 'manual'
    `;
    await sqlClient`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
        'notes_studio.coverage.claim.mapped', 'note_authoring_job', ${jobId}::uuid,
        'Manually mapped Notes Studio evidence claim to coverage target',
        ${JSON.stringify({ targetId, claimId, runId: String(run.id) })}
      )
    `;
    await refreshEvidenceReadiness(jobId, actorUserId);
    res.json(await evidencePayload(jobId));
  } catch (error) {
    sendError(res, error, 'Unable to map Notes Studio evidence to coverage');
  }
});

export default router;
