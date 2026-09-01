import { randomUUID } from 'node:crypto';
import { Router, type IRouter, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const editableStates = new Set(['brief', 'sources_ready']);

class SourceMetadataError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new SourceMetadataError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function sendError(res: Response, error: unknown) {
  if (error instanceof SourceMetadataError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error('Unable to update Notes Studio source metadata', error);
  res.status(500).json({ error: 'Unable to update Notes Studio source metadata', code: 'SOURCE_METADATA_FAILED' });
}

router.use(authenticate);

router.patch('/jobs/:jobId/sources/:sourceId/metadata', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new SourceMetadataError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);

    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    const sourceId = uuid(req.params.sourceId, 'Source ID');
    const title = text(req.body?.title, 300);
    const publisher = text(req.body?.publisher, 240);

    if (title.length < 2) throw new SourceMetadataError('SOURCE_TITLE_REQUIRED', 'Enter a clear source title.');

    const rows = await sqlClient`
      SELECT
        job.state,
        document.title,
        document.publisher,
        document.source_uri AS "sourceUri",
        document.rights_basis AS "rightsBasis",
        document.content_hash AS "contentHash",
        (
          SELECT COUNT(*)::int
          FROM content.note_authoring_sources other_link
          WHERE other_link.source_document_id = document.id
        ) AS "linkedJobCount"
      FROM content.note_authoring_jobs job
      JOIN content.note_authoring_sources link ON link.job_id = job.id
      JOIN content.source_documents document ON document.id = link.source_document_id
      WHERE job.id = ${jobId}::uuid
        AND document.id = ${sourceId}::uuid
      LIMIT 1
    `;

    const current = rows[0] as Record<string, unknown> | undefined;
    if (!current) throw new SourceMetadataError('SOURCE_NOT_FOUND', 'That source is not attached to this authoring job.', 404);
    const state = String(current.state ?? '');
    if (!editableStates.has(state)) {
      throw new SourceMetadataError(
        'SOURCE_METADATA_FROZEN',
        'Source metadata is frozen after evidence work begins. Use Research Restart before changing the source pack.',
        409,
      );
    }

    const previous = {
      title: String(current.title ?? ''),
      publisher: String(current.publisher ?? ''),
    };
    const linkedJobCount = Number(current.linkedJobCount ?? 1);

    await sqlClient.begin(async (tx) => {
      await tx`
        UPDATE content.source_documents
        SET title = ${title}, publisher = ${publisher}, updated_at = now()
        WHERE id = ${sourceId}::uuid
      `;
      await tx`
        UPDATE content.note_authoring_sources
        SET updated_at = now()
        WHERE job_id = ${jobId}::uuid AND source_document_id = ${sourceId}::uuid
      `;
      await tx`
        UPDATE content.note_authoring_jobs
        SET updated_by = ${actorUserId}::uuid, updated_at = now()
        WHERE id = ${jobId}::uuid
      `;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
          'notes_studio.source.metadata.updated', 'note_authoring_job', ${jobId}::uuid,
          ${`Updated Notes Studio source metadata: ${title}`},
          ${JSON.stringify({
            sourceId,
            previous,
            next: { title, publisher },
            linkedJobCount,
            provenanceFieldsChanged: false,
            protectedFields: ['sourceUri', 'rightsBasis', 'retentionMode', 'contentHash'],
          })}
        )
      `;
    });

    res.json({
      source: {
        id: sourceId,
        title,
        publisher,
        sourceUri: current.sourceUri,
        rightsBasis: current.rightsBasis,
        contentHash: current.contentHash,
      },
      linkedJobCount,
      sharedMetadata: linkedJobCount > 1,
    });
  } catch (error) {
    sendError(res, error);
  }
});

export default router;
