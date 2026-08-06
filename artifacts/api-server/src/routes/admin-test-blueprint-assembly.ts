import { randomUUID } from "node:crypto";
import { Router, type Response } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import {
  selectBlueprintSectionCandidates,
  type BlueprintAssemblyCandidate,
} from "../lib/admin-test-blueprint-assembly";
import {
  TestBlueprintError,
  normalizeBlueprintAssemblyInput,
  type BlueprintAssemblyPlan,
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
  console.error(fallback, error);
  res.status(500).json({ error: fallback });
}

function blueprintId(value: string): string {
  if (!isUuid(value)) throw new TestBlueprintError("INVALID_BLUEPRINT_ID", "Invalid blueprint identifier");
  return value;
}

function storedSection(row: Record<string, unknown>): NormalizedBlueprintSection {
  const rules = asRecord(row.selectionRules);
  const targets = asRecord(rules.difficultyTargets);
  return {
    sectionKey: String(row.sectionKey),
    name: String(row.name),
    questionCount: Number(row.questionCount),
    marks: Number(row.marks),
    durationMinutes: row.durationSeconds == null ? null : Number(row.durationSeconds) / 60,
    taxonomyNodeIds: Array.isArray(rules.taxonomyNodeIds) ? rules.taxonomyNodeIds.map(String) : [],
    difficultyTargets: {
      easy: Number(targets.easy ?? 0),
      medium: Number(targets.medium ?? 0),
      hard: Number(targets.hard ?? 0),
    },
    languageCode: typeof rules.languageCode === "string" ? rules.languageCode : "en",
    negativeMarks: Number(rules.negativeMarks ?? 0),
  };
}

async function loadCurrentBlueprint(id: string, client: SqlExecutor = sqlClient) {
  const rows = await client`
    SELECT
      b.id::text AS id,
      b.exam_version_id::text AS "examVersionId",
      b.code,
      b.name,
      b.current_version_number AS "currentVersionNumber",
      b.deleted_at AS "deletedAt",
      v.id::text AS "versionId",
      v.duration_seconds AS "durationSeconds",
      v.total_marks::float8 AS "totalMarks",
      v.instructions,
      v.configuration
    FROM assessment.test_blueprints b
    JOIN assessment.test_blueprint_versions v
      ON v.blueprint_id = b.id
     AND v.version_number = b.current_version_number
    WHERE b.id = ${id}::uuid
    LIMIT 1
  `;
  const blueprint = rows[0];
  if (!blueprint) return null;
  const sectionRows = await client`
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
    WHERE blueprint_version_id = ${String(blueprint.versionId)}::uuid
    ORDER BY sort_order
  `;
  return {
    blueprint,
    sections: sectionRows.map((row) => storedSection(row as Record<string, unknown>)),
  };
}

async function buildPlan(
  detail: NonNullable<Awaited<ReturnType<typeof loadCurrentBlueprint>>>,
  seed: string,
  client: SqlExecutor = sqlClient,
): Promise<BlueprintAssemblyPlan> {
  const usedQuestionVersionIds = new Set<string>();
  const usedStems = new Set<string>();
  const usedReleasePoolIds = new Set<string>();
  const sections: BlueprintAssemblyPlan["sections"] = [];
  const shortages: BlueprintAssemblyPlan["shortages"] = [];

  for (const section of detail.sections) {
    const rows = await client`
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
        v.stem,
        v.answer_model #>> '{generation,releasePoolId}' AS "releasePoolId",
        v.answer_model #>> '{generation,releaseStatus}' AS "releaseStatus",
        v.answer_model #>> '{generation,authorityId}' AS "authorityId",
        v.answer_model #>> '{generation,taskKind}' AS "taskKind",
        NULLIF(v.answer_model #>> '{correctIndex}', '')::int AS "answerPosition",
        COALESCE(v.answer_model #> '{generation,examSuitability}', '[]'::jsonb) AS "examSuitability"
      FROM content.questions q
      JOIN content.question_versions v ON v.id = q.published_version_id
      WHERE q.status = 'published'::question_status
        AND q.deleted_at IS NULL
        AND v.exam_version_id = ${String(detail.blueprint.examVersionId)}::uuid
        AND lower(v.difficulty) = ANY(${["easy", "medium", "hard"]}::text[])
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
    const candidates: BlueprintAssemblyCandidate[] = rows.map((row) => ({
      questionId: String(row.questionId),
      questionVersionId: String(row.questionVersionId),
      publicCode: String(row.publicCode),
      difficulty: String(row.difficulty),
      stem: String(row.stem),
      releasePoolId: row.releasePoolId ? String(row.releasePoolId) : null,
      releaseStatus: row.releaseStatus ? String(row.releaseStatus) : null,
      authorityId: row.authorityId ? String(row.authorityId) : null,
      taskKind: row.taskKind ? String(row.taskKind) : null,
      answerPosition:
        row.answerPosition == null ? null : Number(row.answerPosition),
      examSuitability: Array.isArray(row.examSuitability)
        ? row.examSuitability.map(String)
        : [],
    }));
    const selected = selectBlueprintSectionCandidates({
      section,
      candidates,
      usedQuestionVersionIds,
      usedStems,
      usedReleasePoolIds,
    });
    shortages.push(...selected.shortages);
    sections.push({
      sectionKey: section.sectionKey,
      name: section.name,
      durationMinutes: section.durationMinutes,
      marks: section.marks,
      negativeMarks: section.negativeMarks,
      questions: selected.selected,
    });
  }

  const requiredCount = detail.sections.reduce((sum, section) => sum + section.questionCount, 0);
  const selectedCount = sections.reduce((sum, section) => sum + section.questions.length, 0);
  return {
    seed,
    sections,
    shortages,
    selectedCount,
    requiredCount,
    ready: shortages.length === 0 && selectedCount === requiredCount,
  };
}

async function createDraft(
  client: SqlExecutor,
  detail: NonNullable<Awaited<ReturnType<typeof loadCurrentBlueprint>>>,
  plan: BlueprintAssemblyPlan,
  actorUserId: string,
  title: string,
  changeReason: string,
) {
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
      id, public_code, exam_version_id, blueprint_version_id, status,
      created_by, created_at, updated_at
    ) VALUES (
      ${testId}::uuid,
      ${publicCode},
      ${String(detail.blueprint.examVersionId)}::uuid,
      ${String(detail.blueprint.versionId)}::uuid,
      'draft'::test_status,
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
      ${Number(detail.blueprint.durationSeconds)},
      ${Number(detail.blueprint.totalMarks)},
      ${client.json(asRecord(detail.blueprint.instructions))},
      ${client.json({
        ...asRecord(detail.blueprint.configuration),
        assembledFromBlueprintId: String(detail.blueprint.id),
        blueprintVersionId: String(detail.blueprint.versionId),
        blueprintVersionNumber: Number(detail.blueprint.currentVersionNumber),
        assemblySeed: plan.seed,
      })},
      ${changeReason},
      ${actorUserId}::uuid,
      now()
    )
  `;
  await client`
    UPDATE assessment.tests
    SET current_draft_version_id = ${testVersionId}::uuid, updated_at = now()
    WHERE id = ${testId}::uuid
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
        blueprintVersionId: detail.blueprint.versionId,
        blueprintVersionNumber: detail.blueprint.currentVersionNumber,
        seed: plan.seed,
        questionCount: plan.selectedCount,
      })}
    )
  `;
  return { testId, testVersionId, publicCode, title, status: "draft", assembly: plan };
}

router.use(authenticate);

router.post("/:id/preview", requireAdminPermission("tests.read"), async (req, res) => {
  try {
    const id = blueprintId(req.params.id);
    const detail = await loadCurrentBlueprint(id);
    if (!detail) throw new TestBlueprintError("BLUEPRINT_NOT_FOUND", "Test blueprint not found", 404);
    if (detail.blueprint.deletedAt) throw new TestBlueprintError("BLUEPRINT_ARCHIVED", "Restore the blueprint before assembly", 409);
    const seed = typeof req.body?.seed === "string" && req.body.seed.trim()
      ? req.body.seed.trim().slice(0, 120)
      : randomUUID();
    const plan = await buildPlan(detail, seed);
    res.json({ blueprint: detail.blueprint, plan, generatedAt: new Date().toISOString() });
  } catch (error) {
    sendError(res, error, "Unable to preview blueprint coverage");
  }
});

router.post("/:id/assemble", requireAdminPermission("tests.create"), async (req, res) => {
  try {
    const id = blueprintId(req.params.id);
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required" });
      return;
    }
    const input = normalizeBlueprintAssemblyInput(req.body);
    const detail = await loadCurrentBlueprint(id);
    if (!detail) throw new TestBlueprintError("BLUEPRINT_NOT_FOUND", "Test blueprint not found", 404);
    if (detail.blueprint.deletedAt) throw new TestBlueprintError("BLUEPRINT_ARCHIVED", "Restore the blueprint before assembly", 409);
    const plan = await buildPlan(detail, input.seed);
    if (!plan.ready) {
      throw new TestBlueprintError(
        "BLUEPRINT_ASSEMBLY_SHORTAGE",
        "Published Question Bank coverage does not satisfy this blueprint",
        409,
        plan,
      );
    }
    const result = await sqlClient.begin((tx) => createDraft(
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
