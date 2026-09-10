import { spawn } from 'node:child_process';
import path from 'node:path';

import { extractWithAI } from '../lib/ai-providers';
import {
  buildExtractionRequest,
  validateExtractedFactsWithQuality,
  type ExtractedFactCandidate,
  type ExtractedFactQualityRejection,
} from './core';

export const RESUMABLE_EXTRACTION_SEGMENT_PAGES = Math.max(
  1,
  Math.min(12, Number(process.env.NOTES_STUDIO_V2_RESUMABLE_SEGMENT_PAGES) || 12),
);

const WORKER_TIMEOUT_MS = Number(process.env.NOTES_STUDIO_V2_PDF_WORKER_TIMEOUT_MS) || 180_000;
const WORKER_HEAP_MB = Math.max(64, Number(process.env.NOTES_STUDIO_V2_PDF_WORKER_HEAP_MB) || 128);
const WORKER_OUTPUT_LIMIT = 32 * 1024 * 1024;
const STRUCTURED_RETRY_MIN_PAGES = Math.max(
  1,
  Math.min(6, Number(process.env.NOTES_STUDIO_V2_STRUCTURED_RETRY_MIN_PAGES) || 1),
);
const workerScript = path.resolve(process.cwd(), 'artifacts/api-server/notes-studio-v2-pdf-worker.mjs');

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

export class PdfSegmentExtractionError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 422) {
    super(message);
  }
}

function workerFailure(stderr: string, signal: NodeJS.Signals | null) {
  const detail = `${stderr} ${signal ?? ''}`.trim();
  if (/heap out of memory|allocation failed|ENOMEM|SIGKILL/i.test(detail)) {
    return new PdfSegmentExtractionError(
      'PDF_WORKER_MEMORY_LIMIT',
      'PDF extraction exceeded the isolated worker memory budget. The upload is safe; retry extraction after increasing the worker budget or using a cleaner PDF.',
      503,
    );
  }
  if (/password|encrypted/i.test(detail)) {
    return new PdfSegmentExtractionError('PDF_PASSWORD_PROTECTED', 'This PDF is password-protected or encrypted. Upload an unlocked copy.');
  }
  return new PdfSegmentExtractionError('PDF_PARSE_FAILED', 'The PDF could not be parsed in the isolated worker.');
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

    const rejectOnce = (error: unknown) => {
      if (settled) return;
      settled = true;
      reject(error);
    };
    const timeout = setTimeout(() => {
      child.kill('SIGKILL');
      rejectOnce(new PdfSegmentExtractionError(
        'PDF_WORKER_TIMEOUT',
        `PDF ${mode} worker exceeded ${Math.round(WORKER_TIMEOUT_MS / 1000)} seconds. The uploaded source remains available for retry.`,
        504,
      ));
    }, WORKER_TIMEOUT_MS);

    child.stdout.on('data', (chunk) => {
      const buffer = Buffer.from(chunk);
      outputBytes += buffer.length;
      if (outputBytes > WORKER_OUTPUT_LIMIT) {
        child.kill('SIGKILL');
        rejectOnce(new PdfSegmentExtractionError('PDF_WORKER_OUTPUT_LIMIT', 'PDF extraction produced more text than the safe worker response limit.'));
        return;
      }
      stdout.push(buffer);
    });
    child.stderr.on('data', (chunk) => stderr.push(Buffer.from(chunk)));
    child.on('error', (error) => {
      clearTimeout(timeout);
      rejectOnce(error);
    });
    child.on('close', (code, signal) => {
      clearTimeout(timeout);
      if (settled) return;
      if (code !== 0) {
        rejectOnce(workerFailure(Buffer.concat(stderr).toString('utf8').slice(-16000), signal));
        return;
      }
      try {
        settled = true;
        resolve(JSON.parse(Buffer.concat(stdout).toString('utf8')) as WorkerResult);
      } catch {
        rejectOnce(new PdfSegmentExtractionError('PDF_WORKER_INVALID_RESPONSE', 'PDF worker returned an invalid extraction response.', 502));
      }
    });
  });
}

export async function inspectPdfTotalPages(filePath: string): Promise<number> {
  const probe = await runWorker('text', filePath, 1, 1);
  const totalPages = Number(probe.totalPages ?? 0);
  if (!Number.isInteger(totalPages) || totalPages < 1) {
    throw new PdfSegmentExtractionError('PDF_EMPTY', 'The PDF does not contain readable pages.');
  }
  return totalPages;
}

export type SegmentExtractionResult = {
  candidates: ExtractedFactCandidate[];
  provider: string;
  model: string;
  usage: { inputTokens: number; outputTokens: number; totalTokens: number };
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

type PageRange = { startPage: number; endPage: number };

export function splitRangeForStructuredRetry(
  startPage: number,
  endPage: number,
  minPages = STRUCTURED_RETRY_MIN_PAGES,
): [PageRange, PageRange] | null {
  const pageCount = endPage - startPage + 1;
  if (pageCount <= minPages || startPage >= endPage) return null;
  const leftCount = Math.ceil(pageCount / 2);
  const middle = startPage + leftCount - 1;
  return [
    { startPage, endPage: middle },
    { startPage: middle + 1, endPage },
  ];
}

export function shouldAcceptEmptyFactsAtTerminalRange(
  startPage: number,
  endPage: number,
  minPages = STRUCTURED_RETRY_MIN_PAGES,
) {
  return minPages === 1 && startPage === endPage;
}

function summarizeJsonShape(value: unknown, depth = 0): unknown {
  if (depth >= 2) {
    if (Array.isArray(value)) return { type: 'array', length: value.length };
    if (value && typeof value === 'object') return { type: 'object', keys: Object.keys(value as Record<string, unknown>).slice(0, 12) };
    return typeof value;
  }
  if (Array.isArray(value)) {
    return {
      type: 'array',
      length: value.length,
      sample: value.length > 0 ? summarizeJsonShape(value[0], depth + 1) : null,
    };
  }
  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const keys = Object.keys(record).slice(0, 12);
    return {
      type: 'object',
      keys,
      fields: Object.fromEntries(keys.map((key) => [key, summarizeJsonShape(record[key], depth + 1)])),
    };
  }
  return typeof value;
}

function worstQuality(results: SegmentExtractionResult[]) {
  const rank = { low: 0, medium: 1, high: 2 } as const;
  return results.reduce<'high' | 'medium' | 'low'>((worst, result) => (
    rank[result.metadata.extractionQuality] < rank[worst]
      ? result.metadata.extractionQuality
      : worst
  ), 'high');
}

function combineSegmentResults(
  results: SegmentExtractionResult[],
  original: PageRange,
): SegmentExtractionResult {
  const providers = [...new Set(results.map((result) => result.provider))];
  const models = [...new Set(results.map((result) => result.model))];
  return {
    candidates: results.flatMap((result) => result.candidates),
    provider: providers.length === 1 ? providers[0]! : 'mixed',
    model: models.length === 1 ? models[0]! : 'mixed',
    usage: results.reduce((sum, result) => ({
      inputTokens: sum.inputTokens + result.usage.inputTokens,
      outputTokens: sum.outputTokens + result.usage.outputTokens,
      totalTokens: sum.totalTokens + result.usage.totalTokens,
    }), { inputTokens: 0, outputTokens: 0, totalTokens: 0 }),
    metadata: {
      selectedPageCount: results.reduce((sum, result) => sum + result.metadata.selectedPageCount, 0),
      extractionQuality: worstQuality(results),
      ocrUsed: results.some((result) => result.metadata.ocrUsed),
      ocrPages: [...new Set(results.flatMap((result) => result.metadata.ocrPages))].sort((a, b) => a - b),
      charCount: results.reduce((sum, result) => sum + result.metadata.charCount, 0),
      wordCount: results.reduce((sum, result) => sum + result.metadata.wordCount, 0),
      warnings: [
        `Structured extraction for pages ${original.startPage}-${original.endPage} was retried as smaller page groups after the provider returned invalid schema.`,
        ...results.flatMap((result) => result.metadata.warnings),
      ],
    },
  };
}

function qualityRejectionWarning(rejections: ExtractedFactQualityRejection[]) {
  if (rejections.length === 0) return null;
  const counts = new Map<string, number>();
  for (const rejection of rejections) {
    for (const reason of rejection.reasons) counts.set(reason, (counts.get(reason) ?? 0) + 1);
  }
  const breakdown = [...counts.entries()]
    .map(([reason, count]) => `${reason}=${count}`)
    .join(', ');
  return `Rejected ${rejections.length} non-factual pointer/back-matter candidate${rejections.length === 1 ? '' : 's'} (${breakdown}).`;
}

function allRejectionsAreNavigationMaterial(rejections: ExtractedFactQualityRejection[]) {
  return rejections.length > 0 && rejections.every((rejection) => (
    rejection.reasons.includes('back-matter-locator')
    || rejection.reasons.includes('index-like-evidence')
  ));
}

async function extractPdfSegmentOnce(input: {
  filePath: string;
  startPage: number;
  endPage: number;
  title: string;
  taxonomy: string[];
}): Promise<SegmentExtractionResult> {
  const digital = await runWorker('text', input.filePath, input.startPage, input.endPage);
  const needsOcr = digital.extractionQuality === 'low' || digital.text.trim().length < 100;
  let selected = digital;

  if (needsOcr) {
    const ocr = await runWorker('ocr', input.filePath, input.startPage, input.endPage);
    if (ocr.extractionQuality !== 'low' && ocr.text.trim().length >= 100) selected = ocr;
  }

  if (selected.extractionQuality === 'low' || selected.text.trim().length < 100) {
    throw new PdfSegmentExtractionError(
      'PDF_TEXT_UNREADABLE',
      `PDF pages ${input.startPage}-${input.endPage} did not yield reliable text. The source remains uploaded; replace it only if a retry still fails.`,
    );
  }

  let ai: Awaited<ReturnType<typeof extractWithAI>>;
  try {
    ai = await extractWithAI(buildExtractionRequest({
      sourceTitle: `${input.title} (pages ${input.startPage}-${input.endPage})`,
      taxonomy: input.taxonomy,
      sourceText: selected.text.trim(),
    }));
  } catch (error) {
    console.error(`[notes-studio-v2:resumable] AI provider failed for pages ${input.startPage}-${input.endPage}`, error);
    throw new PdfSegmentExtractionError(
      'PDF_FACT_PROVIDER_FAILED',
      `AI fact extraction failed for PDF pages ${input.startPage}-${input.endPage}. Completed segments are checkpointed and will be skipped on retry.`,
      502,
    );
  }

  let validated: ExtractedFactCandidate[];
  let qualityWarning: string | null = null;
  let terminalEmptyWarning: string | null = null;
  try {
    const quality = validateExtractedFactsWithQuality(ai.json, input.taxonomy);
    validated = quality.candidates;
    qualityWarning = qualityRejectionWarning(quality.rejections);
    if (qualityWarning) console.warn(`[notes-studio-v2:resumable] pages ${input.startPage}-${input.endPage}: ${qualityWarning}`);

    if (validated.length === 0) {
      if (quality.rawCount > 0 && allRejectionsAreNavigationMaterial(quality.rejections)) {
        terminalEmptyWarning = `Readable pages ${input.startPage}-${input.endPage} contained only rejected navigation/back-matter candidates; recorded as no extractable facts.`;
        console.warn(`[notes-studio-v2:resumable] ${terminalEmptyWarning}`);
      } else if (shouldAcceptEmptyFactsAtTerminalRange(input.startPage, input.endPage)) {
        terminalEmptyWarning = `Readable page ${input.startPage} returned a schema-valid empty facts array at the single-page retry floor; recorded as no extractable facts.`;
        console.warn(`[notes-studio-v2:resumable] ${terminalEmptyWarning}`);
      } else {
        throw new Error('Extraction returned no usable factual candidates for readable source pages.');
      }
    }
  } catch (error) {
    console.error(
      `[notes-studio-v2:resumable] structured fact response invalid for pages ${input.startPage}-${input.endPage}`,
      {
        provider: ai.provider,
        model: ai.model,
        error: error instanceof Error ? error.message : String(error),
        jsonShape: summarizeJsonShape(ai.json),
      },
    );
    throw new PdfSegmentExtractionError(
      'PDF_FACT_SCHEMA_INVALID',
      `AI returned invalid structured facts for PDF pages ${input.startPage}-${input.endPage}. The server will retry this checkpoint with smaller internal page groups when possible.`,
      502,
    );
  }

  const candidates = validated.map((candidate) => ({
    ...candidate,
    locator: `pages ${input.startPage}-${input.endPage}: ${candidate.locator}`,
  }));
  return {
    candidates,
    provider: ai.provider,
    model: ai.model,
    usage: {
      inputTokens: Number(ai.usage?.inputTokens ?? 0),
      outputTokens: Number(ai.usage?.outputTokens ?? 0),
      totalTokens: Number(ai.usage?.totalTokens ?? 0),
    },
    metadata: {
      selectedPageCount: selected.selectedPageCount,
      extractionQuality: selected.extractionQuality,
      ocrUsed: selected.ocrUsed,
      ocrPages: selected.ocrPages ?? [],
      charCount: selected.charCount,
      wordCount: selected.wordCount,
      warnings: [
        ...(selected.warnings ?? []),
        ...(ai.warnings ?? []),
        ...(qualityWarning ? [qualityWarning] : []),
        ...(terminalEmptyWarning ? [terminalEmptyWarning] : []),
      ],
    },
  };
}

async function extractPdfSegmentAdaptive(input: {
  filePath: string;
  startPage: number;
  endPage: number;
  title: string;
  taxonomy: string[];
}): Promise<SegmentExtractionResult> {
  try {
    return await extractPdfSegmentOnce(input);
  } catch (error) {
    const split = error instanceof PdfSegmentExtractionError && error.code === 'PDF_FACT_SCHEMA_INVALID'
      ? splitRangeForStructuredRetry(input.startPage, input.endPage)
      : null;
    if (!split) throw error;

    console.warn(
      `[notes-studio-v2:resumable] retrying pages ${input.startPage}-${input.endPage} as ${split[0].startPage}-${split[0].endPage} and ${split[1].startPage}-${split[1].endPage} after invalid structured output.`,
    );

    const results: SegmentExtractionResult[] = [];
    for (const range of split) {
      results.push(await extractPdfSegmentAdaptive({ ...input, ...range }));
    }
    return combineSegmentResults(results, {
      startPage: input.startPage,
      endPage: input.endPage,
    });
  }
}

export async function extractPdfSegment(input: {
  filePath: string;
  startPage: number;
  endPage: number;
  title: string;
  taxonomy: string[];
}): Promise<SegmentExtractionResult> {
  try {
    return await extractPdfSegmentAdaptive(input);
  } catch (error) {
    if (error instanceof PdfSegmentExtractionError) throw error;
    console.error(`[notes-studio-v2:resumable] fact extraction failed for pages ${input.startPage}-${input.endPage}`, error);
    throw new PdfSegmentExtractionError(
      'PDF_FACT_EXTRACTION_FAILED',
      `Unable to extract structured facts from PDF pages ${input.startPage}-${input.endPage}. Completed segments are checkpointed and will be skipped on retry.`,
      502,
    );
  }
}
