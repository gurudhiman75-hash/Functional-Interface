import { randomUUID } from 'node:crypto';
import { Router, type IRouter, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { extractWithAI } from '../lib/ai-providers';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';
import {
  renderedNoteText,
  sourceOverlapScore,
  type NotesStudioV2NoteBlock,
} from '../notes-studio-v2/core';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const QUALITY_CHECKER_VERSION = 'notes-gen-v1-quality-v2';

class NotesStudioV2ReviewStateError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max = 120) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string) {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new NotesStudioV2ReviewStateError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function actorId(req: any) {
  const id = req.adminSession?.user.id;
  if (!id) throw new NotesStudioV2ReviewStateError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
  return String(id);
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof NotesStudioV2ReviewStateError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'NOTES_STUDIO_V2_REVIEW_STATE_FAILED' });
}

function strings(value: unknown, limit = 20, max = 600) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => text(item, max)).filter(Boolean).slice(0, limit);
}

router.use(authenticate);

/**
 * Resume the newest unfinished Style Bootstrap after a page reload or a new
 * administrator session. Only derived style metadata and reviewed variants are
 * returned here; no corpus text or verification evidence crosses this route.
 */
router.get('/style-bootstrap/state', requireAdminPermission('content.questions.read'), async (_req, res) => {
  try {
    const styles = await sqlClient`
      SELECT
        id::text AS id,
        name,
        COALESCE(tone, '') AS tone,
        COALESCE(sentence_length, 'mixed') AS "sentenceLength",
        COALESCE(terminology_conventions, '{}'::jsonb) AS "terminologyConventions",
        COALESCE(example_structure, '') AS "exampleStructure",
        COALESCE(avoid, '[]'::jsonb) AS avoid,
        COALESCE(exemplar_note_version_ids, '[]'::jsonb) AS "exemplarNoteVersionIds",
        is_active AS "isActive",
        created_at AS "createdAt"
      FROM notes_studio_v2.style_specs
      WHERE is_active = false
      ORDER BY created_at DESC
      LIMIT 1
    `;
    const styleSpec = styles[0] as any;
    if (!styleSpec) {
      res.json(null);
      return;
    }

    const rounds = await sqlClient`
      SELECT
        id::text AS id,
        style_spec_id::text AS "styleSpecId",
        round_number AS "roundNumber",
        variants,
        selected_variant_label AS "selectedVariantLabel",
        admin_edits AS "adminEdits",
        created_at AS "createdAt"
      FROM notes_studio_v2.style_bootstrap_rounds
      WHERE style_spec_id = ${String(styleSpec.id)}::uuid
      ORDER BY round_number
    `;
    const reviewedCount = rounds.filter((round: any) => Boolean(round.selectedVariantLabel)).length;
    res.json({
      styleSpec,
      rounds: rounds.map((round: any) => ({
        ...round,
        converged: reviewedCount >= 2,
      })),
      reviewedCount,
      canActivate: reviewedCount >= 2,
      canGenerateAnotherRound: rounds.length < 3 && (rounds.length === 0 || Boolean((rounds.at(-1) as any)?.selectedVariantLabel)),
    });
  } catch (error) {
    sendError(res, error, 'Unable to load Notes Studio v2 Style Bootstrap state');
  }
});

/**
 * Figure review is intentionally a manual queue. The generator may request a
 * figure, but publication remains blocked until a reviewed SVG reference is
 * attached to every needed placeholder.
 */
router.get('/periods/:periodId/figures', requireAdminPermission('content.questions.read'), async (req, res) => {
  try {
    const periodId = uuid(req.params.periodId, 'Period ID');
    const periods = await sqlClient`SELECT id FROM notes_studio_v2.periods WHERE id = ${periodId}::uuid LIMIT 1`;
    if (!periods[0]) throw new NotesStudioV2ReviewStateError('PERIOD_NOT_FOUND', 'Period not found.', 404);

    const figures = await sqlClient`
      SELECT
        figure.id::text AS id,
        figure.note_version_id::text AS "noteVersionId",
        note.id::text AS "noteId",
        version.version_number AS "versionNumber",
        version.status::text AS "noteStatus",
        note.level::text AS "noteLevel",
        note.sub_category_id::text AS "subCategoryId",
        sub.name AS "subCategory",
        figure.block_ref AS "blockRef",
        figure.placeholder_description AS "placeholderDescription",
        figure.svg_ref AS "svgRef",
        figure.status::text AS status
      FROM notes_studio_v2.note_figures figure
      JOIN notes_studio_v2.note_versions version ON version.id = figure.note_version_id
      JOIN notes_studio_v2.notes note ON note.id = version.note_id
      LEFT JOIN notes_studio_v2.period_sub_categories sub ON sub.id = note.sub_category_id
      WHERE note.period_id = ${periodId}::uuid
      ORDER BY CASE WHEN figure.status = 'needed' THEN 0 ELSE 1 END, version.created_at DESC, figure.block_ref
    `;
    const neededCount = figures.filter((figure: any) => figure.status === 'needed').length;
    res.json({ periodId, neededCount, figures });
  } catch (error) {
    sendError(res, error, 'Unable to load Notes Studio v2 figure review queue');
  }
});

const qualityResponseSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['factualPassed', 'stylePassed', 'factualFindings', 'styleFindings'],
  properties: {
    factualPassed: { type: 'boolean' },
    stylePassed: { type: 'boolean' },
    factualFindings: { type: 'array', items: { type: 'string' }, maxItems: 20 },
    styleFindings: { type: 'array', items: { type: 'string' }, maxItems: 20 },
  },
} as const;

/**
 * Persisted quality review. The AI factual checker receives the generated note
 * plus the source-agnostic fact graph only. Source verification spans are kept
 * on a separate deterministic originality path and never enter the generation
 * or factual/style model prompt.
 */
router.post('/note-versions/:versionId/quality/persisted', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const createdBy = actorId(req);
    const versionId = uuid(req.params.versionId, 'Note version ID');
    const versions = await sqlClient`
      SELECT
        version.id::text AS id,
        version.blocks_by_language AS "blocksByLanguage",
        version.generated_from_fact_ids AS "generatedFromFactIds",
        version.style_spec_id::text AS "styleSpecId",
        note.period_id::text AS "periodId",
        note.sub_category_id::text AS "subCategoryId",
        style.name AS "styleName",
        COALESCE(style.tone, '') AS tone,
        COALESCE(style.sentence_length, 'mixed') AS "sentenceLength",
        COALESCE(style.terminology_conventions, '{}'::jsonb) AS "terminologyConventions",
        COALESCE(style.example_structure, '') AS "exampleStructure",
        COALESCE(style.avoid, '[]'::jsonb) AS avoid
      FROM notes_studio_v2.note_versions version
      JOIN notes_studio_v2.notes note ON note.id = version.note_id
      LEFT JOIN notes_studio_v2.style_specs style ON style.id = version.style_spec_id
      WHERE version.id = ${versionId}::uuid
      LIMIT 1
    `;
    const version = versions[0] as any;
    if (!version) throw new NotesStudioV2ReviewStateError('VERSION_NOT_FOUND', 'Note version not found.', 404);

    const factIds = Array.isArray(version.generatedFromFactIds)
      ? version.generatedFromFactIds.map(String).filter((id: string) => uuidPattern.test(id))
      : [];
    const facts = factIds.length > 0 ? await sqlClient`
      SELECT
        fact.id::text AS id,
        sub.name AS "subCategory",
        fact.claim,
        fact.entities,
        fact.date_or_era AS "dateOrEra",
        fact.exam_frequency::text AS "examFrequency"
      FROM notes_studio_v2.facts fact
      JOIN notes_studio_v2.period_sub_categories sub ON sub.id = fact.sub_category_id
      WHERE fact.id = ANY(${factIds}::uuid[])
      ORDER BY sub.order_index, fact.created_at, fact.stable_code
    ` : [];

    const evidence = factIds.length > 0 ? await sqlClient`
      SELECT
        ref.corpus_doc_id::text AS "corpusDocId",
        ref.locator,
        ref.extracted_text AS "extractedText"
      FROM notes_studio_v2.fact_source_refs ref
      WHERE ref.fact_id = ANY(${factIds}::uuid[])
      ORDER BY ref.corpus_doc_id, ref.id
    ` : [];

    const open = await sqlClient`
      SELECT COUNT(*)::int AS count
      FROM notes_studio_v2.contradiction_groups
      WHERE period_id = ${String(version.periodId)}::uuid
        AND status = 'open'
        AND (${version.subCategoryId ? String(version.subCategoryId) : null}::uuid IS NULL
          OR sub_category_id = ${version.subCategoryId ? String(version.subCategoryId) : null}::uuid)
    `;
    const contradictionBlocked = Number((open[0] as any)?.count ?? 0) > 0;

    const blocksByLanguage = version.blocksByLanguage ?? {};
    const styleSpec = {
      name: String(version.styleName ?? ''),
      tone: String(version.tone ?? ''),
      sentenceLength: String(version.sentenceLength ?? 'mixed'),
      terminologyConventions: version.terminologyConventions ?? {},
      exampleStructure: String(version.exampleStructure ?? ''),
      avoid: Array.isArray(version.avoid) ? version.avoid.map(String) : [],
    };

    const factualFindings: Array<Record<string, unknown>> = [];
    const styleFindings: Array<Record<string, unknown>> = [];
    const modelMetadata: Record<string, unknown> = {};
    let factualAiPassed = factIds.length > 0 && facts.length === factIds.length;
    let styleAiPassed = Boolean(version.styleSpecId);

    for (const language of ['en', 'hi', 'pa'] as const) {
      const blocks = Array.isArray(blocksByLanguage[language])
        ? blocksByLanguage[language] as NotesStudioV2NoteBlock[]
        : [];
      if (blocks.length === 0) {
        factualAiPassed = false;
        styleAiPassed = false;
        factualFindings.push({ code: 'LANGUAGE_MISSING', severity: 'blocker', language, message: `${language} note blocks are missing.` });
        continue;
      }
      const generatedText = renderedNoteText(blocks);
      const ai = await extractWithAI({
        prompt: {
          system: [
            'You are a strict Notes Studio v2 quality checker, not an author.',
            'Evaluate factual support only against the supplied source-agnostic fact graph; do not use outside knowledge.',
            'Evaluate writing style only against the supplied StyleSpec.',
            'Do not rewrite, correct, expand, or mutate the note.',
            'A factual claim not supported by the graph is a blocker. Missing required facts are also blockers because coverage must be exhaustive.',
          ].join(' '),
          user: `Review the ${language} note for factual support, exhaustive fact coverage, and StyleSpec consistency.`,
        },
        input: JSON.stringify({
          language,
          noteText: generatedText,
          factGraph: facts,
          styleSpec,
        }),
        responseSchema: qualityResponseSchema,
        responseSchemaName: `notes_studio_v2_quality_${language}`,
        temperature: 0,
      });
      const result = ai.json as any;
      if (!result || typeof result.factualPassed !== 'boolean' || typeof result.stylePassed !== 'boolean') {
        throw new NotesStudioV2ReviewStateError('INVALID_QUALITY_RESPONSE', `Quality provider returned an invalid ${language} response.`, 502);
      }
      factualAiPassed = factualAiPassed && result.factualPassed;
      styleAiPassed = styleAiPassed && result.stylePassed;
      for (const finding of strings(result.factualFindings)) {
        factualFindings.push({ code: 'AI_FACTUAL_FINDING', severity: 'blocker', language, message: finding });
      }
      for (const finding of strings(result.styleFindings)) {
        styleFindings.push({ code: 'AI_STYLE_FINDING', severity: result.stylePassed ? 'warning' : 'blocker', language, message: finding });
      }
      modelMetadata[language] = { provider: ai.provider, model: ai.model, usage: ai.usage };
    }

    if (contradictionBlocked) {
      factualFindings.push({ code: 'OPEN_CONTRADICTION', severity: 'blocker', message: 'Unresolved contradictions remain for this note target.' });
    }
    if (facts.length !== factIds.length) {
      factualFindings.push({ code: 'FACT_TRACEABILITY_GAP', severity: 'blocker', message: 'One or more generatedFromFactIds no longer resolve to the fact graph.' });
    }

    const overlapFindings: Array<Record<string, unknown>> = [];
    for (const language of ['en', 'hi', 'pa'] as const) {
      const blocks = Array.isArray(blocksByLanguage[language])
        ? blocksByLanguage[language] as NotesStudioV2NoteBlock[]
        : [];
      const generated = renderedNoteText(blocks);
      const byCorpus = new Map<string, string[]>();
      for (const row of evidence as any[]) {
        if (!row.corpusDocId || !row.extractedText) continue;
        const corpusDocId = String(row.corpusDocId);
        byCorpus.set(corpusDocId, [...(byCorpus.get(corpusDocId) ?? []), String(row.extractedText)]);
      }
      for (const [corpusDocId, spans] of byCorpus) {
        const score = sourceOverlapScore(generated, spans.join('\n'));
        if (score >= 0.18) {
          overlapFindings.push({
            code: 'SOURCE_SPAN_OVERLAP',
            severity: score >= 0.3 ? 'blocker' : 'warning',
            language,
            corpusDocId,
            score,
            message: `${language} has ${(score * 100).toFixed(1)}% matching 6-word spans against verification text from one corpus source.`,
          });
        }
      }
    }

    const gates = [
      {
        key: 'factual-accuracy',
        passed: factualAiPassed && !contradictionBlocked,
        findings: factualFindings,
      },
      {
        key: 'originality',
        passed: !overlapFindings.some((finding) => finding.severity === 'blocker'),
        findings: overlapFindings,
      },
      {
        key: 'style-consistency',
        passed: styleAiPassed,
        findings: styleFindings,
      },
      {
        key: 'exam-relevance',
        passed: true,
        findings: [{
          code: 'ADVISORY_ONLY',
          severity: 'warning',
          message: 'Exam-frequency metadata remains advisory and does not remove facts from coverage.',
        }],
      },
    ];
    const reviewReady = gates.every((gate) => gate.passed);
    const qualityRunId = randomUUID();
    await sqlClient`
      INSERT INTO notes_studio_v2.quality_runs (
        id, note_version_id, review_ready, gates, checker_version, model_metadata, created_by
      ) VALUES (
        ${qualityRunId}::uuid, ${versionId}::uuid, ${reviewReady}, ${JSON.stringify(gates)}::jsonb,
        ${QUALITY_CHECKER_VERSION}, ${JSON.stringify(modelMetadata)}::jsonb, ${createdBy}
      )
    `;
    const persisted = await sqlClient`
      SELECT
        id::text AS id,
        note_version_id::text AS "noteVersionId",
        review_ready AS "reviewReady",
        gates,
        checker_version AS "checkerVersion",
        model_metadata AS "modelMetadata",
        created_by AS "createdBy",
        created_at AS "createdAt"
      FROM notes_studio_v2.quality_runs
      WHERE id = ${qualityRunId}::uuid
    `;
    res.status(201).json(persisted[0]);
  } catch (error) {
    sendError(res, error, 'Unable to run persisted Notes Studio v2 quality review');
  }
});

router.get('/note-versions/:versionId/quality/latest', requireAdminPermission('content.questions.read'), async (req, res) => {
  try {
    const versionId = uuid(req.params.versionId, 'Note version ID');
    const versions = await sqlClient`SELECT id FROM notes_studio_v2.note_versions WHERE id = ${versionId}::uuid LIMIT 1`;
    if (!versions[0]) throw new NotesStudioV2ReviewStateError('VERSION_NOT_FOUND', 'Note version not found.', 404);
    const rows = await sqlClient`
      SELECT
        id::text AS id,
        note_version_id::text AS "noteVersionId",
        review_ready AS "reviewReady",
        gates,
        checker_version AS "checkerVersion",
        model_metadata AS "modelMetadata",
        created_by AS "createdBy",
        created_at AS "createdAt"
      FROM notes_studio_v2.quality_runs
      WHERE note_version_id = ${versionId}::uuid
      ORDER BY created_at DESC, id DESC
      LIMIT 1
    `;
    res.json(rows[0] ?? null);
  } catch (error) {
    sendError(res, error, 'Unable to load latest Notes Studio v2 quality review');
  }
});

export default router;
