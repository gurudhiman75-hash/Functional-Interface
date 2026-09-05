import { createHash, randomUUID } from 'node:crypto';
import { Router, type IRouter, type NextFunction, type Request, type Response } from 'express';
import multer from 'multer';

import { ingestPdfBuffer, type PdfIngestionMetadata } from '../generators/knowledge/pdf-ingestion';
import { requireAdminPermission } from '../lib/admin-rbac';
import { extractWithAI } from '../lib/ai-providers';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';
import {
  buildExtractionRequest,
  validateExtractedFacts,
  type ExtractedFactCandidate,
} from '../notes-studio-v2/core';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const sourceTypes = new Set(['textbook', 'reference', 'academic', 'other']);
const maxPdfBytes = Number(process.env.PDF_MAX_BYTES) || 25 * 1024 * 1024;
const TEXT_SEGMENT_PAGES = 24;
const OCR_SEGMENT_PAGES = 12;

const pdfUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxPdfBytes, files: 1 },
});

class NotesStudioV2PdfError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

type PdfSegment = {
  startPage: number;
  endPage: number;
  text: string;
  metadata: PdfIngestionMetadata;
};

type PersistedFact = ExtractedFactCandidate & {
  id: string;
  subCategoryId: string;
};

function text(value: unknown, max = 500) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string) {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new NotesStudioV2PdfError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function actorId(req: any) {
  const id = req.adminSession?.user.id;
  if (!id) throw new NotesStudioV2PdfError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
  return String(id);
}

function uniqueStrings(value: unknown, maxItems = 50, maxLength = 160) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => text(item, maxLength)).filter(Boolean))].slice(0, maxItems);
}

function normalizeClaim(value: string) {
  return value.toLowerCase().replace(/[^\p{L}\p{N}\s]+/gu, ' ').replace(/\s+/g, ' ').trim();
}

function truthy(value: unknown) {
  return ['1', 'true', 'yes', 'on'].includes(text(value, 16).toLowerCase());
}

function sendError(res: Response, error: unknown) {
  if (error instanceof NotesStudioV2PdfError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error('[notes-studio-v2:pdf] unexpected ingestion failure', error);
  res.status(500).json({
    error: 'Unable to ingest Notes Studio v2 PDF source.',
    code: 'NOTES_STUDIO_V2_PDF_FAILED',
  });
}

function receivePdf(req: Request, res: Response, next: NextFunction) {
  pdfUpload.single('file')(req, res, (error: unknown) => {
    if (!error) {
      next();
      return;
    }
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json({
        error: `PDF is too large. Current safe upload limit is ${Math.round(maxPdfBytes / 1024 / 1024)} MB.`,
        code: 'PDF_TOO_LARGE',
      });
      return;
    }
    console.error('[notes-studio-v2:pdf] upload middleware failed', error);
    res.status(400).json({ error: 'The PDF upload could not be read.', code: 'PDF_UPLOAD_FAILED' });
  });
}

function mapPdfReadFailure(error: unknown): NotesStudioV2PdfError {
  const detail = error instanceof Error ? error.message : String(error ?? '');
  if (/too large/i.test(detail)) {
    return new NotesStudioV2PdfError('PDF_TOO_LARGE', detail, 413);
  }
  if (/password|encrypted/i.test(detail)) {
    return new NotesStudioV2PdfError(
      'PDF_PASSWORD_PROTECTED',
      'This PDF is password-protected or encrypted. Upload an unlocked copy.',
      422,
    );
  }
  if (/outside this PDF|page range|Selected range|startPage|endPage/i.test(detail)) {
    return new NotesStudioV2PdfError('PDF_PAGE_RANGE_INVALID', detail, 422);
  }
  console.error('[notes-studio-v2:pdf] PDF parser failed', error);
  return new NotesStudioV2PdfError(
    'PDF_PARSE_FAILED',
    'The PDF could not be parsed. It may be damaged or use an unsupported PDF encoding.',
    422,
  );
}

async function ingestRange(
  buffer: Buffer,
  input: { fileName: string; startPage: number; endPage: number; forceOcr: boolean },
) {
  try {
    return await ingestPdfBuffer(buffer, {
      fileName: input.fileName,
      mimeType: 'application/pdf',
      startPage: input.startPage,
      endPage: input.endPage,
      forceOcr: input.forceOcr,
    });
  } catch (error) {
    throw mapPdfReadFailure(error);
  }
}

async function inspectTotalPages(buffer: Buffer, fileName: string) {
  try {
    const probe = await ingestPdfBuffer(buffer, {
      fileName,
      mimeType: 'application/pdf',
      startPage: 1,
      endPage: 1,
    });
    const totalPages = Number(probe.metadata.totalPages ?? 0);
    if (!Number.isInteger(totalPages) || totalPages < 1) {
      throw new NotesStudioV2PdfError('PDF_EMPTY', 'The PDF does not contain readable pages.', 422);
    }
    return totalPages;
  } catch (error) {
    if (error instanceof NotesStudioV2PdfError) throw error;
    throw mapPdfReadFailure(error);
  }
}

function rangesFor(totalPages: number, pageSize: number) {
  const ranges: Array<{ startPage: number; endPage: number }> = [];
  for (let startPage = 1; startPage <= totalPages; startPage += pageSize) {
    ranges.push({
      startPage,
      endPage: Math.min(totalPages, startPage + pageSize - 1),
    });
  }
  return ranges;
}

async function extractReadableSegments(buffer: Buffer, fileName: string, forceOcr: boolean) {
  const totalPages = await inspectTotalPages(buffer, fileName);
  const queue = rangesFor(totalPages, TEXT_SEGMENT_PAGES);
  const segments: PdfSegment[] = [];

  while (queue.length > 0) {
    const range = queue.shift()!;
    const extraction = await ingestRange(buffer, { fileName, ...range, forceOcr });
    const selectedCount = Number(extraction.metadata.selectedPageCount ?? (range.endPage - range.startPage + 1));
    const ocrCoveredPages = extraction.metadata.ocrPages?.length ?? 0;
    const incompleteOcr = Boolean(extraction.metadata.ocrUsed && ocrCoveredPages < selectedCount);
    const sourceText = extraction.text.trim();
    const unreliable = sourceText.length < 100 || extraction.metadata.extractionQuality === 'low';

    if ((incompleteOcr || unreliable) && selectedCount > OCR_SEGMENT_PAGES) {
      const smallerRanges = rangesFor(selectedCount, OCR_SEGMENT_PAGES).map((item) => ({
        startPage: range.startPage + item.startPage - 1,
        endPage: range.startPage + item.endPage - 1,
      }));
      queue.unshift(...smallerRanges);
      continue;
    }

    if (incompleteOcr || unreliable) {
      const warnings = (extraction.metadata.warnings ?? []).join(' ');
      console.warn(
        `[notes-studio-v2:pdf] unreadable pages ${range.startPage}-${range.endPage}; ${warnings || 'no parser warning'}`,
      );
      throw new NotesStudioV2PdfError(
        'PDF_TEXT_UNREADABLE',
        `PDF pages ${range.startPage}-${range.endPage} did not yield reliable text. OCR was attempted when needed. Use a searchable/text-layer PDF or a clearer scan.`,
        422,
      );
    }

    segments.push({
      startPage: range.startPage,
      endPage: range.endPage,
      text: sourceText,
      metadata: extraction.metadata,
    });
  }

  return { totalPages, segments: segments.sort((a, b) => a.startPage - b.startPage) };
}

async function loadPeriodTaxonomy(periodId: string) {
  const [periodRows, taxonomyRows] = await Promise.all([
    sqlClient`
      SELECT id::text AS id, name
      FROM notes_studio_v2.periods
      WHERE id = ${periodId}::uuid
      LIMIT 1
    `,
    sqlClient`
      SELECT id::text AS id, name, order_index AS "orderIndex"
      FROM notes_studio_v2.period_sub_categories
      WHERE period_id = ${periodId}::uuid
      ORDER BY order_index, name
    `,
  ]);
  if (!periodRows[0]) throw new NotesStudioV2PdfError('PERIOD_NOT_FOUND', 'Period not found.', 404);
  if (taxonomyRows.length === 0) {
    throw new NotesStudioV2PdfError('TAXONOMY_REQUIRED', 'Define period sub-categories before ingesting PDF sources.', 409);
  }
  return taxonomyRows.map((row: any) => ({ id: String(row.id), name: String(row.name) }));
}

async function extractCandidates(input: {
  title: string;
  taxonomy: Array<{ id: string; name: string }>;
  segments: PdfSegment[];
}) {
  const taxonomyNames = input.taxonomy.map((item) => item.name);
  const candidates: ExtractedFactCandidate[] = [];
  const usage = { inputTokens: 0, outputTokens: 0, totalTokens: 0 };
  let provider = '';
  let model = '';

  for (const segment of input.segments) {
    try {
      const ai = await extractWithAI(buildExtractionRequest({
        sourceTitle: `${input.title} (pages ${segment.startPage}-${segment.endPage})`,
        taxonomy: taxonomyNames,
        sourceText: segment.text,
      }));
      provider ||= ai.provider;
      model ||= ai.model;
      usage.inputTokens += Number(ai.usage?.inputTokens ?? 0);
      usage.outputTokens += Number(ai.usage?.outputTokens ?? 0);
      usage.totalTokens += Number(ai.usage?.totalTokens ?? 0);
      const segmentCandidates = validateExtractedFacts(ai.json, taxonomyNames).map((candidate) => ({
        ...candidate,
        locator: `pages ${segment.startPage}-${segment.endPage}: ${candidate.locator}`,
      }));
      candidates.push(...segmentCandidates);
    } catch (error) {
      console.error(
        `[notes-studio-v2:pdf] fact extraction failed for pages ${segment.startPage}-${segment.endPage}`,
        error,
      );
      throw new NotesStudioV2PdfError(
        'PDF_FACT_EXTRACTION_FAILED',
        `Unable to extract structured facts from PDF pages ${segment.startPage}-${segment.endPage}. No partial corpus data was saved; retry the source.`,
        502,
      );
    }
  }

  if (candidates.length === 0) {
    throw new NotesStudioV2PdfError(
      'PDF_NO_FACTS',
      'The PDF was readable, but no valid atomic facts were extracted for the configured taxonomy.',
      422,
    );
  }

  return { candidates, provider, model, usage };
}

async function persistSource(input: {
  periodId: string;
  title: string;
  sourceType: string;
  hints: string[];
  digest: string;
  taxonomy: Array<{ id: string; name: string }>;
  candidates: ExtractedFactCandidate[];
}) {
  const filePath = `urn:sha256:${input.digest}`;
  const subByName = new Map(input.taxonomy.map((item) => [item.name.toLowerCase(), item.id]));

  return sqlClient.begin(async (tx) => {
    const existingCorpus = await tx`
      SELECT id::text AS id, title, source_type::text AS "sourceType", sub_category_hints AS "subCategoryHints"
      FROM notes_studio_v2.corpus_docs
      WHERE period_id = ${input.periodId}::uuid AND file_path = ${filePath}
      ORDER BY uploaded_at
      LIMIT 1
    `;

    const reusedExistingCorpusDoc = Boolean(existingCorpus[0]);
    const corpusDocId = existingCorpus[0] ? String(existingCorpus[0].id) : randomUUID();

    if (!existingCorpus[0]) {
      await tx`
        INSERT INTO notes_studio_v2.corpus_docs (id, period_id, title, source_type, file_path, sub_category_hints)
        VALUES (
          ${corpusDocId}::uuid,
          ${input.periodId}::uuid,
          ${input.title},
          ${input.sourceType}::notes_studio_v2.source_type,
          ${filePath},
          ${JSON.stringify(input.hints)}::jsonb
        )
      `;
    }

    const persisted: PersistedFact[] = [];
    for (const candidate of input.candidates) {
      const subCategoryId = subByName.get(candidate.subCategory.toLowerCase());
      if (!subCategoryId) {
        throw new NotesStudioV2PdfError(
          'TAXONOMY_CHANGED',
          `Sub-category ${candidate.subCategory} no longer exists.`,
          409,
        );
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
        factId = String(existingFact[0].id);
        const independentSource = await tx`
          SELECT 1
          FROM notes_studio_v2.fact_source_refs
          WHERE fact_id = ${factId}::uuid
            AND corpus_doc_id <> ${corpusDocId}::uuid
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
            ${factId}::uuid,
            ${input.periodId}::uuid,
            ${subCategoryId}::uuid,
            ${`NSV2-${randomUUID()}`},
            ${candidate.claim},
            ${JSON.stringify(candidate.entities)}::jsonb,
            ${candidate.dateOrEra ?? null},
            'single-source'
          )
        `;
      }

      await tx`
        INSERT INTO notes_studio_v2.fact_source_refs (
          id, fact_id, corpus_doc_id, locator, extracted_text
        ) VALUES (
          ${randomUUID()}::uuid,
          ${factId}::uuid,
          ${corpusDocId}::uuid,
          ${candidate.locator},
          ${candidate.extractedText}
        )
        ON CONFLICT (fact_id, corpus_doc_id, locator)
        DO UPDATE SET extracted_text = EXCLUDED.extracted_text
      `;

      persisted.push({ id: factId, subCategoryId, ...candidate });
    }

    const corpusRow = existingCorpus[0] ?? {
      id: corpusDocId,
      title: input.title,
      sourceType: input.sourceType,
      subCategoryHints: input.hints,
    };

    return {
      corpusDoc: {
        id: corpusDocId,
        periodId: input.periodId,
        title: String(corpusRow.title ?? input.title),
        sourceType: String(corpusRow.sourceType ?? input.sourceType),
        file: filePath,
        subCategoryHints: Array.isArray(corpusRow.subCategoryHints)
          ? corpusRow.subCategoryHints
          : input.hints,
      },
      facts: persisted,
      reusedExistingCorpusDoc,
    };
  });
}

router.use(authenticate);

router.post(
  '/periods/:periodId/corpus/upload',
  requireAdminPermission('content.questions.update'),
  receivePdf,
  async (req, res) => {
    try {
      actorId(req);
      const periodId = uuid(req.params.periodId, 'Period ID');
      const taxonomy = await loadPeriodTaxonomy(periodId);
      if (!req.file?.buffer?.length) throw new NotesStudioV2PdfError('FILE_REQUIRED', 'Upload a PDF source.');
      if (req.file.mimetype !== 'application/pdf' && !req.file.originalname.toLowerCase().endsWith('.pdf')) {
        throw new NotesStudioV2PdfError('PDF_REQUIRED', 'Notes Studio v2 currently accepts PDF corpus uploads.');
      }

      const fileName = req.file.originalname || 'notes-studio-v2-source.pdf';
      const title = text(req.body?.title, 300) || fileName.replace(/\.pdf$/i, '');
      const requestedType = text(req.body?.sourceType, 40).toLowerCase();
      const sourceType = sourceTypes.has(requestedType) ? requestedType : 'reference';
      const hints = uniqueStrings(req.body?.subCategoryHints, 30, 180);
      const forceOcr = truthy(req.body?.forceOcr);
      const digest = createHash('sha256').update(req.file.buffer).digest('hex');

      const extracted = await extractReadableSegments(req.file.buffer, fileName, forceOcr);
      const ai = await extractCandidates({ title, taxonomy, segments: extracted.segments });
      const persisted = await persistSource({
        periodId,
        title,
        sourceType,
        hints,
        digest,
        taxonomy,
        candidates: ai.candidates,
      });

      const warnings = [...new Set(extracted.segments.flatMap((segment) => segment.metadata.warnings ?? []))];
      res.status(201).json({
        ...persisted,
        extraction: {
          provider: ai.provider,
          model: ai.model,
          usage: ai.usage,
          metadata: {
            sourceType: 'pdf',
            fileName,
            bytes: req.file.buffer.byteLength,
            totalPages: extracted.totalPages,
            segmentCount: extracted.segments.length,
            segments: extracted.segments.map((segment) => ({
              startPage: segment.startPage,
              endPage: segment.endPage,
              pageCount: segment.metadata.selectedPageCount,
              extractionQuality: segment.metadata.extractionQuality,
              ocrUsed: segment.metadata.ocrUsed,
              ocrPages: segment.metadata.ocrPages,
              charCount: segment.metadata.charCount,
              wordCount: segment.metadata.wordCount,
            })),
            warnings,
          },
        },
        rawFilePersisted: false,
      });
    } catch (error) {
      sendError(res, error);
    }
  },
);

export default router;
