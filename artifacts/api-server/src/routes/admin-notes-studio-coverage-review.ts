import { randomUUID } from 'node:crypto';
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
import { refreshNotesAuthoringReadiness } from '../notes-studio/readiness';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

class CoverageReviewError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new CoverageReviewError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof CoverageReviewError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'NOTES_STUDIO_COVERAGE_REVIEW_FAILED' });
}

async function ensureJob(jobId: string) {
  const rows = await sqlClient`
    SELECT id::text AS id
    FROM content.note_authoring_jobs
    WHERE id = ${jobId}::uuid
    LIMIT 1
  `;
  if (!rows[0]) throw new CoverageReviewError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
}

async function loadLinks(jobId: string) {
  return sqlClient`
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
}

function reviewLinks(rows: Array<Record<string, unknown>>): CoverageClaimReviewLink[] {
  return rows.map((row) => ({
    claimId: String(row.claimId ?? ''),
    state: String(row.state ?? 'rejected') as CoverageClaimState,
    hasActiveSupport: row.hasActiveSupport === true,
  }));
}

async function loadCoverage(jobId: string) {
  const items = await sqlClient`
    SELECT
      id::text AS id,
      title,
      syllabus_ref AS "syllabusRef",
      priority,
      planned_depth AS "plannedDepth",
      exam_rationale AS "examRationale",
      sort_order AS "sortOrder",
      coverage_review_state AS "coverageReviewState",
      coverage_review_claim_ids AS "coverageReviewClaimIds",
      coverage_reviewed_at AS "coverageReviewedAt",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM content.note_coverage_plan_items
    WHERE job_id = ${jobId}::uuid
    ORDER BY sort_order, created_at
  `;
  const links = await loadLinks(jobId);
  const byItem = new Map<string, Array<Record<string, unknown>>>();
  for (const link of links) {
    const key = String(link.coverageItemId);
    const list = byItem.get(key) ?? [];
    list.push(link as Record<string, unknown>);
    byItem.set(key, list);
  }

  const hydratedItems = items.map((item) => {
    const claimLinks = byItem.get(String(item.id)) ?? [];
    const normalizedLinks = reviewLinks(claimLinks);
    const states = normalizedLinks.map((claim) => claim.hasActiveSupport ? claim.state : 'rejected' as CoverageClaimState);
    const currentClaimKey = coverageAcceptedClaimKey(normalizedLinks);
    const coverageReviewCurrent = String(item.coverageReviewState) === 'confirmed'
      && currentClaimKey.length > 0
      && String(item.coverageReviewClaimIds ?? '') === currentClaimKey;
    return {
      ...item,
      coverageReviewCurrent,
      status: coverageStatusFromEditorialReview(states, coverageReviewCurrent),
      claims: claimLinks,
    };
  });

  return {
    items: hydratedItems,
    summary: {
      itemCount: hydratedItems.length,
      covered: hydratedItems.filter((item) => item.status === 'covered').length,
      partial: hydratedItems.filter((item) => item.status === 'partial').length,
      blocked: hydratedItems.filter((item) => item.status === 'blocked').length,
      uncovered: hydratedItems.filter((item) => item.status === 'uncovered').length,
    },
    coverageRequiresEditorialConfirmation: true,
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

router.use(authenticate);

// Mounted before the legacy evidence router so this governed status reader is authoritative.
router.get('/jobs/:jobId/coverage', requireAdminPermission('content.questions.read'), async (req, res) => {
  try {
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    await ensureJob(jobId);
    res.json(await loadCoverage(jobId));
  } catch (error) {
    sendError(res, error, 'Unable to load editorially reviewed Notes Studio coverage');
  }
});

router.patch('/jobs/:jobId/coverage/:itemId/review', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new CoverageReviewError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    const itemId = uuid(req.params.itemId, 'Coverage item ID');
    await ensureJob(jobId);
    if (!Object.prototype.hasOwnProperty.call(req.body ?? {}, 'confirmed') || typeof req.body?.confirmed !== 'boolean') {
      throw new CoverageReviewError('COVERAGE_REVIEW_DECISION_REQUIRED', 'Set confirmed to true or false.');
    }

    const itemRows = await sqlClient`
      SELECT id::text AS id, title
      FROM content.note_coverage_plan_items
      WHERE job_id = ${jobId}::uuid AND id = ${itemId}::uuid
      LIMIT 1
    `;
    if (!itemRows[0]) throw new CoverageReviewError('COVERAGE_ITEM_NOT_FOUND', 'Coverage item not found.', 404);

    let acceptedClaimKey = '';
    if (req.body.confirmed === true) {
      const links = (await loadLinks(jobId)).filter((row) => String(row.coverageItemId) === itemId) as Array<Record<string, unknown>>;
      const normalizedLinks = reviewLinks(links);
      const activeStates = normalizedLinks.map((link) => link.hasActiveSupport ? link.state : 'rejected' as CoverageClaimState);
      if (activeStates.includes('conflict')) {
        throw new CoverageReviewError('COVERAGE_CONFLICT_BLOCKS_REVIEW', 'Resolve linked conflicts before confirming this coverage target.', 409);
      }
      acceptedClaimKey = coverageAcceptedClaimKey(normalizedLinks);
      if (!acceptedClaimKey) {
        throw new CoverageReviewError('ACCEPTED_COVERAGE_EVIDENCE_REQUIRED', 'Link at least one accepted claim with active supporting evidence before confirming coverage.', 409);
      }
      await sqlClient`
        UPDATE content.note_coverage_plan_items
        SET coverage_review_state = 'confirmed',
            coverage_review_claim_ids = ${acceptedClaimKey},
            coverage_reviewed_by = ${actorUserId}::uuid,
            coverage_reviewed_at = now(),
            updated_by = ${actorUserId}::uuid,
            updated_at = now()
        WHERE job_id = ${jobId}::uuid AND id = ${itemId}::uuid
      `;
    } else {
      await sqlClient`
        UPDATE content.note_coverage_plan_items
        SET coverage_review_state = 'unreviewed',
            coverage_review_claim_ids = '',
            coverage_reviewed_by = NULL,
            coverage_reviewed_at = NULL,
            updated_by = ${actorUserId}::uuid,
            updated_at = now()
        WHERE job_id = ${jobId}::uuid AND id = ${itemId}::uuid
      `;
    }

    await refreshNotesAuthoringReadiness(jobId, actorUserId);
    await audit(
      actorUserId,
      req.body.confirmed ? 'notes_studio.coverage.confirmed' : 'notes_studio.coverage.reopened',
      jobId,
      req.body.confirmed ? 'Confirmed Notes Studio coverage sufficiency after editorial review' : 'Reopened Notes Studio coverage for further evidence review',
      { itemId, acceptedClaimKey, automaticCoverageDecision: false },
    );
    res.json(await loadCoverage(jobId));
  } catch (error) {
    sendError(res, error, 'Unable to update Notes Studio coverage review');
  }
});

export default router;
