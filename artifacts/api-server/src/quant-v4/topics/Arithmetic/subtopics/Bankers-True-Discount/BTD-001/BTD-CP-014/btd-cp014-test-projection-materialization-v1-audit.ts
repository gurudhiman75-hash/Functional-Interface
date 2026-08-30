import { optionKey } from "../../../../../../lib/admin-question-conversion";
import {
  assertBtdCp014SourceRowMatchesPlanV1,
  buildBtdCp014ProjectionAnswerModelV1,
  type BtdCp014SourceBankRow,
} from "../../../../../../lib/admin-btd-test-projection-materialization";
import { BTD_PERMANENT_QL_REGISTRY } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import {
  BTD_CP014_PROJECTION_LANGUAGES,
  BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY,
  BTD_CP014_TEST_PROJECTION_MATERIALIZATION_VERSION,
  buildBtdCp014TestProjectionMaterializationPlanV1,
} from "./btd-cp014-test-projection-materialization-v1";

const AUDIT_VERSION = "BTD-001-CP014-TEST-PROJECTION-MATERIALIZATION-AUDIT-v1";
const EXAM_A = "11111111-1111-4111-8111-111111111111";
const EXAM_B = "22222222-2222-4222-8222-222222222222";
const TAX_A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const TAX_B = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const TAX_CHILD = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function exact(value: unknown): string {
  return JSON.stringify(value);
}
function deepFrozen(value: unknown, seen = new WeakSet<object>()): boolean {
  if (!value || typeof value !== "object") return true;
  const objectValue = value as object;
  if (seen.has(objectValue)) return true;
  seen.add(objectValue);
  if (!Object.isFrozen(objectValue)) return false;
  return Reflect.ownKeys(objectValue).every((key) => deepFrozen((objectValue as Record<PropertyKey, unknown>)[key], seen));
}
function expectThrow(fn: () => unknown, fragment: string) {
  try {
    fn();
  } catch (error) {
    assert(error instanceof Error && error.message.includes(fragment), `Expected error containing '${fragment}', received '${String(error)}'.`);
    return;
  }
  throw new Error(`Expected throw containing '${fragment}'.`);
}

function sourceRowFromPlan(
  plan: ReturnType<typeof buildBtdCp014TestProjectionMaterializationPlanV1>,
  language: typeof BTD_CP014_PROJECTION_LANGUAGES[number],
): BtdCp014SourceBankRow {
  const readiness = plan.sources[language];
  const payload = readiness.sourceBankPayload as Readonly<Record<string, any>>;
  const options = (payload.options as readonly unknown[]).map((text, index) => ({
    key: optionKey(index),
    text: String(text),
    sortOrder: index + 1,
    isCorrect: index === Number(payload.correctIndex),
  }));
  return Object.freeze({
    questionId: `${language === "en" ? "11111111" : language === "hi" ? "22222222" : "33333333"}-1234-4123-8123-123456789012`,
    questionVersionId: `${language === "en" ? "44444444" : language === "hi" ? "55555555" : "66666666"}-1234-4123-8123-123456789012`,
    publicCode: `Q-${language.toUpperCase()}-SOURCE`,
    status: "approved",
    questionType: "mcq_single",
    difficulty: String(payload.difficulty),
    stem: String(payload.stem),
    explanation: `${language.toUpperCase()} frozen explanation`,
    answerModel: {
      kind: "single_choice",
      generation: {
        providerQuestionId: readiness.sourceQuestionBankAdmissionKey,
        packageId: "BTD-001",
        qlId: plan.qlId,
        language,
        questionBankAcceptanceMode: "BANK_ONLY",
        questionBankAcceptanceAuthority: readiness.sourceQuestionBankAcceptanceAuthority,
        testEligible: false,
        mockTestEligible: false,
        publiclyPublishable: false,
      },
    },
    patternId: null,
    defaultMarks: 1,
    defaultNegativeMarks: 0,
    targetTimeSeconds: null,
    options,
  });
}

const projectionKeys = new Map<string, string>();
const scopeKeys = new Map<string, Set<string>>();
let plansValidated = 0;
let sourceParityChecks = 0;
let deterministicChecks = 0;
let scopeIsolationChecks = 0;
let lifecycleChecks = 0;
let answerModelChecks = 0;
let freezeChecks = 0;

for (const entry of BTD_PERMANENT_QL_REGISTRY) {
  for (let seedIndex = 0; seedIndex < 50; seedIndex += 1) {
    const seed = `btd-cp014:${entry.qlId}:${seedIndex}`;
    const planA = buildBtdCp014TestProjectionMaterializationPlanV1({
      qlId: entry.qlId,
      seed,
      examVersionId: EXAM_A,
      primaryTaxonomyNodeId: TAX_A,
      taxonomyNodeIds: [TAX_CHILD, TAX_A, TAX_CHILD],
    });
    const replay = buildBtdCp014TestProjectionMaterializationPlanV1({
      qlId: entry.qlId,
      seed,
      examVersionId: EXAM_A.toUpperCase(),
      primaryTaxonomyNodeId: TAX_A.toUpperCase(),
      taxonomyNodeIds: [TAX_A, TAX_CHILD],
    });
    const planB = buildBtdCp014TestProjectionMaterializationPlanV1({
      qlId: entry.qlId,
      seed,
      examVersionId: EXAM_B,
      primaryTaxonomyNodeId: TAX_B,
      taxonomyNodeIds: [TAX_B],
    });

    assert(planA.materializationVersion === BTD_CP014_TEST_PROJECTION_MATERIALIZATION_VERSION, `${entry.qlId}: materialization authority mismatch.`);
    assert(planA.projectionDocument.baseLanguage === "en", `${entry.qlId}: projection base must be English.`);
    assert(exact(planA.projectionDocument.translationLanguages) === exact(["hi", "pa"]), `${entry.qlId}: translation set mismatch.`);
    assert(exact(planA.taxonomyNodeIds) === exact([TAX_A, TAX_CHILD].sort()), `${entry.qlId}: taxonomy canonicalization failed.`);
    assert(planA.projectionBundleKey === replay.projectionBundleKey, `${entry.qlId}: deterministic replay drifted.`);
    deterministicChecks += 1;
    assert(planA.projectionBundleKey !== planB.projectionBundleKey, `${entry.qlId}: cross-exam projection key failed to isolate scope.`);
    scopeIsolationChecks += 1;

    for (const language of BTD_CP014_PROJECTION_LANGUAGES) {
      const source = sourceRowFromPlan(planA, language);
      assertBtdCp014SourceRowMatchesPlanV1(source, planA.sources[language], language);
      sourceParityChecks += 1;
    }
    const sources = Object.freeze({
      en: sourceRowFromPlan(planA, "en"),
      hi: sourceRowFromPlan(planA, "hi"),
      pa: sourceRowFromPlan(planA, "pa"),
    });
    const answerModel = buildBtdCp014ProjectionAnswerModelV1(sources.en.answerModel, planA, sources);
    const generation = (answerModel as any).generation;
    assert(generation.providerQuestionId === planA.projectionBundleKey, `${entry.qlId}: projected provider identity mismatch.`);
    assert(generation.language === "en", `${entry.qlId}: projected base language is not canonical English.`);
    assert(generation.testProjectionMaterialized === true, `${entry.qlId}: materialization marker missing.`);
    assert(generation.testProjectionAuthority === BTD_CP014_TEST_PROJECTION_MATERIALIZATION_VERSION, `${entry.qlId}: projection authority mismatch.`);
    assert(generation.testEligibility === "INELIGIBLE" && generation.testEligible === false, `${entry.qlId}: scored-test gate opened during materialization.`);
    assert(generation.mockTestEligible === false && generation.publiclyPublishable === false, `${entry.qlId}: downstream delivery gate opened during materialization.`);
    assert(generation.questionBankAcceptanceMode === "TEST_PROJECTION", `${entry.qlId}: projection retained source BANK_ONLY identity.`);
    assert(exact(generation.sourceQuestionBankAdmissionKeys) === exact(planA.projectionDocument.sourceAdmissionKeys), `${entry.qlId}: source admission provenance drifted.`);
    answerModelChecks += 8;

    const prior = projectionKeys.get(planA.projectionBundleKey);
    assert(!prior || prior === `${entry.qlId}:${seed}`, `${entry.qlId}: unsafe projection-key collision with ${prior}.`);
    projectionKeys.set(planA.projectionBundleKey, `${entry.qlId}:${seed}`);
    const scopeId = `${entry.qlId}:EXAM_A`;
    const scope = scopeKeys.get(scopeId) ?? new Set<string>();
    scope.add(planA.projectionBundleKey);
    scopeKeys.set(scopeId, scope);

    assert(planA.lifecycle.testProjectionMaterializationApproved === true, `${entry.qlId}: materialization approval missing.`);
    assert(planA.lifecycle.materializedQuestionStatus === "approved" && planA.lifecycle.materializedQuestionPublished === false, `${entry.qlId}: projection staging lifecycle mismatch.`);
    assert(planA.lifecycle.testEligibilityApprovalGranted === false && planA.lifecycle.testEligible === false, `${entry.qlId}: test eligibility was granted prematurely.`);
    assert(planA.lifecycle.mockTestEligible === false && planA.lifecycle.publiclyPublishable === false, `${entry.qlId}: mock/public gate opened prematurely.`);
    lifecycleChecks += 8;

    assert(deepFrozen(planA), `${entry.qlId}: plan is not deeply frozen.`);
    assert(JSON.parse(JSON.stringify(planA)).projectionBundleKey === planA.projectionBundleKey, `${entry.qlId}: plan is not JSON-native.`);
    freezeChecks += 2;
    plansValidated += 1;
  }
}

for (const [scopeId, keys] of scopeKeys) {
  assert(keys.size === 50, `${scopeId}: expected 50/50 projection uniqueness, received ${keys.size}.`);
}

const negativePlan = buildBtdCp014TestProjectionMaterializationPlanV1({
  qlId: "BTD-QL-001",
  seed: "btd-cp014:negative",
  examVersionId: EXAM_A,
  primaryTaxonomyNodeId: TAX_A,
});
const validNegativeSource = sourceRowFromPlan(negativePlan, "en");
expectThrow(() => assertBtdCp014SourceRowMatchesPlanV1({
  ...validNegativeSource,
  answerModel: {
    ...validNegativeSource.answerModel,
    generation: {
      ...(validNegativeSource.answerModel as any).generation,
      testEligible: true,
    },
  },
}, negativePlan.sources.en, "en"), "delivery boundary");
expectThrow(() => assertBtdCp014SourceRowMatchesPlanV1({
  ...validNegativeSource,
  answerModel: {
    ...validNegativeSource.answerModel,
    generation: {
      ...(validNegativeSource.answerModel as any).generation,
      language: "hi",
    },
  },
}, negativePlan.sources.en, "en"), "language metadata");
expectThrow(() => buildBtdCp014TestProjectionMaterializationPlanV1({
  qlId: "BTD-QL-001",
  seed: "x",
  examVersionId: "not-a-uuid",
  primaryTaxonomyNodeId: TAX_A,
}), "exam-version UUID");
expectThrow(() => buildBtdCp014TestProjectionMaterializationPlanV1({
  qlId: "BTD-QL-001",
  seed: "",
  examVersionId: EXAM_A,
  primaryTaxonomyNodeId: TAX_A,
}), "reviewed source seed");

assert(BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.testProjectionMaterializationApproved === true, "CP014 materialization must be explicitly approved.");
assert(BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.testEligible === false, "CP014 must not grant scored-test eligibility.");
assert(BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.mockTestEligible === false, "CP014 must not grant mock-test eligibility.");
assert(BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.publiclyPublishable === false, "CP014 must not grant public delivery.");

console.log(JSON.stringify({
  auditVersion: AUDIT_VERSION,
  materializationVersion: BTD_CP014_TEST_PROJECTION_MATERIALIZATION_VERSION,
  chapterId: "BTD-001",
  checkpointId: "BTD-CP-014",
  permanentQlCount: BTD_PERMANENT_QL_REGISTRY.length,
  languages: BTD_CP014_PROJECTION_LANGUAGES,
  seedsPerQl: 50,
  plansValidated,
  sourceAuthoritiesValidated: plansValidated * BTD_CP014_PROJECTION_LANGUAGES.length,
  sourceParityChecks,
  deterministicChecks,
  scopeIsolationChecks,
  lifecycleChecks,
  answerModelChecks,
  freezeChecks,
  uniqueProjectionBundleKeys: projectionKeys.size,
  unsafeProjectionCollisions: 0,
  minimumQlScopeUnique: Math.min(...[...scopeKeys.values()].map((keys) => keys.size)),
  materializationApproved: BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.testProjectionMaterializationApproved,
  materializedQuestionStatus: BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.materializedQuestionStatus,
  testEligibilityApprovalGranted: BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.testEligibilityApprovalGranted,
  testEligible: BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.testEligible,
  mockTestEligible: BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.mockTestEligible,
  publiclyPublishable: BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.publiclyPublishable,
}, null, 2));
console.log("PASS_BTD_001_CP014_TEST_PROJECTION_MATERIALIZATION_AUDIT_V1");
