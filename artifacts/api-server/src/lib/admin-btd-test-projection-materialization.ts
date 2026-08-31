import { randomUUID } from "node:crypto";

import {
  normalizeGeneratedQuestionPayload,
  optionKey,
  questionPublicCode,
  type QuestionSqlExecutor,
} from "./admin-question-conversion";
import type { BtdPermanentQlId } from "../quant-v4/topics/Arithmetic/subtopics/Bankers-True-Discount/BTD-001/BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import {
  BTD_CP014_MATERIALIZATION_AUTHORITY,
  BTD_CP014_SCORED_TEST_PROJECTION_MATERIALIZATION_BOUNDARY,
  buildBtdCp014ScoredTestProjectionMaterializationPlanV1,
  type BtdCp014SupportedLanguage,
} from "../quant-v4/topics/Arithmetic/subtopics/Bankers-True-Discount/BTD-001/BTD-CP-014/btd-cp014-scored-test-projection-materialization-v1";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const QL_RE = /^BTD-QL-\d{3}$/;

type AnyRecord = Record<string, any>;

export class BtdTestProjectionMaterializationError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode = 409,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "BtdTestProjectionMaterializationError";
  }
}

export type BtdCp014MaterializationInput = Readonly<{
  generationItemId: string;
  examVersionId: string;
  primaryTaxonomyNodeId: string;
  actorUserId: string;
  reason: string;
}>;

export type BtdCp014MaterializationResult = Readonly<{
  projectionKey: string;
  questionId: string;
  questionVersionId: string;
  publicCode: string;
  examVersionId: string;
  primaryTaxonomyNodeId: string;
  translationLanguages: readonly string[];
  reused: boolean;
  testEligible: false;
  mockTestEligible: false;
  publiclyPublishable: false;
}>;

function asRecord(value: unknown): AnyRecord {
  return value && typeof value === "object" && !Array.isArray(value) ? value as AnyRecord : {};
}
function asText(value: unknown): string { return typeof value === "string" ? value.trim() : ""; }
function assertUuid(value: string, label: string) {
  if (!UUID_RE.test(value)) throw new BtdTestProjectionMaterializationError("INVALID_UUID", `${label} must be a canonical UUID.`, 400);
  return value.toLowerCase();
}
function assertReason(value: string) {
  const reason = value.trim();
  if (reason.length < 4 || reason.length > 1000) {
    throw new BtdTestProjectionMaterializationError("MATERIALIZATION_REASON_REQUIRED", "A materialization reason of 4-1000 characters is required.", 400);
  }
  return reason;
}
function stringOptions(value: unknown): Array<{ key: string; text: string; isCorrect: boolean }> {
  if (!Array.isArray(value)) return [];
  return value.map((entry, index) => {
    const record = asRecord(entry);
    return {
      key: asText(record.key) || optionKey(index),
      text: asText(record.text),
      isCorrect: record.isCorrect === true,
    };
  });
}
function translationOptionTexts(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => asText(asRecord(entry).text));
}
function generationOf(answerModel: unknown) { return asRecord(asRecord(answerModel).generation); }

async function loadApprovedEnglishSource(client: QuestionSqlExecutor, generationItemId: string) {
  const rows = await client`
    SELECT
      i.id::text AS id,
      i.status::text AS status,
      i.accepted_question_id::text AS "acceptedQuestionId",
      i.accepted_question_version_id::text AS "acceptedQuestionVersionId",
      v.payload,
      r.public_code AS "generationRunCode"
    FROM content.generation_run_items i
    JOIN content.generation_runs r ON r.id = i.generation_run_id
    JOIN content.generation_item_versions v
      ON v.generation_item_id = i.id
     AND v.version_number = i.current_version_number
    WHERE i.id = ${generationItemId}::uuid
    FOR UPDATE OF i
  `;
  const row = rows[0];
  if (!row) throw new BtdTestProjectionMaterializationError("SOURCE_GENERATION_ITEM_NOT_FOUND", "Approved BTD generation item not found.", 404);
  if (String(row.status) !== "approved") {
    throw new BtdTestProjectionMaterializationError("SOURCE_GENERATION_ITEM_NOT_APPROVED", "BTD projection materialization requires an approved generation item.");
  }
  if (!row.acceptedQuestionId || !row.acceptedQuestionVersionId) {
    throw new BtdTestProjectionMaterializationError("SOURCE_BANK_ADMISSION_REQUIRED", "Approve and admit the BTD source to Question Bank before materializing a test projection.");
  }
  const payload = asRecord(row.payload);
  if (asText(payload.packageId).toUpperCase() !== "BTD-001") {
    throw new BtdTestProjectionMaterializationError("SOURCE_PACKAGE_MISMATCH", "Only BTD-001 sources may use the BTD projection materializer.", 400);
  }
  if (asText(payload.language).toLowerCase() !== "en") {
    throw new BtdTestProjectionMaterializationError("ENGLISH_SOURCE_REQUIRED", "BTD test projections require the approved English bank source as canonical base.", 400);
  }
  if (payload.questionBankAcceptanceMode !== "BANK_ONLY" || payload.questionBankWritable !== true) {
    throw new BtdTestProjectionMaterializationError("SOURCE_BANK_AUTHORITY_MISSING", "BTD source is not a CP012 bank-only admitted payload.");
  }
  if (payload.testEligible !== false || payload.mockTestEligible !== false || payload.publiclyPublishable !== false) {
    throw new BtdTestProjectionMaterializationError("SOURCE_DELIVERY_BOUNDARY_DRIFT", "BTD source crossed its CP012 downstream lock.");
  }
  const qlId = asText(payload.qlId).toUpperCase();
  const seed = asText(payload.seed);
  if (!QL_RE.test(qlId) || !seed) {
    throw new BtdTestProjectionMaterializationError("SOURCE_REPLAY_METADATA_MISSING", "BTD source is missing deterministic QL/seed replay metadata.");
  }
  return {
    payload,
    qlId: qlId as BtdPermanentQlId,
    seed,
    generationRunCode: String(row.generationRunCode),
    acceptedQuestionId: String(row.acceptedQuestionId),
    acceptedQuestionVersionId: String(row.acceptedQuestionVersionId),
  };
}

async function assertSourceBankParity(
  client: QuestionSqlExecutor,
  source: Awaited<ReturnType<typeof loadApprovedEnglishSource>>,
) {
  const rows = await client`
    SELECT
      q.status::text AS status,
      q.approved_version_id::text AS "approvedVersionId",
      v.stem,
      v.explanation,
      v.difficulty,
      v.answer_model AS "answerModel",
      COALESCE(
        json_agg(json_build_object(
          'key', o.option_key,
          'text', o.text,
          'isCorrect', o.is_correct,
          'sortOrder', o.sort_order
        ) ORDER BY o.sort_order) FILTER (WHERE o.id IS NOT NULL),
        '[]'::json
      ) AS options
    FROM content.questions q
    JOIN content.question_versions v ON v.question_id = q.id
    LEFT JOIN content.question_options o ON o.question_version_id = v.id
    WHERE q.id = ${source.acceptedQuestionId}::uuid
      AND v.id = ${source.acceptedQuestionVersionId}::uuid
      AND q.deleted_at IS NULL
    GROUP BY q.id, v.id
    LIMIT 1
  `;
  const bank = rows[0];
  if (!bank || String(bank.status) !== "approved" || String(bank.approvedVersionId) !== source.acceptedQuestionVersionId) {
    throw new BtdTestProjectionMaterializationError("SOURCE_BANK_VERSION_NOT_APPROVED", "The accepted CP012 bank source is no longer the approved version.");
  }
  const normalized = normalizeGeneratedQuestionPayload(source.payload, {
    itemId: "00000000-0000-4000-8000-000000000000",
    generationRunCode: source.generationRunCode,
  });
  const bankOptions = stringOptions(bank.options);
  if (
    String(bank.stem) !== normalized.stem
    || String(bank.explanation ?? "") !== normalized.explanation
    || String(bank.difficulty) !== normalized.difficulty
    || bankOptions.length !== normalized.options.length
    || bankOptions.some((option, index) => option.text !== normalized.options[index] || option.isCorrect !== (index === normalized.correctIndex))
  ) {
    throw new BtdTestProjectionMaterializationError("SOURCE_BANK_CONTENT_DRIFT", "The accepted Question Bank version no longer matches the frozen approved generation item.");
  }
  const generation = generationOf(bank.answerModel);
  if (
    generation.packageId !== "BTD-001"
    || generation.providerQuestionId !== source.payload.questionBankAdmissionKey
    || generation.questionBankAcceptanceMode !== "BANK_ONLY"
    || generation.testEligible !== false
    || generation.publiclyPublishable !== false
  ) {
    throw new BtdTestProjectionMaterializationError("SOURCE_BANK_METADATA_DRIFT", "The accepted Question Bank source no longer carries the certified CP012 lifecycle metadata.");
  }
  return normalized;
}

async function loadPlacement(client: QuestionSqlExecutor, examVersionId: string, taxonomyNodeId: string) {
  const examRows = await client`
    SELECT ev.id::text AS id
    FROM catalog.exam_versions ev
    JOIN catalog.exams e ON e.id = ev.exam_id
    WHERE ev.id = ${examVersionId}::uuid
      AND e.is_active = true
    LIMIT 1
  `;
  if (!examRows[0]) throw new BtdTestProjectionMaterializationError("EXAM_VERSION_NOT_FOUND", "Selected exam version is unavailable.", 400);

  const taxonomyRows = await client`
    SELECT n.id::text AS id
    FROM catalog.taxonomy_nodes n
    JOIN catalog.exam_taxonomy_nodes etn
      ON etn.taxonomy_node_id = n.id
     AND etn.exam_version_id = ${examVersionId}::uuid
     AND etn.is_active = true
    WHERE n.id = ${taxonomyNodeId}::uuid
      AND n.is_active = true
      AND n.deleted_at IS NULL
    LIMIT 1
  `;
  if (!taxonomyRows[0]) throw new BtdTestProjectionMaterializationError("TAXONOMY_NOT_AVAILABLE_FOR_EXAM", "The selected taxonomy node is not active for this exam version.", 400);

  const languageRows = await client`
    SELECT l.id::text AS id, lower(l.code) AS code
    FROM catalog.languages l
    JOIN catalog.exam_version_languages evl
      ON evl.language_id = l.id
     AND evl.exam_version_id = ${examVersionId}::uuid
    WHERE lower(l.code) = ANY(${["en", "hi", "pa"]}::text[])
      AND l.is_active = true
  `;
  const languageIds = new Map<string, string>();
  for (const row of languageRows) languageIds.set(String(row.code), String(row.id));
  if (!languageIds.has("en")) {
    throw new BtdTestProjectionMaterializationError("ENGLISH_NOT_ACTIVE_FOR_EXAM", "BTD's canonical English source is not active for the selected exam version.", 409);
  }
  return languageIds;
}

function projectedAnswerModel(
  normalized: ReturnType<typeof normalizeGeneratedQuestionPayload>,
  input: {
    projectionKey: string;
    sourceQuestionId: string;
    sourceQuestionVersionId: string;
    sourceAdmissionKey: string;
    sourceGenerationItemId: string;
  },
) {
  const source = asRecord(normalized.answerModel);
  const sourceGeneration = asRecord(source.generation);
  return {
    ...source,
    generation: {
      ...sourceGeneration,
      projectionAuthority: BTD_CP014_MATERIALIZATION_AUTHORITY,
      testProjectionKey: input.projectionKey,
      sourceBankQuestionId: input.sourceQuestionId,
      sourceBankQuestionVersionId: input.sourceQuestionVersionId,
      sourceQuestionBankAdmissionKey: input.sourceAdmissionKey,
      sourceGenerationItemId: input.sourceGenerationItemId,
      testProjectionMaterializationApproved: true,
      testProjectionMaterialized: true,
      testEligibilityApprovalGranted: false,
      testEligibility: "INELIGIBLE",
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
      automaticStudentPublication: false,
      contentMutationAuthorized: false,
    },
  };
}

export async function materializeBtdCp014ScoredTestProjectionV1(
  client: QuestionSqlExecutor,
  rawInput: BtdCp014MaterializationInput,
): Promise<BtdCp014MaterializationResult> {
  if (!BTD_CP014_SCORED_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.testProjectionMaterializationApproved) {
    throw new BtdTestProjectionMaterializationError("MATERIALIZATION_NOT_APPROVED", "BTD CP014 materialization is not approved.");
  }
  const generationItemId = assertUuid(rawInput.generationItemId, "generationItemId");
  const examVersionId = assertUuid(rawInput.examVersionId, "examVersionId");
  const primaryTaxonomyNodeId = assertUuid(rawInput.primaryTaxonomyNodeId, "primaryTaxonomyNodeId");
  const actorUserId = assertUuid(rawInput.actorUserId, "actorUserId");
  const reason = assertReason(rawInput.reason);

  const source = await loadApprovedEnglishSource(client, generationItemId);
  const normalized = await assertSourceBankParity(client, source);
  const languageIds = await loadPlacement(client, examVersionId, primaryTaxonomyNodeId);
  const supportedLanguages = [...languageIds.keys()] as BtdCp014SupportedLanguage[];
  const plan = buildBtdCp014ScoredTestProjectionMaterializationPlanV1({
    qlId: source.qlId,
    seed: source.seed,
    examVersionId,
    primaryTaxonomyNodeId,
    supportedLanguages,
  });
  if (plan.englishSourceQuestionBankAdmissionKey !== source.payload.questionBankAdmissionKey) {
    throw new BtdTestProjectionMaterializationError("SOURCE_REPLAY_DRIFT", "Deterministic replay no longer matches the approved English bank source.");
  }
  if (
    plan.englishLearner.stem !== normalized.stem
    || plan.englishLearner.correctIndex !== normalized.correctIndex
    || JSON.stringify(plan.englishLearner.options) !== JSON.stringify(normalized.options)
  ) {
    throw new BtdTestProjectionMaterializationError("SOURCE_LEARNER_REPLAY_DRIFT", "Frozen English learner content drifted during projection replay.");
  }

  await client`SELECT pg_advisory_xact_lock(hashtextextended(${plan.projectionKey}, 0))`;
  const existingRows = await client`
    SELECT
      q.id::text AS "questionId",
      v.id::text AS "questionVersionId",
      q.public_code AS "publicCode",
      q.status::text AS status,
      q.approved_version_id::text AS "approvedVersionId",
      q.primary_taxonomy_node_id::text AS "primaryTaxonomyNodeId",
      v.exam_version_id::text AS "examVersionId",
      v.answer_model AS "answerModel",
      EXISTS (
        SELECT 1
        FROM content.question_taxonomy_links qtl
        WHERE qtl.question_version_id = v.id
          AND qtl.taxonomy_node_id = ${primaryTaxonomyNodeId}::uuid
          AND qtl.is_primary = true
      ) AS "primaryTaxonomyBound"
    FROM content.question_versions v
    JOIN content.questions q ON q.id = v.question_id
    WHERE v.answer_model #>> '{generation,testProjectionKey}' = ${plan.projectionKey}
      AND v.answer_model #>> '{generation,projectionAuthority}' = ${BTD_CP014_MATERIALIZATION_AUTHORITY}
      AND q.deleted_at IS NULL
    LIMIT 1
  `;
  if (existingRows[0]) {
    const existing = existingRows[0];
    const existingGeneration = generationOf(existing.answerModel);
    const existingIntegrityOk =
      String(existing.status) === "approved"
      && String(existing.approvedVersionId) === String(existing.questionVersionId)
      && String(existing.examVersionId) === examVersionId
      && String(existing.primaryTaxonomyNodeId) === primaryTaxonomyNodeId
      && existing.primaryTaxonomyBound === true
      && existingGeneration.projectionAuthority === BTD_CP014_MATERIALIZATION_AUTHORITY
      && existingGeneration.testProjectionKey === plan.projectionKey
      && existingGeneration.sourceQuestionBankAdmissionKey === source.payload.questionBankAdmissionKey
      && existingGeneration.sourceGenerationItemId === generationItemId
      && existingGeneration.testProjectionMaterializationApproved === true
      && existingGeneration.testProjectionMaterialized === true
      && existingGeneration.testEligibilityApprovalGranted === false
      && existingGeneration.testEligible === false
      && existingGeneration.mockTestEligible === false
      && existingGeneration.publiclyPublishable === false;
    if (!existingIntegrityOk) {
      throw new BtdTestProjectionMaterializationError(
        "EXISTING_PROJECTION_INTEGRITY_DRIFT",
        "An existing BTD projection key was found, but its exam/taxonomy/lifecycle state no longer matches CP014 authority.",
      );
    }

    const translationRows = await client`
      SELECT
        lower(l.code) AS code,
        qt.stem,
        qt.explanation,
        qt.quality_snapshot AS "qualitySnapshot",
        COALESCE((
          SELECT json_agg(json_build_object('text', qto.text, 'sortOrder', qto.sort_order) ORDER BY qto.sort_order)
          FROM content.question_translation_options qto
          WHERE qto.question_translation_id = qt.id
        ), '[]'::json) AS options
      FROM content.question_translations qt
      JOIN catalog.languages l ON l.id = qt.language_id
      WHERE qt.question_version_id = ${String(existing.questionVersionId)}::uuid
        AND qt.status = 'approved'
        AND lower(l.code) = ANY(${["hi", "pa"]}::text[])
      ORDER BY lower(l.code)
    `;
    const expectedTranslations = [...plan.translations].sort((a, b) => a.language.localeCompare(b.language));
    if (translationRows.length !== expectedTranslations.length) {
      throw new BtdTestProjectionMaterializationError(
        "EXISTING_PROJECTION_TRANSLATION_DRIFT",
        "Existing BTD projection translations no longer match the target exam language scope.",
      );
    }
    for (let index = 0; index < expectedTranslations.length; index += 1) {
      const expected = expectedTranslations[index]!;
      const actual = translationRows[index]!;
      const quality = asRecord(actual.qualitySnapshot);
      const learner = expected.learner as AnyRecord;
      const actualOptions = translationOptionTexts(actual.options);
      const expectedOptions = Array.isArray(learner.options) ? learner.options.map(String) : [];
      if (
        String(actual.code) !== expected.language
        || String(actual.stem) !== String(learner.stem)
        || String(actual.explanation ?? "") !== String(learner.explanation ?? "")
        || JSON.stringify(actualOptions) !== JSON.stringify(expectedOptions)
        || quality.authority !== BTD_CP014_MATERIALIZATION_AUTHORITY
        || quality.sourceFrozenContentFingerprint !== expected.frozenContentFingerprint
        || quality.sourceQuestionBankAdmissionKey !== expected.sourceQuestionBankAdmissionKey
      ) {
        throw new BtdTestProjectionMaterializationError(
          "EXISTING_PROJECTION_TRANSLATION_DRIFT",
          `${expected.language}: existing BTD projection translation drifted from the frozen source.`,
        );
      }
    }

    return Object.freeze({
      projectionKey: plan.projectionKey,
      questionId: String(existing.questionId),
      questionVersionId: String(existing.questionVersionId),
      publicCode: String(existing.publicCode),
      examVersionId,
      primaryTaxonomyNodeId,
      translationLanguages: Object.freeze(expectedTranslations.map((entry) => entry.language)),
      reused: true,
      testEligible: false,
      mockTestEligible: false,
      publiclyPublishable: false,
    });
  }

  const questionId = randomUUID();
  const questionVersionId = randomUUID();
  const publicCode = questionPublicCode();
  const answerModel = projectedAnswerModel(normalized, {
    projectionKey: plan.projectionKey,
    sourceQuestionId: source.acceptedQuestionId,
    sourceQuestionVersionId: source.acceptedQuestionVersionId,
    sourceAdmissionKey: source.payload.questionBankAdmissionKey,
    sourceGenerationItemId: generationItemId,
  });

  await client`
    INSERT INTO content.questions (
      id, public_code, status, author_user_id, primary_taxonomy_node_id,
      lock_version, created_at, updated_at
    ) VALUES (
      ${questionId}::uuid, ${publicCode}, 'approved'::question_status,
      ${actorUserId}::uuid, ${primaryTaxonomyNodeId}::uuid, 0, now(), now()
    )
  `;
  await client`
    INSERT INTO content.question_versions (
      id, question_id, version_number, exam_version_id, question_type,
      difficulty, stem, explanation, answer_model, default_marks,
      default_negative_marks, change_reason, created_by, created_at
    ) VALUES (
      ${questionVersionId}::uuid, ${questionId}::uuid, 1, ${examVersionId}::uuid,
      'mcq_single', ${normalized.difficulty}, ${normalized.stem}, ${normalized.explanation},
      ${JSON.stringify(answerModel)}::jsonb, 1, 0,
      'BTD CP014 exam-scoped projection materialized; scored-test eligibility remains locked',
      ${actorUserId}::uuid, now()
    )
  `;
  for (let index = 0; index < normalized.options.length; index += 1) {
    await client`
      INSERT INTO content.question_options (
        id, question_version_id, option_key, text, sort_order, is_correct
      ) VALUES (
        ${randomUUID()}::uuid, ${questionVersionId}::uuid, ${optionKey(index)},
        ${normalized.options[index]}, ${index + 1}, ${index === normalized.correctIndex}
      )
    `;
  }
  await client`
    INSERT INTO content.question_taxonomy_links (question_version_id, taxonomy_node_id, is_primary)
    VALUES (${questionVersionId}::uuid, ${primaryTaxonomyNodeId}::uuid, true)
  `;
  await client`
    UPDATE content.questions
    SET current_draft_version_id = ${questionVersionId}::uuid,
        approved_version_id = ${questionVersionId}::uuid,
        updated_at = now()
    WHERE id = ${questionId}::uuid
  `;

  const translationLanguages: string[] = [];
  for (const translation of plan.translations) {
    const languageId = languageIds.get(translation.language);
    if (!languageId) continue;
    const learner = translation.learner as AnyRecord;
    const translationId = randomUUID();
    await client`
      INSERT INTO content.question_translations (
        id, question_version_id, language_id, stem, explanation, status,
        translator_user_id, submitted_at, reviewer_user_id, reviewed_at,
        quality_snapshot, created_at, updated_at
      ) VALUES (
        ${translationId}::uuid, ${questionVersionId}::uuid, ${languageId}::uuid,
        ${String(learner.stem)}, ${String(learner.explanation ?? "")}, 'approved',
        ${actorUserId}::uuid, now(), ${actorUserId}::uuid, now(),
        ${JSON.stringify({
          approvable: true,
          authority: BTD_CP014_MATERIALIZATION_AUTHORITY,
          sourceFreezeVersion: learner.freezeVersion,
          sourceFrozenContentFingerprint: translation.frozenContentFingerprint,
          sourceQuestionBankAdmissionKey: translation.sourceQuestionBankAdmissionKey,
          bypassReason: "Already manually reviewed and frozen by BTD CP009 multilingual authority",
        })}::jsonb,
        now(), now()
      )
    `;
    const localizedOptions = Array.isArray(learner.options) ? learner.options.map(String) : [];
    if (localizedOptions.length !== normalized.options.length || Number(learner.correctIndex) !== normalized.correctIndex) {
      throw new BtdTestProjectionMaterializationError("TRANSLATION_OPTION_PARITY_DRIFT", `${translation.language}: frozen translation option ownership drifted.`);
    }
    for (let index = 0; index < localizedOptions.length; index += 1) {
      await client`
        INSERT INTO content.question_translation_options (
          id, question_translation_id, option_key, text, sort_order, created_at, updated_at
        ) VALUES (
          ${randomUUID()}::uuid, ${translationId}::uuid, ${optionKey(index)},
          ${localizedOptions[index]}, ${index + 1}, now(), now()
        )
      `;
    }
    translationLanguages.push(translation.language);
  }

  await client`
    INSERT INTO platform.audit_events (
      id, actor_type, actor_user_id, action_key, entity_type, entity_id,
      entity_version_id, reason, summary, metadata
    ) VALUES (
      ${randomUUID()}::uuid, 'user'::audit_actor_type, ${actorUserId}::uuid,
      'content.question.btd_test_projection.materialized', 'question', ${questionId}::uuid,
      ${questionVersionId}::uuid, ${reason},
      ${`${publicCode} materialized from frozen BTD bank source for exam-scoped test readiness`},
      ${JSON.stringify({
        projectionKey: plan.projectionKey,
        materializationAuthority: BTD_CP014_MATERIALIZATION_AUTHORITY,
        sourceGenerationItemId: generationItemId,
        sourceBankQuestionId: source.acceptedQuestionId,
        sourceBankQuestionVersionId: source.acceptedQuestionVersionId,
        sourceQuestionBankAdmissionKey: source.payload.questionBankAdmissionKey,
        examVersionId,
        primaryTaxonomyNodeId,
        translationLanguages,
        testEligible: false,
        mockTestEligible: false,
        publiclyPublishable: false,
      })}::jsonb
    )
  `;

  return Object.freeze({
    projectionKey: plan.projectionKey,
    questionId,
    questionVersionId,
    publicCode,
    examVersionId,
    primaryTaxonomyNodeId,
    translationLanguages: Object.freeze(translationLanguages),
    reused: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
  });
}
