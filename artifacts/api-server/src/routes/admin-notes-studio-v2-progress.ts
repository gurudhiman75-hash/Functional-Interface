import { Router, type IRouter } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function safeUuid(value: unknown) {
  const id = typeof value === 'string' ? value.trim() : '';
  return uuidPattern.test(id) ? id : null;
}

function numeric(value: unknown) {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

router.get(
  '/corpus/:corpusDocId/progress',
  authenticate,
  requireAdminPermission('content.questions.read'),
  async (req, res) => {
    try {
      const corpusDocId = safeUuid(req.params.corpusDocId);
      if (!corpusDocId) {
        res.status(400).json({ error: 'Corpus document ID is invalid.', code: 'INVALID_ID' });
        return;
      }

      const rows = await sqlClient`
        SELECT
          doc.id::text AS "corpusDocId",
          upload.id::text AS "uploadId",
          upload.status AS "uploadStatus",
          upload.total_bytes AS "totalBytes",
          upload.uploaded_bytes AS "uploadedBytes",
          run.id::text AS "runId",
          run.status AS "extractionStatus",
          run.total_pages AS "totalPages",
          run.error_code AS "errorCode",
          run.error_message AS "errorMessage",
          run.updated_at AS "updatedAt"
        FROM notes_studio_v2.corpus_docs doc
        LEFT JOIN LATERAL (
          SELECT id, status, total_bytes, uploaded_bytes
          FROM notes_studio_v2.corpus_upload_sessions
          WHERE corpus_doc_id = doc.id
          ORDER BY created_at DESC
          LIMIT 1
        ) upload ON true
        LEFT JOIN LATERAL (
          SELECT id, status, total_pages, error_code, error_message, updated_at
          FROM notes_studio_v2.corpus_extraction_runs
          WHERE corpus_doc_id = doc.id
          ORDER BY created_at DESC
          LIMIT 1
        ) run ON true
        WHERE doc.id = ${corpusDocId}::uuid
        LIMIT 1
      `;

      const row = rows[0] as any;
      if (!row) {
        res.status(404).json({ error: 'Corpus source not found.', code: 'CORPUS_NOT_FOUND' });
        return;
      }

      let segmentCount = 0;
      let completedSegments = 0;
      let failedSegments = 0;
      let selectedPages = 0;
      let completedPages = 0;
      let currentStartPage: number | null = null;
      let currentEndPage: number | null = null;
      let candidateCount = 0;

      if (row.runId) {
        const aggregates = await sqlClient`
          SELECT
            COUNT(*)::int AS "segmentCount",
            COUNT(*) FILTER (WHERE status = 'ready')::int AS "completedSegments",
            COUNT(*) FILTER (WHERE status = 'failed')::int AS "failedSegments",
            COALESCE(SUM(end_page - start_page + 1), 0)::int AS "selectedPages",
            COALESCE(SUM(end_page - start_page + 1) FILTER (WHERE status = 'ready'), 0)::int AS "completedPages",
            MIN(start_page) FILTER (WHERE status = 'running')::int AS "currentStartPage",
            MAX(end_page) FILTER (WHERE status = 'running')::int AS "currentEndPage",
            COALESCE(SUM(jsonb_array_length(candidates)) FILTER (WHERE status = 'ready'), 0)::int AS "candidateCount"
          FROM notes_studio_v2.corpus_extraction_segments
          WHERE run_id = ${String(row.runId)}::uuid
        `;
        const aggregate = aggregates[0] as any;
        segmentCount = numeric(aggregate?.segmentCount);
        completedSegments = numeric(aggregate?.completedSegments);
        failedSegments = numeric(aggregate?.failedSegments);
        selectedPages = numeric(aggregate?.selectedPages);
        completedPages = numeric(aggregate?.completedPages);
        currentStartPage = aggregate?.currentStartPage == null ? null : numeric(aggregate.currentStartPage);
        currentEndPage = aggregate?.currentEndPage == null ? null : numeric(aggregate.currentEndPage);
        candidateCount = numeric(aggregate?.candidateCount);
      }

      const totalBytes = numeric(row.totalBytes);
      const uploadedBytes = numeric(row.uploadedBytes);
      const totalPages = numeric(row.totalPages);
      const pageDenominator = selectedPages || totalPages;
      const uploadPercent = totalBytes > 0 ? Math.min(100, Math.floor((uploadedBytes / totalBytes) * 100)) : 0;
      const extractionPercent = pageDenominator > 0
        ? Math.min(100, Math.floor((completedPages / pageDenominator) * 100))
        : 0;
      const status = String(row.extractionStatus || row.uploadStatus || 'registered');

      res.json({
        corpusDocId,
        status,
        uploadStatus: row.uploadStatus ?? null,
        extractionStatus: row.extractionStatus ?? null,
        totalBytes,
        uploadedBytes,
        uploadPercent,
        totalPages,
        selectedPages: pageDenominator,
        completedPages,
        extractionPercent: status === 'ready' ? 100 : extractionPercent,
        segmentCount,
        completedSegments,
        failedSegments,
        currentStartPage,
        currentEndPage,
        candidateCount,
        errorCode: row.errorCode ?? null,
        errorMessage: row.errorMessage ?? null,
        updatedAt: row.updatedAt ?? null,
      });
    } catch (error) {
      console.error('[notes-studio-v2:progress] unable to load extraction progress', error);
      res.status(500).json({
        error: 'Unable to load corpus extraction progress.',
        code: 'NOTES_STUDIO_V2_PROGRESS_FAILED',
      });
    }
  },
);

export default router;
