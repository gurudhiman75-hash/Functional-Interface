import { spawn } from 'node:child_process';
import path from 'node:path';

import { extractWithAI } from '../lib/ai-providers';
import {
  buildExtractionRequest,
  validateExtractedFacts,
  type ExtractedFactCandidate,
} from './core';

export const RESUMABLE_EXTRACTION_SEGMENT_PAGES = Math.max(
  1,
  Math.min(12, Number(process.env.NOTES_STUDIO_V2_RESUMABLE_SEGMENT_PAGES) || 12),
);

const WORKER_TIMEOUT_MS = Number(process.env.NOTES_STUDIO_V2_PDF_WORKER_TIMEOUT_MS) || 180_000;
const WORKER_HEAP_MB = Math.max(64, Number(process.env.NOTES_STUDIO_V2_PDF_WORKER_HEAP_MB) || 128);
const WORKER_OUTPUT_LIMIT = 32 * 1024 * 1024;
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

export async function extractPdfSegment(input: {
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

  try {
    const ai = await extractWithAI(buildExtractionRequest({
      sourceTitle: `${input.title} (pages ${input.startPage}-${input.endPage})`,
      taxonomy: input.taxonomy,
      sourceText: selected.text.trim(),
    }));
    const candidates = validateExtractedFacts(ai.json, input.taxonomy).map((candidate) => ({
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
        warnings: selected.warnings ?? [],
      },
    };
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
