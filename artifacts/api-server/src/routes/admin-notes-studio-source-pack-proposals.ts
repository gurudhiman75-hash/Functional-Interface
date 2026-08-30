import { randomUUID } from 'node:crypto';
import { Router, type IRouter, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';
import { isGenerationReadySource, sourceRecommendationReason, sourceRecommendationScore } from '../notes-studio/source-library';
import { buildSourcePackProposal, type SourcePackProposalCandidate, type SourcePackProposalItem } from '../notes-studio/source-pack-proposal';
import {
  evaluateSourcePackPolicy,
  noteSourcePackTemplateKey,
  noteSourceRole,
  type NoteSourceRole,
} from '../notes-studio/source-pack-policy';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

class SourceProposalError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new SourceProposalError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function briefField(brief: unknown, key: string): string {
  if (!brief || typeof brief !== 'object' || Array.isArray(brief)) return '';
  return text((brief as Record<string, unknown>)[key], 300).toLowerCase();
}

function sendError(res: Response, error: unknown) {
  if (error instanceof SourceProposalError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error('Unable to build Notes Studio source-pack proposal', error);
  res.status(500).json({ error: 'Unable to build Notes Studio source-pack proposal', code: 'NOTES_STUDIO_SOURCE_PROPOSAL_FAILED' });
}

export async function loadNotesStudioSourcePackProposal(jobId: string) {
  const jobRows = await sqlClient`
    SELECT id::text AS id, title, state, brief
    FROM content.note_authoring_jobs
    WHERE id = ${jobId}::uuid
    LIMIT 1
  `;
  const job = jobRows[0];
  if (!job) throw new SourceProposalError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);

  const attached = await sqlClient`
    SELECT
      document.id::text AS id,
      document.retention_mode AS "retentionMode",
      document.extraction_status AS "extractionStatus",
      LENGTH(COALESCE(document.extracted_text, ''))::int AS "retainedCharCount",
      link.inclusion_state AS "inclusionState",
      link.source_role AS "sourceRole"
    FROM content.note_authoring_sources link
    JOIN content.source_documents document ON document.id = link.source_document_id
    WHERE link.job_id = ${jobId}::uuid
  `;
  const brief = job.brief && typeof job.brief === 'object' && !Array.isArray(job.brief)
    ? job.brief as Record<string, unknown>
    : {};
  const templateKey = noteSourcePackTemplateKey(brief.sourcePackTemplate);
  const policy = evaluateSourcePackPolicy(templateKey, attached.map((source) => ({
    sourceRole: noteSourceRole(source.sourceRole),
    inclusionState: String(source.inclusionState ?? ''),
    generationReady: isGenerationReadySource({
      retentionMode: String(source.retentionMode ?? ''),
      extractionStatus: String(source.extractionStatus ?? ''),
      retainedCharCount: Number(source.retainedCharCount ?? 0),
    }),
  })));

  const targetTaxonomyNodeId = briefField(brief, 'taxonomyNodeId');
  const targetTaxonomyCode = briefField(brief, 'taxonomyCode');
  const targetTopicLabel = briefField(brief, 'topicLabel');
  if (policy.ready || (!targetTaxonomyNodeId && !targetTaxonomyCode && !targetTopicLabel)) {
    return {
      job: { id: String(job.id), title: String(job.title), state: String(job.state), sourcePackTemplate: templateKey },
      policy,
      proposal: buildSourcePackProposal(policy.requirements, []),
      candidateCount: 0,
    };
  }

  const usageRows = await sqlClient`
    SELECT
      document.id::text AS id,
      document.title,
      document.publisher,
      document.retention_mode AS "retentionMode",
      document.extraction_status AS "extractionStatus",
      LENGTH(COALESCE(document.extracted_text, ''))::int AS "retainedCharCount",
      prior_job.id::text AS "priorJobId",
      prior_job.brief AS "priorBrief",
      prior_job.state AS "priorJobState",
      link.source_role AS "priorRole",
      EXISTS (
        SELECT 1 FROM content.note_approved_versions version WHERE version.job_id = prior_job.id
      ) AS "approvedUse"
    FROM content.source_documents document
    JOIN content.note_authoring_sources link
      ON link.source_document_id = document.id AND link.inclusion_state = 'included'
    JOIN content.note_authoring_jobs prior_job ON prior_job.id = link.job_id
    WHERE prior_job.id <> ${jobId}::uuid
      AND NOT EXISTS (
        SELECT 1 FROM content.note_authoring_sources current_link
        WHERE current_link.job_id = ${jobId}::uuid AND current_link.source_document_id = document.id
      )
    ORDER BY document.updated_at DESC
    LIMIT 2000
  `;

  type Aggregate = {
    sourceId: string;
    title: string;
    publisher: string;
    retentionMode: string;
    extractionStatus: string;
    retainedCharCount: number;
    exactTaxonomyUses: number;
    sameTaxonomyCodeUses: number;
    sameTopicUses: number;
    approvedUses: number;
    roleUses: Partial<Record<NoteSourceRole, number>>;
  };
  const aggregates = new Map<string, Aggregate>();
  for (const row of usageRows) {
    const sourceId = String(row.id);
    let aggregate = aggregates.get(sourceId);
    if (!aggregate) {
      aggregate = {
        sourceId,
        title: String(row.title ?? 'Untitled source'),
        publisher: String(row.publisher ?? ''),
        retentionMode: String(row.retentionMode ?? ''),
        extractionStatus: String(row.extractionStatus ?? ''),
        retainedCharCount: Number(row.retainedCharCount ?? 0),
        exactTaxonomyUses: 0,
        sameTaxonomyCodeUses: 0,
        sameTopicUses: 0,
        approvedUses: 0,
        roleUses: {},
      };
      aggregates.set(sourceId, aggregate);
    }
    const priorNodeId = briefField(row.priorBrief, 'taxonomyNodeId');
    const priorCode = briefField(row.priorBrief, 'taxonomyCode');
    const priorTopic = briefField(row.priorBrief, 'topicLabel');
    if (targetTaxonomyNodeId && priorNodeId === targetTaxonomyNodeId) aggregate.exactTaxonomyUses += 1;
    else if (targetTaxonomyCode && priorCode === targetTaxonomyCode) aggregate.sameTaxonomyCodeUses += 1;
    else if (targetTopicLabel && priorTopic === targetTopicLabel) aggregate.sameTopicUses += 1;
    if (row.approvedUse === true || ['approved', 'materialized'].includes(String(row.priorJobState))) aggregate.approvedUses += 1;
    const priorRole = noteSourceRole(row.priorRole);
    aggregate.roleUses[priorRole] = (aggregate.roleUses[priorRole] ?? 0) + 1;
  }

  const candidates: SourcePackProposalCandidate[] = [...aggregates.values()].map((aggregate) => {
    const generationReady = isGenerationReadySource({
      retentionMode: aggregate.retentionMode,
      extractionStatus: aggregate.extractionStatus,
      retainedCharCount: aggregate.retainedCharCount,
    });
    const signals = {
      exactTaxonomyUses: aggregate.exactTaxonomyUses,
      sameTaxonomyCodeUses: aggregate.sameTaxonomyCodeUses,
      sameTopicUses: aggregate.sameTopicUses,
      approvedUses: aggregate.approvedUses,
      generatable: generationReady,
      alreadyAttached: false,
    };
    return {
      sourceId: aggregate.sourceId,
      title: aggregate.title,
      publisher: aggregate.publisher,
      generationReady,
      relevanceScore: sourceRecommendationScore(signals),
      relevanceReason: sourceRecommendationReason(signals),
      approvedUses: aggregate.approvedUses,
      roleUses: aggregate.roleUses,
    };
  }).filter((candidate) => candidate.relevanceScore > 0);

  return {
    job: { id: String(job.id), title: String(job.title), state: String(job.state), sourcePackTemplate: templateKey },
    policy,
    proposal: buildSourcePackProposal(policy.requirements, candidates),
    candidateCount: candidates.length,
  };
}

router.use(authenticate);

router.get('/jobs/:id/source-pack-proposal', requireAdminPermission('content.questions.read'), async (req, res) => {
  try {
    const jobId = uuid(req.params.id, 'Authoring job ID');
    res.json({
      ...(await loadNotesStudioSourcePackProposal(jobId)),
      rawSourceBodiesReturned: false,
      externalNetworkSearch: false,
      automaticAttachment: false,
    });
  } catch (error) {
    sendError(res, error);
  }
});

router.post('/jobs/:id/source-pack-proposal/apply', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new SourceProposalError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.id, 'Authoring job ID');
    const current = await loadNotesStudioSourcePackProposal(jobId);
    if (!['brief', 'sources_ready'].includes(current.job.state)) {
      throw new SourceProposalError('SOURCE_POLICY_FROZEN', 'Source packs freeze once evidence work begins. Create a successor revision before applying a proposal.', 409);
    }
    if (current.proposal.items.length === 0) {
      res.json({ appliedCount: 0, reason: current.policy.ready ? 'Source policy already satisfied.' : 'No eligible governed proposal sources are available.', automaticAttachment: false });
      return;
    }

    const appliedItems: SourcePackProposalItem[] = [];
    await sqlClient.begin(async (tx) => {
      for (const item of current.proposal.items) {
        const rows = await tx`
          INSERT INTO content.note_authoring_sources (
            job_id, source_document_id, inclusion_state, relevance_score, position,
            source_role, added_by, added_at, updated_at
          )
          SELECT
            ${jobId}::uuid, ${item.sourceId}::uuid, 'included', null,
            COALESCE((SELECT MAX(position) + 1 FROM content.note_authoring_sources WHERE job_id = ${jobId}::uuid), 0),
            ${item.suggestedRole}, ${actorUserId}::uuid, now(), now()
          WHERE NOT EXISTS (
            SELECT 1 FROM content.note_authoring_sources
            WHERE job_id = ${jobId}::uuid AND source_document_id = ${item.sourceId}::uuid
          )
          RETURNING source_document_id::text AS id
        `;
        if (rows[0]) appliedItems.push(item);
      }
      if (appliedItems.length > 0) {
        await tx`
          INSERT INTO platform.audit_events (
            id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
          ) VALUES (
            ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
            'notes_studio.source_pack.proposal.applied', 'note_authoring_job', ${jobId}::uuid,
            ${`Applied ${appliedItems.length} governed source-pack proposal item${appliedItems.length === 1 ? '' : 's'}`},
            ${JSON.stringify({
              proposedItems: appliedItems.map((item) => ({ sourceId: item.sourceId, sourceRole: item.suggestedRole, requirementCode: item.requirementCode })),
              sourceBodyCopied: false,
              externalNetworkSearch: false,
              automaticEvidenceGeneration: false,
            })}
          )
        `;
      }
    });

    if (appliedItems.length > 0) {
      await sqlClient`
        UPDATE content.note_authoring_jobs job
        SET state = CASE
          WHEN EXISTS (
            SELECT 1
            FROM content.note_authoring_sources link
            JOIN content.source_documents document ON document.id = link.source_document_id
            WHERE link.job_id = job.id
              AND link.inclusion_state = 'included'
              AND document.retention_mode = 'extracted_text'
              AND document.extraction_status = 'processed'
              AND LENGTH(COALESCE(document.extracted_text, '')) >= 100
          ) THEN 'sources_ready'
          ELSE 'brief'
        END,
        updated_by = ${actorUserId}::uuid,
        updated_at = now()
        WHERE job.id = ${jobId}::uuid AND job.state IN ('brief', 'sources_ready')
      `;
    }

    res.json({
      appliedCount: appliedItems.length,
      applied: appliedItems,
      sourceBodyCopied: false,
      externalNetworkSearch: false,
      automaticAttachment: false,
      editorApprovedAttachment: true,
      automaticEvidenceGeneration: false,
    });
  } catch (error) {
    sendError(res, error);
  }
});

export default router;
