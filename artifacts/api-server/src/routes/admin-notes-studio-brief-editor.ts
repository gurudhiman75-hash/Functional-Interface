import { randomUUID } from 'node:crypto';
import { Router, type IRouter, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const languagePattern = /^[a-z]{2,8}(?:-[a-z0-9]{2,8})?$/;
const editableStates = new Set(['brief', 'sources_ready']);
const depths = new Set(['quick_revision', 'standard', 'comprehensive']);
const learnerLevels = new Set(['foundation', 'standard', 'advanced']);
const MAX_EXAM_TARGETS = 12;

class BriefEditorError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new BriefEditorError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function examIds(value: unknown): string[] {
  if (value == null) return [];
  if (!Array.isArray(value)) throw new BriefEditorError('INVALID_EXAMS', 'Exam targets must be an array.');
  const ids = [...new Set(value.map((item) => String(item).trim()).filter(Boolean))];
  if (ids.length > MAX_EXAM_TARGETS || ids.some((id) => !uuidPattern.test(id))) {
    throw new BriefEditorError('INVALID_EXAMS', `Choose up to ${MAX_EXAM_TARGETS} valid canonical exams.`);
  }
  return ids;
}

function sendError(res: Response, error: unknown) {
  if (error instanceof BriefEditorError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error('Unable to update Notes Studio brief', error);
  res.status(500).json({ error: 'Unable to update Notes Studio brief', code: 'NOTES_STUDIO_FAILED' });
}

async function validateReferences(sourceLanguage: string, ids: string[]) {
  const languageRows = await sqlClient`
    SELECT id
    FROM catalog.languages
    WHERE lower(code) = ${sourceLanguage} AND is_active = true
    LIMIT 1
  `;
  if (!languageRows[0]) throw new BriefEditorError('SOURCE_LANGUAGE_UNAVAILABLE', 'Choose an active canonical source language.');
  if (ids.length === 0) return;

  const examRows = await sqlClient`
    SELECT exam.id::text AS id
    FROM catalog.exams exam
    JOIN catalog.exam_families family ON family.id = exam.family_id AND family.is_active = true
    JOIN catalog.exam_versions version ON version.exam_id = exam.id AND version.is_current = true
    WHERE exam.id = ANY(${ids}::uuid[]) AND exam.is_active = true
  `;
  const valid = new Set(examRows.map((row) => String(row.id)));
  if (valid.size !== ids.length) throw new BriefEditorError('EXAM_UNAVAILABLE', 'One or more selected exams are no longer active.');
}

router.use(authenticate);

router.patch('/jobs/:id/brief', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new BriefEditorError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);

    const jobId = uuid(req.params.id, 'Authoring job ID');
    const title = text(req.body?.title, 240);
    const topicLabel = text(req.body?.topicLabel, 240);
    const sourceLanguage = text(req.body?.sourceLanguage, 20).toLowerCase() || 'en';
    const depth = text(req.body?.depth, 40).toLowerCase() || 'standard';
    const learnerLevel = text(req.body?.learnerLevel, 40).toLowerCase() || 'standard';
    const syllabusEmphasis = text(req.body?.syllabusEmphasis, 3000);
    const ids = examIds(req.body?.examIds);

    if (title.length < 3) throw new BriefEditorError('TITLE_REQUIRED', 'Enter a clear internal authoring-job title.');
    if (!languagePattern.test(sourceLanguage)) throw new BriefEditorError('INVALID_LANGUAGE', 'Source language is invalid.');
    if (!depths.has(depth)) throw new BriefEditorError('INVALID_DEPTH', 'Choose quick_revision, standard or comprehensive depth.');
    if (!learnerLevels.has(learnerLevel)) throw new BriefEditorError('INVALID_LEARNER_LEVEL', 'Choose foundation, standard or advanced learner level.');

    const rows = await sqlClient`
      SELECT id::text AS id, state, brief
      FROM content.note_authoring_jobs
      WHERE id = ${jobId}::uuid
      LIMIT 1
    `;
    const current = rows[0] as { id: string; state: string; brief: Record<string, unknown> | null } | undefined;
    if (!current) throw new BriefEditorError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
    if (!editableStates.has(current.state)) {
      throw new BriefEditorError('BRIEF_LOCKED', 'The brief is frozen after evidence work begins. Use Research Restart before changing research intent.', 409);
    }

    await validateReferences(sourceLanguage, ids);

    const nextBrief = {
      ...(current.brief && typeof current.brief === 'object' ? current.brief : {}),
      topicLabel,
      depth,
      learnerLevel,
      syllabusEmphasis,
      examIds: ids,
      authoringPolicyVersion: typeof current.brief?.authoringPolicyVersion === 'string'
        ? current.brief.authoringPolicyVersion
        : 'notes-v1',
    };

    let updatedAt: unknown = null;
    await sqlClient.begin(async (tx) => {
      const updated = await tx`
        UPDATE content.note_authoring_jobs
        SET title = ${title},
            source_language = ${sourceLanguage},
            brief = ${JSON.stringify(nextBrief)},
            updated_by = ${actorUserId}::uuid,
            updated_at = now()
        WHERE id = ${jobId}::uuid
          AND state IN ('brief', 'sources_ready')
        RETURNING updated_at AS "updatedAt"
      `;
      if (!updated[0]) throw new BriefEditorError('BRIEF_LOCKED', 'The brief changed state and is no longer editable.', 409);
      updatedAt = updated[0].updatedAt;

      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
          'notes_studio.brief.updated', 'note_authoring_job', ${jobId}::uuid,
          ${`Updated Notes Studio brief: ${title}`},
          ${JSON.stringify({ sourceLanguage, topicLabel, depth, learnerLevel, examTargetCount: ids.length })}
        )
      `;
    });

    res.json({
      job: {
        id: jobId,
        title,
        sourceLanguage,
        state: current.state,
        brief: nextBrief,
        updatedAt,
      },
      briefEditable: true,
    });
  } catch (error) {
    sendError(res, error);
  }
});

export default router;
