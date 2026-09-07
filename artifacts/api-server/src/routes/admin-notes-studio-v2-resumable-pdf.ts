import { randomUUID } from 'node:crypto';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { Router, type IRouter, type NextFunction, type Request, type Response } from 'express';
import multer from 'multer';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';
import type { ExtractedFactCandidate } from '../notes-studio-v2/core';
import {
  extractPdfSegment,
  inspectPdfTotalPages,
  PdfSegmentExtractionError,
  RESUMABLE_EXTRACTION_SEGMENT_PAGES,
} from '../notes-studio-v2/resumable-pdf-extraction';
import {
  completeUploadSession,
  createOrResumeUploadSession,
  getUploadSession,
  getUploadSessionForCorpus,
  materializeUploadToFile,
  putUploadChunk,
  RESUMABLE_PDF_CHUNK_SIZE,
  RESUMABLE_PDF_MAX_BYTES,
  ResumablePdfStoreError,
  updateUploadStatus,
} from '../notes-studio-v2/resumable-pdf-store';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const sourceTypes = new Set(['textbook', 'reference', 'academic', 'other']);
const chunkUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: RESUMABLE_PDF_CHUNK_SIZE, files: 1 },
});

class ResumablePdfRouteError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max = 500) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string) {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new ResumablePdfRouteError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function actorId(req: any) {
  const id = req.adminSession?.user.id;
  if (!id) throw new ResumablePdfRouteError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
  return String(id);
}

function uniqueStrings(value: unknown, maxItems = 50, maxLength = 160) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => text(item, maxLength)).filter(Boolean))].slice(0, maxItems);
}

function positiveSafeInteger(value: unknown, label: string) {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new ResumablePdfRouteError('INVALID_UPLOAD_METADATA', `${label} must be a positive integer.`);
  }
  return parsed;
}

function nonNegativeSafeInteger(value: unknown, label: string) {
  const parsed = Number(value);
  if (!Number.isSafeInteger(parsed) || parsed < 0) {
    throw new ResumablePdfRouteError('INVALID_UPLOAD_METADATA', `${label} must be a non-negative integer.`);
  }
  return parsed;
}

function sendError(res: Response, error: unknown) {
  if (error instanceof ResumablePdfRouteError
    || error instanceof ResumablePdfStoreError
    || error instanceof PdfSegmentExtractionError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error('[notes-studio-v2:resumable] unexpected failure', error);
  res.status(500).json({
    error: 'Unable to process the resumable Notes Studio v2 PDF request.',
    code: 'NOTES_STUDIO_V2_RESUMABLE_PDF_FAILED',
  });
}

function receiveChunk(req: Request, res: Response, next: NextFunction) {
  chunkUpload.single('file')(req, res, (error: unknown) => {
    if (!error) return next();
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({
        error: `Upload chunk exceeds the configured ${Math.round(RESUMABLE_PDF_CHUNK_SIZE / 1024 / 1024)} MB chunk size.`,
        code: 'UPLOAD_CHUNK_TOO_LARGE',
      });
      return;
    }
    console.error('[notes-studio-v2:resumable] chunk middleware failed', error);
    res.status(400).json({ error: 'The PDF chunk could not be read.', code: 'UPLOAD_CHUNK_READ_FAILED' });
  });
}

async function loadTaxonomy(periodId: string) {
  const [periodRows, taxonomyRows] = await Promise.all([
    sqlClient`SELECT id::text AS id, name FROM notes_studio_v2.periods WHERE id = ${periodId}::uuid LIMIT 1`,
    sqlClient`
      SELECT id::text AS id, name, order_index AS "orderIndex"
      FROM notes_studio_v2.period_sub_categories
      WHERE period_id = ${periodId}::uuid
      ORDER BY order_index, name
    `,
  ]);
  if (!periodRows[0]) throw new ResumablePdfRouteError('PERIOD_NOT_FOUND', 'Period not found.', 404);
  if (taxonomyRows.length === 0) {
    throw new ResumablePdfRouteError('TAXONOMY_REQUIRED', 'Define period sub-categories before ingesting PDF sources.', 409);
  }
  return taxonomyRows.map((row: any) => ({ id: String(row.id), name: String(row.name) }));
}

function normalizeClaim(value: string) {
  return value.toLowerCase().replace(/[^\p{L}\p{N}\s]+/gu, ' ').replace(/\s+/g, ' ').trim();
}

async function persistCandidates(input: {
  periodId: string;
  corpusDocId: string;
  taxonomy: Array<{ id: string; name: string }>;
  candidates: ExtractedFactCandidate[];
}) {
  const subByName = new Map(input.taxonomy.map((item) => [item.name.toLowerCase(), item.id]));
  const persistedIds: string[] = [];

  await sqlClient.begin(async (tx) => {
    for (const candidate of input.candidates) {
      const subCategoryId = subByName.get(candidate.subCategory.toLowerCase());
      if (!subCategoryId) {
        throw new ResumablePdfRouteError('TAXONOMY_CHANGED', `Sub-category ${candidate.subCategory} no longer exists.`, 409);
      }
      const normalized = normalizeClaim(candidate.claim);
      const existingFact = await tx`
        SELECT id::text AS id
        FROM notes_studio_v2.facts
        WHERE period_id = ${input.periodId}::uuid
          AND sub_category_id = ${subCategoryId}::uuid
          AND lower(regexp_replace(claim, '[^[:alnum:][:space:]]', ' ', 'g')) = ${normalized}
        LIMIT 1
      `;
      let factId: string;
      if (existingFact[0]) {
        factId = String((existingFact[0] as any).id);
        const independentSource = await tx`
          SELECT 1
          FROM notes_studio_v2.fact_source_refs
          WHERE fact_id = ${factId}::uuid AND corpus_doc_id <> ${input.corpusDocId}::uuid
          LIMIT 1
        `;
        if (independentSource[0]) {
          await tx`
            UPDATE notes_studio_v2.facts
            SET confidence = 'confirmed', updated_at = now()
            WHERE id = ${factId}::uuid AND confidence = 'single-source'
          `;
        }
      } else {
        factId = randomUUID();
        await tx`
          INSERT INTO notes_studio_v2.facts (
            id, period_id, sub_category_id, stable_code, claim, entities, date_or_era, confidence
          ) VALUES (
            ${factId}::uuid, ${input.periodId}::uuid, ${subCategoryId}::uuid,
            ${`NSV2-${randomUUID()}`}, ${candidate.claim}, ${JSON.stringify(candidate.entities)}::jsonb,
            ${candidate.dateOrEra ?? null}, 'single-source'
          )
        `;
      }
      await tx`
        INSERT INTO notes_studio_v2.fact_source_refs (id, fact_id, corpus_doc_id, locator, extracted_text)
        VALUES (
          ${randomUUID()}::uuid, ${factId}::uuid, ${input.corpusDocId}::uuid,
          ${candidate.locator}, ${candidate.extractedText}
        )
        ON CONFLICT (fact_id, corpus_doc_id, locator)
        DO UPDATE SET extracted_text = EXCLUDED.extracted_text
      `;
      persistedIds.push(factId);
    }
  });

  return [...new Set(persistedIds)];
}

async function loadCorpusFacts(corpusDocId: string) {
  const rows = await sqlClient`
    SELECT DISTINCT
      fact.id::text AS id,
      fact.period_id::text AS "periodId",
      fact.sub_category_id::text AS "subCategoryId",
      sub.name AS "subCategory",
      fact.claim,
      fact.entities,
      fact.date_or_era AS "dateOrEra",
      fact.confidence::text AS confidence,
      fact.exam_frequency::text AS "examFrequency"
    FROM notes_studio_v2.fact_source_refs ref
    JOIN notes_studio_v2.facts fact ON fact.id = ref.fact_id
    JOIN notes_studio_v2.period_sub_categories sub ON sub.id = fact.sub_category_id
    WHERE ref.corpus_doc_id = ${corpusDocId}::uuid
    ORDER BY fact.id
  `;
  const refs = await sqlClient`
    SELECT fact_id::text AS "factId", corpus_doc_id::text AS "corpusDocId", locator, extracted_text AS "extractedText"
    FROM notes_studio_v2.fact_source_refs
    WHERE corpus_doc_id = ${corpusDocId}::uuid
    ORDER BY fact_id, locator
  `;
  const refsByFact = new Map<string, any[]>();
  for (const ref of refs as any[]) {
    const id = String(ref.factId);
    refsByFact.set(id, [...(refsByFact.get(id) ?? []), {
      corpusDocId: String(ref.corpusDocId),
      locator: String(ref.locator),
      extractedText: ref.extractedText ?? undefined,
    }]);
  }
  return rows.map((row: any) => ({ ...row, sourceRefs: refsByFact.get(String(row.id)) ?? [] }));
}

async function getOrCreateExtractionRun(corpusDocId: string, uploadId: string) {
  const rows = await sqlClient`
    SELECT id::text AS id, status, total_pages AS "totalPages", provider, model, usage
    FROM notes_studio_v2.corpus_extraction_runs
    WHERE corpus_doc_id = ${corpusDocId}::uuid
    ORDER BY created_at DESC
    LIMIT 1
  `;
  if (rows[0]) {
    const run = rows[0] as any;
    if (String(run.status) !== 'ready') {
      await sqlClient`
        UPDATE notes_studio_v2.corpus_extraction_runs
        SET status = 'running', error_code = NULL, error_message = NULL, updated_at = now()
        WHERE id = ${String(run.id)}::uuid
      `;
    }
    return run;
  }
  const id = randomUUID();
  const created = await sqlClient`
    INSERT INTO notes_studio_v2.corpus_extraction_runs (id, corpus_doc_id, upload_id)
    VALUES (${id}::uuid, ${corpusDocId}::uuid, ${uploadId}::uuid)
    RETURNING id::text AS id, status, total_pages AS "totalPages", provider, model, usage
  `;
  return created[0] as any;
}

function errorInfo(error: unknown) {
  if (error instanceof ResumablePdfRouteError
    || error instanceof ResumablePdfStoreError
    || error instanceof PdfSegmentExtractionError) {
    return { code: error.code, message: error.message };
  }
  return { code: 'PDF_EXTRACTION_FAILED', message: error instanceof Error ? error.message : 'Unknown extraction failure.' };
}

async function extractDurableCorpus(corpusDocId: string) {
  const docs = await sqlClient`
    SELECT id::text AS id, period_id::text AS "periodId", title, file_path AS "filePath"
    FROM notes_studio_v2.corpus_docs
    WHERE id = ${corpusDocId}::uuid
    LIMIT 1
  `;
  const doc = docs[0] as any;
  if (!doc) throw new ResumablePdfRouteError('CORPUS_NOT_FOUND', 'Corpus source not found.', 404);

  const session = await getUploadSessionForCorpus(corpusDocId);
  if (!session || !String(doc.filePath).startsWith('pgchunks://notes-studio-v2/')) {
    throw new ResumablePdfRouteError(
      'SOURCE_CONTENT_NOT_RETAINED',
      'This corpus entry predates durable resumable storage. Re-upload it once to enable retryable extraction.',
      409,
    );
  }

  const run = await getOrCreateExtractionRun(corpusDocId, session.id);
  if (String(run.status) === 'ready') {
    return { corpusDocId, facts: await loadCorpusFacts(corpusDocId), reusedExistingExtraction: true };
  }

  const taxonomy = await loadTaxonomy(String(doc.periodId));
  const tempDir = await mkdtemp(path.join(os.tmpdir(), 'notes-v2-pdf-'));
  const pdfPath = path.join(tempDir, 'source.pdf');
  try {
    await updateUploadStatus(session.id, 'extracting');
    await materializeUploadToFile(session, pdfPath);
    const totalPages = await inspectPdfTotalPages(pdfPath);
    await sqlClient`
      UPDATE notes_studio_v2.corpus_extraction_runs
      SET total_pages = ${totalPages}, status = 'running', updated_at = now(), error_code = NULL, error_message = NULL
      WHERE id = ${String(run.id)}::uuid
    `;

    const ranges: Array<{ startPage: number; endPage: number }> = [];
    for (let startPage = 1; startPage <= totalPages; startPage += RESUMABLE_EXTRACTION_SEGMENT_PAGES) {
      ranges.push({ startPage, endPage: Math.min(totalPages, startPage + RESUMABLE_EXTRACTION_SEGMENT_PAGES - 1) });
    }
    for (const range of ranges) {
      await sqlClient`
        INSERT INTO notes_studio_v2.corpus_extraction_segments (run_id, start_page, end_page)
        VALUES (${String(run.id)}::uuid, ${range.startPage}, ${range.endPage})
        ON CONFLICT (run_id, start_page, end_page) DO NOTHING
      `;
    }

    for (const range of ranges) {
      const segmentRows = await sqlClient`
        SELECT status, attempts, candidates, metadata
        FROM notes_studio_v2.corpus_extraction_segments
        WHERE run_id = ${String(run.id)}::uuid
          AND start_page = ${range.startPage} AND end_page = ${range.endPage}
        LIMIT 1
      `;
      const segment = segmentRows[0] as any;
      if (String(segment?.status) === 'ready') continue;

      await sqlClient`
        UPDATE notes_studio_v2.corpus_extraction_segments
        SET status = 'running', attempts = attempts + 1, error_code = NULL, error_message = NULL, updated_at = now()
        WHERE run_id = ${String(run.id)}::uuid
          AND start_page = ${range.startPage} AND end_page = ${range.endPage}
      `;
      try {
        const extracted = await extractPdfSegment({
          filePath: pdfPath,
          startPage: range.startPage,
          endPage: range.endPage,
          title: String(doc.title),
          taxonomy: taxonomy.map((item) => item.name),
        });
        await sqlClient`
          UPDATE notes_studio_v2.corpus_extraction_segments
          SET status = 'ready', candidates = ${JSON.stringify(extracted.candidates)}::jsonb,
              metadata = ${JSON.stringify({
                provider: extracted.provider,
                model: extracted.model,
                usage: extracted.usage,
                ...extracted.metadata,
              })}::jsonb,
              error_code = NULL, error_message = NULL, updated_at = now()
          WHERE run_id = ${String(run.id)}::uuid
            AND start_page = ${range.startPage} AND end_page = ${range.endPage}
        `;
      } catch (error) {
        const info = errorInfo(error);
        await sqlClient`
          UPDATE notes_studio_v2.corpus_extraction_segments
          SET status = 'failed', error_code = ${info.code}, error_message = ${info.message}, updated_at = now()
          WHERE run_id = ${String(run.id)}::uuid
            AND start_page = ${range.startPage} AND end_page = ${range.endPage}
        `;
        throw error;
      }
    }

    const completed = await sqlClient`
      SELECT start_page AS "startPage", end_page AS "endPage", candidates, metadata
      FROM notes_studio_v2.corpus_extraction_segments
      WHERE run_id = ${String(run.id)}::uuid
      ORDER BY start_page
    `;
    if (completed.length !== ranges.length || completed.some((row: any) => !Array.isArray(row.candidates))) {
      throw new ResumablePdfRouteError('PDF_EXTRACTION_INCOMPLETE', 'One or more PDF segments are not checkpointed.', 409);
    }
    const candidates = completed.flatMap((row: any) => row.candidates as ExtractedFactCandidate[]);
    if (candidates.length === 0) {
      throw new ResumablePdfRouteError('PDF_NO_FACTS', 'The PDF was readable, but no valid atomic facts were extracted for the configured taxonomy.', 422);
    }

    const factIds = await persistCandidates({
      periodId: String(doc.periodId),
      corpusDocId,
      taxonomy,
      candidates,
    });
    const usage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
    let provider = '';
    let model = '';
    for (const row of completed as any[]) {
      const metadata = row.metadata && typeof row.metadata === 'object' ? row.metadata : {};
      provider ||= text(metadata.provider, 120);
      model ||= text(metadata.model, 240);
      usage.inputTokens += Number(metadata.usage?.inputTokens ?? 0);
      usage.outputTokens += Number(metadata.usage?.outputTokens ?? 0);
      usage.totalTokens += Number(metadata.usage?.totalTokens ?? 0);
    }

    await sqlClient.begin(async (tx) => {
      await tx`
        UPDATE notes_studio_v2.corpus_extraction_runs
        SET status = 'ready', provider = ${provider || null}, model = ${model || null}, usage = ${JSON.stringify(usage)}::jsonb,
            completed_at = now(), updated_at = now(), error_code = NULL, error_message = NULL
        WHERE id = ${String(run.id)}::uuid
      `;
      await tx`
        UPDATE notes_studio_v2.corpus_extraction_segments
        SET extracted_fact_ids = ${JSON.stringify(factIds)}::jsonb, updated_at = now()
        WHERE run_id = ${String(run.id)}::uuid
      `;
    });
    await updateUploadStatus(session.id, 'ready');
    return { corpusDocId, facts: await loadCorpusFacts(corpusDocId), reusedExistingExtraction: false };
  } catch (error) {
    const info = errorInfo(error);
    await sqlClient`
      UPDATE notes_studio_v2.corpus_extraction_runs
      SET status = 'failed', error_code = ${info.code}, error_message = ${info.message}, updated_at = now()
      WHERE id = ${String(run.id)}::uuid
    `.catch(() => undefined);
    await updateUploadStatus(session.id, 'failed', info).catch(() => undefined);
    throw error;
  } finally {
    await rm(tempDir, { recursive: true, force: true }).catch((error) => {
      console.warn('[notes-studio-v2:resumable] temp cleanup failed', error);
    });
  }
}

router.use(authenticate);

router.post(
  '/periods/:periodId/corpus/uploads',
  requireAdminPermission('content.questions.update'),
  async (req, res) => {
    try {
      const createdBy = actorId(req);
      const periodId = uuid(req.params.periodId, 'Period ID');
      await loadTaxonomy(periodId);
      const fileName = text(req.body?.fileName, 300);
      const mimeType = text(req.body?.mimeType, 120).toLowerCase();
      const totalBytes = positiveSafeInteger(req.body?.size, 'PDF size');
      if (!fileName.toLowerCase().endsWith('.pdf') || (mimeType && mimeType !== 'application/pdf')) {
        throw new ResumablePdfRouteError('PDF_REQUIRED', 'Notes Studio v2 accepts PDF corpus sources only.');
      }
      if (totalBytes > RESUMABLE_PDF_MAX_BYTES) {
        throw new ResumablePdfRouteError(
          'PDF_TOO_LARGE',
          `PDF exceeds the configured ${Math.round(RESUMABLE_PDF_MAX_BYTES / 1024 / 1024)} MB source limit.`,
          413,
        );
      }
      const requestedType = text(req.body?.sourceType, 40).toLowerCase();
      const sourceType = sourceTypes.has(requestedType) ? requestedType : 'reference';
      const idempotencyKey = text(req.get('Idempotency-Key'), 500);
      if (!idempotencyKey) {
        throw new ResumablePdfRouteError('IDEMPOTENCY_KEY_REQUIRED', 'Resumable PDF uploads require an Idempotency-Key header.');
      }
      const session = await createOrResumeUploadSession({
        periodId,
        fileName,
        mimeType: mimeType || 'application/pdf',
        totalBytes,
        sourceType,
        subCategoryHints: uniqueStrings(req.body?.subCategoryHints, 30, 180),
        idempotencyKey,
        createdBy,
      });
      res.status(session.uploadedBytes > 0 ? 200 : 201).json({
        uploadId: session.id,
        corpusDocId: session.corpusDocId,
        chunkSize: session.chunkSize,
        uploadedBytes: session.uploadedBytes,
        expiresAt: session.expiresAt,
        status: session.status,
      });
    } catch (error) {
      sendError(res, error);
    }
  },
);

router.post(
  '/corpus/uploads/:uploadId/chunks/:chunkIndex',
  requireAdminPermission('content.questions.update'),
  receiveChunk,
  async (req, res) => {
    try {
      const adminId = actorId(req);
      const uploadId = uuid(req.params.uploadId, 'Upload ID');
      const chunkIndex = nonNegativeSafeInteger(req.params.chunkIndex, 'Chunk index');
      if (!req.file?.buffer?.length) throw new ResumablePdfRouteError('UPLOAD_CHUNK_REQUIRED', 'Upload chunk is required.');
      const offset = nonNegativeSafeInteger(req.get('X-Chunk-Offset'), 'Chunk offset');
      const declaredChunkSize = positiveSafeInteger(req.get('X-Chunk-Size'), 'Chunk size');
      const totalBytes = positiveSafeInteger(req.get('X-File-Size'), 'File size');
      if (declaredChunkSize !== req.file.buffer.length) {
        throw new ResumablePdfRouteError('UPLOAD_CHUNK_MISMATCH', 'Declared chunk size does not match received bytes.', 409);
      }
      const saved = await putUploadChunk({
        uploadId,
        chunkIndex,
        offset,
        totalBytes,
        data: req.file.buffer,
        actorId: adminId,
      });
      res.json({ uploadId, chunkIndex, uploadedBytes: saved.uploadedBytes, reused: saved.reused, accepted: true });
    } catch (error) {
      sendError(res, error);
    }
  },
);

router.post(
  '/corpus/uploads/:uploadId/complete',
  requireAdminPermission('content.questions.update'),
  async (req, res) => {
    try {
      const adminId = actorId(req);
      const uploadId = uuid(req.params.uploadId, 'Upload ID');
      const result = await completeUploadSession({
        uploadId,
        totalChunks: positiveSafeInteger(req.body?.totalChunks, 'Total chunks'),
        totalBytes: positiveSafeInteger(req.body?.totalBytes, 'Total bytes'),
        actorId: adminId,
      });
      res.json(result);
    } catch (error) {
      sendError(res, error);
    }
  },
);

router.post(
  '/corpus/:corpusDocId/extract',
  requireAdminPermission('content.questions.update'),
  async (req, res) => {
    try {
      actorId(req);
      const corpusDocId = uuid(req.params.corpusDocId, 'Corpus document ID');
      res.json(await extractDurableCorpus(corpusDocId));
    } catch (error) {
      sendError(res, error);
    }
  },
);

export function isResumablePdfRoute(method: string, requestPath: string) {
  if (method !== 'POST') return false;
  return /^\/periods\/[^/]+\/corpus\/uploads\/?$/.test(requestPath)
    || /^\/corpus\/uploads\/[^/]+\/chunks\/\d+\/?$/.test(requestPath)
    || /^\/corpus\/uploads\/[^/]+\/complete\/?$/.test(requestPath)
    || /^\/corpus\/[^/]+\/extract\/?$/.test(requestPath);
}

export default router;
