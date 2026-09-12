import { randomUUID } from 'node:crypto';
import { Router, raw, type IRouter, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';
import { ingestPdfBuffer } from '../generators/knowledge/pdf-ingestion';
import {
  NOTE_SOURCE_RIGHTS_BASES,
  assertPublicHttpsUrl,
  extractReadableWebText,
  extractWebTitle,
  noteSourceContentHash,
  referenceOnlyUrlContentHash,
  retentionModeForRights,
  sourcePreview,
  type NoteSourceRightsBasis,
} from '../notes-studio/source-pack';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const languagePattern = /^[a-z]{2,8}(?:-[a-z0-9]{2,8})?$/;
const rightsBases = new Set<string>(NOTE_SOURCE_RIGHTS_BASES);
const depths = new Set(['quick_revision', 'standard', 'comprehensive']);
const learnerLevels = new Set(['foundation', 'standard', 'advanced']);
const MAX_EXAM_TARGETS = 12;
const MAX_WEB_BYTES = 4_000_000;
const MAX_RETAINED_TEXT_CHARS = 1_500_000;

class NotesStudioError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new NotesStudioError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function rightsBasis(value: unknown): NoteSourceRightsBasis {
  const parsed = text(value, 40).toLowerCase() || 'reference_only';
  if (!rightsBases.has(parsed)) {
    throw new NotesStudioError('INVALID_RIGHTS_BASIS', 'Choose user_supplied, licensed, public_domain, publisher_authorized or reference_only.');
  }
  return parsed as NoteSourceRightsBasis;
}

function positiveInteger(value: unknown): number | undefined {
  if (value == null || value === '') return undefined;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) throw new NotesStudioError('INVALID_PAGE_RANGE', 'PDF page numbers must be positive whole numbers.');
  return parsed;
}

function examIds(value: unknown): string[] {
  if (value == null) return [];
  if (!Array.isArray(value)) throw new NotesStudioError('INVALID_EXAMS', 'Exam targets must be an array.');
  const ids = [...new Set(value.map((item) => String(item).trim()).filter(Boolean))];
  if (ids.length > MAX_EXAM_TARGETS || ids.some((id) => !uuidPattern.test(id))) {
    throw new NotesStudioError('INVALID_EXAMS', `Choose up to ${MAX_EXAM_TARGETS} valid canonical exams.`);
  }
  return ids;
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof NotesStudioError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'NOTES_STUDIO_FAILED' });
}

async function loadJob(id: string) {
  const rows = await sqlClient`
    SELECT
      job.id::text AS id,
      job.title,
      job.source_language AS "sourceLanguage",
      job.state,
      job.brief,
      job.target_resource_id::text AS "targetResourceId",
      job.created_at AS "createdAt",
      job.updated_at AS "updatedAt",
      COALESCE(COUNT(link.source_document_id), 0)::int AS "sourceCount",
      COALESCE(COUNT(link.source_document_id) FILTER (WHERE link.inclusion_state = 'included'), 0)::int AS "includedSourceCount",
      COALESCE(COUNT(link.source_document_id) FILTER (
        WHERE link.inclusion_state = 'included'
          AND document.retention_mode = 'extracted_text'
          AND document.extraction_status = 'processed'
          AND LENGTH(COALESCE(document.extracted_text, '')) >= 100
      ), 0)::int AS "generatableSourceCount"
    FROM content.note_authoring_jobs job
    LEFT JOIN content.note_authoring_sources link ON link.job_id = job.id
    LEFT JOIN content.source_documents document ON document.id = link.source_document_id
    WHERE job.id = ${id}::uuid
    GROUP BY job.id
    LIMIT 1
  `;
  return rows[0] ?? null;
}

async function refreshSourceReadiness(jobId: string, actorUserId: string) {
  await sqlClient`
    UPDATE content.note_authoring_jobs job
    SET state = CASE
      WHEN EXISTS (
        SELECT 1
        FROM content.note_authoring_sources link
        JOIN content.source_documents document ON document.id = link.source_document_id
        WHERE link.job_id = job.id
          AND link.inclusion_state = 'included'
          AND document.retention_mode = 'extracted_text'
          AND document.extraction_status = 'processed'
          AND LENGTH(COALESCE(document.extracted_text, '')) >= 100
      ) THEN 'sources_ready'
      ELSE 'brief'
    END,
    updated_by = ${actorUserId}::uuid,
    updated_at = now()
    WHERE job.id = ${jobId}::uuid
      AND job.state IN ('brief', 'sources_ready')
  `;
}

async function validateBriefReferences(sourceLanguage: string, ids: string[]) {
  const languageRows = await sqlClient`
    SELECT id FROM catalog.languages
    WHERE lower(code) = ${sourceLanguage} AND is_active = true
    LIMIT 1
  `;
  if (!languageRows[0]) throw new NotesStudioError('SOURCE_LANGUAGE_UNAVAILABLE', 'Choose an active canonical source language.');
  if (ids.length === 0) return;
  const examRows = await sqlClient`
    SELECT exam.id::text AS id
    FROM catalog.exams exam
    JOIN catalog.exam_families family ON family.id = exam.family_id AND family.is_active = true
    JOIN catalog.exam_versions version ON version.exam_id = exam.id AND version.is_current = true
    WHERE exam.id = ANY(${ids}::uuid[]) AND exam.is_active = true
  `;
  const valid = new Set(examRows.map((row) => String(row.id)));
  if (valid.size !== ids.length) throw new NotesStudioError('EXAM_UNAVAILABLE', 'One or more selected exams are no longer active.');
}

async function sourceAlreadyAttached(jobId: string, hash: string) {
  const rows = await sqlClient`
    SELECT
      document.id::text AS id,
      document.title,
      document.publisher,
      document.source_type AS "sourceType",
      document.source_uri AS "sourceUri",
      document.content_hash AS "contentHash",
      document.rights_basis AS "rightsBasis",
      document.retention_mode AS "retentionMode",
      document.extraction_status AS "extractionStatus",
      document.extraction_metadata AS "extractionMetadata",
      link.inclusion_state AS "inclusionState",
      link.added_at AS "addedAt"
    FROM content.note_authoring_sources link
    JOIN content.source_documents document ON document.id = link.source_document_id
    WHERE link.job_id = ${jobId}::uuid AND document.content_hash = ${hash}
    LIMIT 1
  `;
  return rows[0] ?? null;
}

async function attachSource(input: {
  jobId: string;
  actorUserId: string;
  sourceType: 'web' | 'uploaded_pdf';
  sourceUri: string;
  title: string;
  publisher: string;
  mimeType: string | null;
  contentHash: string;
  rightsBasis: NoteSourceRightsBasis;
  retainedText: string | null;
  extractionMetadata: Record<string, unknown>;
}) {
  const retentionMode = retentionModeForRights(input.rightsBasis);
  const sourceId = randomUUID();
  const extractionStatus = retentionMode === 'extracted_text' ? 'processed' : 'metadata_only';
  const retainedText = retentionMode === 'extracted_text' ? input.retainedText : null;

  await sqlClient.begin(async (tx) => {
    await tx`
      INSERT INTO content.source_documents (
        id, source_type, source_uri, title, publisher, mime_type, content_hash,
        rights_basis, retention_mode, extraction_status, extracted_text,
        extraction_metadata, created_by, created_at, updated_at
      ) VALUES (
        ${sourceId}::uuid, ${input.sourceType}, ${input.sourceUri}, ${input.title},
        ${input.publisher}, ${input.mimeType}, ${input.contentHash}, ${input.rightsBasis},
        ${retentionMode}, ${extractionStatus}, ${retainedText},
        ${JSON.stringify(input.extractionMetadata)}, ${input.actorUserId}::uuid, now(), now()
      )
    `;
    await tx`
      INSERT INTO content.note_authoring_sources (
        job_id, source_document_id, inclusion_state, relevance_score, position,
        added_by, added_at, updated_at
      ) VALUES (
        ${input.jobId}::uuid, ${sourceId}::uuid, 'included', null,
        COALESCE((SELECT MAX(position) + 1 FROM content.note_authoring_sources WHERE job_id = ${input.jobId}::uuid), 0),
        ${input.actorUserId}::uuid, now(), now()
      )
    `;
    await tx`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${input.actorUserId}::uuid,
        'notes_studio.source.attached', 'note_authoring_job', ${input.jobId}::uuid,
        ${`Attached ${input.sourceType} source to Notes Studio job`},
        ${JSON.stringify({ sourceId, rightsBasis: input.rightsBasis, retentionMode, contentHash: input.contentHash })}
      )
    `;
  });
  await refreshSourceReadiness(input.jobId, input.actorUserId);
  return sourceId;
}

router.use(authenticate);

router.get('/capabilities', requireAdminPermission('content.questions.read'), (_req, res) => {
  res.json({
    rightsBases: NOTE_SOURCE_RIGHTS_BASES,
    depthOptions: ['quick_revision', 'standard', 'comprehensive'],
    learnerLevels: ['foundation', 'standard', 'advanced'],
    maxExamTargets: MAX_EXAM_TARGETS,
    sourceTypes: ['web', 'uploaded_pdf'],
    maxWebBytes: MAX_WEB_BYTES,
    rawPdfPersisted: false,
    automaticGenerationEnabled: false,
    automaticPublicationEnabled: false,
  });
});

router.get('/jobs', requireAdminPermission('content.questions.read'), async (_req, res) => {
  try {
    const rows = await sqlClient`
      SELECT
        job.id::text AS id,
        job.title,
        job.source_language AS "sourceLanguage",
        job.state,
        job.brief,
        job.target_resource_id::text AS "targetResourceId",
        job.created_at AS "createdAt",
        job.updated_at AS "updatedAt",
        COALESCE(COUNT(link.source_document_id), 0)::int AS "sourceCount",
        COALESCE(COUNT(link.source_document_id) FILTER (WHERE link.inclusion_state = 'included'), 0)::int AS "includedSourceCount",
        COALESCE(COUNT(link.source_document_id) FILTER (
          WHERE link.inclusion_state = 'included'
            AND document.retention_mode = 'extracted_text'
            AND document.extraction_status = 'processed'
            AND LENGTH(COALESCE(document.extracted_text, '')) >= 100
        ), 0)::int AS "generatableSourceCount"
      FROM content.note_authoring_jobs job
      LEFT JOIN content.note_authoring_sources link ON link.job_id = job.id
      LEFT JOIN content.source_documents document ON document.id = link.source_document_id
      GROUP BY job.id
      ORDER BY job.updated_at DESC
      LIMIT 500
    `;
    res.json({ jobs: rows });
  } catch (error) {
    sendError(res, error, 'Unable to load Notes Studio authoring jobs');
  }
});

router.post('/jobs', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new NotesStudioError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const title = text(req.body?.title, 240);
    const sourceLanguage = text(req.body?.sourceLanguage, 20).toLowerCase() || 'en';
    const topicLabel = text(req.body?.topicLabel, 240);
    const syllabusEmphasis = text(req.body?.syllabusEmphasis, 3000);
    const depth = text(req.body?.depth, 40).toLowerCase() || 'standard';
    const learnerLevel = text(req.body?.learnerLevel, 40).toLowerCase() || 'standard';
    const ids = examIds(req.body?.examIds);
    if (title.length < 3) throw new NotesStudioError('TITLE_REQUIRED', 'Enter a clear internal authoring-job title.');
    if (!languagePattern.test(sourceLanguage)) throw new NotesStudioError('INVALID_LANGUAGE', 'Source language is invalid.');
    if (!depths.has(depth)) throw new NotesStudioError('INVALID_DEPTH', 'Choose quick_revision, standard or comprehensive depth.');
    if (!learnerLevels.has(learnerLevel)) throw new NotesStudioError('INVALID_LEARNER_LEVEL', 'Choose foundation, standard or advanced learner level.');
    await validateBriefReferences(sourceLanguage, ids);

    const id = randomUUID();
    const brief = { topicLabel, depth, learnerLevel, syllabusEmphasis, examIds: ids, authoringPolicyVersion: 'notes-v1' };
    await sqlClient.begin(async (tx) => {
      await tx`
        INSERT INTO content.note_authoring_jobs (
          id, title, source_language, state, brief, target_resource_id,
          created_by, updated_by, created_at, updated_at
        ) VALUES (
          ${id}::uuid, ${title}, ${sourceLanguage}, 'brief', ${JSON.stringify(brief)}, null,
          ${actorUserId}::uuid, ${actorUserId}::uuid, now(), now()
        )
      `;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
          'notes_studio.job.created', 'note_authoring_job', ${id}::uuid,
          ${`Created Notes Studio authoring job: ${title}`}, ${JSON.stringify(brief)}
        )
      `;
    });
    res.status(201).json({ job: await loadJob(id) });
  } catch (error) {
    sendError(res, error, 'Unable to create Notes Studio authoring job');
  }
});

router.get('/jobs/:id/sources', requireAdminPermission('content.questions.read'), async (req, res) => {
  try {
    const jobId = uuid(req.params.id, 'Authoring job ID');
    const job = await loadJob(jobId);
    if (!job) throw new NotesStudioError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
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
        document.extraction_metadata AS "extractionMetadata",
        document.failure_reason AS "failureReason",
        link.inclusion_state AS "inclusionState",
        link.relevance_score::float8 AS "relevanceScore",
        link.position,
        link.added_at AS "addedAt"
      FROM content.note_authoring_sources link
      JOIN content.source_documents document ON document.id = link.source_document_id
      WHERE link.job_id = ${jobId}::uuid
      ORDER BY link.position, link.added_at
    `;
    res.json({ job, sources: rows });
  } catch (error) {
    sendError(res, error, 'Unable to load Notes Studio source pack');
  }
});

router.post('/jobs/:id/sources/url', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new NotesStudioError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.id, 'Authoring job ID');
    if (!await loadJob(jobId)) throw new NotesStudioError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
    const url = assertPublicHttpsUrl(text(req.body?.url, 2000));
    const declaredTitle = text(req.body?.title, 300);
    const publisher = text(req.body?.publisher, 240);
    const basis = rightsBasis(req.body?.rightsBasis);

    if (basis === 'reference_only') {
      const hash = referenceOnlyUrlContentHash(url);
      const duplicate = await sourceAlreadyAttached(jobId, hash);
      if (duplicate) {
        res.json({ source: duplicate, duplicate: true, job: await loadJob(jobId) });
        return;
      }
      const sourceId = await attachSource({
        jobId,
        actorUserId,
        sourceType: 'web',
        sourceUri: url,
        title: declaredTitle || new URL(url).hostname,
        publisher,
        mimeType: null,
        contentHash: hash,
        rightsBasis: basis,
        retainedText: null,
        extractionMetadata: {
          extractorVersion: 'notes-web-reference-metadata-v1',
          fingerprintVersion: 'notes-reference-url-v1',
          fetchAttempted: false,
          bodyRetained: false,
          rawHtmlPersisted: false,
          retainedCharCount: 0,
        },
      });
      res.status(201).json({ sourceId, job: await loadJob(jobId), duplicate: false });
      return;
    }

    const response = await fetch(url, {
      headers: { accept: 'text/html,application/xhtml+xml,text/plain;q=0.9', 'user-agent': 'Examtree-Notes-Studio/1.0' },
      redirect: 'error',
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) throw new NotesStudioError('SOURCE_FETCH_FAILED', `Source URL returned HTTP ${response.status}.`, 502);
    const declaredLength = Number(response.headers.get('content-length') ?? 0);
    if (declaredLength > MAX_WEB_BYTES) throw new NotesStudioError('SOURCE_TOO_LARGE', 'Source page is larger than the ingestion limit.', 413);
    const body = Buffer.from(await response.arrayBuffer());
    if (body.byteLength > MAX_WEB_BYTES) throw new NotesStudioError('SOURCE_TOO_LARGE', 'Source page is larger than the ingestion limit.', 413);
    const contentType = String(response.headers.get('content-type') ?? '').toLowerCase();
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml') && !contentType.includes('text/plain')) {
      throw new NotesStudioError('UNSUPPORTED_SOURCE_TYPE', 'URL sources must return HTML or plain text. Use PDF upload for documents.');
    }
    const rawBody = body.toString('utf8');
    const extracted = contentType.includes('text/plain') ? rawBody.trim() : extractReadableWebText(rawBody);
    if (extracted.length < 100) throw new NotesStudioError('SOURCE_TEXT_TOO_THIN', 'The source did not contain enough readable text for a Notes Studio source pack.');
    const hash = noteSourceContentHash(extracted);
    const duplicate = await sourceAlreadyAttached(jobId, hash);
    if (duplicate) {
      res.json({ source: duplicate, duplicate: true, job: await loadJob(jobId) });
      return;
    }
    const title = declaredTitle || (contentType.includes('text/html') ? extractWebTitle(rawBody) : '') || new URL(url).hostname;
    const retainedText = extracted.slice(0, MAX_RETAINED_TEXT_CHARS);
    const sourceId = await attachSource({
      jobId,
      actorUserId,
      sourceType: 'web',
      sourceUri: url,
      title,
      publisher,
      mimeType: contentType.split(';')[0] || 'text/html',
      contentHash: hash,
      rightsBasis: basis,
      retainedText,
      extractionMetadata: {
        extractorVersion: 'notes-web-v1',
        bytes: body.byteLength,
        charCount: extracted.length,
        retainedCharCount: retentionModeForRights(basis) === 'extracted_text' ? retainedText.length : 0,
        truncated: extracted.length > retainedText.length,
        rawHtmlPersisted: false,
      },
    });
    res.status(201).json({ sourceId, job: await loadJob(jobId), duplicate: false });
  } catch (error) {
    const normalized = error instanceof Error && !(error instanceof NotesStudioError)
      ? new NotesStudioError('SOURCE_URL_INVALID', error.message)
      : error;
    sendError(res, normalized, 'Unable to attach Notes Studio URL source');
  }
});

router.post(
  '/jobs/:id/sources/pdf',
  requireAdminPermission('content.questions.update'),
  raw({ type: ['application/pdf', 'application/octet-stream'], limit: '30mb' }),
  async (req, res) => {
    try {
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) throw new NotesStudioError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
      const jobId = uuid(req.params.id, 'Authoring job ID');
      if (!await loadJob(jobId)) throw new NotesStudioError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
      if (!Buffer.isBuffer(req.body) || req.body.byteLength === 0) throw new NotesStudioError('PDF_BODY_REQUIRED', 'Send a PDF file as the request body.');
      const basis = rightsBasis(req.query.rightsBasis);
      const fileName = text(req.query.fileName, 240) || 'notes-source.pdf';
      const declaredTitle = text(req.query.title, 300);
      const publisher = text(req.query.publisher, 240);
      const originUrlRaw = text(req.query.originUrl, 2000);
      const originUrl = originUrlRaw ? assertPublicHttpsUrl(originUrlRaw, 'Origin URL') : null;
      const startPage = positiveInteger(req.query.startPage);
      const endPage = positiveInteger(req.query.endPage);
      const forceOcr = String(req.query.forceOcr ?? '').toLowerCase() === 'true';
      const binaryHash = noteSourceContentHash(req.body);
      const duplicate = await sourceAlreadyAttached(jobId, binaryHash);
      if (duplicate) {
        res.json({ source: duplicate, duplicate: true, job: await loadJob(jobId) });
        return;
      }

      const extraction = await ingestPdfBuffer(req.body, { fileName, mimeType: 'application/pdf', startPage, endPage, forceOcr });
      if (extraction.text.trim().length < 100) throw new NotesStudioError('PDF_TEXT_TOO_THIN', 'The selected PDF pages did not yield enough readable text. Try a narrower range or OCR.');
      const retainedText = extraction.text.slice(0, MAX_RETAINED_TEXT_CHARS);
      const sourceId = await attachSource({
        jobId,
        actorUserId,
        sourceType: 'uploaded_pdf',
        sourceUri: originUrl ?? `urn:sha256:${binaryHash}`,
        title: declaredTitle || fileName.replace(/\.pdf$/i, ''),
        publisher,
        mimeType: 'application/pdf',
        contentHash: binaryHash,
        rightsBasis: basis,
        retainedText,
        extractionMetadata: {
          ...extraction.metadata,
          extractorVersion: 'knowledge-pdf-ingestion-v1',
          retainedCharCount: retentionModeForRights(basis) === 'extracted_text' ? retainedText.length : 0,
          truncated: extraction.text.length > retainedText.length,
          rawFilePersisted: false,
        },
      });
      res.status(201).json({ sourceId, job: await loadJob(jobId), duplicate: false, extractionMetadata: extraction.metadata });
    } catch (error) {
      const normalized = error instanceof Error && !(error instanceof NotesStudioError)
        ? new NotesStudioError('PDF_INGESTION_FAILED', error.message)
        : error;
      sendError(res, normalized, 'Unable to attach Notes Studio PDF source');
    }
  },
);

router.patch('/jobs/:jobId/sources/:sourceId', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new NotesStudioError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    const sourceId = uuid(req.params.sourceId, 'Source ID');
    const inclusionState = text(req.body?.inclusionState, 20).toLowerCase();
    if (!['included', 'excluded'].includes(inclusionState)) throw new NotesStudioError('INVALID_INCLUSION_STATE', 'Choose included or excluded.');
    const rows = await sqlClient`
      UPDATE content.note_authoring_sources
      SET inclusion_state = ${inclusionState}, updated_at = now()
      WHERE job_id = ${jobId}::uuid AND source_document_id = ${sourceId}::uuid
      RETURNING source_document_id::text AS id
    `;
    if (!rows[0]) throw new NotesStudioError('SOURCE_NOT_FOUND', 'That source is not attached to this authoring job.', 404);
    await sqlClient`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
        'notes_studio.source.inclusion.changed', 'note_authoring_job', ${jobId}::uuid,
        ${`Changed Notes Studio source inclusion to ${inclusionState}`}, ${JSON.stringify({ sourceId, inclusionState })}
      )
    `;
    await refreshSourceReadiness(jobId, actorUserId);
    res.json({ job: await loadJob(jobId), sourceId, inclusionState });
  } catch (error) {
    sendError(res, error, 'Unable to update Notes Studio source inclusion');
  }
});

router.get('/sources/:sourceId/preview', requireAdminPermission('content.questions.read'), async (req, res) => {
  try {
    const sourceId = uuid(req.params.sourceId, 'Source ID');
    const rows = await sqlClient`
      SELECT
        id::text AS id,
        source_type AS "sourceType",
        source_uri AS "sourceUri",
        title,
        publisher,
        mime_type AS "mimeType",
        content_hash AS "contentHash",
        rights_basis AS "rightsBasis",
        retention_mode AS "retentionMode",
        extraction_status AS "extractionStatus",
        extraction_metadata AS "extractionMetadata",
        extracted_text AS "extractedText",
        failure_reason AS "failureReason",
        captured_at AS "capturedAt"
      FROM content.source_documents
      WHERE id = ${sourceId}::uuid
      LIMIT 1
    `;
    const source = rows[0] as Record<string, unknown> | undefined;
    if (!source) throw new NotesStudioError('SOURCE_NOT_FOUND', 'Notes Studio source not found.', 404);
    const extractedText = typeof source.extractedText === 'string' ? source.extractedText : null;
    delete source.extractedText;
    res.json({
      source: {
        ...source,
        preview: sourcePreview(extractedText),
        previewAvailable: Boolean(extractedText),
      },
    });
  } catch (error) {
    sendError(res, error, 'Unable to load Notes Studio source preview');
  }
});

export default router;
