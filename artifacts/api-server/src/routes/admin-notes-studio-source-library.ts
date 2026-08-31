import { randomUUID } from 'node:crypto';
import { Router, type IRouter, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';
import { sourcePackEditableState } from '../notes-studio/gap-source-recommendations';
import { refreshNotesAuthoringReadiness } from '../notes-studio/readiness';
import {
  MAX_SOURCE_RECOMMENDATIONS,
  isGenerationReadySource,
  sourceLibraryLimit,
  sourceRecommendationReason,
  sourceRecommendationScore,
  sourceReuseEvidencePath,
} from '../notes-studio/source-library';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

class SourceLibraryError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new SourceLibraryError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof SourceLibraryError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'NOTES_STUDIO_SOURCE_LIBRARY_FAILED' });
}

function briefField(brief: unknown, key: string): string {
  if (!brief || typeof brief !== 'object' || Array.isArray(brief)) return '';
  return text((brief as Record<string, unknown>)[key], 300).toLowerCase();
}

router.use(authenticate);

router.get('/source-library', requireAdminPermission('content.questions.read'), async (req, res) => {
  try {
    const query = text(req.query.q, 200).toLowerCase();
    const limit = sourceLibraryLimit(req.query.limit);
    const rows = await sqlClient`
      SELECT
        document.id::text AS id,
        document.source_type AS "sourceType",
        document.source_uri AS "sourceUri",
        document.title,
        document.publisher,
        document.mime_type AS "mimeType",
        document.content_hash AS "contentHash",
        document.rights_basis AS "rightsBasis",
        document.retention_mode AS "retentionMode",
        document.extraction_status AS "extractionStatus",
        document.failure_reason AS "failureReason",
        document.captured_at AS "capturedAt",
        document.updated_at AS "updatedAt",
        LENGTH(COALESCE(document.extracted_text, ''))::int AS "retainedCharCount",
        COUNT(DISTINCT link.job_id)::int AS "usageCount",
        COUNT(DISTINCT link.job_id) FILTER (
          WHERE job.state IN ('approved', 'materialized')
            OR approved.id IS NOT NULL
        )::int AS "approvedUsageCount",
        COUNT(DISTINCT block.job_id) FILTER (
          WHERE block.evidence_kind = 'editor_reference_note'
            AND block.reviewed_at IS NOT NULL
        )::int AS "reviewedReferenceUseCount"
      FROM content.source_documents document
      LEFT JOIN content.note_authoring_sources link
        ON link.source_document_id = document.id
        AND link.inclusion_state = 'included'
      LEFT JOIN content.note_authoring_jobs job ON job.id = link.job_id
      LEFT JOIN content.note_approved_versions approved ON approved.job_id = job.id
      LEFT JOIN content.note_source_evidence_blocks block
        ON block.job_id = link.job_id
        AND block.source_document_id = document.id
      WHERE ${query} = ''
        OR lower(document.title) LIKE ${`%${query}%`}
        OR lower(COALESCE(document.publisher, '')) LIKE ${`%${query}%`}
        OR lower(document.source_uri) LIKE ${`%${query}%`}
      GROUP BY document.id
      ORDER BY
        COUNT(DISTINCT link.job_id) FILTER (WHERE job.state IN ('approved', 'materialized') OR approved.id IS NOT NULL) DESC,
        COUNT(DISTINCT link.job_id) DESC,
        document.updated_at DESC
      LIMIT ${limit}
    `;
    res.json({
      sources: rows.map((row) => {
        const generationReady = isGenerationReadySource({
          retentionMode: String(row.retentionMode ?? ''),
          extractionStatus: String(row.extractionStatus ?? ''),
          retainedCharCount: Number(row.retainedCharCount ?? 0),
        });
        const reviewedReferenceUseCount = Number(row.reviewedReferenceUseCount ?? 0);
        const evidencePath = sourceReuseEvidencePath({
          generationReady,
          rightsBasis: String(row.rightsBasis ?? ''),
          retentionMode: String(row.retentionMode ?? ''),
          reviewedReferenceUseCount,
        });
        return {
          ...row,
          generationReady,
          reviewedReferenceUseCount,
          referenceReviewEligible: evidencePath === 'reference_review_required',
          evidencePath,
        };
      }),
      query,
      limit,
      rawSourceBodiesReturned: false,
      historicalReferenceEvidenceTransferred: false,
    });
  } catch (error) {
    sendError(res, error, 'Unable to load Notes Studio source library');
  }
});

router.get('/jobs/:id/source-recommendations', requireAdminPermission('content.questions.read'), async (req, res) => {
  try {
    const jobId = uuid(req.params.id, 'Authoring job ID');
    const jobRows = await sqlClient`
      SELECT id::text AS id, title, brief
      FROM content.note_authoring_jobs
      WHERE id = ${jobId}::uuid
      LIMIT 1
    `;
    const job = jobRows[0];
    if (!job) throw new SourceLibraryError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);

    const targetTaxonomyNodeId = briefField(job.brief, 'taxonomyNodeId');
    const targetTaxonomyCode = briefField(job.brief, 'taxonomyCode');
    const targetTopicLabel = briefField(job.brief, 'topicLabel');
    if (!targetTaxonomyNodeId && !targetTaxonomyCode && !targetTopicLabel) {
      res.json({
        job,
        recommendations: [],
        reason: 'The job has no canonical taxonomy or topic label yet.',
        rawSourceBodiesReturned: false,
        historicalReferenceEvidenceTransferred: false,
      });
      return;
    }

    const usageRows = await sqlClient`
      SELECT
        document.id::text AS id,
        document.source_type AS "sourceType",
        document.source_uri AS "sourceUri",
        document.title,
        document.publisher,
        document.rights_basis AS "rightsBasis",
        document.retention_mode AS "retentionMode",
        document.extraction_status AS "extractionStatus",
        document.updated_at AS "updatedAt",
        LENGTH(COALESCE(document.extracted_text, ''))::int AS "retainedCharCount",
        prior_job.id::text AS "priorJobId",
        prior_job.title AS "priorJobTitle",
        prior_job.brief AS "priorBrief",
        prior_job.state AS "priorJobState",
        EXISTS (
          SELECT 1 FROM content.note_approved_versions version WHERE version.job_id = prior_job.id
        ) AS "approvedUse",
        EXISTS (
          SELECT 1
          FROM content.note_source_evidence_blocks block
          WHERE block.job_id = prior_job.id
            AND block.source_document_id = document.id
            AND block.evidence_kind = 'editor_reference_note'
            AND block.reviewed_at IS NOT NULL
        ) AS "reviewedReferenceUse"
      FROM content.source_documents document
      JOIN content.note_authoring_sources link
        ON link.source_document_id = document.id
        AND link.inclusion_state = 'included'
      JOIN content.note_authoring_jobs prior_job ON prior_job.id = link.job_id
      WHERE prior_job.id <> ${jobId}::uuid
        AND NOT EXISTS (
          SELECT 1
          FROM content.note_authoring_sources existing
          WHERE existing.job_id = ${jobId}::uuid
            AND existing.source_document_id = document.id
        )
      ORDER BY document.updated_at DESC
      LIMIT 1500
    `;

    type Aggregate = {
      source: Record<string, unknown>;
      exactTaxonomyUses: number;
      sameTaxonomyCodeUses: number;
      sameTopicUses: number;
      approvedUses: number;
      reviewedReferenceUses: number;
      priorJobs: Map<string, { id: string; title: string; state: string }>;
    };
    const aggregates = new Map<string, Aggregate>();
    for (const row of usageRows) {
      const sourceId = String(row.id);
      let aggregate = aggregates.get(sourceId);
      if (!aggregate) {
        aggregate = {
          source: {
            id: sourceId,
            sourceType: row.sourceType,
            sourceUri: row.sourceUri,
            title: row.title,
            publisher: row.publisher,
            rightsBasis: row.rightsBasis,
            retentionMode: row.retentionMode,
            extractionStatus: row.extractionStatus,
            retainedCharCount: Number(row.retainedCharCount ?? 0),
            updatedAt: row.updatedAt,
          },
          exactTaxonomyUses: 0,
          sameTaxonomyCodeUses: 0,
          sameTopicUses: 0,
          approvedUses: 0,
          reviewedReferenceUses: 0,
          priorJobs: new Map(),
        };
        aggregates.set(sourceId, aggregate);
      }
      const priorNodeId = briefField(row.priorBrief, 'taxonomyNodeId');
      const priorCode = briefField(row.priorBrief, 'taxonomyCode');
      const priorTopic = briefField(row.priorBrief, 'topicLabel');
      if (targetTaxonomyNodeId && priorNodeId === targetTaxonomyNodeId) aggregate.exactTaxonomyUses += 1;
      else if (targetTaxonomyCode && priorCode === targetTaxonomyCode) aggregate.sameTaxonomyCodeUses += 1;
      else if (targetTopicLabel && priorTopic === targetTopicLabel) aggregate.sameTopicUses += 1;
      if (row.approvedUse === true || ['approved', 'materialized'].includes(String(row.priorJobState))) aggregate.approvedUses += 1;
      if (row.reviewedReferenceUse === true) aggregate.reviewedReferenceUses += 1;
      aggregate.priorJobs.set(String(row.priorJobId), {
        id: String(row.priorJobId),
        title: String(row.priorJobTitle),
        state: String(row.priorJobState),
      });
    }

    const recommendations = [...aggregates.values()]
      .map((aggregate) => {
        const generationReady = isGenerationReadySource({
          retentionMode: String(aggregate.source.retentionMode ?? ''),
          extractionStatus: String(aggregate.source.extractionStatus ?? ''),
          retainedCharCount: Number(aggregate.source.retainedCharCount ?? 0),
        });
        const evidencePath = sourceReuseEvidencePath({
          generationReady,
          rightsBasis: String(aggregate.source.rightsBasis ?? ''),
          retentionMode: String(aggregate.source.retentionMode ?? ''),
          reviewedReferenceUseCount: aggregate.reviewedReferenceUses,
        });
        const referenceReviewEligible = evidencePath === 'reference_review_required';
        const signals = {
          exactTaxonomyUses: aggregate.exactTaxonomyUses,
          sameTaxonomyCodeUses: aggregate.sameTaxonomyCodeUses,
          sameTopicUses: aggregate.sameTopicUses,
          approvedUses: aggregate.approvedUses,
          generatable: generationReady,
          referenceReviewEligible,
          alreadyAttached: false,
        };
        return {
          ...aggregate.source,
          generationReady,
          reviewedReferenceUseCount: aggregate.reviewedReferenceUses,
          referenceReviewEligible,
          evidencePath,
          score: sourceRecommendationScore(signals),
          reason: sourceRecommendationReason(signals),
          exactTaxonomyUses: aggregate.exactTaxonomyUses,
          sameTaxonomyCodeUses: aggregate.sameTaxonomyCodeUses,
          sameTopicUses: aggregate.sameTopicUses,
          approvedUses: aggregate.approvedUses,
          priorJobs: [...aggregate.priorJobs.values()].slice(0, 5),
          historicalReferenceEvidenceTransferred: false,
        };
      })
      .filter((item) => item.score > 0)
      .sort((left, right) => right.score - left.score || String(left.title).localeCompare(String(right.title)))
      .slice(0, MAX_SOURCE_RECOMMENDATIONS);

    res.json({
      job,
      recommendations,
      rawSourceBodiesReturned: false,
      automaticAttachment: false,
      historicalReferenceEvidenceTransferred: false,
    });
  } catch (error) {
    sendError(res, error, 'Unable to load Notes Studio source recommendations');
  }
});

router.post('/jobs/:jobId/sources/:sourceId/reuse', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new SourceLibraryError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    const sourceId = uuid(req.params.sourceId, 'Source ID');

    const [jobRows, sourceRows] = await Promise.all([
      sqlClient`SELECT id::text AS id, title, state FROM content.note_authoring_jobs WHERE id = ${jobId}::uuid LIMIT 1`,
      sqlClient`
        SELECT
          document.id::text AS id,
          document.title,
          document.content_hash AS "contentHash",
          document.rights_basis AS "rightsBasis",
          document.retention_mode AS "retentionMode",
          document.extraction_status AS "extractionStatus",
          LENGTH(COALESCE(document.extracted_text, ''))::int AS "retainedCharCount",
          (
            SELECT COUNT(DISTINCT block.job_id)::int
            FROM content.note_source_evidence_blocks block
            WHERE block.source_document_id = document.id
              AND block.evidence_kind = 'editor_reference_note'
              AND block.reviewed_at IS NOT NULL
          ) AS "reviewedReferenceUseCount"
        FROM content.source_documents document
        WHERE document.id = ${sourceId}::uuid
        LIMIT 1
      `,
    ]);
    const job = jobRows[0];
    const source = sourceRows[0];
    if (!job) throw new SourceLibraryError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
    if (!source) throw new SourceLibraryError('SOURCE_NOT_FOUND', 'Governed source document not found.', 404);
    if (!sourcePackEditableState(String(job.state))) {
      throw new SourceLibraryError(
        'SOURCE_PACK_FROZEN',
        'The source pack freezes once evidence work begins. Create a successor revision before reusing another source.',
        409,
      );
    }

    const generationReady = isGenerationReadySource({
      retentionMode: String(source.retentionMode ?? ''),
      extractionStatus: String(source.extractionStatus ?? ''),
      retainedCharCount: Number(source.retainedCharCount ?? 0),
    });
    const evidencePath = sourceReuseEvidencePath({
      generationReady,
      rightsBasis: String(source.rightsBasis ?? ''),
      retentionMode: String(source.retentionMode ?? ''),
      reviewedReferenceUseCount: Number(source.reviewedReferenceUseCount ?? 0),
    });
    const referenceReviewRequired = String(source.rightsBasis ?? '') === 'reference_only'
      && String(source.retentionMode ?? '') === 'metadata_only';

    const inserted = await sqlClient.begin(async (tx) => {
      const rows = await tx`
        INSERT INTO content.note_authoring_sources (
          job_id, source_document_id, inclusion_state, relevance_score, position,
          added_by, added_at, updated_at
        )
        SELECT
          ${jobId}::uuid, ${sourceId}::uuid, 'included', null,
          COALESCE((SELECT MAX(position) + 1 FROM content.note_authoring_sources WHERE job_id = ${jobId}::uuid), 0),
          ${actorUserId}::uuid, now(), now()
        WHERE NOT EXISTS (
          SELECT 1 FROM content.note_authoring_sources
          WHERE job_id = ${jobId}::uuid AND source_document_id = ${sourceId}::uuid
        )
        RETURNING source_document_id::text AS id
      `;
      if (!rows[0]) return false;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
          'notes_studio.source.reused', 'note_authoring_job', ${jobId}::uuid,
          ${`Reused governed Notes Studio source: ${String(source.title)}`},
          ${JSON.stringify({
            sourceId,
            contentHash: source.contentHash,
            rightsBasis: source.rightsBasis,
            retentionMode: source.retentionMode,
            extractionStatus: source.extractionStatus,
            evidencePath,
            referenceReviewRequired,
            sourceBodyCopied: false,
            historicalReferenceEvidenceTransferred: false,
          })}
        `;
      return true;
    });
    if (inserted) await refreshNotesAuthoringReadiness(jobId, actorUserId);
    res.status(inserted ? 201 : 200).json({
      reused: inserted,
      duplicate: !inserted,
      jobId,
      sourceId,
      evidencePath,
      referenceReviewRequired,
      sourceBodyCopied: false,
      historicalReferenceEvidenceTransferred: false,
      automaticEvidenceAcceptance: false,
      automaticGeneration: false,
      nextAction: referenceReviewRequired
        ? 'Open Reference Evidence and record a fresh target-job factual paraphrase with an exact locator before treating this source as evidence-ready.'
        : null,
    });
  } catch (error) {
    sendError(res, error, 'Unable to reuse Notes Studio source');
  }
});

export default router;
