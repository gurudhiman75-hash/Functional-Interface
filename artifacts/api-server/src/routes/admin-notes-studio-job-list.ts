import { Router, type IRouter } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';

const router: IRouter = Router();

router.use(authenticate);

/**
 * Lightweight, read-only authoring-job list used by every Notes Studio editor.
 *
 * Keep this route ahead of the legacy Notes Studio router. The older query
 * aggregates source joins in the outer SELECT; this version keeps the job row
 * cardinality independent and derives counters with bounded correlated
 * subqueries. That makes job selection resilient even when source/evidence
 * records evolve independently of the brief row.
 */
router.get('/jobs', requireAdminPermission('content.questions.read'), async (_req, res) => {
  try {
    const rows = await sqlClient`
      SELECT
        job.id::text AS id,
        job.title,
        job.source_language AS "sourceLanguage",
        job.state,
        job.brief,
        job.target_resource_id::text AS "targetResourceId",
        job.created_at AS "createdAt",
        job.updated_at AS "updatedAt",
        (
          SELECT COUNT(*)::int
          FROM content.note_authoring_sources source_link
          WHERE source_link.job_id = job.id
        ) AS "sourceCount",
        (
          SELECT COUNT(*)::int
          FROM content.note_authoring_sources source_link
          WHERE source_link.job_id = job.id
            AND source_link.inclusion_state = 'included'
        ) AS "includedSourceCount",
        (
          SELECT COUNT(*)::int
          FROM content.note_authoring_sources source_link
          JOIN content.source_documents document
            ON document.id = source_link.source_document_id
          WHERE source_link.job_id = job.id
            AND source_link.inclusion_state = 'included'
            AND document.retention_mode = 'extracted_text'
            AND document.extraction_status = 'processed'
            AND LENGTH(COALESCE(document.extracted_text, '')) >= 100
        ) AS "generatableSourceCount"
      FROM content.note_authoring_jobs job
      ORDER BY job.updated_at DESC
      LIMIT 500
    `;

    res.json({ jobs: rows });
  } catch (error) {
    console.error('Unable to load resilient Notes Studio authoring job list', error);
    res.status(500).json({
      error: 'Unable to load Notes Studio authoring jobs',
      code: 'NOTES_STUDIO_JOB_LIST_FAILED',
    });
  }
});

export default router;
