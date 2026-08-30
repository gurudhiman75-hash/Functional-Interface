import { randomUUID } from 'node:crypto';
import { Router, type IRouter, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';
import {
  approvalVersionFingerprint,
  approvedContentHash,
  buildApprovedBody,
  canonicalNotePublicCode,
  evaluateNotesLocalization,
  localizationContentHash,
  type ApprovedSectionInput,
  type NotesLocalizationLanguage,
} from '../notes-studio/approval-versioning';
import {
  generateNotesLocalization,
  NotesStudioLocalizationModelConfigurationError,
} from '../notes-studio/localization-provider';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const publicCodePattern = /^[A-Z][A-Z0-9_-]{2,79}$/;
const supportedLocalizations = new Set<NotesLocalizationLanguage>(['hi', 'pa']);

class NotesStudioApprovalError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new NotesStudioApprovalError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function localizationLanguage(value: unknown): NotesLocalizationLanguage {
  const languageCode = text(value, 8).toLowerCase() as NotesLocalizationLanguage;
  if (!supportedLocalizations.has(languageCode)) {
    throw new NotesStudioApprovalError('LOCALIZATION_LANGUAGE_UNSUPPORTED', 'Notes Studio NS-006 supports Hindi (hi) and Punjabi (pa).');
  }
  return languageCode;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)).filter(Boolean) : [];
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof NotesStudioApprovalError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  if (error instanceof NotesStudioLocalizationModelConfigurationError) {
    res.status(503).json({ error: error.message, code: 'NOTES_STUDIO_LOCALIZATION_MODEL_NOT_CONFIGURED' });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'NOTES_STUDIO_APPROVAL_FAILED' });
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
        JOIN content.note_authoring_sources source_link
          ON source_link.job_id = block.job_id AND source_link.source_document_id = block.source_document_id
        WHERE mapping.job_id = claim.job_id
          AND mapping.claim_id = claim.id
          AND source_link.inclusion_state = 'included'
      )
  `;
  return Number(rows[0]?.count ?? 0);
}

async function loadWorkspace(jobId: string) {
  const jobRows = await sqlClient`
    SELECT id::text AS id, title, source_language AS "sourceLanguage", state, brief,
           target_resource_id::text AS "targetResourceId", updated_at AS "updatedAt"
    FROM content.note_authoring_jobs
    WHERE id = ${jobId}::uuid
    LIMIT 1
  `;
  const job = jobRows[0];
  if (!job) throw new NotesStudioApprovalError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);

  const sectionRows = await sqlClient`
    SELECT
      section.id::text AS id,
      section.title,
      section.sort_order AS "sortOrder",
      section.state,
      section.output_fingerprint AS "outputFingerprint",
      latest.id::text AS "qualityRunId",
      latest.status AS "qualityStatus",
      latest.section_output_fingerprint AS "qualityOutputFingerprint",
      latest.evidence_fingerprint AS "evidenceFingerprint"
    FROM content.note_sections section
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
  const conflicts = await activeConflictCount(jobId);
  const approvalEligible = String(job.state) === 'review_ready'
    && sectionRows.length > 0
    && conflicts === 0
    && sectionRows.every((section) => String(section.state) === 'qa_passed'
      && String(section.qualityStatus) === 'passed'
      && String(section.qualityOutputFingerprint) === String(section.outputFingerprint));

  const versionRows = await sqlClient`
    SELECT
      version.id::text AS id,
      version.version_number AS "versionNumber",
      version.source_language AS "sourceLanguage",
      version.learner_title AS "learnerTitle",
      version.learner_summary AS "learnerSummary",
      version.content_hash AS "contentHash",
      version.approval_fingerprint AS "approvalFingerprint",
      version.exam_ids AS "examIds",
      version.approved_at AS "approvedAt",
      version.approved_by::text AS "approvedBy",
      materialization.resource_id::text AS "resourceId",
      resource.public_code AS "publicCode",
      resource.status AS "resourceStatus"
    FROM content.note_approved_versions version
    LEFT JOIN content.note_materializations materialization ON materialization.approved_version_id = version.id
    LEFT JOIN content.learning_resources resource ON resource.id = materialization.resource_id
    WHERE version.job_id = ${jobId}::uuid
    ORDER BY version.version_number DESC
    LIMIT 1
  `;
  const version = versionRows[0] ?? null;
  const localizationRows = version ? await sqlClient`
    SELECT
      localization.id::text AS id,
      localization.language_code AS "languageCode",
      localization.state,
      localization.title,
      localization.summary,
      localization.body_markdown AS "bodyMarkdown",
      localization.source_content_hash AS "sourceContentHash",
      localization.content_hash AS "contentHash",
      localization.quality,
      localization.generation_metadata AS "generationMetadata",
      localization.materialized_resource_id::text AS "materializedResourceId",
      resource.public_code AS "publicCode",
      resource.status AS "resourceStatus",
      localization.updated_at AS "updatedAt"
    FROM content.note_localizations localization
    LEFT JOIN content.learning_resources resource ON resource.id = localization.materialized_resource_id
    WHERE localization.approved_version_id = ${String(version.id)}::uuid
    ORDER BY localization.language_code
  ` : [];

  return {
    job,
    approval: {
      eligible: approvalEligible,
      sectionCount: sectionRows.length,
      qaPassedCount: sectionRows.filter((section) => String(section.state) === 'qa_passed').length,
      activeConflictCount: conflicts,
    },
    approvedVersion: version,
    localizations: localizationRows,
    publicationBoundary: {
      materializationCreatesDraftOnly: true,
      automaticPublicationEnabled: false,
      localizationLanguages: ['hi', 'pa'],
    },
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

async function loadApprovedVersion(versionId: string) {
  const rows = await sqlClient`
    SELECT
      version.id::text AS id,
      version.job_id::text AS "jobId",
      version.source_language AS "sourceLanguage",
      version.learner_title AS "learnerTitle",
      version.learner_summary AS "learnerSummary",
      version.body_markdown AS "bodyMarkdown",
      version.content_hash AS "contentHash",
      version.exam_ids AS "examIds"
    FROM content.note_approved_versions version
    WHERE version.id = ${versionId}::uuid
    LIMIT 1
  `;
  if (!rows[0]) throw new NotesStudioApprovalError('APPROVED_VERSION_NOT_FOUND', 'Approved Notes Studio version not found.', 404);
  return rows[0] as Record<string, unknown>;
}

async function persistLocalization(args: {
  version: Record<string, unknown>;
  languageCode: NotesLocalizationLanguage;
  title: string;
  summary: string;
  bodyMarkdown: string;
  actorUserId: string;
  generationMetadata: Record<string, unknown>;
}) {
  if (String(args.version.sourceLanguage).toLowerCase() === args.languageCode) {
    throw new NotesStudioApprovalError('LOCALIZATION_MATCHES_SOURCE', 'Target localization language must differ from the approved source language.');
  }
  if (!args.title || !args.summary || !args.bodyMarkdown) {
    throw new NotesStudioApprovalError('LOCALIZATION_CONTENT_REQUIRED', 'Localized title, summary and body are required.');
  }
  const existing = await sqlClient`
    SELECT id::text AS id, state
    FROM content.note_localizations
    WHERE approved_version_id = ${String(args.version.id)}::uuid AND language_code = ${args.languageCode}
    LIMIT 1
  `;
  if (String(existing[0]?.state ?? '') === 'materialized') {
    throw new NotesStudioApprovalError('LOCALIZATION_FROZEN', 'A materialized localization is frozen. Create a replacement approved source version instead.', 409);
  }
  const quality = evaluateNotesLocalization({
    sourceTitle: String(args.version.learnerTitle),
    sourceSummary: String(args.version.learnerSummary),
    sourceBodyMarkdown: String(args.version.bodyMarkdown),
    localizedTitle: args.title,
    localizedSummary: args.summary,
    localizedBodyMarkdown: args.bodyMarkdown,
    languageCode: args.languageCode,
  });
  const contentHash = localizationContentHash({
    approvedVersionId: String(args.version.id),
    sourceContentHash: String(args.version.contentHash),
    languageCode: args.languageCode,
    title: args.title,
    summary: args.summary,
    bodyMarkdown: args.bodyMarkdown,
  });
  const id = existing[0]?.id ? String(existing[0].id) : randomUUID();
  await sqlClient`
    INSERT INTO content.note_localizations (
      id, approved_version_id, language_code, state, title, summary, body_markdown,
      source_content_hash, content_hash, quality, generation_metadata,
      created_by, updated_by, created_at, updated_at
    ) VALUES (
      ${id}::uuid, ${String(args.version.id)}::uuid, ${args.languageCode}, ${quality.ready ? 'ready' : 'needs_editorial'},
      ${args.title}, ${args.summary}, ${args.bodyMarkdown}, ${String(args.version.contentHash)}, ${contentHash},
      ${JSON.stringify(quality)}, ${JSON.stringify(args.generationMetadata)}, ${args.actorUserId}::uuid,
      ${args.actorUserId}::uuid, now(), now()
    )
    ON CONFLICT (approved_version_id, language_code) DO UPDATE
    SET state = EXCLUDED.state,
        title = EXCLUDED.title,
        summary = EXCLUDED.summary,
        body_markdown = EXCLUDED.body_markdown,
        source_content_hash = EXCLUDED.source_content_hash,
        content_hash = EXCLUDED.content_hash,
        quality = EXCLUDED.quality,
        generation_metadata = EXCLUDED.generation_metadata,
        updated_by = EXCLUDED.updated_by,
        updated_at = now()
  `;
  await audit(args.actorUserId, 'notes_studio.localization.saved', String(args.version.jobId), `Saved ${args.languageCode} Notes Studio localization`, {
    approvedVersionId: args.version.id,
    languageCode: args.languageCode,
    state: quality.ready ? 'ready' : 'needs_editorial',
    sourceContentHash: args.version.contentHash,
    contentHash,
    automaticPublication: false,
  });
  return quality;
}

router.use(authenticate);

router.get('/jobs/:id/approval', requireAdminPermission('content.questions.read'), async (req, res) => {
  try {
    res.json(await loadWorkspace(uuid(req.params.id, 'Authoring job ID')));
  } catch (error) {
    sendError(res, error, 'Unable to load Notes Studio approval workspace');
  }
});

router.post('/jobs/:id/approve', requireAdminPermission('content.questions.publish'), async (req, res) => {
  try {
    const jobId = uuid(req.params.id, 'Authoring job ID');
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new NotesStudioApprovalError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const learnerTitle = text(req.body?.learnerTitle, 200);
    const learnerSummary = text(req.body?.learnerSummary, 1200);
    if (learnerTitle.length < 3) throw new NotesStudioApprovalError('LEARNER_TITLE_REQUIRED', 'Enter the learner-facing note title before approval.');
    if (!learnerSummary) throw new NotesStudioApprovalError('LEARNER_SUMMARY_REQUIRED', 'Enter a concise learner-facing summary before approval.');

    let approvedVersionId = '';
    await sqlClient.begin(async (tx) => {
      const jobRows = await tx`
        SELECT id::text AS id, source_language AS "sourceLanguage", state, brief
        FROM content.note_authoring_jobs
        WHERE id = ${jobId}::uuid
        FOR UPDATE
      `;
      const job = jobRows[0] as Record<string, unknown> | undefined;
      if (!job) throw new NotesStudioApprovalError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
      if (String(job.state) !== 'review_ready') {
        throw new NotesStudioApprovalError('JOB_NOT_REVIEW_READY', 'Only a fully QA-passed review-ready job can be editorially approved.', 409);
      }
      const existing = await tx`SELECT id FROM content.note_approved_versions WHERE job_id = ${jobId}::uuid LIMIT 1`;
      if (existing[0]) throw new NotesStudioApprovalError('JOB_ALREADY_APPROVED', 'This authoring job already has an immutable approved version.', 409);

      const conflictRows = await tx`
        SELECT COUNT(*)::int AS count
        FROM content.note_source_claims claim
        WHERE claim.job_id = ${jobId}::uuid AND claim.state = 'conflict'
          AND EXISTS (
            SELECT 1
            FROM content.note_source_claim_evidence mapping
            JOIN content.note_source_evidence_blocks block ON block.job_id = mapping.job_id AND block.id = mapping.evidence_block_id
            JOIN content.note_authoring_sources source_link ON source_link.job_id = block.job_id AND source_link.source_document_id = block.source_document_id
            WHERE mapping.job_id = claim.job_id AND mapping.claim_id = claim.id AND source_link.inclusion_state = 'included'
          )
      `;
      if (Number(conflictRows[0]?.count ?? 0) > 0) {
        throw new NotesStudioApprovalError('ACTIVE_CONFLICTS_BLOCK_APPROVAL', 'Resolve active evidence conflicts before editorial approval.', 409);
      }

      const rows = await tx`
        SELECT
          section.id::text AS id,
          section.title,
          section.sort_order AS "sortOrder",
          section.markdown,
          section.state,
          section.output_fingerprint AS "outputFingerprint",
          latest.id::text AS "qualityRunId",
          latest.status AS "qualityStatus",
          latest.section_output_fingerprint AS "qualityOutputFingerprint",
          latest.evidence_fingerprint AS "evidenceFingerprint"
        FROM content.note_sections section
        LEFT JOIN LATERAL (
          SELECT run.* FROM content.note_quality_runs run
          WHERE run.job_id = section.job_id AND run.section_id = section.id
          ORDER BY run.created_at DESC, run.id DESC LIMIT 1
        ) latest ON true
        WHERE section.job_id = ${jobId}::uuid
        ORDER BY section.sort_order, section.created_at
      `;
      if (rows.length === 0) throw new NotesStudioApprovalError('NO_SECTIONS', 'Draft and QA at least one note section before approval.', 409);
      const invalid = rows.find((section) => String(section.state) !== 'qa_passed'
        || String(section.qualityStatus) !== 'passed'
        || String(section.qualityOutputFingerprint) !== String(section.outputFingerprint)
        || !uuidPattern.test(String(section.qualityRunId ?? ''))
        || !/^[0-9a-f]{64}$/.test(String(section.evidenceFingerprint ?? '')));
      if (invalid) throw new NotesStudioApprovalError('STALE_OR_FAILED_QA', 'Every section must have a current passing fingerprint-bound QA run before approval.', 409);

      const sections: ApprovedSectionInput[] = rows.map((section) => ({
        id: String(section.id),
        title: String(section.title),
        sortOrder: Number(section.sortOrder ?? 0),
        markdown: String(section.markdown ?? ''),
        outputFingerprint: String(section.outputFingerprint),
        qualityRunId: String(section.qualityRunId),
        evidenceFingerprint: String(section.evidenceFingerprint),
      }));
      const brief = asRecord(job.brief);
      const examIds = stringArray(brief.examIds).filter((id) => uuidPattern.test(id));
      const bodyMarkdown = buildApprovedBody(sections);
      if (!bodyMarkdown || bodyMarkdown.length > 100000) {
        throw new NotesStudioApprovalError('APPROVED_BODY_SIZE_INVALID', 'Approved note body must contain 1-100000 characters.', 409);
      }
      const contentHash = approvedContentHash({ title: learnerTitle, summary: learnerSummary, bodyMarkdown });
      const approvalFingerprint = approvalVersionFingerprint({
        jobId,
        sourceLanguage: String(job.sourceLanguage),
        learnerTitle,
        learnerSummary,
        examIds,
        brief,
        sections,
      });
      approvedVersionId = randomUUID();
      const sectionManifest = sections.map((section) => ({
        id: section.id,
        title: section.title,
        sortOrder: section.sortOrder,
        outputFingerprint: section.outputFingerprint,
      }));
      const qaManifest = sections.map((section) => ({
        sectionId: section.id,
        qualityRunId: section.qualityRunId,
        evidenceFingerprint: section.evidenceFingerprint,
        outputFingerprint: section.outputFingerprint,
      }));
      await tx`
        INSERT INTO content.note_approved_versions (
          id, job_id, version_number, source_language, learner_title, learner_summary,
          body_markdown, content_hash, approval_fingerprint, brief_snapshot, exam_ids,
          section_manifest, qa_manifest, approved_by, approved_at
        ) VALUES (
          ${approvedVersionId}::uuid, ${jobId}::uuid, 1, ${String(job.sourceLanguage)}, ${learnerTitle}, ${learnerSummary},
          ${bodyMarkdown}, ${contentHash}, ${approvalFingerprint}, ${JSON.stringify(brief)}, ${JSON.stringify(examIds)},
          ${JSON.stringify(sectionManifest)}, ${JSON.stringify(qaManifest)}, ${actorUserId}::uuid, now()
        )
      `;
      await tx`UPDATE content.note_sections SET state = 'accepted', updated_by = ${actorUserId}::uuid, updated_at = now() WHERE job_id = ${jobId}::uuid`;
      await tx`UPDATE content.note_authoring_jobs SET state = 'approved', updated_by = ${actorUserId}::uuid, updated_at = now() WHERE id = ${jobId}::uuid`;
    });
    await audit(actorUserId, 'notes_studio.version.approved', jobId, 'Approved immutable Notes Studio source-language version', {
      approvedVersionId,
      learnerTitle,
      automaticPublication: false,
    });
    res.json(await loadWorkspace(jobId));
  } catch (error) {
    sendError(res, error, 'Unable to approve Notes Studio version');
  }
});

router.post('/jobs/:id/materialize', requireAdminPermission('content.questions.publish'), async (req, res) => {
  try {
    const jobId = uuid(req.params.id, 'Authoring job ID');
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new NotesStudioApprovalError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const preexisting = await sqlClient`
      SELECT materialization.resource_id::text AS "resourceId"
      FROM content.note_approved_versions version
      JOIN content.note_materializations materialization ON materialization.approved_version_id = version.id
      WHERE version.job_id = ${jobId}::uuid LIMIT 1
    `;
    if (preexisting[0]) {
      res.json(await loadWorkspace(jobId));
      return;
    }

    let resourceId = '';
    let approvedVersionId = '';
    await sqlClient.begin(async (tx) => {
      const jobRows = await tx`SELECT id::text AS id, state FROM content.note_authoring_jobs WHERE id = ${jobId}::uuid FOR UPDATE`;
      if (!jobRows[0]) throw new NotesStudioApprovalError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
      if (String(jobRows[0].state) !== 'approved') {
        throw new NotesStudioApprovalError('JOB_NOT_APPROVED', 'Editorial approval is required before canonical materialization.', 409);
      }
      const versions = await tx`
        SELECT id::text AS id, source_language AS "sourceLanguage", learner_title AS "learnerTitle",
               learner_summary AS "learnerSummary", body_markdown AS "bodyMarkdown", exam_ids AS "examIds"
        FROM content.note_approved_versions WHERE job_id = ${jobId}::uuid LIMIT 1
      `;
      const version = versions[0] as Record<string, unknown> | undefined;
      if (!version) throw new NotesStudioApprovalError('APPROVED_VERSION_NOT_FOUND', 'Immutable approved version is missing.', 409);
      approvedVersionId = String(version.id);
      const publicCodeInput = text(req.body?.publicCode, 80).toUpperCase();
      const publicCode = publicCodeInput || canonicalNotePublicCode(approvedVersionId);
      if (!publicCodePattern.test(publicCode)) {
        throw new NotesStudioApprovalError('INVALID_RESOURCE_CODE', 'Use an uppercase resource code with letters, numbers, hyphens or underscores.');
      }
      resourceId = randomUUID();
      await tx`
        INSERT INTO content.learning_resources (
          id, public_code, category, format, title, summary, language_code,
          content_date, body_markdown, content_url, status, expires_at,
          created_by, updated_by, created_at, updated_at
        ) VALUES (
          ${resourceId}::uuid, ${publicCode}, 'notes', 'article', ${String(version.learnerTitle)},
          ${String(version.learnerSummary)}, ${String(version.sourceLanguage)}, null, ${String(version.bodyMarkdown)},
          null, 'draft', null, ${actorUserId}::uuid, ${actorUserId}::uuid, now(), now()
        )
      `;
      for (const examId of stringArray(version.examIds).filter((id) => uuidPattern.test(id))) {
        await tx`INSERT INTO content.learning_resource_exams (resource_id, exam_id) VALUES (${resourceId}::uuid, ${examId}::uuid) ON CONFLICT DO NOTHING`;
      }
      await tx`
        INSERT INTO content.note_materializations (approved_version_id, resource_id, materialized_by, materialized_at)
        VALUES (${approvedVersionId}::uuid, ${resourceId}::uuid, ${actorUserId}::uuid, now())
      `;
      await tx`
        UPDATE content.note_authoring_jobs
        SET state = 'materialized', target_resource_id = ${resourceId}::uuid,
            updated_by = ${actorUserId}::uuid, updated_at = now()
        WHERE id = ${jobId}::uuid
      `;
    });
    await audit(actorUserId, 'notes_studio.version.materialized', jobId, 'Materialized approved Notes Studio version as canonical draft resource', {
      approvedVersionId,
      resourceId,
      resourceStatus: 'draft',
      automaticPublication: false,
    });
    res.json(await loadWorkspace(jobId));
  } catch (error) {
    sendError(res, error, 'Unable to materialize Notes Studio version');
  }
});

router.post('/approved-versions/:versionId/localizations/:languageCode/manual', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const versionId = uuid(req.params.versionId, 'Approved version ID');
    const languageCode = localizationLanguage(req.params.languageCode);
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new NotesStudioApprovalError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const version = await loadApprovedVersion(versionId);
    await persistLocalization({
      version,
      languageCode,
      title: text(req.body?.title, 240),
      summary: text(req.body?.summary, 4000),
      bodyMarkdown: text(req.body?.bodyMarkdown, 100000),
      actorUserId,
      generationMetadata: { mode: 'manual', frozenSourceOnly: true },
    });
    res.json(await loadWorkspace(String(version.jobId)));
  } catch (error) {
    sendError(res, error, 'Unable to save Notes Studio localization');
  }
});

router.post('/approved-versions/:versionId/localizations/:languageCode/generate', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const versionId = uuid(req.params.versionId, 'Approved version ID');
    const languageCode = localizationLanguage(req.params.languageCode);
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new NotesStudioApprovalError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const version = await loadApprovedVersion(versionId);
    const generated = await generateNotesLocalization({
      languageCode,
      sourceTitle: String(version.learnerTitle),
      sourceSummary: String(version.learnerSummary),
      sourceBodyMarkdown: String(version.bodyMarkdown),
    });
    const quality = await persistLocalization({
      version,
      languageCode,
      title: generated.localizedTitle,
      summary: generated.localizedSummary,
      bodyMarkdown: generated.localizedBodyMarkdown,
      actorUserId,
      generationMetadata: {
        mode: 'model',
        provider: generated.provider,
        model: generated.model,
        responseId: generated.responseId,
        usage: generated.usage,
        frozenSourceOnly: true,
        rawResearchSourcesSent: false,
      },
    });
    await audit(actorUserId, 'notes_studio.localization.generated', String(version.jobId), `Generated ${languageCode} localization from immutable approved version`, {
      approvedVersionId: versionId,
      languageCode,
      provider: generated.provider,
      model: generated.model,
      parityReady: quality.ready,
      rawResearchSourcesSent: false,
      automaticPublication: false,
    });
    res.json(await loadWorkspace(String(version.jobId)));
  } catch (error) {
    sendError(res, error, 'Unable to generate Notes Studio localization');
  }
});

router.post('/approved-versions/:versionId/localizations/:languageCode/materialize', requireAdminPermission('content.questions.publish'), async (req, res) => {
  try {
    const versionId = uuid(req.params.versionId, 'Approved version ID');
    const languageCode = localizationLanguage(req.params.languageCode);
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new NotesStudioApprovalError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const version = await loadApprovedVersion(versionId);

    await sqlClient.begin(async (tx) => {
      const sourceMaterialization = await tx`SELECT resource_id FROM content.note_materializations WHERE approved_version_id = ${versionId}::uuid LIMIT 1`;
      if (!sourceMaterialization[0]) {
        throw new NotesStudioApprovalError('SOURCE_VERSION_NOT_MATERIALIZED', 'Materialize the approved source-language note before localized variants.', 409);
      }
      const rows = await tx`
        SELECT id::text AS id, state, title, summary, body_markdown AS "bodyMarkdown",
               source_content_hash AS "sourceContentHash", materialized_resource_id::text AS "materializedResourceId"
        FROM content.note_localizations
        WHERE approved_version_id = ${versionId}::uuid AND language_code = ${languageCode}
        FOR UPDATE
      `;
      const localization = rows[0] as Record<string, unknown> | undefined;
      if (!localization) throw new NotesStudioApprovalError('LOCALIZATION_NOT_FOUND', 'Generate or save the localization before materialization.', 404);
      if (localization.materializedResourceId) return;
      if (String(localization.state) !== 'ready') {
        throw new NotesStudioApprovalError('LOCALIZATION_NOT_READY', 'Localization parity gates must pass before materialization.', 409);
      }
      if (String(localization.sourceContentHash) !== String(version.contentHash)) {
        throw new NotesStudioApprovalError('LOCALIZATION_SOURCE_MISMATCH', 'Localization is not bound to the current immutable source version.', 409);
      }
      const resourceId = randomUUID();
      const publicCodeInput = text(req.body?.publicCode, 80).toUpperCase();
      const publicCode = publicCodeInput || canonicalNotePublicCode(versionId, languageCode);
      if (!publicCodePattern.test(publicCode)) throw new NotesStudioApprovalError('INVALID_RESOURCE_CODE', 'Localized resource code is invalid.');
      await tx`
        INSERT INTO content.learning_resources (
          id, public_code, category, format, title, summary, language_code,
          content_date, body_markdown, content_url, status, expires_at,
          created_by, updated_by, created_at, updated_at
        ) VALUES (
          ${resourceId}::uuid, ${publicCode}, 'notes', 'article', ${String(localization.title)}, ${String(localization.summary)},
          ${languageCode}, null, ${String(localization.bodyMarkdown)}, null, 'draft', null,
          ${actorUserId}::uuid, ${actorUserId}::uuid, now(), now()
        )
      `;
      for (const examId of stringArray(version.examIds).filter((id) => uuidPattern.test(id))) {
        await tx`INSERT INTO content.learning_resource_exams (resource_id, exam_id) VALUES (${resourceId}::uuid, ${examId}::uuid) ON CONFLICT DO NOTHING`;
      }
      await tx`
        UPDATE content.note_localizations
        SET state = 'materialized', materialized_resource_id = ${resourceId}::uuid,
            updated_by = ${actorUserId}::uuid, updated_at = now()
        WHERE id = ${String(localization.id)}::uuid
      `;
    });
    await audit(actorUserId, 'notes_studio.localization.materialized', String(version.jobId), `Materialized ${languageCode} Notes Studio localization as canonical draft`, {
      approvedVersionId: versionId,
      languageCode,
      resourceStatus: 'draft',
      automaticPublication: false,
    });
    res.json(await loadWorkspace(String(version.jobId)));
  } catch (error) {
    sendError(res, error, 'Unable to materialize Notes Studio localization');
  }
});

export default router;
