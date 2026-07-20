import { randomUUID } from "node:crypto";
import { Router, type Response } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import {
  TestBlueprintError,
  blueprintPublicCode,
  normalizeBlueprintInput,
  type BlueprintSectionInput,
  type BlueprintVersionInput,
} from "../lib/admin-test-blueprints";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();
type SqlExecutor = typeof sqlClient;

function sendError(res: Response, error: unknown, fallback: string): void {
  if (error instanceof TestBlueprintError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code, details: error.details });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback });
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function assertUuid(value: string, field = "identifier"): string {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    throw new TestBlueprintError("INVALID_BLUEPRINT_IDENTIFIER", `Invalid ${field}`, 400);
  }
  return value;
}

async function insertVersion(
  client: SqlExecutor,
  blueprintId: string,
  actorUserId: string,
  input: BlueprintVersionInput,
  versionNumber: number,
): Promise<string> {
  const versionId = randomUUID();
  await client`
    INSERT INTO assessment.test_blueprint_versions (
      id, blueprint_id, version_number, duration_seconds, total_marks,
      instructions, configuration, change_reason, created_by, created_at
    ) VALUES (
      ${versionId}::uuid, ${blueprintId}::uuid, ${versionNumber},
      ${Math.round(input.durationMinutes * 60)}, ${input.totalMarks},
      ${client.json(input.instructions)}, ${client.json(input.configuration)},
      ${input.changeReason}, ${actorUserId}::uuid, now()
    )
  `;
  for (let index = 0; index < input.sections.length; index += 1) {
    const section = input.sections[index];
    await client`
      INSERT INTO assessment.test_blueprint_sections (
        id, blueprint_version_id, name, section_key, sort_order,
        question_count, marks, duration_seconds, selection_rules
      ) VALUES (
        ${randomUUID()}::uuid, ${versionId}::uuid, ${section.name}, ${section.clientKey}, ${index + 1},
        ${section.questionCount}, ${section.marks},
        ${section.durationMinutes == null ? null : Math.round(section.durationMinutes * 60)},
        ${client.json(section.selectionRules)}
      )
    `;
  }
  return versionId;
}

async function loadBlueprints(client: SqlExecutor = sqlClient) {
  return client`
    SELECT
      b.id::text AS id,
      b.exam_version_id::text AS "examVersionId",
      b.code,
      b.name,
      b.current_version_number AS "currentVersionNumber",
      b.created_by::text AS "createdBy",
      b.created_at AS "createdAt",
      b.updated_at AS "updatedAt",
      e.code AS "examCode",
      e.name AS "examName",
      ef.name AS "examFamilyName",
      v.id::text AS "versionId",
      v.duration_seconds AS "durationSeconds",
      v.total_marks::float8 AS "totalMarks",
      v.instructions,
      v.configuration,
      v.change_reason AS "changeReason",
      v.created_at AS "versionCreatedAt",
      COALESCE((
        SELECT json_agg(json_build_object(
          'id', s.id,
          'name', s.name,
          'clientKey', s.section_key,
          'sortOrder', s.sort_order,
          'questionCount', s.question_count,
          'marks', s.marks::float8,
          'durationSeconds', s.duration_seconds,
          'selectionRules', s.selection_rules
        ) ORDER BY s.sort_order)
        FROM assessment.test_blueprint_sections s
        WHERE s.blueprint_version_id = v.id
      ), '[]'::json) AS sections,
      (SELECT COUNT(*)::int FROM assessment.test_blueprint_versions history WHERE history.blueprint_id = b.id) AS "versionCount"
    FROM assessment.test_blueprints b
    JOIN assessment.test_blueprint_versions v
      ON v.blueprint_id = b.id AND v.version_number = b.current_version_number
    JOIN catalog.exam_versions ev ON ev.id = b.exam_version_id
    JOIN catalog.exams e ON e.id = ev.exam_id
    JOIN catalog.exam_families ef ON ef.id = e.family_id
    WHERE b.deleted_at IS NULL
    ORDER BY b.updated_at DESC, b.name
  `;
}

async function loadBlueprint(blueprintId: string, client: SqlExecutor = sqlClient) {
  const rows = await loadBlueprints(client);
  const blueprint = rows.find((row) => String(row.id) === blueprintId);
  if (!blueprint) return null;
  const versions = await client`
    SELECT
      v.id::text AS id,
      v.version_number AS "versionNumber",
      v.duration_seconds AS "durationSeconds",
      v.total_marks::float8 AS "totalMarks",
      v.instructions,
      v.configuration,
      v.change_reason AS "changeReason",
      v.created_by::text AS "createdBy",
      v.created_at AS "createdAt",
      COALESCE((
        SELECT json_agg(json_build_object(
          'id', s.id,
          'name', s.name,
          'clientKey', s.section_key,
          'sortOrder', s.sort_order,
          'questionCount', s.question_count,
          'marks', s.marks::float8,
          'durationSeconds', s.duration_seconds,
          'selectionRules', s.selection_rules
        ) ORDER BY s.sort_order)
        FROM assessment.test_blueprint_sections s
        WHERE s.blueprint_version_id = v.id
      ), '[]'::json) AS sections
    FROM assessment.test_blueprint_versions v
    WHERE v.blueprint_id = ${blueprintId}::uuid
    ORDER BY v.version_number DESC
  `;
  return { blueprint, versions };
}

async function assertReferences(client: SqlExecutor, input: BlueprintVersionInput): Promise<void> {
  const examRows = await client`SELECT id FROM catalog.exam_versions WHERE id = ${input.examVersionId}::uuid LIMIT 1`;
  if (examRows.length === 0) throw new TestBlueprintError("EXAM_VERSION_NOT_FOUND", "Exam version not found", 404);
  const ids = Array.from(new Set(input.sections.flatMap((section) => section.selectionRules.taxonomyNodeIds)));
  const nodes = await client`
    SELECT id::text AS id
    FROM catalog.taxonomy_nodes
    WHERE id = ANY(${ids}::uuid[]) AND is_active = true AND deleted_at IS NULL
  `;
  if (nodes.length !== ids.length) {
    throw new TestBlueprintError("BLUEPRINT_TAXONOMY_NOT_FOUND", "One or more taxonomy targets are inactive or missing", 409);
  }
}

async function selectSectionQuestions(
  client: SqlExecutor,
  examVersionId: string,
  section: BlueprintSectionInput,
  seed: string,
  excludedIds: string[],
) {
  const selected: Array<Record<string, unknown>> = [];
  const shortages: string[] = [];
  for (const [difficulty, count] of Object.entries(section.selectionRules.difficulties)) {
    const rows = await client`
      WITH RECURSIVE descendants AS (
        SELECT id FROM catalog.taxonomy_nodes WHERE id = ANY(${section.selectionRules.taxonomyNodeIds}::uuid[])
        UNION
        SELECT edge.child_id
        FROM catalog.taxonomy_edges edge
        JOIN descendants parent ON parent.id = edge.parent_id
      )
      SELECT DISTINCT
        q.id::text AS "questionId",
        q.public_code AS "publicCode",
        v.id::text AS "questionVersionId",
        v.stem,
        v.difficulty,
        COALESCE((
          SELECT json_agg(json_build_object(
            'id', o.id, 'key', o.option_key, 'text', o.text,
            'sortOrder', o.sort_order, 'isCorrect', o.is_correct
          ) ORDER BY o.sort_order)
          FROM content.question_options o WHERE o.question_version_id = v.id
        ), '[]'::json) AS options
      FROM content.questions q
      JOIN content.question_versions v ON v.id = q.published_version_id
      WHERE q.status = 'published'::question_status
        AND q.deleted_at IS NULL
        AND v.exam_version_id = ${examVersionId}::uuid
        AND lower(v.difficulty) = ${difficulty.toLowerCase()}
        AND NOT (q.id = ANY(${excludedIds}::uuid[]))
        AND EXISTS (
          SELECT 1 FROM content.question_taxonomy_links qtl
          WHERE qtl.question_version_id = v.id
            AND qtl.taxonomy_node_id IN (SELECT id FROM descendants)
        )
        AND (
          ${section.selectionRules.languageCode} = 'en'
          OR EXISTS (
            SELECT 1
            FROM content.question_translations qt
            JOIN catalog.languages l ON l.id = qt.language_id
            WHERE qt.question_version_id = v.id
              AND lower(l.code) = ${section.selectionRules.languageCode}
              AND lower(qt.status) = 'approved'
          )
        )
      ORDER BY md5(v.id::text || ${`${seed}:${section.clientKey}:${difficulty}`})
      LIMIT ${count}
    `;
    selected.push(...rows);
    excludedIds.push(...rows.map((row) => String(row.questionId)));
    if (rows.length < count) shortages.push(`${section.name}: ${difficulty} requires ${count}, but only ${rows.length} published questions are available.`);
  }
  return { selected, shortages };
}

router.use(authenticate);

router.get("/catalog", requireAdminPermission("tests.read"), async (_req, res) => {
  try {
    const [examVersions, taxonomyNodes, languages] = await Promise.all([
      sqlClient`
        SELECT ev.id::text AS id, ev.version_number AS "versionNumber", ev.name AS "versionName",
          e.code AS "examCode", e.name AS "examName", ef.name AS "familyName"
        FROM catalog.exam_versions ev
        JOIN catalog.exams e ON e.id = ev.exam_id
        JOIN catalog.exam_families ef ON ef.id = e.family_id
        ORDER BY ef.name, e.name, ev.version_number DESC
      `,
      sqlClient`
        SELECT id::text AS id, code, name, node_type AS "nodeType"
        FROM catalog.taxonomy_nodes
        WHERE is_active = true AND deleted_at IS NULL
        ORDER BY node_type, name
      `,
      sqlClient`SELECT id::text AS id, code, name, native_name AS "nativeName" FROM catalog.languages WHERE is_active = true ORDER BY name`,
    ]);
    res.json({ examVersions, taxonomyNodes, languages, generatedAt: new Date().toISOString() });
  } catch (error) {
    sendError(res, error, "Unable to load blueprint catalog");
  }
});

router.get("/", requireAdminPermission("tests.read"), async (_req, res) => {
  try {
    res.json({ blueprints: await loadBlueprints(), generatedAt: new Date().toISOString() });
  } catch (error) {
    sendError(res, error, "Unable to load test blueprints");
  }
});

router.get("/:id", requireAdminPermission("tests.read"), async (req, res) => {
  try {
    const id = assertUuid(req.params.id, "blueprint identifier");
    const detail = await loadBlueprint(id);
    if (!detail) {
      res.status(404).json({ error: "Blueprint not found", code: "BLUEPRINT_NOT_FOUND" });
      return;
    }
    res.json(detail);
  } catch (error) {
    sendError(res, error, "Unable to load blueprint detail");
  }
});

router.post("/", requireAdminPermission("tests.create"), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new TestBlueprintError("ADMIN_REQUIRED", "Administrator session required", 403);
    const input = normalizeBlueprintInput(req.body);
    await assertReferences(sqlClient, input);
    const result = await sqlClient.begin(async (tx) => {
      const id = randomUUID();
      const publicCode = input.code || blueprintPublicCode(new Date(), id);
      await tx`
        INSERT INTO assessment.test_blueprints (
          id, exam_version_id, code, name, current_version_number, created_by, created_at, updated_at
        ) VALUES (${id}::uuid, ${input.examVersionId}::uuid, ${publicCode}, ${input.name}, 1, ${actorUserId}::uuid, now(), now())
      `;
      const versionId = await insertVersion(tx as SqlExecutor, id, actorUserId, input, 1);
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id,
          entity_version_id, reason, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
          'assessment.test_blueprint.created', 'test_blueprint', ${id}::uuid,
          ${versionId}::uuid, ${input.changeReason}, ${`Created blueprint ${publicCode}`},
          ${tx.json({ versionNumber: 1, name: input.name, status: input.configuration.status })}
        )
      `;
      return loadBlueprint(id, tx as SqlExecutor);
    });
    res.status(201).json(result);
  } catch (error) {
    sendError(res, error, "Unable to create test blueprint");
  }
});

router.put("/:id", requireAdminPermission("tests.update"), async (req, res) => {
  try {
    const id = assertUuid(req.params.id, "blueprint identifier");
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new TestBlueprintError("ADMIN_REQUIRED", "Administrator session required", 403);
    const input = normalizeBlueprintInput(req.body);
    await assertReferences(sqlClient, input);
    const result = await sqlClient.begin(async (tx) => {
      const rows = await tx`
        SELECT id, code, current_version_number AS "currentVersionNumber"
        FROM assessment.test_blueprints
        WHERE id = ${id}::uuid AND deleted_at IS NULL
        FOR UPDATE
      `;
      if (!rows[0]) throw new TestBlueprintError("BLUEPRINT_NOT_FOUND", "Blueprint not found", 404);
      const expected = Number(asRecord(req.body).expectedCurrentVersionNumber);
      if (!Number.isInteger(expected) || expected !== Number(rows[0].currentVersionNumber)) {
        throw new TestBlueprintError("BLUEPRINT_VERSION_CONFLICT", "This blueprint changed after you opened it. Refresh before saving.", 409);
      }
      if (String(rows[0].code) !== input.code) {
        throw new TestBlueprintError("BLUEPRINT_CODE_IMMUTABLE", "Blueprint code cannot change after creation", 409);
      }
      const nextVersion = Number(rows[0].currentVersionNumber) + 1;
      const versionId = await insertVersion(tx as SqlExecutor, id, actorUserId, input, nextVersion);
      await tx`
        UPDATE assessment.test_blueprints
        SET exam_version_id = ${input.examVersionId}::uuid,
          name = ${input.name}, current_version_number = ${nextVersion}, updated_at = now()
        WHERE id = ${id}::uuid
      `;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id,
          entity_version_id, reason, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
          'assessment.test_blueprint.version.created', 'test_blueprint', ${id}::uuid,
          ${versionId}::uuid, ${input.changeReason}, ${`Created blueprint version ${nextVersion}`},
          ${tx.json({ previousVersionNumber: expected, versionNumber: nextVersion, status: input.configuration.status })}
        )
      `;
      return loadBlueprint(id, tx as SqlExecutor);
    });
    res.json(result);
  } catch (error) {
    sendError(res, error, "Unable to update test blueprint");
  }
});

router.post("/:id/assemble", requireAdminPermission("tests.create"), async (req, res) => {
  try {
    const id = assertUuid(req.params.id, "blueprint identifier");
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new TestBlueprintError("ADMIN_REQUIRED", "Administrator session required", 403);
    const detail = await loadBlueprint(id);
    if (!detail) throw new TestBlueprintError("BLUEPRINT_NOT_FOUND", "Blueprint not found", 404);
    const blueprint = detail.blueprint as Record<string, unknown>;
    const configuration = asRecord(blueprint.configuration);
    if (configuration.status !== "active") {
      throw new TestBlueprintError("BLUEPRINT_NOT_ACTIVE", "Only active blueprints can create test drafts", 409);
    }
    const seed = asText(req.body?.seed) || randomUUID();
    const title = asText(req.body?.title) || `${String(blueprint.name)} Mock Test`;
    const sections = Array.isArray(blueprint.sections) ? blueprint.sections.map(asRecord) : [];
    const excludedIds: string[] = [];
    const assembled: Array<{ section: Record<string, unknown>; questions: Array<Record<string, unknown>> }> = [];
    const shortages: string[] = [];
    for (const rawSection of sections) {
      const rules = asRecord(rawSection.selectionRules);
      const section: BlueprintSectionInput = {
        clientKey: String(rawSection.clientKey),
        name: String(rawSection.name),
        questionCount: Number(rawSection.questionCount),
        marks: Number(rawSection.marks),
        durationMinutes: rawSection.durationSeconds == null ? null : Number(rawSection.durationSeconds) / 60,
        selectionRules: {
          taxonomyNodeIds: Array.isArray(rules.taxonomyNodeIds) ? rules.taxonomyNodeIds.map(String) : [],
          languageCode: String(rules.languageCode ?? "en"),
          negativeMarks: Number(rules.negativeMarks ?? 0),
          difficulties: Object.fromEntries(Object.entries(asRecord(rules.difficulties)).map(([key, value]) => [key, Number(value)])),
        },
      };
      const selection = await selectSectionQuestions(sqlClient, String(blueprint.examVersionId), section, seed, excludedIds);
      assembled.push({ section: rawSection, questions: selection.selected });
      shortages.push(...selection.shortages);
    }
    if (shortages.length > 0) {
      res.status(409).json({
        error: "Published Question Bank supply cannot satisfy this blueprint.",
        code: "BLUEPRINT_SUPPLY_SHORTAGE",
        shortages,
        selectedCount: assembled.reduce((sum, entry) => sum + entry.questions.length, 0),
      });
      return;
    }

    const created = await sqlClient.begin(async (tx) => {
      const testId = randomUUID();
      const versionId = randomUUID();
      const publicCode = `T-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${testId.replace(/-/g, "").slice(0, 10).toUpperCase()}`;
      await tx`
        INSERT INTO assessment.tests (
          id, public_code, exam_version_id, status, created_by, created_at, updated_at
        ) VALUES (${testId}::uuid, ${publicCode}, ${String(blueprint.examVersionId)}::uuid, 'draft'::test_status, ${actorUserId}::uuid, now(), now())
      `;
      await tx`
        INSERT INTO assessment.test_versions (
          id, test_id, version_number, title, description, duration_seconds, total_marks,
          instructions, settings, change_reason, created_by, created_at
        ) VALUES (
          ${versionId}::uuid, ${testId}::uuid, 1, ${title},
          ${`Assembled from blueprint ${String(blueprint.code)}`},
          ${Number(blueprint.durationSeconds)}, ${Number(blueprint.totalMarks)},
          ${tx.json(asRecord(blueprint.instructions))},
          ${tx.json({ blueprintId: id, blueprintVersionId: blueprint.versionId, seed })},
          ${`Created from blueprint ${String(blueprint.code)}`}, ${actorUserId}::uuid, now()
        )
      `;
      for (let sectionIndex = 0; sectionIndex < assembled.length; sectionIndex += 1) {
        const entry = assembled[sectionIndex];
        const sectionId = randomUUID();
        const marksPerQuestion = Number(entry.section.marks) / Number(entry.section.questionCount);
        const rules = asRecord(entry.section.selectionRules);
        await tx`
          INSERT INTO assessment.test_sections (
            id, test_version_id, name, section_key, sort_order, duration_seconds, settings
          ) VALUES (
            ${sectionId}::uuid, ${versionId}::uuid, ${String(entry.section.name)}, ${String(entry.section.clientKey)},
            ${sectionIndex + 1}, ${entry.section.durationSeconds == null ? null : Number(entry.section.durationSeconds)},
            ${tx.json({ blueprintSectionId: entry.section.id })}
          )
        `;
        for (let questionIndex = 0; questionIndex < entry.questions.length; questionIndex += 1) {
          const question = entry.questions[questionIndex];
          await tx`
            INSERT INTO assessment.test_questions (
              test_version_id, test_section_id, question_version_id, position, marks, negative_marks, settings
            ) VALUES (
              ${versionId}::uuid, ${sectionId}::uuid, ${String(question.questionVersionId)}::uuid,
              ${questionIndex + 1}, ${marksPerQuestion}, ${Number(rules.negativeMarks ?? 0)},
              ${tx.json({ blueprintId: id, seed })}
            )
          `;
        }
      }
      await tx`UPDATE assessment.tests SET current_draft_version_id = ${versionId}::uuid, updated_at = now() WHERE id = ${testId}::uuid`;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id,
          entity_version_id, reason, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
          'assessment.test.created_from_blueprint', 'test', ${testId}::uuid,
          ${versionId}::uuid, ${`Blueprint ${String(blueprint.code)}`}, ${`Created ${publicCode} from blueprint`},
          ${tx.json({ blueprintId: id, blueprintVersionId: blueprint.versionId, seed })}
        )
      `;
      return { testId, testVersionId: versionId, publicCode, title, questionCount: excludedIds.length };
    });
    res.status(201).json({ ...created, shortages: [], seed });
  } catch (error) {
    sendError(res, error, "Unable to assemble test from blueprint");
  }
});

router.post("/:id/actions/:action", requireAdminPermission("tests.update"), async (req, res) => {
  try {
    const id = assertUuid(req.params.id, "blueprint identifier");
    const action = String(req.params.action);
    const nextStatus = action === "activate" ? "active" : action === "deprecate" ? "deprecated" : action === "archive" ? "archived" : action === "restore" ? "draft" : "";
    if (!nextStatus) throw new TestBlueprintError("INVALID_BLUEPRINT_ACTION", "Unsupported blueprint action", 404);
    const detail = await loadBlueprint(id);
    if (!detail) throw new TestBlueprintError("BLUEPRINT_NOT_FOUND", "Blueprint not found", 404);
    const blueprint = detail.blueprint as Record<string, unknown>;
    const input = normalizeBlueprintInput({
      examVersionId: blueprint.examVersionId,
      code: blueprint.code,
      name: blueprint.name,
      durationMinutes: Number(blueprint.durationSeconds) / 60,
      totalMarks: blueprint.totalMarks,
      instructions: blueprint.instructions,
      configuration: { ...asRecord(blueprint.configuration), status: nextStatus },
      changeReason: asText(req.body?.reason) || `${action} blueprint`,
      sections: (Array.isArray(blueprint.sections) ? blueprint.sections : []).map((raw) => {
        const section = asRecord(raw);
        return {
          clientKey: section.clientKey,
          name: section.name,
          questionCount: section.questionCount,
          marks: section.marks,
          durationMinutes: section.durationSeconds == null ? null : Number(section.durationSeconds) / 60,
          selectionRules: section.selectionRules,
        };
      }),
    });
    req.body = { ...input, expectedCurrentVersionNumber: blueprint.currentVersionNumber };
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) throw new TestBlueprintError("ADMIN_REQUIRED", "Administrator session required", 403);
    const result = await sqlClient.begin(async (tx) => {
      const nextVersion = Number(blueprint.currentVersionNumber) + 1;
      const versionId = await insertVersion(tx as SqlExecutor, id, actorUserId, input, nextVersion);
      await tx`UPDATE assessment.test_blueprints SET current_version_number = ${nextVersion}, updated_at = now() WHERE id = ${id}::uuid`;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id,
          entity_version_id, reason, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
          ${`assessment.test_blueprint.${action}`}, 'test_blueprint', ${id}::uuid,
          ${versionId}::uuid, ${input.changeReason}, ${`${String(blueprint.code)} moved to ${nextStatus}`},
          ${tx.json({ previousStatus: asRecord(blueprint.configuration).status, status: nextStatus, versionNumber: nextVersion })}
        )
      `;
      return loadBlueprint(id, tx as SqlExecutor);
    });
    res.json(result);
  } catch (error) {
    sendError(res, error, "Unable to update blueprint lifecycle");
  }
});

export default router;
