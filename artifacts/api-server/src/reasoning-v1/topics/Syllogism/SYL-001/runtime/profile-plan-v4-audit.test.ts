import assert from "node:assert/strict";
import type { SylLocale } from "../foundation/types";
import { buildSylProfilePlanV3 } from "./profile-plan-v3";
import { buildSylProfilePlanV4 } from "./profile-plan-v4";
import { buildBankingModalCandidateOverlayV2 } from "./banking-modal-candidate-overlay-v2";

const profiles = ["SSC", "BANKING", "PUNJAB_POLICE", "CROSS_EXAM_PRACTICE"] as const;
for (const profile of profiles) {
  const before = buildSylProfilePlanV3(profile, 911, 200);
  const after = buildSylProfilePlanV4(profile, 911, 200);

  assert.equal(after.authority, "SYL_001_PROFILE_PLAN_V4");
  assert.equal(after.profile, before.profile);
  assert.equal(after.seed, before.seed);
  assert.equal(after.requestedCount, before.requestedCount);
  assert.deepEqual(after.readinessCounts, before.readinessCounts);
  assert.deepEqual(after.familyCounts, before.familyCounts);
  assert.equal(after.connectedToGenerator, false);
  assert.equal(after.activationPermitted, false);

  assert.equal(after.slots.length, before.slots.length);
  for (let index = 0; index < after.slots.length; index += 1) {
    const prior = before.slots[index]!;
    const current = after.slots[index]!;
    assert.equal(current.index, prior.index);
    assert.equal(current.cycle, prior.cycle);
    assert.equal(current.sourcePercentileSlot, prior.sourcePercentileSlot);
    assert.equal(current.familyId, prior.familyId);
    assert.equal(current.archetypeId, prior.archetypeId);
    assert.equal(current.canonicalQlId, prior.canonicalQlId);
    assert.equal(current.scenarioVariant, prior.scenarioVariant);
    assert.equal(current.readiness, prior.readiness);
    assert.equal(current.registrationRequired, prior.registrationRequired);

    if (current.familyId === "BANK_POSSIBILITY_IN_CONCLUSION_SET") {
      assert.deepEqual(current.candidateAuthorities, [
        "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V4",
        "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V6",
      ]);
    }
  }
}

const locales: readonly SylLocale[] = ["en-IN", "hi-IN", "pa-IN"];
let records = 0;
for (const locale of locales) {
  const first = buildBankingModalCandidateOverlayV2(731, 100, locale);
  const second = buildBankingModalCandidateOverlayV2(731, 100, locale);
  assert.deepEqual(first, second);
  assert.equal(first.length, 20);

  for (const binding of first) {
    records += 1;
    assert.equal(binding.authority, "SYL_001_BANKING_MODAL_CANDIDATE_OVERLAY_V2");
    assert.equal(binding.plannerAuthority, "SYL_001_PROFILE_PLAN_V4");
    assert.equal(binding.readiness, "CANDIDATE_INACTIVE");
    assert.equal(binding.canonicalQlId, null);
    assert.equal(binding.policy.registeredQlCreated, false);
    assert.equal(binding.policy.connectedToProductionGenerator, false);
    assert.equal(binding.policy.questionStudioVisible, false);
    assert.equal(binding.policy.questionBankWritable, false);
    assert.equal(binding.policy.testEligible, false);
    assert.equal(binding.policy.publiclyPublishable, false);
    assert.equal(binding.policy.sourceFrequencyClaim, false);
    assert.equal(binding.policy.activationPermitted, false);

    if (binding.candidateKind === "ORDINARY_POSSIBILITY") {
      assert.equal(binding.candidateAuthority, "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V4");
      assert.equal(binding.question.editorialAuthority, "SYL_001_BANKING_POSSIBILITY_EDITORIAL_V4");
    } else {
      assert.equal(binding.candidateAuthority, "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V6");
      assert.equal(binding.question.editorialAuthority, "SYL_001_BANKING_CAN_NEVER_BE_EDITORIAL_V6");
    }
  }
}

assert.equal(records, 60);

console.log(JSON.stringify({
  status: "PASS_SYL_001_PROFILE_PLAN_V4_CURRENT_BANKING_CANDIDATES",
  records,
  permanentQlCreated: false,
  connectedToGenerator: false,
  activationPermitted: false,
}, null, 2));
