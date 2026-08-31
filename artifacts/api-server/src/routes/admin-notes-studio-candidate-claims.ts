import { randomUUID } from 'node:crypto';
import { Router, type IRouter, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import {
  MAX_CLAIM_EXTRACTION_BLOCKS,
  NOTES_CLAIM_EXTRACTION_PROMPT_VERSION,
  candidateClaimInputFingerprint,
  candidateClaimOutputFingerprint,
  candidateEvidenceBlockEligible,
  type ClaimExtractionEvidenceKind,
  type ClaimExtractionInput,
} from '../notes-studio/candidate-claim-extraction';
import {
  CandidateClaimModelConfigurationError,
  generateCandidateClaims,
} from '../notes-studio/candidate-claim-extraction-provider';
import { noteClaimFingerprint } from '../notes-studio/evidence-map';
import {
  evaluateSourcePackPolicy,
  noteSourceIdentity,
  noteSourcePackTemplateKey,
  noteSourceRole,
} from '../notes-studio/source-pack-policy';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

class CandidateClaimError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new CandidateClaimError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof CandidateClaimError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  if (error instanceof CandidateClaimModelConfigurationError) {
    res.status(503).json({ error: error.message, code: 'NOTES_STUDIO_EVIDENCE_MODEL_NOT_CONFIGURED' });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'NOTES_STUDIO_CANDIDATE_CLAIM_EXTRACTION_FAILED' });
}

function evidenceKind(value: unknown): ClaimExtractionEvidenceKind {
  return String(value ?? '') === 'editor_reference_note' ? 'editor_reference_note' : 'retained_excerpt';
}

async function loadJobAndPolicy(jobId: string) {
  const jobRows = await sqlClient`
    SELECT id::text AS id, title, source_language AS "sourceLanguage", state, brief
    FROM content.note_authoring_jobs
    WHERE id = ${jobId}::uuid
    LIMIT 1
  `;
  const job = jobRows[0];
  if (!job) throw new CandidateClaimError('JOB_NOT_FOUND', 'Notes Studio authoring job not found.', 404);
  if (String(job.state) !== 'evidence_ready') {
    throw new CandidateClaimError(
      'CANDIDATE_EXTRACTION_NOT_READY',
      'Candidate claim extraction is available only while the job is in evidence review. Finish source/evidence setup before extraction, or use a successor revision after downstream drafting begins.',
      409,
    );
  }

  const sources = await sqlClient`
    SELECT
      document.publisher,
      document.source_uri AS "sourceUri",
      document.content_hash AS "contentHash",
      document.retention_mode AS "retentionMode",
      document.extraction_status AS "extractionStatus",
      LENGTH(COALESCE(document.extracted_text, ''))::int AS "retainedCharCount",
      link.inclusion_state AS "inclusionState",
      link.source_role AS "sourceRole",
      EXISTS (
        SELECT 1
        FROM content.note_source_evidence_blocks block
        WHERE block.job_id = link.job_id
          AND block.source_document_id = link.source_document_id
          AND block.evidence_kind = 'editor_reference_note'
          AND block.reviewed_at IS NOT NULL
      ) AS "referenceEvidenceReady"
    FROM content.note_authoring_sources link
    JOIN content.source_documents document ON document.id = link.source_document_id
    WHERE link.job_id = ${jobId}::uuid
  `;
  const brief = job.brief && typeof job.brief === 'object' && !Array.isArray(job.brief)
    ? job.brief as Record<string, unknown>
    : {};
  const templateKey = noteSourcePackTemplateKey(brief.sourcePackTemplate);
  const policy = evaluateSourcePackPolicy(templateKey, sources.map((source) => ({
    sourceRole: noteSourceRole(source.sourceRole),
    inclusionState: String(source.inclusionState),
    generationReady: source.retentionMode === 'extracted_text'
      && source.extractionStatus === 'processed'
      && Number(source.retainedCharCount ?? 0) >= 100,
    referenceEvidenceReady: Boolean(source.referenceEvidenceReady),
    contentHash: String(source.contentHash ?? ''),
    sourceIdentity: noteSourceIdentity(source.publisher, source.sourceUri),
  })));
  if (!policy.ready) {
    throw new CandidateClaimError(
      'SOURCE_PACK_POLICY_INCOMPLETE',
      'The governed source-pack policy is no longer complete. Resolve source policy before extracting candidate claims.',
      409,
    );
  }
  return { job, policy };
}

async function audit(actorUserId: string, jobId: string, metadata: Record<string, unknown>) {
  await sqlClient`
    INSERT INTO platform.audit_events (
      id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
    ) VALUES (
      ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
      'notes_studio.claim_candidates.extracted', 'note_authoring_job', ${jobId}::uuid,
      'Extracted evidence-grounded candidate claims for editorial review', ${JSON.stringify(metadata)}
    )
  `;
}

router.post('/jobs/:jobId/candidate-claims/extract', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new CandidateClaimError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const jobId = uuid(req.params.jobId, 'Authoring job ID');
    const { job, policy } = await loadJobAndPolicy(jobId);

    const rawBlockIds = Array.isArray(req.body?.blockIds) ? req.body.blockIds : [];
    const blockIds = [...new Set(rawBlockIds.map((value: unknown) => uuid(value, 'Evidence block ID')))];
    if (blockIds.length < 1 || blockIds.length > MAX_CLAIM_EXTRACTION_BLOCKS) {
      throw new CandidateClaimError(
        'INVALID_EVIDENCE_SELECTION',
        `Select between 1 and ${MAX_CLAIM_EXTRACTION_BLOCKS} active evidence blocks for candidate extraction.`,
      );
    }

    const rows = await sqlClient`
      SELECT
        block.id::text AS id,
        block.source_document_id::text AS "sourceDocumentId",
        block.excerpt,
        block.evidence_kind AS "evidenceKind",
        block.reviewed_at AS "reviewedAt",
        document.title AS "sourceTitle",
        document.retention_mode AS "retentionMode",
        document.extraction_status AS "extractionStatus",
        link.position,
        block.block_index AS "blockIndex"
      FROM content.note_source_evidence_blocks block
      JOIN content.note_authoring_sources link
        ON link.job_id = block.job_id AND link.source_document_id = block.source_document_id
      JOIN content.source_documents document ON document.id = block.source_document_id
      WHERE block.job_id = ${jobId}::uuid
        AND block.id = ANY(${blockIds}::uuid[])
        AND link.inclusion_state = 'included'
      ORDER BY link.position, block.source_document_id, block.block_index
    `;
    const eligibleRows = rows.filter((row) => candidateEvidenceBlockEligible({
      evidenceKind: row.evidenceKind,
      reviewedAt: row.reviewedAt,
      retentionMode: row.retentionMode,
      extractionStatus: row.extractionStatus,
    }));
    if (eligibleRows.length !== blockIds.length) {
      throw new CandidateClaimError(
        'EVIDENCE_SELECTION_STALE',
        'One or more selected evidence blocks are no longer active governed evidence for this source pack.',
        409,
      );
    }

    const input: ClaimExtractionInput = {
      jobId,
      noteTitle: String(job.title),
      languageCode: String(job.sourceLanguage || 'en'),
      blocks: eligibleRows.map((row) => ({
        id: String(row.id),
        sourceDocumentId: String(row.sourceDocumentId),
        sourceTitle: String(row.sourceTitle),
        evidenceKind: evidenceKind(row.evidenceKind),
        excerpt: String(row.excerpt),
      })),
    };
    const inputFingerprint = candidateClaimInputFingerprint(input);
    const generated = await generateCandidateClaims(input);
    const outputFingerprint = candidateClaimOutputFingerprint(generated.extraction);

    let created = 0;
    let duplicatesSkipped = 0;
    const createdClaimIds: string[] = [];
    await sqlClient.begin(async (tx) => {
      for (const candidate of generated.extraction.claims) {
        const claimId = randomUUID();
        const claimHash = noteClaimFingerprint(candidate.claimText);
        const inserted = await tx`
          INSERT INTO content.note_source_claims (
            id, job_id, claim_text, claim_hash, state, confidence, contradiction_key,
            editorial_note, created_by, updated_by, created_at, updated_at
          ) VALUES (
            ${claimId}::uuid, ${jobId}::uuid, ${candidate.claimText}, ${claimHash}, 'candidate',
            ${candidate.confidence}, ${candidate.contradictionKey},
            'NS-014/NS-023 model-extracted candidate; editorial acceptance required.',
            ${actorUserId}::uuid, ${actorUserId}::uuid, now(), now()
          )
          ON CONFLICT (job_id, claim_hash) DO NOTHING
          RETURNING id::text AS id
        `;
        if (!inserted[0]) {
          duplicatesSkipped += 1;
          continue;
        }
        created += 1;
        createdClaimIds.push(String(inserted[0].id));
        for (const blockId of candidate.evidenceBlockIds) {
          await tx`
            INSERT INTO content.note_source_claim_evidence (
              job_id, claim_id, evidence_block_id, relation, created_by, created_at
            ) VALUES (
              ${jobId}::uuid, ${claimId}::uuid, ${blockId}::uuid, 'supports', ${actorUserId}::uuid, now()
            )
            ON CONFLICT (claim_id, evidence_block_id) DO NOTHING
          `;
        }
      }
    });

    const selectedReferenceEvidenceCount = input.blocks.filter((block) => block.evidenceKind === 'editor_reference_note').length;
    const selectedRetainedEvidenceCount = input.blocks.length - selectedReferenceEvidenceCount;
    await audit(actorUserId, jobId, {
      provider: generated.provider,
      model: generated.model,
      responseId: generated.responseId,
      usage: generated.usage,
      promptVersion: NOTES_CLAIM_EXTRACTION_PROMPT_VERSION,
      inputFingerprint,
      outputFingerprint,
      sourcePackTemplate: policy.templateKey,
      selectedBlockCount: input.blocks.length,
      selectedRetainedEvidenceCount,
      selectedReferenceEvidenceCount,
      generatedClaimCount: generated.extraction.claims.length,
      createdClaimCount: created,
      duplicateClaimCount: duplicatesSkipped,
      boundedEvidenceBlocksSent: true,
      publisherTextAssumedForReferenceNotes: false,
      fullSourceDocumentsSent: false,
      automaticAcceptance: false,
      automaticCoverageLinking: false,
      automaticSectionGeneration: false,
      learnerPublished: false,
    });

    res.status(201).json({
      generated: generated.extraction.claims.length,
      created,
      duplicatesSkipped,
      createdClaimIds,
      provider: generated.provider,
      model: generated.model,
      promptVersion: NOTES_CLAIM_EXTRACTION_PROMPT_VERSION,
      inputFingerprint,
      outputFingerprint,
      selectedRetainedEvidenceCount,
      selectedReferenceEvidenceCount,
      boundedEvidenceBlocksSent: true,
      fullSourceDocumentsSent: false,
      automaticAcceptance: false,
      automaticCoverageLinking: false,
      automaticSectionGeneration: false,
    });
  } catch (error) {
    sendError(res, error, 'Unable to extract Notes Studio candidate claims');
  }
});

export default router;
