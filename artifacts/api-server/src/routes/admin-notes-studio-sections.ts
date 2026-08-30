import { createHash, randomUUID } from 'node:crypto';
import { Router, type IRouter, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';
import {
  NOTES_SECTION_PROMPT_VERSION,
  collectGeneratedClaimIds,
  renderGeneratedSection,
  synthesisInputFingerprint,
  synthesisOutputFingerprint,
  type SectionSynthesisInput,
} from '../notes-studio/section-synthesis';
import {
  NotesStudioModelConfigurationError,
  generateNotesSection,
} from '../notes-studio/section-synthesis-provider';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const editableSectionStates = new Set(['draft', 'needs_editorial']);

class NotesStudioSectionError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new NotesStudioSectionError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function outputHash(markdown: string): string {
  return createHash('sha256').update(markdown.normalize('NFC').trim()).digest('hex');
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof NotesStudioSectionError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  if (error instanceof NotesStudioModelConfigurationError) {
    res.status(503).json({ error: error.message, code: 'NOTES_STUDIO_MODEL_NOT_CONFIGURED' });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'NOTES_STUDIO_SECTION_SYNTHESIS_FAILED' });
}

async function loadJob(jobId: string) {
  const rows = await sqlClient`
    SELECT id::text AS id, title, source_language AS "sourceLanguage", state, brief
    FROM content.note_authoring_jobs
    WHERE id = ${jobId}::uuid
    LIMIT 1
  `;
  if (!rows[0]) throw new NotesStudioSectionError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
  return rows[0] as Record<string, unknown>;
}

async function activeConflicts(jobId: string) {
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

async function loadCoverageSynthesisInput(jobId: string, coverageItemId: string): Promise<SectionSynthesisInput> {
  const job = await loadJob(jobId);
  const items = await sqlClient`
    SELECT
      id::text AS id,
      title,
      syllabus_ref AS "syllabusRef",
      priority,
      planned_depth AS "plannedDepth",
      exam_rationale AS "examRationale"
    FROM content.note_coverage_plan_items
    WHERE job_id = ${jobId}::uuid AND id = ${coverageItemId}::uuid
    LIMIT 1
  `;
  const coverage = items[0] as Record<string, unknown> | undefined;
  if (!coverage) throw new NotesStudioSectionError('COVERAGE_ITEM_NOT_FOUND', 'Coverage target not found.', 404);
  if (coverage.priority === 'exclude') {
    throw new NotesStudioSectionError('COVERAGE_EXCLUDED', 'Excluded coverage targets cannot be synthesized.', 409);
  }

  const claims = await sqlClient`
    SELECT DISTINCT claim.id::text AS id, claim.claim_text AS text
    FROM content.note_coverage_item_claims coverage_claim
    JOIN content.note_source_claims claim
      ON claim.job_id = coverage_claim.job_id AND claim.id = coverage_claim.claim_id
    WHERE coverage_claim.job_id = ${jobId}::uuid
      AND coverage_claim.coverage_item_id = ${coverageItemId}::uuid
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
    ORDER BY claim.id::text
  `;
  if (claims.length === 0) {
    throw new NotesStudioSectionError('COVERAGE_NOT_GROUNDED', 'This coverage target has no accepted claim with active supporting evidence.', 409);
  }

  const brief = job.brief && typeof job.brief === 'object' ? job.brief as Record<string, unknown> : {};
  const noteTitle = text(job.title, 300) || text(brief.topicLabel, 300) || 'Exam note';
  return {
    jobId,
    languageCode: text(job.sourceLanguage, 16) || 'en',
    noteTitle,
    coverageItem: {
      id: String(coverage.id),
      title: String(coverage.title),
      syllabusRef: String(coverage.syllabusRef ?? ''),
      priority: String(coverage.priority),
      plannedDepth: String(coverage.plannedDepth),
      examRationale: String(coverage.examRationale ?? ''),
    },
    claims: claims.map((claim) => ({ id: String(claim.id), text: String(claim.text) })),
  };
}

async function loadSections(jobId: string) {
  const rows = await sqlClient`
    SELECT
      section.id::text AS id,
      section.coverage_item_id::text AS "coverageItemId",
      coverage.title AS "coverageTitle",
      coverage.priority,
      coverage.planned_depth AS "plannedDepth",
      section.title,
      section.sort_order AS "sortOrder",
      section.state,
      section.markdown,
      section.input_fingerprint AS "inputFingerprint",
      section.output_fingerprint AS "outputFingerprint",
      section.prompt_version AS "promptVersion",
      section.provider,
      section.model,
      section.generation_metadata AS "generationMetadata",
      section.created_at AS "createdAt",
      section.updated_at AS "updatedAt",
      COALESCE(
        jsonb_agg(DISTINCT jsonb_build_object('id', claim.id::text, 'text', claim.claim_text))
          FILTER (WHERE claim.id IS NOT NULL),
        '[]'::jsonb
      ) AS claims
    FROM content.note_sections section
    JOIN content.note_coverage_plan_items coverage
      ON coverage.job_id = section.job_id AND coverage.id = section.coverage_item_id
    LEFT JOIN content.note_section_claims section_claim
      ON section_claim.job_id = section.job_id AND section_claim.section_id = section.id
    LEFT JOIN content.note_source_claims claim
      ON claim.job_id = section_claim.job_id AND claim.id = section_claim.claim_id
    WHERE section.job_id = ${jobId}::uuid
    GROUP BY section.id, coverage.id
    ORDER BY section.sort_order, section.created_at
  `;
  const coverageRows = await sqlClient`
    SELECT id::text AS id, title, priority, planned_depth AS "plannedDepth", sort_order AS "sortOrder"
    FROM content.note_coverage_plan_items
    WHERE job_id = ${jobId}::uuid AND priority <> 'exclude'
    ORDER BY sort_order, created_at
  `;
  return {
    sections: rows,
    coverage: coverageRows,
    summary: {
      sectionCount: rows.length,
      needsEditorial: rows.filter((row) => row.state === 'needs_editorial').length,
      draftCount: rows.filter((row) => row.state === 'draft').length,
      acceptedCount: rows.filter((row) => row.state === 'accepted').length,
      coverageCount: coverageRows.length,
    },
    model: {
      provider: 'openai',
      configured: Boolean(String(process.env.NOTES_STUDIO_MODEL ?? '').trim() && String(process.env.NOTES_STUDIO_OPENAI_API_KEY ?? process.env.OPENAI_API_KEY ?? '').trim()),
      model: String(process.env.NOTES_STUDIO_MODEL ?? '').trim() || null,
      promptVersion: NOTES_SECTION_PROMPT_VERSION,
    },
  };
}

async function refreshSectionReadiness(jobId: string, actorUserId: string) {
  const conflictCount = await activeConflicts(jobId);
  if (conflictCount > 0) {
    await sqlClient`
      UPDATE content.note_authoring_jobs
      SET state = 'evidence_ready', updated_by = ${actorUserId}::uuid, updated_at = now()
      WHERE id = ${jobId}::uuid AND state IN ('outline_ready', 'drafting', 'qa_required')
    `;
    return 'evidence_ready';
  }
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
                AND section.state IN ('draft', 'needs_editorial', 'accepted')
                AND LENGTH(section.markdown) > 0
            )
        )::int AS core_drafted
      FROM content.note_coverage_plan_items coverage
      WHERE coverage.job_id = ${jobId}::uuid
    )
    UPDATE content.note_authoring_jobs job
    SET state = CASE
      WHEN progress.core_count > 0 AND progress.core_count = progress.core_drafted THEN 'qa_required'
      ELSE 'drafting'
    END,
    updated_by = ${actorUserId}::uuid,
    updated_at = now()
    FROM progress
    WHERE job.id = ${jobId}::uuid
      AND job.state IN ('outline_ready', 'drafting', 'qa_required')
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

router.use(authenticate);

router.get('/jobs/:jobId/sections', requireAdminPermission('content.questions.read'), async (req, res) => {
  try {
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    await loadJob(jobId);
    res.json(await loadSections(jobId));
  } catch (error) {
    sendError(res, error, 'Unable to load Notes Studio sections');
  }
});

router.post('/jobs/:jobId/coverage/:coverageItemId/section/generate', requireAdminPermission('content.questions.update'), async (req, res) => {
  const actorUserId = req.adminSession?.user.id;
  let generationEventId: string | null = null;
  try {
    if (!actorUserId) throw new NotesStudioSectionError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    const coverageItemId = uuid(req.params.coverageItemId, 'Coverage item ID');
    const job = await loadJob(jobId);
    if (!['outline_ready', 'drafting', 'qa_required'].includes(String(job.state))) {
      throw new NotesStudioSectionError('SYNTHESIS_NOT_READY', 'Resolve evidence and required/high coverage before section synthesis.', 409);
    }
    if (await activeConflicts(jobId)) {
      throw new NotesStudioSectionError('ACTIVE_EVIDENCE_CONFLICT', 'Resolve active evidence conflicts before section synthesis.', 409);
    }
    const input = await loadCoverageSynthesisInput(jobId, coverageItemId);
    const inputFingerprint = synthesisInputFingerprint(input);
    generationEventId = randomUUID();
    const provider = 'openai';
    const configuredModel = String(process.env.NOTES_STUDIO_MODEL ?? '').trim() || 'unconfigured';
    await sqlClient`
      INSERT INTO content.note_generation_events (
        id, job_id, coverage_item_id, provider, model, prompt_version,
        input_fingerprint, status, metadata, created_by, created_at
      ) VALUES (
        ${generationEventId}::uuid, ${jobId}::uuid, ${coverageItemId}::uuid,
        ${provider}, ${configuredModel}, ${NOTES_SECTION_PROMPT_VERSION}, ${inputFingerprint},
        'started', ${JSON.stringify({ claimCount: input.claims.length, rawSourceTextSent: false })},
        ${actorUserId}::uuid, now()
      )
    `;

    const generated = await generateNotesSection(input);
    const markdown = renderGeneratedSection(generated.section);
    const outputFingerprint = synthesisOutputFingerprint(generated.section);
    const usedClaimIds = collectGeneratedClaimIds(generated.section);
    const sectionId = randomUUID();
    const sectionRows = await sqlClient.begin(async (tx) => {
      const rows = await tx`
        INSERT INTO content.note_sections (
          id, job_id, coverage_item_id, title, sort_order, state, markdown,
          input_fingerprint, output_fingerprint, prompt_version, provider, model,
          generation_metadata, created_by, updated_by, created_at, updated_at
        )
        SELECT
          ${sectionId}::uuid, ${jobId}::uuid, coverage.id, ${generated.section.title}, coverage.sort_order,
          'draft', ${markdown}, ${inputFingerprint}, ${outputFingerprint}, ${NOTES_SECTION_PROMPT_VERSION},
          ${generated.provider}, ${generated.model},
          ${JSON.stringify({ responseId: generated.responseId, usage: generated.usage, claimCount: usedClaimIds.length, rawSourceTextSent: false })},
          ${actorUserId}::uuid, ${actorUserId}::uuid, now(), now()
        FROM content.note_coverage_plan_items coverage
        WHERE coverage.job_id = ${jobId}::uuid AND coverage.id = ${coverageItemId}::uuid
        ON CONFLICT (job_id, coverage_item_id) DO UPDATE
        SET title = EXCLUDED.title,
            state = 'draft',
            markdown = EXCLUDED.markdown,
            input_fingerprint = EXCLUDED.input_fingerprint,
            output_fingerprint = EXCLUDED.output_fingerprint,
            prompt_version = EXCLUDED.prompt_version,
            provider = EXCLUDED.provider,
            model = EXCLUDED.model,
            generation_metadata = EXCLUDED.generation_metadata,
            updated_by = EXCLUDED.updated_by,
            updated_at = now()
        RETURNING id::text AS id
      `;
      const persistedSectionId = String(rows[0]?.id ?? sectionId);
      await tx`DELETE FROM content.note_section_claims WHERE job_id = ${jobId}::uuid AND section_id = ${persistedSectionId}::uuid`;
      await tx`DELETE FROM content.note_section_blocks WHERE job_id = ${jobId}::uuid AND section_id = ${persistedSectionId}::uuid`;
      for (const [position, claimId] of usedClaimIds.entries()) {
        await tx`
          INSERT INTO content.note_section_claims (job_id, section_id, claim_id, position, role, created_at)
          VALUES (${jobId}::uuid, ${persistedSectionId}::uuid, ${claimId}::uuid, ${position}, 'core', now())
        `;
      }
      for (const [blockIndex, block] of generated.section.blocks.entries()) {
        await tx`
          INSERT INTO content.note_section_blocks (
            id, job_id, section_id, block_index, kind, markdown, claim_ids, created_at
          ) VALUES (
            ${randomUUID()}::uuid, ${jobId}::uuid, ${persistedSectionId}::uuid, ${blockIndex},
            ${block.kind}, ${block.markdown}, ${JSON.stringify(block.claimIds)}, now()
          )
        `;
      }
      await tx`
        UPDATE content.note_generation_events
        SET section_id = ${persistedSectionId}::uuid,
            model = ${generated.model},
            output_fingerprint = ${outputFingerprint},
            status = 'succeeded',
            metadata = ${JSON.stringify({ responseId: generated.responseId, usage: generated.usage, claimCount: usedClaimIds.length, blockCount: generated.section.blocks.length, rawSourceTextSent: false })},
            finished_at = now()
        WHERE id = ${generationEventId}::uuid
      `;
      return rows;
    });
    const persistedSectionId = String(sectionRows[0]?.id ?? sectionId);
    const jobState = await refreshSectionReadiness(jobId, actorUserId);
    await audit(actorUserId, 'notes_studio.section.generated', jobId, 'Generated a claim-grounded Notes Studio section draft', {
      sectionId: persistedSectionId,
      coverageItemId,
      provider: generated.provider,
      model: generated.model,
      promptVersion: NOTES_SECTION_PROMPT_VERSION,
      inputFingerprint,
      outputFingerprint,
      claimCount: usedClaimIds.length,
      rawSourceTextSent: false,
      learnerPublished: false,
    });
    res.status(201).json({ sectionId: persistedSectionId, jobState, ...(await loadSections(jobId)) });
  } catch (error) {
    if (generationEventId) {
      const errorCode = error instanceof NotesStudioModelConfigurationError
        ? 'NOTES_STUDIO_MODEL_NOT_CONFIGURED'
        : error instanceof NotesStudioSectionError
          ? error.code
          : 'MODEL_GENERATION_FAILED';
      const message = error instanceof Error ? error.message.slice(0, 1000) : 'Unknown section synthesis failure';
      try {
        await sqlClient`
          UPDATE content.note_generation_events
          SET status = 'failed', error_code = ${errorCode}, error_message = ${message}, finished_at = now()
          WHERE id = ${generationEventId}::uuid
        `;
      } catch (ledgerError) {
        console.error('Unable to mark Notes Studio generation event failed', ledgerError);
      }
    }
    sendError(res, error, 'Unable to generate Notes Studio section');
  }
});

router.patch('/jobs/:jobId/sections/:sectionId', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new NotesStudioSectionError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    const sectionId = uuid(req.params.sectionId, 'Section ID');
    await loadJob(jobId);
    const markdownProvided = Object.prototype.hasOwnProperty.call(req.body ?? {}, 'markdown');
    const markdown = markdownProvided ? text(req.body?.markdown, 30000) : undefined;
    const titleProvided = Object.prototype.hasOwnProperty.call(req.body ?? {}, 'title');
    const title = titleProvided ? text(req.body?.title, 300) : undefined;
    const stateProvided = Object.prototype.hasOwnProperty.call(req.body ?? {}, 'state');
    const state = stateProvided ? text(req.body?.state, 30).toLowerCase() : undefined;
    if (markdownProvided && !markdown) throw new NotesStudioSectionError('SECTION_MARKDOWN_REQUIRED', 'Section markdown cannot be empty.');
    if (titleProvided && (!title || title.length < 2)) throw new NotesStudioSectionError('SECTION_TITLE_REQUIRED', 'Section title is too short.');
    if (stateProvided && (!state || !editableSectionStates.has(state))) {
      throw new NotesStudioSectionError('SECTION_STATE_LOCKED', 'NS-004 sections can be draft or needs_editorial. Acceptance opens only after the quality-gate checkpoint.', 409);
    }
    const nextHash = markdownProvided ? outputHash(markdown ?? '') : null;
    const rows = await sqlClient`
      UPDATE content.note_sections
      SET title = CASE WHEN ${titleProvided} THEN ${title ?? ''} ELSE title END,
          markdown = CASE WHEN ${markdownProvided} THEN ${markdown ?? ''} ELSE markdown END,
          output_fingerprint = CASE WHEN ${markdownProvided} THEN ${nextHash ?? outputHash('')} ELSE output_fingerprint END,
          state = CASE
            WHEN ${markdownProvided} THEN 'needs_editorial'
            WHEN ${stateProvided} THEN ${state ?? 'draft'}
            ELSE state
          END,
          generation_metadata = CASE
            WHEN ${markdownProvided} THEN generation_metadata || ${JSON.stringify({ manuallyEdited: true })}::jsonb
            ELSE generation_metadata
          END,
          updated_by = ${actorUserId}::uuid,
          updated_at = now()
      WHERE job_id = ${jobId}::uuid AND id = ${sectionId}::uuid
      RETURNING id::text AS id, state
    `;
    if (!rows[0]) throw new NotesStudioSectionError('SECTION_NOT_FOUND', 'Section not found.', 404);
    const jobState = await refreshSectionReadiness(jobId, actorUserId);
    await audit(actorUserId, 'notes_studio.section.updated', jobId, 'Updated Notes Studio section draft', {
      sectionId,
      state: rows[0].state,
      manuallyEdited: markdownProvided,
      learnerPublished: false,
    });
    res.json({ jobState, ...(await loadSections(jobId)) });
  } catch (error) {
    sendError(res, error, 'Unable to update Notes Studio section');
  }
});

export default router;
