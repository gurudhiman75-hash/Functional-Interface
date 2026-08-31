import { randomUUID } from 'node:crypto';
import { Router, type IRouter, type NextFunction, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';
import {
  NOTE_SOURCE_ROLES,
  evaluateSourcePackPolicy,
  noteSourceIdentity,
  noteSourcePackTemplateKey,
  noteSourceRole,
  sourcePackTemplateOptions,
} from '../notes-studio/source-pack-policy';
import adminNotesStudioCandidateClaimsRouter from './admin-notes-studio-candidate-claims';
import adminNotesStudioCoverageGapResearchRouter from './admin-notes-studio-coverage-gap-research';
import adminNotesStudioCoverageProposalsRouter from './admin-notes-studio-coverage-proposals';
import adminNotesStudioGapSourceRecommendationsRouter from './admin-notes-studio-gap-source-recommendations';
import adminNotesStudioResearchRestartRouter from './admin-notes-studio-research-restart';
import adminNotesStudioSourceDiscoveryRouter from './admin-notes-studio-source-discovery';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

class SourcePolicyError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new SourcePolicyError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof SourcePolicyError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'NOTES_STUDIO_SOURCE_POLICY_FAILED' });
}

async function audit(actorUserId: string, actionKey: string, jobId: string, summary: string, metadata: Record<string, unknown>) {
  await sqlClient`
    INSERT INTO platform.audit_events (
      id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
    ) VALUES (
      ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
      ${actionKey}, 'note_authoring_job', ${jobId}::uuid, ${summary}, ${JSON.stringify(metadata)}
    )
  `;
}

async function loadSourcePolicy(jobId: string) {
  const jobRows = await sqlClient`
    SELECT id::text AS id, title, state, brief
    FROM content.note_authoring_jobs
    WHERE id = ${jobId}::uuid
    LIMIT 1
  `;
  const job = jobRows[0];
  if (!job) throw new SourcePolicyError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
  const sources = await sqlClient`
    SELECT
      document.id::text AS id,
      document.title,
      document.publisher,
      document.source_uri AS "sourceUri",
      document.content_hash AS "contentHash",
      document.rights_basis AS "rightsBasis",
      document.retention_mode AS "retentionMode",
      document.extraction_status AS "extractionStatus",
      LENGTH(COALESCE(document.extracted_text, ''))::int AS "retainedCharCount",
      link.inclusion_state AS "inclusionState",
      link.source_role AS "sourceRole",
      link.position
    FROM content.note_authoring_sources link
    JOIN content.source_documents document ON document.id = link.source_document_id
    WHERE link.job_id = ${jobId}::uuid
    ORDER BY link.position, link.added_at
  `;
  const brief = job.brief && typeof job.brief === 'object' && !Array.isArray(job.brief)
    ? job.brief as Record<string, unknown>
    : {};
  const templateKey = noteSourcePackTemplateKey(brief.sourcePackTemplate);
  const hydrated = sources.map((source) => ({
    ...source,
    sourceRole: noteSourceRole(source.sourceRole),
    sourceIdentity: noteSourceIdentity(source.publisher, source.sourceUri),
    generationReady: source.retentionMode === 'extracted_text'
      && source.extractionStatus === 'processed'
      && Number(source.retainedCharCount ?? 0) >= 100,
  }));
  return {
    job: { ...job, sourcePackTemplate: templateKey },
    sources: hydrated,
    policy: evaluateSourcePackPolicy(templateKey, hydrated.map((source) => ({
      sourceRole: source.sourceRole,
      inclusionState: String(source.inclusionState),
      generationReady: source.generationReady,
      contentHash: String(source.contentHash ?? ''),
      sourceIdentity: source.sourceIdentity,
    }))),
    policyLocked: !['brief', 'sources_ready'].includes(String(job.state)),
  };
}

async function assertPolicyEditable(jobId: string) {
  const rows = await sqlClient`
    SELECT state
    FROM content.note_authoring_jobs
    WHERE id = ${jobId}::uuid
    LIMIT 1
  `;
  if (!rows[0]) throw new SourcePolicyError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
  if (!['brief', 'sources_ready'].includes(String(rows[0].state))) {
    throw new SourcePolicyError(
      'SOURCE_POLICY_FROZEN',
      'Source-pack template and research roles freeze once evidence work begins. Run an explicit research restart before approval, or create a successor revision after approval.',
      409,
    );
  }
}

router.use(authenticate);
router.use(adminNotesStudioCandidateClaimsRouter);
router.use(adminNotesStudioCoverageProposalsRouter);
router.use(adminNotesStudioCoverageGapResearchRouter);
router.use(adminNotesStudioGapSourceRecommendationsRouter);
router.use(adminNotesStudioResearchRestartRouter);
router.use(adminNotesStudioSourceDiscoveryRouter);

router.get('/source-policy/options', requireAdminPermission('content.questions.read'), (_req, res) => {
  res.json({ roles: NOTE_SOURCE_ROLES, templates: sourcePackTemplateOptions(), defaultTemplate: 'balanced' });
});

router.get('/jobs/:jobId/source-policy', requireAdminPermission('content.questions.read'), async (req, res) => {
  try {
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    res.json(await loadSourcePolicy(jobId));
  } catch (error) {
    sendError(res, error, 'Unable to load Notes Studio source-pack policy');
  }
});

router.patch('/jobs/:jobId/source-policy', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new SourcePolicyError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    await assertPolicyEditable(jobId);
    const templateKey = noteSourcePackTemplateKey(req.body?.templateKey);
    await sqlClient`
      UPDATE content.note_authoring_jobs
      SET brief = jsonb_set(COALESCE(brief, '{}'::jsonb), '{sourcePackTemplate}', to_jsonb(${templateKey}::text), true),
          updated_by = ${actorUserId}::uuid,
          updated_at = now()
      WHERE id = ${jobId}::uuid
    `;
    await audit(actorUserId, 'notes_studio.source_policy.template.changed', jobId, `Changed source-pack template to ${templateKey}`, { templateKey });
    res.json(await loadSourcePolicy(jobId));
  } catch (error) {
    sendError(res, error, 'Unable to update Notes Studio source-pack template');
  }
});

router.patch('/jobs/:jobId/sources/:sourceId/role', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new SourcePolicyError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    const sourceId = uuid(req.params.sourceId, 'Source ID');
    await assertPolicyEditable(jobId);
    const roleInput = text(req.body?.sourceRole, 40).toLowerCase();
    if (!(NOTE_SOURCE_ROLES as readonly string[]).includes(roleInput)) {
      throw new SourcePolicyError('INVALID_SOURCE_ROLE', 'Choose primary_authority, core_reference, exam_context or supplemental.');
    }
    const sourceRole = noteSourceRole(roleInput);
    const rows = await sqlClient`
      UPDATE content.note_authoring_sources
      SET source_role = ${sourceRole}, updated_at = now()
      WHERE job_id = ${jobId}::uuid AND source_document_id = ${sourceId}::uuid
      RETURNING source_document_id::text AS id
    `;
    if (!rows[0]) throw new SourcePolicyError('SOURCE_NOT_FOUND', 'That source is not attached to this authoring job.', 404);
    await audit(actorUserId, 'notes_studio.source_policy.role.changed', jobId, `Changed source research role to ${sourceRole}`, { sourceId, sourceRole });
    res.json(await loadSourcePolicy(jobId));
  } catch (error) {
    sendError(res, error, 'Unable to update Notes Studio source role');
  }
});

router.post(
  '/jobs/:jobId/evidence/rebuild',
  requireAdminPermission('content.questions.update'),
  async (req, res, next: NextFunction) => {
    try {
      const jobId = uuid(req.params.jobId, 'Authoring job ID');
      const status = await loadSourcePolicy(jobId);
      if (!status.policy.ready) {
        const requirementGaps = status.policy.missing.map((item) => `${item.label} (${item.currentCount}/${item.minCount})`);
        const integrityGaps = status.policy.integrity.findings.map((item) => `${item.label} (${item.currentCount}/${item.minCount})`);
        const gaps = [...requirementGaps, ...integrityGaps].join('; ');
        throw new SourcePolicyError(
          'SOURCE_PACK_POLICY_INCOMPLETE',
          `Complete the ${status.policy.name} source-pack requirements before building evidence: ${gaps}.`,
          409,
        );
      }
      next();
    } catch (error) {
      sendError(res, error, 'Unable to validate Notes Studio source-pack policy');
    }
  },
);

export default router;
