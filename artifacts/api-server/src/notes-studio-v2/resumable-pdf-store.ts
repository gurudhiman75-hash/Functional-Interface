import { createHash, randomUUID } from 'node:crypto';
import { open } from 'node:fs/promises';

import { sqlClient } from '../lib/db';

export const RESUMABLE_PDF_CHUNK_SIZE = Math.max(
  256 * 1024,
  Math.min(8 * 1024 * 1024, Number(process.env.NOTES_STUDIO_V2_UPLOAD_CHUNK_BYTES) || 4 * 1024 * 1024),
);

export const RESUMABLE_PDF_MAX_BYTES = Math.max(
  RESUMABLE_PDF_CHUNK_SIZE,
  Number(process.env.NOTES_STUDIO_V2_MAX_UPLOAD_BYTES) || 512 * 1024 * 1024,
);

export type ResumablePdfSessionStatus = 'uploading' | 'uploaded' | 'extracting' | 'ready' | 'failed';

export class ResumablePdfStoreError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

export type UploadSession = {
  id: string;
  periodId: string;
  corpusDocId: string;
  fileName: string;
  mimeType: string;
  totalBytes: number;
  chunkSize: number;
  sourceType: string;
  subCategoryHints: string[];
  status: ResumablePdfSessionStatus;
  uploadedBytes: number;
  fileSha256?: string;
  createdBy?: string;
  expiresAt?: string;
};

function toSession(row: any): UploadSession {
  return {
    id: String(row.id),
    periodId: String(row.periodId),
    corpusDocId: String(row.corpusDocId),
    fileName: String(row.fileName),
    mimeType: String(row.mimeType),
    totalBytes: Number(row.totalBytes),
    chunkSize: Number(row.chunkSize),
    sourceType: String(row.sourceType),
    subCategoryHints: Array.isArray(row.subCategoryHints) ? row.subCategoryHints.map(String) : [],
    status: String(row.status) as ResumablePdfSessionStatus,
    uploadedBytes: Number(row.uploadedBytes ?? 0),
    fileSha256: row.fileSha256 ? String(row.fileSha256) : undefined,
    createdBy: row.createdBy ? String(row.createdBy) : undefined,
    expiresAt: row.expiresAt ? new Date(row.expiresAt).toISOString() : undefined,
  };
}

const sessionSelect = `
  id::text AS id,
  period_id::text AS "periodId",
  corpus_doc_id::text AS "corpusDocId",
  file_name AS "fileName",
  mime_type AS "mimeType",
  total_bytes::bigint AS "totalBytes",
  chunk_size AS "chunkSize",
  source_type::text AS "sourceType",
  sub_category_hints AS "subCategoryHints",
  status,
  uploaded_bytes::bigint AS "uploadedBytes",
  file_sha256 AS "fileSha256",
  created_by AS "createdBy",
  expires_at AS "expiresAt"
`;

export async function getUploadSession(uploadId: string): Promise<UploadSession | null> {
  const rows = await sqlClient.unsafe(
    `SELECT ${sessionSelect} FROM notes_studio_v2.corpus_upload_sessions WHERE id = $1::uuid LIMIT 1`,
    [uploadId],
  );
  return rows[0] ? toSession(rows[0]) : null;
}

export async function getUploadSessionForCorpus(corpusDocId: string): Promise<UploadSession | null> {
  const rows = await sqlClient.unsafe(
    `SELECT ${sessionSelect} FROM notes_studio_v2.corpus_upload_sessions WHERE corpus_doc_id = $1::uuid ORDER BY created_at DESC LIMIT 1`,
    [corpusDocId],
  );
  return rows[0] ? toSession(rows[0]) : null;
}

export async function createOrResumeUploadSession(input: {
  periodId: string;
  fileName: string;
  mimeType: string;
  totalBytes: number;
  sourceType: string;
  subCategoryHints: string[];
  idempotencyKey: string;
  createdBy: string;
}): Promise<UploadSession> {
  const existing = await sqlClient.unsafe(
    `SELECT ${sessionSelect} FROM notes_studio_v2.corpus_upload_sessions WHERE period_id = $1::uuid AND idempotency_key = $2 LIMIT 1`,
    [input.periodId, input.idempotencyKey],
  );
  if (existing[0]) {
    const session = toSession(existing[0]);
    if (session.fileName !== input.fileName || session.totalBytes !== input.totalBytes || session.mimeType !== input.mimeType) {
      throw new ResumablePdfStoreError(
        'UPLOAD_IDEMPOTENCY_CONFLICT',
        'This idempotency key is already associated with a different PDF.',
        409,
      );
    }
    if (session.status === 'uploading') {
      await sqlClient`
        UPDATE notes_studio_v2.corpus_upload_sessions
        SET expires_at = now() + interval '24 hours', updated_at = now()
        WHERE id = ${session.id}::uuid
      `;
      session.expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    }
    return session;
  }

  const uploadId = randomUUID();
  const corpusDocId = randomUUID();
  const rows = await sqlClient`
    INSERT INTO notes_studio_v2.corpus_upload_sessions (
      id, period_id, corpus_doc_id, file_name, mime_type, total_bytes, chunk_size,
      source_type, sub_category_hints, idempotency_key, created_by
    ) VALUES (
      ${uploadId}::uuid, ${input.periodId}::uuid, ${corpusDocId}::uuid, ${input.fileName}, ${input.mimeType},
      ${input.totalBytes}, ${RESUMABLE_PDF_CHUNK_SIZE}, ${input.sourceType}::notes_studio_v2.source_type,
      ${JSON.stringify(input.subCategoryHints)}::jsonb, ${input.idempotencyKey}, ${input.createdBy}
    )
    RETURNING id::text AS id, period_id::text AS "periodId", corpus_doc_id::text AS "corpusDocId",
      file_name AS "fileName", mime_type AS "mimeType", total_bytes::bigint AS "totalBytes",
      chunk_size AS "chunkSize", source_type::text AS "sourceType", sub_category_hints AS "subCategoryHints",
      status, uploaded_bytes::bigint AS "uploadedBytes", file_sha256 AS "fileSha256",
      created_by AS "createdBy", expires_at AS "expiresAt"
  `;
  return toSession(rows[0]);
}

function expectedChunkSize(session: UploadSession, chunkIndex: number): number {
  const offset = chunkIndex * session.chunkSize;
  if (offset >= session.totalBytes) return 0;
  return Math.min(session.chunkSize, session.totalBytes - offset);
}

async function contiguousUploadedBytes(tx: any, session: UploadSession): Promise<number> {
  const rows = await tx`
    SELECT chunk_index AS "chunkIndex", offset_bytes::bigint AS "offsetBytes", size_bytes AS "sizeBytes"
    FROM notes_studio_v2.corpus_upload_chunks
    WHERE upload_id = ${session.id}::uuid
    ORDER BY chunk_index
  `;
  let contiguous = 0;
  for (const row of rows as any[]) {
    const index = Number(row.chunkIndex);
    const offset = Number(row.offsetBytes);
    const size = Number(row.sizeBytes);
    if (offset !== contiguous || index !== Math.floor(contiguous / session.chunkSize)) break;
    contiguous += size;
  }
  return contiguous;
}

export async function putUploadChunk(input: {
  uploadId: string;
  chunkIndex: number;
  offset: number;
  totalBytes: number;
  data: Buffer;
  actorId: string;
}): Promise<{ uploadedBytes: number; reused: boolean }> {
  const session = await getUploadSession(input.uploadId);
  if (!session) throw new ResumablePdfStoreError('UPLOAD_NOT_FOUND', 'Upload session not found.', 404);
  if (session.createdBy && session.createdBy !== input.actorId) {
    throw new ResumablePdfStoreError('UPLOAD_FORBIDDEN', 'This upload session belongs to another administrator.', 403);
  }
  if (session.status !== 'uploading') {
    throw new ResumablePdfStoreError('UPLOAD_NOT_WRITABLE', `Upload session is ${session.status}.`, 409);
  }
  if (session.expiresAt && Date.parse(session.expiresAt) < Date.now()) {
    throw new ResumablePdfStoreError('UPLOAD_SESSION_EXPIRED', 'Upload session expired. Start or resume the source again.', 410);
  }
  if (input.totalBytes !== session.totalBytes) {
    throw new ResumablePdfStoreError('UPLOAD_FILE_SIZE_MISMATCH', 'Chunk file size does not match the upload session.', 409);
  }
  if (!Number.isInteger(input.chunkIndex) || input.chunkIndex < 0) {
    throw new ResumablePdfStoreError('UPLOAD_CHUNK_INDEX_INVALID', 'Chunk index is invalid.');
  }
  const expectedOffset = input.chunkIndex * session.chunkSize;
  const expectedSize = expectedChunkSize(session, input.chunkIndex);
  if (expectedSize <= 0 || input.offset !== expectedOffset || input.data.length !== expectedSize) {
    throw new ResumablePdfStoreError(
      'UPLOAD_CHUNK_MISMATCH',
      `Chunk ${input.chunkIndex} does not match the expected offset or byte length.`,
      409,
    );
  }

  const digest = createHash('sha256').update(input.data).digest('hex');
  return sqlClient.begin(async (tx) => {
    const existing = await tx`
      SELECT size_bytes AS "sizeBytes", sha256
      FROM notes_studio_v2.corpus_upload_chunks
      WHERE upload_id = ${session.id}::uuid AND chunk_index = ${input.chunkIndex}
      LIMIT 1
    `;
    let reused = false;
    if (existing[0]) {
      if (Number((existing[0] as any).sizeBytes) !== input.data.length || String((existing[0] as any).sha256) !== digest) {
        throw new ResumablePdfStoreError(
          'UPLOAD_CHUNK_CONFLICT',
          `Chunk ${input.chunkIndex} was already committed with different bytes.`,
          409,
        );
      }
      reused = true;
    } else {
      await tx`
        INSERT INTO notes_studio_v2.corpus_upload_chunks (
          upload_id, chunk_index, offset_bytes, size_bytes, sha256, data
        ) VALUES (
          ${session.id}::uuid, ${input.chunkIndex}, ${input.offset}, ${input.data.length}, ${digest}, ${input.data}
        )
      `;
    }

    const uploadedBytes = await contiguousUploadedBytes(tx, session);
    await tx`
      UPDATE notes_studio_v2.corpus_upload_sessions
      SET uploaded_bytes = ${uploadedBytes}, updated_at = now(), expires_at = now() + interval '24 hours',
          error_code = NULL, error_message = NULL
      WHERE id = ${session.id}::uuid
    `;
    return { uploadedBytes, reused };
  });
}

export async function completeUploadSession(input: {
  uploadId: string;
  totalChunks: number;
  totalBytes: number;
  actorId: string;
}) {
  const session = await getUploadSession(input.uploadId);
  if (!session) throw new ResumablePdfStoreError('UPLOAD_NOT_FOUND', 'Upload session not found.', 404);
  if (session.createdBy && session.createdBy !== input.actorId) {
    throw new ResumablePdfStoreError('UPLOAD_FORBIDDEN', 'This upload session belongs to another administrator.', 403);
  }
  if (input.totalBytes !== session.totalBytes) {
    throw new ResumablePdfStoreError('UPLOAD_FILE_SIZE_MISMATCH', 'Final byte count does not match the upload session.', 409);
  }
  const expectedChunks = Math.ceil(session.totalBytes / session.chunkSize);
  if (input.totalChunks !== expectedChunks) {
    throw new ResumablePdfStoreError('UPLOAD_CHUNK_COUNT_MISMATCH', 'Final chunk count does not match the upload session.', 409);
  }

  return sqlClient.begin(async (tx) => {
    const metadata = await tx`
      SELECT chunk_index AS "chunkIndex", offset_bytes::bigint AS "offsetBytes", size_bytes AS "sizeBytes"
      FROM notes_studio_v2.corpus_upload_chunks
      WHERE upload_id = ${session.id}::uuid
      ORDER BY chunk_index
    `;
    if (metadata.length !== expectedChunks) {
      throw new ResumablePdfStoreError('UPLOAD_INCOMPLETE', `Upload is incomplete (${metadata.length}/${expectedChunks} chunks).`, 409);
    }
    let bytes = 0;
    for (let index = 0; index < metadata.length; index += 1) {
      const row = metadata[index] as any;
      if (Number(row.chunkIndex) !== index || Number(row.offsetBytes) !== bytes || Number(row.sizeBytes) !== expectedChunkSize(session, index)) {
        throw new ResumablePdfStoreError('UPLOAD_CHUNK_MISMATCH', `Stored chunk ${index} failed final verification.`, 409);
      }
      bytes += Number(row.sizeBytes);
    }
    if (bytes !== session.totalBytes) {
      throw new ResumablePdfStoreError('UPLOAD_INCOMPLETE', 'Stored PDF byte count failed final verification.', 409);
    }

    const filePath = `pgchunks://notes-studio-v2/${session.id}`;
    const title = session.fileName.replace(/\.pdf$/i, '') || 'Notes Studio v2 PDF';
    await tx`
      INSERT INTO notes_studio_v2.corpus_docs (
        id, period_id, title, source_type, file_path, sub_category_hints
      ) VALUES (
        ${session.corpusDocId}::uuid, ${session.periodId}::uuid, ${title},
        ${session.sourceType}::notes_studio_v2.source_type, ${filePath}, ${JSON.stringify(session.subCategoryHints)}::jsonb
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        source_type = EXCLUDED.source_type,
        file_path = EXCLUDED.file_path,
        sub_category_hints = EXCLUDED.sub_category_hints
    `;
    await tx`
      UPDATE notes_studio_v2.corpus_upload_sessions
      SET status = 'uploaded', uploaded_bytes = total_bytes, completed_at = COALESCE(completed_at, now()),
          updated_at = now(), error_code = NULL, error_message = NULL
      WHERE id = ${session.id}::uuid
    `;
    const corpusRows = await tx`
      SELECT id::text AS id, period_id::text AS "periodId", title, source_type::text AS "sourceType",
        file_path AS file, sub_category_hints AS "subCategoryHints", uploaded_at AS "uploadedAt"
      FROM notes_studio_v2.corpus_docs WHERE id = ${session.corpusDocId}::uuid LIMIT 1
    `;
    return {
      corpusDoc: corpusRows[0],
      filePath,
      size: session.totalBytes,
      checksum: session.fileSha256,
      status: 'uploaded' as const,
    };
  });
}

export async function materializeUploadToFile(session: UploadSession, destinationPath: string): Promise<string> {
  const handle = await open(destinationPath, 'w', 0o600);
  const hash = createHash('sha256');
  let bytesWritten = 0;
  try {
    const totalChunks = Math.ceil(session.totalBytes / session.chunkSize);
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex += 1) {
      const rows = await sqlClient`
        SELECT data, size_bytes AS "sizeBytes", sha256
        FROM notes_studio_v2.corpus_upload_chunks
        WHERE upload_id = ${session.id}::uuid AND chunk_index = ${chunkIndex}
        LIMIT 1
      `;
      const row = rows[0] as any;
      if (!row) throw new ResumablePdfStoreError('UPLOAD_INCOMPLETE', `Chunk ${chunkIndex} is missing.`, 409);
      const data = Buffer.from(row.data);
      if (data.length !== Number(row.sizeBytes)) {
        throw new ResumablePdfStoreError('OBJECT_VERIFY_FAILED', `Chunk ${chunkIndex} size verification failed.`, 409);
      }
      const chunkDigest = createHash('sha256').update(data).digest('hex');
      if (chunkDigest !== String(row.sha256)) {
        throw new ResumablePdfStoreError('OBJECT_VERIFY_FAILED', `Chunk ${chunkIndex} checksum verification failed.`, 409);
      }
      await handle.write(data, 0, data.length, bytesWritten);
      hash.update(data);
      bytesWritten += data.length;
    }
  } finally {
    await handle.close();
  }
  if (bytesWritten !== session.totalBytes) {
    throw new ResumablePdfStoreError('OBJECT_VERIFY_FAILED', 'Materialized PDF size verification failed.', 409);
  }
  const digest = hash.digest('hex');
  await sqlClient`
    UPDATE notes_studio_v2.corpus_upload_sessions
    SET file_sha256 = ${digest}, updated_at = now()
    WHERE id = ${session.id}::uuid
  `;
  return digest;
}

export async function updateUploadStatus(
  uploadId: string,
  status: ResumablePdfSessionStatus,
  error?: { code: string; message: string },
) {
  await sqlClient`
    UPDATE notes_studio_v2.corpus_upload_sessions
    SET status = ${status}, updated_at = now(),
        error_code = ${error?.code ?? null}, error_message = ${error?.message ?? null}
    WHERE id = ${uploadId}::uuid
  `;
}
