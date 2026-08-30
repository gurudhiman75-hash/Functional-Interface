import { randomUUID } from "node:crypto";

import { optionKey, questionPublicCode, type QuestionSqlExecutor } from "./admin-question-conversion";
import { QuestionManagementError } from "./admin-question-management";
import {
  BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY,
  BTD_CP014_TEST_PROJECTION_MATERIALIZATION_VERSION,
  buildBtdCp014TestProjectionMaterializationPlanV1,
  type BtdCp014ProjectionLanguage,
  type BtdCp014TestProjectionRequest,
} from "../quant-v4/topics/Arithmetic/subtopics/Bankers-True-Discount/BTD-001/BTD-CP-014/btd-cp014-test-projection-materialization-v1";
import { BTD_CP012_QUESTION_BANK_ACCEPTANCE_AUTHORITY } from "../quant-v4/topics/Arithmetic/subtopics/Bankers-True-Discount/BTD-001/BTD-CP-012/btd-cp012-question-bank-admission-v1";

type JsonRecord = Record<string, unknown>;

type SourceOption = Readonly<{
  key: string;
  text: string;
  sortOrder: number;
  isCorrect: boolean;
}>;

export type BtdCp014SourceBankRow = Readonly<{
  questionId: string;
  questionVersionId: string;
  publicCode: string;
  status: string;
  questionType: string;
  difficulty: string;
  stem: string;
  explanation: string;
  answerModel: JsonRecord;
  patternId: string | null;
  defaultMarks: number;
  defaultNegativeMarks: number;
  targetTimeSeconds: number | null;
  options: readonly SourceOption[];
}>;

export type BtdCp014MaterializedProjection = Readonly<{
  projectionBundleKey: string;
  questionId: string;
  questionVersionId: string;
  publicCode: string;
  reused: boolean;
  status: "approved";
  examVersionId: string;
  primaryTaxonomyNodeId: string;
  taxonomyNodeIds: readonly string[];
  sourceQuestionIds: Readonly<Record<BtdCp014ProjectionLanguage, string>>;
  sourceQuestionVersionIds: Readonly<Record<BtdCp014ProjectionLanguage, string>>;
}>;

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as JsonRecord
    : {};
}

function generationRecord(answerModel: unknown): JsonRecord {
  return asRecord(asRecord(answerModel).generation);
}

function exactJson(value: unknown): string {
  return JSON.stringify(value);
}

function normalizedExpectedOptions(payload: Readonly<Record<string, any>>) {
  const options = Array.isArray(payload.options) ? payload.options.map(String) : [];
  return options.map((text, index) => ({
    key: optionKey(index),
    text,
    sortOrder: index + 1,
    isCorrect: index === Number(payload.correctIndex),
  }));
}

export function assertBtdCp014SourceRowMatchesPlanV1(
  source: BtdCp014SourceBankRow,
  expected: Readonly<Record<string, any>>,
  language: BtdCp014ProjectionLanguage,
): void {
  const generation = generationRecord(source.answerModel);
  const expectedAdmissionKey = String(expected.sourceQuestionBankAdmissionKey ?? "");
  const expectedPayload = expected.sourceBankPayload as Readonly<Record<string, any>>;

  if (source.status !== "approved") {
    throw new QuestionManagementError("BTD_CP014_SOURCE_NOT_APPROVED", `${language.toUpperCase()} source Question Bank row is not approved.`, 409);
  }
  if (String(generation.packageId ?? "") !== "BTD-001") {
    throw new QuestionManagementError("BTD_CP014_SOURCE_PACKAGE_MISMATCH", `${language.toUpperCase()} source is not a BTD-001 Question Bank row.`, 409);
  }
  if (String(generation.providerQuestionId ?? "") !== expectedAdmissionKey) {
    throw new QuestionManagementError("BTD_CP014_SOURCE_IDENTITY_MISMATCH", `${language.toUpperCase()} source admission identity drifted.`, 409);
  }
  if (String(generation.questionBankAcceptanceMode ?? "") !== "BANK_ONLY") {
    throw new QuestionManagementError("BTD_CP014_SOURCE_LIFECYCLE_MISMATCH", `${language.toUpperCase()} source is not under the CP012 BANK_ONLY authority.`, 409);
  }
  if (String(generation.questionBankAcceptanceAuthority ?? "") !== BTD_CP012_QUESTION_BANK_ACCEPTANCE_AUTHORITY) {
    throw new QuestionManagementError("BTD_CP014_SOURCE_AUTHORITY_MISMATCH", `${language.toUpperCase()} source acceptance authority drifted.`, 409);
  }
  if (String(generation.language ?? "").toLowerCase() !== language) {
    throw new QuestionManagementError("BTD_CP014_SOURCE_LANGUAGE_MISMATCH", `${language.toUpperCase()} source language metadata drifted.`, 409);
  }
  if (generation.testEligible !== false || generation.mockTestEligible !== false || generation.publiclyPublishable !== false) {
    throw new QuestionManagementError("BTD_CP014_SOURCE_DELIVERY_UNLOCKED", `${language.toUpperCase()} source crossed the CP012 delivery boundary.`, 409);
  }
  if (source.stem !== String(expectedPayload.stem ?? "")) {
    throw new QuestionManagementError("BTD_CP014_SOURCE_STEM_DRIFT", `${language.toUpperCase()} source stem drifted from frozen authority.`, 409);
  }
  if (source.difficulty !== String(expectedPayload.difficulty ?? "")) {
    throw new QuestionManagementError("BTD_CP014_SOURCE_DIFFICULTY_DRIFT", `${language.toUpperCase()} source difficulty drifted from frozen authority.`, 409);
  }
  const expectedOptions = normalizedExpectedOptions(expectedPayload);
  if (exactJson(source.options) !== exactJson(expectedOptions)) {
    throw new QuestionManagementError("BTD_CP014_SOURCE_OPTIONS_DRIFT", `${language.toUpperCase()} source options drifted from frozen authority.`, 409);
  }
}

export function buildBtdCp014ProjectionAnswerModelV1(
  sourceAnswerModel: unknown,
  plan: ReturnType<typeof buildBtdCp014TestProjectionMaterializationPlanV1>,
  sources: Readonly<Record<BtdCp014ProjectionLanguage, BtdCp014SourceBankRow>>,
) {
  const base = asRecord(sourceAnswerModel);
  const priorGeneration = generationRecord(base);
  return {
    ...base,
    generation: {
      ...priorGeneration,
      providerQuestionId: plan.projectionBundleKey,
      packageId: "BTD-001",
      qlId: plan.qlId,
      language: "en",
      locale: "en-IN",
      questionBankStatus: "TEST_PROJECTION_STAGED",
      questionBankWritable: false,
      questionBankAcceptanceMode: "TEST_PROJECTION",
      sourceQuestionBankAcceptanceMode: "BANK_ONLY",
      sourceQuestionBankAcceptanceAuthority: BTD_CP012_QUESTION_BANK_ACCEPTANCE_AUTHORITY,
      testProjectionMaterialized: true,
      testProjectionBundleKey: plan.projectionBundleKey,
      testProjectionAuthority: BTD_CP014_TEST_PROJECTION_MATERIALIZATION_VERSION,
      sourceQuestionBankAdmissionKeys: plan.projectionDocument.sourceAdmissionKeys,
      sourceBankQuestionIds: {
        en: sources.en.questionId,
        hi: sources.hi.questionId,
        pa: sources.pa.questionId,
      },
      sourceBankQuestionVersionIds: {
        en: sources.en.questionVersionId,
        hi: sources.hi.questionVersionId,
        pa: sources.pa.questionVersionId,
      },
      examVersionId: plan.examVersionId,
      primaryTaxonomyNodeId: plan.primaryTaxonomyNodeId,
      taxonomyNodeIds: plan.taxonomyNodeIds,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      integrationAuthority: BTD_CP014_TEST_PROJECTION_MATERIALIZATION_VERSION,
    },
  };
}

async function assertPlacementAvailable(
  client: QuestionSqlExecutor,
  plan: ReturnType<typeof buildBtdCp014TestProjectionMaterializationPlanV1>,
): Promise<void> {
  const exams = await client`
    SELECT ev.id
    FROM catalog.exam_versions ev
    JOIN catalog.exams e ON e.id = ev.exam_id
    WHERE ev.id = ${plan.examVersionId}::uuid
      AND e.is_active = true
    LIMIT 1
  `;
  if (exams.length === 0) {
    throw new QuestionManagementError("BTD_CP014_EXAM_VERSION_UNAVAILABLE", "Selected exam version is unavailable.", 400);
  }

  for (const nodeId of plan.taxonomyNodeIds) {
    const nodes = await client`
      SELECT n.id
      FROM catalog.taxonomy_nodes n
      JOIN catalog.exam_taxonomy_nodes etn
        ON etn.taxonomy_node_id = n.id
       AND etn.exam_version_id = ${plan.examVersionId}::uuid
       AND etn.is_active = true
      WHERE n.id = ${nodeId}::uuid
        AND n.is_active = true
        AND n.deleted_at IS NULL
      LIMIT 1
    `;
    if (nodes.length === 0) {
      throw new QuestionManagementError("BTD_CP014_TAXONOMY_UNAVAILABLE", "One or more taxonomy nodes are unavailable for the selected exam.", 400);
    }
  }

  for (const language of ["hi", "pa"] as const) {
    const languageRows = await client`
      SELECT l.id::text AS id
      FROM catalog.languages l
      JOIN catalog.exam_version_languages evl
        ON evl.language_id = l.id
       AND evl.exam_version_id = ${plan.examVersionId}::uuid
      WHERE lower(l.code) = ${language}
        AND l.is_active = true
      LIMIT 1
    `;
    if (languageRows.length === 0) {
      throw new QuestionManagementError("BTD_CP014_LANGUAGE_UNAVAILABLE", `${language.toUpperCase()} is not active for the selected exam version.`, 409);
    }
  }
}

async function loadSourceBankRow(
  client: QuestionSqlExecutor,
  admissionKey: string,
): Promise<BtdCp014SourceBankRow | null> {
  const rows = await client`
    SELECT
      q.id::text AS "questionId",
      qv.id::text AS "questionVersionId",
      q.public_code AS "publicCode",
      q.status::text AS status,
      qv.question_type AS "questionType",
      qv.difficulty,
      qv.stem,
      qv.explanation,
      qv.answer_model AS "answerModel",
      qv.pattern_id::text AS "patternId",
      qv.default_marks::float8 AS "defaultMarks",
      qv.default_negative_marks::float8 AS "defaultNegativeMarks",
      qv.target_time_seconds AS "targetTimeSeconds",
      COALESCE((
        SELECT json_agg(json_build_object(
          'key', option.option_key,
          'text', option.text,
          'sortOrder', option.sort_order,
          'isCorrect', option.is_correct
        ) ORDER BY option.sort_order)
        FROM content.question_options option
        WHERE option.question_version_id = qv.id
      ), '[]'::json) AS options
    FROM content.questions q
    JOIN content.question_versions qv ON qv.id = q.approved_version_id
    WHERE q.deleted_at IS NULL
      AND q.status = 'approved'::question_status
      AND qv.answer_model #>> '{generation,packageId}' = 'BTD-001'
      AND qv.answer_model #>> '{generation,providerQuestionId}' = ${admissionKey}
      AND qv.answer_model #>> '{generation,questionBankAcceptanceMode}' = 'BANK_ONLY'
    LIMIT 2
  `;
  if (rows.length === 0) return null;
  if (rows.length > 1) {
    throw new QuestionManagementError("BTD_CP014_SOURCE_DEDUP_VIOLATION", `Multiple Question Bank rows share admission key ${admissionKey}.`, 409);
  }
  const row = rows[0]!;
  return {
    questionId: String(row.questionId),
    questionVersionId: String(row.questionVersionId),
    publicCode: String(row.publicCode),
    status: String(row.status),
    questionType: String(row.questionType),
    difficulty: String(row.difficulty),
    stem: String(row.stem),
    explanation: String(row.explanation ?? ""),
    answerModel: asRecord(row.answerModel),
    patternId: row.patternId ? String(row.patternId) : null,
    defaultMarks: Number(row.defaultMarks ?? 1),
    defaultNegativeMarks: Number(row.defaultNegativeMarks ?? 0),
    targetTimeSeconds: row.targetTimeSeconds == null ? null : Number(row.targetTimeSeconds),
    options: Array.isArray(row.options)
      ? row.options.map((option) => {
          const record = asRecord(option);
          return {
            key: String(record.key ?? ""),
            text: String(record.text ?? ""),
            sortOrder: Number(record.sortOrder ?? 0),
            isCorrect: record.isCorrect === true,
          };
        })
      : [],
  };
}

async function loadProjectionByKey(
  client: QuestionSqlExecutor,
  projectionBundleKey: string,
) {
  const rows = await client`
    SELECT
      q.id::text AS "questionId",
      qv.id::text AS "questionVersionId",
      q.public_code AS "publicCode",
      q.status::text AS status,
      q.primary_taxonomy_node_id::text AS "primaryTaxonomyNodeId",
      qv.exam_version_id::text AS "examVersionId",
      qv.answer_model AS "answerModel",
      COALESCE((
        SELECT array_agg(link.taxonomy_node_id::text ORDER BY link.taxonomy_node_id::text)
        FROM content.question_taxonomy_links link
        WHERE link.question_version_id = qv.id
      ), '{}') AS "taxonomyNodeIds"
    FROM content.questions q
    JOIN content.question_versions qv ON qv.id = q.approved_version_id
    WHERE q.deleted_at IS NULL
      AND qv.answer_model #>> '{generation,testProjectionBundleKey}' = ${projectionBundleKey}
    LIMIT 2
  `;
  if (rows.length > 1) {
    throw new QuestionManagementError("BTD_CP014_PROJECTION_COLLISION", `Multiple projections share key ${projectionBundleKey}.`, 409);
  }
  return rows[0] ?? null;
}

function sourceIdMap(sources: Readonly<Record<BtdCp014ProjectionLanguage, BtdCp014SourceBankRow>>) {
  return {
    en: sources.en.questionId,
    hi: sources.hi.questionId,
    pa: sources.pa.questionId,
  } as const;
}
function sourceVersionIdMap(sources: Readonly<Record<BtdCp014ProjectionLanguage, BtdCp014SourceBankRow>>) {
  return {
    en: sources.en.questionVersionId,
    hi: sources.hi.questionVersionId,
    pa: sources.pa.questionVersionId,
  } as const;
}

function assertExistingProjectionMatches(
  existing: Record<string, any>,
  plan: ReturnType<typeof buildBtdCp014TestProjectionMaterializationPlanV1>,
  sources: Readonly<Record<BtdCp014ProjectionLanguage, BtdCp014SourceBankRow>>,
) {
  const generation = generationRecord(existing.answerModel);
  const taxonomyNodeIds = Array.isArray(existing.taxonomyNodeIds) ? existing.taxonomyNodeIds.map(String).sort() : [];
  if (
    String(existing.status) !== "approved"
    || String(existing.examVersionId) !== plan.examVersionId
    || String(existing.primaryTaxonomyNodeId) !== plan.primaryTaxonomyNodeId
    || exactJson(taxonomyNodeIds) !== exactJson([...plan.taxonomyNodeIds].sort())
    || exactJson(generation.sourceBankQuestionIds) !== exactJson(sourceIdMap(sources))
    || exactJson(generation.sourceBankQuestionVersionIds) !== exactJson(sourceVersionIdMap(sources))
    || generation.testEligible !== false
    || generation.publiclyPublishable !== false
  ) {
    throw new QuestionManagementError("BTD_CP014_PROJECTION_KEY_COLLISION", "Existing projection key resolves to a different source or placement.", 409);
  }
}

export async function materializeBtdCp014TestProjectionV1(
  client: QuestionSqlExecutor,
  request: BtdCp014TestProjectionRequest,
  actorUserId: string,
): Promise<BtdCp014MaterializedProjection> {
  if (!BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.testProjectionMaterializationApproved) {
    throw new QuestionManagementError("BTD_CP014_MATERIALIZATION_LOCKED", "BTD-001 projection materialization is not authorized.", 409);
  }
  const plan = buildBtdCp014TestProjectionMaterializationPlanV1(request);
  await client`SELECT pg_advisory_xact_lock(hashtextextended(${plan.projectionBundleKey}, 0))`;
  await assertPlacementAvailable(client, plan);

  const loaded = {} as Record<BtdCp014ProjectionLanguage, BtdCp014SourceBankRow>;
  for (const language of ["en", "hi", "pa"] as const) {
    const source = await loadSourceBankRow(client, plan.projectionDocument.sourceAdmissionKeys[language]);
    if (!source) {
      throw new QuestionManagementError(
        "BTD_CP014_SOURCE_NOT_ADMITTED",
        `${language.toUpperCase()} frozen source has not been manually approved into Question Bank for this exact QL/seed.`,
        409,
      );
    }
    assertBtdCp014SourceRowMatchesPlanV1(source, plan.sources[language], language);
    loaded[language] = source;
  }
  const sources = loaded as Readonly<Record<BtdCp014ProjectionLanguage, BtdCp014SourceBankRow>>;

  const existing = await loadProjectionByKey(client, plan.projectionBundleKey);
  if (existing) {
    assertExistingProjectionMatches(existing as Record<string, any>, plan, sources);
    return {
      projectionBundleKey: plan.projectionBundleKey,
      questionId: String(existing.questionId),
      questionVersionId: String(existing.questionVersionId),
      publicCode: String(existing.publicCode),
      reused: true,
      status: "approved",
      examVersionId: plan.examVersionId,
      primaryTaxonomyNodeId: plan.primaryTaxonomyNodeId,
      taxonomyNodeIds: plan.taxonomyNodeIds,
      sourceQuestionIds: sourceIdMap(sources),
      sourceQuestionVersionIds: sourceVersionIdMap(sources),
    };
  }

  const questionId = randomUUID();
  const questionVersionId = randomUUID();
  const publicCode = questionPublicCode();
  const answerModel = buildBtdCp014ProjectionAnswerModelV1(sources.en.answerModel, plan, sources);

  await client`
    INSERT INTO content.questions (
      id, public_code, status, primary_taxonomy_node_id, author_user_id,
      lock_version, created_at, updated_at
    ) VALUES (
      ${questionId}::uuid,
      ${publicCode},
      'approved'::question_status,
      ${plan.primaryTaxonomyNodeId}::uuid,
      ${actorUserId}::uuid,
      0,
      now(),
      now()
    )
  `;
  await client`
    INSERT INTO content.question_versions (
      id, question_id, version_number, exam_version_id, pattern_id,
      question_type, difficulty, stem, explanation, answer_model,
      default_marks, default_negative_marks, target_time_seconds,
      change_reason, created_by, created_at
    ) VALUES (
      ${questionVersionId}::uuid,
      ${questionId}::uuid,
      1,
      ${plan.examVersionId}::uuid,
      ${sources.en.patternId}::uuid,
      ${sources.en.questionType},
      ${sources.en.difficulty},
      ${sources.en.stem},
      ${sources.en.explanation},
      ${JSON.stringify(answerModel)}::jsonb,
      ${sources.en.defaultMarks},
      ${sources.en.defaultNegativeMarks},
      ${sources.en.targetTimeSeconds},
      'Materialized from frozen BTD-001 CP012 sources for exam-scoped test projection; delivery remains locked',
      ${actorUserId}::uuid,
      now()
    )
  `;
  for (const option of sources.en.options) {
    await client`
      INSERT INTO content.question_options (
        id, question_version_id, option_key, text, sort_order, is_correct
      ) VALUES (
        ${randomUUID()}::uuid,
        ${questionVersionId}::uuid,
        ${option.key},
        ${option.text},
        ${option.sortOrder},
        ${option.isCorrect}
      )
    `;
  }
  for (const nodeId of plan.taxonomyNodeIds) {
    await client`
      INSERT INTO content.question_taxonomy_links (
        question_version_id, taxonomy_node_id, is_primary
      ) VALUES (
        ${questionVersionId}::uuid,
        ${nodeId}::uuid,
        ${nodeId === plan.primaryTaxonomyNodeId}
      )
    `;
  }

  for (const language of ["hi", "pa"] as const) {
    const languageRows = await client`
      SELECT l.id::text AS id
      FROM catalog.languages l
      JOIN catalog.exam_version_languages evl
        ON evl.language_id = l.id
       AND evl.exam_version_id = ${plan.examVersionId}::uuid
      WHERE lower(l.code) = ${language}
        AND l.is_active = true
      LIMIT 1
    `;
    const languageId = String(languageRows[0]?.id ?? "");
    if (!languageId) {
      throw new QuestionManagementError("BTD_CP014_LANGUAGE_UNAVAILABLE", `${language.toUpperCase()} is unavailable for the selected exam.`, 409);
    }
    const translationRows = await client`
      INSERT INTO content.question_translations (
        question_version_id, language_id, stem, explanation, status,
        translator_user_id, submitted_at, reviewer_user_id, reviewed_at,
        quality_snapshot, created_at, updated_at
      ) VALUES (
        ${questionVersionId}::uuid,
        ${languageId}::uuid,
        ${sources[language].stem},
        ${sources[language].explanation},
        'approved',
        NULL,
        now(),
        ${actorUserId}::uuid,
        now(),
        ${JSON.stringify({
          authority: BTD_CP014_TEST_PROJECTION_MATERIALIZATION_VERSION,
          sourceQuestionId: sources[language].questionId,
          sourceQuestionVersionId: sources[language].questionVersionId,
          sourceAdmissionKey: plan.projectionDocument.sourceAdmissionKeys[language],
          frozenSourceAlreadyEditoriallyApproved: true,
        })}::jsonb,
        now(),
        now()
      )
      RETURNING id::text AS id
    `;
    const translationId = String(translationRows[0]?.id ?? "");
    if (!translationId) throw new QuestionManagementError("BTD_CP014_TRANSLATION_INSERT_FAILED", `Unable to materialize ${language.toUpperCase()} translation.`, 500);
    for (const option of sources[language].options) {
      await client`
        INSERT INTO content.question_translation_options (
          question_translation_id, option_key, text, sort_order, created_at, updated_at
        ) VALUES (
          ${translationId}::uuid,
          ${option.key},
          ${option.text},
          ${option.sortOrder},
          now(),
          now()
        )
      `;
    }
  }

  await client`
    UPDATE content.questions
    SET
      current_draft_version_id = ${questionVersionId}::uuid,
      approved_version_id = ${questionVersionId}::uuid,
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
      'content.question.btd_test_projection_materialized',
      'question',
      ${questionId}::uuid,
      ${questionVersionId}::uuid,
      'Materialized frozen BTD-001 multilingual Question Bank sources into an exam-scoped approved projection; test/public delivery remains locked',
      ${`Created ${publicCode} as BTD-001 exam-scoped test projection`},
      ${JSON.stringify({
        projectionBundleKey: plan.projectionBundleKey,
        examVersionId: plan.examVersionId,
        primaryTaxonomyNodeId: plan.primaryTaxonomyNodeId,
        taxonomyNodeIds: plan.taxonomyNodeIds,
        sourceQuestionIds: sourceIdMap(sources),
        sourceQuestionVersionIds: sourceVersionIdMap(sources),
        testEligible: false,
        publiclyPublishable: false,
      })}::jsonb
    )
  `;

  return {
    projectionBundleKey: plan.projectionBundleKey,
    questionId,
    questionVersionId,
    publicCode,
    reused: false,
    status: "approved",
    examVersionId: plan.examVersionId,
    primaryTaxonomyNodeId: plan.primaryTaxonomyNodeId,
    taxonomyNodeIds: plan.taxonomyNodeIds,
    sourceQuestionIds: sourceIdMap(sources),
    sourceQuestionVersionIds: sourceVersionIdMap(sources),
  };
}
