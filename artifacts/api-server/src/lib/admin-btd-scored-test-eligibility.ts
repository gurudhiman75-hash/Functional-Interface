import { randomUUID } from "node:crypto";

import type { QuestionSqlExecutor } from "./admin-question-conversion";
import { QuestionManagementError } from "./admin-question-management";
import { BTD_CP014_TEST_PROJECTION_MATERIALIZATION_VERSION } from "../quant-v4/topics/Arithmetic/subtopics/Bankers-True-Discount/BTD-001/BTD-CP-014/btd-cp014-test-projection-materialization-v1";
import {
  BTD_CP015_SCORED_TEST_ELIGIBILITY_BOUNDARY,
  BTD_CP015_SCORED_TEST_ELIGIBILITY_VERSION,
} from "../quant-v4/topics/Arithmetic/subtopics/Bankers-True-Discount/BTD-001/BTD-CP-015/btd-cp015-scored-test-eligibility-v1";

type JsonRecord = Record<string, unknown>;

export type BtdCp015EligibilityResult = Readonly<{
  questionId: string;
  questionVersionId: string;
  publicCode: string;
  projectionBundleKey: string;
  status: "published";
  testEligible: true;
  mockTestEligible: false;
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
    throw new QuestionManagementError("BTD_CP015_EXAM_VERSION_UNAVAILABLE", "The projection exam version is no longer active.", 409);
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
      throw new QuestionManagementError("BTD_CP015_TAXONOMY_UNAVAILABLE", "The projection taxonomy placement is no longer active for this exam.", 409);
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
      throw new QuestionManagementError("BTD_CP015_TRANSLATION_NOT_APPROVED", `Exactly one approved ${language.toUpperCase()} translation is required.`, 409);
    }
    const row = rows[0]!;
    if (!String(row.stem ?? "").trim() || !String(row.explanation ?? "").trim()) {
      throw new QuestionManagementError("BTD_CP015_TRANSLATION_INCOMPLETE", `${language.toUpperCase()} translation is incomplete.`, 409);
    }
    if (Number(row.optionCount ?? 0) !== baseOptionCount) {
      throw new QuestionManagementError("BTD_CP015_TRANSLATION_OPTION_MISMATCH", `${language.toUpperCase()} translation option count does not match the English base.`, 409);
    }
  }
}

export async function enableBtdCp015ScoredTestEligibilityV1(
  client: QuestionSqlExecutor,
  questionId: string,
  expectedLockVersion: number,
  actorUserId: string,
): Promise<BtdCp015EligibilityResult> {
  if (!BTD_CP015_SCORED_TEST_ELIGIBILITY_BOUNDARY.testEligibilityApprovalGranted) {
    throw new QuestionManagementError("BTD_CP015_ELIGIBILITY_LOCKED", "BTD-001 scored-test eligibility is not authorized.", 409);
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
    JOIN content.question_versions qv ON qv.id = q.approved_version_id
    WHERE q.id = ${questionId}::uuid
      AND q.deleted_at IS NULL
    FOR UPDATE OF q
  `;
  const projection = rows[0];
  if (!projection) {
    throw new QuestionManagementError("BTD_CP015_PROJECTION_NOT_FOUND", "BTD test projection was not found.", 404);
  }
  const lockVersion = Number(projection.lockVersion);
  if (lockVersion !== expectedLockVersion) {
    throw new QuestionManagementError("QUESTION_VERSION_CONFLICT", "This projection changed after you opened it. Refresh before continuing.", 409);
  }

  const answerModel = asRecord(projection.answerModel);
  const generation = generationRecord(answerModel);
  const projectionBundleKey = String(generation.testProjectionBundleKey ?? "");
  const questionVersionId = String(projection.questionVersionId);
  const examVersionId = String(projection.examVersionId ?? "");
  const primaryTaxonomyNodeId = String(projection.primaryTaxonomyNodeId ?? "");
  const taxonomyNodeIds = asStringArray(projection.taxonomyNodeIds).sort();
  const optionCount = Number(projection.optionCount ?? 0);

  if (String(generation.packageId ?? "") !== "BTD-001") {
    throw new QuestionManagementError("BTD_CP015_NOT_BTD_PROJECTION", "Only BTD-001 projections may use this eligibility action.", 409);
  }
  if (generation.testProjectionMaterialized !== true || !projectionBundleKey.startsWith("BTD-TEST-BUNDLE-")) {
    throw new QuestionManagementError("BTD_CP015_NOT_MATERIALIZED", "The question is not a certified CP014 test projection.", 409);
  }
  if (String(generation.testProjectionAuthority ?? "") !== BTD_CP014_TEST_PROJECTION_MATERIALIZATION_VERSION) {
    throw new QuestionManagementError("BTD_CP015_MATERIALIZATION_AUTHORITY_MISMATCH", "The projection materialization authority has drifted.", 409);
  }
  if (String(generation.questionBankAcceptanceMode ?? "") !== "TEST_PROJECTION") {
    throw new QuestionManagementError("BTD_CP015_PROJECTION_MODE_MISMATCH", "The question is not in TEST_PROJECTION mode.", 409);
  }
  if (String(generation.language ?? "").toLowerCase() !== "en") {
    throw new QuestionManagementError("BTD_CP015_BASE_LANGUAGE_MISMATCH", "The scored-test projection must use the canonical English base row.", 409);
  }
  if (!examVersionId || !primaryTaxonomyNodeId || taxonomyNodeIds.length === 0 || !taxonomyNodeIds.includes(primaryTaxonomyNodeId)) {
    throw new QuestionManagementError("BTD_CP015_PLACEMENT_INCOMPLETE", "The projection exam/taxonomy placement is incomplete.", 409);
  }
  if (!String(projection.stem ?? "").trim() || !String(projection.explanation ?? "").trim()) {
    throw new QuestionManagementError("BTD_CP015_CONTENT_INCOMPLETE", "The projection learner content is incomplete.", 409);
  }
  if (optionCount < 2 || Number(projection.correctOptionCount ?? 0) !== 1) {
    throw new QuestionManagementError("BTD_CP015_OPTION_MODEL_INVALID", "The projection option model is invalid.", 409);
  }
  if (generation.mockTestEligible !== false || generation.publiclyPublishable !== false) {
    throw new QuestionManagementError("BTD_CP015_DOWNSTREAM_GATE_DRIFT", "Mock-test or public-delivery state changed before scored-test activation.", 409);
  }

  const alreadyEligible =
    String(projection.status) === "published"
    && String(projection.publishedVersionId ?? "") === questionVersionId
    && generation.testEligible === true
    && String(generation.testEligibility ?? "") === "ELIGIBLE"
    && String(generation.testEligibilityAuthority ?? "") === BTD_CP015_SCORED_TEST_ELIGIBILITY_VERSION;
  if (alreadyEligible) {
    return {
      questionId: String(projection.questionId),
      questionVersionId,
      publicCode: String(projection.publicCode),
      projectionBundleKey,
      status: "published",
      testEligible: true,
      mockTestEligible: false,
      publiclyPublishable: false,
      reused: true,
      lockVersion,
    };
  }

  if (String(projection.status) !== "approved" || projection.publishedVersionId) {
    throw new QuestionManagementError("BTD_CP015_PROJECTION_STATE_INVALID", "The projection must be approved and unpublished before scored-test activation.", 409);
  }
  if (generation.testEligible !== false || String(generation.testEligibility ?? "") !== "INELIGIBLE") {
    throw new QuestionManagementError("BTD_CP015_ELIGIBILITY_STATE_DRIFT", "The projection eligibility state changed before CP015 approval.", 409);
  }

  await assertActivePlacement(client, examVersionId, taxonomyNodeIds);
  await assertApprovedTranslations(client, questionVersionId, optionCount);

  const nextAnswerModel = {
    ...answerModel,
    generation: {
      ...generation,
      testEligibility: "ELIGIBLE",
      testEligible: true,
      testEligibilityAuthority: BTD_CP015_SCORED_TEST_ELIGIBILITY_VERSION,
      testEligibilityActivatedAtCheckpoint: "BTD-CP-015",
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      integrationAuthority: BTD_CP015_SCORED_TEST_ELIGIBILITY_VERSION,
    },
  };

  await client`
    UPDATE content.question_versions
    SET answer_model = ${JSON.stringify(nextAnswerModel)}::jsonb
    WHERE id = ${questionVersionId}::uuid
  `;
  await client`
    UPDATE content.questions
    SET
      status = 'published'::question_status,
      published_version_id = approved_version_id,
      published_at = now(),
      published_by = ${actorUserId}::uuid,
      lock_version = lock_version + 1,
      updated_at = now()
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
      'content.question.btd_scored_test_eligibility_enabled',
      'question',
      ${questionId}::uuid,
      ${questionVersionId}::uuid,
      'Explicit CP015 scored-test eligibility grant for a certified CP014 exam-scoped projection; mock/public delivery remains locked',
      ${`${String(projection.publicCode)} enabled for scored-test blueprint selection`},
      ${JSON.stringify({
        projectionBundleKey,
        examVersionId,
        primaryTaxonomyNodeId,
        taxonomyNodeIds,
        testEligible: true,
        mockTestEligible: false,
        publiclyPublishable: false,
        authority: BTD_CP015_SCORED_TEST_ELIGIBILITY_VERSION,
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
    mockTestEligible: false,
    publiclyPublishable: false,
    reused: false,
    lockVersion: lockVersion + 1,
  };
}
