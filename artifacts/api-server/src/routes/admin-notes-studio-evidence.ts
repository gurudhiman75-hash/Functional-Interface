import { randomUUID } from 'node:crypto';
import { Router, type IRouter, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';
import {
  buildEvidenceBlocks,
  coverageStatusFromClaimStates,
  noteClaimFingerprint,
  type CoverageClaimState,
} from '../notes-studio/evidence-map';
import { refreshNotesAuthoringReadiness } from '../notes-studio/readiness';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const claimStates = new Set(['candidate', 'accepted', 'rejected', 'conflict']);
const evidenceRelations = new Set(['supports', 'contradicts']);
const coveragePriorities = new Set(['required', 'high', 'supporting', 'exclude']);
const coverageDepths = new Set(['brief', 'standard', 'deep']);
const MAX_CLAIM_EVIDENCE = 20;
const MAX_BLOCKS_PER_SOURCE = 500;

class NotesStudioEvidenceError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new NotesStudioEvidenceError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function optionalConfidence(value: unknown): number | null {
  if (value == null || value === '') return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 1) {
    throw new NotesStudioEvidenceError('INVALID_CONFIDENCE', 'Confidence must be between 0 and 1.');
  }
  return Math.round(parsed * 1000) / 1000;
}

function nonNegativeInteger(value: unknown, fallback = 0): number {
  if (value == null || value === '') return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new NotesStudioEvidenceError('INVALID_SORT_ORDER', 'Sort order must be a non-negative whole number.');
  }
  return parsed;
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof NotesStudioEvidenceError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'NOTES_STUDIO_EVIDENCE_FAILED' });
}

async function ensureJob(jobId: string) {
  const rows = await sqlClient`
    SELECT id::text AS id, title, state
    FROM content.note_authoring_jobs
    WHERE id = ${jobId}::uuid
    LIMIT 1
  `;
  if (!rows[0]) throw new NotesStudioEvidenceError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
  return rows[0];
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

async function loadEvidence(jobId: string) {
  const blocks = await sqlClient`
    SELECT
      block.id::text AS id,
      block.source_document_id::text AS "sourceDocumentId",
      block.block_index AS "blockIndex",
      block.excerpt,
      block.excerpt_hash AS "excerptHash",
      block.char_start AS "charStart",
      block.char_end AS "charEnd",
      block.locator,
      document.title AS "sourceTitle",
      document.publisher AS "sourcePublisher",
      document.source_type AS "sourceType",
      link.inclusion_state AS "inclusionState"
    FROM content.note_source_evidence_blocks block
    JOIN content.source_documents document ON document.id = block.source_document_id
    JOIN content.note_authoring_sources link
      ON link.job_id = block.job_id AND link.source_document_id = block.source_document_id
    WHERE block.job_id = ${jobId}::uuid
    ORDER BY link.position, block.source_document_id, block.block_index
    LIMIT 2500
  `;

  const claims = await sqlClient`
    SELECT
      claim.id::text AS id,
      claim.claim_text AS "claimText",
      claim.claim_hash AS "claimHash",
      claim.state,
      claim.confidence::float8 AS confidence,
      claim.contradiction_key AS "contradictionKey",
      claim.editorial_note AS "editorialNote",
      claim.created_at AS "createdAt",
      claim.updated_at AS "updatedAt",
      COALESCE(
        jsonb_agg(
          jsonb_build_object(
            'blockId', mapping.evidence_block_id::text,
            'relation', mapping.relation,
            'sourceDocumentId', block.source_document_id::text,
            'sourceTitle', document.title,
            'excerpt', block.excerpt,
            'inclusionState', link.inclusion_state
          ) ORDER BY block.source_document_id, block.block_index
        ) FILTER (WHERE mapping.evidence_block_id IS NOT NULL),
        '[]'::jsonb
      ) AS evidence
    FROM content.note_source_claims claim
    LEFT JOIN content.note_source_claim_evidence mapping
      ON mapping.job_id = claim.job_id AND mapping.claim_id = claim.id
    LEFT JOIN content.note_source_evidence_blocks block
      ON block.job_id = mapping.job_id AND block.id = mapping.evidence_block_id
    LEFT JOIN content.source_documents document ON document.id = block.source_document_id
    LEFT JOIN content.note_authoring_sources link
      ON link.job_id = block.job_id AND link.source_document_id = block.source_document_id
    WHERE claim.job_id = ${jobId}::uuid
    GROUP BY claim.id
    ORDER BY claim.updated_at DESC, claim.created_at DESC
  `;

  const summary = {
    blockCount: blocks.length,
    activeBlockCount: blocks.filter((row) => row.inclusionState === 'included').length,
    claimCount: claims.length,
    candidateClaims: claims.filter((row) => row.state === 'candidate').length,
    acceptedClaims: claims.filter((row) => row.state === 'accepted').length,
    conflictClaims: claims.filter((row) => row.state === 'conflict').length,
  };
  return { blocks, claims, summary };
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
      created_at AS "createdAt",
      updated_at AS "updatedAt"
    FROM content.note_coverage_plan_items
    WHERE job_id = ${jobId}::uuid
    ORDER BY sort_order, created_at
  `;
  const links = await sqlClient`
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

  const byItem = new Map<string, Array<Record<string, unknown>>>();
  for (const link of links) {
    const key = String(link.coverageItemId);
    const list = byItem.get(key) ?? [];
    list.push(link as Record<string, unknown>);
    byItem.set(key, list);
  }
  const hydratedItems = items.map((item) => {
    const claimLinks = byItem.get(String(item.id)) ?? [];
    const states = claimLinks.map((claim) =>
      claim.hasActiveSupport ? String(claim.state) as CoverageClaimState : 'rejected' as CoverageClaimState,
    );
    return { ...item, status: coverageStatusFromClaimStates(states), claims: claimLinks };
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
  };
}

router.use(authenticate);

router.get('/jobs/:jobId/evidence', requireAdminPermission('content.questions.read'), async (req, res) => {
  try {
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    await ensureJob(jobId);
    res.json(await loadEvidence(jobId));
  } catch (error) {
    sendError(res, error, 'Unable to load Notes Studio evidence map');
  }
});

router.post('/jobs/:jobId/evidence/rebuild', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new NotesStudioEvidenceError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    await ensureJob(jobId);
    const sources = await sqlClient`
      SELECT document.id::text AS id, document.title, document.extracted_text AS "extractedText"
      FROM content.note_authoring_sources link
      JOIN content.source_documents document ON document.id = link.source_document_id
      WHERE link.job_id = ${jobId}::uuid
        AND link.inclusion_state = 'included'
        AND document.retention_mode = 'extracted_text'
        AND document.extraction_status = 'processed'
        AND LENGTH(COALESCE(document.extracted_text, '')) >= 100
      ORDER BY link.position, link.added_at
    `;
    if (sources.length === 0) {
      throw new NotesStudioEvidenceError(
        'NO_EXTRACTABLE_SOURCES',
        'Add at least one included source whose rights policy permits extracted-text retention before building evidence.',
        409,
      );
    }

    let created = 0;
    let seen = 0;
    for (const source of sources) {
      const extractedText = typeof source.extractedText === 'string' ? source.extractedText : '';
      const blocks = buildEvidenceBlocks(extractedText, { maxBlocks: MAX_BLOCKS_PER_SOURCE });
      seen += blocks.length;
      for (const block of blocks) {
        const rows = await sqlClient`
          INSERT INTO content.note_source_evidence_blocks (
            id, job_id, source_document_id, block_index, excerpt, excerpt_hash,
            char_start, char_end, locator, created_at
          ) VALUES (
            ${randomUUID()}::uuid, ${jobId}::uuid, ${String(source.id)}::uuid,
            ${block.blockIndex}, ${block.excerpt}, ${block.excerptHash},
            ${block.charStart}, ${block.charEnd}, ${JSON.stringify(block.locator)}, now()
          )
          ON CONFLICT (job_id, source_document_id, excerpt_hash) DO NOTHING
          RETURNING id::text AS id
        `;
        if (rows[0]) created += 1;
      }
    }
    await refreshNotesAuthoringReadiness(jobId, actorUserId);
    await audit(actorUserId, 'notes_studio.evidence.rebuilt', jobId, 'Built Notes Studio evidence index from included extractable sources', {
      sourceCount: sources.length,
      blocksSeen: seen,
      blocksCreated: created,
      maxBlocksPerSource: MAX_BLOCKS_PER_SOURCE,
    });
    res.json({ ...(await loadEvidence(jobId)), sourceCount: sources.length, blocksSeen: seen, blocksCreated: created });
  } catch (error) {
    sendError(res, error, 'Unable to build Notes Studio evidence index');
  }
});

router.post('/jobs/:jobId/claims', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new NotesStudioEvidenceError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    await ensureJob(jobId);
    const claimText = text(req.body?.claimText, 1200);
    if (claimText.length < 5) throw new NotesStudioEvidenceError('CLAIM_TEXT_REQUIRED', 'Write an atomic factual claim.');
    const confidence = optionalConfidence(req.body?.confidence);
    const contradictionKey = text(req.body?.contradictionKey, 240) || null;
    const evidenceInput = Array.isArray(req.body?.evidence) ? req.body.evidence : [];
    if (evidenceInput.length < 1 || evidenceInput.length > MAX_CLAIM_EVIDENCE) {
      throw new NotesStudioEvidenceError('CLAIM_EVIDENCE_REQUIRED', `Choose 1-${MAX_CLAIM_EVIDENCE} evidence blocks for this claim.`);
    }
    const evidence = evidenceInput.map((item: unknown) => {
      const record = item && typeof item === 'object' ? item as Record<string, unknown> : {};
      const blockId = uuid(record.blockId, 'Evidence block ID');
      const relation = text(record.relation, 20).toLowerCase() || 'supports';
      if (!evidenceRelations.has(relation)) throw new NotesStudioEvidenceError('INVALID_EVIDENCE_RELATION', 'Evidence relation must support or contradict the claim.');
      return { blockId, relation };
    });
    if (!evidence.some((item) => item.relation === 'supports')) {
      throw new NotesStudioEvidenceError('SUPPORTING_EVIDENCE_REQUIRED', 'A claim needs at least one supporting evidence block.');
    }
    const uniqueBlockIds = [...new Set(evidence.map((item) => item.blockId))];
    const blockRows = await sqlClient`
      SELECT block.id::text AS id
      FROM content.note_source_evidence_blocks block
      JOIN content.note_authoring_sources link
        ON link.job_id = block.job_id AND link.source_document_id = block.source_document_id
      WHERE block.job_id = ${jobId}::uuid
        AND block.id = ANY(${uniqueBlockIds}::uuid[])
        AND link.inclusion_state = 'included'
    `;
    if (blockRows.length !== uniqueBlockIds.length) {
      throw new NotesStudioEvidenceError('EVIDENCE_UNAVAILABLE', 'One or more evidence blocks are not active in this source pack.', 409);
    }

    const claimHash = noteClaimFingerprint(claimText);
    const duplicate = await sqlClient`
      SELECT id::text AS id FROM content.note_source_claims
      WHERE job_id = ${jobId}::uuid AND claim_hash = ${claimHash}
      LIMIT 1
    `;
    if (duplicate[0]) throw new NotesStudioEvidenceError('DUPLICATE_CLAIM', 'An equivalent claim already exists in this evidence map.', 409);

    const claimId = randomUUID();
    await sqlClient.begin(async (tx) => {
      await tx`
        INSERT INTO content.note_source_claims (
          id, job_id, claim_text, claim_hash, state, confidence, contradiction_key,
          editorial_note, created_by, updated_by, created_at, updated_at
        ) VALUES (
          ${claimId}::uuid, ${jobId}::uuid, ${claimText}, ${claimHash}, 'candidate',
          ${confidence}, ${contradictionKey}, '', ${actorUserId}::uuid, ${actorUserId}::uuid, now(), now()
        )
      `;
      for (const item of evidence) {
        await tx`
          INSERT INTO content.note_source_claim_evidence (
            job_id, claim_id, evidence_block_id, relation, created_by, created_at
          ) VALUES (
            ${jobId}::uuid, ${claimId}::uuid, ${item.blockId}::uuid,
            ${item.relation}, ${actorUserId}::uuid, now()
          )
        `;
      }
    });
    await refreshNotesAuthoringReadiness(jobId, actorUserId);
    await audit(actorUserId, 'notes_studio.claim.created', jobId, 'Created an evidence-grounded Notes Studio claim', {
      claimId, claimHash, evidenceCount: evidence.length, confidence,
    });
    res.status(201).json({ claimId, ...(await loadEvidence(jobId)) });
  } catch (error) {
    sendError(res, error, 'Unable to create Notes Studio claim');
  }
});

router.patch('/jobs/:jobId/claims/:claimId', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new NotesStudioEvidenceError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    const claimId = uuid(req.params.claimId, 'Claim ID');
    await ensureJob(jobId);
    const state = text(req.body?.state, 20).toLowerCase();
    if (state && !claimStates.has(state)) throw new NotesStudioEvidenceError('INVALID_CLAIM_STATE', 'Choose candidate, accepted, rejected or conflict.');
    const confidenceProvided = Object.prototype.hasOwnProperty.call(req.body ?? {}, 'confidence');
    const confidence = confidenceProvided ? optionalConfidence(req.body?.confidence) : undefined;
    const noteProvided = Object.prototype.hasOwnProperty.call(req.body ?? {}, 'editorialNote');
    const editorialNote = noteProvided ? text(req.body?.editorialNote, 3000) : undefined;
    const contradictionProvided = Object.prototype.hasOwnProperty.call(req.body ?? {}, 'contradictionKey');
    const contradictionKey = contradictionProvided ? text(req.body?.contradictionKey, 240) || null : undefined;

    if (state === 'accepted') {
      const support = await sqlClient`
        SELECT 1
        FROM content.note_source_claim_evidence mapping
        JOIN content.note_source_evidence_blocks block
          ON block.job_id = mapping.job_id AND block.id = mapping.evidence_block_id
        JOIN content.note_authoring_sources link
          ON link.job_id = block.job_id AND link.source_document_id = block.source_document_id
        WHERE mapping.job_id = ${jobId}::uuid
          AND mapping.claim_id = ${claimId}::uuid
          AND mapping.relation = 'supports'
          AND link.inclusion_state = 'included'
        LIMIT 1
      `;
      if (!support[0]) throw new NotesStudioEvidenceError('ACTIVE_SUPPORT_REQUIRED', 'Accepting a claim requires active supporting evidence.', 409);
    }

    const rows = await sqlClient`
      UPDATE content.note_source_claims
      SET state = COALESCE(${state || null}, state),
          confidence = CASE WHEN ${confidenceProvided} THEN ${confidence ?? null} ELSE confidence END,
          editorial_note = CASE WHEN ${noteProvided} THEN ${editorialNote ?? ''} ELSE editorial_note END,
          contradiction_key = CASE WHEN ${contradictionProvided} THEN ${contradictionKey ?? null} ELSE contradiction_key END,
          updated_by = ${actorUserId}::uuid,
          updated_at = now()
      WHERE job_id = ${jobId}::uuid AND id = ${claimId}::uuid
      RETURNING id::text AS id, state
    `;
    if (!rows[0]) throw new NotesStudioEvidenceError('CLAIM_NOT_FOUND', 'Claim not found in this authoring job.', 404);
    await refreshNotesAuthoringReadiness(jobId, actorUserId);
    await audit(actorUserId, 'notes_studio.claim.updated', jobId, 'Updated Notes Studio claim review state', {
      claimId, state: rows[0].state,
    });
    res.json(await loadEvidence(jobId));
  } catch (error) {
    sendError(res, error, 'Unable to update Notes Studio claim');
  }
});

router.get('/jobs/:jobId/coverage', requireAdminPermission('content.questions.read'), async (req, res) => {
  try {
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    await ensureJob(jobId);
    res.json(await loadCoverage(jobId));
  } catch (error) {
    sendError(res, error, 'Unable to load Notes Studio coverage plan');
  }
});

router.post('/jobs/:jobId/coverage', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new NotesStudioEvidenceError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    await ensureJob(jobId);
    const title = text(req.body?.title, 300);
    const syllabusRef = text(req.body?.syllabusRef, 500);
    const priority = text(req.body?.priority, 20).toLowerCase() || 'required';
    const plannedDepth = text(req.body?.plannedDepth, 20).toLowerCase() || 'standard';
    const examRationale = text(req.body?.examRationale, 2000);
    const sortOrder = nonNegativeInteger(req.body?.sortOrder, 0);
    if (title.length < 2) throw new NotesStudioEvidenceError('COVERAGE_TITLE_REQUIRED', 'Name the syllabus concept or coverage target.');
    if (!coveragePriorities.has(priority)) throw new NotesStudioEvidenceError('INVALID_COVERAGE_PRIORITY', 'Choose required, high, supporting or exclude.');
    if (!coverageDepths.has(plannedDepth)) throw new NotesStudioEvidenceError('INVALID_COVERAGE_DEPTH', 'Choose brief, standard or deep.');
    const itemId = randomUUID();
    await sqlClient`
      INSERT INTO content.note_coverage_plan_items (
        id, job_id, title, syllabus_ref, priority, planned_depth, exam_rationale,
        sort_order, created_by, updated_by, created_at, updated_at
      ) VALUES (
        ${itemId}::uuid, ${jobId}::uuid, ${title}, ${syllabusRef}, ${priority},
        ${plannedDepth}, ${examRationale}, ${sortOrder}, ${actorUserId}::uuid,
        ${actorUserId}::uuid, now(), now()
      )
    `;
    await refreshNotesAuthoringReadiness(jobId, actorUserId);
    await audit(actorUserId, 'notes_studio.coverage.created', jobId, 'Added Notes Studio coverage-plan item', { itemId, priority, plannedDepth });
    res.status(201).json({ itemId, ...(await loadCoverage(jobId)) });
  } catch (error) {
    sendError(res, error, 'Unable to add Notes Studio coverage item');
  }
});

router.patch('/jobs/:jobId/coverage/:itemId', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new NotesStudioEvidenceError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    const itemId = uuid(req.params.itemId, 'Coverage item ID');
    await ensureJob(jobId);
    const titleProvided = Object.prototype.hasOwnProperty.call(req.body ?? {}, 'title');
    const title = titleProvided ? text(req.body?.title, 300) : undefined;
    const syllabusProvided = Object.prototype.hasOwnProperty.call(req.body ?? {}, 'syllabusRef');
    const syllabusRef = syllabusProvided ? text(req.body?.syllabusRef, 500) : undefined;
    const priorityProvided = Object.prototype.hasOwnProperty.call(req.body ?? {}, 'priority');
    const priority = priorityProvided ? text(req.body?.priority, 20).toLowerCase() : undefined;
    const depthProvided = Object.prototype.hasOwnProperty.call(req.body ?? {}, 'plannedDepth');
    const plannedDepth = depthProvided ? text(req.body?.plannedDepth, 20).toLowerCase() : undefined;
    const rationaleProvided = Object.prototype.hasOwnProperty.call(req.body ?? {}, 'examRationale');
    const examRationale = rationaleProvided ? text(req.body?.examRationale, 2000) : undefined;
    const orderProvided = Object.prototype.hasOwnProperty.call(req.body ?? {}, 'sortOrder');
    const sortOrder = orderProvided ? nonNegativeInteger(req.body?.sortOrder) : undefined;
    if (titleProvided && (!title || title.length < 2)) throw new NotesStudioEvidenceError('COVERAGE_TITLE_REQUIRED', 'Coverage title must contain at least two characters.');
    if (priorityProvided && (!priority || !coveragePriorities.has(priority))) throw new NotesStudioEvidenceError('INVALID_COVERAGE_PRIORITY', 'Choose required, high, supporting or exclude.');
    if (depthProvided && (!plannedDepth || !coverageDepths.has(plannedDepth))) throw new NotesStudioEvidenceError('INVALID_COVERAGE_DEPTH', 'Choose brief, standard or deep.');

    const rows = await sqlClient`
      UPDATE content.note_coverage_plan_items
      SET title = CASE WHEN ${titleProvided} THEN ${title ?? ''} ELSE title END,
          syllabus_ref = CASE WHEN ${syllabusProvided} THEN ${syllabusRef ?? ''} ELSE syllabus_ref END,
          priority = CASE WHEN ${priorityProvided} THEN ${priority ?? 'required'} ELSE priority END,
          planned_depth = CASE WHEN ${depthProvided} THEN ${plannedDepth ?? 'standard'} ELSE planned_depth END,
          exam_rationale = CASE WHEN ${rationaleProvided} THEN ${examRationale ?? ''} ELSE exam_rationale END,
          sort_order = CASE WHEN ${orderProvided} THEN ${sortOrder ?? 0} ELSE sort_order END,
          updated_by = ${actorUserId}::uuid,
          updated_at = now()
      WHERE job_id = ${jobId}::uuid AND id = ${itemId}::uuid
      RETURNING id::text AS id
    `;
    if (!rows[0]) throw new NotesStudioEvidenceError('COVERAGE_ITEM_NOT_FOUND', 'Coverage item not found.', 404);
    await refreshNotesAuthoringReadiness(jobId, actorUserId);
    await audit(actorUserId, 'notes_studio.coverage.updated', jobId, 'Updated Notes Studio coverage-plan item', { itemId });
    res.json(await loadCoverage(jobId));
  } catch (error) {
    sendError(res, error, 'Unable to update Notes Studio coverage item');
  }
});

router.delete('/jobs/:jobId/coverage/:itemId', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new NotesStudioEvidenceError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    const itemId = uuid(req.params.itemId, 'Coverage item ID');
    await ensureJob(jobId);
    const rows = await sqlClient`
      DELETE FROM content.note_coverage_plan_items
      WHERE job_id = ${jobId}::uuid AND id = ${itemId}::uuid
      RETURNING id::text AS id
    `;
    if (!rows[0]) throw new NotesStudioEvidenceError('COVERAGE_ITEM_NOT_FOUND', 'Coverage item not found.', 404);
    await refreshNotesAuthoringReadiness(jobId, actorUserId);
    await audit(actorUserId, 'notes_studio.coverage.deleted', jobId, 'Removed Notes Studio coverage-plan item', { itemId });
    res.json(await loadCoverage(jobId));
  } catch (error) {
    sendError(res, error, 'Unable to remove Notes Studio coverage item');
  }
});

router.post('/jobs/:jobId/coverage/:itemId/claims/:claimId', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new NotesStudioEvidenceError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    const itemId = uuid(req.params.itemId, 'Coverage item ID');
    const claimId = uuid(req.params.claimId, 'Claim ID');
    await ensureJob(jobId);
    const entities = await sqlClient`
      SELECT
        EXISTS(SELECT 1 FROM content.note_coverage_plan_items WHERE job_id = ${jobId}::uuid AND id = ${itemId}::uuid) AS "itemExists",
        EXISTS(SELECT 1 FROM content.note_source_claims WHERE job_id = ${jobId}::uuid AND id = ${claimId}::uuid) AS "claimExists"
    `;
    if (!entities[0]?.itemExists) throw new NotesStudioEvidenceError('COVERAGE_ITEM_NOT_FOUND', 'Coverage item not found.', 404);
    if (!entities[0]?.claimExists) throw new NotesStudioEvidenceError('CLAIM_NOT_FOUND', 'Claim not found.', 404);
    await sqlClient`
      INSERT INTO content.note_coverage_item_claims (job_id, coverage_item_id, claim_id, created_by, created_at)
      VALUES (${jobId}::uuid, ${itemId}::uuid, ${claimId}::uuid, ${actorUserId}::uuid, now())
      ON CONFLICT (coverage_item_id, claim_id) DO NOTHING
    `;
    await refreshNotesAuthoringReadiness(jobId, actorUserId);
    await audit(actorUserId, 'notes_studio.coverage.claim_linked', jobId, 'Linked a Notes Studio claim to the coverage plan', { itemId, claimId });
    res.json(await loadCoverage(jobId));
  } catch (error) {
    sendError(res, error, 'Unable to link Notes Studio claim to coverage');
  }
});

router.delete('/jobs/:jobId/coverage/:itemId/claims/:claimId', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new NotesStudioEvidenceError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    const itemId = uuid(req.params.itemId, 'Coverage item ID');
    const claimId = uuid(req.params.claimId, 'Claim ID');
    await ensureJob(jobId);
    await sqlClient`
      DELETE FROM content.note_coverage_item_claims
      WHERE job_id = ${jobId}::uuid AND coverage_item_id = ${itemId}::uuid AND claim_id = ${claimId}::uuid
    `;
    await refreshNotesAuthoringReadiness(jobId, actorUserId);
    await audit(actorUserId, 'notes_studio.coverage.claim_unlinked', jobId, 'Unlinked a Notes Studio claim from the coverage plan', { itemId, claimId });
    res.json(await loadCoverage(jobId));
  } catch (error) {
    sendError(res, error, 'Unable to unlink Notes Studio claim from coverage');
  }
});

export default router;
