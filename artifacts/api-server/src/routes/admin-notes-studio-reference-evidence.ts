import { randomUUID } from 'node:crypto';
import { Router, type IRouter, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import {
  NotesReferenceEvidenceValidationError,
  referenceEvidenceAllowed,
  validateReferenceEvidenceInput,
} from '../notes-studio/reference-evidence';
import { refreshNotesAuthoringReadiness } from '../notes-studio/readiness';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

class ReferenceEvidenceError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new ReferenceEvidenceError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof ReferenceEvidenceError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  if (error instanceof NotesReferenceEvidenceValidationError) {
    res.status(400).json({ error: error.message, code: error.code });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'NOTES_STUDIO_REFERENCE_EVIDENCE_FAILED' });
}

router.post('/jobs/:jobId/reference-evidence', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new ReferenceEvidenceError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    const sourceId = uuid(req.body?.sourceId, 'Source ID');
    const input = validateReferenceEvidenceInput({
      noteText: req.body?.noteText,
      locatorLabel: req.body?.locatorLabel,
      paraphrasedByEditor: req.body?.paraphrasedByEditor,
    });

    const rows = await sqlClient`
      SELECT
        job.state,
        document.id::text AS "sourceId",
        document.title AS "sourceTitle",
        document.publisher,
        document.source_uri AS "sourceUri",
        document.rights_basis AS "rightsBasis",
        document.retention_mode AS "retentionMode",
        link.inclusion_state AS "inclusionState"
      FROM content.note_authoring_jobs job
      JOIN content.note_authoring_sources link ON link.job_id = job.id
      JOIN content.source_documents document ON document.id = link.source_document_id
      WHERE job.id = ${jobId}::uuid
        AND document.id = ${sourceId}::uuid
      LIMIT 1
    `;
    const source = rows[0];
    if (!source) throw new ReferenceEvidenceError('SOURCE_NOT_FOUND', 'That source is not attached to this Notes Studio job.', 404);
    if (!referenceEvidenceAllowed(source.state)) {
      throw new ReferenceEvidenceError(
        'REFERENCE_EVIDENCE_FROZEN',
        'Reference evidence can be added only before section drafting starts. Use the governed research/revision lifecycle for later evidence changes.',
        409,
      );
    }
    if (source.inclusionState !== 'included') {
      throw new ReferenceEvidenceError('SOURCE_NOT_INCLUDED', 'Include this source before recording reference evidence.', 409);
    }
    if (source.rightsBasis !== 'reference_only' || source.retentionMode !== 'metadata_only') {
      throw new ReferenceEvidenceError(
        'REFERENCE_ONLY_SOURCE_REQUIRED',
        'Editor reference notes are only for metadata-only reference sources. Authorized retained-text sources should use normal evidence rebuild.',
        409,
      );
    }

    const duplicateRows = await sqlClient`
      SELECT id::text AS id
      FROM content.note_source_evidence_blocks
      WHERE job_id = ${jobId}::uuid
        AND source_document_id = ${sourceId}::uuid
        AND excerpt_hash = ${input.excerptHash}
      LIMIT 1
    `;
    if (duplicateRows[0]) {
      res.json({
        created: false,
        duplicate: true,
        evidenceBlockId: String(duplicateRows[0].id),
        evidenceKind: 'editor_reference_note',
        publisherTextRetained: false,
      });
      return;
    }

    const blockId = randomUUID();
    await sqlClient.begin(async (tx) => {
      const blockIndexRows = await tx`
        SELECT COALESCE(MAX(block_index), -1)::int + 1 AS "nextIndex"
        FROM content.note_source_evidence_blocks
        WHERE job_id = ${jobId}::uuid AND source_document_id = ${sourceId}::uuid
      `;
      const blockIndex = Number(blockIndexRows[0]?.nextIndex ?? 0);
      await tx`
        INSERT INTO content.note_source_evidence_blocks (
          id, job_id, source_document_id, block_index, evidence_kind,
          excerpt, excerpt_hash, char_start, char_end, locator,
          reviewed_by, reviewed_at, created_at
        ) VALUES (
          ${blockId}::uuid, ${jobId}::uuid, ${sourceId}::uuid, ${blockIndex}, 'editor_reference_note',
          ${input.noteText}, ${input.excerptHash}, null, null,
          ${JSON.stringify({
            kind: 'editor_reference_note',
            sourceUri: String(source.sourceUri ?? ''),
            locatorLabel: input.locatorLabel,
            editorAuthoredParaphrase: true,
            publisherTextRetained: false,
          })}::jsonb,
          ${actorUserId}::uuid, now(), now()
        )
      `;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
          'notes_studio.reference_evidence.created', 'note_authoring_job', ${jobId}::uuid,
          ${`Recorded editor reference evidence for ${String(source.sourceTitle ?? 'source')}`},
          ${JSON.stringify({
            sourceId,
            evidenceBlockId: blockId,
            locatorLabel: input.locatorLabel,
            evidenceKind: 'editor_reference_note',
            editorAuthoredParaphrase: true,
            publisherTextRetained: false,
            automaticClaimCreation: false,
            automaticAcceptance: false,
          })}::jsonb
        )
      `;
    });

    await refreshNotesAuthoringReadiness(jobId, actorUserId);
    res.status(201).json({
      created: true,
      duplicate: false,
      evidenceBlockId: blockId,
      evidenceKind: 'editor_reference_note',
      sourceId,
      publisherTextRetained: false,
      automaticClaimCreation: false,
      automaticAcceptance: false,
    });
  } catch (error) {
    sendError(res, error, 'Unable to record Notes Studio reference evidence');
  }
});

export default router;
