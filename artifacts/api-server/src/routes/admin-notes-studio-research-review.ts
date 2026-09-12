import { randomUUID } from 'node:crypto';
import { Router, type IRouter, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';
import {
  MAX_CLAIM_EXTRACTION_BLOCKS,
  NOTES_CLAIM_EXTRACTION_PROMPT_VERSION,
  candidateClaimExtractionStateEligible,
  candidateClaimInputFingerprint,
  candidateClaimOutputFingerprint,
  candidateEvidenceBlockEligible,
  type ClaimExtractionEvidenceKind,
  type ClaimExtractionInput,
} from '../notes-studio/candidate-claim-extraction';
import {
  CandidateClaimModelConfigurationError,
  generateCandidateClaims,
} from '../notes-studio/candidate-claim-extraction-provider';
import { noteClaimFingerprint } from '../notes-studio/evidence-map';
import { refreshNotesAuthoringReadiness } from '../notes-studio/readiness';
import {
  evaluateSourcePackPolicy,
  noteSourceIdentity,
  noteSourcePackTemplateKey,
  noteSourceRole,
} from '../notes-studio/source-pack-policy';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const guidedDecisionStates = new Set(['accepted', 'rejected', 'conflict']);
const MAX_GUIDED_CLAIM_DECISIONS = 160;

class ResearchReviewError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new ResearchReviewError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function evidenceKind(value: unknown): ClaimExtractionEvidenceKind {
  return String(value ?? '') === 'editor_reference_note' ? 'editor_reference_note' : 'retained_excerpt';
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof ResearchReviewError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  if (error instanceof CandidateClaimModelConfigurationError) {
    res.status(503).json({ error: error.message, code: 'NOTES_STUDIO_EVIDENCE_MODEL_NOT_CONFIGURED' });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'NOTES_STUDIO_RESEARCH_REVIEW_FAILED' });
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

async function loadJobAndPolicy(jobId: string) {
  const jobRows = await sqlClient`
    SELECT id::text AS id, title, source_language AS "sourceLanguage", state, brief
    FROM content.note_authoring_jobs
    WHERE id = ${jobId}::uuid
    LIMIT 1
  `;
  const job = jobRows[0];
  if (!job) throw new ResearchReviewError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
  if (!candidateClaimExtractionStateEligible(job.state)) {
    throw new ResearchReviewError(
      'RESEARCH_REVIEW_NOT_READY',
      'Guided research preparation is available only while source/evidence review is active.',
      409,
    );
  }

  const sources = await sqlClient`
    SELECT
      document.publisher,
      document.source_uri AS "sourceUri",
      document.content_hash AS "contentHash",
      document.retention_mode AS "retentionMode",
      document.extraction_status AS "extractionStatus",
      LENGTH(COALESCE(document.extracted_text, ''))::int AS "retainedCharCount",
      link.inclusion_state AS "inclusionState",
      link.source_role AS "sourceRole",
      EXISTS (
        SELECT 1
        FROM content.note_source_evidence_blocks block
        WHERE block.job_id = link.job_id
          AND block.source_document_id = link.source_document_id
          AND block.evidence_kind = 'editor_reference_note'
          AND block.reviewed_at IS NOT NULL
      ) AS "referenceEvidenceReady"
    FROM content.note_authoring_sources link
    JOIN content.source_documents document ON document.id = link.source_document_id
    WHERE link.job_id = ${jobId}::uuid
  `;
  const brief = job.brief && typeof job.brief === 'object' && !Array.isArray(job.brief)
    ? job.brief as Record<string, unknown>
    : {};
  const templateKey = noteSourcePackTemplateKey(brief.sourcePackTemplate);
  const policy = evaluateSourcePackPolicy(templateKey, sources.map((source) => ({
    sourceRole: noteSourceRole(source.sourceRole),
    inclusionState: String(source.inclusionState),
    generationReady: source.retentionMode === 'extracted_text'
      && source.extractionStatus === 'processed'
      && Number(source.retainedCharCount ?? 0) >= 100,
    referenceEvidenceReady: Boolean(source.referenceEvidenceReady),
    contentHash: String(source.contentHash ?? ''),
    sourceIdentity: noteSourceIdentity(source.publisher, source.sourceUri),
  })));
  if (!policy.ready) {
    throw new ResearchReviewError(
      'SOURCE_PACK_POLICY_INCOMPLETE',
      'The source pack is not evidence-ready yet. Add the missing reviewed evidence before preparing claims.',
      409,
    );
  }
  return { job, policy };
}

async function loadEligibleEvidence(jobId: string) {
  const rows = await sqlClient`
    SELECT
      block.id::text AS id,
      block.source_document_id::text AS "sourceDocumentId",
      block.excerpt,
      block.evidence_kind AS "evidenceKind",
      block.reviewed_at AS "reviewedAt",
      document.title AS "sourceTitle",
      document.retention_mode AS "retentionMode",
      document.extraction_status AS "extractionStatus",
      link.position,
      block.block_index AS "blockIndex"
    FROM content.note_source_evidence_blocks block
    JOIN content.note_authoring_sources link
      ON link.job_id = block.job_id AND link.source_document_id = block.source_document_id
    JOIN content.source_documents document ON document.id = block.source_document_id
    WHERE block.job_id = ${jobId}::uuid
      AND link.inclusion_state = 'included'
    ORDER BY link.position, block.source_document_id, block.block_index
    LIMIT ${MAX_CLAIM_EXTRACTION_BLOCKS + 1}
  `;
  const eligible = rows.filter((row) => candidateEvidenceBlockEligible({
    evidenceKind: row.evidenceKind,
    reviewedAt: row.reviewedAt,
    retentionMode: row.retentionMode,
    extractionStatus: row.extractionStatus,
  }));
  if (eligible.length === 0) {
    throw new ResearchReviewError('NO_REVIEWED_EVIDENCE', 'Record reviewed reference evidence or build retained evidence before preparing candidate claims.', 409);
  }
  if (eligible.length > MAX_CLAIM_EXTRACTION_BLOCKS) {
    throw new ResearchReviewError(
      'TOO_MUCH_EVIDENCE_FOR_GUIDED_REVIEW',
      `This note has more than ${MAX_CLAIM_EXTRACTION_BLOCKS} active evidence blocks. Use Advanced for a bounded extraction batch.`,
      409,
    );
  }
  return eligible;
}

async function claimSummary(jobId: string) {
  const rows = await sqlClient`
    SELECT state, COUNT(*)::int AS count
    FROM content.note_source_claims
    WHERE job_id = ${jobId}::uuid
    GROUP BY state
  `;
  const counts = { candidate: 0, accepted: 0, rejected: 0, conflict: 0 };
  for (const row of rows) {
    const state = String(row.state) as keyof typeof counts;
    if (Object.prototype.hasOwnProperty.call(counts, state)) counts[state] = Number(row.count ?? 0);
  }
  return counts;
}

router.use(authenticate);

router.post('/jobs/:jobId/research-review/prepare-claims', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new ResearchReviewError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    const { job, policy } = await loadJobAndPolicy(jobId);
    const evidenceRows = await loadEligibleEvidence(jobId);
    const input: ClaimExtractionInput = {
      jobId,
      noteTitle: String(job.title),
      languageCode: String(job.sourceLanguage || 'en'),
      blocks: evidenceRows.map((row) => ({
        id: String(row.id),
        sourceDocumentId: String(row.sourceDocumentId),
        sourceTitle: String(row.sourceTitle),
        evidenceKind: evidenceKind(row.evidenceKind),
        excerpt: String(row.excerpt),
      })),
    };
    const inputFingerprint = candidateClaimInputFingerprint(input);
    const generated = await generateCandidateClaims(input);
    const outputFingerprint = candidateClaimOutputFingerprint(generated.extraction);
    const stagedFromSourcesReady = String(job.state) === 'sources_ready';

    let created = 0;
    let duplicatesSkipped = 0;
    await sqlClient.begin(async (tx) => {
      for (const candidate of generated.extraction.claims) {
        const claimId = randomUUID();
        const claimHash = noteClaimFingerprint(candidate.claimText);
        const inserted = await tx`
          INSERT INTO content.note_source_claims (
            id, job_id, claim_text, claim_hash, state, confidence, contradiction_key,
            editorial_note, created_by, updated_by, created_at, updated_at
          ) VALUES (
            ${claimId}::uuid, ${jobId}::uuid, ${candidate.claimText}, ${claimHash}, 'candidate',
            ${candidate.confidence}, ${candidate.contradictionKey},
            'Guided Research Review model-extracted candidate; editorial acceptance required.',
            ${actorUserId}::uuid, ${actorUserId}::uuid, now(), now()
          )
          ON CONFLICT (job_id, claim_hash) DO NOTHING
          RETURNING id::text AS id
        `;
        if (!inserted[0]) {
          duplicatesSkipped += 1;
          continue;
        }
        created += 1;
        for (const blockId of candidate.evidenceBlockIds) {
          await tx`
            INSERT INTO content.note_source_claim_evidence (
              job_id, claim_id, evidence_block_id, relation, created_by, created_at
            ) VALUES (
              ${jobId}::uuid, ${claimId}::uuid, ${blockId}::uuid, 'supports', ${actorUserId}::uuid, now()
            )
            ON CONFLICT (claim_id, evidence_block_id) DO NOTHING
          `;
        }
      }
      if (stagedFromSourcesReady) {
        await tx`
          UPDATE content.note_authoring_jobs
          SET state = 'evidence_ready', updated_by = ${actorUserId}::uuid, updated_at = now()
          WHERE id = ${jobId}::uuid AND state = 'sources_ready'
        `;
      }
    });

    await refreshNotesAuthoringReadiness(jobId, actorUserId);
    await audit(actorUserId, 'notes_studio.research_review.claims_prepared', jobId, 'Prepared candidate claims for the guided Research Review', {
      provider: generated.provider,
      model: generated.model,
      responseId: generated.responseId,
      usage: generated.usage,
      promptVersion: NOTES_CLAIM_EXTRACTION_PROMPT_VERSION,
      inputFingerprint,
      outputFingerprint,
      sourcePackTemplate: policy.templateKey,
      evidenceBlockCount: input.blocks.length,
      generatedClaimCount: generated.extraction.claims.length,
      createdClaimCount: created,
      duplicateClaimCount: duplicatesSkipped,
      automaticAcceptance: false,
      automaticCoverageDecision: false,
      learnerPublished: false,
    });

    res.status(201).json({
      generated: generated.extraction.claims.length,
      created,
      duplicatesSkipped,
      claimSummary: await claimSummary(jobId),
      jobState: stagedFromSourcesReady ? 'evidence_ready' : String(job.state),
      automaticAcceptance: false,
      automaticCoverageDecision: false,
    });
  } catch (error) {
    sendError(res, error, 'Unable to prepare guided Notes Studio research claims');
  }
});

router.patch('/jobs/:jobId/research-review/claims', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new ResearchReviewError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    const jobRows = await sqlClient`
      SELECT id::text AS id, state FROM content.note_authoring_jobs WHERE id = ${jobId}::uuid LIMIT 1
    `;
    if (!jobRows[0]) throw new ResearchReviewError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
    if (!['evidence_ready', 'outline_ready'].includes(String(jobRows[0].state))) {
      throw new ResearchReviewError('CLAIM_REVIEW_FROZEN', 'Claim review is available only before section drafting starts.', 409);
    }

    const rawDecisions = Array.isArray(req.body?.decisions) ? req.body.decisions : [];
    if (rawDecisions.length < 1 || rawDecisions.length > MAX_GUIDED_CLAIM_DECISIONS) {
      throw new ResearchReviewError('INVALID_CLAIM_DECISIONS', `Choose 1-${MAX_GUIDED_CLAIM_DECISIONS} claim decisions.`);
    }
    const seen = new Set<string>();
    const decisions = rawDecisions.map((raw: unknown) => {
      const record = raw && typeof raw === 'object' ? raw as Record<string, unknown> : {};
      const claimId = uuid(record.claimId, 'Claim ID');
      if (seen.has(claimId)) throw new ResearchReviewError('DUPLICATE_CLAIM_DECISION', 'Each claim may be reviewed only once per batch.');
      seen.add(claimId);
      const state = text(record.state, 20).toLowerCase();
      if (!guidedDecisionStates.has(state)) throw new ResearchReviewError('INVALID_CLAIM_STATE', 'Guided claim decisions must be accepted, rejected or conflict.');
      return { claimId, state };
    });
    const claimIds = decisions.map((decision) => decision.claimId);
    const rows = await sqlClient`
      SELECT
        claim.id::text AS id,
        EXISTS (
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
        ) AS "hasActiveSupport"
      FROM content.note_source_claims claim
      WHERE claim.job_id = ${jobId}::uuid AND claim.id = ANY(${claimIds}::uuid[])
    `;
    if (rows.length !== claimIds.length) throw new ResearchReviewError('CLAIM_REVIEW_STALE', 'One or more claims no longer belong to this authoring job.', 409);
    const supportById = new Map(rows.map((row) => [String(row.id), row.hasActiveSupport === true]));
    for (const decision of decisions) {
      if (decision.state === 'accepted' && !supportById.get(decision.claimId)) {
        throw new ResearchReviewError('ACTIVE_SUPPORT_REQUIRED', 'Every accepted claim must still have active supporting evidence.', 409);
      }
    }

    await sqlClient.begin(async (tx) => {
      for (const decision of decisions) {
        await tx`
          UPDATE content.note_source_claims
          SET state = ${decision.state}, updated_by = ${actorUserId}::uuid, updated_at = now()
          WHERE job_id = ${jobId}::uuid AND id = ${decision.claimId}::uuid
        `;
      }
    });
    await refreshNotesAuthoringReadiness(jobId, actorUserId);
    const summary = await claimSummary(jobId);
    await audit(actorUserId, 'notes_studio.research_review.claims_reviewed', jobId, 'Applied one explicit batch of Research Review claim decisions', {
      decisionCount: decisions.length,
      acceptedCount: decisions.filter((decision) => decision.state === 'accepted').length,
      rejectedCount: decisions.filter((decision) => decision.state === 'rejected').length,
      conflictCount: decisions.filter((decision) => decision.state === 'conflict').length,
      editorApplied: true,
      automaticAcceptance: false,
      automaticCoverageDecision: false,
      learnerPublished: false,
    });
    res.json({ decisionsApplied: decisions.length, claimSummary: summary, editorApplied: true, automaticAcceptance: false });
  } catch (error) {
    sendError(res, error, 'Unable to apply guided Notes Studio claim review');
  }
});

export default router;
