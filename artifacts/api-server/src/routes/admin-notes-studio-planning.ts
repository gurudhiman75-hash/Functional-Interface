import { randomUUID } from 'node:crypto';
import { Router, type IRouter, type Response } from 'express';

import { requireAdminPermission } from '../lib/admin-rbac';
import { sqlClient } from '../lib/db';
import { authenticate } from '../middlewares/auth';
import {
  MAX_NOTE_PLAN_ITEMS,
  NOTE_PLANNING_DEPTHS,
  NOTE_PLANNING_LEARNER_LEVELS,
  boundedPlanningJobLimit,
  buildPlannedJobBrief,
  normalizePlanningUnitTypes,
  selectPlanningCandidates,
  type NotePlanningDepth,
  type NotePlanningLearnerLevel,
  type TaxonomyPlanningCandidate,
} from '../notes-studio/planning';

const router: IRouter = Router();
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const languagePattern = /^[a-z]{2,8}(?:-[a-z0-9]{2,8})?$/;
const depthSet = new Set<string>(NOTE_PLANNING_DEPTHS);
const learnerLevelSet = new Set<string>(NOTE_PLANNING_LEARNER_LEVELS);

class PlanningError extends Error {
  constructor(readonly code: string, message: string, readonly statusCode = 400) {
    super(message);
  }
}

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function uuid(value: unknown, label: string): string {
  const id = text(value, 80);
  if (!uuidPattern.test(id)) throw new PlanningError('INVALID_ID', `${label} is invalid.`);
  return id;
}

function sendError(res: Response, error: unknown, fallback: string) {
  if (error instanceof PlanningError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback, code: 'NOTES_STUDIO_PLANNING_FAILED' });
}

async function loadPlanningContext(examId: string, rootTaxonomyNodeId: string, sourceLanguage?: string) {
  const [examRows, rootRows, languageRows] = await Promise.all([
    sqlClient`
      SELECT
        exam.id::text AS id,
        exam.code,
        exam.name,
        version.id::text AS "currentVersionId",
        version.version_number AS "currentVersionNumber",
        version.name AS "currentVersionName"
      FROM catalog.exams exam
      JOIN catalog.exam_families family ON family.id = exam.family_id AND family.is_active = true
      JOIN catalog.exam_versions version ON version.exam_id = exam.id AND version.is_current = true
      WHERE exam.id = ${examId}::uuid AND exam.is_active = true
      LIMIT 1
    `,
    sqlClient`
      SELECT id::text AS id, code, node_type AS "nodeType", name, description
      FROM catalog.taxonomy_nodes
      WHERE id = ${rootTaxonomyNodeId}::uuid
        AND is_active = true
        AND deleted_at IS NULL
      LIMIT 1
    `,
    sourceLanguage
      ? sqlClient`
          SELECT id::text AS id, code, name
          FROM catalog.languages
          WHERE lower(code) = ${sourceLanguage.toLowerCase()} AND is_active = true
          LIMIT 1
        `
      : Promise.resolve([{ id: '', code: '', name: '' }]),
  ]);
  if (!examRows[0]) throw new PlanningError('EXAM_UNAVAILABLE', 'Choose an active exam with a current canonical version.', 422);
  if (!rootRows[0]) throw new PlanningError('TAXONOMY_ROOT_UNAVAILABLE', 'Choose an active canonical taxonomy root.', 422);
  if (sourceLanguage && !languageRows[0]) throw new PlanningError('SOURCE_LANGUAGE_UNAVAILABLE', 'Choose an active canonical source language.', 422);
  return { exam: examRows[0], root: rootRows[0] };
}

async function loadCandidates(input: {
  examVersionId: string;
  rootTaxonomyNodeId: string;
  unitTypes: string[];
  leafOnly: boolean;
}) {
  const rows = await sqlClient`
    WITH RECURSIVE descendants AS (
      SELECT
        node.id,
        node.code,
        node.node_type,
        node.name,
        node.description,
        0::int AS depth,
        ARRAY[node.id]::uuid[] AS path
      FROM catalog.taxonomy_nodes node
      WHERE node.id = ${input.rootTaxonomyNodeId}::uuid
        AND node.is_active = true
        AND node.deleted_at IS NULL
      UNION ALL
      SELECT
        child.id,
        child.code,
        child.node_type,
        child.name,
        child.description,
        parent.depth + 1,
        parent.path || child.id
      FROM descendants parent
      JOIN catalog.taxonomy_edges edge ON edge.parent_id = parent.id
      JOIN catalog.taxonomy_nodes child ON child.id = edge.child_id
      WHERE child.is_active = true
        AND child.deleted_at IS NULL
        AND parent.depth < 12
        AND NOT child.id = ANY(parent.path)
    )
    SELECT
      descendant.id::text AS id,
      descendant.code,
      descendant.node_type AS "nodeType",
      descendant.name,
      descendant.description,
      descendant.depth,
      ARRAY(SELECT path_id::text FROM unnest(descendant.path) AS path_id) AS path,
      COALESCE((
        SELECT MAX(mapping.target_coverage)
        FROM catalog.exam_taxonomy_nodes mapping
        WHERE mapping.exam_version_id = ${input.examVersionId}::uuid
          AND mapping.is_active = true
          AND mapping.taxonomy_node_id = ANY(descendant.path)
      ), 0)::int AS "targetCoverage"
    FROM descendants descendant
    WHERE descendant.node_type = ANY(${input.unitTypes}::text[])
      AND EXISTS (
        SELECT 1
        FROM catalog.exam_taxonomy_nodes mapping
        WHERE mapping.exam_version_id = ${input.examVersionId}::uuid
          AND mapping.is_active = true
          AND mapping.taxonomy_node_id = ANY(descendant.path)
      )
    ORDER BY descendant.depth, descendant.name, descendant.code
  `;
  const candidates: TaxonomyPlanningCandidate[] = rows.map((row) => ({
    id: String(row.id),
    code: String(row.code),
    nodeType: String(row.nodeType),
    name: String(row.name),
    description: row.description ? String(row.description) : null,
    depth: Number(row.depth),
    path: Array.isArray(row.path) ? row.path.map(String) : [],
    targetCoverage: Number(row.targetCoverage ?? 0),
  }));
  const selected = selectPlanningCandidates(candidates, { leafOnly: input.leafOnly, maxItems: MAX_NOTE_PLAN_ITEMS + 1 });
  if (selected.length > MAX_NOTE_PLAN_ITEMS) {
    throw new PlanningError('PLAN_TOO_LARGE', `This selection expands beyond ${MAX_NOTE_PLAN_ITEMS} note units. Choose a narrower taxonomy root.`, 422);
  }
  return selected;
}

async function loadBatch(batchId: string) {
  const rows = await sqlClient`
    SELECT
      batch.id::text AS id,
      batch.title,
      batch.exam_id::text AS "examId",
      exam.code AS "examCode",
      exam.name AS "examName",
      batch.exam_version_id::text AS "examVersionId",
      version.name AS "examVersionName",
      batch.root_taxonomy_node_id::text AS "rootTaxonomyNodeId",
      root.code AS "rootTaxonomyCode",
      root.name AS "rootTaxonomyName",
      batch.source_language AS "sourceLanguage",
      batch.depth,
      batch.learner_level AS "learnerLevel",
      batch.status,
      batch.selection_policy AS "selectionPolicy",
      batch.created_at AS "createdAt",
      batch.updated_at AS "updatedAt",
      COUNT(item.id)::int AS "itemCount",
      COUNT(item.id) FILTER (WHERE item.item_state = 'planned')::int AS "plannedCount",
      COUNT(item.id) FILTER (WHERE item.item_state = 'job_created')::int AS "jobCreatedCount",
      COUNT(item.id) FILTER (WHERE item.item_state = 'skipped')::int AS "skippedCount",
      COUNT(item.id) FILTER (WHERE job.state IN ('approved', 'materialized'))::int AS "approvedOrMaterializedCount"
    FROM content.note_planning_batches batch
    JOIN catalog.exams exam ON exam.id = batch.exam_id
    JOIN catalog.exam_versions version ON version.id = batch.exam_version_id
    JOIN catalog.taxonomy_nodes root ON root.id = batch.root_taxonomy_node_id
    LEFT JOIN content.note_planning_items item ON item.batch_id = batch.id
    LEFT JOIN content.note_authoring_jobs job ON job.id = item.authoring_job_id
    WHERE batch.id = ${batchId}::uuid
    GROUP BY batch.id, exam.id, version.id, root.id
    LIMIT 1
  `;
  return rows[0] ?? null;
}

async function audit(input: {
  actorUserId: string;
  actionKey: string;
  entityType: string;
  entityId: string;
  summary: string;
  metadata: Record<string, unknown>;
}) {
  await sqlClient`
    INSERT INTO platform.audit_events (
      id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
    ) VALUES (
      ${randomUUID()}::uuid, 'user'::audit_actor_type, ${input.actorUserId}::uuid,
      ${input.actionKey}, ${input.entityType}, ${input.entityId}::uuid,
      ${input.summary}, ${JSON.stringify(input.metadata)}
    )
  `;
}

router.use(authenticate);

router.get('/planning/options', requireAdminPermission('content.questions.read'), async (_req, res) => {
  try {
    const [languages, exams, roots] = await Promise.all([
      sqlClient`
        SELECT id::text AS id, code, name, native_name AS "nativeName"
        FROM catalog.languages
        WHERE is_active = true
        ORDER BY name
      `,
      sqlClient`
        SELECT
          exam.id::text AS id,
          exam.code,
          exam.name,
          family.name AS "familyName",
          version.id::text AS "currentVersionId",
          version.name AS "currentVersionName"
        FROM catalog.exams exam
        JOIN catalog.exam_families family ON family.id = exam.family_id AND family.is_active = true
        JOIN catalog.exam_versions version ON version.exam_id = exam.id AND version.is_current = true
        WHERE exam.is_active = true
        ORDER BY family.name, exam.name
      `,
      sqlClient`
        SELECT DISTINCT
          exam.id::text AS "examId",
          mapping.exam_version_id::text AS "examVersionId",
          node.id::text AS id,
          node.code,
          node.node_type AS "nodeType",
          node.name,
          mapping.target_coverage AS "targetCoverage"
        FROM catalog.exam_taxonomy_nodes mapping
        JOIN catalog.exam_versions version ON version.id = mapping.exam_version_id AND version.is_current = true
        JOIN catalog.exams exam ON exam.id = version.exam_id AND exam.is_active = true
        JOIN catalog.taxonomy_nodes node ON node.id = mapping.taxonomy_node_id
        WHERE mapping.is_active = true
          AND node.is_active = true
          AND node.deleted_at IS NULL
        ORDER BY exam.id, node.node_type, node.name
      `,
    ]);
    res.json({
      languages,
      exams,
      roots,
      unitTypes: ['topic', 'subtopic', 'chapter'],
      depthOptions: NOTE_PLANNING_DEPTHS,
      learnerLevels: NOTE_PLANNING_LEARNER_LEVELS,
      maxPlanItems: MAX_NOTE_PLAN_ITEMS,
      maxJobCreationBatch: 100,
      automaticSourceIngestion: false,
      automaticGeneration: false,
      automaticPublication: false,
    });
  } catch (error) {
    sendError(res, error, 'Unable to load Notes Studio planning options');
  }
});

router.post('/planning/preview', requireAdminPermission('content.questions.read'), async (req, res) => {
  try {
    const examId = uuid(req.body?.examId, 'Exam ID');
    const rootTaxonomyNodeId = uuid(req.body?.rootTaxonomyNodeId, 'Taxonomy root ID');
    const unitTypes = normalizePlanningUnitTypes(req.body?.unitTypes);
    const leafOnly = req.body?.leafOnly !== false;
    const { exam, root } = await loadPlanningContext(examId, rootTaxonomyNodeId);
    const items = await loadCandidates({ examVersionId: String(exam.currentVersionId), rootTaxonomyNodeId, unitTypes, leafOnly });
    res.json({ exam, root, unitTypes, leafOnly, eligibleCount: items.length, items, maxPlanItems: MAX_NOTE_PLAN_ITEMS });
  } catch (error) {
    sendError(res, error, 'Unable to preview Notes Studio plan');
  }
});

router.get('/planning/batches', requireAdminPermission('content.questions.read'), async (_req, res) => {
  try {
    const rows = await sqlClient`
      SELECT
        batch.id::text AS id,
        batch.title,
        exam.code AS "examCode",
        exam.name AS "examName",
        root.code AS "rootTaxonomyCode",
        root.name AS "rootTaxonomyName",
        batch.source_language AS "sourceLanguage",
        batch.depth,
        batch.learner_level AS "learnerLevel",
        batch.status,
        batch.created_at AS "createdAt",
        batch.updated_at AS "updatedAt",
        COUNT(item.id)::int AS "itemCount",
        COUNT(item.id) FILTER (WHERE item.item_state = 'planned')::int AS "plannedCount",
        COUNT(item.id) FILTER (WHERE item.item_state = 'job_created')::int AS "jobCreatedCount",
        COUNT(item.id) FILTER (WHERE item.item_state = 'skipped')::int AS "skippedCount",
        COUNT(item.id) FILTER (WHERE job.state IN ('approved', 'materialized'))::int AS "approvedOrMaterializedCount"
      FROM content.note_planning_batches batch
      JOIN catalog.exams exam ON exam.id = batch.exam_id
      JOIN catalog.taxonomy_nodes root ON root.id = batch.root_taxonomy_node_id
      LEFT JOIN content.note_planning_items item ON item.batch_id = batch.id
      LEFT JOIN content.note_authoring_jobs job ON job.id = item.authoring_job_id
      GROUP BY batch.id, exam.id, root.id
      ORDER BY batch.updated_at DESC
      LIMIT 200
    `;
    res.json({ batches: rows });
  } catch (error) {
    sendError(res, error, 'Unable to load Notes Studio planning batches');
  }
});

router.get('/planning/batches/:id', requireAdminPermission('content.questions.read'), async (req, res) => {
  try {
    const batchId = uuid(req.params.id, 'Planning batch ID');
    const batch = await loadBatch(batchId);
    if (!batch) throw new PlanningError('PLAN_NOT_FOUND', 'Notes Studio planning batch not found.', 404);
    const items = await sqlClient`
      SELECT
        item.id::text AS id,
        item.taxonomy_node_id::text AS "taxonomyNodeId",
        item.taxonomy_snapshot AS "taxonomySnapshot",
        item.target_coverage AS "targetCoverage",
        item.priority,
        item.position,
        item.item_state AS "itemState",
        item.authoring_job_id::text AS "authoringJobId",
        job.title AS "authoringJobTitle",
        job.state AS "authoringJobState",
        job.target_resource_id::text AS "targetResourceId",
        item.updated_at AS "updatedAt"
      FROM content.note_planning_items item
      LEFT JOIN content.note_authoring_jobs job ON job.id = item.authoring_job_id
      WHERE item.batch_id = ${batchId}::uuid
      ORDER BY item.position, item.priority DESC, item.created_at
    `;
    res.json({ batch, items });
  } catch (error) {
    sendError(res, error, 'Unable to load Notes Studio planning batch');
  }
});

router.post('/planning/batches', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new PlanningError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const examId = uuid(req.body?.examId, 'Exam ID');
    const rootTaxonomyNodeId = uuid(req.body?.rootTaxonomyNodeId, 'Taxonomy root ID');
    const sourceLanguage = text(req.body?.sourceLanguage, 20).toLowerCase() || 'en';
    const depth = text(req.body?.depth, 40).toLowerCase() || 'standard';
    const learnerLevel = text(req.body?.learnerLevel, 40).toLowerCase() || 'standard';
    const unitTypes = normalizePlanningUnitTypes(req.body?.unitTypes);
    const leafOnly = req.body?.leafOnly !== false;
    if (!languagePattern.test(sourceLanguage)) throw new PlanningError('INVALID_LANGUAGE', 'Source language is invalid.');
    if (!depthSet.has(depth)) throw new PlanningError('INVALID_DEPTH', 'Choose a supported note depth.');
    if (!learnerLevelSet.has(learnerLevel)) throw new PlanningError('INVALID_LEARNER_LEVEL', 'Choose a supported learner level.');
    const { exam, root } = await loadPlanningContext(examId, rootTaxonomyNodeId, sourceLanguage);
    const items = await loadCandidates({ examVersionId: String(exam.currentVersionId), rootTaxonomyNodeId, unitTypes, leafOnly });
    if (items.length === 0) throw new PlanningError('NO_ELIGIBLE_UNITS', 'This exam/taxonomy selection has no eligible topic, subtopic or chapter note units.', 422);
    const title = text(req.body?.title, 240) || `${exam.name} · ${root.name} notes`;
    const batchId = randomUUID();
    const selectionPolicy = { unitTypes, leafOnly, eligibleCount: items.length, maxPlanItems: MAX_NOTE_PLAN_ITEMS, policyVersion: 'notes-planning-v1' };

    await sqlClient.begin(async (tx) => {
      await tx`
        INSERT INTO content.note_planning_batches (
          id, title, exam_id, exam_version_id, root_taxonomy_node_id,
          source_language, depth, learner_level, status, selection_policy,
          created_by, updated_by, created_at, updated_at
        ) VALUES (
          ${batchId}::uuid, ${title}, ${examId}::uuid, ${String(exam.currentVersionId)}::uuid,
          ${rootTaxonomyNodeId}::uuid, ${sourceLanguage}, ${depth}, ${learnerLevel}, 'active',
          ${JSON.stringify(selectionPolicy)}, ${actorUserId}::uuid, ${actorUserId}::uuid, now(), now()
        )
      `;
      for (let index = 0; index < items.length; index += 1) {
        const item = items[index];
        const priority = item.targetCoverage >= 50 ? 5 : item.targetCoverage >= 25 ? 4 : item.targetCoverage > 0 ? 3 : 2;
        await tx`
          INSERT INTO content.note_planning_items (
            id, batch_id, taxonomy_node_id, taxonomy_snapshot, target_coverage,
            priority, position, item_state, authoring_job_id,
            created_by, updated_by, created_at, updated_at
          ) VALUES (
            ${randomUUID()}::uuid, ${batchId}::uuid, ${item.id}::uuid,
            ${JSON.stringify({ code: item.code, name: item.name, nodeType: item.nodeType, description: item.description, depth: item.depth, path: item.path })},
            ${item.targetCoverage}, ${priority}, ${index}, 'planned', null,
            ${actorUserId}::uuid, ${actorUserId}::uuid, now(), now()
          )
        `;
      }
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
          'notes_studio.planning.batch_created', 'note_planning_batch', ${batchId}::uuid,
          ${`Created Notes Studio syllabus plan: ${title}`},
          ${JSON.stringify({ examId, examVersionId: exam.currentVersionId, rootTaxonomyNodeId, itemCount: items.length, selectionPolicy })}
        )
      `;
    });
    res.status(201).json({ batch: await loadBatch(batchId) });
  } catch (error) {
    sendError(res, error, 'Unable to create Notes Studio planning batch');
  }
});

router.post('/planning/batches/:id/create-jobs', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new PlanningError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const batchId = uuid(req.params.id, 'Planning batch ID');
    const limit = boundedPlanningJobLimit(req.body?.limit);
    const createdJobIds: string[] = [];

    await sqlClient.begin(async (tx) => {
      const batchRows = await tx`
        SELECT
          batch.id::text AS id,
          batch.title,
          batch.exam_id::text AS "examId",
          exam.code AS "examCode",
          batch.source_language AS "sourceLanguage",
          batch.depth,
          batch.learner_level AS "learnerLevel",
          batch.status
        FROM content.note_planning_batches batch
        JOIN catalog.exams exam ON exam.id = batch.exam_id
        WHERE batch.id = ${batchId}::uuid
        FOR UPDATE
      `;
      const batch = batchRows[0];
      if (!batch) throw new PlanningError('PLAN_NOT_FOUND', 'Notes Studio planning batch not found.', 404);
      if (batch.status !== 'active') throw new PlanningError('PLAN_ARCHIVED', 'Archived planning batches cannot create new authoring jobs.', 409);

      const itemRows = await tx`
        SELECT
          id::text AS id,
          taxonomy_node_id::text AS "taxonomyNodeId",
          taxonomy_snapshot AS "taxonomySnapshot",
          target_coverage AS "targetCoverage"
        FROM content.note_planning_items
        WHERE batch_id = ${batchId}::uuid
          AND item_state = 'planned'
        ORDER BY priority DESC, position, created_at
        LIMIT ${limit}
        FOR UPDATE SKIP LOCKED
      `;

      for (const item of itemRows) {
        const snapshot = (item.taxonomySnapshot ?? {}) as Record<string, unknown>;
        const taxonomyName = text(snapshot.name, 240) || 'Planned note';
        const taxonomyCode = text(snapshot.code, 120) || String(item.taxonomyNodeId);
        const jobId = randomUUID();
        const brief = buildPlannedJobBrief({
          taxonomyNodeId: String(item.taxonomyNodeId),
          taxonomyCode,
          taxonomyName,
          targetCoverage: Number(item.targetCoverage ?? 0),
          batchId,
          itemId: String(item.id),
          batchTitle: String(batch.title),
          examId: String(batch.examId),
          depth: String(batch.depth) as NotePlanningDepth,
          learnerLevel: String(batch.learnerLevel) as NotePlanningLearnerLevel,
        });
        const jobTitle = `${taxonomyName} · ${String(batch.examCode)}`.slice(0, 240);
        await tx`
          INSERT INTO content.note_authoring_jobs (
            id, title, source_language, state, brief, target_resource_id,
            created_by, updated_by, created_at, updated_at
          ) VALUES (
            ${jobId}::uuid, ${jobTitle}, ${String(batch.sourceLanguage)}, 'brief', ${JSON.stringify(brief)}, null,
            ${actorUserId}::uuid, ${actorUserId}::uuid, now(), now()
          )
        `;
        await tx`
          UPDATE content.note_planning_items
          SET item_state = 'job_created', authoring_job_id = ${jobId}::uuid,
              updated_by = ${actorUserId}::uuid, updated_at = now()
          WHERE id = ${String(item.id)}::uuid
        `;
        createdJobIds.push(jobId);
      }
      await tx`
        UPDATE content.note_planning_batches
        SET updated_by = ${actorUserId}::uuid, updated_at = now()
        WHERE id = ${batchId}::uuid
      `;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
          'notes_studio.planning.jobs_created', 'note_planning_batch', ${batchId}::uuid,
          ${`Created ${createdJobIds.length} Notes Studio brief job(s) from syllabus plan`},
          ${JSON.stringify({ createdJobIds, requestedLimit: limit, automaticSourceIngestion: false, automaticGeneration: false, automaticPublication: false })}
        )
      `;
    });

    res.json({ createdCount: createdJobIds.length, createdJobIds, batch: await loadBatch(batchId) });
  } catch (error) {
    sendError(res, error, 'Unable to create Notes Studio jobs from planning batch');
  }
});

router.patch('/planning/items/:id', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new PlanningError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const itemId = uuid(req.params.id, 'Planning item ID');
    const action = text(req.body?.action, 20).toLowerCase();
    if (!['skip', 'restore'].includes(action)) throw new PlanningError('INVALID_ACTION', 'Use skip or restore.');
    const rows = await sqlClient`
      UPDATE content.note_planning_items
      SET item_state = ${action === 'skip' ? 'skipped' : 'planned'},
          updated_by = ${actorUserId}::uuid,
          updated_at = now()
      WHERE id = ${itemId}::uuid
        AND authoring_job_id IS NULL
        AND item_state = ${action === 'skip' ? 'planned' : 'skipped'}
      RETURNING id::text AS id, batch_id::text AS "batchId", item_state AS "itemState"
    `;
    if (!rows[0]) throw new PlanningError('PLAN_ITEM_LOCKED', 'This planning item is not eligible for that change.', 409);
    await audit({
      actorUserId,
      actionKey: `notes_studio.planning.item_${action === 'skip' ? 'skipped' : 'restored'}`,
      entityType: 'note_planning_item',
      entityId: itemId,
      summary: `${action === 'skip' ? 'Skipped' : 'Restored'} Notes Studio planning item`,
      metadata: { batchId: rows[0].batchId },
    });
    res.json({ item: rows[0] });
  } catch (error) {
    sendError(res, error, 'Unable to update Notes Studio planning item');
  }
});

router.patch('/planning/batches/:id/archive', requireAdminPermission('content.questions.update'), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new PlanningError('ADMIN_SESSION_REQUIRED', 'Administrator session required.', 403);
    const batchId = uuid(req.params.id, 'Planning batch ID');
    const rows = await sqlClient`
      UPDATE content.note_planning_batches
      SET status = 'archived', updated_by = ${actorUserId}::uuid, updated_at = now()
      WHERE id = ${batchId}::uuid AND status = 'active'
      RETURNING id::text AS id
    `;
    if (!rows[0]) throw new PlanningError('PLAN_NOT_ACTIVE', 'Planning batch is not active.', 409);
    await audit({
      actorUserId,
      actionKey: 'notes_studio.planning.batch_archived',
      entityType: 'note_planning_batch',
      entityId: batchId,
      summary: 'Archived Notes Studio planning batch',
      metadata: {},
    });
    res.json({ batch: await loadBatch(batchId) });
  } catch (error) {
    sendError(res, error, 'Unable to archive Notes Studio planning batch');
  }
});

export default router;
