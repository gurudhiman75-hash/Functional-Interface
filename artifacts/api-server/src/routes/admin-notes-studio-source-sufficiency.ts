import { Router, type IRouter, type NextFunction, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';
import { evaluateSourceSufficiency, type SourceSufficiencyInput } from '../notes-studio/source-sufficiency';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

class SourceSufficiencyError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new SourceSufficiencyError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof SourceSufficiencyError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'NOTES_STUDIO_SOURCE_SUFFICIENCY_FAILED' });
}

function briefDepth(brief: unknown): string {
  if (!brief || typeof brief !== 'object' || Array.isArray(brief)) return 'standard';
  return text((brief as Record<string, unknown>).depth, 40) || 'standard';
}

async function loadSufficiency(jobId: string) {
  const jobRows = await sqlClient`
    SELECT id::text AS id, title, state, brief
    FROM content.note_authoring_jobs
    WHERE id = ${jobId}::uuid
    LIMIT 1
  `;
  const job = jobRows[0];
  if (!job) throw new SourceSufficiencyError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);

  const rows = await sqlClient`
    SELECT
      document.id::text AS id,
      document.source_type AS "sourceType",
      document.source_uri AS "sourceUri",
      document.title,
      document.publisher,
      document.content_hash AS "contentHash",
      document.rights_basis AS "rightsBasis",
      document.retention_mode AS "retentionMode",
      document.extraction_status AS "extractionStatus",
      LENGTH(COALESCE(document.extracted_text, ''))::int AS "retainedCharCount",
      document.captured_at AS "capturedAt"
    FROM content.note_authoring_sources link
    JOIN content.source_documents document ON document.id = link.source_document_id
    WHERE link.job_id = ${jobId}::uuid
      AND link.inclusion_state = 'included'
    ORDER BY link.position, link.added_at
  `;
  const sufficiency = evaluateSourceSufficiency(briefDepth(job.brief), rows as unknown as SourceSufficiencyInput[]);
  return { job, sufficiency };
}

router.use(authenticate);

router.post(
  '/jobs/:jobId/evidence/rebuild',
  requireAdminPermission('content.questions.update'),
  async (req, res, next: NextFunction) => {
    try {
      const jobId = uuid(req.params.jobId, 'Authoring job ID');
      const { sufficiency } = await loadSufficiency(jobId);
      if (sufficiency.status === 'insufficient') {
        res.status(409).json({
          error: 'The source pack does not meet the minimum evidence-build policy for this note depth.',
          code: 'SOURCE_PACK_INSUFFICIENT',
          sufficiency,
          automaticSourceAttachment: false,
          automaticSourceFetch: false,
        });
        return;
      }
      next();
    } catch (error) {
      sendError(res, error, 'Unable to validate Notes Studio source-pack sufficiency');
    }
  },
);

router.get('/jobs/:jobId/source-sufficiency', requireAdminPermission('content.questions.read'), async (req, res) => {
  try {
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    const { job, sufficiency } = await loadSufficiency(jobId);
    res.json({
      job: { id: job.id, title: job.title, state: job.state, depth: sufficiency.depth },
      sufficiency,
      automaticSourceAttachment: false,
      automaticSourceFetch: false,
      automaticEvidenceBuild: false,
    });
  } catch (error) {
    sendError(res, error, 'Unable to evaluate Notes Studio source-pack sufficiency');
  }
});

export default router;
