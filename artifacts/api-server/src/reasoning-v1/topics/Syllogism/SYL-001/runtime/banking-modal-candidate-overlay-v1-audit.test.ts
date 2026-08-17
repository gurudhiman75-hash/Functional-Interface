import assert from "node:assert/strict";
import {
  bindBankingModalCandidatesV1,
  buildBankingModalCandidateOverlayV1,
  SYL_BANKING_MODAL_CANDIDATE_OVERLAY_V1,
} from "./banking-modal-candidate-overlay-v1";
import { buildSylProfilePlanV3 } from "./profile-plan-v3";

const locales = ["en-IN", "hi-IN", "pa-IN"] as const;
const plan = buildSylProfilePlanV3("BANKING", 731, 100);

assert.deepEqual(plan.readinessCounts, {
  ACTIVE_CANONICAL: 80,
  CANDIDATE_INACTIVE: 20,
  BLOCKED_REMODEL: 0,
  PRACTICE_ONLY: 0,
});
assert.deepEqual(plan.familyCounts, {
  BANK_TWO_CONCLUSION_FIVE_OPTION: 35,
  BANK_EITHER_OR_COMPLEMENTARY: 20,
  BANK_POSSIBILITY_IN_CONCLUSION_SET: 20,
  BANK_ONLY_AND_ONLY_A_FEW: 15,
  BANK_THREE_CONCLUSION_ADVANCED: 10,
});
assert.equal(plan.connectedToGenerator, false);
assert.equal(plan.activationPermitted, false);

const plannerCandidateSlots = plan.slots.filter((slot) =>
  slot.familyId === "BANK_POSSIBILITY_IN_CONCLUSION_SET");
assert.equal(plannerCandidateSlots.length, 20);
assert.ok(plannerCandidateSlots.every((slot) => slot.readiness === "CANDIDATE_INACTIVE"));
assert.ok(plannerCandidateSlots.every((slot) => slot.canonicalQlId === null));
assert.ok(plannerCandidateSlots.every((slot) => slot.registrationRequired));
assert.ok(plannerCandidateSlots.every((slot) =>
  slot.candidateAuthorities.includes("SYL_001_BANKING_POSSIBILITY_EDITORIAL_V3")));
assert.ok(plannerCandidateSlots.every((slot) =>
  slot.candidateAuthorities.includes("SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V4")));
assert.ok(plannerCandidateSlots.every((slot) =>
  !slot.candidateAuthorities.includes("SYL_001_BANKING_POSSIBILITY_SHELL_V2")));

const reference = bindBankingModalCandidatesV1(plan, "en-IN");
assert.equal(reference.length, 20);
assert.equal(new Set(reference.map((binding) => binding.plannerSlotIndex)).size, 20);
assert.deepEqual(
  reference.map((binding) => binding.plannerSlotIndex),
  plannerCandidateSlots.map((slot) => slot.index),
);
assert.equal(reference.filter((binding) => binding.candidateKind === "ORDINARY_POSSIBILITY").length, 10);
assert.equal(reference.filter((binding) => binding.candidateKind === "CAN_NEVER").length, 10);

const repeat = bindBankingModalCandidatesV1(plan, "en-IN");
assert.equal(JSON.stringify(reference), JSON.stringify(repeat), "same planner input must bind identically");

const activeSlotIndexes = new Set(plan.slots
  .filter((slot) => slot.familyId !== "BANK_POSSIBILITY_IN_CONCLUSION_SET")
  .map((slot) => slot.index));
assert.ok(reference.every((binding) => !activeSlotIndexes.has(binding.plannerSlotIndex)));

const coverage = {
  localizedBindings: 0,
  ordinaryPossibility: 0,
  canNever: 0,
  diagrams: 0,
  emittedQlIds: 0,
  invalidLocks: 0,
};

for (const locale of locales) {
  const bindings = buildBankingModalCandidateOverlayV1(731, 100, locale);
  assert.equal(bindings.length, 20);
  assert.equal(bindings.filter((binding) => binding.candidateKind === "ORDINARY_POSSIBILITY").length, 10);
  assert.equal(bindings.filter((binding) => binding.candidateKind === "CAN_NEVER").length, 10);

  bindings.forEach((binding, ordinal) => {
    coverage.localizedBindings += 1;
    assert.equal(binding.authority, "SYL_001_BANKING_MODAL_CANDIDATE_OVERLAY_V1");
    assert.equal(binding.profile, "BANKING");
    assert.equal(binding.plannerAuthority, "SYL_001_PROFILE_PLAN_V3");
    assert.equal(binding.plannerSeed, 731);
    assert.equal(binding.candidateOrdinal, ordinal);
    assert.equal(binding.familyId, "BANK_POSSIBILITY_IN_CONCLUSION_SET");
    assert.equal(binding.readiness, "CANDIDATE_INACTIVE");
    assert.equal(binding.canonicalQlId, null);
    assert.equal(binding.locale, locale);
    assert.ok(Number.isSafeInteger(binding.candidateSeed));
    assert.ok(binding.question.statements.length >= 2);
    assert.equal(binding.question.conclusions.length, 2);
    assert.equal(binding.question.options.length, 5);
    assert.ok(binding.question.correctIndex >= 0 && binding.question.correctIndex < 5);
    assert.equal(binding.question.locale, locale);
    assert.equal(binding.question.seed, binding.candidateSeed);

    if ("qlId" in binding.question) coverage.emittedQlIds += 1;

    const locks = binding.policy;
    if (
      locks.registeredQlCreated
      || locks.connectedToProductionGenerator
      || locks.questionStudioVisible
      || locks.questionBankWritable
      || locks.testEligible
      || locks.publiclyPublishable
      || locks.sourceFrequencyClaim
      || locks.activationPermitted
    ) coverage.invalidLocks += 1;

    assert.ok("editorialAuthority" in binding.question);
    assert.ok("diagram" in binding.question);
    assert.ok("visualPolicy" in binding.question);
    if (
      "diagram" in binding.question
      && "visualPolicy" in binding.question
    ) {
      assert.equal(binding.question.diagram.enabled, true);
      assert.equal(binding.question.diagram.premiseOnly, true);
      assert.equal(binding.question.diagram.diagramCount, 1);
      assert.equal(binding.question.visualPolicy.stemDiagram, "NONE");
      assert.equal(binding.question.visualPolicy.solutionDiagram, "ONE_COMBINED_PREMISE_DIAGRAM");
      assert.equal(binding.question.visualPolicy.disclosure, "AFTER_ATTEMPT");
      assert.equal(binding.question.visualPolicy.separateConclusionDiagrams, false);
      coverage.diagrams += 1;
    }

    if (binding.candidateKind === "ORDINARY_POSSIBILITY") {
      coverage.ordinaryPossibility += 1;
      assert.equal(binding.candidateAuthority, "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V3");
      assert.equal(binding.question.authority, "SYL_001_BANKING_POSSIBILITY_SHELL_V2");
      assert.ok("semanticAuthority" in binding.question);
      if ("editorialAuthority" in binding.question) {
        assert.equal(binding.question.editorialAuthority, "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V3");
      }
      if ("semanticAuthority" in binding.question) {
        assert.equal(binding.question.semanticAuthority, "SYL_001_BANKING_POSSIBILITY_SHELL_V2");
      }
    } else {
      coverage.canNever += 1;
      assert.equal(binding.candidateAuthority, "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V4");
      assert.equal(binding.question.authority, "SYL_001_BANKING_CAN_NEVER_BE_SHELL_V2");
      if ("editorialAuthority" in binding.question) {
        assert.equal(binding.question.editorialAuthority, "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V4");
      }
    }

    assert.equal(binding.question.metadata.registeredQlCreated, false);
    assert.equal(binding.question.metadata.connectedToProfilePlanner, false);
    assert.equal(binding.question.metadata.questionStudioVisible, false);
    assert.equal(binding.question.metadata.questionBankWritable, false);
    assert.equal(binding.question.metadata.testEligible, false);
    assert.equal(binding.question.metadata.publiclyPublishable, false);
  });
}

assert.deepEqual(
  locales.map((locale) => buildBankingModalCandidateOverlayV1(731, 100, locale).map((binding) => ({
    slot: binding.plannerSlotIndex,
    ordinal: binding.candidateOrdinal,
    kind: binding.candidateKind,
    seed: binding.candidateSeed,
  }))),
  locales.map(() => reference.map((binding) => ({
    slot: binding.plannerSlotIndex,
    ordinal: binding.candidateOrdinal,
    kind: binding.candidateKind,
    seed: binding.candidateSeed,
  }))),
  "locale must not change slot/kind/seed binding",
);

assert.throws(
  () => bindBankingModalCandidatesV1(buildSylProfilePlanV3("SSC", 731, 100), "en-IN"),
  /only the BANKING profile/,
);

assert.equal(coverage.localizedBindings, 60);
assert.equal(coverage.ordinaryPossibility, 30);
assert.equal(coverage.canNever, 30);
assert.equal(coverage.diagrams, 60);
assert.equal(coverage.emittedQlIds, 0);
assert.equal(coverage.invalidLocks, 0);
assert.deepEqual(SYL_BANKING_MODAL_CANDIDATE_OVERLAY_V1.candidateAuthorities, [
  "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V3",
  "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V4",
]);
assert.deepEqual(SYL_BANKING_MODAL_CANDIDATE_OVERLAY_V1.semanticAuthorities, [
  "SYL_001_BANKING_POSSIBILITY_SHELL_V2",
  "SYL_001_BANKING_CAN_NEVER_BE_SHELL_V2",
]);
assert.equal(SYL_BANKING_MODAL_CANDIDATE_OVERLAY_V1.evaluationCoverageIsExamFrequencyClaim, false);
assert.equal(SYL_BANKING_MODAL_CANDIDATE_OVERLAY_V1.permanentQlIdCreated, false);
assert.equal(SYL_BANKING_MODAL_CANDIDATE_OVERLAY_V1.connectedToProductionGenerator, false);
assert.equal(SYL_BANKING_MODAL_CANDIDATE_OVERLAY_V1.questionStudioVisible, false);
assert.equal(SYL_BANKING_MODAL_CANDIDATE_OVERLAY_V1.questionBankWritable, false);
assert.equal(SYL_BANKING_MODAL_CANDIDATE_OVERLAY_V1.testEligible, false);
assert.equal(SYL_BANKING_MODAL_CANDIDATE_OVERLAY_V1.publiclyPublishable, false);
assert.equal(SYL_BANKING_MODAL_CANDIDATE_OVERLAY_V1.activationPermitted, false);

console.log(JSON.stringify({
  status: "PASS_SYL_001_BANKING_MODAL_CANDIDATE_OVERLAY_V1",
  plannerAuthority: plan.authority,
  plannerSeed: plan.seed,
  requestedSlots: plan.requestedCount,
  readiness: plan.readinessCounts,
  familyCounts: plan.familyCounts,
  candidateSlots: reference.length,
  candidateAuthorities: SYL_BANKING_MODAL_CANDIDATE_OVERLAY_V1.candidateAuthorities,
  semanticAuthorities: SYL_BANKING_MODAL_CANDIDATE_OVERLAY_V1.semanticAuthorities,
  evaluationCoveragePer100: {
    ORDINARY_POSSIBILITY: 10,
    CAN_NEVER: 10,
  },
  localizedBindingsAudited: coverage.localizedBindings,
  diagrams: coverage.diagrams,
  localeBindingParity: true,
  deterministicRepeat: true,
  nonCandidateFamiliesIntercepted: 0,
  permanentQlIdCreated: false,
  emittedQlIds: coverage.emittedQlIds,
  sourceFrequencyClaim: false,
  connectedToProductionGenerator: false,
  questionStudioVisible: false,
  questionBankWritable: false,
  testEligible: false,
  publiclyPublishable: false,
  activationPermitted: false,
}, null, 2));