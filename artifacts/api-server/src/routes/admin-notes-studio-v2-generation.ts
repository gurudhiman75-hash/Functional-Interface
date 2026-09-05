import { randomUUID } from 'node:crypto';
import { Router, type IRouter, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { extractWithAI } from '../lib/ai-providers';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';
import {
  buildFactGraph,
  buildGenerationRequest,
  validateNoteBlocks,
  type FactRow,
  type NotesStudioV2Language,
  type NotesStudioV2NoteBlock,
} from '../notes-studio-v2/core';
import adminNotesStudioV2PdfIngestionRouter from './admin-notes-studio-v2-pdf-ingestion';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const requiredLanguageOrder: NotesStudioV2Language[] = ['en', 'hi', 'pa'];

class NotesStudioV2GenerationError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max = 400) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string) {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new NotesStudioV2GenerationError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function actorId(req: any) {
  const id = req.adminSession?.user.id;
  if (!id) throw new NotesStudioV2GenerationError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
  return String(id);
}

function languages(value: unknown): NotesStudioV2Language[] {
  if (!Array.isArray(value)) {
    throw new NotesStudioV2GenerationError('ALL_LANGUAGES_REQUIRED', 'Generation requires en, hi and pa independent passes.');
  }
  const normalized = [...new Set(value.map((item) => text(item, 8)).filter(Boolean))];
  if (normalized.length !== 3 || !requiredLanguageOrder.every((language) => normalized.includes(language))) {
    throw new NotesStudioV2GenerationError('ALL_LANGUAGES_REQUIRED', 'Generation requires en, hi and pa exactly once.');
  }
  return requiredLanguageOrder;
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof NotesStudioV2GenerationError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'NOTES_STUDIO_V2_GENERATION_FAILED' });
}

async function loadActiveStyleWithExemplars() {
  const styles = await sqlClient`
    SELECT
      id::text AS id,
      name,
      COALESCE(tone, '') AS tone,
      COALESCE(sentence_length, 'mixed') AS "sentenceLength",
      COALESCE(terminology_conventions, '{}'::jsonb) AS "terminologyConventions",
      COALESCE(example_structure, '') AS "exampleStructure",
      COALESCE(avoid, '[]'::jsonb) AS avoid
    FROM notes_studio_v2.style_specs
    WHERE is_active = true
    ORDER BY created_at DESC
    LIMIT 1
  `;
  const style = styles[0] as any;
  if (!style) return null;

  const rounds = await sqlClient`
    SELECT variants, selected_variant_label AS "selectedVariantLabel", admin_edits AS "adminEdits"
    FROM notes_studio_v2.style_bootstrap_rounds
    WHERE style_spec_id = ${String(style.id)}::uuid
      AND selected_variant_label IS NOT NULL
    ORDER BY round_number
    LIMIT 3
  `;
  const exemplars = rounds.map((round: any) => {
    const variants = Array.isArray(round.variants) ? round.variants : [];
    const selected = variants.find((variant: any) => String(variant.label) === String(round.selectedVariantLabel));
    return text(round.adminEdits, 12000) || text(selected?.content, 12000);
  }).filter(Boolean);

  return { ...style, exemplars };
}

// Keep the robust PDF override inside the already-isolated v2 router chain. The
// central route registry remains unchanged, so legacy Notes Studio and unrelated
// admin surfaces are not made dependent on the v2 ingestion implementation.
router.use((req, res, next) => {
  if (req.method === 'POST' && /^\/periods\/[^/]+\/corpus\/upload\/?$/.test(req.path)) {
    adminNotesStudioV2PdfIngestionRouter(req, res, next);
    return;
  }
  next();
});

/**
 * Canonical Notes Studio v2 generation route.
 *
 * This router is mounted before the compatibility implementation so approved
 * Style Bootstrap outputs can serve as few-shot STYLE exemplars. Factual input
 * still comes exclusively from notes_studio_v2.facts + taxonomy. The exemplar
 * strings originate from prior generated/admin-reviewed bootstrap output, never
 * from source documents or verification spans.
 */
router.post(
  '/notes/generate',
  authenticate,
  requireAdminPermission('content.questions.update'),
  async (req, res) => {
    try {
      const createdBy = actorId(req);
      const periodId = uuid(req.body?.periodId, 'Period ID');
      const noteLevel = text(req.body?.noteLevel, 20);
      if (!['topic', 'subcategory'].includes(noteLevel)) {
        throw new NotesStudioV2GenerationError('INVALID_NOTE_LEVEL', 'Choose topic or subcategory.');
      }
      const subCategoryId = noteLevel === 'subcategory'
        ? uuid(req.body?.subCategoryId, 'Sub-category ID')
        : null;
      const generationLanguages = languages(req.body?.languages);

      const periods = await sqlClient`
        SELECT id::text AS id, name
        FROM notes_studio_v2.periods
        WHERE id = ${periodId}::uuid
        LIMIT 1
      `;
      const period = periods[0] as any;
      if (!period) throw new NotesStudioV2GenerationError('PERIOD_NOT_FOUND', 'Period not found.', 404);

      let subCategoryName: string | null = null;
      if (subCategoryId) {
        const subCategories = await sqlClient`
          SELECT name
          FROM notes_studio_v2.period_sub_categories
          WHERE id = ${subCategoryId}::uuid AND period_id = ${periodId}::uuid
          LIMIT 1
        `;
        if (!subCategories[0]) throw new NotesStudioV2GenerationError('SUBCATEGORY_NOT_FOUND', 'Sub-category not found for this period.', 404);
        subCategoryName = String((subCategories[0] as any).name);
      }

      const openConflicts = await sqlClient`
        SELECT COUNT(*)::int AS count
        FROM notes_studio_v2.contradiction_groups
        WHERE period_id = ${periodId}::uuid
          AND status = 'open'
          AND (${subCategoryId}::uuid IS NULL OR sub_category_id = ${subCategoryId}::uuid)
      `;
      if (Number((openConflicts[0] as any)?.count ?? 0) > 0) {
        throw new NotesStudioV2GenerationError('UNRESOLVED_CONTRADICTIONS', 'Resolve contradictions before generation.', 409);
      }

      const style = await loadActiveStyleWithExemplars();
      if (!style) throw new NotesStudioV2GenerationError('ACTIVE_STYLE_REQUIRED', 'Activate a converged StyleSpec before generation.', 409);
      if (style.exemplars.length < 2) {
        throw new NotesStudioV2GenerationError(
          'STYLE_EXEMPLARS_REQUIRED',
          'The active StyleSpec must retain at least two reviewed bootstrap exemplars before generation.',
          409,
        );
      }

      // Critical fact-only boundary: no source-ref or extracted-text table is joined here.
      const rows = await sqlClient`
        SELECT
          fact.id::text AS id,
          fact.period_id::text AS "periodId",
          fact.sub_category_id::text AS "subCategoryId",
          sub.name AS "subCategory",
          fact.claim,
          fact.entities,
          fact.date_or_era AS "dateOrEra",
          fact.confidence::text AS confidence,
          fact.exam_frequency::text AS "examFrequency"
        FROM notes_studio_v2.facts fact
        JOIN notes_studio_v2.period_sub_categories sub ON sub.id = fact.sub_category_id
        WHERE fact.period_id = ${periodId}::uuid
          AND fact.confidence <> 'disputed'
          AND (${subCategoryId}::uuid IS NULL OR fact.sub_category_id = ${subCategoryId}::uuid)
        ORDER BY sub.order_index, fact.created_at, fact.stable_code
      `;
      const graph = buildFactGraph(rows as unknown as FactRow[]);
      if (graph.length === 0) throw new NotesStudioV2GenerationError('NO_ELIGIBLE_FACTS', 'No eligible facts exist for this target.', 409);

      const targetLabel = subCategoryName
        ? `${String(period.name)} — ${subCategoryName}`
        : String(period.name);
      const outputs: Record<NotesStudioV2Language, NotesStudioV2NoteBlock[]> = {
        en: [],
        hi: [],
        pa: [],
      };
      const modelMetadata: Record<string, unknown> = {};

      for (const language of generationLanguages) {
        const request = buildGenerationRequest({
          language,
          facts: graph,
          style: {
            tone: String(style.tone ?? ''),
            sentenceLength: ['short', 'medium', 'mixed'].includes(String(style.sentenceLength))
              ? style.sentenceLength
              : 'mixed',
            terminologyConventions: style.terminologyConventions ?? {},
            exampleStructure: String(style.exampleStructure ?? ''),
            avoid: Array.isArray(style.avoid) ? style.avoid.map(String) : [],
            exemplars: style.exemplars,
          },
          noteLevel: noteLevel as 'topic' | 'subcategory',
          targetLabel,
        });
        const ai = await extractWithAI(request);
        outputs[language] = validateNoteBlocks(ai.json);
        modelMetadata[language] = { provider: ai.provider, model: ai.model, usage: ai.usage };
      }

      const existingNotes = await sqlClient`
        SELECT id::text AS id
        FROM notes_studio_v2.notes
        WHERE period_id = ${periodId}::uuid
          AND level = ${noteLevel}::notes_studio_v2.note_level
          AND (
            (${subCategoryId}::uuid IS NULL AND sub_category_id IS NULL)
            OR sub_category_id = ${subCategoryId}::uuid
          )
        LIMIT 1
      `;
      const noteId = existingNotes[0] ? String((existingNotes[0] as any).id) : randomUUID();
      const versionId = randomUUID();
      let versionNumber = 1;

      await sqlClient.begin(async (tx) => {
        if (!existingNotes[0]) {
          await tx`
            INSERT INTO notes_studio_v2.notes (id, period_id, sub_category_id, level)
            VALUES (${noteId}::uuid, ${periodId}::uuid, ${subCategoryId}::uuid, ${noteLevel}::notes_studio_v2.note_level)
          `;
        }
        const maximum = await tx`
          SELECT COALESCE(MAX(version_number), 0)::int AS max
          FROM notes_studio_v2.note_versions
          WHERE note_id = ${noteId}::uuid
        `;
        versionNumber = Number((maximum[0] as any)?.max ?? 0) + 1;
        await tx`
          INSERT INTO notes_studio_v2.note_versions (
            id,
            note_id,
            version_number,
            blocks_by_language,
            style_spec_id,
            generated_from_fact_ids,
            status,
            created_by
          ) VALUES (
            ${versionId}::uuid,
            ${noteId}::uuid,
            ${versionNumber},
            ${JSON.stringify(outputs)}::jsonb,
            ${String(style.id)}::uuid,
            ${JSON.stringify(graph.map((fact) => fact.id))}::jsonb,
            'draft',
            ${createdBy}
          )
        `;
      });

      const versions = await sqlClient`
        SELECT
          id::text AS id,
          note_id::text AS "noteId",
          version_number AS "versionNumber",
          blocks_by_language AS "blocksByLanguage",
          style_spec_id::text AS "styleSpecId",
          generated_from_fact_ids AS "generatedFromFactIds",
          status::text AS status,
          created_by AS "createdBy",
          created_at AS "createdAt",
          published_at AS "publishedAt"
        FROM notes_studio_v2.note_versions
        WHERE id = ${versionId}::uuid
      `;
      res.status(201).json({
        noteId,
        version: versions[0],
        languagesGenerated: generationLanguages,
        styleExemplarCount: style.exemplars.length,
        modelMetadata,
      });
    } catch (error) {
      sendError(res, error, 'Unable to generate Notes Studio v2 note with reviewed style exemplars');
    }
  },
);

export default router;
