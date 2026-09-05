import { Router, type IRouter, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof NotesStudioV2ReviewStateError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'NOTES_STUDIO_V2_REVIEW_STATE_FAILED' });
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

export default router;
