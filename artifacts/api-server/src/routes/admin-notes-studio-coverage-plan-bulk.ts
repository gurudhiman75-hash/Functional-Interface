import { randomUUID } from 'node:crypto';
import { Router, type IRouter, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import {
  NotesCoverageBulkValidationError,
  coveragePlanBulkAllowed,
  coveragePlanItemKey,
  normalizeCoveragePlanBulk,
} from '../notes-studio/coverage-plan-bulk';
import { refreshNotesAuthoringReadiness } from '../notes-studio/readiness';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

class CoverageBulkError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new CoverageBulkError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof CoverageBulkError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  if (error instanceof NotesCoverageBulkValidationError) {
    res.status(400).json({ error: error.message, code: error.code });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'NOTES_STUDIO_COVERAGE_BULK_FAILED' });
}

router.post('/jobs/:jobId/coverage/bulk', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new CoverageBulkError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');

    const jobRows = await sqlClient`
      SELECT id::text AS id, title, state
      FROM content.note_authoring_jobs
      WHERE id = ${jobId}::uuid
      LIMIT 1
    `;
    const job = jobRows[0];
    if (!job) throw new CoverageBulkError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
    if (!coveragePlanBulkAllowed(job.state)) {
      throw new CoverageBulkError(
        'COVERAGE_PLAN_FROZEN',
        'Bulk coverage import is available only before section drafting starts. Use the existing revision/research workflow for later scope changes.',
        409,
      );
    }

    const items = normalizeCoveragePlanBulk(req.body?.items);
    const existingRows = await sqlClient`
      SELECT title, syllabus_ref AS "syllabusRef"
      FROM content.note_coverage_plan_items
      WHERE job_id = ${jobId}::uuid
    `;
    const existingKeys = new Set(existingRows.map((row) => coveragePlanItemKey({
      title: String(row.title ?? ''),
      syllabusRef: String(row.syllabusRef ?? ''),
    })));
    const duplicate = items.find((item) => existingKeys.has(coveragePlanItemKey(item)));
    if (duplicate) {
      throw new CoverageBulkError(
        'COVERAGE_ITEM_ALREADY_EXISTS',
        `Coverage target already exists in this job: ${duplicate.title}.`,
        409,
      );
    }

    const itemIds: string[] = [];
    await sqlClient.begin(async (tx) => {
      for (const item of items) {
        const itemId = randomUUID();
        itemIds.push(itemId);
        await tx`
          INSERT INTO content.note_coverage_plan_items (
            id, job_id, title, syllabus_ref, priority, planned_depth, exam_rationale,
            sort_order, created_by, updated_by, created_at, updated_at
          ) VALUES (
            ${itemId}::uuid, ${jobId}::uuid, ${item.title}, ${item.syllabusRef}, ${item.priority},
            ${item.plannedDepth}, ${item.examRationale}, ${item.sortOrder}, ${actorUserId}::uuid,
            ${actorUserId}::uuid, now(), now()
          )
        `;
      }
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
          'notes_studio.coverage.bulk_created', 'note_authoring_job', ${jobId}::uuid,
          ${`Imported ${items.length} Notes Studio coverage targets`},
          ${JSON.stringify({
            itemCount: items.length,
            itemIds,
            priorities: items.reduce<Record<string, number>>((counts, item) => {
              counts[item.priority] = (counts[item.priority] ?? 0) + 1;
              return counts;
            }, {}),
            generatedClaims: false,
            automaticEvidenceMapping: false,
            automaticGeneration: false,
          })}
        )
      `;
    });

    await refreshNotesAuthoringReadiness(jobId, actorUserId);
    res.status(201).json({
      jobId,
      createdCount: items.length,
      itemIds,
      atomic: true,
      generatedClaims: false,
      automaticEvidenceMapping: false,
      automaticGeneration: false,
    });
  } catch (error) {
    sendError(res, error, 'Unable to import Notes Studio coverage plan');
  }
});

export default router;
