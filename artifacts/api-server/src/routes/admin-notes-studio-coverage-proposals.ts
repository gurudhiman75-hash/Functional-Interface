import { randomUUID } from 'node:crypto';
import { Router, type IRouter, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import {
  MAX_COVERAGE_BATCH_REVIEW_CLAIMS,
  MAX_COVERAGE_BATCH_REVIEW_ITEMS,
  MAX_COVERAGE_BATCH_REVIEW_CLAIMS_PER_ITEM,
  NOTES_COVERAGE_BATCH_REVIEW_PROMPT_VERSION,
  coverageBatchReviewInputFingerprint,
  coverageBatchReviewOutputFingerprint,
  type CoverageBatchReviewInput,
} from '../notes-studio/coverage-batch-review';
import {
  CoverageBatchReviewModelConfigurationError,
  generateCoverageBatchReview,
} from '../notes-studio/coverage-batch-review-provider';
import {
  MAX_COVERAGE_PROPOSAL_CLAIMS,
  MAX_COVERAGE_PROPOSAL_ITEMS,
  NOTES_COVERAGE_PROPOSAL_PROMPT_VERSION,
  coverageProposalInputFingerprint,
  coverageProposalOutputFingerprint,
  type CoverageProposalInput,
} from '../notes-studio/coverage-mapping-proposals';
import {
  CoverageProposalModelConfigurationError,
  generateCoverageMappingProposals,
} from '../notes-studio/coverage-mapping-proposals-provider';
import { refreshNotesAuthoringReadiness } from '../notes-studio/readiness';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const editableStates = new Set(['evidence_ready', 'outline_ready']);
const MAX_APPLY_LINKS = 300;

class CoverageProposalError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new CoverageProposalError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof CoverageProposalError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  if (error instanceof CoverageProposalModelConfigurationError || error instanceof CoverageBatchReviewModelConfigurationError) {
    res.status(503).json({ error: error.message, code: 'NOTES_STUDIO_COVERAGE_MODEL_NOT_CONFIGURED' });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'NOTES_STUDIO_COVERAGE_PROPOSAL_FAILED' });
}

async function loadEditableJob(jobId: string) {
  const rows = await sqlClient`
    SELECT id::text AS id, title, source_language AS "sourceLanguage", state
    FROM content.note_authoring_jobs
    WHERE id = ${jobId}::uuid
    LIMIT 1
  `;
  const job = rows[0];
  if (!job) throw new CoverageProposalError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
  if (!editableStates.has(String(job.state))) {
    throw new CoverageProposalError(
      'COVERAGE_PROPOSAL_FROZEN',
      'Coverage review is available only during evidence/outline review. Once section drafting starts, use a successor revision for new coverage research.',
      409,
    );
  }
  return job;
}

async function activeAcceptedClaims(jobId: string, limit: number) {
  return sqlClient`
    SELECT claim.id::text AS id, claim.claim_text AS text
    FROM content.note_source_claims claim
    WHERE claim.job_id = ${jobId}::uuid
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
    ORDER BY claim.updated_at, claim.id
    LIMIT ${limit}
  `;
}

async function loadProposalInput(jobId: string): Promise<{ input: CoverageProposalInput; totalUnmappedClaims: number }> {
  const job = await loadEditableJob(jobId);
  const claimRows = await sqlClient`
    SELECT
      claim.id::text AS id,
      claim.claim_text AS text,
      COUNT(*) OVER()::int AS "totalUnmappedClaims"
    FROM content.note_source_claims claim
    WHERE claim.job_id = ${jobId}::uuid
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
      AND NOT EXISTS (
        SELECT 1
        FROM content.note_coverage_item_claims coverage_link
        WHERE coverage_link.job_id = claim.job_id AND coverage_link.claim_id = claim.id
      )
    ORDER BY claim.updated_at, claim.id
    LIMIT ${MAX_COVERAGE_PROPOSAL_CLAIMS}
  `;
  if (claimRows.length === 0) {
    throw new CoverageProposalError('NO_UNMAPPED_ACCEPTED_CLAIMS', 'There are no accepted, actively supported claims waiting for an initial coverage link.', 409);
  }

  const coverageRows = await sqlClient`
    SELECT
      id::text AS id,
      title,
      syllabus_ref AS "syllabusRef",
      priority,
      planned_depth AS "plannedDepth",
      exam_rationale AS "examRationale"
    FROM content.note_coverage_plan_items
    WHERE job_id = ${jobId}::uuid AND priority <> 'exclude'
    ORDER BY sort_order, created_at
    LIMIT ${MAX_COVERAGE_PROPOSAL_ITEMS + 1}
  `;
  if (coverageRows.length === 0) {
    throw new CoverageProposalError('NO_COVERAGE_PLAN', 'Create at least one non-excluded coverage target before proposing claim links.', 409);
  }
  if (coverageRows.length > MAX_COVERAGE_PROPOSAL_ITEMS) {
    throw new CoverageProposalError(
      'COVERAGE_PLAN_TOO_LARGE',
      `This note has more than ${MAX_COVERAGE_PROPOSAL_ITEMS} active coverage targets. Split the note or reduce the coverage plan before model-assisted mapping.`,
      409,
    );
  }

  return {
    input: {
      jobId,
      noteTitle: String(job.title),
      languageCode: String(job.sourceLanguage || 'en'),
      claims: claimRows.map((claim) => ({ id: String(claim.id), text: String(claim.text) })),
      coverageItems: coverageRows.map((item) => ({
        id: String(item.id),
        title: String(item.title),
        syllabusRef: String(item.syllabusRef ?? ''),
        priority: String(item.priority),
        plannedDepth: String(item.plannedDepth),
        examRationale: String(item.examRationale ?? ''),
      })),
    },
    totalUnmappedClaims: Number(claimRows[0]?.totalUnmappedClaims ?? claimRows.length),
  };
}

async function loadBatchReviewInput(jobId: string): Promise<CoverageBatchReviewInput> {
  const job = await loadEditableJob(jobId);
  const claimRows = await activeAcceptedClaims(jobId, MAX_COVERAGE_BATCH_REVIEW_CLAIMS + 1);
  if (claimRows.length === 0) {
    throw new CoverageProposalError('NO_ACCEPTED_CLAIMS', 'Accept at least one source-supported claim before reviewing coverage.', 409);
  }
  if (claimRows.length > MAX_COVERAGE_BATCH_REVIEW_CLAIMS) {
    throw new CoverageProposalError(
      'TOO_MANY_ACCEPTED_CLAIMS',
      `This note has more than ${MAX_COVERAGE_BATCH_REVIEW_CLAIMS} accepted claims. Split the note or reduce the evidence set before batch review.`,
      409,
    );
  }

  const coverageRows = await sqlClient`
    SELECT
      id::text AS id,
      title,
      syllabus_ref AS "syllabusRef",
      priority,
      planned_depth AS "plannedDepth",
      exam_rationale AS "examRationale"
    FROM content.note_coverage_plan_items
    WHERE job_id = ${jobId}::uuid AND priority <> 'exclude'
    ORDER BY sort_order, created_at
    LIMIT ${MAX_COVERAGE_BATCH_REVIEW_ITEMS + 1}
  `;
  if (coverageRows.length === 0) throw new CoverageProposalError('NO_COVERAGE_PLAN', 'Create coverage targets before reviewing coverage.', 409);
  if (coverageRows.length > MAX_COVERAGE_BATCH_REVIEW_ITEMS) {
    throw new CoverageProposalError(
      'COVERAGE_PLAN_TOO_LARGE',
      `This note has more than ${MAX_COVERAGE_BATCH_REVIEW_ITEMS} active coverage targets. Split the note before batch review.`,
      409,
    );
  }

  const linkRows = await sqlClient`
    SELECT mapping.coverage_item_id::text AS "coverageItemId", mapping.claim_id::text AS "claimId"
    FROM content.note_coverage_item_claims mapping
    JOIN content.note_source_claims claim
      ON claim.job_id = mapping.job_id AND claim.id = mapping.claim_id
    WHERE mapping.job_id = ${jobId}::uuid
      AND claim.state = 'accepted'
      AND EXISTS (
        SELECT 1
        FROM content.note_source_claim_evidence evidence
        JOIN content.note_source_evidence_blocks block
          ON block.job_id = evidence.job_id AND block.id = evidence.evidence_block_id
        JOIN content.note_authoring_sources source_link
          ON source_link.job_id = block.job_id AND source_link.source_document_id = block.source_document_id
        WHERE evidence.job_id = claim.job_id
          AND evidence.claim_id = claim.id
          AND evidence.relation = 'supports'
          AND source_link.inclusion_state = 'included'
      )
  `;
  const linksByItem = new Map<string, string[]>();
  for (const row of linkRows) {
    const itemId = String(row.coverageItemId);
    const list = linksByItem.get(itemId) ?? [];
    list.push(String(row.claimId));
    linksByItem.set(itemId, list);
  }

  return {
    jobId,
    noteTitle: String(job.title),
    languageCode: String(job.sourceLanguage || 'en'),
    claims: claimRows.map((claim) => ({ id: String(claim.id), text: String(claim.text) })),
    coverageItems: coverageRows.map((item) => ({
      id: String(item.id),
      title: String(item.title),
      syllabusRef: String(item.syllabusRef ?? ''),
      priority: String(item.priority),
      plannedDepth: String(item.plannedDepth),
      examRationale: String(item.examRationale ?? ''),
      linkedClaimIds: [...new Set(linksByItem.get(String(item.id)) ?? [])].sort(),
    })),
  };
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

router.post('/jobs/:jobId/coverage-proposals/batch-review/generate', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new CoverageProposalError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    const input = await loadBatchReviewInput(jobId);
    const inputFingerprint = coverageBatchReviewInputFingerprint(input);
    const generated = await generateCoverageBatchReview(input);
    const outputFingerprint = coverageBatchReviewOutputFingerprint(generated.output);
    const counts = {
      sufficient: generated.output.reviews.filter((review) => review.assessment === 'sufficient').length,
      partial: generated.output.reviews.filter((review) => review.assessment === 'partial').length,
      missing: generated.output.reviews.filter((review) => review.assessment === 'missing').length,
    };

    await audit(actorUserId, 'notes_studio.coverage_batch_review.generated', jobId, 'Generated advisory batch coverage sufficiency review', {
      provider: generated.provider,
      model: generated.model,
      responseId: generated.responseId,
      usage: generated.usage,
      promptVersion: NOTES_COVERAGE_BATCH_REVIEW_PROMPT_VERSION,
      inputFingerprint,
      outputFingerprint,
      acceptedClaimCount: input.claims.length,
      coverageItemCount: input.coverageItems.length,
      counts,
      rawSourceTextSent: false,
      acceptedClaimsOnly: true,
      automaticApplication: false,
      automaticCoverageDecision: false,
      learnerPublished: false,
    });

    res.json({
      reviews: generated.output.reviews,
      claims: input.claims,
      coverageItems: input.coverageItems,
      counts,
      provider: generated.provider,
      model: generated.model,
      promptVersion: NOTES_COVERAGE_BATCH_REVIEW_PROMPT_VERSION,
      inputFingerprint,
      outputFingerprint,
      rawSourceTextSent: false,
      acceptedClaimsOnly: true,
      automaticApplication: false,
      automaticCoverageDecision: false,
    });
  } catch (error) {
    sendError(res, error, 'Unable to generate Notes Studio batch coverage review');
  }
});

router.post('/jobs/:jobId/coverage-proposals/batch-review/apply', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new CoverageProposalError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    await loadEditableJob(jobId);
    const rawReviews = Array.isArray(req.body?.reviews) ? req.body.reviews : [];
    if (rawReviews.length < 1 || rawReviews.length > MAX_COVERAGE_BATCH_REVIEW_ITEMS) {
      throw new CoverageProposalError('INVALID_BATCH_COVERAGE_REVIEWS', `Choose 1-${MAX_COVERAGE_BATCH_REVIEW_ITEMS} sufficient targets to approve.`);
    }

    const seenCoverageIds = new Set<string>();
    const reviews = rawReviews.map((raw: unknown) => {
      const record = raw && typeof raw === 'object' ? raw as Record<string, unknown> : {};
      const coverageItemId = uuid(record.coverageItemId, 'Coverage item ID');
      if (seenCoverageIds.has(coverageItemId)) throw new CoverageProposalError('DUPLICATE_COVERAGE_REVIEW', 'A coverage target may be approved only once per batch.');
      seenCoverageIds.add(coverageItemId);
      const rawClaimIds = Array.isArray(record.claimIds) ? record.claimIds : [];
      const claimIds = [...new Set(rawClaimIds.map((claimId) => uuid(claimId, 'Claim ID')))];
      if (claimIds.length < 1 || claimIds.length > MAX_COVERAGE_BATCH_REVIEW_CLAIMS_PER_ITEM) {
        throw new CoverageProposalError('INVALID_BATCH_REVIEW_CLAIMS', `Each approved target requires 1-${MAX_COVERAGE_BATCH_REVIEW_CLAIMS_PER_ITEM} reviewed accepted claims.`);
      }
      return { coverageItemId, claimIds };
    });

    const coverageIds = reviews.map((review) => review.coverageItemId);
    const claimIds = [...new Set(reviews.flatMap((review) => review.claimIds))];
    const validCoverage = await sqlClient`
      SELECT id::text AS id
      FROM content.note_coverage_plan_items
      WHERE job_id = ${jobId}::uuid
        AND id = ANY(${coverageIds}::uuid[])
        AND priority <> 'exclude'
    `;
    if (validCoverage.length !== coverageIds.length) {
      throw new CoverageProposalError('COVERAGE_REVIEW_STALE', 'One or more reviewed coverage targets are no longer active.', 409);
    }
    const validClaims = await activeAcceptedClaims(jobId, MAX_COVERAGE_BATCH_REVIEW_CLAIMS + 1);
    const validClaimIds = new Set(validClaims.map((claim) => String(claim.id)));
    if (claimIds.some((claimId) => !validClaimIds.has(claimId))) {
      throw new CoverageProposalError('COVERAGE_REVIEW_STALE', 'One or more reviewed claims are no longer accepted with active supporting evidence.', 409);
    }

    let createdLinks = 0;
    await sqlClient.begin(async (tx) => {
      for (const review of reviews) {
        for (const claimId of review.claimIds) {
          const rows = await tx`
            INSERT INTO content.note_coverage_item_claims (
              job_id, coverage_item_id, claim_id, created_by, created_at
            ) VALUES (
              ${jobId}::uuid, ${review.coverageItemId}::uuid, ${claimId}::uuid, ${actorUserId}::uuid, now()
            )
            ON CONFLICT (coverage_item_id, claim_id) DO NOTHING
            RETURNING claim_id::text AS id
          `;
          if (rows[0]) createdLinks += 1;
        }

        const conflictRows = await tx`
          SELECT 1
          FROM content.note_coverage_item_claims mapping
          JOIN content.note_source_claims claim
            ON claim.job_id = mapping.job_id AND claim.id = mapping.claim_id
          WHERE mapping.job_id = ${jobId}::uuid
            AND mapping.coverage_item_id = ${review.coverageItemId}::uuid
            AND claim.state = 'conflict'
            AND EXISTS (
              SELECT 1
              FROM content.note_source_claim_evidence evidence
              JOIN content.note_source_evidence_blocks block
                ON block.job_id = evidence.job_id AND block.id = evidence.evidence_block_id
              JOIN content.note_authoring_sources source_link
                ON source_link.job_id = block.job_id AND source_link.source_document_id = block.source_document_id
              WHERE evidence.job_id = claim.job_id
                AND evidence.claim_id = claim.id
                AND source_link.inclusion_state = 'included'
            )
          LIMIT 1
        `;
        if (conflictRows[0]) throw new CoverageProposalError('COVERAGE_CONFLICT_BLOCKS_REVIEW', 'Resolve linked conflicts before approving sufficient coverage.', 409);

        const keyRows = await tx`
          SELECT claim.id::text AS id
          FROM content.note_coverage_item_claims mapping
          JOIN content.note_source_claims claim
            ON claim.job_id = mapping.job_id AND claim.id = mapping.claim_id
          WHERE mapping.job_id = ${jobId}::uuid
            AND mapping.coverage_item_id = ${review.coverageItemId}::uuid
            AND claim.state = 'accepted'
            AND EXISTS (
              SELECT 1
              FROM content.note_source_claim_evidence evidence
              JOIN content.note_source_evidence_blocks block
                ON block.job_id = evidence.job_id AND block.id = evidence.evidence_block_id
              JOIN content.note_authoring_sources source_link
                ON source_link.job_id = block.job_id AND source_link.source_document_id = block.source_document_id
              WHERE evidence.job_id = claim.job_id
                AND evidence.claim_id = claim.id
                AND evidence.relation = 'supports'
                AND source_link.inclusion_state = 'included'
            )
          ORDER BY claim.id
        `;
        const acceptedClaimKey = keyRows.map((row) => String(row.id)).join(',');
        if (!acceptedClaimKey) throw new CoverageProposalError('ACCEPTED_COVERAGE_EVIDENCE_REQUIRED', 'Approved coverage requires accepted claims with active supporting evidence.', 409);

        await tx`
          UPDATE content.note_coverage_plan_items
          SET coverage_review_state = 'confirmed',
              coverage_review_claim_ids = ${acceptedClaimKey},
              coverage_reviewed_by = ${actorUserId}::uuid,
              coverage_reviewed_at = now(),
              updated_by = ${actorUserId}::uuid,
              updated_at = now()
          WHERE job_id = ${jobId}::uuid AND id = ${review.coverageItemId}::uuid
        `;
      }
    });

    const jobState = await refreshNotesAuthoringReadiness(jobId, actorUserId);
    await audit(actorUserId, 'notes_studio.coverage_batch_review.applied', jobId, 'Applied editor-approved sufficient coverage in one batch', {
      approvedCoverageCount: reviews.length,
      reviewedClaimCount: claimIds.length,
      createdLinkCount: createdLinks,
      editorBatchApplied: true,
      modelAutomaticallyApplied: false,
      automaticCoverageDecision: false,
      claimStateChanged: false,
      learnerPublished: false,
    });
    res.json({
      approved: reviews.length,
      createdLinks,
      jobState,
      editorBatchApplied: true,
      modelAutomaticallyApplied: false,
      automaticCoverageDecision: false,
      claimStateChanged: false,
    });
  } catch (error) {
    sendError(res, error, 'Unable to apply Notes Studio batch coverage review');
  }
});

router.post('/jobs/:jobId/coverage-proposals/generate', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new CoverageProposalError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    const { input, totalUnmappedClaims } = await loadProposalInput(jobId);
    const inputFingerprint = coverageProposalInputFingerprint(input);
    const generated = await generateCoverageMappingProposals(input);
    const outputFingerprint = coverageProposalOutputFingerprint(generated.output);

    await audit(actorUserId, 'notes_studio.coverage_proposals.generated', jobId, 'Generated reviewed-apply coverage mapping proposals', {
      provider: generated.provider,
      model: generated.model,
      responseId: generated.responseId,
      usage: generated.usage,
      promptVersion: NOTES_COVERAGE_PROPOSAL_PROMPT_VERSION,
      inputFingerprint,
      outputFingerprint,
      acceptedClaimCount: input.claims.length,
      totalUnmappedClaims,
      coverageItemCount: input.coverageItems.length,
      proposalCount: generated.output.proposals.length,
      rawSourceTextSent: false,
      acceptedClaimsOnly: true,
      automaticApplication: false,
      learnerPublished: false,
    });

    res.json({
      proposals: generated.output.proposals,
      claims: input.claims,
      coverageItems: input.coverageItems,
      totalUnmappedClaims,
      batchClaimCount: input.claims.length,
      provider: generated.provider,
      model: generated.model,
      promptVersion: NOTES_COVERAGE_PROPOSAL_PROMPT_VERSION,
      inputFingerprint,
      outputFingerprint,
      rawSourceTextSent: false,
      acceptedClaimsOnly: true,
      automaticApplication: false,
    });
  } catch (error) {
    sendError(res, error, 'Unable to generate Notes Studio coverage proposals');
  }
});

router.post('/jobs/:jobId/coverage-proposals/apply', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new CoverageProposalError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    await loadEditableJob(jobId);
    const rawMappings = Array.isArray(req.body?.mappings) ? req.body.mappings : [];
    if (rawMappings.length < 1 || rawMappings.length > MAX_APPLY_LINKS) {
      throw new CoverageProposalError('INVALID_COVERAGE_MAPPINGS', `Choose between 1 and ${MAX_APPLY_LINKS} reviewed claim-to-coverage links.`);
    }
    const mappingKeys = new Set<string>();
    const mappings = rawMappings.map((raw: unknown) => {
      const record = raw && typeof raw === 'object' ? raw as Record<string, unknown> : {};
      const claimId = uuid(record.claimId, 'Claim ID');
      const coverageItemId = uuid(record.coverageItemId, 'Coverage item ID');
      const key = `${claimId}:${coverageItemId}`;
      if (mappingKeys.has(key)) return null;
      mappingKeys.add(key);
      return { claimId, coverageItemId };
    }).filter((value): value is { claimId: string; coverageItemId: string } => value !== null);

    const claimIds = [...new Set(mappings.map((mapping) => mapping.claimId))];
    const coverageIds = [...new Set(mappings.map((mapping) => mapping.coverageItemId))];
    const validClaims = await sqlClient`
      SELECT claim.id::text AS id
      FROM content.note_source_claims claim
      WHERE claim.job_id = ${jobId}::uuid
        AND claim.id = ANY(${claimIds}::uuid[])
        AND claim.state = 'accepted'
        AND EXISTS (
          SELECT 1
          FROM content.note_source_claim_evidence evidence
          JOIN content.note_source_evidence_blocks block
            ON block.job_id = evidence.job_id AND block.id = evidence.evidence_block_id
          JOIN content.note_authoring_sources link
            ON link.job_id = block.job_id AND link.source_document_id = block.source_document_id
          WHERE evidence.job_id = claim.job_id
            AND evidence.claim_id = claim.id
            AND evidence.relation = 'supports'
            AND link.inclusion_state = 'included'
        )
    `;
    if (validClaims.length !== claimIds.length) {
      throw new CoverageProposalError('CLAIM_MAPPING_STALE', 'One or more reviewed claims are no longer accepted with active supporting evidence.', 409);
    }
    const validCoverage = await sqlClient`
      SELECT id::text AS id
      FROM content.note_coverage_plan_items
      WHERE job_id = ${jobId}::uuid
        AND id = ANY(${coverageIds}::uuid[])
        AND priority <> 'exclude'
    `;
    if (validCoverage.length !== coverageIds.length) {
      throw new CoverageProposalError('COVERAGE_MAPPING_STALE', 'One or more reviewed coverage targets are no longer active.', 409);
    }

    let created = 0;
    await sqlClient.begin(async (tx) => {
      for (const mapping of mappings) {
        const rows = await tx`
          INSERT INTO content.note_coverage_item_claims (
            job_id, coverage_item_id, claim_id, created_by, created_at
          ) VALUES (
            ${jobId}::uuid, ${mapping.coverageItemId}::uuid, ${mapping.claimId}::uuid, ${actorUserId}::uuid, now()
          )
          ON CONFLICT (coverage_item_id, claim_id) DO NOTHING
          RETURNING claim_id::text AS id
        `;
        if (rows[0]) created += 1;
      }
    });
    const jobState = await refreshNotesAuthoringReadiness(jobId, actorUserId);
    await audit(actorUserId, 'notes_studio.coverage_proposals.applied', jobId, 'Applied editor-reviewed claim-to-coverage links', {
      reviewedMappingCount: mappings.length,
      createdMappingCount: created,
      duplicateMappingCount: mappings.length - created,
      editorApplied: true,
      modelAutomaticallyApplied: false,
      claimStateChanged: false,
      learnerPublished: false,
    });
    res.json({
      reviewed: mappings.length,
      created,
      duplicatesSkipped: mappings.length - created,
      jobState,
      editorApplied: true,
      modelAutomaticallyApplied: false,
      claimStateChanged: false,
    });
  } catch (error) {
    sendError(res, error, 'Unable to apply Notes Studio coverage proposals');
  }
});

export default router;
