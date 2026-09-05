import { randomUUID } from 'node:crypto';
import { Router, type IRouter, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';
import { sourcePackAppendableState, sourcePackEditableState } from '../notes-studio/gap-source-recommendations';
import {
  NOTES_SOURCE_DISCOVERY_MAX_QUERIES,
  buildSourceDiscoveryQueries,
  normalizeSourceDiscoveryQuery,
  sourceDiscoveryAllowed,
} from '../notes-studio/source-discovery';
import {
  NotesSourceDiscoveryConfigurationError,
  discoverNotesSources,
} from '../notes-studio/source-discovery-provider';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

class SourceDiscoveryError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function uuid(value: unknown, label: string): string {
  const id = typeof value === 'string' ? value.trim() : '';
  if (!uuidPattern.test(id)) throw new SourceDiscoveryError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function explicitQueries(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map(normalizeSourceDiscoveryQuery).filter(Boolean))]
    .slice(0, NOTES_SOURCE_DISCOVERY_MAX_QUERIES);
}

function sendError(res: Response, error: unknown) {
  if (error instanceof SourceDiscoveryError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  if (error instanceof NotesSourceDiscoveryConfigurationError) {
    res.status(503).json({ error: error.message, code: 'NOTES_STUDIO_SOURCE_DISCOVERY_NOT_CONFIGURED' });
    return;
  }
  console.error('Unable to discover Notes Studio sources', error);
  res.status(500).json({ error: 'Unable to discover Notes Studio sources', code: 'NOTES_STUDIO_SOURCE_DISCOVERY_FAILED' });
}

async function loadJob(jobId: string) {
  const rows = await sqlClient`
    SELECT id::text AS id, title, state, brief
    FROM content.note_authoring_jobs
    WHERE id = ${jobId}::uuid
    LIMIT 1
  `;
  if (!rows[0]) throw new SourceDiscoveryError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
  if (!sourceDiscoveryAllowed(rows[0].state)) {
    throw new SourceDiscoveryError(
      'SOURCE_DISCOVERY_FROZEN',
      'Approved or materialized Notes Studio work cannot start new source discovery in place. Create a successor revision first.',
      409,
    );
  }
  return rows[0] as Record<string, unknown>;
}

async function enrichCandidates(jobId: string, sourceUris: string[]) {
  if (sourceUris.length === 0) return [];
  const existingRows = await sqlClient`
    SELECT
      document.id::text AS id,
      document.source_uri AS "sourceUri",
      document.title,
      document.publisher,
      document.rights_basis AS "rightsBasis",
      document.retention_mode AS "retentionMode",
      document.extraction_status AS "extractionStatus",
      (link.source_document_id IS NOT NULL) AS "alreadyAttached"
    FROM content.source_documents document
    LEFT JOIN content.note_authoring_sources link
      ON link.source_document_id = document.id AND link.job_id = ${jobId}::uuid
    WHERE document.source_uri = ANY(${sourceUris}::text[])
  `;
  const existingByUri = new Map(existingRows.map((row) => [String(row.sourceUri), row]));
  return sourceUris.map((sourceUri) => existingByUri.get(sourceUri) ?? null);
}

router.use(authenticate);

router.post('/jobs/:jobId/source-discovery', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new SourceDiscoveryError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    const job = await loadJob(jobId);
    const brief = job.brief && typeof job.brief === 'object' && !Array.isArray(job.brief)
      ? job.brief as Record<string, unknown>
      : {};
    const focus = normalizeSourceDiscoveryQuery(req.body?.focus);
    const requestedQueries = explicitQueries(req.body?.queries);
    const queries = requestedQueries.length > 0
      ? requestedQueries
      : buildSourceDiscoveryQueries({
          topicLabel: brief.topicLabel ?? job.title,
          syllabusEmphasis: brief.syllabusEmphasis,
          focus,
        });
    if (queries.length === 0) {
      throw new SourceDiscoveryError('SOURCE_DISCOVERY_QUERY_REQUIRED', 'Add a topic label, syllabus emphasis or a focused research query first.', 422);
    }

    const discovered = await discoverNotesSources(queries);
    const sourceUris = discovered.candidates.map((candidate) => candidate.sourceUri);
    const existing = await enrichCandidates(jobId, sourceUris);
    const candidates = discovered.candidates.map((candidate, index) => {
      const governed = existing[index] as Record<string, unknown> | null;
      return {
        ...candidate,
        governedSourceId: governed?.id ? String(governed.id) : null,
        title: governed?.title ? String(governed.title) : null,
        publisher: governed?.publisher ? String(governed.publisher) : null,
        rightsBasis: governed?.rightsBasis ? String(governed.rightsBasis) : null,
        retentionMode: governed?.retentionMode ? String(governed.retentionMode) : null,
        extractionStatus: governed?.extractionStatus ? String(governed.extractionStatus) : null,
        alreadyAttached: Boolean(governed?.alreadyAttached),
      };
    });

    await sqlClient`
      INSERT INTO platform.audit_events (
        id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
      ) VALUES (
        ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
        'notes_studio.source_discovery.searched', 'note_authoring_job', ${jobId}::uuid,
        'Ran bounded Notes Studio source discovery',
        ${JSON.stringify({
          provider: discovered.provider,
          model: discovered.model,
          promptVersion: discovered.promptVersion,
          responseId: discovered.responseId,
          queryCount: queries.length,
          explicitQueryBatch: requestedQueries.length > 0,
          searchCallCount: discovered.searchCallCount,
          candidateCount: candidates.length,
          candidateDomains: [...new Set(candidates.map((candidate) => candidate.domain))].slice(0, 20),
          rawSourceBodiesReturned: false,
          sourceDocumentsCreated: false,
          sourcesAttachedAutomatically: false,
          evidenceCreated: false,
          factsOrClaimsCreated: false,
          learnerGeneration: false,
        })}::jsonb
      )
    `;

    const state = String(job.state);
    const sourcePackMutable = sourcePackEditableState(state);
    const sourcePackAppendable = sourcePackAppendableState(state);
    res.json({
      job: { id: String(job.id), title: String(job.title), state },
      queries,
      candidates,
      search: {
        provider: discovered.provider,
        model: discovered.model,
        responseId: discovered.responseId,
        promptVersion: discovered.promptVersion,
        searchCallCount: discovered.searchCallCount,
        usage: discovered.usage,
      },
      boundaries: {
        rawSourceBodiesReturned: false,
        sourceDocumentsCreated: false,
        sourcesAttachedAutomatically: false,
        evidenceCreated: false,
        factsOrClaimsCreated: false,
        learnerGeneration: false,
      },
      sourcePackMutable,
      sourcePackAppendable,
      nextAction: sourcePackMutable
        ? 'Review a candidate URL, then explicitly attach it through the existing URL source form.'
        : sourcePackAppendable
          ? 'Review candidate URLs, then append only the useful sources. Existing source membership and accepted research remain frozen.'
          : 'Review candidate URLs for a successor revision; the current job can no longer accept source additions.',
    });
  } catch (error) {
    sendError(res, error);
  }
});

export default router;
