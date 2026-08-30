import { randomUUID } from "node:crypto";

import type { QuestionSqlExecutor } from "./admin-question-conversion";
import { QuestionManagementError } from "./admin-question-management";
import { BTD_CP014_TEST_PROJECTION_MATERIALIZATION_VERSION } from "../quant-v4/topics/Arithmetic/subtopics/Bankers-True-Discount/BTD-001/BTD-CP-014/btd-cp014-test-projection-materialization-v1";
import { BTD_CP015_SCORED_TEST_ELIGIBILITY_VERSION } from "../quant-v4/topics/Arithmetic/subtopics/Bankers-True-Discount/BTD-001/BTD-CP-015/btd-cp015-scored-test-eligibility-v1";
import {
  BTD_CP017_MOCK_TEST_ELIGIBILITY_BOUNDARY,
  BTD_CP017_MOCK_TEST_ELIGIBILITY_VERSION,
} from "../quant-v4/topics/Arithmetic/subtopics/Bankers-True-Discount/BTD-001/BTD-CP-017/btd-cp017-mock-test-eligibility-v1";

type JsonRecord = Record<string, unknown>;

export type BtdCp017MockEligibilityResult = Readonly<{
  questionId: string;
  questionVersionId: string;
  publicCode: string;
  projectionBundleKey: string;
  status: "published";
  testEligible: true;
  mockTestEligible: true;
  publiclyPublishable: false;
  reused: boolean;
  lockVersion: number;
}>;

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as JsonRecord
    : {};
}
function generationRecord(value: unknown): JsonRecord {
  return asRecord(asRecord(value).generation);
}
function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String) : [];
}

async function assertActivePlacement(
  client: QuestionSqlExecutor,
  examVersionId: string,
  taxonomyNodeIds: readonly string[],
): Promise<void> {
  const exams = await client`
    SELECT ev.id
    FROM catalog.exam_versions ev
    JOIN catalog.exams e ON e.id = ev.exam_id
    WHERE ev.id = ${examVersionId}::uuid
      AND e.is_active = true
    LIMIT 1
  `;
  if (exams.length === 0) {
    throw new QuestionManagementError("BTD_CP017_EXAM_VERSION_UNAVAILABLE", "The projection exam version is no longer active.", 409);
  }
  for (const nodeId of taxonomyNodeIds) {
    const nodes = await client`
      SELECT n.id
      FROM catalog.taxonomy_nodes n
      JOIN catalog.exam_taxonomy_nodes etn
        ON etn.taxonomy_node_id = n.id
       AND etn.exam_version_id = ${examVersionId}::uuid
       AND etn.is_active = true
      WHERE n.id = ${nodeId}::uuid
        AND n.is_active = true
        AND n.deleted_at IS NULL
      LIMIT 1
    `;
    if (nodes.length === 0) {
      throw new QuestionManagementError("BTD_CP017_TAXONOMY_UNAVAILABLE", "The projection taxonomy placement is no longer active for this exam.", 409);
    }
  }
}

async function assertApprovedTranslations(
  client: QuestionSqlExecutor,
  questionVersionId: string,
  baseOptionCount: number,
): Promise<void> {
  for (const language of ["hi", "pa"] as const) {
    const rows = await client`
      SELECT
        qt.id::text AS id,
        qt.stem,
        qt.explanation,
        (SELECT COUNT(*)::int FROM content.question_translation_options qto WHERE qto.question_translation_id = qt.id) AS "optionCount"
      FROM content.question_translations qt
      JOIN catalog.languages l ON l.id = qt.language_id
      WHERE qt.question_version_id = ${questionVersionId}::uuid
        AND lower(l.code) = ${language}
        AND lower(qt.status) = 'approved'
      LIMIT 2
    `;
    if (rows.length !== 1) {
      throw new QuestionManagementError("BTD_CP017_TRANSLATION_NOT_APPROVED", `Exactly one approved ${language.toUpperCase()} translation is required.`, 409);
    }
    const row = rows[0]!;
    if (!String(row.stem ?? "").trim() || !String(row.explanation ?? "").trim()) {
      throw new QuestionManagementError("BTD_CP017_TRANSLATION_INCOMPLETE", `${language.toUpperCase()} translation is incomplete.`, 409);
    }
    if (Number(row.optionCount ?? 0) !== baseOptionCount) {
      throw new QuestionManagementError("BTD_CP017_TRANSLATION_OPTION_MISMATCH", `${language.toUpperCase()} translation option count does not match the English base.`, 409);
    }
  }
}

export async function enableBtdCp017MockTestEligibilityV1(
  client: QuestionSqlExecutor,
  questionId: string,
  expectedLockVersion: number,
  actorUserId: string,
): Promise<BtdCp017MockEligibilityResult> {
  if (!BTD_CP017_MOCK_TEST_ELIGIBILITY_BOUNDARY.mockTestEligibilityApprovalGranted) {
    throw new QuestionManagementError("BTD_CP017_MOCK_ELIGIBILITY_LOCKED", "BTD-001 mock-test eligibility is not authorized.", 409);
  }
  if (!Number.isInteger(expectedLockVersion) || expectedLockVersion < 0) {
    throw new QuestionManagementError("INVALID_LOCK_VERSION", "A valid lock version is required.", 400);
  }

  const rows = await client`
    SELECT
      q.id::text AS "questionId",
      q.public_code AS "publicCode",
      q.status::text AS status,
      q.lock_version AS "lockVersion",
      q.approved_version_id::text AS "approvedVersionId",
      q.published_version_id::text AS "publishedVersionId",
      q.primary_taxonomy_node_id::text AS "primaryTaxonomyNodeId",
      qv.id::text AS "questionVersionId",
      qv.exam_version_id::text AS "examVersionId",
      qv.answer_model AS "answerModel",
      qv.stem,
      qv.explanation,
      COALESCE((
        SELECT array_agg(qtl.taxonomy_node_id::text ORDER BY qtl.taxonomy_node_id::text)
        FROM content.question_taxonomy_links qtl
        WHERE qtl.question_version_id = qv.id
      ), '{}') AS "taxonomyNodeIds",
      (SELECT COUNT(*)::int FROM content.question_options qo WHERE qo.question_version_id = qv.id) AS "optionCount",
      (SELECT COUNT(*)::int FROM content.question_options qo WHERE qo.question_version_id = qv.id AND qo.is_correct = true) AS "correctOptionCount"
    FROM content.questions q
    JOIN content.question_versions qv ON qv.id = q.published_version_id
    WHERE q.id = ${questionId}::uuid
      AND q.deleted_at IS NULL
    FOR UPDATE OF q
  `;
  const projection = rows[0];
  if (!projection) {
    throw new QuestionManagementError("BTD_CP017_PROJECTION_NOT_FOUND", "BTD scored-test projection was not found.", 404);
  }
  const lockVersion = Number(projection.lockVersion);
  if (lockVersion !== expectedLockVersion) {
    throw new QuestionManagementError("QUESTION_VERSION_CONFLICT", "This projection changed after you opened it. Refresh before continuing.", 409);
  }

  const questionVersionId = String(projection.questionVersionId);
  const answerModel = asRecord(projection.answerModel);
  const generation = generationRecord(answerModel);
  const projectionBundleKey = String(generation.testProjectionBundleKey ?? "");
  const examVersionId = String(projection.examVersionId ?? "");
  const primaryTaxonomyNodeId = String(projection.primaryTaxonomyNodeId ?? "");
  const taxonomyNodeIds = asStringArray(projection.taxonomyNodeIds).sort();
  const optionCount = Number(projection.optionCount ?? 0);

  if (String(projection.status) !== "published" || String(projection.publishedVersionId ?? "") !== questionVersionId || String(projection.approvedVersionId ?? "") !== questionVersionId) {
    throw new QuestionManagementError("BTD_CP017_PROJECTION_STATE_INVALID", "The projection must already be the approved, internally published CP015 version.", 409);
  }
  if (String(generation.packageId ?? "") !== "BTD-001") {
    throw new QuestionManagementError("BTD_CP017_NOT_BTD_PROJECTION", "Only BTD-001 projections may use this mock-test action.", 409);
  }
  if (generation.testProjectionMaterialized !== true || !projectionBundleKey.startsWith("BTD-TEST-BUNDLE-")) {
    throw new QuestionManagementError("BTD_CP017_NOT_MATERIALIZED", "The question is not a certified test projection.", 409);
  }
  if (String(generation.testProjectionAuthority ?? "") !== BTD_CP014_TEST_PROJECTION_MATERIALIZATION_VERSION) {
    throw new QuestionManagementError("BTD_CP017_MATERIALIZATION_AUTHORITY_MISMATCH", "The projection materialization authority has drifted.", 409);
  }
  if (String(generation.questionBankAcceptanceMode ?? "") !== "TEST_PROJECTION" || String(generation.language ?? "").toLowerCase() !== "en") {
    throw new QuestionManagementError("BTD_CP017_PROJECTION_MODE_MISMATCH", "The projection must be the canonical English TEST_PROJECTION base row.", 409);
  }
  if (generation.testEligible !== true || String(generation.testEligibility ?? "") !== "ELIGIBLE" || String(generation.testEligibilityAuthority ?? "") !== BTD_CP015_SCORED_TEST_ELIGIBILITY_VERSION) {
    throw new QuestionManagementError("BTD_CP017_SCORED_TEST_AUTHORITY_REQUIRED", "CP015 scored-test eligibility must be active before mock-test eligibility.", 409);
  }
  if (generation.publiclyPublishable !== false || generation.automaticStudentPublication !== false) {
    throw new QuestionManagementError("BTD_CP017_PUBLIC_GATE_DRIFT", "Public or automatic delivery changed before mock-test activation.", 409);
  }
  if (!examVersionId || !primaryTaxonomyNodeId || taxonomyNodeIds.length === 0 || !taxonomyNodeIds.includes(primaryTaxonomyNodeId)) {
    throw new QuestionManagementError("BTD_CP017_PLACEMENT_INCOMPLETE", "The projection exam/taxonomy placement is incomplete.", 409);
  }
  if (!String(projection.stem ?? "").trim() || !String(projection.explanation ?? "").trim() || optionCount < 2 || Number(projection.correctOptionCount ?? 0) !== 1) {
    throw new QuestionManagementError("BTD_CP017_CONTENT_INVALID", "The projection learner content or option model is incomplete.", 409);
  }

  const alreadyEligible = generation.mockTestEligible === true
    && String(generation.mockTestEligibilityAuthority ?? "") === BTD_CP017_MOCK_TEST_ELIGIBILITY_VERSION;
  if (alreadyEligible) {
    return {
      questionId: String(projection.questionId),
      questionVersionId,
      publicCode: String(projection.publicCode),
      projectionBundleKey,
      status: "published",
      testEligible: true,
      mockTestEligible: true,
      publiclyPublishable: false,
      reused: true,
      lockVersion,
    };
  }
  if (generation.mockTestEligible !== false) {
    throw new QuestionManagementError("BTD_CP017_MOCK_STATE_DRIFT", "The projection mock-test eligibility state changed before CP017 approval.", 409);
  }

  await assertActivePlacement(client, examVersionId, taxonomyNodeIds);
  await assertApprovedTranslations(client, questionVersionId, optionCount);

  const nextAnswerModel = {
    ...answerModel,
    generation: {
      ...generation,
      testEligible: true,
      testEligibility: "ELIGIBLE",
      testEligibilityAuthority: BTD_CP015_SCORED_TEST_ELIGIBILITY_VERSION,
      mockTestEligible: true,
      mockTestEligibilityAuthority: BTD_CP017_MOCK_TEST_ELIGIBILITY_VERSION,
      mockTestEligibilityActivatedAtCheckpoint: "BTD-CP-017",
      publiclyPublishable: false,
      automaticStudentPublication: false,
      integrationAuthority: BTD_CP017_MOCK_TEST_ELIGIBILITY_VERSION,
    },
  };

  await client`
    UPDATE content.question_versions
    SET answer_model = ${JSON.stringify(nextAnswerModel)}::jsonb
    WHERE id = ${questionVersionId}::uuid
  `;
  await client`
    UPDATE content.questions
    SET lock_version = lock_version + 1, updated_at = now()
    WHERE id = ${questionId}::uuid
  `;
  await client`
    INSERT INTO platform.audit_events (
      id, actor_type, actor_user_id, action_key, entity_type,
      entity_id, entity_version_id, reason, summary, metadata
    ) VALUES (
      ${randomUUID()}::uuid,
      'user'::audit_actor_type,
      ${actorUserId}::uuid,
      'content.question.btd_mock_test_eligibility_enabled',
      'question',
      ${questionId}::uuid,
      ${questionVersionId}::uuid,
      'Explicit CP017 mock-test eligibility grant for a certified CP015 scored-test projection; public delivery remains locked',
      ${`${String(projection.publicCode)} enabled for canonical mock-test series use`},
      ${JSON.stringify({
        projectionBundleKey,
        examVersionId,
        primaryTaxonomyNodeId,
        taxonomyNodeIds,
        testEligible: true,
        mockTestEligible: true,
        publiclyPublishable: false,
        authority: BTD_CP017_MOCK_TEST_ELIGIBILITY_VERSION,
      })}::jsonb
    )
  `;

  return {
    questionId: String(projection.questionId),
    questionVersionId,
    publicCode: String(projection.publicCode),
    projectionBundleKey,
    status: "published",
    testEligible: true,
    mockTestEligible: true,
    publiclyPublishable: false,
    reused: false,
    lockVersion: lockVersion + 1,
  };
}
