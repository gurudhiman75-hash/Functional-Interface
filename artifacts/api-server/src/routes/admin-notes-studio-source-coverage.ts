import { Router, type IRouter, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';
import { assessSourceCoverage, normalizeSourceCoverageDepth } from '../notes-studio/source-coverage';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

class SourceCoverageError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new SourceCoverageError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function sendError(res: Response, error: unknown) {
  if (error instanceof SourceCoverageError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error('Unable to assess Notes Studio source coverage', error);
  res.status(500).json({ error: 'Unable to assess Notes Studio source coverage', code: 'NOTES_STUDIO_SOURCE_COVERAGE_FAILED' });
}

router.use(authenticate);

router.get('/jobs/:id/source-coverage', requireAdminPermission('content.questions.read'), async (req, res) => {
  try {
    const jobId = uuid(req.params.id, 'Authoring job ID');
    const jobRows = await sqlClient`
      SELECT id::text AS id, title, state, brief
      FROM content.note_authoring_jobs
      WHERE id = ${jobId}::uuid
      LIMIT 1
    `;
    const job = jobRows[0];
    if (!job) throw new SourceCoverageError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);

    const rows = await sqlClient`
      SELECT
        document.id::text AS id,
        document.source_type AS "sourceType",
        document.source_uri AS "sourceUri",
        NULLIF(document.publisher, '') AS publisher,
        document.rights_basis AS "rightsBasis",
        document.retention_mode AS "retentionMode",
        document.extraction_status AS "extractionStatus",
        LENGTH(COALESCE(document.extracted_text, ''))::int AS "retainedCharCount",
        link.inclusion_state AS "inclusionState"
      FROM content.note_authoring_sources link
      JOIN content.source_documents document ON document.id = link.source_document_id
      WHERE link.job_id = ${jobId}::uuid
      ORDER BY link.position, link.added_at
    `;

    const brief = job.brief && typeof job.brief === 'object' && !Array.isArray(job.brief)
      ? job.brief as Record<string, unknown>
      : {};
    const depth = normalizeSourceCoverageDepth(brief.depth);
    const assessment = assessSourceCoverage(depth, rows.map((row) => ({
      id: String(row.id),
      sourceType: String(row.sourceType ?? ''),
      sourceUri: String(row.sourceUri ?? ''),
      publisher: row.publisher == null ? null : String(row.publisher),
      rightsBasis: String(row.rightsBasis ?? ''),
      retentionMode: String(row.retentionMode ?? ''),
      extractionStatus: String(row.extractionStatus ?? ''),
      retainedCharCount: Number(row.retainedCharCount ?? 0),
      inclusionState: String(row.inclusionState ?? ''),
    })));

    res.json({
      job: { id: String(job.id), title: String(job.title), state: String(job.state), depth },
      assessment,
      advisoryOnly: true,
      rawSourceBodiesReturned: false,
      automaticSourceDiscovery: false,
      automaticSourceAttachment: false,
    });
  } catch (error) {
    sendError(res, error);
  }
});

export default router;
