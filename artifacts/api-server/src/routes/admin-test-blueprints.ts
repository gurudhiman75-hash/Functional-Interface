import { randomUUID } from "node:crypto";
import { Router, type Response } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import {
  TestBlueprintError,
  normalizeBlueprintAssemblyInput,
  normalizeBlueprintInput,
  type BlueprintAssemblyPlan,
  type BlueprintAssemblyQuestion,
  type BlueprintDifficulty,
  type NormalizedBlueprintInput,
  type NormalizedBlueprintSection,
} from "../lib/admin-test-blueprint";
import { isUuid, testPublicCode } from "../lib/admin-test-management";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();
type SqlExecutor = typeof sqlClient;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function sendError(res: Response, error: unknown, fallback: string): void {
  if (error instanceof TestBlueprintError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code, details: error.details });
    return;
  }
  const candidate = error as { code?: string; constraint_name?: string };
  if (candidate?.code === "23505") {
    res.status(409).json({ error: "Blueprint code or version already exists", code: "BLUEPRINT_CONFLICT" });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback });
}

function assertBlueprintId(value: string): string {
  if (!isUuid(value)) {
    throw new TestBlueprintError("INVALID_BLUEPRINT_ID", "Invalid blueprint identifier");
  }
  return value;
}

function difficultyTargets(value: unknown): { easy: number; medium: number; hard: number } {
  const input = asRecord(value);
  return {
    easy: Number(input.easy ?? 0),
    medium: Number(input.medium ?? 0),
    hard: Number(input.hard ?? 0),
  };
}

function storedSection(row: Record<string, unknown>): NormalizedBlueprintSection {
  const rules = asRecord(row.selectionRules);
  return {
    sectionKey: String(row.sectionKey),
    name: String(row.name),
    questionCount: Number(row.questionCount),
    marks: Number(row.marks),
    durationMinutes: row.durationSeconds == null ? null : Number(row.durationSeconds) / 60,
    taxonomyNodeIds: Array.isArray(rules.taxonomyNodeIds) ? rules.taxonomyNodeIds.map(String) : [],
    difficultyTargets: difficultyTargets(rules.difficultyTargets),
    languageCode: typeof rules.languageCode === "string" ? rules.languageCode : "en",
    negativeMarks: Number(rules.negativeMarks ?? 0),
  };
}

function selectionRules(section: NormalizedBlueprintSection) {
  return {
    taxonomyNodeIds: section.taxonomyNodeIds,
    difficultyTargets: section.difficultyTargets,
    languageCode: section.languageCode,
    negativeMarks: section.negativeMarks,
  };
}

async function assertReferences(client: SqlExecutor, input: NormalizedBlueprintInput): Promise<void> {
  const examRows = await client`
    SELECT ev.id::text AS id
    FROM catalog.exam_versions ev
    WHERE ev.id = ${input.examVersionId}::uuid
    LIMIT 1
  `;
  if (examRows.length === 0) {
    throw new TestBlueprintError("BLUEPRINT_EXAM_MISSING", "The selected exam version does not exist", 404);
  }

  const languageCodes = [...new Set(input.sections.map((section) => section.languageCode))];
  const languageRows = await client`
    SELECT lower(l.code) AS code
    FROM catalog.exam_version_languages evl
    JOIN catalog.languages l ON l.id = evl.language_id AND l.is_active = true
    WHERE evl.exam_version_id = ${input.examVersionId}::uuid
      AND lower(l.code) = ANY(${languageCodes}::text[])
  `;
  const supportedLanguages = new Set(languageRows.map((row) => String(row.code)));
  const unsupportedLanguage = languageCodes.find((code) => !supportedLanguages.has(code));
  if (unsupportedLanguage) {
    throw new TestBlueprintError(
      "BLUEPRINT_LANGUAGE_UNSUPPORTED",
      `${unsupportedLanguage} is not enabled for the selected exam version`,
    );
  }

  const taxonomyIds = [...new Set(input.sections.flatMap((section) => section.taxonomyNodeIds))];
  const taxonomyRows = await client`
    SELECT tn.id::text AS id
    FROM catalog.taxonomy_nodes tn
    JOIN catalog.exam_taxonomy_nodes etn
      ON etn.taxonomy_node_id = tn.id
     AND etn.exam_version_id = ${input.examVersionId}::uuid
     AND etn.is_active = true
    WHERE tn.id = ANY(${taxonomyIds}::uuid[])
      AND tn.is_active = true
  `;
  const mapped = new Set(taxonomyRows.map((row) => String(row.id)));
  const missing = taxonomyIds.filter((id) => !mapped.has(id));
  if (missing.length > 0) {
    throw new TestBlueprintError(
      "BLUEPRINT_TAXONOMY_UNMAPPED",
      `${missing.length} taxonomy target(s) are not active for the selected exam version`,
      409,
      { taxonomyNodeIds: missing },
    );
  }
}

async function insertBlueprintVersion(
  client: SqlExecutor,
  blueprintId: string,
  actorUserId: string,
  versionNumber: number,
  input: NormalizedBlueprintInput,
): Promise<string> {
  const versionId = randomUUID();
  await client`
    INSERT INTO assessment.test_blueprint_versions (
      id, blueprint_id, version_number, duration_seconds, total_marks,
      instructions, configuration, change_reason, created_by, created_at
    ) VALUES (
      ${versionId}::uuid,
      ${blueprintId}::uuid,
      ${versionNumber},
      ${Math.round(input.durationMinutes * 60)},
      ${input.totalMarks},
      ${client.json(input.instructions)},
      ${client.json(input.configuration)},
      ${input.changeReason},
      ${actorUserId}::uuid,
      now()
    )
  `;

  for (let index = 0; index < input.sections.length; index += 1) {
    const section = input.sections[index]!;
    await client`
      INSERT INTO assessment.test_blueprint_sections (
        id, blueprint_version_id, name, section_key, sort_order,
        question_count, marks, duration_seconds, selection_rules
      ) VALUES (
        ${randomUUID()}::uuid,
        ${versionId}::uuid,
        ${section.name},
        ${section.sectionKey},
        ${index + 1},
        ${section.questionCount},
        ${section.marks},
        ${section.durationMinutes == null ? null : Math.round(section.durationMinutes * 60)},
        ${client.json(selectionRules(section))}
      )
    `;
  }
  return versionId;
}

async function loadBlueprintDetail(blueprintId: string, client: SqlExecutor = sqlClient) {
  const rows = await client`
    SELECT
      b.id::text AS id,
      b.exam_version_id::text AS "examVersionId",
      b.code,
      b.name,
      b.current_version_number AS "currentVersionNumber",
      b.created_by::text AS "createdBy",
      b.created_at AS "createdAt",
      b.updated_at AS "updatedAt",
      b.deleted_at AS "deletedAt",
      ev.version_number AS "examVersionNumber",
      ev.name AS "examVersionName",
      e.code AS "examCode",
      e.name AS "examName",
      ef.name AS "examFamilyName"
    FROM assessment.test_blueprints b
    JOIN catalog.exam_versions ev ON ev.id = b.exam_version_id
    JOIN catalog.exams e ON e.id = ev.exam_id
    JOIN catalog.exam_families ef ON ef.id = e.family_id
    WHERE b.id = ${blueprintId}::uuid
    LIMIT 1
  `;
  const blueprint = rows[0];
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
      (SELECT COUNT(*)::int FROM assessment.test_blueprint_sections s WHERE s.blueprint_version_id = v.id) AS "sectionCount",
      (SELECT COALESCE(SUM(s.question_count), 0)::int FROM assessment.test_blueprint_sections s WHERE s.blueprint_version_id = v.id) AS "questionCount"
    FROM assessment.test_blueprint_versions v
    WHERE v.blueprint_id = ${blueprintId}::uuid
    ORDER BY v.version_number DESC
  `;
  const currentVersion = versions.find(
    (version) => Number(version.versionNumber) === Number(blueprint.currentVersionNumber),
  ) ?? null;
  const sections = currentVersion
    ? await client`
        SELECT
          id::text AS id,
          name,
          section_key AS "sectionKey",
          sort_order AS "sortOrder",
          question_count AS "questionCount",
          marks::float8 AS marks,
          duration_seconds AS "durationSeconds",
          selection_rules AS "selectionRules"
        FROM assessment.test_blueprint_sections
        WHERE blueprint_version_id = ${String(currentVersion.id)}::uuid
        ORDER BY sort_order
      `
    : [];

  return {
    blueprint,
    versions,
    currentVersion,
    sections,
    generatedAt: new Date().toISOString(),
  };
}

function normalizeStem(value: unknown): string {
  return String(value ?? "").toLowerCase().replace(/[^a-z0-9\u0900-\u097f\u0a00-\u0a7f]+/g, " ").replace(/\s+/g, " ").trim();
}

async function buildAssemblyPlan(
  detail: NonNullable<Awaited<ReturnType<typeof loadBlueprintDetail>>>,
  seed: string,
  client: SqlExecutor = sqlClient,
): Promise<BlueprintAssemblyPlan> {
  const usedVersionIds: string[] = [];
  const usedStems = new Set<string>();
  const resultSections: BlueprintAssemblyPlan["sections"] = [];
  const shortages: BlueprintAssemblyPlan["shortages"] = [];

  for (const rawSection of detail.sections) {
    const section = storedSection(rawSection as Record<string, unknown>);
    const candidates = await client`
      WITH RECURSIVE descendants(id) AS (
        SELECT unnest(${section.taxonomyNodeIds}::uuid[])
        UNION
        SELECT edge.child_node_id
        FROM catalog.taxonomy_edges edge
        JOIN descendants parent ON parent.id = edge.parent_node_id
      )
      SELECT
        q.id::text AS "questionId",
        v.id::text AS "questionVersionId",
        q.public_code AS "publicCode",
        lower(v.difficulty) AS difficulty,
        v.stem
      FROM content.questions q
      JOIN content.question_versions v ON v.id = q.published_version_id
      WHERE q.status = 'published'::question_status
        AND q.deleted_at IS NULL
        AND v.exam_version_id = ${String(detail.blueprint.examVersionId)}::uuid
        AND lower(v.difficulty) = ANY(${Object.keys(section.difficultyTargets)}::text[])
        AND NOT (v.id = ANY(${usedVersionIds}::uuid[]))
        AND EXISTS (
          SELECT 1
          FROM content.question_taxonomy_links qtl
          JOIN descendants d ON d.id = qtl.taxonomy_node_id
          WHERE qtl.question_version_id = v.id
        )
        AND (
          ${section.languageCode} = 'en'
          OR EXISTS (
            SELECT 1
            FROM content.question_translations qt
            JOIN catalog.languages l ON l.id = qt.language_id
            WHERE qt.question_version_id = v.id
              AND lower(l.code) = ${section.languageCode}
              AND lower(qt.status) = 'approved'
          )
        )
      ORDER BY md5(v.id::text || ${seed} || ${section.sectionKey})
      LIMIT 5000
    `;

    const selected: BlueprintAssemblyQuestion[] = [];
    for (const difficulty of ["easy", "medium", "hard"] as BlueprintDifficulty[]) {
      const requested = section.difficultyTargets[difficulty];
      const eligible = candidates.filter((candidate) => {
        if (String(candidate.difficulty) !== difficulty) return false;
        const stemKey = normalizeStem(candidate.stem);
        return stemKey.length > 0 && !usedStems.has(stemKey);
      });
      const chosen = eligible.slice(0, requested);
      for (const candidate of chosen) {
        const question = {
          questionId: String(candidate.questionId),
          questionVersionId: String(candidate.questionVersionId),
          publicCode: String(candidate.publicCode),
          difficulty: String(candidate.difficulty),
          stem: String(candidate.stem),
        };
        selected.push(question);
        usedVersionIds.push(question.questionVersionId);
        usedStems.add(normalizeStem(question.stem));
      }
      if (chosen.length < requested) {
        shortages.push({
          sectionKey: section.sectionKey,
          sectionName: section.name,
          difficulty,
          requested,
          available: chosen.length,
          missing: requested - chosen.length,
        });
      }
    }

    resultSections.push({
      sectionKey: section.sectionKey,
      name: section.name,
      durationMinutes: section.durationMinutes,
      marks: section.marks,
      negativeMarks: section.negativeMarks,
      questions: selected,
    });
  }

  const requiredCount = detail.sections.reduce((sum, row) => sum + Number(row.questionCount), 0);
  const selectedCount = resultSections.reduce((sum, section) => sum + section.questions.length, 0);
  return {
    seed,
    sections: resultSections,
    shortages,
    selectedCount,
    requiredCount,
    ready: shortages.length === 0 && selectedCount === requiredCount,
  };
}

async function createTestFromPlan(
  client: SqlExecutor,
  detail: NonNullable<Awaited<ReturnType<typeof loadBlueprintDetail>>>,
  plan: BlueprintAssemblyPlan,
  actorUserId: string,
  title: string,
  changeReason: string,
) {
  if (!detail.currentVersion) {
    throw new TestBlueprintError("BLUEPRINT_VERSION_MISSING", "The blueprint has no current version", 409);
  }
  if (!plan.ready) {
    throw new TestBlueprintError(
      "BLUEPRINT_ASSEMBLY_SHORTAGE",
      "Published Question Bank coverage does not satisfy this blueprint",
      409,
      plan,
    );
  }

  const testId = randomUUID();
  const testVersionId = randomUUID();
  const publicCode = testPublicCode(new Date(), testId);
  await client`
    INSERT INTO assessment.tests (
      id, public_code, exam_version_id, status, current_draft_version_id,
      created_by, created_at, updated_at
    ) VALUES (
      ${testId}::uuid,
      ${publicCode},
      ${String(detail.blueprint.examVersionId)}::uuid,
      'draft'::test_status,
      ${testVersionId}::uuid,
      ${actorUserId}::uuid,
      now(),
      now()
    )
  `;
  await client`
    INSERT INTO assessment.test_versions (
      id, test_id, version_number, title, description, duration_seconds,
      total_marks, instructions, settings, change_reason, created_by, created_at
    ) VALUES (
      ${testVersionId}::uuid,
      ${testId}::uuid,
      1,
      ${title},
      ${`Assembled from ${String(detail.blueprint.code)} version ${Number(detail.blueprint.currentVersionNumber)}`},
      ${Number(detail.currentVersion.durationSeconds)},
      ${Number(detail.currentVersion.totalMarks)},
      ${client.json(asRecord(detail.currentVersion.instructions))},
      ${client.json({
        ...asRecord(detail.currentVersion.configuration),
        assembledFromBlueprintId: String(detail.blueprint.id),
        blueprintVersionNumber: Number(detail.blueprint.currentVersionNumber),
        assemblySeed: plan.seed,
      })},
      ${changeReason},
      ${actorUserId}::uuid,
      now()
    )
  `;

  for (let sectionIndex = 0; sectionIndex < plan.sections.length; sectionIndex += 1) {
    const section = plan.sections[sectionIndex]!;
    const sectionId = randomUUID();
    await client`
      INSERT INTO assessment.test_sections (
        id, test_version_id, name, section_key, sort_order, duration_seconds, settings
      ) VALUES (
        ${sectionId}::uuid,
        ${testVersionId}::uuid,
        ${section.name},
        ${section.sectionKey},
        ${sectionIndex + 1},
        ${section.durationMinutes == null ? null : Math.round(section.durationMinutes * 60)},
        ${client.json({ blueprintSectionKey: section.sectionKey })}
      )
    `;
    const marksPerQuestion = section.marks / section.questions.length;
    for (let questionIndex = 0; questionIndex < section.questions.length; questionIndex += 1) {
      const question = section.questions[questionIndex]!;
      await client`
        INSERT INTO assessment.test_questions (
          test_version_id, test_section_id, question_version_id, position,
          marks, negative_marks, settings
        ) VALUES (
          ${testVersionId}::uuid,
          ${sectionId}::uuid,
          ${question.questionVersionId}::uuid,
          ${questionIndex + 1},
          ${marksPerQuestion},
          ${section.negativeMarks},
          ${client.json({ assembledFromBlueprint: true })}
        )
      `;
    }
  }

  await client`
    INSERT INTO platform.audit_events (
      id, actor_type, actor_user_id, action_key, entity_type, entity_id,
      entity_version_id, reason, summary, metadata
    ) VALUES (
      ${randomUUID()}::uuid,
      'user'::audit_actor_type,
      ${actorUserId}::uuid,
      'assessment.test.assembled_from_blueprint',
      'test',
      ${testId}::uuid,
      ${testVersionId}::uuid,
      ${changeReason},
      ${`${publicCode} assembled from ${String(detail.blueprint.code)}`},
      ${client.json({
        blueprintId: detail.blueprint.id,
        blueprintVersionNumber: detail.blueprint.currentVersionNumber,
        seed: plan.seed,
        questionCount: plan.selectedCount,
      })}
    )
  `;
  return { testId, testVersionId, publicCode, title, status: "draft", assembly: plan };
}

router.use(authenticate);

router.get("/catalog", requireAdminPermission("tests.read"), async (_req, res) => {
  try {
    const [examVersions, taxonomyNodes] = await Promise.all([
      sqlClient`
        SELECT
          ev.id::text AS id,
          ev.version_number AS "versionNumber",
          ev.name AS "versionName",
          e.code AS "examCode",
          e.name AS "examName",
          ef.name AS "examFamilyName",
          COALESCE(
            json_agg(
              json_build_object('code', l.code, 'name', l.name, 'nativeName', l.native_name)
              ORDER BY evl.is_primary DESC, l.name
            ) FILTER (WHERE l.id IS NOT NULL),
            '[]'::json
          ) AS languages
        FROM catalog.exam_versions ev
        JOIN catalog.exams e ON e.id = ev.exam_id
        JOIN catalog.exam_families ef ON ef.id = e.family_id
        LEFT JOIN catalog.exam_version_languages evl ON evl.exam_version_id = ev.id
        LEFT JOIN catalog.languages l ON l.id = evl.language_id AND l.is_active = true
        GROUP BY ev.id, e.id, ef.id
        ORDER BY ef.name, e.name, ev.version_number DESC
      `,
      sqlClient`
        SELECT
          tn.id::text AS id,
          tn.code,
          tn.name,
          tn.node_type::text AS "nodeType",
          COALESCE(array_agg(DISTINCT etn.exam_version_id::text) FILTER (WHERE etn.exam_version_id IS NOT NULL), '{}') AS "examVersionIds"
        FROM catalog.taxonomy_nodes tn
        LEFT JOIN catalog.exam_taxonomy_nodes etn
          ON etn.taxonomy_node_id = tn.id
         AND etn.is_active = true
        WHERE tn.is_active = true
        GROUP BY tn.id
        ORDER BY tn.node_type, tn.name
      `,
    ]);
    res.json({ examVersions, taxonomyNodes, generatedAt: new Date().toISOString() });
  } catch (error) {
    sendError(res, error, "Unable to load blueprint catalog");
  }
});

router.get("/", requireAdminPermission("tests.read"), async (_req, res) => {
  try {
    const blueprints = await sqlClient`
      SELECT
        b.id::text AS id,
        b.exam_version_id::text AS "examVersionId",
        b.code,
        b.name,
        b.current_version_number AS "currentVersionNumber",
        b.created_at AS "createdAt",
        b.updated_at AS "updatedAt",
        b.deleted_at AS "deletedAt",
        e.code AS "examCode",
        e.name AS "examName",
        ef.name AS "examFamilyName",
        v.duration_seconds AS "durationSeconds",
        v.total_marks::float8 AS "totalMarks",
        v.created_at AS "versionCreatedAt",
        (SELECT COUNT(*)::int FROM assessment.test_blueprint_sections s WHERE s.blueprint_version_id = v.id) AS "sectionCount",
        (SELECT COALESCE(SUM(s.question_count), 0)::int FROM assessment.test_blueprint_sections s WHERE s.blueprint_version_id = v.id) AS "questionCount"
      FROM assessment.test_blueprints b
      JOIN catalog.exam_versions ev ON ev.id = b.exam_version_id
      JOIN catalog.exams e ON e.id = ev.exam_id
      JOIN catalog.exam_families ef ON ef.id = e.family_id
      LEFT JOIN assessment.test_blueprint_versions v
        ON v.blueprint_id = b.id
       AND v.version_number = b.current_version_number
      ORDER BY (b.deleted_at IS NOT NULL), b.updated_at DESC
      LIMIT 1000
    `;
    res.json({ blueprints, generatedAt: new Date().toISOString() });
  } catch (error) {
    sendError(res, error, "Unable to load test blueprints");
  }
});

router.get("/:id", requireAdminPermission("tests.read"), async (req, res) => {
  try {
    const detail = await loadBlueprintDetail(assertBlueprintId(req.params.id));
    if (!detail) {
      res.status(404).json({ error: "Test blueprint not found", code: "BLUEPRINT_NOT_FOUND" });
      return;
    }
    res.json(detail);
  } catch (error) {
    sendError(res, error, "Unable to load test blueprint");
  }
});

router.post("/", requireAdminPermission("tests.create"), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required" });
      return;
    }
    const input = normalizeBlueprintInput(req.body);
    await assertReferences(sqlClient, input);
    const blueprintId = randomUUID();
    const detail = await sqlClient.begin(async (tx) => {
      await tx`
        INSERT INTO assessment.test_blueprints (
          id, exam_version_id, code, name, current_version_number,
          created_by, created_at, updated_at
        ) VALUES (
          ${blueprintId}::uuid,
          ${input.examVersionId}::uuid,
          ${input.code},
          ${input.name},
          1,
          ${actorUserId}::uuid,
          now(),
          now()
        )
      `;
      const versionId = await insertBlueprintVersion(tx as SqlExecutor, blueprintId, actorUserId, 1, input);
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id,
          entity_version_id, reason, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid,
          'user'::audit_actor_type,
          ${actorUserId}::uuid,
          'assessment.test_blueprint.created',
          'test_blueprint',
          ${blueprintId}::uuid,
          ${versionId}::uuid,
          ${input.changeReason},
          ${`Created blueprint ${input.code}`},
          ${tx.json({ versionNumber: 1, sectionCount: input.sections.length })}
        )
      `;
      return loadBlueprintDetail(blueprintId, tx as SqlExecutor);
    });
    res.status(201).json(detail);
  } catch (error) {
    sendError(res, error, "Unable to create test blueprint");
  }
});

router.put("/:id", requireAdminPermission("tests.update"), async (req, res) => {
  try {
    const blueprintId = assertBlueprintId(req.params.id);
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required" });
      return;
    }
    const input = normalizeBlueprintInput(req.body);
    await assertReferences(sqlClient, input);
    const detail = await sqlClient.begin(async (tx) => {
      const rows = await tx`
        SELECT id::text AS id, code, current_version_number AS "currentVersionNumber", deleted_at AS "deletedAt"
        FROM assessment.test_blueprints
        WHERE id = ${blueprintId}::uuid
        FOR UPDATE
      `;
      const current = rows[0];
      if (!current) throw new TestBlueprintError("BLUEPRINT_NOT_FOUND", "Test blueprint not found", 404);
      if (current.deletedAt) throw new TestBlueprintError("BLUEPRINT_ARCHIVED", "Restore the blueprint before editing", 409);
      if (input.expectedCurrentVersionNumber !== Number(current.currentVersionNumber)) {
        throw new TestBlueprintError(
          "BLUEPRINT_VERSION_CONFLICT",
          "This blueprint changed after you opened it. Refresh before saving.",
          409,
        );
      }
      const nextVersionNumber = Number(current.currentVersionNumber) + 1;
      const versionId = await insertBlueprintVersion(tx as SqlExecutor, blueprintId, actorUserId, nextVersionNumber, input);
      await tx`
        UPDATE assessment.test_blueprints
        SET
          exam_version_id = ${input.examVersionId}::uuid,
          code = ${input.code},
          name = ${input.name},
          current_version_number = ${nextVersionNumber},
          updated_at = now()
        WHERE id = ${blueprintId}::uuid
      `;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id,
          entity_version_id, reason, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid,
          'user'::audit_actor_type,
          ${actorUserId}::uuid,
          'assessment.test_blueprint.version.created',
          'test_blueprint',
          ${blueprintId}::uuid,
          ${versionId}::uuid,
          ${input.changeReason},
          ${`Created blueprint version ${nextVersionNumber} for ${input.code}`},
          ${tx.json({ previousVersionNumber: current.currentVersionNumber, versionNumber: nextVersionNumber })}
        )
      `;
      return loadBlueprintDetail(blueprintId, tx as SqlExecutor);
    });
    res.json(detail);
  } catch (error) {
    sendError(res, error, "Unable to update test blueprint");
  }
});

for (const action of ["archive", "restore"] as const) {
  router.post(`/:id/actions/${action}`, requireAdminPermission("tests.update"), async (req, res) => {
    try {
      const blueprintId = assertBlueprintId(req.params.id);
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) {
        res.status(403).json({ error: "Administrator session required" });
        return;
      }
      const reason = typeof req.body?.reason === "string" ? req.body.reason.trim() : "";
      if (reason.length < 3) {
        throw new TestBlueprintError("BLUEPRINT_ACTION_REASON_REQUIRED", "A reason is required");
      }
      const detail = await sqlClient.begin(async (tx) => {
        const rows = await tx`
          SELECT id::text AS id, code, current_version_number AS "currentVersionNumber", deleted_at AS "deletedAt"
          FROM assessment.test_blueprints
          WHERE id = ${blueprintId}::uuid
          FOR UPDATE
        `;
        const current = rows[0];
        if (!current) throw new TestBlueprintError("BLUEPRINT_NOT_FOUND", "Test blueprint not found", 404);
        if (action === "archive" && current.deletedAt) {
          throw new TestBlueprintError("BLUEPRINT_ALREADY_ARCHIVED", "The blueprint is already archived", 409);
        }
        if (action === "restore" && !current.deletedAt) {
          throw new TestBlueprintError("BLUEPRINT_ALREADY_ACTIVE", "The blueprint is already active", 409);
        }
        await tx`
          UPDATE assessment.test_blueprints
          SET deleted_at = ${action === "archive" ? tx`now()` : null}, updated_at = now()
          WHERE id = ${blueprintId}::uuid
        `;
        await tx`
          INSERT INTO platform.audit_events (
            id, actor_type, actor_user_id, action_key, entity_type, entity_id,
            reason, summary, metadata
          ) VALUES (
            ${randomUUID()}::uuid,
            'user'::audit_actor_type,
            ${actorUserId}::uuid,
            ${`assessment.test_blueprint.${action}d`},
            'test_blueprint',
            ${blueprintId}::uuid,
            ${reason},
            ${`${String(current.code)} ${action}d`},
            ${tx.json({ currentVersionNumber: current.currentVersionNumber })}
          )
        `;
        return loadBlueprintDetail(blueprintId, tx as SqlExecutor);
      });
      res.json(detail);
    } catch (error) {
      sendError(res, error, `Unable to ${action} test blueprint`);
    }
  });
}

router.post("/:id/preview", requireAdminPermission("tests.read"), async (req, res) => {
  try {
    const blueprintId = assertBlueprintId(req.params.id);
    const detail = await loadBlueprintDetail(blueprintId);
    if (!detail) throw new TestBlueprintError("BLUEPRINT_NOT_FOUND", "Test blueprint not found", 404);
    if (detail.blueprint.deletedAt) throw new TestBlueprintError("BLUEPRINT_ARCHIVED", "Restore the blueprint before assembly", 409);
    const seed = typeof req.body?.seed === "string" && req.body.seed.trim()
      ? req.body.seed.trim().slice(0, 120)
      : randomUUID();
    const plan = await buildAssemblyPlan(detail, seed);
    res.json({ blueprint: detail.blueprint, version: detail.currentVersion, plan, generatedAt: new Date().toISOString() });
  } catch (error) {
    sendError(res, error, "Unable to preview blueprint coverage");
  }
});

router.post("/:id/assemble", requireAdminPermission("tests.create"), async (req, res) => {
  try {
    const blueprintId = assertBlueprintId(req.params.id);
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required" });
      return;
    }
    const input = normalizeBlueprintAssemblyInput(req.body);
    const detail = await loadBlueprintDetail(blueprintId);
    if (!detail) throw new TestBlueprintError("BLUEPRINT_NOT_FOUND", "Test blueprint not found", 404);
    if (detail.blueprint.deletedAt) throw new TestBlueprintError("BLUEPRINT_ARCHIVED", "Restore the blueprint before assembly", 409);
    const plan = await buildAssemblyPlan(detail, input.seed);
    if (!plan.ready) {
      throw new TestBlueprintError(
        "BLUEPRINT_ASSEMBLY_SHORTAGE",
        "Published Question Bank coverage does not satisfy this blueprint",
        409,
        plan,
      );
    }
    const result = await sqlClient.begin((tx) => createTestFromPlan(
      tx as SqlExecutor,
      detail,
      plan,
      actorUserId,
      input.title,
      input.changeReason,
    ));
    res.status(201).json(result);
  } catch (error) {
    sendError(res, error, "Unable to assemble test from blueprint");
  }
});

export default router;
