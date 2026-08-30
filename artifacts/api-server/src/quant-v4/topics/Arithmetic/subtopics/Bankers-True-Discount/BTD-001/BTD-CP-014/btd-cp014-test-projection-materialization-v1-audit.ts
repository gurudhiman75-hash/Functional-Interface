import { optionKey } from "../../../../../../../lib/admin-question-conversion";
import {
  assertBtdCp014SourceRowMatchesPlanV1,
  buildBtdCp014ProjectionAnswerModelV1,
  type BtdCp014SourceBankRow,
} from "../../../../../../../lib/admin-btd-test-projection-materialization";
import { BTD_PERMANENT_QL_REGISTRY } from "../BTD-CP-002/btd-cp002-permanent-ql-registry-v1";
import {
  BTD_CP014_PROJECTION_LANGUAGES,
  BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY,
  BTD_CP014_TEST_PROJECTION_MATERIALIZATION_VERSION,
  buildBtdCp014TestProjectionMaterializationPlanV1,
} from "./btd-cp014-test-projection-materialization-v1";

const EXAM_A = "11111111-1111-4111-8111-111111111111";
const EXAM_B = "22222222-2222-4222-8222-222222222222";
const TAX_A = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const TAX_B = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const TAX_CHILD = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";

function assert(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}
function expectThrow(fn: () => unknown, fragment: string) {
  try { fn(); } catch (error) {
    assert(error instanceof Error && error.message.includes(fragment), `Expected '${fragment}', received '${String(error)}'.`);
    return;
  }
  throw new Error(`Expected throw containing '${fragment}'.`);
}
function sourceRow(plan: ReturnType<typeof buildBtdCp014TestProjectionMaterializationPlanV1>, language: typeof BTD_CP014_PROJECTION_LANGUAGES[number]): BtdCp014SourceBankRow {
  const expected = plan.sources[language];
  const payload = expected.sourceBankPayload as Readonly<Record<string, any>>;
  return Object.freeze({
    questionId: `${language === "en" ? "11111111" : language === "hi" ? "22222222" : "33333333"}-1234-4123-8123-123456789012`,
    questionVersionId: `${language === "en" ? "44444444" : language === "hi" ? "55555555" : "66666666"}-1234-4123-8123-123456789012`,
    publicCode: `Q-${language.toUpperCase()}-SOURCE`, status: "approved", questionType: "mcq_single",
    difficulty: String(payload.difficulty), stem: String(payload.stem), explanation: `${language}-frozen-explanation`,
    answerModel: { kind: "single_choice", generation: {
      providerQuestionId: expected.sourceQuestionBankAdmissionKey, packageId: "BTD-001", qlId: plan.qlId, language,
      questionBankAcceptanceMode: "BANK_ONLY", questionBankAcceptanceAuthority: expected.sourceQuestionBankAcceptanceAuthority,
      testEligible: false, mockTestEligible: false, publiclyPublishable: false,
    } },
    patternId: null, defaultMarks: 1, defaultNegativeMarks: 0, targetTimeSeconds: null,
    options: (payload.options as readonly unknown[]).map((text, index) => ({
      key: optionKey(index), text: String(text), sortOrder: index + 1, isCorrect: index === Number(payload.correctIndex),
    })),
  });
}

const keyIdentities = new Map<string, string>();
const scopeCounts = new Map<string, Set<string>>();
let plansValidated = 0;
let sourceParityChecks = 0;
let answerModelChecks = 0;
let deterministicChecks = 0;
let scopeIsolationChecks = 0;
let lifecycleChecks = 0;
let safeProjectionRepeats = 0;
let unsafeProjectionCollisions = 0;

for (const entry of BTD_PERMANENT_QL_REGISTRY) {
  const scope = new Set<string>();
  for (let index = 0; index < 50; index += 1) {
    const seed = `btd-cp014:${entry.qlId}:${index}`;
    const plan = buildBtdCp014TestProjectionMaterializationPlanV1({
      qlId: entry.qlId, seed, examVersionId: EXAM_A, primaryTaxonomyNodeId: TAX_A,
      taxonomyNodeIds: [TAX_CHILD, TAX_A, TAX_CHILD],
    });
    const replay = buildBtdCp014TestProjectionMaterializationPlanV1({
      qlId: entry.qlId, seed, examVersionId: EXAM_A.toUpperCase(), primaryTaxonomyNodeId: TAX_A.toUpperCase(),
      taxonomyNodeIds: [TAX_A, TAX_CHILD],
    });
    const otherExam = buildBtdCp014TestProjectionMaterializationPlanV1({
      qlId: entry.qlId, seed, examVersionId: EXAM_B, primaryTaxonomyNodeId: TAX_B,
    });
    assert(plan.projectionBundleKey === replay.projectionBundleKey, `${entry.qlId}: replay drift.`);
    assert(plan.projectionBundleKey !== otherExam.projectionBundleKey, `${entry.qlId}: exam scope collision.`);
    assert(JSON.stringify(plan.taxonomyNodeIds) === JSON.stringify([TAX_A, TAX_CHILD].sort()), `${entry.qlId}: taxonomy canonicalization drift.`);
    deterministicChecks += 1; scopeIsolationChecks += 1;

    const sources = Object.freeze({ en: sourceRow(plan, "en"), hi: sourceRow(plan, "hi"), pa: sourceRow(plan, "pa") });
    for (const language of BTD_CP014_PROJECTION_LANGUAGES) {
      assertBtdCp014SourceRowMatchesPlanV1(sources[language], plan.sources[language], language);
      sourceParityChecks += 1;
    }
    const answerModel = buildBtdCp014ProjectionAnswerModelV1(sources.en.answerModel, plan, sources) as any;
    const generation = answerModel.generation;
    assert(generation.providerQuestionId === plan.projectionBundleKey, `${entry.qlId}: projection identity drift.`);
    assert(generation.language === "en", `${entry.qlId}: projected base is not English.`);
    assert(generation.testProjectionMaterialized === true, `${entry.qlId}: materialization marker missing.`);
    assert(generation.testEligibility === "INELIGIBLE" && generation.testEligible === false, `${entry.qlId}: test gate opened.`);
    assert(generation.mockTestEligible === false && generation.publiclyPublishable === false, `${entry.qlId}: downstream gate opened.`);
    assert(generation.questionBankAcceptanceMode === "TEST_PROJECTION", `${entry.qlId}: source identity leaked into projection identity.`);
    answerModelChecks += 6;

    assert(plan.lifecycle.testProjectionMaterializationApproved === true, `${entry.qlId}: materialization not approved.`);
    assert(plan.lifecycle.materializedQuestionStatus === "approved" && plan.lifecycle.materializedQuestionPublished === false, `${entry.qlId}: staging status drift.`);
    assert(plan.lifecycle.testEligibilityApprovalGranted === false && plan.lifecycle.testEligible === false, `${entry.qlId}: eligibility opened early.`);
    assert(plan.lifecycle.mockTestEligible === false && plan.lifecycle.publiclyPublishable === false, `${entry.qlId}: mock/public gate opened.`);
    lifecycleChecks += 8;

    const identity = JSON.stringify({
      qlId: plan.qlId,
      sourceAdmissionKeys: plan.projectionDocument.sourceAdmissionKeys,
      examVersionId: plan.examVersionId,
      primaryTaxonomyNodeId: plan.primaryTaxonomyNodeId,
      taxonomyNodeIds: plan.taxonomyNodeIds,
    });
    const previousIdentity = keyIdentities.get(plan.projectionBundleKey);
    if (previousIdentity) {
      if (previousIdentity !== identity) {
        unsafeProjectionCollisions += 1;
        throw new Error(`${entry.qlId}: unsafe projection-key collision for ${plan.projectionBundleKey}.`);
      }
      safeProjectionRepeats += 1;
    } else {
      keyIdentities.set(plan.projectionBundleKey, identity);
    }
    scope.add(plan.projectionBundleKey); plansValidated += 1;
  }
  scopeCounts.set(entry.qlId, scope);
}
const minimumQlScopeUnique = Math.min(...[...scopeCounts.values()].map((scope) => scope.size));
for (const [qlId, scope] of scopeCounts) {
  assert(scope.size >= 40, `${qlId}: expected at least 40/50 unique frozen projection states, received ${scope.size}.`);
}

const negative = buildBtdCp014TestProjectionMaterializationPlanV1({ qlId: "BTD-QL-001", seed: "negative", examVersionId: EXAM_A, primaryTaxonomyNodeId: TAX_A });
const valid = sourceRow(negative, "en");
expectThrow(() => assertBtdCp014SourceRowMatchesPlanV1({ ...valid, answerModel: { ...(valid.answerModel as any), generation: { ...(valid.answerModel as any).generation, testEligible: true } } }, negative.sources.en, "en"), "delivery boundary");
expectThrow(() => assertBtdCp014SourceRowMatchesPlanV1({ ...valid, answerModel: { ...(valid.answerModel as any), generation: { ...(valid.answerModel as any).generation, language: "hi" } } }, negative.sources.en, "en"), "language metadata");
expectThrow(() => buildBtdCp014TestProjectionMaterializationPlanV1({ qlId: "BTD-QL-001", seed: "x", examVersionId: "bad", primaryTaxonomyNodeId: TAX_A }), "exam-version UUID");
expectThrow(() => buildBtdCp014TestProjectionMaterializationPlanV1({ qlId: "BTD-QL-001", seed: "", examVersionId: EXAM_A, primaryTaxonomyNodeId: TAX_A }), "reviewed source seed");

assert(BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.testEligible === false, "CP014 must leave test eligibility locked.");
assert(BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.mockTestEligible === false, "CP014 must leave mock eligibility locked.");
assert(BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.publiclyPublishable === false, "CP014 must leave public delivery locked.");

console.log(JSON.stringify({
  auditVersion: "BTD-001-CP014-TEST-PROJECTION-MATERIALIZATION-AUDIT-v1",
  materializationVersion: BTD_CP014_TEST_PROJECTION_MATERIALIZATION_VERSION,
  chapterId: "BTD-001", checkpointId: "BTD-CP-014", permanentQlCount: BTD_PERMANENT_QL_REGISTRY.length,
  languages: BTD_CP014_PROJECTION_LANGUAGES, seedsPerQl: 50, plansValidated,
  sourceAuthoritiesValidated: plansValidated * BTD_CP014_PROJECTION_LANGUAGES.length,
  sourceParityChecks, answerModelChecks, deterministicChecks, scopeIsolationChecks, lifecycleChecks,
  uniqueProjectionBundleKeys: keyIdentities.size, safeProjectionRepeats, unsafeProjectionCollisions,
  minimumQlScopeUnique,
  materializationApproved: BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.testProjectionMaterializationApproved,
  materializedQuestionStatus: BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.materializedQuestionStatus,
  testEligibilityApprovalGranted: BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.testEligibilityApprovalGranted,
  testEligible: BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.testEligible,
  mockTestEligible: BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.mockTestEligible,
  publiclyPublishable: BTD_CP014_TEST_PROJECTION_MATERIALIZATION_BOUNDARY.publiclyPublishable,
}, null, 2));
console.log("PASS_BTD_001_CP014_TEST_PROJECTION_MATERIALIZATION_AUDIT_V1");
