import { createHash, randomUUID } from 'node:crypto';
import { Router, type IRouter, type Response } from 'express';
import multer from 'multer';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { extractWithAI } from '../lib/ai-providers';
import { authenticate } from '../middlewares/auth';
import { ingestPdfBuffer } from '../generators/knowledge/pdf-ingestion';
import {
  buildExtractionRequest,
  buildFactGraph,
  buildGenerationRequest,
  renderedNoteText,
  sourceOverlapScore,
  validateExtractedFacts,
  validateNoteBlocks,
  type FactRow,
  type NotesStudioV2Language,
  type NotesStudioV2NoteBlock,
} from '../notes-studio-v2/core';

const router: IRouter = Router();
const pdfUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 30 * 1024 * 1024, files: 1 },
});
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const sourceTypes = new Set(['textbook', 'reference', 'academic', 'other']);
const languageSet = new Set<NotesStudioV2Language>(['en', 'hi', 'pa']);

class NotesStudioV2Error extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max = 500) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string) {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new NotesStudioV2Error('INVALID_ID', `${label} is invalid.`);
  return id;
}

function actorId(req: any) {
  const id = req.adminSession?.user.id;
  if (!id) throw new NotesStudioV2Error('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
  return String(id);
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof NotesStudioV2Error) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'NOTES_STUDIO_V2_FAILED' });
}

function uniqueStrings(value: unknown, maxItems = 50, maxLength = 160) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => text(item, maxLength)).filter(Boolean))].slice(0, maxItems);
}

function requiredLanguages(value: unknown): NotesStudioV2Language[] {
  const parsed = uniqueStrings(value, 3, 8) as NotesStudioV2Language[];
  if (parsed.length !== 3 || parsed.some((language) => !languageSet.has(language))) {
    throw new NotesStudioV2Error(
      'ALL_LANGUAGES_REQUIRED',
      'Notes Studio v2 generation requires independent English, Hindi and Punjabi passes.',
    );
  }
  const set = new Set(parsed);
  if (![...languageSet].every((language) => set.has(language))) {
    throw new NotesStudioV2Error('ALL_LANGUAGES_REQUIRED', 'Generation requires en, hi and pa exactly once.');
  }
  return ['en', 'hi', 'pa'];
}

function normalizeClaim(value: string) {
  return value.toLowerCase().replace(/[^\p{L}\p{N}\s]+/gu, ' ').replace(/\s+/g, ' ').trim();
}

async function loadTaxonomy(periodId: string) {
  const rows = await sqlClient`
    SELECT id::text AS id, name, order_index AS "orderIndex"
    FROM notes_studio_v2.period_sub_categories
    WHERE period_id = ${periodId}::uuid
    ORDER BY order_index, name
  `;
  return rows.map((row: any) => ({ id: String(row.id), name: String(row.name), orderIndex: Number(row.orderIndex) }));
}

async function loadPeriod(periodId: string) {
  const rows = await sqlClient`
    SELECT id::text AS id, name, order_index AS "orderIndex", created_at AS "createdAt"
    FROM notes_studio_v2.periods
    WHERE id = ${periodId}::uuid
    LIMIT 1
  `;
  if (!rows[0]) return null;
  return { ...rows[0], subCategories: await loadTaxonomy(periodId) };
}

async function loadFacts(periodId: string, includeSourceRefs: boolean) {
  const rows = await sqlClient`
    SELECT
      fact.id::text AS id,
      fact.period_id::text AS "periodId",
      fact.sub_category_id::text AS "subCategoryId",
      sub.name AS "subCategory",
      fact.stable_code AS "stableCode",
      fact.claim,
      fact.entities,
      fact.date_or_era AS "dateOrEra",
      fact.confidence::text AS confidence,
      fact.exam_frequency::text AS "examFrequency",
      fact.created_at AS "createdAt",
      fact.updated_at AS "updatedAt"
    FROM notes_studio_v2.facts fact
    JOIN notes_studio_v2.period_sub_categories sub ON sub.id = fact.sub_category_id
    WHERE fact.period_id = ${periodId}::uuid
    ORDER BY sub.order_index, fact.created_at, fact.stable_code
  `;
  if (!includeSourceRefs) return rows;
  const refs = await sqlClient`
    SELECT
      ref.fact_id::text AS "factId",
      ref.corpus_doc_id::text AS "corpusDocId",
      ref.locator,
      ref.extracted_text AS "extractedText"
    FROM notes_studio_v2.fact_source_refs ref
    JOIN notes_studio_v2.facts fact ON fact.id = ref.fact_id
    WHERE fact.period_id = ${periodId}::uuid
    ORDER BY ref.fact_id, ref.id
  `;
  const byFact = new Map<string, any[]>();
  for (const ref of refs as any[]) {
    const factId = String(ref.factId);
    const list = byFact.get(factId) ?? [];
    list.push({ corpusDocId: String(ref.corpusDocId), locator: String(ref.locator), extractedText: ref.extractedText ?? undefined });
    byFact.set(factId, list);
  }
  return rows.map((row: any) => ({ ...row, sourceRefs: byFact.get(String(row.id)) ?? [] }));
}

async function loadContradictions(periodId: string) {
  const groups = await sqlClient`
    SELECT
      grp.id::text AS id,
      grp.period_id::text AS "periodId",
      grp.sub_category_id::text AS "subCategoryId",
      grp.status::text AS status,
      grp.resolved_fact_id::text AS "resolvedFactId",
      grp.resolution_note AS "resolutionNote",
      grp.created_at AS "createdAt",
      grp.resolved_at AS "resolvedAt"
    FROM notes_studio_v2.contradiction_groups grp
    WHERE grp.period_id = ${periodId}::uuid
    ORDER BY grp.status, grp.created_at
  `;
  const links = await sqlClient`
    SELECT link.contradiction_group_id::text AS "groupId", link.fact_id::text AS "factId"
    FROM notes_studio_v2.contradiction_group_facts link
    JOIN notes_studio_v2.contradiction_groups grp ON grp.id = link.contradiction_group_id
    WHERE grp.period_id = ${periodId}::uuid
  `;
  const byGroup = new Map<string, string[]>();
  for (const link of links as any[]) {
    const id = String(link.groupId);
    byGroup.set(id, [...(byGroup.get(id) ?? []), String(link.factId)]);
  }
  return groups.map((group: any) => ({ ...group, factIds: byGroup.get(String(group.id)) ?? [] }));
}

async function loadActiveStyleSpec() {
  const rows = await sqlClient`
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
    WHERE is_active = true
    LIMIT 1
  `;
  return rows[0] ?? null;
}

async function insertExtractedFacts(input: {
  periodId: string;
  corpusDocId: string;
  candidates: ReturnType<typeof validateExtractedFacts>;
}) {
  const taxonomy = await loadTaxonomy(input.periodId);
  const subByName = new Map(taxonomy.map((sub) => [sub.name.toLowerCase(), sub.id]));
  const persisted: any[] = [];
  await sqlClient.begin(async (tx) => {
    for (const candidate of input.candidates) {
      const subCategoryId = subByName.get(candidate.subCategory.toLowerCase());
      if (!subCategoryId) throw new NotesStudioV2Error('TAXONOMY_CHANGED', `Sub-category ${candidate.subCategory} no longer exists.`, 409);
      const normalized = normalizeClaim(candidate.claim);
      const existing = await tx`
        SELECT fact.id::text AS id
        FROM notes_studio_v2.facts fact
        WHERE fact.period_id = ${input.periodId}::uuid
          AND fact.sub_category_id = ${subCategoryId}::uuid
          AND lower(regexp_replace(fact.claim, '[^[:alnum:][:space:]]', ' ', 'g')) = ${normalized}
        LIMIT 1
      `;
      let factId: string;
      if (existing[0]) {
        factId = String(existing[0].id);
        await tx`
          UPDATE notes_studio_v2.facts
          SET confidence = 'confirmed', updated_at = now()
          WHERE id = ${factId}::uuid
        `;
      } else {
        factId = randomUUID();
        await tx`
          INSERT INTO notes_studio_v2.facts (
            id, period_id, sub_category_id, stable_code, claim, entities, date_or_era, confidence
          ) VALUES (
            ${factId}::uuid, ${input.periodId}::uuid, ${subCategoryId}::uuid,
            ${`NSV2-${randomUUID()}`}, ${candidate.claim}, ${JSON.stringify(candidate.entities)}::jsonb,
            ${candidate.dateOrEra ?? null}, 'single-source'
          )
        `;
      }
      await tx`
        INSERT INTO notes_studio_v2.fact_source_refs (
          id, fact_id, corpus_doc_id, locator, extracted_text
        ) VALUES (
          ${randomUUID()}::uuid, ${factId}::uuid, ${input.corpusDocId}::uuid,
          ${candidate.locator}, ${candidate.extractedText}
        )
        ON CONFLICT (fact_id, corpus_doc_id, locator)
        DO UPDATE SET extracted_text = EXCLUDED.extracted_text
      `;
      persisted.push({ id: factId, subCategoryId, ...candidate });
    }
  });
  return persisted;
}

router.use(authenticate);

router.get('/capabilities', requireAdminPermission('content.questions.read'), (_req, res) => {
  res.json({
    product: 'notes-studio-v2',
    engine: 'notes-gen-v1',
    apiNamespace: '/admin/notes-studio-v2',
    databaseSchema: 'notes_studio_v2',
    languages: ['en', 'hi', 'pa'],
    languageGenerationMode: 'independent',
    sourceProseAllowedInGeneration: false,
    unresolvedContradictionsBlockGeneration: true,
    examFrequencyFiltersCoverage: false,
  });
});

router.get('/periods', requireAdminPermission('content.questions.read'), async (_req, res) => {
  try {
    const rows = await sqlClient`
      SELECT id::text AS id, name, order_index AS "orderIndex", created_at AS "createdAt"
      FROM notes_studio_v2.periods
      ORDER BY order_index, name
    `;
    const periods = await Promise.all(rows.map(async (row: any) => ({ ...row, subCategories: await loadTaxonomy(String(row.id)) })));
    res.json(periods);
  } catch (error) {
    sendError(res, error, 'Unable to load Notes Studio v2 periods');
  }
});

router.post('/periods', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    actorId(req);
    const name = text(req.body?.name, 240);
    const orderIndex = Number(req.body?.orderIndex);
    const subCategories = Array.isArray(req.body?.subCategories) ? req.body.subCategories : [];
    if (name.length < 2 || !Number.isInteger(orderIndex)) throw new NotesStudioV2Error('INVALID_PERIOD', 'Period name and integer orderIndex are required.');
    if (subCategories.length === 0) throw new NotesStudioV2Error('TAXONOMY_REQUIRED', 'Define at least one period sub-category.');
    const periodId = randomUUID();
    await sqlClient.begin(async (tx) => {
      await tx`INSERT INTO notes_studio_v2.periods (id, name, order_index) VALUES (${periodId}::uuid, ${name}, ${orderIndex})`;
      for (const [index, item] of subCategories.entries()) {
        const subName = text(item?.name, 180);
        const subOrder = Number.isInteger(Number(item?.orderIndex)) ? Number(item.orderIndex) : index + 1;
        if (!subName) throw new NotesStudioV2Error('INVALID_SUBCATEGORY', 'Every sub-category requires a name.');
        await tx`
          INSERT INTO notes_studio_v2.period_sub_categories (id, period_id, name, order_index)
          VALUES (${randomUUID()}::uuid, ${periodId}::uuid, ${subName}, ${subOrder})
        `;
      }
    });
    res.status(201).json(await loadPeriod(periodId));
  } catch (error) {
    sendError(res, error, 'Unable to create Notes Studio v2 period');
  }
});

router.get('/periods/:periodId/workspace', requireAdminPermission('content.questions.read'), async (req, res) => {
  try {
    const periodId = uuid(req.params.periodId, 'Period ID');
    const period = await loadPeriod(periodId);
    if (!period) throw new NotesStudioV2Error('PERIOD_NOT_FOUND', 'Period not found.', 404);
    const [corpus, facts, contradictions, styleSpec, notes, noteVersions] = await Promise.all([
      sqlClient`
        SELECT id::text AS id, period_id::text AS "periodId", title, source_type::text AS "sourceType",
          file_path AS file, sub_category_hints AS "subCategoryHints", uploaded_at AS "uploadedAt"
        FROM notes_studio_v2.corpus_docs WHERE period_id = ${periodId}::uuid ORDER BY uploaded_at
      `,
      loadFacts(periodId, true),
      loadContradictions(periodId),
      loadActiveStyleSpec(),
      sqlClient`
        SELECT id::text AS id, period_id::text AS "periodId", sub_category_id::text AS "subCategoryId",
          level::text AS level, current_version_id::text AS "currentVersionId", created_at AS "createdAt", updated_at AS "updatedAt"
        FROM notes_studio_v2.notes WHERE period_id = ${periodId}::uuid ORDER BY created_at
      `,
      sqlClient`
        SELECT version.id::text AS id, version.note_id::text AS "noteId", version.version_number AS "versionNumber",
          version.blocks_by_language AS "blocksByLanguage", version.style_spec_id::text AS "styleSpecId",
          version.generated_from_fact_ids AS "generatedFromFactIds", version.status::text AS status,
          version.created_by AS "createdBy", version.created_at AS "createdAt", version.published_at AS "publishedAt"
        FROM notes_studio_v2.note_versions version
        JOIN notes_studio_v2.notes note ON note.id = version.note_id
        WHERE note.period_id = ${periodId}::uuid ORDER BY version.created_at DESC
      `,
    ]);
    res.json({ period, corpus, facts, contradictions, styleSpec, notes, noteVersions });
  } catch (error) {
    sendError(res, error, 'Unable to load Notes Studio v2 workspace');
  }
});

router.post('/periods/:periodId/corpus', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    actorId(req);
    const periodId = uuid(req.params.periodId, 'Period ID');
    if (!await loadPeriod(periodId)) throw new NotesStudioV2Error('PERIOD_NOT_FOUND', 'Period not found.', 404);
    const title = text(req.body?.title, 300);
    const sourceType = text(req.body?.sourceType, 40).toLowerCase();
    const filePath = text(req.body?.filePath, 2000);
    const hints = uniqueStrings(req.body?.subCategoryHints, 30, 180);
    if (!title || !filePath || !sourceTypes.has(sourceType)) throw new NotesStudioV2Error('INVALID_CORPUS_DOC', 'title, sourceType and filePath are required.');
    const id = randomUUID();
    await sqlClient`
      INSERT INTO notes_studio_v2.corpus_docs (id, period_id, title, source_type, file_path, sub_category_hints)
      VALUES (${id}::uuid, ${periodId}::uuid, ${title}, ${sourceType}::notes_studio_v2.source_type, ${filePath}, ${JSON.stringify(hints)}::jsonb)
    `;
    const rows = await sqlClient`
      SELECT id::text AS id, period_id::text AS "periodId", title, source_type::text AS "sourceType",
        file_path AS file, sub_category_hints AS "subCategoryHints", uploaded_at AS "uploadedAt"
      FROM notes_studio_v2.corpus_docs WHERE id = ${id}::uuid
    `;
    res.status(201).json(rows[0]);
  } catch (error) {
    sendError(res, error, 'Unable to register Notes Studio v2 corpus source');
  }
});

router.post(
  '/periods/:periodId/corpus/upload',
  requireAdminPermission('content.questions.update'),
  pdfUpload.single('file'),
  async (req, res) => {
    try {
      actorId(req);
      const periodId = uuid(req.params.periodId, 'Period ID');
      const period = await loadPeriod(periodId);
      if (!period) throw new NotesStudioV2Error('PERIOD_NOT_FOUND', 'Period not found.', 404);
      if (!req.file?.buffer?.length) throw new NotesStudioV2Error('FILE_REQUIRED', 'Upload a PDF source.');
      if (req.file.mimetype !== 'application/pdf' && !req.file.originalname.toLowerCase().endsWith('.pdf')) {
        throw new NotesStudioV2Error('PDF_REQUIRED', 'Notes Studio v2 currently accepts PDF corpus uploads.');
      }
      const extraction = await ingestPdfBuffer(req.file.buffer, {
        fileName: req.file.originalname || 'notes-studio-v2-source.pdf',
        mimeType: 'application/pdf',
      });
      const sourceText = extraction.text.trim();
      if (sourceText.length < 100) throw new NotesStudioV2Error('SOURCE_TEXT_TOO_THIN', 'The PDF did not yield enough readable text.');
      const digest = createHash('sha256').update(req.file.buffer).digest('hex');
      const corpusDocId = randomUUID();
      const title = text(req.body?.title, 300) || req.file.originalname.replace(/\.pdf$/i, '');
      const requestedType = text(req.body?.sourceType, 40).toLowerCase();
      const sourceType = sourceTypes.has(requestedType) ? requestedType : 'reference';
      const hints = uniqueStrings(req.body?.subCategoryHints, 30, 180);
      await sqlClient`
        INSERT INTO notes_studio_v2.corpus_docs (id, period_id, title, source_type, file_path, sub_category_hints)
        VALUES (
          ${corpusDocId}::uuid, ${periodId}::uuid, ${title}, ${sourceType}::notes_studio_v2.source_type,
          ${`urn:sha256:${digest}`}, ${JSON.stringify(hints)}::jsonb
        )
      `;
      const taxonomy = period.subCategories.map((sub: any) => String(sub.name));
      const ai = await extractWithAI(buildExtractionRequest({ sourceTitle: title, taxonomy, sourceText }));
      const candidates = validateExtractedFacts(ai.json, taxonomy);
      const facts = await insertExtractedFacts({ periodId, corpusDocId, candidates });
      res.status(201).json({
        corpusDoc: {
          id: corpusDocId,
          periodId,
          title,
          sourceType,
          file: `urn:sha256:${digest}`,
          subCategoryHints: hints,
        },
        facts,
        extraction: { provider: ai.provider, model: ai.model, usage: ai.usage, metadata: extraction.metadata },
        rawFilePersisted: false,
      });
    } catch (error) {
      sendError(res, error, 'Unable to ingest Notes Studio v2 PDF source');
    }
  },
);

router.post('/corpus/:corpusDocId/extract', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    actorId(req);
    const corpusDocId = uuid(req.params.corpusDocId, 'Corpus document ID');
    const rows = await sqlClient`
      SELECT doc.id::text AS id, doc.period_id::text AS "periodId", doc.title
      FROM notes_studio_v2.corpus_docs doc WHERE doc.id = ${corpusDocId}::uuid LIMIT 1
    `;
    if (!rows[0]) throw new NotesStudioV2Error('CORPUS_NOT_FOUND', 'Corpus source not found.', 404);
    const existing = await sqlClient`
      SELECT fact.id::text AS id, fact.claim
      FROM notes_studio_v2.fact_source_refs ref
      JOIN notes_studio_v2.facts fact ON fact.id = ref.fact_id
      WHERE ref.corpus_doc_id = ${corpusDocId}::uuid ORDER BY fact.created_at
    `;
    if (existing.length === 0) {
      throw new NotesStudioV2Error(
        'SOURCE_CONTENT_NOT_RETAINED',
        'This corpus entry has no retained raw source by design. Re-upload the PDF to re-extract facts.',
        409,
      );
    }
    res.json({ corpusDocId, facts: existing, reusedExistingExtraction: true });
  } catch (error) {
    sendError(res, error, 'Unable to load Notes Studio v2 extraction');
  }
});

router.post('/periods/:periodId/reconcile', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    actorId(req);
    const periodId = uuid(req.params.periodId, 'Period ID');
    const facts = await loadFacts(periodId, false) as any[];
    if (facts.length === 0) throw new NotesStudioV2Error('NO_FACTS', 'Extract facts before reconciliation.', 409);

    const schema = {
      type: 'object', additionalProperties: false, required: ['groups'], properties: {
        groups: { type: 'array', items: {
          type: 'object', additionalProperties: false, required: ['factIds'], properties: {
            factIds: { type: 'array', minItems: 2, items: { type: 'string' } },
          },
        } },
      },
    };
    const ai = await extractWithAI({
      prompt: {
        system: 'Identify only genuine logical or factual contradictions among distilled claims. Do not prefer a source or resolve the conflict. Return groups of conflicting fact IDs only.',
        user: 'Review this source-agnostic fact list. Group only claims that cannot simultaneously be true in the same interpretation.',
      },
      input: JSON.stringify(facts.map((fact) => ({ id: fact.id, subCategory: fact.subCategory, claim: fact.claim, entities: fact.entities, dateOrEra: fact.dateOrEra }))),
      responseSchema: schema,
      responseSchemaName: 'notes_studio_v2_contradictions',
      temperature: 0,
    });
    const validIds = new Set(facts.map((fact) => String(fact.id)));
    const rawGroups = ai.json && typeof ai.json === 'object' && Array.isArray((ai.json as any).groups) ? (ai.json as any).groups : [];
    const groups: string[][] = [];
    for (const raw of rawGroups) {
      const ids = uniqueStrings(raw?.factIds, 20, 80).filter((id) => validIds.has(id));
      if (ids.length >= 2) groups.push(ids);
    }
    await sqlClient.begin(async (tx) => {
      await tx`
        DELETE FROM notes_studio_v2.contradiction_group_facts link
        USING notes_studio_v2.contradiction_groups grp
        WHERE link.contradiction_group_id = grp.id AND grp.period_id = ${periodId}::uuid AND grp.status = 'open'
      `;
      await tx`DELETE FROM notes_studio_v2.contradiction_groups WHERE period_id = ${periodId}::uuid AND status = 'open'`;
      await tx`
        UPDATE notes_studio_v2.facts SET confidence = CASE
          WHEN confidence = 'disputed' THEN 'single-source'::notes_studio_v2.confidence ELSE confidence END,
          updated_at = now()
        WHERE period_id = ${periodId}::uuid
      `;
      for (const ids of groups) {
        const first = facts.find((fact) => String(fact.id) === ids[0]);
        if (!first) continue;
        const groupId = randomUUID();
        await tx`
          INSERT INTO notes_studio_v2.contradiction_groups (id, period_id, sub_category_id)
          VALUES (${groupId}::uuid, ${periodId}::uuid, ${String(first.subCategoryId)}::uuid)
        `;
        for (const factId of ids) {
          await tx`
            INSERT INTO notes_studio_v2.contradiction_group_facts (contradiction_group_id, fact_id)
            VALUES (${groupId}::uuid, ${factId}::uuid)
          `;
          await tx`UPDATE notes_studio_v2.facts SET confidence = 'disputed', updated_at = now() WHERE id = ${factId}::uuid`;
        }
      }
    });
    res.json({ periodId, facts: await loadFacts(periodId, true), contradictions: await loadContradictions(periodId), provider: ai.provider, model: ai.model });
  } catch (error) {
    sendError(res, error, 'Unable to reconcile Notes Studio v2 facts');
  }
});

router.post('/contradictions/:groupId/resolve', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    actorId(req);
    const groupId = uuid(req.params.groupId, 'Contradiction group ID');
    const resolution = text(req.body?.resolution, 40);
    if (!['select', 'qualified-merge', 'alternate-positions'].includes(resolution)) {
      throw new NotesStudioV2Error('INVALID_RESOLUTION', 'Choose select, qualified-merge or alternate-positions.');
    }
    const groups = await sqlClient`
      SELECT id::text AS id, period_id::text AS "periodId", sub_category_id::text AS "subCategoryId", status::text AS status
      FROM notes_studio_v2.contradiction_groups WHERE id = ${groupId}::uuid LIMIT 1
    `;
    const group = groups[0] as any;
    if (!group) throw new NotesStudioV2Error('CONTRADICTION_NOT_FOUND', 'Contradiction group not found.', 404);
    if (group.status !== 'open') throw new NotesStudioV2Error('ALREADY_RESOLVED', 'Contradiction is already resolved.', 409);
    const links = await sqlClient`
      SELECT fact_id::text AS "factId" FROM notes_studio_v2.contradiction_group_facts WHERE contradiction_group_id = ${groupId}::uuid
    `;
    const factIds = links.map((link: any) => String(link.factId));
    let resolvedFactId: string | null = null;
    const resolutionNote = text(req.body?.resolutionNote, 3000);
    await sqlClient.begin(async (tx) => {
      if (resolution === 'select') {
        resolvedFactId = uuid(req.body?.selectedFactId, 'Selected fact ID');
        if (!factIds.includes(resolvedFactId)) throw new NotesStudioV2Error('FACT_NOT_IN_GROUP', 'Selected fact is not part of this contradiction.');
        for (const factId of factIds) {
          await tx`
            UPDATE notes_studio_v2.facts
            SET confidence = ${factId === resolvedFactId ? 'confirmed' : 'disputed'}::notes_studio_v2.confidence, updated_at = now()
            WHERE id = ${factId}::uuid
          `;
        }
      } else if (resolution === 'qualified-merge') {
        const qualifiedClaim = text(req.body?.qualifiedClaim, 4000);
        if (!qualifiedClaim) throw new NotesStudioV2Error('QUALIFIED_CLAIM_REQUIRED', 'Enter the merged qualified claim.');
        resolvedFactId = randomUUID();
        await tx`
          INSERT INTO notes_studio_v2.facts (
            id, period_id, sub_category_id, stable_code, claim, entities, confidence
          )
          SELECT ${resolvedFactId}::uuid, ${String(group.periodId)}::uuid, ${String(group.subCategoryId)}::uuid,
            ${`NSV2-${randomUUID()}`}, ${qualifiedClaim}, COALESCE(jsonb_agg(DISTINCT entity.value), '[]'::jsonb), 'confirmed'
          FROM notes_studio_v2.facts fact
          LEFT JOIN LATERAL jsonb_array_elements_text(fact.entities) entity(value) ON true
          WHERE fact.id = ANY(${factIds}::uuid[])
        `;
        await tx`
          INSERT INTO notes_studio_v2.fact_source_refs (id, fact_id, corpus_doc_id, locator, extracted_text)
          SELECT gen_random_uuid(), ${resolvedFactId}::uuid, corpus_doc_id, locator, extracted_text
          FROM notes_studio_v2.fact_source_refs WHERE fact_id = ANY(${factIds}::uuid[])
          ON CONFLICT (fact_id, corpus_doc_id, locator) DO NOTHING
        `;
        await tx`UPDATE notes_studio_v2.facts SET confidence = 'disputed', updated_at = now() WHERE id = ANY(${factIds}::uuid[])`;
      } else {
        await tx`UPDATE notes_studio_v2.facts SET confidence = 'confirmed', updated_at = now() WHERE id = ANY(${factIds}::uuid[])`;
      }
      await tx`
        UPDATE notes_studio_v2.contradiction_groups
        SET status = 'resolved', resolved_fact_id = ${resolvedFactId}::uuid, resolution_note = ${resolutionNote || resolution}, resolved_at = now()
        WHERE id = ${groupId}::uuid
      `;
    });
    const all = await loadContradictions(String(group.periodId));
    res.json(all.find((item: any) => item.id === groupId));
  } catch (error) {
    sendError(res, error, 'Unable to resolve Notes Studio v2 contradiction');
  }
});

router.post('/style-specs', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    actorId(req);
    const name = text(req.body?.name, 200) || `Style ${new Date().toISOString().slice(0, 10)}`;
    const id = randomUUID();
    await sqlClient`
      INSERT INTO notes_studio_v2.style_specs (
        id, name, tone, sentence_length, terminology_conventions, example_structure, avoid, exemplar_note_version_ids, is_active
      ) VALUES (
        ${id}::uuid, ${name}, ${text(req.body?.tone, 100)}, ${text(req.body?.sentenceLength, 20) || 'mixed'},
        ${JSON.stringify(req.body?.terminologyConventions ?? {})}::jsonb, ${text(req.body?.exampleStructure, 2000)},
        ${JSON.stringify(uniqueStrings(req.body?.avoid, 50, 300))}::jsonb, '[]'::jsonb, false
      )
    `;
    const rows = await sqlClient`SELECT id::text AS id, name, tone, sentence_length AS "sentenceLength", terminology_conventions AS "terminologyConventions", example_structure AS "exampleStructure", avoid, exemplar_note_version_ids AS "exemplarNoteVersionIds", is_active AS "isActive" FROM notes_studio_v2.style_specs WHERE id = ${id}::uuid`;
    res.status(201).json(rows[0]);
  } catch (error) {
    sendError(res, error, 'Unable to create Notes Studio v2 style spec');
  }
});

router.get('/style-specs/active', requireAdminPermission('content.questions.read'), async (_req, res) => {
  try {
    res.json(await loadActiveStyleSpec());
  } catch (error) {
    sendError(res, error, 'Unable to load active Notes Studio v2 style spec');
  }
});

router.post('/style-specs/:styleSpecId/bootstrap-rounds', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    actorId(req);
    const styleSpecId = uuid(req.params.styleSpecId, 'Style spec ID');
    const periodId = uuid(req.body?.periodId, 'Period ID');
    const subCategoryId = uuid(req.body?.subCategoryId, 'Sub-category ID');
    const roughTone = text(req.body?.roughTone, 1000);
    const rounds = await sqlClient`SELECT COALESCE(MAX(round_number), 0)::int AS max FROM notes_studio_v2.style_bootstrap_rounds WHERE style_spec_id = ${styleSpecId}::uuid`;
    const roundNumber = Number((rounds[0] as any)?.max ?? 0) + 1;
    if (roundNumber > 3) throw new NotesStudioV2Error('BOOTSTRAP_COMPLETE', 'Style bootstrap supports at most three rounds.', 409);
    const facts = await sqlClient`
      SELECT fact.id::text AS id, sub.name AS "subCategory", fact.claim, fact.entities, fact.date_or_era AS "dateOrEra"
      FROM notes_studio_v2.facts fact JOIN notes_studio_v2.period_sub_categories sub ON sub.id = fact.sub_category_id
      WHERE fact.period_id = ${periodId}::uuid AND fact.sub_category_id = ${subCategoryId}::uuid AND fact.confidence <> 'disputed'
      ORDER BY fact.created_at LIMIT 12
    `;
    if (facts.length === 0) throw new NotesStudioV2Error('NO_STYLE_FACTS', 'Choose a sub-category with eligible facts.', 409);
    const previous = await sqlClient`
      SELECT round_number AS "roundNumber", variants, selected_variant_label AS "selectedVariantLabel", admin_edits AS "adminEdits"
      FROM notes_studio_v2.style_bootstrap_rounds WHERE style_spec_id = ${styleSpecId}::uuid ORDER BY round_number
    `;
    const schema = {
      type: 'object', additionalProperties: false, required: ['variants'], properties: {
        variants: { type: 'array', minItems: 4, maxItems: 4, items: {
          type: 'object', additionalProperties: false, required: ['label', 'content'], properties: {
            label: { type: 'string' }, content: { type: 'string' },
          },
        } },
      },
    };
    const ai = await extractWithAI({
      prompt: {
        system: 'Generate exactly four distinct study-note style variants from the supplied distilled facts. Do not use or imitate source prose. The purpose is house-style calibration, not factual expansion.',
        user: `Rough tone: ${roughTone || 'clear, concise, exam-friendly'}\nRound: ${roundNumber}\nPrevious reviewed rounds: ${JSON.stringify(previous)}`,
      },
      input: JSON.stringify(facts),
      responseSchema: schema,
      responseSchemaName: 'notes_studio_v2_style_variants',
      temperature: 0.7,
    });
    const variants = ai.json && typeof ai.json === 'object' && Array.isArray((ai.json as any).variants)
      ? (ai.json as any).variants.slice(0, 4).map((variant: any, index: number) => ({ label: text(variant?.label, 80) || `Variant ${index + 1}`, content: text(variant?.content, 8000) }))
      : [];
    if (variants.length !== 4 || variants.some((variant: any) => !variant.content)) throw new NotesStudioV2Error('INVALID_STYLE_VARIANTS', 'Style provider did not return four valid variants.', 502);
    const id = randomUUID();
    await sqlClient`
      INSERT INTO notes_studio_v2.style_bootstrap_rounds (id, style_spec_id, round_number, variants)
      VALUES (${id}::uuid, ${styleSpecId}::uuid, ${roundNumber}, ${JSON.stringify(variants)}::jsonb)
    `;
    res.status(201).json({ id, styleSpecId, roundNumber, variants, converged: false, provider: ai.provider, model: ai.model });
  } catch (error) {
    sendError(res, error, 'Unable to generate Notes Studio v2 style bootstrap round');
  }
});

router.patch('/style-specs/:styleSpecId/bootstrap-rounds/:roundId', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    actorId(req);
    const styleSpecId = uuid(req.params.styleSpecId, 'Style spec ID');
    const roundId = uuid(req.params.roundId, 'Round ID');
    const selectedVariantLabel = text(req.body?.selectedVariantLabel, 100);
    const adminEdits = text(req.body?.adminEdits, 12000);
    if (!selectedVariantLabel) throw new NotesStudioV2Error('VARIANT_REQUIRED', 'Select a style variant.');
    const rows = await sqlClient`SELECT variants FROM notes_studio_v2.style_bootstrap_rounds WHERE id = ${roundId}::uuid AND style_spec_id = ${styleSpecId}::uuid LIMIT 1`;
    if (!rows[0]) throw new NotesStudioV2Error('ROUND_NOT_FOUND', 'Style bootstrap round not found.', 404);
    const variants = Array.isArray((rows[0] as any).variants) ? (rows[0] as any).variants : [];
    if (!variants.some((variant: any) => String(variant.label) === selectedVariantLabel)) throw new NotesStudioV2Error('VARIANT_NOT_FOUND', 'Selected variant is not in this round.');
    await sqlClient`
      UPDATE notes_studio_v2.style_bootstrap_rounds
      SET selected_variant_label = ${selectedVariantLabel}, admin_edits = ${adminEdits || null}
      WHERE id = ${roundId}::uuid
    `;
    const reviewed = await sqlClient`SELECT COUNT(*)::int AS count FROM notes_studio_v2.style_bootstrap_rounds WHERE style_spec_id = ${styleSpecId}::uuid AND selected_variant_label IS NOT NULL`;
    res.json({ id: roundId, styleSpecId, selectedVariantLabel, adminEdits: adminEdits || undefined, converged: Number((reviewed[0] as any)?.count ?? 0) >= 2 });
  } catch (error) {
    sendError(res, error, 'Unable to review Notes Studio v2 style bootstrap round');
  }
});

router.post('/style-specs/:styleSpecId/activate', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    actorId(req);
    const styleSpecId = uuid(req.params.styleSpecId, 'Style spec ID');
    const rounds = await sqlClient`
      SELECT round_number AS "roundNumber", variants, selected_variant_label AS "selectedVariantLabel", admin_edits AS "adminEdits"
      FROM notes_studio_v2.style_bootstrap_rounds
      WHERE style_spec_id = ${styleSpecId}::uuid AND selected_variant_label IS NOT NULL
      ORDER BY round_number
    `;
    if (rounds.length < 2) throw new NotesStudioV2Error('STYLE_NOT_CONVERGED', 'Review at least two bootstrap rounds before activation.', 409);
    const selectedOutputs = rounds.map((round: any) => {
      const selected = (Array.isArray(round.variants) ? round.variants : []).find((variant: any) => String(variant.label) === String(round.selectedVariantLabel));
      return text(round.adminEdits, 12000) || text(selected?.content, 12000);
    }).filter(Boolean);
    const schema = {
      type: 'object', additionalProperties: false,
      required: ['tone', 'sentenceLength', 'terminologyConventions', 'exampleStructure', 'avoid'],
      properties: {
        tone: { type: 'string' }, sentenceLength: { enum: ['short', 'medium', 'mixed'] },
        terminologyConventions: { type: 'object' }, exampleStructure: { type: 'string' },
        avoid: { type: 'array', items: { type: 'string' } },
      },
    };
    const ai = await extractWithAI({
      prompt: {
        system: 'Derive a concise reusable house StyleSpec from admin-approved study-note exemplars. Describe style only; do not add factual content.',
        user: 'Infer the common approved style from these reviewed outputs.',
      },
      input: JSON.stringify(selectedOutputs),
      responseSchema: schema,
      responseSchemaName: 'notes_studio_v2_style_spec',
      temperature: 0,
    });
    const derived = ai.json as any;
    if (!derived || !['short', 'medium', 'mixed'].includes(String(derived.sentenceLength))) throw new NotesStudioV2Error('INVALID_STYLE_SPEC', 'Unable to derive a valid StyleSpec.', 502);
    await sqlClient.begin(async (tx) => {
      await tx`UPDATE notes_studio_v2.style_specs SET is_active = false WHERE is_active = true`;
      await tx`
        UPDATE notes_studio_v2.style_specs SET
          tone = ${text(derived.tone, 500)},
          sentence_length = ${String(derived.sentenceLength)},
          terminology_conventions = ${JSON.stringify(derived.terminologyConventions ?? {})}::jsonb,
          example_structure = ${text(derived.exampleStructure, 4000)},
          avoid = ${JSON.stringify(uniqueStrings(derived.avoid, 60, 500))}::jsonb,
          is_active = true
        WHERE id = ${styleSpecId}::uuid
      `;
    });
    res.json(await loadActiveStyleSpec());
  } catch (error) {
    sendError(res, error, 'Unable to activate Notes Studio v2 style spec');
  }
});

router.post('/notes/generate', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const createdBy = actorId(req);
    const periodId = uuid(req.body?.periodId, 'Period ID');
    const noteLevel = text(req.body?.noteLevel, 20);
    if (!['topic', 'subcategory'].includes(noteLevel)) throw new NotesStudioV2Error('INVALID_NOTE_LEVEL', 'Choose topic or subcategory.');
    const subCategoryId = noteLevel === 'subcategory' ? uuid(req.body?.subCategoryId, 'Sub-category ID') : null;
    const languages = requiredLanguages(req.body?.languages);
    const period = await loadPeriod(periodId);
    if (!period) throw new NotesStudioV2Error('PERIOD_NOT_FOUND', 'Period not found.', 404);
    const openConflicts = await sqlClient`
      SELECT COUNT(*)::int AS count FROM notes_studio_v2.contradiction_groups
      WHERE period_id = ${periodId}::uuid AND status = 'open'
        AND (${subCategoryId}::uuid IS NULL OR sub_category_id = ${subCategoryId}::uuid)
    `;
    if (Number((openConflicts[0] as any)?.count ?? 0) > 0) throw new NotesStudioV2Error('UNRESOLVED_CONTRADICTIONS', 'Resolve contradictions before generation.', 409);
    const style = await loadActiveStyleSpec() as any;
    if (!style) throw new NotesStudioV2Error('ACTIVE_STYLE_REQUIRED', 'Activate a converged StyleSpec before generation.', 409);

    // Critical safety boundary: this query intentionally touches facts + taxonomy only.
    // It cannot retrieve fact_source_refs.extracted_text or any corpus source prose.
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
    if (graph.length === 0) throw new NotesStudioV2Error('NO_ELIGIBLE_FACTS', 'No eligible facts exist for this target.', 409);
    const sub = subCategoryId ? period.subCategories.find((item: any) => String(item.id) === subCategoryId) : null;
    const targetLabel = sub ? `${period.name} — ${sub.name}` : String(period.name);

    const outputs: Record<string, NotesStudioV2NoteBlock[]> = {};
    for (const language of languages) {
      const request = buildGenerationRequest({
        language,
        facts: graph,
        style: {
          tone: String(style.tone ?? ''),
          sentenceLength: style.sentenceLength ?? 'mixed',
          terminologyConventions: style.terminologyConventions ?? {},
          exampleStructure: String(style.exampleStructure ?? ''),
          avoid: Array.isArray(style.avoid) ? style.avoid.map(String) : [],
          exemplars: [],
        },
        noteLevel: noteLevel as 'topic' | 'subcategory',
        targetLabel,
      });
      const ai = await extractWithAI(request);
      outputs[language] = validateNoteBlocks(ai.json);
    }

    let noteId: string;
    const noteRows = await sqlClient`
      SELECT id::text AS id FROM notes_studio_v2.notes
      WHERE period_id = ${periodId}::uuid
        AND level = ${noteLevel}::notes_studio_v2.note_level
        AND (${subCategoryId}::uuid IS NULL AND sub_category_id IS NULL OR sub_category_id = ${subCategoryId}::uuid)
      LIMIT 1
    `;
    noteId = noteRows[0] ? String((noteRows[0] as any).id) : randomUUID();
    const versionId = randomUUID();
    let versionNumber = 1;
    await sqlClient.begin(async (tx) => {
      if (!noteRows[0]) {
        await tx`
          INSERT INTO notes_studio_v2.notes (id, period_id, sub_category_id, level)
          VALUES (${noteId}::uuid, ${periodId}::uuid, ${subCategoryId}::uuid, ${noteLevel}::notes_studio_v2.note_level)
        `;
      }
      const maxRows = await tx`SELECT COALESCE(MAX(version_number), 0)::int AS max FROM notes_studio_v2.note_versions WHERE note_id = ${noteId}::uuid`;
      versionNumber = Number((maxRows[0] as any)?.max ?? 0) + 1;
      await tx`
        INSERT INTO notes_studio_v2.note_versions (
          id, note_id, version_number, blocks_by_language, style_spec_id, generated_from_fact_ids, status, created_by
        ) VALUES (
          ${versionId}::uuid, ${noteId}::uuid, ${versionNumber}, ${JSON.stringify(outputs)}::jsonb,
          ${String(style.id)}::uuid, ${JSON.stringify(graph.map((fact) => fact.id))}::jsonb, 'draft', ${createdBy}
        )
      `;
      for (const language of languages) {
        outputs[language].forEach((block, index) => {
          if (block.type !== 'figure' || block.svgRef) return;
          void tx`
            INSERT INTO notes_studio_v2.note_figures (id, note_version_id, block_ref, placeholder_description, status)
            VALUES (${randomUUID()}::uuid, ${versionId}::uuid, ${`${language}:${index}`}, ${block.placeholder ?? 'Figure needed'}, 'needed')
          `;
        });
      }
    });
    const versionRows = await sqlClient`
      SELECT id::text AS id, note_id::text AS "noteId", version_number AS "versionNumber", blocks_by_language AS "blocksByLanguage",
        style_spec_id::text AS "styleSpecId", generated_from_fact_ids AS "generatedFromFactIds", status::text AS status,
        created_by AS "createdBy", created_at AS "createdAt", published_at AS "publishedAt"
      FROM notes_studio_v2.note_versions WHERE id = ${versionId}::uuid
    `;
    res.status(201).json({ noteId, version: versionRows[0], languagesGenerated: languages });
  } catch (error) {
    sendError(res, error, 'Unable to generate Notes Studio v2 note');
  }
});

router.post('/note-versions/:versionId/quality', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    actorId(req);
    const versionId = uuid(req.params.versionId, 'Note version ID');
    const rows = await sqlClient`
      SELECT version.id::text AS id, version.blocks_by_language AS "blocksByLanguage", version.generated_from_fact_ids AS "generatedFromFactIds",
        note.period_id::text AS "periodId", note.sub_category_id::text AS "subCategoryId"
      FROM notes_studio_v2.note_versions version JOIN notes_studio_v2.notes note ON note.id = version.note_id
      WHERE version.id = ${versionId}::uuid LIMIT 1
    `;
    const version = rows[0] as any;
    if (!version) throw new NotesStudioV2Error('VERSION_NOT_FOUND', 'Note version not found.', 404);
    const factIds = Array.isArray(version.generatedFromFactIds) ? version.generatedFromFactIds.map(String) : [];
    const evidence = await sqlClient`
      SELECT fact.id::text AS "factId", fact.claim, ref.corpus_doc_id::text AS "corpusDocId", ref.locator, ref.extracted_text AS "extractedText"
      FROM notes_studio_v2.facts fact
      LEFT JOIN notes_studio_v2.fact_source_refs ref ON ref.fact_id = fact.id
      WHERE fact.id = ANY(${factIds}::uuid[])
      ORDER BY fact.id, ref.id
    `;
    const blocksByLanguage = version.blocksByLanguage ?? {};
    const overlapFindings: any[] = [];
    for (const language of ['en', 'hi', 'pa']) {
      const generated = renderedNoteText((blocksByLanguage[language] ?? []) as NotesStudioV2NoteBlock[]);
      const byCorpus = new Map<string, string[]>();
      for (const row of evidence as any[]) {
        if (!row.corpusDocId || !row.extractedText) continue;
        byCorpus.set(String(row.corpusDocId), [...(byCorpus.get(String(row.corpusDocId)) ?? []), String(row.extractedText)]);
      }
      for (const [corpusDocId, spans] of byCorpus) {
        const score = sourceOverlapScore(generated, spans.join('\n'));
        if (score >= 0.18) overlapFindings.push({
          code: 'SOURCE_SPAN_OVERLAP', severity: score >= 0.3 ? 'blocker' : 'warning',
          message: `${language} has ${(score * 100).toFixed(1)}% matching 6-word spans against verification text from one corpus source.`,
          corpusDocId,
        });
      }
    }
    const open = await sqlClient`
      SELECT COUNT(*)::int AS count FROM notes_studio_v2.contradiction_groups
      WHERE period_id = ${String(version.periodId)}::uuid AND status = 'open'
        AND (${version.subCategoryId ? String(version.subCategoryId) : null}::uuid IS NULL OR sub_category_id = ${version.subCategoryId ? String(version.subCategoryId) : null}::uuid)
    `;
    const contradictionBlocked = Number((open[0] as any)?.count ?? 0) > 0;
    const gates = [
      { key: 'factual-accuracy', passed: !contradictionBlocked && factIds.length > 0, findings: contradictionBlocked ? [{ code: 'OPEN_CONTRADICTION', severity: 'blocker', message: 'Unresolved contradictions remain.' }] : [] },
      { key: 'originality', passed: !overlapFindings.some((finding) => finding.severity === 'blocker'), findings: overlapFindings },
      { key: 'style-consistency', passed: true, findings: [] },
      { key: 'exam-relevance', passed: true, findings: [{ code: 'ADVISORY_ONLY', severity: 'warning', message: 'Exam-frequency metadata is advisory and does not remove facts from coverage.' }] },
    ];
    res.json({ noteVersionId: versionId, reviewReady: gates.every((gate) => gate.passed), gates });
  } catch (error) {
    sendError(res, error, 'Unable to run Notes Studio v2 quality gates');
  }
});

router.patch('/note-versions/:versionId', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    actorId(req);
    const versionId = uuid(req.params.versionId, 'Note version ID');
    const rows = await sqlClient`SELECT status::text AS status FROM notes_studio_v2.note_versions WHERE id = ${versionId}::uuid LIMIT 1`;
    if (!rows[0]) throw new NotesStudioV2Error('VERSION_NOT_FOUND', 'Note version not found.', 404);
    if (String((rows[0] as any).status) === 'published') throw new NotesStudioV2Error('PUBLISHED_IMMUTABLE', 'Published versions cannot be edited. Create a revision.', 409);
    const blocks = req.body?.blocksByLanguage;
    const status = text(req.body?.status, 30);
    if (blocks !== undefined) {
      if (!blocks || typeof blocks !== 'object' || !['en', 'hi', 'pa'].every((language) => Array.isArray(blocks[language]))) {
        throw new NotesStudioV2Error('INVALID_BLOCKS', 'blocksByLanguage must contain en, hi and pa arrays.');
      }
      await sqlClient`UPDATE notes_studio_v2.note_versions SET blocks_by_language = ${JSON.stringify(blocks)}::jsonb WHERE id = ${versionId}::uuid`;
    }
    if (status) {
      if (!['draft', 'in-review'].includes(status)) throw new NotesStudioV2Error('INVALID_STATUS', 'Use submit-review or publish for lifecycle transitions.');
      await sqlClient`UPDATE notes_studio_v2.note_versions SET status = ${status}::notes_studio_v2.note_status WHERE id = ${versionId}::uuid`;
    }
    const updated = await sqlClient`SELECT id::text AS id, note_id::text AS "noteId", version_number AS "versionNumber", blocks_by_language AS "blocksByLanguage", style_spec_id::text AS "styleSpecId", generated_from_fact_ids AS "generatedFromFactIds", status::text AS status, created_by AS "createdBy", created_at AS "createdAt", published_at AS "publishedAt" FROM notes_studio_v2.note_versions WHERE id = ${versionId}::uuid`;
    res.json(updated[0]);
  } catch (error) {
    sendError(res, error, 'Unable to update Notes Studio v2 draft');
  }
});

router.post('/note-versions/:versionId/submit-review', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    actorId(req);
    const versionId = uuid(req.params.versionId, 'Note version ID');
    const rows = await sqlClient`UPDATE notes_studio_v2.note_versions SET status = 'in-review' WHERE id = ${versionId}::uuid AND status = 'draft' RETURNING id::text AS id, note_id::text AS "noteId", version_number AS "versionNumber", blocks_by_language AS "blocksByLanguage", style_spec_id::text AS "styleSpecId", generated_from_fact_ids AS "generatedFromFactIds", status::text AS status, created_by AS "createdBy", created_at AS "createdAt", published_at AS "publishedAt"`;
    if (!rows[0]) throw new NotesStudioV2Error('INVALID_REVIEW_TRANSITION', 'Only draft versions can enter review.', 409);
    res.json(rows[0]);
  } catch (error) {
    sendError(res, error, 'Unable to submit Notes Studio v2 note for review');
  }
});

router.post('/note-versions/:versionId/publish', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    actorId(req);
    const versionId = uuid(req.params.versionId, 'Note version ID');
    const qualityRows = await sqlClient`
      SELECT version.note_id::text AS "noteId", version.status::text AS status
      FROM notes_studio_v2.note_versions version WHERE version.id = ${versionId}::uuid LIMIT 1
    `;
    const version = qualityRows[0] as any;
    if (!version) throw new NotesStudioV2Error('VERSION_NOT_FOUND', 'Note version not found.', 404);
    if (version.status !== 'in-review') throw new NotesStudioV2Error('INVALID_PUBLISH_TRANSITION', 'Only in-review versions can be published.', 409);
    await sqlClient.begin(async (tx) => {
      await tx`UPDATE notes_studio_v2.note_versions SET status = 'published', published_at = now() WHERE id = ${versionId}::uuid`;
      await tx`UPDATE notes_studio_v2.notes SET current_version_id = ${versionId}::uuid, updated_at = now() WHERE id = ${String(version.noteId)}::uuid`;
    });
    const rows = await sqlClient`SELECT id::text AS id, note_id::text AS "noteId", version_number AS "versionNumber", blocks_by_language AS "blocksByLanguage", style_spec_id::text AS "styleSpecId", generated_from_fact_ids AS "generatedFromFactIds", status::text AS status, created_by AS "createdBy", created_at AS "createdAt", published_at AS "publishedAt" FROM notes_studio_v2.note_versions WHERE id = ${versionId}::uuid`;
    res.json(rows[0]);
  } catch (error) {
    sendError(res, error, 'Unable to publish Notes Studio v2 note');
  }
});

router.post('/notes/:noteId/revisions', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const createdBy = actorId(req);
    const noteId = uuid(req.params.noteId, 'Note ID');
    const source = await sqlClient`
      SELECT id::text AS id, blocks_by_language AS "blocksByLanguage", style_spec_id::text AS "styleSpecId", generated_from_fact_ids AS "generatedFromFactIds"
      FROM notes_studio_v2.note_versions WHERE note_id = ${noteId}::uuid AND status = 'published' ORDER BY version_number DESC LIMIT 1
    `;
    if (!source[0]) throw new NotesStudioV2Error('PUBLISHED_VERSION_REQUIRED', 'Publish a version before creating a revision.', 409);
    const maxRows = await sqlClient`SELECT COALESCE(MAX(version_number), 0)::int AS max FROM notes_studio_v2.note_versions WHERE note_id = ${noteId}::uuid`;
    const versionNumber = Number((maxRows[0] as any)?.max ?? 0) + 1;
    const id = randomUUID();
    await sqlClient`
      INSERT INTO notes_studio_v2.note_versions (id, note_id, version_number, blocks_by_language, style_spec_id, generated_from_fact_ids, status, created_by)
      VALUES (${id}::uuid, ${noteId}::uuid, ${versionNumber}, ${JSON.stringify((source[0] as any).blocksByLanguage)}::jsonb, ${(source[0] as any).styleSpecId}::uuid, ${JSON.stringify((source[0] as any).generatedFromFactIds)}::jsonb, 'draft', ${createdBy})
    `;
    const rows = await sqlClient`SELECT id::text AS id, note_id::text AS "noteId", version_number AS "versionNumber", blocks_by_language AS "blocksByLanguage", style_spec_id::text AS "styleSpecId", generated_from_fact_ids AS "generatedFromFactIds", status::text AS status, created_by AS "createdBy", created_at AS "createdAt", published_at AS "publishedAt" FROM notes_studio_v2.note_versions WHERE id = ${id}::uuid`;
    res.status(201).json(rows[0]);
  } catch (error) {
    sendError(res, error, 'Unable to create Notes Studio v2 revision');
  }
});

router.patch('/figures/:figureId', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    actorId(req);
    const figureId = uuid(req.params.figureId, 'Figure ID');
    const svgRef = text(req.body?.svgRef, 2000);
    if (!svgRef) throw new NotesStudioV2Error('SVG_REF_REQUIRED', 'Attach an SVG reference.');
    const rows = await sqlClient`
      UPDATE notes_studio_v2.note_figures SET svg_ref = ${svgRef}, status = 'created'
      WHERE id = ${figureId}::uuid
      RETURNING id::text AS id, note_version_id::text AS "noteVersionId", block_ref AS "blockRef",
        placeholder_description AS "placeholderDescription", svg_ref AS "svgRef", status::text AS status
    `;
    if (!rows[0]) throw new NotesStudioV2Error('FIGURE_NOT_FOUND', 'Figure placeholder not found.', 404);
    res.json(rows[0]);
  } catch (error) {
    sendError(res, error, 'Unable to attach Notes Studio v2 figure');
  }
});

export default router;
