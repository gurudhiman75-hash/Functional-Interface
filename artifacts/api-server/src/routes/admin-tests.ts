import { randomUUID } from "node:crypto";
import { Router, type Response } from "express";

import { requireAdminPermission } from "../lib/admin-rbac";
import {
  TestManagementError,
  getTestLifecycleConfig,
  isUuid,
  normalizeTestDraftInput,
  normalizeTestLifecycleInput,
  testPublicCode,
  validateTestDraftShape,
  type NormalizedTestDraftInput,
  type TestValidationIssue,
} from "../lib/admin-test-management";
import { sqlClient } from "../lib/db";
import { authenticate } from "../middlewares/auth";

const router = Router();
type SqlExecutor = typeof sqlClient;

function sendTestError(res: Response, error: unknown, fallback: string): void {
  if (error instanceof TestManagementError) {
    res.status(error.statusCode).json({ error: error.message, code: error.code, details: error.details });
    return;
  }
  console.error(fallback, error);
  res.status(500).json({ error: fallback });
}

function assertTestId(value: string): string {
  if (!isUuid(value)) {
    throw new TestManagementError("INVALID_TEST_ID", "Invalid test identifier", 400);
  }
  return value;
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function languageCodeFromSettings(value: unknown): string {
  const settings = asRecord(value);
  const code = typeof settings.languageCode === "string" ? settings.languageCode.trim().toLowerCase() : "en";
  return code || "en";
}

async function validatePublishedSelections(
  client: SqlExecutor,
  input: NormalizedTestDraftInput,
): Promise<TestValidationIssue[]> {
  const issues = validateTestDraftShape(input);
  const questionVersionIds = input.sections.flatMap((section) => section.questions.map((question) => question.questionVersionId));
  if (questionVersionIds.length === 0) return issues;

  const rows = await client`
    WITH requested AS (
      SELECT value::uuid AS id
      FROM jsonb_array_elements_text(${client.json(questionVersionIds)}::jsonb)
    )
    SELECT
      r.id::text AS id,
      v.exam_version_id::text AS "examVersionId",
      q.status::text AS status,
      q.published_version_id::text AS "publishedVersionId",
      EXISTS (
        SELECT 1
        FROM content.question_taxonomy_links qtl
        WHERE qtl.question_version_id = v.id
      ) AS "hasTaxonomy"
    FROM requested r
    LEFT JOIN content.question_versions v ON v.id = r.id
    LEFT JOIN content.questions q ON q.id = v.question_id
  `;

  const found = new Map(rows.map((row) => [String(row.id), row]));
  for (const questionVersionId of questionVersionIds) {
    const row = found.get(questionVersionId);
    if (!row || !row.examVersionId) {
      issues.push({ code: "QUESTION_VERSION_MISSING", message: `Question version ${questionVersionId} does not exist` });
      continue;
    }
    if (String(row.publishedVersionId ?? "") !== questionVersionId || String(row.status) !== "published") {
      issues.push({ code: "QUESTION_NOT_PUBLISHED", message: `Question version ${questionVersionId} is not currently published` });
    }
    if (String(row.examVersionId) !== input.examVersionId) {
      issues.push({ code: "QUESTION_EXAM_MISMATCH", message: `Question version ${questionVersionId} belongs to a different exam version` });
    }
    if (!row.hasTaxonomy) {
      issues.push({ code: "QUESTION_TAXONOMY_MISSING", message: `Question version ${questionVersionId} has incomplete taxonomy` });
    }
  }

  const languageCode = languageCodeFromSettings(input.settings);
  if (languageCode !== "en") {
    const translationRows = await client`
      WITH requested AS (
        SELECT value::uuid AS id
        FROM jsonb_array_elements_text(${client.json(questionVersionIds)}::jsonb)
      )
      SELECT r.id::text AS id,
        EXISTS (
          SELECT 1
          FROM content.question_translations qt
          JOIN catalog.languages l ON l.id = qt.language_id
          WHERE qt.question_version_id = r.id
            AND lower(l.code) = ${languageCode}
            AND lower(qt.status) = 'approved'
        ) AS "hasApprovedTranslation"
      FROM requested r
    `;
    for (const row of translationRows) {
      if (!row.hasApprovedTranslation) {
        issues.push({
          code: "QUESTION_TRANSLATION_MISSING",
          message: `Question version ${String(row.id)} has no approved ${languageCode} translation`,
        });
      }
    }
  }
  return issues;
}

async function loadStoredValidation(
  testId: string,
  testVersionId: string,
  client: SqlExecutor = sqlClient,
): Promise<TestValidationIssue[]> {
  const versionRows = await client`
    SELECT
      t.exam_version_id::text AS "examVersionId",
      v.title,
      v.description,
      (v.duration_seconds::numeric / 60)::float8 AS "durationMinutes",
      v.total_marks::float8 AS "totalMarks",
      v.instructions,
      v.settings
    FROM assessment.tests t
    JOIN assessment.test_versions v ON v.id = ${testVersionId}::uuid
    WHERE t.id = ${testId}::uuid
      AND v.test_id = t.id
      AND t.deleted_at IS NULL
  `;
  if (versionRows.length === 0) {
    return [{ code: "TEST_VERSION_MISSING", message: "The current test version is missing" }];
  }

  const sectionRows = await client`
    SELECT
      s.section_key AS "clientKey",
      s.name,
      CASE WHEN s.duration_seconds IS NULL THEN NULL ELSE (s.duration_seconds::numeric / 60)::float8 END AS "durationMinutes",
      s.settings,
      COALESCE(
        json_agg(
          json_build_object(
            'questionVersionId', tq.question_version_id,
            'marks', tq.marks::float8,
            'negativeMarks', tq.negative_marks::float8,
            'settings', tq.settings
          ) ORDER BY tq.position
        ) FILTER (WHERE tq.question_version_id IS NOT NULL),
        '[]'::json
      ) AS questions
    FROM assessment.test_sections s
    LEFT JOIN assessment.test_questions tq ON tq.test_section_id = s.id
    WHERE s.test_version_id = ${testVersionId}::uuid
    GROUP BY s.id
    ORDER BY s.sort_order
  `;

  const row = versionRows[0];
  const normalized: NormalizedTestDraftInput = {
    expectedCurrentDraftVersionId: testVersionId,
    examVersionId: String(row.examVersionId),
    title: String(row.title),
    description: String(row.description ?? ""),
    durationMinutes: Number(row.durationMinutes),
    totalMarks: Number(row.totalMarks),
    instructions: asRecord(row.instructions),
    settings: asRecord(row.settings),
    changeReason: "Stored validation",
    sections: sectionRows.map((section) => ({
      clientKey: String(section.clientKey),
      name: String(section.name),
      durationMinutes: section.durationMinutes == null ? null : Number(section.durationMinutes),
      settings: asRecord(section.settings),
      questions: (Array.isArray(section.questions) ? section.questions : []).map((question: unknown) => {
        const item = asRecord(question);
        return {
          questionVersionId: String(item.questionVersionId),
          marks: Number(item.marks),
          negativeMarks: Number(item.negativeMarks),
          settings: asRecord(item.settings),
        };
      }),
    })),
  };
  return validatePublishedSelections(client, normalized);
}

async function insertTestVersion(
  client: SqlExecutor,
  testId: string,
  actorUserId: string,
  input: NormalizedTestDraftInput,
  versionNumber: number,
): Promise<string> {
  const versionId = randomUUID();
  await client`
    INSERT INTO assessment.test_versions (
      id, test_id, version_number, title, description, duration_seconds, total_marks,
      instructions, settings, change_reason, created_by, created_at
    ) VALUES (
      ${versionId}::uuid,
      ${testId}::uuid,
      ${versionNumber},
      ${input.title},
      ${input.description || null},
      ${Math.round(input.durationMinutes * 60)},
      ${input.totalMarks},
      ${client.json(input.instructions)},
      ${client.json(input.settings)},
      ${input.changeReason},
      ${actorUserId}::uuid,
      now()
    )
  `;

  for (let sectionIndex = 0; sectionIndex < input.sections.length; sectionIndex += 1) {
    const section = input.sections[sectionIndex];
    const sectionId = randomUUID();
    await client`
      INSERT INTO assessment.test_sections (
        id, test_version_id, name, section_key, sort_order, duration_seconds, settings
      ) VALUES (
        ${sectionId}::uuid,
        ${versionId}::uuid,
        ${section.name},
        ${section.clientKey},
        ${sectionIndex + 1},
        ${section.durationMinutes == null ? null : Math.round(section.durationMinutes * 60)},
        ${client.json(section.settings)}
      )
    `;

    for (let questionIndex = 0; questionIndex < section.questions.length; questionIndex += 1) {
      const question = section.questions[questionIndex];
      await client`
        INSERT INTO assessment.test_questions (
          test_version_id, test_section_id, question_version_id, position, marks, negative_marks, settings
        ) VALUES (
          ${versionId}::uuid,
          ${sectionId}::uuid,
          ${question.questionVersionId}::uuid,
          ${questionIndex + 1},
          ${question.marks},
          ${question.negativeMarks},
          ${client.json(question.settings)}
        )
      `;
    }
  }
  return versionId;
}

async function loadTestDetail(testId: string, client: SqlExecutor = sqlClient) {
  const testRows = await client`
    SELECT
      t.id::text AS id,
      t.public_code AS "publicCode",
      t.status::text AS status,
      t.exam_version_id::text AS "examVersionId",
      t.current_draft_version_id::text AS "currentDraftVersionId",
      t.published_version_id::text AS "publishedVersionId",
      t.created_by::text AS "createdBy",
      t.created_at AS "createdAt",
      t.updated_at AS "updatedAt",
      e.id::text AS "examId",
      e.code AS "examCode",
      e.name AS "examName",
      ef.id::text AS "examFamilyId",
      ef.code AS "examFamilyCode",
      ef.name AS "examFamilyName"
    FROM assessment.tests t
    JOIN catalog.exam_versions ev ON ev.id = t.exam_version_id
    JOIN catalog.exams e ON e.id = ev.exam_id
    JOIN catalog.exam_families ef ON ef.id = e.family_id
    WHERE t.id = ${testId}::uuid
      AND t.deleted_at IS NULL
    LIMIT 1
  `;
  if (testRows.length === 0) return null;
  const testRecord = testRows[0];
  const currentDraftVersionId = String(testRecord.currentDraftVersionId ?? "");

  const versions = await client`
    SELECT
      v.id::text AS id,
      v.version_number AS "versionNumber",
      v.title,
      v.description,
      v.duration_seconds AS "durationSeconds",
      v.total_marks::float8 AS "totalMarks",
      v.instructions,
      v.settings,
      v.change_reason AS "changeReason",
      v.created_by::text AS "createdBy",
      v.created_at AS "createdAt",
      (SELECT COUNT(*)::int FROM assessment.test_sections s WHERE s.test_version_id = v.id) AS "sectionCount",
      (SELECT COUNT(*)::int FROM assessment.test_questions tq WHERE tq.test_version_id = v.id) AS "questionCount"
    FROM assessment.test_versions v
    WHERE v.test_id = ${testId}::uuid
    ORDER BY v.version_number DESC
  `;

  const sections = currentDraftVersionId
    ? await client`
        SELECT
          s.id::text AS id,
          s.name,
          s.section_key AS "sectionKey",
          s.sort_order AS "sortOrder",
          s.duration_seconds AS "durationSeconds",
          s.settings
        FROM assessment.test_sections s
        WHERE s.test_version_id = ${currentDraftVersionId}::uuid
        ORDER BY s.sort_order
      `
    : [];

  const questionRows = currentDraftVersionId
    ? await client`
        SELECT
          tq.test_section_id::text AS "testSectionId",
          tq.question_version_id::text AS "questionVersionId",
          tq.position,
          tq.marks::float8 AS marks,
          tq.negative_marks::float8 AS "negativeMarks",
          tq.settings,
          q.id::text AS "questionId",
          q.public_code AS "publicCode",
          v.question_type AS "questionType",
          v.difficulty,
          v.stem,
          v.explanation,
          v.answer_model AS "answerModel",
          COALESCE(
            json_agg(
              json_build_object(
                'id', o.id,
                'key', o.option_key,
                'text', o.text,
                'sortOrder', o.sort_order,
                'isCorrect', o.is_correct
              ) ORDER BY o.sort_order
            ) FILTER (WHERE o.id IS NOT NULL),
            '[]'::json
          ) AS options
        FROM assessment.test_questions tq
        JOIN content.question_versions v ON v.id = tq.question_version_id
        JOIN content.questions q ON q.id = v.question_id
        LEFT JOIN content.question_options o ON o.question_version_id = v.id
        WHERE tq.test_version_id = ${currentDraftVersionId}::uuid
        GROUP BY tq.test_version_id, tq.test_section_id, tq.question_version_id, tq.position,
          tq.marks, tq.negative_marks, tq.settings, q.id, v.id
        ORDER BY tq.test_section_id, tq.position
      `
    : [];

  const questionsBySection = new Map<string, unknown[]>();
  for (const question of questionRows) {
    const key = String(question.testSectionId);
    const list = questionsBySection.get(key) ?? [];
    list.push(question);
    questionsBySection.set(key, list);
  }

  const publications = await client`
    SELECT
      id::text AS id,
      test_version_id::text AS "testVersionId",
      publication_number AS "publicationNumber",
      scheduled_at AS "scheduledAt",
      published_at AS "publishedAt",
      closes_at AS "closesAt",
      published_by::text AS "publishedBy",
      settings_snapshot AS "settingsSnapshot"
    FROM assessment.test_publications
    WHERE test_id = ${testId}::uuid
    ORDER BY publication_number DESC
  `;

  const auditEvents = await client`
    SELECT
      id::text AS id,
      occurred_at AS "occurredAt",
      actor_user_id::text AS "actorUserId",
      action_key AS "actionKey",
      entity_version_id::text AS "entityVersionId",
      reason,
      summary,
      metadata
    FROM platform.audit_events
    WHERE entity_type = 'test'
      AND entity_id = ${testId}::uuid
    ORDER BY occurred_at DESC
    LIMIT 100
  `;

  const validationIssues = currentDraftVersionId
    ? await loadStoredValidation(testId, currentDraftVersionId, client)
    : [{ code: "TEST_VERSION_MISSING", message: "The test has no draft version" }];

  return {
    test: testRecord,
    versions,
    currentVersion: versions.find((version) => String(version.id) === currentDraftVersionId) ?? null,
    sections: sections.map((section) => ({
      ...section,
      questions: questionsBySection.get(String(section.id)) ?? [],
    })),
    publications,
    auditEvents,
    validationIssues,
    generatedAt: new Date().toISOString(),
  };
}

router.use(authenticate);

router.get("/catalog", requireAdminPermission("tests.read"), async (_req, res) => {
  try {
    const examVersions = await sqlClient`
      SELECT
        ev.id::text AS id,
        ev.version_number AS "versionNumber",
        ev.name AS "versionName",
        e.id::text AS "examId",
        e.code AS "examCode",
        e.name AS "examName",
        ef.id::text AS "familyId",
        ef.code AS "familyCode",
        ef.name AS "familyName",
        COALESCE(
          json_agg(
            json_build_object(
              'id', l.id,
              'code', l.code,
              'name', l.name,
              'nativeName', l.native_name,
              'isPrimary', evl.is_primary
            ) ORDER BY evl.is_primary DESC, l.name
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
    `;
    res.json({ examVersions, generatedAt: new Date().toISOString() });
  } catch (error) {
    sendTestError(res, error, "Unable to load Test Builder catalog");
  }
});

router.get("/", requireAdminPermission("tests.read"), async (_req, res) => {
  try {
    const tests = await sqlClient`
      SELECT
        t.id::text AS id,
        t.public_code AS "publicCode",
        t.status::text AS status,
        t.exam_version_id::text AS "examVersionId",
        t.current_draft_version_id::text AS "currentDraftVersionId",
        t.published_version_id::text AS "publishedVersionId",
        t.created_at AS "createdAt",
        t.updated_at AS "updatedAt",
        e.code AS "examCode",
        e.name AS "examName",
        ef.name AS "examFamilyName",
        v.version_number AS "versionNumber",
        v.title,
        v.description,
        v.duration_seconds AS "durationSeconds",
        v.total_marks::float8 AS "totalMarks",
        v.settings,
        (SELECT COUNT(*)::int FROM assessment.test_sections s WHERE s.test_version_id = v.id) AS "sectionCount",
        (SELECT COUNT(*)::int FROM assessment.test_questions tq WHERE tq.test_version_id = v.id) AS "questionCount",
        publication.scheduled_at AS "scheduledAt",
        publication.published_at AS "publishedAt"
      FROM assessment.tests t
      JOIN catalog.exam_versions ev ON ev.id = t.exam_version_id
      JOIN catalog.exams e ON e.id = ev.exam_id
      JOIN catalog.exam_families ef ON ef.id = e.family_id
      LEFT JOIN assessment.test_versions v ON v.id = t.current_draft_version_id
      LEFT JOIN LATERAL (
        SELECT scheduled_at, published_at
        FROM assessment.test_publications p
        WHERE p.test_id = t.id
        ORDER BY publication_number DESC
        LIMIT 1
      ) publication ON true
      WHERE t.deleted_at IS NULL
      ORDER BY t.updated_at DESC
      LIMIT 1000
    `;
    res.json({ tests, generatedAt: new Date().toISOString() });
  } catch (error) {
    sendTestError(res, error, "Unable to load tests");
  }
});

router.post("/auto-assemble", requireAdminPermission("tests.create"), async (req, res) => {
  try {
    const body = asRecord(req.body);
    const examVersionId = typeof body.examVersionId === "string" && isUuid(body.examVersionId)
      ? body.examVersionId
      : "";
    const questionCount = Math.min(300, Math.max(1, Number(body.questionCount ?? 1)));
    const seed = typeof body.seed === "string" ? body.seed.slice(0, 100) : String(Date.now());
    if (!examVersionId) {
      throw new TestManagementError("INVALID_EXAM_VERSION", "Select an exam version before auto-assembly");
    }
    const difficulties = Array.isArray(body.difficulties)
      ? body.difficulties.map((value) => String(value).toLowerCase())
      : [];

    const rows = await sqlClient`
      SELECT
        q.id::text AS id,
        q.public_code AS "publicCode",
        q.published_version_id::text AS "questionVersionId",
        v.difficulty,
        v.stem
      FROM content.questions q
      JOIN content.question_versions v ON v.id = q.published_version_id
      WHERE q.status = 'published'::question_status
        AND q.deleted_at IS NULL
        AND v.exam_version_id = ${examVersionId}::uuid
        AND EXISTS (
          SELECT 1 FROM content.question_taxonomy_links qtl WHERE qtl.question_version_id = v.id
        )
      ORDER BY md5(v.id::text || ${seed})
      LIMIT 1000
    `;
    const matching = difficulties.length === 0
      ? rows
      : rows.filter((row) => difficulties.includes(String(row.difficulty).toLowerCase()));
    res.json({
      questions: matching.slice(0, questionCount),
      requestedCount: questionCount,
      selectedCount: Math.min(questionCount, matching.length),
      shortages: matching.length < questionCount
        ? [`Only ${matching.length} published questions matched the selected exam and difficulty filters.`]
        : [],
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    sendTestError(res, error, "Unable to auto-assemble test questions");
  }
});

router.get("/:id", requireAdminPermission("tests.read"), async (req, res) => {
  try {
    const testId = assertTestId(req.params.id);
    const detail = await loadTestDetail(testId);
    if (!detail) {
      res.status(404).json({ error: "Test not found", code: "TEST_NOT_FOUND" });
      return;
    }
    res.json(detail);
  } catch (error) {
    sendTestError(res, error, "Unable to load test detail");
  }
});

router.post("/", requireAdminPermission("tests.create"), async (req, res) => {
  try {
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required" });
      return;
    }
    const input = normalizeTestDraftInput(req.body);
    const issues = await validatePublishedSelections(sqlClient, input);
    if (issues.length > 0) {
      throw new TestManagementError("TEST_VALIDATION_FAILED", "The test draft has validation issues", 409, issues);
    }

    const testId = randomUUID();
    const publicCode = testPublicCode(new Date(), testId);
    const detail = await sqlClient.begin(async (tx) => {
      await tx`
        INSERT INTO assessment.tests (
          id, public_code, exam_version_id, status, created_by, created_at, updated_at
        ) VALUES (
          ${testId}::uuid,
          ${publicCode},
          ${input.examVersionId}::uuid,
          'draft'::test_status,
          ${actorUserId}::uuid,
          now(),
          now()
        )
      `;
      const versionId = await insertTestVersion(tx as SqlExecutor, testId, actorUserId, input, 1);
      await tx`
        UPDATE assessment.tests
        SET current_draft_version_id = ${versionId}::uuid, updated_at = now()
        WHERE id = ${testId}::uuid
      `;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id,
          entity_version_id, reason, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid,
          'user'::audit_actor_type,
          ${actorUserId}::uuid,
          'assessment.test.created',
          'test',
          ${testId}::uuid,
          ${versionId}::uuid,
          ${input.changeReason},
          ${`Created ${publicCode}`},
          ${tx.json({ versionNumber: 1, title: input.title })}
        )
      `;
      return loadTestDetail(testId, tx as SqlExecutor);
    });
    res.status(201).json(detail);
  } catch (error) {
    sendTestError(res, error, "Unable to create test");
  }
});

router.put("/:id/draft", requireAdminPermission("tests.update"), async (req, res) => {
  try {
    const testId = assertTestId(req.params.id);
    const actorUserId = req.adminSession?.user.id;
    if (!actorUserId) {
      res.status(403).json({ error: "Administrator session required" });
      return;
    }
    const input = normalizeTestDraftInput(req.body);
    const issues = await validatePublishedSelections(sqlClient, input);
    if (issues.length > 0) {
      throw new TestManagementError("TEST_VALIDATION_FAILED", "The test draft has validation issues", 409, issues);
    }

    const detail = await sqlClient.begin(async (tx) => {
      const rows = await tx`
        SELECT
          id::text AS id,
          public_code AS "publicCode",
          status::text AS status,
          current_draft_version_id::text AS "currentDraftVersionId"
        FROM assessment.tests
        WHERE id = ${testId}::uuid
          AND deleted_at IS NULL
        FOR UPDATE
      `;
      const testRecord = rows[0];
      if (!testRecord) {
        throw new TestManagementError("TEST_NOT_FOUND", "Test not found", 404);
      }
      if (String(testRecord.status) === "archived") {
        throw new TestManagementError("TEST_ARCHIVED", "Restore the test before editing", 409);
      }
      if (String(testRecord.currentDraftVersionId ?? "") !== String(input.expectedCurrentDraftVersionId ?? "")) {
        throw new TestManagementError(
          "TEST_VERSION_CONFLICT",
          "This test changed after you opened it. Refresh before saving.",
          409,
        );
      }

      const versionRows = await tx`
        SELECT COALESCE(MAX(version_number), 0)::int + 1 AS "nextVersionNumber"
        FROM assessment.test_versions
        WHERE test_id = ${testId}::uuid
      `;
      const nextVersionNumber = Number(versionRows[0]?.nextVersionNumber ?? 1);
      const versionId = await insertTestVersion(tx as SqlExecutor, testId, actorUserId, input, nextVersionNumber);
      await tx`
        UPDATE assessment.tests
        SET
          exam_version_id = ${input.examVersionId}::uuid,
          current_draft_version_id = ${versionId}::uuid,
          status = 'draft'::test_status,
          updated_at = now()
        WHERE id = ${testId}::uuid
      `;
      await tx`
        INSERT INTO platform.audit_events (
          id, actor_type, actor_user_id, action_key, entity_type, entity_id,
          entity_version_id, reason, summary, metadata
        ) VALUES (
          ${randomUUID()}::uuid,
          'user'::audit_actor_type,
          ${actorUserId}::uuid,
          'assessment.test.version.created',
          'test',
          ${testId}::uuid,
          ${versionId}::uuid,
          ${input.changeReason},
          ${`Created version ${nextVersionNumber} for ${String(testRecord.publicCode)}`},
          ${tx.json({ previousVersionId: testRecord.currentDraftVersionId, versionNumber: nextVersionNumber })}
        )
      `;
      return loadTestDetail(testId, tx as SqlExecutor);
    });
    res.json(detail);
  } catch (error) {
    sendTestError(res, error, "Unable to save test draft");
  }
});

function allowedLifecycleStatuses(action: string): string[] {
  if (action === "submit-qa") return ["draft", "needs_fix", "content_ready"];
  if (action === "needs-fix") return ["under_qa", "qa_approved", "scheduled"];
  if (action === "approve") return ["under_qa"];
  if (action === "schedule") return ["qa_approved", "scheduled"];
  if (action === "publish") return ["qa_approved", "scheduled", "live"];
  if (action === "archive") return ["draft", "content_ready", "under_qa", "needs_fix", "qa_approved", "scheduled", "live", "completed"];
  if (action === "restore-draft") return ["archived", "needs_fix"];
  return [];
}

for (const action of ["submit-qa", "needs-fix", "approve", "schedule", "publish", "archive", "restore-draft"] as const) {
  const config = getTestLifecycleConfig(action);
  router.post(`/:id/actions/${action}`, requireAdminPermission(config.permission), async (req, res) => {
    try {
      const testId = assertTestId(req.params.id);
      const actorUserId = req.adminSession?.user.id;
      if (!actorUserId) {
        res.status(403).json({ error: "Administrator session required" });
        return;
      }
      const input = normalizeTestLifecycleInput(action, req.body);

      const detail = await sqlClient.begin(async (tx) => {
        const rows = await tx`
          SELECT
            id::text AS id,
            public_code AS "publicCode",
            status::text AS status,
            current_draft_version_id::text AS "currentDraftVersionId",
            published_version_id::text AS "publishedVersionId"
          FROM assessment.tests
          WHERE id = ${testId}::uuid
            AND deleted_at IS NULL
          FOR UPDATE
        `;
        const testRecord = rows[0];
        if (!testRecord) {
          throw new TestManagementError("TEST_NOT_FOUND", "Test not found", 404);
        }
        if (String(testRecord.currentDraftVersionId ?? "") !== input.expectedCurrentDraftVersionId) {
          throw new TestManagementError(
            "TEST_VERSION_CONFLICT",
            "This test changed after you opened it. Refresh before continuing.",
            409,
          );
        }
        if (!allowedLifecycleStatuses(action).includes(String(testRecord.status))) {
          throw new TestManagementError(
            "INVALID_TEST_STATUS_TRANSITION",
            `Cannot ${action.replace(/-/g, " ")} a test from ${String(testRecord.status)}`,
            409,
          );
        }

        if (["submit-qa", "approve", "schedule", "publish"].includes(action)) {
          const issues = await loadStoredValidation(testId, input.expectedCurrentDraftVersionId, tx as SqlExecutor);
          if (issues.length > 0) {
            throw new TestManagementError("TEST_VALIDATION_FAILED", "Resolve validation issues before continuing", 409, issues);
          }
        }

        if (action === "schedule") {
          const numberRows = await tx`
            SELECT COALESCE(MAX(publication_number), 0)::int + 1 AS "nextPublicationNumber"
            FROM assessment.test_publications
            WHERE test_id = ${testId}::uuid
          `;
          const publicationNumber = Number(numberRows[0]?.nextPublicationNumber ?? 1);
          await tx`
            INSERT INTO assessment.test_publications (
              id, test_id, test_version_id, publication_number, scheduled_at,
              published_at, closes_at, published_by, settings_snapshot
            ) VALUES (
              ${randomUUID()}::uuid,
              ${testId}::uuid,
              ${input.expectedCurrentDraftVersionId}::uuid,
              ${publicationNumber},
              ${input.scheduledAt}::timestamptz,
              NULL,
              ${input.closesAt}::timestamptz,
              ${actorUserId}::uuid,
              ${tx.json({ status: "scheduled" })}
            )
          `;
        }

        if (action === "publish") {
          const numberRows = await tx`
            SELECT COALESCE(MAX(publication_number), 0)::int + 1 AS "nextPublicationNumber"
            FROM assessment.test_publications
            WHERE test_id = ${testId}::uuid
          `;
          const publicationNumber = Number(numberRows[0]?.nextPublicationNumber ?? 1);
          await tx`
            INSERT INTO assessment.test_publications (
              id, test_id, test_version_id, publication_number, scheduled_at,
              published_at, closes_at, published_by, settings_snapshot
            ) VALUES (
              ${randomUUID()}::uuid,
              ${testId}::uuid,
              ${input.expectedCurrentDraftVersionId}::uuid,
              ${publicationNumber},
              NULL,
              now(),
              ${input.closesAt}::timestamptz,
              ${actorUserId}::uuid,
              ${tx.json({ status: "live" })}
            )
          `;
          await tx`
            UPDATE assessment.tests
            SET
              status = 'live'::test_status,
              published_version_id = ${input.expectedCurrentDraftVersionId}::uuid,
              updated_at = now()
            WHERE id = ${testId}::uuid
          `;
        } else {
          await tx`
            UPDATE assessment.tests
            SET status = ${input.config.status}::test_status, updated_at = now()
            WHERE id = ${testId}::uuid
          `;
        }

        await tx`
          INSERT INTO platform.audit_events (
            id, actor_type, actor_user_id, action_key, entity_type, entity_id,
            entity_version_id, reason, summary, metadata
          ) VALUES (
            ${randomUUID()}::uuid,
            'user'::audit_actor_type,
            ${actorUserId}::uuid,
            ${input.config.actionKey},
            'test',
            ${testId}::uuid,
            ${input.expectedCurrentDraftVersionId}::uuid,
            ${input.reason || null},
            ${`${String(testRecord.publicCode)} moved from ${String(testRecord.status)} to ${input.config.status}`},
            ${tx.json({
              previousStatus: testRecord.status,
              status: input.config.status,
              scheduledAt: input.scheduledAt,
              closesAt: input.closesAt,
            })}
          )
        `;
        return loadTestDetail(testId, tx as SqlExecutor);
      });
      res.json(detail);
    } catch (error) {
      sendTestError(res, error, "Unable to update test lifecycle");
    }
  });
}

export default router;
