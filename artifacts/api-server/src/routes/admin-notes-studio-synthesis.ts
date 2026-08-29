import { randomUUID } from 'node:crypto';
import { Router, type IRouter, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import {
  describeAIProviderError,
  extractWithAI,
  getAIProvider,
  isAIProviderConfigured,
  resolveAIProvider,
  type AIProviderName,
} from '../lib/ai-providers';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';
import {
  NOTE_OUTLINE_POLICY_VERSION,
  NOTE_SECTION_PROMPT_POLICY_VERSION,
  assembleNoteDraft,
  buildSectionGenerationRequest,
  draftInputHash,
  normalizeGeneratedSectionOutput,
  outlineInputHash,
  outputHash,
  planOutlineSections,
  sectionInputHash,
  type OutlineTarget,
  type SectionEvidenceClaim,
} from '../notes-studio/section-synthesis';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const providerNames = new Set<AIProviderName>(['openai', 'gemini', 'claude']);
const MAX_SECTIONS = 12;
const MODEL_TIMEOUT_MS = 120_000;

type JobRow = {
  id: string;
  title: string;
  state: string;
  brief: Record<string, unknown>;
};

class SynthesisError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function id(value: unknown, label: string): string {
  const parsed = text(value, 80);
  if (!uuidPattern.test(parsed)) throw new SynthesisError('INVALID_ID', `${label} is invalid.`);
  return parsed;
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function requestedProvider(value: unknown): AIProviderName | undefined {
  const parsed = text(value, 30).toLowerCase();
  if (!parsed) return undefined;
  if (!providerNames.has(parsed as AIProviderName)) throw new SynthesisError('INVALID_AI_PROVIDER', 'Choose openai, gemini or claude.');
  return parsed as AIProviderName;
}

function notesProvider(explicit?: AIProviderName): AIProviderName {
  const configured = text(process.env.NOTES_STUDIO_AI_PROVIDER, 30).toLowerCase();
  if (!explicit && configured) {
    if (!providerNames.has(configured as AIProviderName)) {
      throw new SynthesisError('INVALID_NOTES_AI_PROVIDER', 'NOTES_STUDIO_AI_PROVIDER must be openai, gemini or claude.', 500);
    }
    return configured as AIProviderName;
  }
  return explicit ?? resolveAIProvider();
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof SynthesisError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'NOTES_SYNTHESIS_FAILED' });
}

async function loadJob(jobId: string): Promise<JobRow | null> {
  const rows = await sqlClient`
    SELECT id::text AS id, title, state, brief
    FROM content.note_authoring_jobs
    WHERE id = ${jobId}::uuid
    LIMIT 1
  `;
  if (!rows[0]) return null;
  return {
    id: String(rows[0].id),
    title: String(rows[0].title),
    state: String(rows[0].state),
    brief: record(rows[0].brief),
  };
}

async function latestEvidenceRun(jobId: string) {
  const rows = await sqlClient`
    SELECT id::text AS id, input_hash AS "inputHash", finished_at AS "finishedAt"
    FROM content.note_evidence_runs
    WHERE job_id = ${jobId}::uuid AND status = 'completed'
    ORDER BY finished_at DESC NULLS LAST, started_at DESC
    LIMIT 1
  `;
  return rows[0] ?? null;
}

async function loadEvidenceGate(jobId: string) {
  const run = await latestEvidenceRun(jobId);
  if (!run) return { run: null, ready: false, acceptedCount: 0, requiredCount: 0, coveredRequiredCount: 0 };
  const rows = await sqlClient`
    SELECT
      COUNT(DISTINCT claim.id) FILTER (WHERE claim.evidence_state = 'accepted')::int AS "acceptedCount",
      COUNT(DISTINCT target.id) FILTER (WHERE target.required)::int AS "requiredCount",
      COUNT(DISTINCT target.id) FILTER (
        WHERE target.required AND EXISTS (
          SELECT 1
          FROM content.note_claim_coverage mapping2
          JOIN content.note_evidence_claims claim2 ON claim2.id = mapping2.claim_id
          WHERE mapping2.run_id = ${String(run.id)}::uuid
            AND mapping2.target_id = target.id
            AND claim2.evidence_state = 'accepted'
        )
      )::int AS "coveredRequiredCount"
    FROM content.note_coverage_targets target
    LEFT JOIN content.note_claim_coverage mapping
      ON mapping.target_id = target.id AND mapping.run_id = ${String(run.id)}::uuid
    LEFT JOIN content.note_evidence_claims claim ON claim.id = mapping.claim_id
    WHERE target.job_id = ${jobId}::uuid
  `;
  const acceptedCount = Number(rows[0]?.acceptedCount ?? 0);
  const requiredCount = Number(rows[0]?.requiredCount ?? 0);
  const coveredRequiredCount = Number(rows[0]?.coveredRequiredCount ?? 0);
  return {
    run,
    acceptedCount,
    requiredCount,
    coveredRequiredCount,
    ready: acceptedCount > 0 && requiredCount > 0 && requiredCount === coveredRequiredCount,
  };
}

async function activeOutline(jobId: string) {
  const rows = await sqlClient`
    SELECT
      id::text AS id,
      job_id::text AS "jobId",
      evidence_run_id::text AS "evidenceRunId",
      version_number AS "versionNumber",
      input_hash AS "inputHash",
      policy_version AS "policyVersion",
      state,
      created_at AS "createdAt"
    FROM content.note_outline_versions
    WHERE job_id = ${jobId}::uuid AND state = 'active'
    ORDER BY version_number DESC
    LIMIT 1
  `;
  return rows[0] ?? null;
}

async function sectionClaims(sectionId: string, evidenceRunId: string): Promise<SectionEvidenceClaim[]> {
  const rows = await sqlClient`
    SELECT DISTINCT claim.id::text AS id, claim.claim_text AS "claimText", claim.claim_type AS "claimType"
    FROM content.note_section_coverage section_coverage
    JOIN content.note_claim_coverage mapping ON mapping.target_id = section_coverage.target_id
    JOIN content.note_evidence_claims claim ON claim.id = mapping.claim_id
    WHERE section_coverage.section_id = ${sectionId}::uuid
      AND mapping.run_id = ${evidenceRunId}::uuid
      AND claim.run_id = ${evidenceRunId}::uuid
      AND claim.evidence_state = 'accepted'
    ORDER BY claim.id
  `;
  return rows.map((row) => ({ id: String(row.id), claimText: String(row.claimText), claimType: String(row.claimType) }));
}

async function synthesisPayload(jobId: string) {
  const [job, evidenceGate, outline] = await Promise.all([loadJob(jobId), loadEvidenceGate(jobId), activeOutline(jobId)]);
  if (!job) throw new SynthesisError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
  let sections: unknown[] = [];
  let draft = null;
  if (outline) {
    sections = await sqlClient`
      SELECT
        section.id::text AS id,
        section.section_key AS "sectionKey",
        section.title,
        section.objective,
        section.position,
        section.state,
        COALESCE(array_agg(DISTINCT target.id::text ORDER BY target.id::text) FILTER (WHERE target.id IS NOT NULL), '{}') AS "targetIds",
        COALESCE(array_agg(DISTINCT target.label ORDER BY target.label) FILTER (WHERE target.id IS NOT NULL), '{}') AS "targetLabels",
        current_version.id::text AS "currentVersionId",
        current_version.version_number AS "currentVersionNumber",
        current_version.title AS "currentTitle",
        current_version.markdown AS "currentMarkdown",
        current_version.status AS "currentStatus",
        current_version.provider AS "currentProvider",
        current_version.model AS "currentModel",
        current_version.output_hash AS "currentOutputHash",
        current_version.warnings AS "currentWarnings",
        COALESCE(array_length(current_version.used_claim_ids, 1), 0)::int AS "usedClaimCount"
      FROM content.note_sections section
      LEFT JOIN content.note_section_coverage sc ON sc.section_id = section.id
      LEFT JOIN content.note_coverage_targets target ON target.id = sc.target_id
      LEFT JOIN LATERAL (
        SELECT version.*
        FROM content.note_section_versions version
        WHERE version.section_id = section.id
        ORDER BY version.version_number DESC
        LIMIT 1
      ) current_version ON true
      WHERE section.outline_version_id = ${String(outline.id)}::uuid
      GROUP BY section.id, current_version.id, current_version.version_number, current_version.title,
        current_version.markdown, current_version.status, current_version.provider, current_version.model,
        current_version.output_hash, current_version.warnings, current_version.used_claim_ids
      ORDER BY section.position
    `;
    const drafts = await sqlClient`
      SELECT
        id::text AS id,
        version_number AS "versionNumber",
        markdown,
        input_hash AS "inputHash",
        output_hash AS "outputHash",
        state,
        created_at AS "createdAt"
      FROM content.note_draft_versions
      WHERE job_id = ${jobId}::uuid AND state = 'assembled'
      ORDER BY version_number DESC
      LIMIT 1
    `;
    draft = drafts[0] ?? null;
  }
  const currentEvidenceRunId = evidenceGate.run ? String(evidenceGate.run.id) : null;
  const staleOutline = Boolean(outline && currentEvidenceRunId && String(outline.evidenceRunId) !== currentEvidenceRunId);
  return {
    job,
    evidenceGate: {
      ready: evidenceGate.ready,
      acceptedCount: evidenceGate.acceptedCount,
      requiredCount: evidenceGate.requiredCount,
      coveredRequiredCount: evidenceGate.coveredRequiredCount,
      currentEvidenceRunId,
    },
    outline,
    staleOutline,
    sections,
    draft,
  };
}

async function recordGenerationFailure(input: {
  jobId: string;
  sectionId: string;
  provider: string;
  model: string;
  inputHash: string;
  latencyMs: number;
  actorUserId: string;
  error: string;
}) {
  await sqlClient`
    INSERT INTO content.note_generation_events (
      id, job_id, section_id, section_version_id, provider, model, prompt_policy_version,
      input_hash, output_hash, usage, latency_ms, state, error_message, created_by, created_at
    ) VALUES (
      ${randomUUID()}::uuid, ${input.jobId}::uuid, ${input.sectionId}::uuid, null,
      ${input.provider}, ${input.model}, ${NOTE_SECTION_PROMPT_POLICY_VERSION}, ${input.inputHash}, null,
      ${JSON.stringify({})}, ${input.latencyMs}, 'failed', ${input.error.slice(0, 2000)}, ${input.actorUserId}::uuid, now()
    )
  `;
}

router.use(authenticate);

router.get('/synthesis/capabilities', requireAdminPermission('content.questions.read'), (req, res) => {
  try {
    const explicit = requestedProvider(req.query.provider);
    const provider = notesProvider(explicit);
    const adapter = getAIProvider(provider);
    res.json({
      provider,
      model: process.env.NOTES_STUDIO_AI_MODEL || adapter.defaultModel,
      configured: isAIProviderConfigured(provider),
      supportedProviders: ['openai', 'gemini', 'claude'],
      outlinePolicyVersion: NOTE_OUTLINE_POLICY_VERSION,
      promptPolicyVersion: NOTE_SECTION_PROMPT_POLICY_VERSION,
      rawSourceTextSentToModel: false,
      sourceExcerptsSentToModel: false,
      acceptedClaimsOnly: true,
      automaticPublicationEnabled: false,
    });
  } catch (error) {
    sendError(res, error, 'Unable to load Notes Studio synthesis capabilities');
  }
});

router.get('/jobs/:id/synthesis', requireAdminPermission('content.questions.read'), async (req, res) => {
  try {
    res.json(await synthesisPayload(id(req.params.id, 'Authoring job ID')));
  } catch (error) {
    sendError(res, error, 'Unable to load Notes Studio synthesis workspace');
  }
});

router.post('/jobs/:id/outline/generate', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new SynthesisError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = id(req.params.id, 'Authoring job ID');
    const job = await loadJob(jobId);
    if (!job) throw new SynthesisError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
    const gate = await loadEvidenceGate(jobId);
    if (!gate.ready || !gate.run) {
      throw new SynthesisError('EVIDENCE_GATE_BLOCKED', 'Accept evidence and cover every required syllabus target before generating an outline.', 409);
    }
    const targetRows = await sqlClient`
      SELECT target.id::text AS id, target.label, target.source_kind AS "sourceKind", target.required
      FROM content.note_coverage_targets target
      WHERE target.job_id = ${jobId}::uuid
        AND (
          target.required OR EXISTS (
            SELECT 1
            FROM content.note_claim_coverage mapping
            JOIN content.note_evidence_claims claim ON claim.id = mapping.claim_id
            WHERE mapping.run_id = ${String(gate.run.id)}::uuid
              AND mapping.target_id = target.id
              AND claim.evidence_state = 'accepted'
          )
        )
      ORDER BY target.required DESC, target.position, target.created_at
    `;
    const targets: OutlineTarget[] = targetRows.map((row) => ({
      id: String(row.id),
      label: String(row.label),
      sourceKind: String(row.sourceKind),
      required: Boolean(row.required),
    }));
    const depth = text(job.brief.depth, 40) || 'standard';
    const maxSections = depth === 'quick_revision' ? 6 : depth === 'comprehensive' ? MAX_SECTIONS : 9;
    const planned = planOutlineSections(job.title, targets, maxSections);
    if (planned.length === 0) throw new SynthesisError('OUTLINE_EMPTY', 'No covered syllabus targets are available for the outline.', 409);
    const inputHash = outlineInputHash({ jobId, evidenceRunId: String(gate.run.id), targets });
    const current = await activeOutline(jobId);
    if (current && String(current.inputHash) === inputHash && String(current.evidenceRunId) === String(gate.run.id)) {
      res.json({ ...(await synthesisPayload(jobId)), idempotent: true });
      return;
    }

    const versionRows = await sqlClient`SELECT COALESCE(MAX(version_number), 0)::int AS value FROM content.note_outline_versions WHERE job_id = ${jobId}::uuid`;
    const versionNumber = Number(versionRows[0]?.value ?? 0) + 1;
    const outlineId = randomUUID();
    await sqlClient.begin(async (tx) => {
      await tx`UPDATE content.note_outline_versions SET state = 'superseded' WHERE job_id = ${jobId}::uuid AND state = 'active'`;
      await tx`
        INSERT INTO content.note_outline_versions (
          id, job_id, evidence_run_id, version_number, input_hash, policy_version, state, created_by, created_at
        ) VALUES (
          ${outlineId}::uuid, ${jobId}::uuid, ${String(gate.run.id)}::uuid, ${versionNumber}, ${inputHash},
          ${NOTE_OUTLINE_POLICY_VERSION}, 'active', ${actorUserId}::uuid, now()
        )
      `;
      for (const plannedSection of planned) {
        const sectionId = randomUUID();
        await tx`
          INSERT INTO content.note_sections (
            id, job_id, outline_version_id, section_key, title, objective, position, state, created_at, updated_at
          ) VALUES (
            ${sectionId}::uuid, ${jobId}::uuid, ${outlineId}::uuid, ${plannedSection.sectionKey},
            ${plannedSection.title}, ${plannedSection.objective}, ${plannedSection.position}, 'planned', now(), now()
          )
        `;
        for (const targetId of plannedSection.targetIds) {
          await tx`
            INSERT INTO content.note_section_coverage (section_id, target_id)
            VALUES (${sectionId}::uuid, ${targetId}::uuid)
          `;
        }
      }
      await tx`
        UPDATE content.note_authoring_jobs
        SET state = 'outline_ready', updated_by = ${actorUserId}::uuid, updated_at = now()
        WHERE id = ${jobId}::uuid
      `;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
          'notes_studio.outline.generated', 'note_authoring_job', ${jobId}::uuid,
          ${`Generated Notes Studio outline v${versionNumber} with ${planned.length} sections`},
          ${JSON.stringify({ outlineId, versionNumber, evidenceRunId: String(gate.run.id), inputHash, policyVersion: NOTE_OUTLINE_POLICY_VERSION })}
        )
      `;
    });
    res.status(201).json({ ...(await synthesisPayload(jobId)), idempotent: false });
  } catch (error) {
    sendError(res, error, 'Unable to generate Notes Studio outline');
  }
});

router.post('/jobs/:jobId/sections/:sectionId/generate', requireAdminPermission('content.questions.update'), async (req, res) => {
  let failureContext: { jobId: string; sectionId: string; provider: string; model: string; inputHash: string; actorUserId: string } | null = null;
  let startedAt = Date.now();
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new SynthesisError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = id(req.params.jobId, 'Authoring job ID');
    const sectionId = id(req.params.sectionId, 'Section ID');
    const [job, gate, outline] = await Promise.all([loadJob(jobId), loadEvidenceGate(jobId), activeOutline(jobId)]);
    if (!job) throw new SynthesisError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
    if (!gate.ready || !gate.run) throw new SynthesisError('EVIDENCE_GATE_BLOCKED', 'The evidence gate must remain satisfied before section generation.', 409);
    if (!outline) throw new SynthesisError('OUTLINE_REQUIRED', 'Generate an outline before section synthesis.', 409);
    if (String(outline.evidenceRunId) !== String(gate.run.id)) throw new SynthesisError('OUTLINE_STALE', 'The evidence run changed. Generate a fresh outline before synthesizing sections.', 409);

    const sectionRows = await sqlClient`
      SELECT
        section.id::text AS id, section.title, section.objective,
        COALESCE(array_agg(target.id::text ORDER BY target.id::text) FILTER (WHERE target.id IS NOT NULL), '{}') AS "targetIds",
        COALESCE(array_agg(target.label ORDER BY target.label) FILTER (WHERE target.id IS NOT NULL), '{}') AS "targetLabels"
      FROM content.note_sections section
      LEFT JOIN content.note_section_coverage sc ON sc.section_id = section.id
      LEFT JOIN content.note_coverage_targets target ON target.id = sc.target_id
      WHERE section.id = ${sectionId}::uuid AND section.job_id = ${jobId}::uuid
        AND section.outline_version_id = ${String(outline.id)}::uuid
      GROUP BY section.id
      LIMIT 1
    `;
    const section = sectionRows[0];
    if (!section) throw new SynthesisError('SECTION_NOT_FOUND', 'Section is not part of the active outline.', 404);
    const claims = await sectionClaims(sectionId, String(gate.run.id));
    if (claims.length === 0) throw new SynthesisError('SECTION_EVIDENCE_MISSING', 'This section has no accepted evidence claims.', 409);
    const targetIds = Array.isArray(section.targetIds) ? section.targetIds.map(String) : [];
    const targetLabels = Array.isArray(section.targetLabels) ? section.targetLabels.map(String) : [];
    const inputHash = sectionInputHash({
      jobId,
      sectionId,
      evidenceRunId: String(gate.run.id),
      targetIds,
      claims,
    });
    const force = req.body?.force === true;
    const reason = text(req.body?.reason, 500);
    const currentVersions = await sqlClient`
      SELECT id::text AS id, input_hash AS "inputHash", version_number AS "versionNumber"
      FROM content.note_section_versions
      WHERE section_id = ${sectionId}::uuid
      ORDER BY version_number DESC
      LIMIT 1
    `;
    if (currentVersions[0] && String(currentVersions[0].inputHash) === inputHash && !force) {
      res.json({ ...(await synthesisPayload(jobId)), idempotent: true });
      return;
    }
    if (force && currentVersions[0] && reason.length < 3) throw new SynthesisError('REGENERATION_REASON_REQUIRED', 'Enter a reason before regenerating an existing section.');

    const explicitProvider = requestedProvider(req.body?.provider);
    const provider = notesProvider(explicitProvider);
    const adapter = getAIProvider(provider);
    const model = text(req.body?.model, 120) || text(process.env.NOTES_STUDIO_AI_MODEL, 120) || adapter.defaultModel;
    if (!isAIProviderConfigured(provider)) {
      throw new SynthesisError('AI_PROVIDER_NOT_CONFIGURED', `Notes Studio provider ${provider} is not configured on the API server.`, 503);
    }
    failureContext = { jobId, sectionId, provider, model, inputHash, actorUserId };
    startedAt = Date.now();
    const generation = buildSectionGenerationRequest({
      noteTitle: job.title,
      sectionTitle: String(section.title),
      objective: String(section.objective),
      targetLabels,
      depth: text(job.brief.depth, 40) || 'standard',
      learnerLevel: text(job.brief.learnerLevel, 40) || 'standard',
      claims,
    });
    const response = await extractWithAI({
      provider,
      model,
      prompt: generation.prompt,
      input: generation.input,
      temperature: 0.15,
      responseSchema: generation.responseSchema,
      responseSchemaName: generation.responseSchemaName,
      timeoutMs: MODEL_TIMEOUT_MS,
      maxRetries: 1,
    });
    const latencyMs = Date.now() - startedAt;
    const normalized = normalizeGeneratedSectionOutput(response.json, claims.map((claim) => claim.id));
    if (!normalized) {
      await recordGenerationFailure({ ...failureContext, latencyMs, error: 'Provider returned output that failed Notes Studio section schema or evidence-id validation.' });
      failureContext = null;
      throw new SynthesisError('INVALID_MODEL_OUTPUT', 'The model output failed Notes Studio structure/evidence validation. No section version was saved.', 502);
    }
    const sectionOutputHash = outputHash(`${normalized.title}\n${normalized.markdown}`);
    const versionRows = await sqlClient`SELECT COALESCE(MAX(version_number), 0)::int AS value FROM content.note_section_versions WHERE section_id = ${sectionId}::uuid`;
    const versionNumber = Number(versionRows[0]?.value ?? 0) + 1;
    const sectionVersionId = randomUUID();
    const status = normalized.warnings.length > 0 ? 'needs_editorial' : 'generated';
    await sqlClient.begin(async (tx) => {
      await tx`
        INSERT INTO content.note_section_versions (
          id, section_id, version_number, title, markdown, status, provider, model,
          prompt_policy_version, input_hash, output_hash, input_claim_ids, used_claim_ids,
          warnings, change_reason, created_by, created_at
        ) VALUES (
          ${sectionVersionId}::uuid, ${sectionId}::uuid, ${versionNumber}, ${normalized.title}, ${normalized.markdown},
          ${status}, ${provider}, ${response.model || model}, ${NOTE_SECTION_PROMPT_POLICY_VERSION}, ${inputHash}, ${sectionOutputHash},
          ${claims.map((claim) => claim.id)}::uuid[], ${normalized.usedClaimIds}::uuid[], ${JSON.stringify(normalized.warnings)},
          ${reason || null}, ${actorUserId}::uuid, now()
        )
      `;
      await tx`
        INSERT INTO content.note_generation_events (
          id, job_id, section_id, section_version_id, provider, model, prompt_policy_version,
          input_hash, output_hash, usage, latency_ms, state, error_message, created_by, created_at
        ) VALUES (
          ${randomUUID()}::uuid, ${jobId}::uuid, ${sectionId}::uuid, ${sectionVersionId}::uuid,
          ${provider}, ${response.model || model}, ${NOTE_SECTION_PROMPT_POLICY_VERSION}, ${inputHash}, ${sectionOutputHash},
          ${JSON.stringify(response.usage)}, ${latencyMs}, 'succeeded', null, ${actorUserId}::uuid, now()
        )
      `;
      await tx`
        UPDATE content.note_sections
        SET state = ${status === 'generated' ? 'generated' : 'needs_editorial'}, updated_at = now()
        WHERE id = ${sectionId}::uuid
      `;
      await tx`
        UPDATE content.note_authoring_jobs
        SET state = 'drafting', updated_by = ${actorUserId}::uuid, updated_at = now()
        WHERE id = ${jobId}::uuid AND state IN ('outline_ready', 'drafting', 'qa_required')
      `;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
          'notes_studio.section.generated', 'note_section', ${sectionId}::uuid,
          ${`Generated Notes Studio section version ${versionNumber}`},
          ${JSON.stringify({ sectionVersionId, versionNumber, provider, model: response.model || model, inputHash, outputHash: sectionOutputHash, usedClaimIds: normalized.usedClaimIds, warnings: normalized.warnings })}
        )
      `;
    });
    failureContext = null;
    res.status(201).json({ ...(await synthesisPayload(jobId)), idempotent: false });
  } catch (error) {
    if (failureContext) {
      try {
        await recordGenerationFailure({
          ...failureContext,
          latencyMs: Date.now() - startedAt,
          error: describeAIProviderError(failureContext.provider, error),
        });
      } catch (recordError) {
        console.error('Unable to record Notes Studio generation failure', recordError);
      }
    }
    sendError(res, error, 'Unable to generate Notes Studio section');
  }
});

router.post('/jobs/:jobId/sections/:sectionId/manual', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new SynthesisError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = id(req.params.jobId, 'Authoring job ID');
    const sectionId = id(req.params.sectionId, 'Section ID');
    const title = text(req.body?.title, 180);
    const markdown = typeof req.body?.markdown === 'string' ? req.body.markdown.trim().slice(0, 14000) : '';
    const reason = text(req.body?.reason, 500);
    if (title.length < 3 || markdown.length < 80) throw new SynthesisError('MANUAL_SECTION_INVALID', 'Manual section title and substantial Markdown content are required.');
    if (reason.length < 3) throw new SynthesisError('MANUAL_SECTION_REASON_REQUIRED', 'Enter an editorial reason for the manual section revision.');
    if (/^#\s+/m.test(markdown) || /^##\s+/m.test(markdown)) throw new SynthesisError('MANUAL_SECTION_HEADING_INVALID', 'Section Markdown must not contain H1 or H2 headings.');
    const [outline, gate] = await Promise.all([activeOutline(jobId), loadEvidenceGate(jobId)]);
    if (!outline || !gate.run || String(outline.evidenceRunId) !== String(gate.run.id)) throw new SynthesisError('OUTLINE_STALE', 'Generate a current evidence-backed outline before editing section copy.', 409);
    const sectionRows = await sqlClient`
      SELECT id::text AS id FROM content.note_sections
      WHERE id = ${sectionId}::uuid AND job_id = ${jobId}::uuid AND outline_version_id = ${String(outline.id)}::uuid
      LIMIT 1
    `;
    if (!sectionRows[0]) throw new SynthesisError('SECTION_NOT_FOUND', 'Section is not part of the active outline.', 404);
    const currentRows = await sqlClient`
      SELECT input_hash AS "inputHash", input_claim_ids AS "inputClaimIds", used_claim_ids AS "usedClaimIds"
      FROM content.note_section_versions
      WHERE section_id = ${sectionId}::uuid
      ORDER BY version_number DESC
      LIMIT 1
    `;
    if (!currentRows[0]) throw new SynthesisError('GENERATED_SECTION_REQUIRED', 'Generate an evidence-backed section before applying a manual wording revision.', 409);
    const versionRows = await sqlClient`SELECT COALESCE(MAX(version_number), 0)::int AS value FROM content.note_section_versions WHERE section_id = ${sectionId}::uuid`;
    const versionNumber = Number(versionRows[0]?.value ?? 0) + 1;
    const sectionVersionId = randomUUID();
    const sectionOutputHash = outputHash(`${title}\n${markdown}`);
    await sqlClient.begin(async (tx) => {
      await tx`
        INSERT INTO content.note_section_versions (
          id, section_id, version_number, title, markdown, status, provider, model, prompt_policy_version,
          input_hash, output_hash, input_claim_ids, used_claim_ids, warnings, change_reason, created_by, created_at
        ) VALUES (
          ${sectionVersionId}::uuid, ${sectionId}::uuid, ${versionNumber}, ${title}, ${markdown}, 'manual', 'manual', 'editor',
          ${NOTE_SECTION_PROMPT_POLICY_VERSION}, ${String(currentRows[0].inputHash)}, ${sectionOutputHash},
          ${currentRows[0].inputClaimIds ?? []}::uuid[], ${currentRows[0].usedClaimIds ?? []}::uuid[], '[]'::jsonb,
          ${reason}, ${actorUserId}::uuid, now()
        )
      `;
      await tx`
        INSERT INTO content.note_generation_events (
          id, job_id, section_id, section_version_id, provider, model, prompt_policy_version,
          input_hash, output_hash, usage, latency_ms, state, error_message, created_by, created_at
        ) VALUES (
          ${randomUUID()}::uuid, ${jobId}::uuid, ${sectionId}::uuid, ${sectionVersionId}::uuid,
          'manual', 'editor', ${NOTE_SECTION_PROMPT_POLICY_VERSION}, ${String(currentRows[0].inputHash)}, ${sectionOutputHash},
          '{}'::jsonb, 0, 'manual', null, ${actorUserId}::uuid, now()
        )
      `;
      await tx`UPDATE content.note_sections SET state = 'reviewed', updated_at = now() WHERE id = ${sectionId}::uuid`;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
          'notes_studio.section.manual_revision', 'note_section', ${sectionId}::uuid,
          ${`Created manual Notes Studio section version ${versionNumber}`},
          ${JSON.stringify({ sectionVersionId, versionNumber, reason, outputHash: sectionOutputHash })}
        )
      `;
    });
    res.status(201).json(await synthesisPayload(jobId));
  } catch (error) {
    sendError(res, error, 'Unable to save Notes Studio manual section revision');
  }
});

router.post('/jobs/:id/synthesis/assemble', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new SynthesisError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = id(req.params.id, 'Authoring job ID');
    const [job, gate, outline] = await Promise.all([loadJob(jobId), loadEvidenceGate(jobId), activeOutline(jobId)]);
    if (!job) throw new SynthesisError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
    if (!gate.ready || !gate.run || !outline) throw new SynthesisError('SYNTHESIS_NOT_READY', 'Current evidence and outline are required before assembly.', 409);
    if (String(outline.evidenceRunId) !== String(gate.run.id)) throw new SynthesisError('OUTLINE_STALE', 'Evidence changed after this outline. Generate a fresh outline.', 409);
    const rows = await sqlClient`
      SELECT
        section.id::text AS "sectionId",
        section.position,
        section.state AS "sectionState",
        version.id::text AS "versionId",
        version.title,
        version.markdown,
        version.output_hash AS "outputHash",
        version.status AS "versionStatus"
      FROM content.note_sections section
      LEFT JOIN LATERAL (
        SELECT current.* FROM content.note_section_versions current
        WHERE current.section_id = section.id
        ORDER BY current.version_number DESC LIMIT 1
      ) version ON true
      WHERE section.outline_version_id = ${String(outline.id)}::uuid
      ORDER BY section.position
    `;
    if (rows.length === 0) throw new SynthesisError('OUTLINE_EMPTY', 'The active outline has no sections.', 409);
    const missing = rows.filter((row) => !row.versionId || row.sectionState === 'needs_editorial' || row.versionStatus === 'needs_editorial');
    if (missing.length > 0) throw new SynthesisError('SECTIONS_INCOMPLETE', `${missing.length} section(s) are missing or still need editorial resolution.`, 409);
    const markdown = assembleNoteDraft({
      noteTitle: job.title,
      sections: rows.map((row) => ({ sectionTitle: String(row.title), markdown: String(row.markdown) })),
    });
    if (!markdown) throw new SynthesisError('DRAFT_ASSEMBLY_FAILED', 'Unable to assemble the current section versions.', 409);
    const inputHash = draftInputHash({
      jobId,
      outlineVersionId: String(outline.id),
      sectionVersions: rows.map((row) => ({ id: String(row.versionId), outputHash: String(row.outputHash) })),
    });
    const currentDraftRows = await sqlClient`
      SELECT id::text AS id, input_hash AS "inputHash" FROM content.note_draft_versions
      WHERE job_id = ${jobId}::uuid AND state = 'assembled'
      ORDER BY version_number DESC LIMIT 1
    `;
    if (currentDraftRows[0] && String(currentDraftRows[0].inputHash) === inputHash) {
      res.json({ ...(await synthesisPayload(jobId)), idempotent: true });
      return;
    }
    const output = outputHash(markdown);
    const versionRows = await sqlClient`SELECT COALESCE(MAX(version_number), 0)::int AS value FROM content.note_draft_versions WHERE job_id = ${jobId}::uuid`;
    const versionNumber = Number(versionRows[0]?.value ?? 0) + 1;
    const draftId = randomUUID();
    await sqlClient.begin(async (tx) => {
      await tx`UPDATE content.note_draft_versions SET state = 'superseded' WHERE job_id = ${jobId}::uuid AND state = 'assembled'`;
      await tx`
        INSERT INTO content.note_draft_versions (
          id, job_id, outline_version_id, version_number, markdown, input_hash, output_hash, state, created_by, created_at
        ) VALUES (
          ${draftId}::uuid, ${jobId}::uuid, ${String(outline.id)}::uuid, ${versionNumber}, ${markdown},
          ${inputHash}, ${output}, 'assembled', ${actorUserId}::uuid, now()
        )
      `;
      await tx`
        UPDATE content.note_authoring_jobs
        SET state = 'qa_required', updated_by = ${actorUserId}::uuid, updated_at = now()
        WHERE id = ${jobId}::uuid
      `;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
          'notes_studio.draft.assembled', 'note_authoring_job', ${jobId}::uuid,
          ${`Assembled Notes Studio draft version ${versionNumber}`},
          ${JSON.stringify({ draftId, versionNumber, outlineVersionId: String(outline.id), inputHash, outputHash: output, sectionVersionIds: rows.map((row) => String(row.versionId)) })}
        )
      `;
    });
    res.status(201).json({ ...(await synthesisPayload(jobId)), idempotent: false });
  } catch (error) {
    sendError(res, error, 'Unable to assemble Notes Studio draft');
  }
});

export default router;
