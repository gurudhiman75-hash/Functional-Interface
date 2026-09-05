import { Router, type IRouter, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const sourceTypes = new Set(['textbook', 'reference', 'academic', 'other']);
const examFrequencies = new Set(['high', 'medium', 'low']);

class NotesStudioV2MetadataError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max = 500) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string) {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new NotesStudioV2MetadataError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function actorId(req: any) {
  const id = req.adminSession?.user.id;
  if (!id) throw new NotesStudioV2MetadataError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
  return String(id);
}

function uniqueStrings(value: unknown, maxItems = 50, maxLength = 180) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => text(item, maxLength)).filter(Boolean))].slice(0, maxItems);
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof NotesStudioV2MetadataError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'NOTES_STUDIO_V2_METADATA_FAILED' });
}

router.use(authenticate);

/**
 * Corpus metadata influences extraction routing and administrator review only.
 * subCategoryHints are deliberately not used as a hard extraction or generation
 * filter; valid facts outside the hints remain eligible for the period graph.
 */
router.patch('/corpus/:corpusDocId/metadata', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    actorId(req);
    const corpusDocId = uuid(req.params.corpusDocId, 'Corpus document ID');
    const docs = await sqlClient`
      SELECT id::text AS id, period_id::text AS "periodId", title, source_type::text AS "sourceType",
        file_path AS file, sub_category_hints AS "subCategoryHints", uploaded_at AS "uploadedAt"
      FROM notes_studio_v2.corpus_docs
      WHERE id = ${corpusDocId}::uuid
      LIMIT 1
    `;
    const current = docs[0] as any;
    if (!current) throw new NotesStudioV2MetadataError('CORPUS_NOT_FOUND', 'Corpus source not found.', 404);

    const title = req.body?.title === undefined ? String(current.title) : text(req.body.title, 300);
    const sourceType = req.body?.sourceType === undefined ? String(current.sourceType) : text(req.body.sourceType, 40).toLowerCase();
    const hints = req.body?.subCategoryHints === undefined
      ? (Array.isArray(current.subCategoryHints) ? current.subCategoryHints.map(String) : [])
      : uniqueStrings(req.body.subCategoryHints, 30, 180);

    if (!title) throw new NotesStudioV2MetadataError('TITLE_REQUIRED', 'Corpus title is required.');
    if (!sourceTypes.has(sourceType)) throw new NotesStudioV2MetadataError('INVALID_SOURCE_TYPE', 'Choose textbook, reference, academic or other.');

    if (hints.length > 0) {
      const taxonomy = await sqlClient`
        SELECT name FROM notes_studio_v2.period_sub_categories
        WHERE period_id = ${String(current.periodId)}::uuid
      `;
      const valid = new Set(taxonomy.map((row: any) => String(row.name)));
      const unknown = hints.filter((hint) => !valid.has(hint));
      if (unknown.length > 0) {
        throw new NotesStudioV2MetadataError(
          'UNKNOWN_SUBCATEGORY_HINT',
          `Unknown period sub-category hint(s): ${unknown.join(', ')}.`,
        );
      }
    }

    const rows = await sqlClient`
      UPDATE notes_studio_v2.corpus_docs
      SET title = ${title},
          source_type = ${sourceType}::notes_studio_v2.source_type,
          sub_category_hints = ${JSON.stringify(hints)}::jsonb
      WHERE id = ${corpusDocId}::uuid
      RETURNING id::text AS id, period_id::text AS "periodId", title,
        source_type::text AS "sourceType", file_path AS file,
        sub_category_hints AS "subCategoryHints", uploaded_at AS "uploadedAt"
    `;
    res.json(rows[0]);
  } catch (error) {
    sendError(res, error, 'Unable to update Notes Studio v2 corpus metadata');
  }
});

/**
 * PYQ/exam frequency is advisory metadata only. This endpoint never changes a
 * fact's confidence, graph membership, or generation eligibility.
 */
router.patch('/facts/:factId/exam-frequency', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    actorId(req);
    const factId = uuid(req.params.factId, 'Fact ID');
    const raw = req.body?.examFrequency;
    const examFrequency = raw === null || raw === '' || raw === undefined
      ? null
      : text(raw, 20).toLowerCase();
    if (examFrequency !== null && !examFrequencies.has(examFrequency)) {
      throw new NotesStudioV2MetadataError('INVALID_EXAM_FREQUENCY', 'Choose high, medium, low or clear the tag.');
    }

    const rows = await sqlClient`
      UPDATE notes_studio_v2.facts
      SET exam_frequency = ${examFrequency}::notes_studio_v2.exam_frequency,
          updated_at = now()
      WHERE id = ${factId}::uuid
      RETURNING id::text AS id, period_id::text AS "periodId", sub_category_id::text AS "subCategoryId",
        stable_code AS "stableCode", claim, entities, date_or_era AS "dateOrEra",
        confidence::text AS confidence, exam_frequency::text AS "examFrequency", updated_at AS "updatedAt"
    `;
    if (!rows[0]) throw new NotesStudioV2MetadataError('FACT_NOT_FOUND', 'Fact not found.', 404);
    res.json({ ...rows[0], examFrequencyIsAdvisory: true, generationEligibilityChanged: false });
  } catch (error) {
    sendError(res, error, 'Unable to update Notes Studio v2 exam-frequency metadata');
  }
});

router.get('/periods/:periodId/exam-frequency-summary', requireAdminPermission('content.questions.read'), async (req, res) => {
  try {
    const periodId = uuid(req.params.periodId, 'Period ID');
    const rows = await sqlClient`
      SELECT
        COUNT(*) FILTER (WHERE exam_frequency = 'high')::int AS high,
        COUNT(*) FILTER (WHERE exam_frequency = 'medium')::int AS medium,
        COUNT(*) FILTER (WHERE exam_frequency = 'low')::int AS low,
        COUNT(*) FILTER (WHERE exam_frequency IS NULL)::int AS untagged,
        COUNT(*)::int AS total
      FROM notes_studio_v2.facts
      WHERE period_id = ${periodId}::uuid
    `;
    res.json({
      periodId,
      ...(rows[0] ?? { high: 0, medium: 0, low: 0, untagged: 0, total: 0 }),
      advisoryOnly: true,
      filtersGeneration: false,
    });
  } catch (error) {
    sendError(res, error, 'Unable to load Notes Studio v2 exam-frequency summary');
  }
});

export default router;
