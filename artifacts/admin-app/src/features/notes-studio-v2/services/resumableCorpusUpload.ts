import { getFirebaseAuth } from '@/integrations/firebase';
import type { CorpusDoc } from '../domain/types';
import { notesStudioV2Request, type ExtractionResponse } from './api';

const BASE = '/admin/notes-studio-v2';
const configuredBase = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const apiBase = (configuredBase || '/api').replace(/\/$/, '');
const MAX_RETRIES = 4;

interface UploadSession {
  uploadId: string;
  corpusDocId: string;
  chunkSize: number;
  uploadedBytes?: number;
  expiresAt?: string;
  status?: string;
}

interface UploadCompleteResponse {
  corpusDoc: CorpusDoc;
  filePath: string;
  size: number;
  checksum?: string;
  status: 'uploaded';
}

async function getToken() {
  const auth = getFirebaseAuth();
  const user = auth?.currentUser;
  if (!user) throw new Error('Your ExamTree admin session has expired. Sign in again.');
  return user.getIdToken();
}

function normalizePageRanges(value?: string) {
  return (value ?? '')
    .trim()
    .replace(/\s*-\s*/g, '-')
    .replace(/\s*[,;\n]+\s*/g, ',')
    .replace(/^,+|,+$/g, '');
}

function idempotencyKey(periodId: string, file: File, pageRanges?: string) {
  const selection = normalizePageRanges(pageRanges) || 'all-pages';
  return `notes-v2:${periodId}:${file.name}:${file.size}:${file.lastModified}:${selection}`;
}

function assertPdf(file: File) {
  const pdfName = file.name.toLowerCase().endsWith('.pdf');
  const pdfType = file.type === '' || file.type === 'application/pdf';
  if (!pdfName || !pdfType) throw new Error('Notes Studio v2 accepts PDF corpus sources only.');
  if (file.size <= 0) throw new Error('The selected PDF is empty.');
}

function abortError() {
  return new DOMException('The upload was cancelled.', 'AbortError');
}

async function retry<T>(task: () => Promise<T>, signal?: AbortSignal): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    if (signal?.aborted) throw abortError();
    try {
      return await task();
    } catch (error) {
      if (signal?.aborted || (error instanceof DOMException && error.name === 'AbortError')) throw error;
      lastError = error;
      if (attempt === MAX_RETRIES) break;
      await new Promise((resolve) => setTimeout(resolve, Math.min(4000, 500 * 2 ** attempt)));
    }
  }
  throw lastError instanceof Error ? lastError : new Error('PDF chunk upload failed.');
}

async function uploadChunk(
  uploadId: string,
  chunkIndex: number,
  chunk: Blob,
  offset: number,
  totalBytes: number,
  signal?: AbortSignal,
) {
  const token = await getToken();
  const form = new FormData();
  form.append('file', chunk, `chunk-${chunkIndex}.bin`);
  const response = await fetch(`${apiBase}${BASE}/corpus/uploads/${uploadId}/chunks/${chunkIndex}`, {
    method: 'POST',
    signal,
    headers: {
      Authorization: `Bearer ${token}`,
      'Idempotency-Key': `${uploadId}:${chunkIndex}`,
      'X-Chunk-Offset': String(offset),
      'X-Chunk-Size': String(chunk.size),
      'X-File-Size': String(totalBytes),
    },
    body: form,
  });
  const body = await response.json().catch(() => null) as { error?: string } | null;
  if (!response.ok) throw new Error(body?.error || `PDF chunk ${chunkIndex + 1} failed (${response.status}).`);
}

export async function uploadResumableCorpusSource(
  periodId: string,
  fileOrBlob: File | Blob,
  options: { pageRanges?: string; signal?: AbortSignal } = {},
) {
  if (!(fileOrBlob instanceof File)) throw new Error('Resumable Notes Studio v2 uploads require a named PDF file.');
  const file = fileOrBlob;
  assertPdf(file);
  const pageRanges = normalizePageRanges(options.pageRanges) || undefined;
  const key = idempotencyKey(periodId, file, pageRanges);

  const session = await notesStudioV2Request<UploadSession>(`${BASE}/periods/${periodId}/corpus/uploads`, {
    method: 'POST',
    signal: options.signal,
    headers: { 'Idempotency-Key': key },
    body: {
      fileName: file.name,
      mimeType: file.type || 'application/pdf',
      size: file.size,
      sourceType: 'reference',
      pageRanges,
    },
  });

  const chunkSize = Number(session.chunkSize);
  if (!Number.isFinite(chunkSize) || chunkSize <= 0) throw new Error('Upload service returned an invalid chunk size.');
  const totalChunks = Math.ceil(file.size / chunkSize);
  const resumeOffset = Math.min(file.size, Math.max(0, Number(session.uploadedBytes ?? 0)));
  const firstChunk = Math.floor(resumeOffset / chunkSize);

  for (let chunkIndex = firstChunk; chunkIndex < totalChunks; chunkIndex += 1) {
    if (options.signal?.aborted) throw abortError();
    const offset = chunkIndex * chunkSize;
    const end = Math.min(file.size, offset + chunkSize);
    const chunk = file.slice(offset, end, 'application/octet-stream');
    await retry(
      () => uploadChunk(session.uploadId, chunkIndex, chunk, offset, file.size, options.signal),
      options.signal,
    );
  }

  const upload = await notesStudioV2Request<UploadCompleteResponse>(`${BASE}/corpus/uploads/${session.uploadId}/complete`, {
    method: 'POST',
    signal: options.signal,
    headers: { 'Idempotency-Key': `${session.uploadId}:complete` },
    body: { totalChunks, totalBytes: file.size },
  });
  const extraction = await notesStudioV2Request<ExtractionResponse>(`${BASE}/corpus/${upload.corpusDoc.id}/extract`, {
    method: 'POST',
    signal: options.signal,
    body: {},
  });

  return { upload, extraction };
}
