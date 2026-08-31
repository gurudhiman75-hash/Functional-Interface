import assert from "node:assert/strict";

import { BTD_PERMANENT_QL_REGISTRY } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import { buildBtdCp012QuestionBankAdmissionPreviewV1 } from "../BTD-CP-012/btd-cp012-question-bank-admission-v1";
import { buildBtdCp013ScoredTestProjectionReadinessV1 } from "../BTD-CP-013/btd-cp013-scored-test-projection-readiness-v1";
import {
  BTD_CP014_MATERIALIZATION_AUTHORITY,
  BTD_CP014_SCORED_TEST_PROJECTION_MATERIALIZATION_BOUNDARY,
  BTD_CP014_SCORED_TEST_PROJECTION_MATERIALIZATION_VERSION,
  buildBtdCp014ScoredTestProjectionMaterializationPlanV1,
} from "./btd-cp014-scored-test-projection-materialization-v1";
import {
  materializeBtdCp014ScoredTestProjectionV1,
} from "../../../../../../../lib/admin-btd-test-projection-materialization";
import { normalizeGeneratedQuestionPayload, optionKey } from "../../../../../../../lib/admin-question-conversion";

const EXAM_A = "11111111-1111-4111-8111-111111111111";
const TAX_A = "22222222-2222-4222-8222-222222222222";
const EXAM_B = "33333333-3333-4333-8333-333333333333";
const TAX_B = "44444444-4444-4444-8444-444444444444";
const SOURCE_ITEM = "55555555-5555-4555-8555-555555555555";
const SOURCE_Q = "66666666-6666-4666-8666-666666666666";
const SOURCE_V = "77777777-7777-4777-8777-777777777777";
const PROJECTED_Q = "88888888-8888-4888-8888-888888888888";
const PROJECTED_V = "99999999-9999-4999-8999-999999999999";
const ACTOR = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

type AnyRecord = Record<string, any>;

function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonical(record[key])}`).join(",")}}`;
  }
  return JSON.stringify(value);
}

function learner(question: AnyRecord) {
  return {
    qlId: question.qlId,
    language: question.language,
    stem: question.stem,
    options: question.options,
    correctIndex: question.correctIndex,
    answer: question.answer,
    explanation: question.explanation,
    semanticSignature: question.semanticSignature,
    answerSemantic: question.answerSemantic,
    frozenContentFingerprint: question.frozenContentFingerprint,
    frozenChapterFingerprint: question.frozenChapterFingerprint,
    freezeVersion: question.freezeVersion,
  };
}

async function proveReusePath(sample: AnyRecord) {
  const normalized = normalizeGeneratedQuestionPayload(sample, {
    itemId: SOURCE_ITEM,
    generationRunCode: "GEN-CP014-AUDIT",
  });
  const calls: string[] = [];
  let invocation = 0;
  const fakeClient = (async (strings: TemplateStringsArray, ..._values: unknown[]) => {
    const sql = strings.join("?");
    calls.push(sql);
    invocation += 1;
    if (invocation === 1) {
      return [{
        id: SOURCE_ITEM,
        status: "approved",
        acceptedQuestionId: SOURCE_Q,
        acceptedQuestionVersionId: SOURCE_V,
        payload: sample,
        generationRunCode: "GEN-CP014-AUDIT",
      }];
    }
    if (invocation === 2) {
      return [{
        status: "approved",
        approvedVersionId: SOURCE_V,
        stem: normalized.stem,
        explanation: normalized.explanation,
        difficulty: normalized.difficulty,
        answerModel: normalized.answerModel,
        options: normalized.options.map((text, index) => ({
          key: optionKey(index), text, isCorrect: index === normalized.correctIndex, sortOrder: index + 1,
        })),
      }];
    }
    if (invocation === 3) return [{ id: EXAM_A }];
    if (invocation === 4) return [{ id: TAX_A }];
    if (invocation === 5) {
      return [
        { id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", code: "en" },
        { id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc", code: "hi" },
        { id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd", code: "pa" },
      ];
    }
    if (invocation === 6) return [];
    if (invocation === 7) return [{ questionId: PROJECTED_Q, questionVersionId: PROJECTED_V, publicCode: "Q-CP014-REUSE" }];
    if (invocation === 8) return [{ code: "hi" }, { code: "pa" }];
    throw new Error(`Unexpected fake SQL call ${invocation}: ${sql.slice(0, 120)}`);
  }) as any;

  const result = await materializeBtdCp014ScoredTestProjectionV1(fakeClient, {
    generationItemId: SOURCE_ITEM,
    examVersionId: EXAM_A,
    primaryTaxonomyNodeId: TAX_A,
    actorUserId: ACTOR,
    reason: "CP014 audit reuse proof",
  });
  assert.equal(result.reused, true);
  assert.equal(result.questionId, PROJECTED_Q);
  assert.equal(result.questionVersionId, PROJECTED_V);
  assert.deepEqual(result.translationLanguages, ["hi", "pa"]);
  assert.equal(result.testEligible, false);
  assert.equal(result.mockTestEligible, false);
  assert.equal(result.publiclyPublishable, false);
  assert.equal(calls.some((sql) => sql.includes("pg_advisory_xact_lock")), true);
  assert.equal(calls.some((sql) => sql.includes("testProjectionKey")), true);
  assert.equal(calls.some((sql) => sql.includes("INSERT INTO content.questions")), false);
  return calls.length;
}

async function main() {
  assert.equal(BTD_PERMANENT_QL_REGISTRY.length, 20);
  assert.equal(BTD_CP014_SCORED_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.testProjectionMaterializationApproved, true);
  assert.equal(BTD_CP014_SCORED_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.testProjectionWriteRouteEnabled, true);
  assert.equal(BTD_CP014_SCORED_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.projectedQuestionStatus, "approved");
  assert.equal(BTD_CP014_SCORED_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.testEligibilityApprovalGranted, false);
  assert.equal(BTD_CP014_SCORED_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.testEligible, false);
  assert.equal(BTD_CP014_SCORED_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.mockTestEligible, false);
  assert.equal(BTD_CP014_SCORED_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.publiclyPublishable, false);

  let plans = 0;
  let learnerParityChecks = 0;
  let deterministicChecks = 0;
  let projectionIdentityChecks = 0;
  let translationChecks = 0;
  let lifecycleChecks = 0;
  let jsonChecks = 0;
  const projectionKeys = new Set<string>();
  const scopeKeys = new Map<string, Set<string>>();
  let reuseSample: AnyRecord | null = null;

  const scopes = [
    { examVersionId: EXAM_A, primaryTaxonomyNodeId: TAX_A },
    { examVersionId: EXAM_B, primaryTaxonomyNodeId: TAX_B },
  ] as const;

  for (const allocation of BTD_PERMANENT_QL_REGISTRY) {
    for (const scope of scopes) {
      const scopeId = `${allocation.qlId}:${scope.examVersionId}`;
      const keys = new Set<string>();
      scopeKeys.set(scopeId, keys);
      for (let index = 0; index < 50; index += 1) {
        const seed = `btd-cp014-audit:${allocation.qlId}:${index}`;
        const english = buildBtdCp012QuestionBankAdmissionPreviewV1(allocation.qlId, seed, "en") as AnyRecord;
        const hindi = buildBtdCp012QuestionBankAdmissionPreviewV1(allocation.qlId, seed, "hi") as AnyRecord;
        const punjabi = buildBtdCp012QuestionBankAdmissionPreviewV1(allocation.qlId, seed, "pa") as AnyRecord;
        const readiness = buildBtdCp013ScoredTestProjectionReadinessV1(
          allocation.qlId,
          seed,
          "en",
          scope.examVersionId,
          scope.primaryTaxonomyNodeId,
        ) as AnyRecord;
        const plan = buildBtdCp014ScoredTestProjectionMaterializationPlanV1({
          qlId: allocation.qlId,
          seed,
          supportedLanguages: ["en", "hi", "pa"],
          ...scope,
        });
        const replay = buildBtdCp014ScoredTestProjectionMaterializationPlanV1({
          qlId: allocation.qlId,
          seed,
          supportedLanguages: ["en", "hi", "pa"],
          ...scope,
        });

        assert.deepEqual(plan.englishLearner, learner(english));
        assert.deepEqual(plan.translations[0]?.learner, learner(hindi));
        assert.deepEqual(plan.translations[1]?.learner, learner(punjabi));
        learnerParityChecks += 3;

        assert.equal(plan.projectionKey, readiness.projectionKey);
        assert.equal(plan.englishSourceQuestionBankAdmissionKey, english.questionBankAdmissionKey);
        assert.equal(plan.examVersionId, scope.examVersionId);
        assert.equal(plan.primaryTaxonomyNodeId, scope.primaryTaxonomyNodeId);
        projectionIdentityChecks += 4;

        assert.equal(canonical(plan), canonical(replay));
        deterministicChecks += 1;

        assert.equal(plan.translations.length, 2);
        assert.equal(plan.translations[0]?.language, "hi");
        assert.equal(plan.translations[1]?.language, "pa");
        assert.equal(plan.translations[0]?.learner.correctIndex, plan.englishLearner.correctIndex);
        assert.equal(plan.translations[1]?.learner.correctIndex, plan.englishLearner.correctIndex);
        assert.equal(plan.translations[0]?.learner.options.length, plan.englishLearner.options.length);
        assert.equal(plan.translations[1]?.learner.options.length, plan.englishLearner.options.length);
        translationChecks += 7;

        assert.equal(plan.lifecycle.testProjectionMaterializationApproved, true);
        assert.equal(plan.lifecycle.testProjectionWriteRouteEnabled, true);
        assert.equal(plan.lifecycle.projectedQuestionStatus, "approved");
        assert.equal(plan.lifecycle.testEligibilityApprovalGranted, false);
        assert.equal(plan.lifecycle.testEligible, false);
        assert.equal(plan.lifecycle.mockTestEligible, false);
        assert.equal(plan.lifecycle.publiclyPublishable, false);
        assert.equal(plan.lifecycle.automaticStudentPublication, false);
        lifecycleChecks += 8;

        assert.doesNotThrow(() => JSON.stringify(plan));
        assert.doesNotThrow(() => JSON.parse(JSON.stringify(plan)));
        jsonChecks += 2;

        assert.equal(projectionKeys.has(plan.projectionKey), false, `${plan.projectionKey}: projection-key collision`);
        projectionKeys.add(plan.projectionKey);
        keys.add(plan.projectionKey);
        plans += 1;
        reuseSample ??= english;
      }
    }
  }

  assert.equal(plans, 2000);
  assert.equal(projectionKeys.size, 2000);
  assert.equal(Math.min(...[...scopeKeys.values()].map((keys) => keys.size)), 50);

  const hiOnly = buildBtdCp014ScoredTestProjectionMaterializationPlanV1({
    qlId: "BTD-QL-001",
    seed: "cp014-language-scope-hi",
    examVersionId: EXAM_A,
    primaryTaxonomyNodeId: TAX_A,
    supportedLanguages: ["en", "hi"],
  });
  assert.deepEqual(hiOnly.translations.map((entry) => entry.language), ["hi"]);
  const enOnly = buildBtdCp014ScoredTestProjectionMaterializationPlanV1({
    qlId: "BTD-QL-001",
    seed: "cp014-language-scope-en",
    examVersionId: EXAM_A,
    primaryTaxonomyNodeId: TAX_A,
    supportedLanguages: ["en"],
  });
  assert.equal(enOnly.translations.length, 0);
  assert.throws(() => buildBtdCp014ScoredTestProjectionMaterializationPlanV1({
    qlId: "BTD-QL-001",
    seed: "cp014-invalid-no-en",
    examVersionId: EXAM_A,
    primaryTaxonomyNodeId: TAX_A,
    supportedLanguages: ["hi", "pa"],
  }), /English as the canonical source language/);

  assert.ok(reuseSample);
  const reusePathSqlCalls = await proveReusePath(reuseSample!);

  console.log(JSON.stringify({
    auditVersion: "BTD-001-CP014-SCORED-TEST-PROJECTION-MATERIALIZATION-AUDIT-v1",
    materializationVersion: BTD_CP014_SCORED_TEST_PROJECTION_MATERIALIZATION_VERSION,
    materializationAuthority: BTD_CP014_MATERIALIZATION_AUTHORITY,
    chapterId: "BTD-001",
    checkpointId: "BTD-CP-014",
    permanentQlCount: BTD_PERMANENT_QL_REGISTRY.length,
    examScopes: scopes.length,
    seedsPerQlPerScope: 50,
    materializationPlansValidated: plans,
    learnerSurfacesValidated: plans * 3,
    learnerParityChecks,
    deterministicChecks,
    projectionIdentityChecks,
    translationChecks,
    lifecycleChecks,
    jsonChecks,
    uniqueProjectionKeys: projectionKeys.size,
    unsafeProjectionCollisions: 0,
    minimumQlExamScopeUnique: Math.min(...[...scopeKeys.values()].map((keys) => keys.size)),
    languageScopeCases: 3,
    reusePathSqlCalls,
    testProjectionMaterializationApproved: true,
    projectedQuestionStatus: "approved",
    testEligibilityApprovalGranted: false,
    testEligible: false,
    mockTestEligible: false,
    publiclyPublishable: false,
  }, null, 2));
  console.log("PASS_BTD_001_CP014_SCORED_TEST_PROJECTION_MATERIALIZATION_AUDIT_V1");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
