import { randomUUID } from 'node:crypto';
import { Router, type IRouter, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import {
  MAX_COVERAGE_GAP_ITEMS,
  NOTES_COVERAGE_GAP_RESEARCH_PROMPT_VERSION,
  coverageGapResearchInputFingerprint,
  coverageGapResearchOutputFingerprint,
  type CoverageGapResearchInput,
  type CoverageGapResearchItem,
} from '../notes-studio/coverage-gap-research';
import {
  CoverageGapResearchModelConfigurationError,
  generateCoverageGapResearchBriefs,
} from '../notes-studio/coverage-gap-research-provider';
import {
  coverageAcceptedClaimKey,
  coverageStatusFromEditorialReview,
  type CoverageClaimReviewLink,
  type CoverageClaimState,
} from '../notes-studio/evidence-map';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const editableStates = new Set(['evidence_ready', 'outline_ready']);

class CoverageGapResearchError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new CoverageGapResearchError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof CoverageGapResearchError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  if (error instanceof CoverageGapResearchModelConfigurationError) {
    res.status(503).json({ error: error.message, code: 'NOTES_STUDIO_RESEARCH_MODEL_NOT_CONFIGURED' });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'NOTES_STUDIO_COVERAGE_GAP_RESEARCH_FAILED' });
}

async function loadGapInput(jobId: string): Promise<{ input: CoverageGapResearchInput; totalGapCount: number }> {
  const jobRows = await sqlClient`
    SELECT id::text AS id, title, source_language AS "sourceLanguage", state
    FROM content.note_authoring_jobs
    WHERE id = ${jobId}::uuid
    LIMIT 1
  `;
  const job = jobRows[0];
  if (!job) throw new CoverageGapResearchError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
  if (!editableStates.has(String(job.state))) {
    throw new CoverageGapResearchError(
      'COVERAGE_RESEARCH_FROZEN',
      'Coverage-gap research is available only during evidence/outline review. Use a successor revision once section drafting has started.',
      409,
    );
  }

  const itemRows = await sqlClient`
    SELECT
      id::text AS id,
      title,
      syllabus_ref AS "syllabusRef",
      priority,
      planned_depth AS "plannedDepth",
      exam_rationale AS "examRationale",
      sort_order AS "sortOrder",
      coverage_review_state AS "coverageReviewState",
      coverage_review_claim_ids AS "coverageReviewClaimIds"
    FROM content.note_coverage_plan_items
    WHERE job_id = ${jobId}::uuid
      AND priority IN ('required', 'high')
    ORDER BY sort_order, created_at
    LIMIT 250
  `;
  if (itemRows.length === 0) {
    throw new CoverageGapResearchError('NO_CORE_COVERAGE_ITEMS', 'Create required/high coverage targets before generating a gap research brief.', 409);
  }

  const linkRows = await sqlClient`
    SELECT
      mapping.coverage_item_id::text AS "coverageItemId",
      claim.id::text AS "claimId",
      claim.claim_text AS "claimText",
      claim.state,
      EXISTS (
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
      ) AS "hasActiveSupport"
    FROM content.note_coverage_item_claims mapping
    JOIN content.note_source_claims claim
      ON claim.job_id = mapping.job_id AND claim.id = mapping.claim_id
    WHERE mapping.job_id = ${jobId}::uuid
    ORDER BY claim.updated_at DESC
  `;

  const linksByItem = new Map<string, Array<Record<string, unknown>>>();
  for (const link of linkRows) {
    const key = String(link.coverageItemId);
    const list = linksByItem.get(key) ?? [];
    list.push(link as Record<string, unknown>);
    linksByItem.set(key, list);
  }

  const allGaps: CoverageGapResearchItem[] = [];
  for (const item of itemRows) {
    const links = linksByItem.get(String(item.id)) ?? [];
    const normalizedLinks: CoverageClaimReviewLink[] = links.map((claim) => ({
      claimId: String(claim.claimId ?? ''),
      state: String(claim.state ?? 'rejected') as CoverageClaimState,
      hasActiveSupport: claim.hasActiveSupport === true,
    }));
    const states = normalizedLinks.map((claim) =>
      claim.hasActiveSupport ? claim.state : 'rejected' as CoverageClaimState,
    );
    const currentClaimKey = coverageAcceptedClaimKey(normalizedLinks);
    const coverageReviewCurrent = String(item.coverageReviewState) === 'confirmed'
      && currentClaimKey.length > 0
      && String(item.coverageReviewClaimIds ?? '') === currentClaimKey;
    const status = coverageStatusFromEditorialReview(states, coverageReviewCurrent);
    if (status === 'covered') continue;
    allGaps.push({
      id: String(item.id),
      title: String(item.title),
      syllabusRef: String(item.syllabusRef ?? ''),
      priority: String(item.priority) as 'required' | 'high',
      plannedDepth: String(item.plannedDepth),
      examRationale: String(item.examRationale ?? ''),
      status,
      acceptedClaims: links
        .filter((claim) => claim.state === 'accepted' && claim.hasActiveSupport === true)
        .map((claim) => ({ id: String(claim.claimId), text: String(claim.claimText) }))
        .slice(0, 20),
    });
  }
  if (allGaps.length === 0) {
    throw new CoverageGapResearchError('NO_CORE_COVERAGE_GAPS', 'All required/high coverage targets are currently covered. No gap research brief is needed.', 409);
  }

  return {
    input: {
      jobId,
      noteTitle: String(job.title),
      languageCode: String(job.sourceLanguage || 'en'),
      gaps: allGaps.slice(0, MAX_COVERAGE_GAP_ITEMS),
    },
    totalGapCount: allGaps.length,
  };
}

async function audit(actorUserId: string, jobId: string, metadata: Record<string, unknown>) {
  await sqlClient`
    INSERT INTO platform.audit_events (
      id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
    ) VALUES (
      ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
      'notes_studio.coverage_gap_research.generated', 'note_authoring_job', ${jobId}::uuid,
      'Generated non-factual research briefs for unresolved Notes Studio coverage', ${JSON.stringify(metadata)}
    )
  `;
}

router.post('/jobs/:jobId/coverage-gap-research/generate', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new CoverageGapResearchError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    const { input, totalGapCount } = await loadGapInput(jobId);
    const inputFingerprint = coverageGapResearchInputFingerprint(input);
    const generated = await generateCoverageGapResearchBriefs(input);
    const outputFingerprint = coverageGapResearchOutputFingerprint(generated.output);

    await audit(actorUserId, jobId, {
      provider: generated.provider,
      model: generated.model,
      responseId: generated.responseId,
      usage: generated.usage,
      promptVersion: NOTES_COVERAGE_GAP_RESEARCH_PROMPT_VERSION,
      inputFingerprint,
      outputFingerprint,
      totalGapCount,
      batchGapCount: input.gaps.length,
      briefCount: generated.output.briefs.length,
      acceptedClaimTextOnly: true,
      rawSourceTextSent: false,
      factualAnswersRequested: false,
      automaticSourceDiscovery: false,
      automaticClaimCreation: false,
      automaticCoverageMutation: false,
      learnerPublished: false,
    });

    res.json({
      gaps: input.gaps,
      briefs: generated.output.briefs,
      totalGapCount,
      batchGapCount: input.gaps.length,
      provider: generated.provider,
      model: generated.model,
      promptVersion: NOTES_COVERAGE_GAP_RESEARCH_PROMPT_VERSION,
      inputFingerprint,
      outputFingerprint,
      acceptedClaimTextOnly: true,
      rawSourceTextSent: false,
      factualAnswersRequested: false,
      automaticSourceDiscovery: false,
      automaticClaimCreation: false,
      automaticCoverageMutation: false,
    });
  } catch (error) {
    sendError(res, error, 'Unable to generate Notes Studio coverage-gap research briefs');
  }
});

export default router;
