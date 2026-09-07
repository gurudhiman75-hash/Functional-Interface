import { spawn } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { Router, type IRouter, type NextFunction, type Request, type Response } from 'express';
import multer from 'multer';

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
const MAX_SELECTED_PAGES_PER_PASS = Math.max(
  1,
  Number(process.env.NOTES_STUDIO_V2_MAX_SELECTED_PAGES_PER_PASS) || 96,
);
const WORKER_TIMEOUT_MS = Number(process.env.NOTES_STUDIO_V2_PDF_WORKER_TIMEOUT_MS) || 180_000;
const WORKER_HEAP_MB = Math.max(64, Number(process.env.NOTES_STUDIO_V2_PDF_WORKER_HEAP_MB) || 128);
const WORKER_OUTPUT_LIMIT = 32 * 1024 * 1024;
const workerScript = path.resolve(process.cwd(), 'artifacts/api-server/notes-studio-v2-pdf-worker.mjs');

const pdfUpload = multer({
  dest: os.tmpdir(),
  limits: { fileSize: maxPdfBytes, files: 1 },
});

class NotesStudioV2PdfError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

type WorkerResult = {
  mode: 'text' | 'ocr';
  totalPages: number | null;
  startPage: number;
  endPage: number;
  selectedPageCount: number;
  text: string;
  extractionQuality: 'high' | 'medium' | 'low';
  charCount: number;
  wordCount: number;
  ocrUsed: boolean;
  ocrPages: number[];
  warnings: string[];
};

type PageRange = {
  startPage: number;
  endPage: number;
};

type PdfSegment = {
  startPage: number;
  endPage: number;
  text: string;
  metadata: {
    selectedPageCount: number;
    extractionQuality: 'high' | 'medium' | 'low';
    ocrUsed: boolean;
    ocrPages: number[];
    charCount: number;
    wordCount: number;
    warnings: string[];
  };
};

type PersistedFact = ExtractedFactCandidate & { id: string; subCategoryId: string };

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

function parsePageRanges(value: unknown, totalPages: number): PageRange[] {
  const raw = text(value, 2000);
  if (!raw) return [{ startPage: 1, endPage: totalPages }];

  const tokens = raw.split(/[,;\n]+/).map((item) => item.trim()).filter(Boolean);
  if (tokens.length === 0) {
    throw new NotesStudioV2PdfError('PDF_PAGE_RANGES_REQUIRED', 'Enter at least one relevant PDF page or page range.', 422);
  }

  const parsed = tokens.map((token) => {
    const match = token.match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) {
      throw new NotesStudioV2PdfError(
        'PDF_PAGE_RANGE_INVALID',
        `Invalid page range "${token}". Use values such as 42-67, 103-118, 221-236.`,
        422,
      );
    }
    const startPage = Number(match[1]);
    const endPage = Number(match[2] ?? match[1]);
    if (!Number.isSafeInteger(startPage) || !Number.isSafeInteger(endPage)
      || startPage < 1 || endPage < startPage || endPage > totalPages) {
      throw new NotesStudioV2PdfError(
        'PDF_PAGE_RANGE_INVALID',
        `Page range ${token} is outside this PDF. Valid pages are 1-${totalPages}.`,
        422,
      );
    }
    return { startPage, endPage };
  }).sort((a, b) => a.startPage - b.startPage || a.endPage - b.endPage);

  const merged: PageRange[] = [];
  for (const range of parsed) {
    const previous = merged.at(-1);
    if (previous && range.startPage <= previous.endPage + 1) {
      previous.endPage = Math.max(previous.endPage, range.endPage);
    } else {
      merged.push({ ...range });
    }
  }

  const selectedPageCount = merged.reduce((sum, range) => sum + range.endPage - range.startPage + 1, 0);
  if (selectedPageCount > MAX_SELECTED_PAGES_PER_PASS) {
    throw new NotesStudioV2PdfError(
      'PDF_PAGE_SELECTION_TOO_LARGE',
      `Select at most ${MAX_SELECTED_PAGES_PER_PASS} relevant pages per extraction pass. You can upload the same PDF again with additional ranges; it remains one corpus source.`,
      422,
    );
  }

  return merged;
}

function splitPageRanges(ranges: PageRange[], pageSize: number): PageRange[] {
  const segments: PageRange[] = [];
  for (const range of ranges) {
    for (let startPage = range.startPage; startPage <= range.endPage; startPage += pageSize) {
      segments.push({
        startPage,
        endPage: Math.min(range.endPage, startPage + pageSize - 1),
      });
    }
  }
  return segments;
}

function sendError(res: Response, error: unknown) {
  if (error instanceof NotesStudioV2PdfError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error('[notes-studio-v2:pdf] unexpected ingestion failure', error);
  res.status(500).json({ error: 'Unable to ingest Notes Studio v2 PDF source.', code: 'NOTES_STUDIO_V2_PDF_FAILED' });
}

function receivePdf(req: Request, res: Response, next: NextFunction) {
  pdfUpload.single('file')(req, res, (error: unknown) => {
    if (!error) return next();
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

async function sha256File(filePath: string) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(filePath)) hash.update(chunk as Buffer);
  return hash.digest('hex');
}

function workerFailure(stderr: string, signal: NodeJS.Signals | null) {
  const detail = `${stderr} ${signal ?? ''}`.trim();
  if (/heap out of memory|allocation failed|ENOMEM|SIGKILL/i.test(detail)) {
    return new NotesStudioV2PdfError(
      'PDF_WORKER_MEMORY_LIMIT',
      'PDF extraction exceeded the isolated worker memory budget. The API stayed online; retry with a smaller/searchable PDF or increase the dedicated worker memory setting.',
      503,
    );
  }
  if (/password|encrypted/i.test(detail)) {
    return new NotesStudioV2PdfError('PDF_PASSWORD_PROTECTED', 'This PDF is password-protected or encrypted. Upload an unlocked copy.', 422);
  }
  if (/outside this PDF|startPage|endPage/i.test(detail)) {
    return new NotesStudioV2PdfError('PDF_PAGE_RANGE_INVALID', detail.slice(0, 1000), 422);
  }
  return new NotesStudioV2PdfError('PDF_PARSE_FAILED', 'The PDF could not be parsed in the isolated worker.', 422);
}

function runWorker(mode: 'text' | 'ocr', filePath: string, startPage: number, endPage: number) {
  return new Promise<WorkerResult>((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [`--max-old-space-size=${WORKER_HEAP_MB}`, workerScript, mode, filePath, String(startPage), String(endPage)],
      {
        cwd: process.cwd(),
        env: { ...process.env, NODE_OPTIONS: '' },
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    );
    const stdout: Buffer[] = [];
    const stderr: Buffer[] = [];
    let outputBytes = 0;
    let settled = false;
    const finishReject = (error: unknown) => {
      if (settled) return;
      settled = true;
      reject(error);
    };
    const timeout = setTimeout(() => {
      child.kill('SIGKILL');
      finishReject(new NotesStudioV2PdfError('PDF_WORKER_TIMEOUT', `PDF ${mode} worker exceeded ${Math.round(WORKER_TIMEOUT_MS / 1000)} seconds.`, 504));
    }, WORKER_TIMEOUT_MS);

    child.stdout.on('data', (chunk) => {
      const buffer = Buffer.from(chunk);
      outputBytes += buffer.length;
      if (outputBytes > WORKER_OUTPUT_LIMIT) {
        child.kill('SIGKILL');
        finishReject(new NotesStudioV2PdfError('PDF_WORKER_OUTPUT_LIMIT', 'PDF extraction produced more text than the safe worker response limit.', 422));
        return;
      }
      stdout.push(buffer);
    });
    child.stderr.on('data', (chunk) => stderr.push(Buffer.from(chunk)));
    child.on('error', (error) => {
      clearTimeout(timeout);
      finishReject(error);
    });
    child.on('close', (code, signal) => {
      clearTimeout(timeout);
      if (settled) return;
      if (code !== 0) {
        finishReject(workerFailure(Buffer.concat(stderr).toString('utf8').slice(-16000), signal));
        return;
      }
      try {
        settled = true;
        resolve(JSON.parse(Buffer.concat(stdout).toString('utf8')) as WorkerResult);
      } catch (error) {
        finishReject(new NotesStudioV2PdfError('PDF_WORKER_INVALID_RESPONSE', 'PDF worker returned an invalid extraction response.', 502));
      }
    });
  });
}

async function inspectTotalPages(filePath: string) {
  const probe = await runWorker('text', filePath, 1, 1);
  const totalPages = Number(probe.totalPages ?? 0);
  if (!Number.isInteger(totalPages) || totalPages < 1) {
    throw new NotesStudioV2PdfError('PDF_EMPTY', 'The PDF does not contain readable pages.', 422);
  }
  return totalPages;
}

async function extractReadableSegments(filePath: string, forceOcr: boolean, requestedPageRanges: unknown) {
  const totalPages = await inspectTotalPages(filePath);
  const selectedRanges = parsePageRanges(requestedPageRanges, totalPages);
  const queue = splitPageRanges(selectedRanges, TEXT_SEGMENT_PAGES);
  const segments: PdfSegment[] = [];

  while (queue.length > 0) {
    const range = queue.shift()!;
    const digital = await runWorker('text', filePath, range.startPage, range.endPage);
    const needsOcr = forceOcr || digital.extractionQuality === 'low' || digital.text.trim().length < 100;

    if (needsOcr && digital.selectedPageCount > OCR_SEGMENT_PAGES) {
      queue.unshift(...splitPageRanges([range], OCR_SEGMENT_PAGES));
      continue;
    }

    let selected = digital;
    if (needsOcr) {
      const ocr = await runWorker('ocr', filePath, range.startPage, range.endPage);
      if (ocr.extractionQuality !== 'low' && ocr.text.trim().length >= 100) selected = ocr;
    }

    if (selected.extractionQuality === 'low' || selected.text.trim().length < 100) {
      throw new NotesStudioV2PdfError(
        'PDF_TEXT_UNREADABLE',
        `PDF pages ${range.startPage}-${range.endPage} did not yield reliable text. Use a searchable/text-layer PDF or a clearer scan.`,
        422,
      );
    }

    segments.push({
      startPage: range.startPage,
      endPage: range.endPage,
      text: selected.text.trim(),
      metadata: {
        selectedPageCount: selected.selectedPageCount,
        extractionQuality: selected.extractionQuality,
        ocrUsed: selected.ocrUsed,
        ocrPages: selected.ocrPages ?? [],
        charCount: selected.charCount,
        wordCount: selected.wordCount,
        warnings: selected.warnings ?? [],
      },
    });
  }

  return {
    totalPages,
    selectedRanges,
    selectedPageCount: selectedRanges.reduce((sum, range) => sum + range.endPage - range.startPage + 1, 0),
    segments: segments.sort((a, b) => a.startPage - b.startPage),
  };
}

async function loadPeriodTaxonomy(periodId: string) {
  const [periodRows, taxonomyRows] = await Promise.all([
    sqlClient`SELECT id::text AS id, name FROM notes_studio_v2.periods WHERE id = ${periodId}::uuid LIMIT 1`,
    sqlClient`SELECT id::text AS id, name, order_index AS "orderIndex" FROM notes_studio_v2.period_sub_categories WHERE period_id = ${periodId}::uuid ORDER BY order_index, name`,
  ]);
  if (!periodRows[0]) throw new NotesStudioV2PdfError('PERIOD_NOT_FOUND', 'Period not found.', 404);
  if (taxonomyRows.length === 0) throw new NotesStudioV2PdfError('TAXONOMY_REQUIRED', 'Define period sub-categories before ingesting PDF sources.', 409);
  return taxonomyRows.map((row: any) => ({ id: String(row.id), name: String(row.name) }));
}

async function extractCandidates(input: { title: string; taxonomy: Array<{ id: string; name: string }>; segments: PdfSegment[] }) {
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
      candidates.push(...validateExtractedFacts(ai.json, taxonomyNames).map((candidate) => ({
        ...candidate,
        locator: `pages ${segment.startPage}-${segment.endPage}: ${candidate.locator}`,
      })));
    } catch (error) {
      console.error(`[notes-studio-v2:pdf] fact extraction failed for pages ${segment.startPage}-${segment.endPage}`, error);
      throw new NotesStudioV2PdfError(
        'PDF_FACT_EXTRACTION_FAILED',
        `Unable to extract structured facts from PDF pages ${segment.startPage}-${segment.endPage}. No partial corpus data was saved; retry the source.`,
        502,
      );
    }
  }

  if (candidates.length === 0) throw new NotesStudioV2PdfError('PDF_NO_FACTS', 'The PDF was readable, but no valid atomic facts were extracted for the configured taxonomy.', 422);
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
      ORDER BY uploaded_at LIMIT 1
    `;
    const reusedExistingCorpusDoc = Boolean(existingCorpus[0]);
    const corpusDocId = existingCorpus[0] ? String(existingCorpus[0].id) : randomUUID();

    if (!existingCorpus[0]) {
      await tx`
        INSERT INTO notes_studio_v2.corpus_docs (id, period_id, title, source_type, file_path, sub_category_hints)
        VALUES (${corpusDocId}::uuid, ${input.periodId}::uuid, ${input.title}, ${input.sourceType}::notes_studio_v2.source_type, ${filePath}, ${JSON.stringify(input.hints)}::jsonb)
      `;
    }

    const persisted: PersistedFact[] = [];
    for (const candidate of input.candidates) {
      const subCategoryId = subByName.get(candidate.subCategory.toLowerCase());
      if (!subCategoryId) throw new NotesStudioV2PdfError('TAXONOMY_CHANGED', `Sub-category ${candidate.subCategory} no longer exists.`, 409);
      const normalized = normalizeClaim(candidate.claim);
      const existingFact = await tx`
        SELECT id::text AS id FROM notes_studio_v2.facts
        WHERE period_id = ${input.periodId}::uuid
          AND sub_category_id = ${subCategoryId}::uuid
          AND lower(regexp_replace(claim, '[^[:alnum:][:space:]]', ' ', 'g')) = ${normalized}
        LIMIT 1
      `;
      let factId: string;
      if (existingFact[0]) {
        factId = String(existingFact[0].id);
        const independentSource = await tx`
          SELECT 1 FROM notes_studio_v2.fact_source_refs
          WHERE fact_id = ${factId}::uuid AND corpus_doc_id <> ${corpusDocId}::uuid LIMIT 1
        `;
        if (independentSource[0]) {
          await tx`UPDATE notes_studio_v2.facts SET confidence = 'confirmed', updated_at = now() WHERE id = ${factId}::uuid AND confidence = 'single-source'`;
        }
      } else {
        factId = randomUUID();
        await tx`
          INSERT INTO notes_studio_v2.facts (id, period_id, sub_category_id, stable_code, claim, entities, date_or_era, confidence)
          VALUES (${factId}::uuid, ${input.periodId}::uuid, ${subCategoryId}::uuid, ${`NSV2-${randomUUID()}`}, ${candidate.claim}, ${JSON.stringify(candidate.entities)}::jsonb, ${candidate.dateOrEra ?? null}, 'single-source')
        `;
      }
      await tx`
        INSERT INTO notes_studio_v2.fact_source_refs (id, fact_id, corpus_doc_id, locator, extracted_text)
        VALUES (${randomUUID()}::uuid, ${factId}::uuid, ${corpusDocId}::uuid, ${candidate.locator}, ${candidate.extractedText})
        ON CONFLICT (fact_id, corpus_doc_id, locator) DO UPDATE SET extracted_text = EXCLUDED.extracted_text
      `;
      persisted.push({ id: factId, subCategoryId, ...candidate });
    }

    const corpusRow = existingCorpus[0] ?? { id: corpusDocId, title: input.title, sourceType: input.sourceType, subCategoryHints: input.hints };
    return {
      corpusDoc: {
        id: corpusDocId,
        periodId: input.periodId,
        title: String(corpusRow.title ?? input.title),
        sourceType: String(corpusRow.sourceType ?? input.sourceType),
        file: filePath,
        subCategoryHints: Array.isArray(corpusRow.subCategoryHints) ? corpusRow.subCategoryHints : input.hints,
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
    const tempPath = req.file?.path;
    try {
      actorId(req);
      const periodId = uuid(req.params.periodId, 'Period ID');
      const taxonomy = await loadPeriodTaxonomy(periodId);
      if (!req.file?.path || !req.file.size) throw new NotesStudioV2PdfError('FILE_REQUIRED', 'Upload a PDF source.');
      if (req.file.mimetype !== 'application/pdf' && !req.file.originalname.toLowerCase().endsWith('.pdf')) {
        throw new NotesStudioV2PdfError('PDF_REQUIRED', 'Notes Studio v2 currently accepts PDF corpus uploads.');
      }

      const fileName = req.file.originalname || 'notes-studio-v2-source.pdf';
      const title = text(req.body?.title, 300) || fileName.replace(/\.pdf$/i, '');
      const requestedType = text(req.body?.sourceType, 40).toLowerCase();
      const sourceType = sourceTypes.has(requestedType) ? requestedType : 'reference';
      const hints = uniqueStrings(req.body?.subCategoryHints, 30, 180);
      const forceOcr = truthy(req.body?.forceOcr);
      const digest = await sha256File(req.file.path);

      const extracted = await extractReadableSegments(req.file.path, forceOcr, req.body?.pageRanges);
      const ai = await extractCandidates({ title, taxonomy, segments: extracted.segments });
      const persisted = await persistSource({ periodId, title, sourceType, hints, digest, taxonomy, candidates: ai.candidates });
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
            bytes: req.file.size,
            totalPages: extracted.totalPages,
            selectedPageCount: extracted.selectedPageCount,
            selectedRanges: extracted.selectedRanges,
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
        extractionIsolation: 'child-process',
      });
    } catch (error) {
      sendError(res, error);
    } finally {
      if (tempPath) await rm(tempPath, { force: true }).catch((error) => console.warn('[notes-studio-v2:pdf] temp cleanup failed', error));
    }
  },
);

export default router;
