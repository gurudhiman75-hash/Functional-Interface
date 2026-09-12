import { Router, type IRouter, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';
import {
  coverageAcceptedClaimKey,
  coverageStatusFromEditorialReview,
  type CoverageClaimReviewLink,
  type CoverageClaimState,
} from '../notes-studio/evidence-map';
import {
  MAX_GAP_SOURCE_RECOMMENDATIONS_PER_ITEM,
  MAX_GAP_SOURCE_RECOMMENDATIONS_TOTAL,
  coverageTextSimilarity,
  gapSourceRecommendationReason,
  gapSourceRecommendationScore,
  sourcePackEditableState,
} from '../notes-studio/gap-source-recommendations';
import { noteSourceIdentity } from '../notes-studio/source-pack-policy';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

class GapSourceError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new GapSourceError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function briefField(brief: unknown, key: string): string {
  if (!brief || typeof brief !== 'object' || Array.isArray(brief)) return '';
  return text((brief as Record<string, unknown>)[key], 300).toLowerCase();
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof GapSourceError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'NOTES_STUDIO_GAP_SOURCE_RECOMMENDATIONS_FAILED' });
}

async function loadJob(jobId: string) {
  const rows = await sqlClient`
    SELECT id::text AS id, title, state, brief
    FROM content.note_authoring_jobs
    WHERE id = ${jobId}::uuid
    LIMIT 1
  `;
  if (!rows[0]) throw new GapSourceError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
  return rows[0];
}

async function loadCoreGaps(jobId: string) {
  const items = await sqlClient`
    SELECT id::text AS id, title, syllabus_ref AS "syllabusRef", priority, planned_depth AS "plannedDepth",
           exam_rationale AS "examRationale", sort_order AS "sortOrder",
           coverage_review_state AS "coverageReviewState",
           coverage_review_claim_ids AS "coverageReviewClaimIds"
    FROM content.note_coverage_plan_items
    WHERE job_id = ${jobId}::uuid
      AND priority IN ('required', 'high')
    ORDER BY sort_order, created_at
  `;
  const links = await sqlClient`
    SELECT mapping.coverage_item_id::text AS "coverageItemId", claim.id::text AS "claimId", claim.state,
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
  `;
  const byItem = new Map<string, Array<Record<string, unknown>>>();
  for (const row of links) {
    const key = String(row.coverageItemId);
    const list = byItem.get(key) ?? [];
    list.push(row as Record<string, unknown>);
    byItem.set(key, list);
  }
  return items.map((item) => {
    const claimLinks = byItem.get(String(item.id)) ?? [];
    const normalizedLinks: CoverageClaimReviewLink[] = claimLinks.map((claim) => ({
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
    return { ...item, status: coverageStatusFromEditorialReview(states, coverageReviewCurrent) };
  }).filter((item) => item.status !== 'covered');
}

type Aggregate = {
  source: Record<string, unknown>;
  exactCoverageIds: Set<string>;
  acceptedClaimIds: Set<string>;
  retainedAcceptedClaimIds: Set<string>;
  referenceAcceptedClaimIds: Set<string>;
  priorJobIds: Set<string>;
  approvedJobIds: Set<string>;
  sameTaxonomyNodeJobIds: Set<string>;
  sameTaxonomyCodeJobIds: Set<string>;
  historicalRoleCounts: Map<string, number>;
  maxCoverageSimilarity: number;
};

function mostCommonRole(counts: Map<string, number>): string {
  return [...counts.entries()].sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))[0]?.[0] ?? 'core_reference';
}

router.use(authenticate);

router.get('/jobs/:jobId/gap-source-recommendations', requireAdminPermission('content.questions.read'), async (req, res) => {
  try {
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    const job = await loadJob(jobId);
    const gaps = await loadCoreGaps(jobId);
    if (gaps.length === 0) {
      res.json({
        job,
        gaps: [],
        recommendationCount: 0,
        rawSourceBodiesReturned: false,
        automaticAttachment: false,
        automaticEvidenceAcceptance: false,
        automaticGeneration: false,
        historicalReferenceEvidenceTransferred: false,
        sourcePackMutable: sourcePackEditableState(String(job.state)),
      });
      return;
    }

    const attachedRows = await sqlClient`
      SELECT document.id::text AS id, document.content_hash AS "contentHash", document.publisher, document.source_uri AS "sourceUri"
      FROM content.note_authoring_sources link
      JOIN content.source_documents document ON document.id = link.source_document_id
      WHERE link.job_id = ${jobId}::uuid
    `;
    const attachedIds = new Set(attachedRows.map((row) => String(row.id)));
    const attachedHashes = new Set(attachedRows.map((row) => String(row.contentHash ?? '').trim().toLowerCase()).filter(Boolean));
    const attachedIdentities = new Set(attachedRows.map((row) => noteSourceIdentity(row.publisher, row.sourceUri)).filter((value): value is string => Boolean(value)));

    const historicalRows = await sqlClient`
      SELECT DISTINCT
        document.id::text AS id,
        document.title,
        document.publisher,
        document.source_uri AS "sourceUri",
        document.source_type AS "sourceType",
        document.content_hash AS "contentHash",
        document.rights_basis AS "rightsBasis",
        document.retention_mode AS "retentionMode",
        document.extraction_status AS "extractionStatus",
        LENGTH(COALESCE(document.extracted_text, ''))::int AS "retainedCharCount",
        block.evidence_kind AS "evidenceKind",
        source_link.source_role AS "sourceRole",
        prior_job.id::text AS "priorJobId",
        prior_job.title AS "priorJobTitle",
        prior_job.brief AS "priorBrief",
        prior_job.state AS "priorJobState",
        coverage.id::text AS "priorCoverageItemId",
        coverage.title AS "priorCoverageTitle",
        coverage.syllabus_ref AS "priorSyllabusRef",
        claim.id::text AS "claimId",
        EXISTS (SELECT 1 FROM content.note_approved_versions version WHERE version.job_id = prior_job.id) AS "approvedUse"
      FROM content.note_coverage_item_claims coverage_link
      JOIN content.note_coverage_plan_items coverage
        ON coverage.job_id = coverage_link.job_id AND coverage.id = coverage_link.coverage_item_id
      JOIN content.note_source_claims claim
        ON claim.job_id = coverage_link.job_id AND claim.id = coverage_link.claim_id AND claim.state = 'accepted'
      JOIN content.note_source_claim_evidence evidence
        ON evidence.job_id = claim.job_id AND evidence.claim_id = claim.id AND evidence.relation = 'supports'
      JOIN content.note_source_evidence_blocks block
        ON block.job_id = evidence.job_id AND block.id = evidence.evidence_block_id
      JOIN content.note_authoring_sources source_link
        ON source_link.job_id = block.job_id
       AND source_link.source_document_id = block.source_document_id
       AND source_link.inclusion_state = 'included'
      JOIN content.source_documents document ON document.id = block.source_document_id
      JOIN content.note_authoring_jobs prior_job ON prior_job.id = claim.job_id
      WHERE prior_job.id <> ${jobId}::uuid
        AND (
          (
            block.evidence_kind = 'retained_excerpt'
            AND document.retention_mode = 'extracted_text'
            AND document.extraction_status = 'processed'
            AND LENGTH(COALESCE(document.extracted_text, '')) >= 100
          )
          OR (
            block.evidence_kind = 'editor_reference_note'
            AND block.reviewed_at IS NOT NULL
            AND document.rights_basis = 'reference_only'
            AND document.retention_mode = 'metadata_only'
          )
        )
      LIMIT 5000
    `;

    const targetNodeId = briefField(job.brief, 'taxonomyNodeId');
    const targetCode = briefField(job.brief, 'taxonomyCode');
    let total = 0;
    const hydratedGaps = [] as Array<Record<string, unknown>>;

    for (const gap of gaps) {
      if (total >= MAX_GAP_SOURCE_RECOMMENDATIONS_TOTAL) {
        hydratedGaps.push({ ...gap, recommendations: [] });
        continue;
      }
      const targetRef = text(gap.syllabusRef, 500).toLowerCase();
      const targetCoverageText = `${String(gap.title ?? '')} ${String(gap.syllabusRef ?? '')}`.trim();
      const aggregates = new Map<string, Aggregate>();

      for (const row of historicalRows) {
        const sourceId = String(row.id);
        if (attachedIds.has(sourceId)) continue;
        const priorRef = text(row.priorSyllabusRef, 500).toLowerCase();
        const exactRef = Boolean(targetRef && priorRef && targetRef === priorRef);
        const similarity = coverageTextSimilarity(
          targetCoverageText,
          `${String(row.priorCoverageTitle ?? '')} ${String(row.priorSyllabusRef ?? '')}`.trim(),
        );
        const priorNodeId = briefField(row.priorBrief, 'taxonomyNodeId');
        const priorCode = briefField(row.priorBrief, 'taxonomyCode');
        const sameNode = Boolean(targetNodeId && priorNodeId === targetNodeId);
        const sameCode = Boolean(targetCode && priorCode === targetCode);
        if (!exactRef && similarity < 0.2 && !sameNode && !sameCode) continue;

        let aggregate = aggregates.get(sourceId);
        if (!aggregate) {
          aggregate = {
            source: {
              id: sourceId,
              title: row.title,
              publisher: row.publisher,
              sourceUri: row.sourceUri,
              sourceType: row.sourceType,
              contentHash: row.contentHash,
              rightsBasis: row.rightsBasis,
              retentionMode: row.retentionMode,
              extractionStatus: row.extractionStatus,
              retainedCharCount: Number(row.retainedCharCount ?? 0),
            },
            exactCoverageIds: new Set(),
            acceptedClaimIds: new Set(),
            retainedAcceptedClaimIds: new Set(),
            referenceAcceptedClaimIds: new Set(),
            priorJobIds: new Set(),
            approvedJobIds: new Set(),
            sameTaxonomyNodeJobIds: new Set(),
            sameTaxonomyCodeJobIds: new Set(),
            historicalRoleCounts: new Map(),
            maxCoverageSimilarity: 0,
          };
          aggregates.set(sourceId, aggregate);
        }
        const priorJobId = String(row.priorJobId);
        const claimId = String(row.claimId);
        if (exactRef) aggregate.exactCoverageIds.add(String(row.priorCoverageItemId));
        aggregate.acceptedClaimIds.add(claimId);
        if (String(row.evidenceKind) === 'retained_excerpt') aggregate.retainedAcceptedClaimIds.add(claimId);
        if (String(row.evidenceKind) === 'editor_reference_note') aggregate.referenceAcceptedClaimIds.add(claimId);
        aggregate.priorJobIds.add(priorJobId);
        if (row.approvedUse === true || ['approved', 'materialized'].includes(String(row.priorJobState))) aggregate.approvedJobIds.add(priorJobId);
        if (sameNode) aggregate.sameTaxonomyNodeJobIds.add(priorJobId);
        if (sameCode) aggregate.sameTaxonomyCodeJobIds.add(priorJobId);
        const role = String(row.sourceRole ?? 'core_reference');
        aggregate.historicalRoleCounts.set(role, (aggregate.historicalRoleCounts.get(role) ?? 0) + 1);
        aggregate.maxCoverageSimilarity = Math.max(aggregate.maxCoverageSimilarity, similarity);
      }

      const recommendations = [...aggregates.values()].map((aggregate) => {
        const contentHash = String(aggregate.source.contentHash ?? '').trim().toLowerCase();
        const identity = noteSourceIdentity(aggregate.source.publisher, aggregate.source.sourceUri);
        const generationReady = aggregate.retainedAcceptedClaimIds.size > 0;
        const referenceReviewEligible = !generationReady && aggregate.referenceAcceptedClaimIds.size > 0;
        const signals = {
          exactSyllabusRefHits: aggregate.exactCoverageIds.size,
          maxCoverageSimilarity: aggregate.maxCoverageSimilarity,
          acceptedClaimCount: aggregate.acceptedClaimIds.size,
          priorJobCount: aggregate.priorJobIds.size,
          approvedUseCount: aggregate.approvedJobIds.size,
          sameTaxonomyNodeUses: aggregate.sameTaxonomyNodeJobIds.size,
          sameTaxonomyCodeUses: aggregate.sameTaxonomyCodeJobIds.size,
          generationReady,
          referenceReviewEligible,
          identityNovel: Boolean(identity && !attachedIdentities.has(identity)),
          duplicateContent: Boolean(contentHash && attachedHashes.has(contentHash)),
        };
        const historicalRoles = [...aggregate.historicalRoleCounts.entries()]
          .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
          .map(([role]) => role);
        return {
          ...aggregate.source,
          score: gapSourceRecommendationScore(signals),
          reason: gapSourceRecommendationReason(signals),
          exactSyllabusRefHits: signals.exactSyllabusRefHits,
          coverageSimilarity: signals.maxCoverageSimilarity,
          acceptedClaimCount: signals.acceptedClaimCount,
          retainedAcceptedClaimCount: aggregate.retainedAcceptedClaimIds.size,
          referenceAcceptedClaimCount: aggregate.referenceAcceptedClaimIds.size,
          priorJobCount: signals.priorJobCount,
          approvedUseCount: signals.approvedUseCount,
          sameTaxonomyNodeUses: signals.sameTaxonomyNodeUses,
          sameTaxonomyCodeUses: signals.sameTaxonomyCodeUses,
          identityNovel: signals.identityNovel,
          evidencePath: generationReady ? 'retained_ready' : 'reference_review_required',
          referenceReviewRequired: referenceReviewEligible,
          historicalReferenceEvidenceTransferred: false,
          recommendedRole: mostCommonRole(aggregate.historicalRoleCounts),
          historicalRoles,
        };
      }).filter((item) => item.score > 0)
        .sort((left, right) => right.score - left.score || String(left.title).localeCompare(String(right.title)))
        .slice(0, Math.min(MAX_GAP_SOURCE_RECOMMENDATIONS_PER_ITEM, MAX_GAP_SOURCE_RECOMMENDATIONS_TOTAL - total));

      total += recommendations.length;
      hydratedGaps.push({ ...gap, recommendations });
    }

    res.json({
      job,
      gaps: hydratedGaps,
      recommendationCount: total,
      rawSourceBodiesReturned: false,
      automaticAttachment: false,
      automaticEvidenceAcceptance: false,
      automaticGeneration: false,
      historicalReferenceEvidenceTransferred: false,
      sourcePackMutable: sourcePackEditableState(String(job.state)),
      progressedJobAction: sourcePackEditableState(String(job.state))
        ? 'Review the recommendation, then reuse it explicitly through Source Library.'
        : 'Source pack is frozen at this lifecycle stage. Use a successor revision before attaching new research sources.',
    });
  } catch (error) {
    sendError(res, error, 'Unable to build Notes Studio gap-source recommendations');
  }
});

export default router;