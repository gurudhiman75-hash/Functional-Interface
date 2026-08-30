import { randomUUID } from 'node:crypto';
import { Router, type IRouter, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';
import { type NotesLocalizationLanguage } from '../notes-studio/approval-versioning';
import {
  localizedResourceMatchesFrozenVersion,
  sourceResourceMatchesFrozenVersion,
  successorJobTitle,
} from '../notes-studio/release-lineage';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const variants = new Set(['source', 'hi', 'pa']);

type ReleaseVariantKey = 'source' | NotesLocalizationLanguage;

class NotesStudioReleaseError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new NotesStudioReleaseError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function variantKey(value: unknown): ReleaseVariantKey {
  const key = text(value, 12).toLowerCase();
  if (!variants.has(key)) throw new NotesStudioReleaseError('INVALID_RELEASE_VARIANT', 'Choose source, hi or pa.');
  return key as ReleaseVariantKey;
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof NotesStudioReleaseError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'NOTES_STUDIO_RELEASE_FAILED' });
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

async function loadVersionIndex() {
  const rows = await sqlClient`
    SELECT
      version.id::text AS id,
      version.job_id::text AS "jobId",
      job.title AS "jobTitle",
      version.version_number AS "versionNumber",
      version.learner_title AS "learnerTitle",
      version.source_language AS "sourceLanguage",
      version.approved_at AS "approvedAt",
      job.predecessor_approved_version_id::text AS "predecessorApprovedVersionId",
      job.lineage_root_approved_version_id::text AS "lineageRootApprovedVersionId",
      successor.id::text AS "successorJobId",
      successor.title AS "successorJobTitle",
      successor.revision_number AS "successorRevisionNumber"
    FROM content.note_approved_versions version
    JOIN content.note_authoring_jobs job ON job.id = version.job_id
    LEFT JOIN content.note_authoring_jobs successor ON successor.predecessor_approved_version_id = version.id
    ORDER BY version.approved_at DESC
    LIMIT 500
  `;
  return rows;
}

async function loadReleaseWorkspace(versionId: string) {
  const versionRows = await sqlClient`
    SELECT
      version.id::text AS id,
      version.job_id::text AS "jobId",
      version.version_number AS "versionNumber",
      version.source_language AS "sourceLanguage",
      version.learner_title AS "learnerTitle",
      version.learner_summary AS "learnerSummary",
      version.body_markdown AS "bodyMarkdown",
      version.content_hash AS "contentHash",
      version.approval_fingerprint AS "approvalFingerprint",
      version.approved_at AS "approvedAt",
      job.title AS "jobTitle",
      job.revision_reason AS "revisionReason",
      job.predecessor_approved_version_id::text AS "predecessorApprovedVersionId",
      job.lineage_root_approved_version_id::text AS "lineageRootApprovedVersionId",
      predecessor.version_number AS "predecessorVersionNumber",
      predecessor.learner_title AS "predecessorLearnerTitle",
      predecessor_materialization.resource_id::text AS "predecessorResourceId",
      predecessor_resource.public_code AS "predecessorPublicCode",
      successor.id::text AS "successorJobId",
      successor.title AS "successorJobTitle",
      successor.state AS "successorJobState",
      successor.revision_number AS "successorRevisionNumber"
    FROM content.note_approved_versions version
    JOIN content.note_authoring_jobs job ON job.id = version.job_id
    LEFT JOIN content.note_approved_versions predecessor ON predecessor.id = job.predecessor_approved_version_id
    LEFT JOIN content.note_materializations predecessor_materialization ON predecessor_materialization.approved_version_id = predecessor.id
    LEFT JOIN content.learning_resources predecessor_resource ON predecessor_resource.id = predecessor_materialization.resource_id
    LEFT JOIN content.note_authoring_jobs successor ON successor.predecessor_approved_version_id = version.id
    WHERE version.id = ${versionId}::uuid
    LIMIT 1
  `;
  const version = versionRows[0] as Record<string, unknown> | undefined;
  if (!version) throw new NotesStudioReleaseError('APPROVED_VERSION_NOT_FOUND', 'Approved Notes Studio version not found.', 404);

  const sourceRows = await sqlClient`
    SELECT
      materialization.resource_id::text AS "resourceId",
      resource.public_code AS "publicCode",
      resource.status AS "resourceStatus",
      resource.title,
      resource.summary,
      resource.body_markdown AS "bodyMarkdown",
      resource.language_code AS "languageCode",
      resource.updated_at AS "resourceUpdatedAt",
      handoff.id::text AS "handoffId",
      handoff.handed_off_at AS "handedOffAt",
      handoff.handed_off_by::text AS "handedOffBy"
    FROM content.note_materializations materialization
    JOIN content.learning_resources resource ON resource.id = materialization.resource_id
    LEFT JOIN content.note_publish_handoffs handoff
      ON handoff.approved_version_id = materialization.approved_version_id AND handoff.variant_key = 'source'
    WHERE materialization.approved_version_id = ${versionId}::uuid
    LIMIT 1
  `;
  const sourceResource = sourceRows[0] as Record<string, unknown> | undefined;
  const sourcePreview = sourceResource
    ? {
        title: String(sourceResource.title ?? ''),
        summary: String(sourceResource.summary ?? ''),
        bodyMarkdown: String(sourceResource.bodyMarkdown ?? ''),
      }
    : {
        title: String(version.learnerTitle ?? ''),
        summary: String(version.learnerSummary ?? ''),
        bodyMarkdown: String(version.bodyMarkdown ?? ''),
      };
  const sourceIntegrity = sourceResource
    ? sourceResourceMatchesFrozenVersion({ frozenContentHash: String(version.contentHash), resource: sourcePreview })
    : true;

  const localizationRows = await sqlClient`
    SELECT
      localization.id::text AS id,
      localization.language_code AS "languageCode",
      localization.state,
      localization.title AS "frozenTitle",
      localization.summary AS "frozenSummary",
      localization.body_markdown AS "frozenBodyMarkdown",
      localization.source_content_hash AS "sourceContentHash",
      localization.content_hash AS "contentHash",
      localization.materialized_resource_id::text AS "resourceId",
      resource.public_code AS "publicCode",
      resource.status AS "resourceStatus",
      resource.title AS "resourceTitle",
      resource.summary AS "resourceSummary",
      resource.body_markdown AS "resourceBodyMarkdown",
      resource.updated_at AS "resourceUpdatedAt",
      handoff.id::text AS "handoffId",
      handoff.handed_off_at AS "handedOffAt",
      handoff.handed_off_by::text AS "handedOffBy"
    FROM content.note_localizations localization
    LEFT JOIN content.learning_resources resource ON resource.id = localization.materialized_resource_id
    LEFT JOIN content.note_publish_handoffs handoff
      ON handoff.approved_version_id = localization.approved_version_id
     AND handoff.variant_key = localization.language_code
    WHERE localization.approved_version_id = ${versionId}::uuid
    ORDER BY localization.language_code
  `;

  const localizedByLanguage = new Map(localizationRows.map((row) => [String(row.languageCode), row as Record<string, unknown>]));
  const releaseVariants: Array<Record<string, unknown>> = [
    {
      key: 'source',
      languageCode: String(version.sourceLanguage),
      localizationState: null,
      materialized: Boolean(sourceResource?.resourceId),
      resourceId: sourceResource?.resourceId ?? null,
      publicCode: sourceResource?.publicCode ?? null,
      resourceStatus: sourceResource?.resourceStatus ?? null,
      title: sourcePreview.title,
      summary: sourcePreview.summary,
      bodyMarkdown: sourcePreview.bodyMarkdown,
      frozenContentHash: String(version.contentHash),
      integrityMatchesFrozenVersion: sourceIntegrity,
      handoffId: sourceResource?.handoffId ?? null,
      handedOffAt: sourceResource?.handedOffAt ?? null,
      handedOffBy: sourceResource?.handedOffBy ?? null,
      readyForHandoff: Boolean(sourceResource?.resourceId) && String(sourceResource?.resourceStatus) === 'draft' && sourceIntegrity,
    },
  ];

  for (const languageCode of ['hi', 'pa'] as const) {
    const localization = localizedByLanguage.get(languageCode);
    if (!localization) {
      releaseVariants.push({
        key: languageCode,
        languageCode,
        localizationState: 'not_created',
        materialized: false,
        resourceId: null,
        publicCode: null,
        resourceStatus: null,
        title: '',
        summary: '',
        bodyMarkdown: '',
        frozenContentHash: null,
        integrityMatchesFrozenVersion: true,
        handoffId: null,
        handedOffAt: null,
        handedOffBy: null,
        readyForHandoff: false,
      });
      continue;
    }
    const hasResource = Boolean(localization.resourceId);
    const preview = {
      title: String(hasResource ? localization.resourceTitle ?? '' : localization.frozenTitle ?? ''),
      summary: String(hasResource ? localization.resourceSummary ?? '' : localization.frozenSummary ?? ''),
      bodyMarkdown: String(hasResource ? localization.resourceBodyMarkdown ?? '' : localization.frozenBodyMarkdown ?? ''),
    };
    const integrity = hasResource
      ? localizedResourceMatchesFrozenVersion({
          approvedVersionId: versionId,
          sourceContentHash: String(localization.sourceContentHash),
          frozenContentHash: String(localization.contentHash),
          languageCode,
          resource: preview,
        })
      : true;
    releaseVariants.push({
      key: languageCode,
      languageCode,
      localizationState: String(localization.state),
      materialized: hasResource,
      resourceId: localization.resourceId ?? null,
      publicCode: localization.publicCode ?? null,
      resourceStatus: localization.resourceStatus ?? null,
      title: preview.title,
      summary: preview.summary,
      bodyMarkdown: preview.bodyMarkdown,
      frozenContentHash: String(localization.contentHash),
      integrityMatchesFrozenVersion: integrity,
      handoffId: localization.handoffId ?? null,
      handedOffAt: localization.handedOffAt ?? null,
      handedOffBy: localization.handedOffBy ?? null,
      readyForHandoff: hasResource && String(localization.resourceStatus) === 'draft' && integrity,
    });
  }

  return {
    version,
    variants: releaseVariants,
    publicationBoundary: {
      handoffPublishesResource: false,
      automaticPublicationEnabled: false,
      materializedLearnerCopyFrozen: true,
      successorCopiesEvidenceOrQa: false,
      publishSurface: '/content/learning-resources',
    },
  };
}

router.use(authenticate);

router.get('/release/versions', requireAdminPermission('content.questions.read'), async (_req, res) => {
  try {
    res.json({ versions: await loadVersionIndex() });
  } catch (error) {
    sendError(res, error, 'Unable to load Notes Studio approved versions');
  }
});

router.get('/approved-versions/:versionId/release', requireAdminPermission('content.questions.read'), async (req, res) => {
  try {
    res.json(await loadReleaseWorkspace(uuid(req.params.versionId, 'Approved version ID')));
  } catch (error) {
    sendError(res, error, 'Unable to load Notes Studio learner release preview');
  }
});

router.post('/approved-versions/:versionId/revise', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const versionId = uuid(req.params.versionId, 'Approved version ID');
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new NotesStudioReleaseError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const revisionReason = text(req.body?.revisionReason, 1000);
    if (revisionReason.length < 4) throw new NotesStudioReleaseError('REVISION_REASON_REQUIRED', 'Enter a revision reason of at least 4 characters.');

    const versionRows = await sqlClient`
      SELECT
        version.id::text AS id,
        version.job_id::text AS "jobId",
        version.version_number AS "versionNumber",
        version.source_language AS "sourceLanguage",
        version.brief_snapshot AS "briefSnapshot",
        job.title AS "jobTitle",
        job.lineage_root_approved_version_id::text AS "lineageRootApprovedVersionId",
        successor.id::text AS "successorJobId"
      FROM content.note_approved_versions version
      JOIN content.note_authoring_jobs job ON job.id = version.job_id
      LEFT JOIN content.note_authoring_jobs successor ON successor.predecessor_approved_version_id = version.id
      WHERE version.id = ${versionId}::uuid
      LIMIT 1
    `;
    const version = versionRows[0] as Record<string, unknown> | undefined;
    if (!version) throw new NotesStudioReleaseError('APPROVED_VERSION_NOT_FOUND', 'Approved Notes Studio version not found.', 404);
    if (version.successorJobId) {
      throw new NotesStudioReleaseError('SUCCESSOR_ALREADY_EXISTS', `This version already has successor job ${String(version.successorJobId)}.`, 409);
    }

    const nextRevision = Number(version.versionNumber ?? 1) + 1;
    const requestedTitle = text(req.body?.title, 240);
    const title = requestedTitle || successorJobTitle(String(version.jobTitle), nextRevision);
    if (title.length < 3) throw new NotesStudioReleaseError('REVISION_TITLE_REQUIRED', 'Enter a clear successor authoring-job title.');
    const successorJobId = randomUUID();
    const rootVersionId = String(version.lineageRootApprovedVersionId || versionId);
    let successorState = 'brief';

    await sqlClient.begin(async (tx) => {
      const readyRows = await tx`
        SELECT EXISTS (
          SELECT 1
          FROM content.note_authoring_sources link
          JOIN content.source_documents document ON document.id = link.source_document_id
          WHERE link.job_id = ${String(version.jobId)}::uuid
            AND link.inclusion_state = 'included'
            AND document.retention_mode = 'extracted_text'
            AND document.extraction_status = 'processed'
            AND LENGTH(COALESCE(document.extracted_text, '')) >= 100
        ) AS ready
      `;
      successorState = readyRows[0]?.ready ? 'sources_ready' : 'brief';
      await tx`
        INSERT INTO content.note_authoring_jobs (
          id, title, source_language, state, brief, target_resource_id,
          revision_number, predecessor_approved_version_id, lineage_root_approved_version_id, revision_reason,
          created_by, updated_by, created_at, updated_at
        ) VALUES (
          ${successorJobId}::uuid, ${title}, ${String(version.sourceLanguage)}, ${successorState},
          ${JSON.stringify(version.briefSnapshot ?? {})}, null,
          ${nextRevision}, ${versionId}::uuid, ${rootVersionId}::uuid, ${revisionReason},
          ${actorUserId}::uuid, ${actorUserId}::uuid, now(), now()
        )
      `;
      await tx`
        INSERT INTO content.note_authoring_sources (
          job_id, source_document_id, inclusion_state, relevance_score, position,
          added_by, added_at, updated_at
        )
        SELECT
          ${successorJobId}::uuid, source_document_id, inclusion_state, relevance_score, position,
          ${actorUserId}::uuid, now(), now()
        FROM content.note_authoring_sources
        WHERE job_id = ${String(version.jobId)}::uuid
      `;
    });

    await audit(actorUserId, 'notes_studio.revision.created', successorJobId, `Created Notes Studio revision ${nextRevision}`, {
      predecessorApprovedVersionId: versionId,
      lineageRootApprovedVersionId: rootVersionId,
      revisionNumber: nextRevision,
      revisionReason,
      copiedSourcePackReferences: true,
      copiedEvidence: false,
      copiedSections: false,
      copiedQualityRuns: false,
    });
    res.status(201).json({
      successorJob: {
        id: successorJobId,
        title,
        state: successorState,
        revisionNumber: nextRevision,
        predecessorApprovedVersionId: versionId,
        lineageRootApprovedVersionId: rootVersionId,
        revisionReason,
      },
      release: await loadReleaseWorkspace(versionId),
    });
  } catch (error) {
    sendError(res, error, 'Unable to create Notes Studio successor revision');
  }
});

router.post('/approved-versions/:versionId/handoff/:variantKey', requireAdminPermission('content.questions.publish'), async (req, res) => {
  try {
    const versionId = uuid(req.params.versionId, 'Approved version ID');
    const key = variantKey(req.params.variantKey);
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new NotesStudioReleaseError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const workspace = await loadReleaseWorkspace(versionId);
    const releaseVariant = workspace.variants.find((item) => String(item.key) === key);
    if (!releaseVariant) throw new NotesStudioReleaseError('RELEASE_VARIANT_NOT_FOUND', 'Learner release variant not found.', 404);
    if (releaseVariant.handoffId) {
      res.json(workspace);
      return;
    }
    if (!releaseVariant.resourceId) {
      throw new NotesStudioReleaseError('VARIANT_NOT_MATERIALIZED', 'Materialize this learner variant before publish handoff.', 409);
    }
    if (String(releaseVariant.resourceStatus) !== 'draft') {
      throw new NotesStudioReleaseError('RESOURCE_NOT_DRAFT', 'Only a canonical draft can be handed off to the publish workflow.', 409);
    }
    if (!releaseVariant.integrityMatchesFrozenVersion) {
      throw new NotesStudioReleaseError('FROZEN_CONTENT_MISMATCH', 'Canonical draft no longer matches its frozen Notes Studio version. Create a successor revision instead.', 409);
    }

    const localizationRows = key === 'source' ? [] : await sqlClient`
      SELECT id::text AS id
      FROM content.note_localizations
      WHERE approved_version_id = ${versionId}::uuid AND language_code = ${key}
      LIMIT 1
    `;
    const localizationId = key === 'source' ? null : String(localizationRows[0]?.id ?? '');
    if (key !== 'source' && !uuidPattern.test(localizationId ?? '')) {
      throw new NotesStudioReleaseError('LOCALIZATION_NOT_FOUND', 'Version-bound localization is missing.', 409);
    }
    const version = workspace.version as Record<string, unknown>;
    const handoffId = randomUUID();
    const snapshot = {
      publicCode: releaseVariant.publicCode,
      resourceStatus: releaseVariant.resourceStatus,
      title: releaseVariant.title,
      summary: releaseVariant.summary,
      languageCode: releaseVariant.languageCode,
      frozenContentHash: releaseVariant.frozenContentHash,
      integrityMatchesFrozenVersion: true,
      automaticPublication: false,
    };
    await sqlClient.begin(async (tx) => {
      await tx`
        INSERT INTO content.note_publish_handoffs (
          id, approved_version_id, localization_id, resource_id, variant_key, language_code,
          frozen_content_hash, resource_snapshot, handed_off_by, handed_off_at
        ) VALUES (
          ${handoffId}::uuid, ${versionId}::uuid, ${localizationId}::uuid, ${String(releaseVariant.resourceId)}::uuid,
          ${key}, ${String(releaseVariant.languageCode)}, ${String(releaseVariant.frozenContentHash)},
          ${JSON.stringify(snapshot)}, ${actorUserId}::uuid, now()
        )
      `;
    });
    await audit(actorUserId, 'notes_studio.publish_handoff.created', String(version.jobId), `Handed off Notes Studio ${key} learner draft to Learning Resources`, {
      approvedVersionId: versionId,
      variantKey: key,
      resourceId: releaseVariant.resourceId,
      frozenContentHash: releaseVariant.frozenContentHash,
      automaticPublication: false,
      publishActionPerformed: false,
    });
    res.json(await loadReleaseWorkspace(versionId));
  } catch (error) {
    sendError(res, error, 'Unable to hand off Notes Studio learner draft');
  }
});

export default router;
