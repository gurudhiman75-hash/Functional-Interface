import assert from "node:assert/strict";
import {
  buildSylProfilePlanV1,
  SYL_PROFILE_PLAN_V1,
  type SylPlanningProfileV1,
} from "./profile-plan-v1";

const expected = {
  SSC: {
    families: {
      SSC_TWO_CONCLUSION_FOUR_OPTION: 55,
      SSC_SINGLE_DEFINITE_SELECTION: 25,
      SSC_COMPLEMENTARY_PAIR: 10,
      SSC_THREE_CONCLUSION_ADVANCED: 10,
    },
    readiness: {
      ACTIVE_CANONICAL: 90,
      BLOCKED_REMODEL: 0,
      PRACTICE_ONLY: 10,
    },
  },
  BANKING: {
    families: {
      BANK_TWO_CONCLUSION_FIVE_OPTION: 35,
      BANK_EITHER_OR_COMPLEMENTARY: 20,
      BANK_POSSIBILITY_IN_CONCLUSION_SET: 20,
      BANK_ONLY_AND_ONLY_A_FEW: 15,
      BANK_THREE_CONCLUSION_ADVANCED: 10,
    },
    readiness: {
      ACTIVE_CANONICAL: 80,
      BLOCKED_REMODEL: 20,
      PRACTICE_ONLY: 0,
    },
  },
  PUNJAB_POLICE: {
    families: {
      PUNJAB_POLICE_TWO_CONCLUSION_FOUR_OPTION: 90,
      PUNJAB_POLICE_THREE_CONCLUSION_FOUR_OPTION: 10,
    },
    readiness: {
      ACTIVE_CANONICAL: 100,
      BLOCKED_REMODEL: 0,
      PRACTICE_ONLY: 0,
    },
  },
  CROSS_EXAM_PRACTICE: {
    families: {
      CROSS_THREE_CONCLUSION_COMBINATION: 60,
      CROSS_MIXED_PRACTICE: 40,
    },
    readiness: {
      ACTIVE_CANONICAL: 60,
      BLOCKED_REMODEL: 0,
      PRACTICE_ONLY: 40,
    },
  },
} as const;

const profiles = Object.keys(expected) as SylPlanningProfileV1[];
const summaries: Record<string, unknown> = {};
const allowedCanonicalQlIds = new Set([
  "SYL-QL-001",
  "SYL-QL-003",
  "SYL-QL-004",
  "SYL-QL-008",
]);

for (const profile of profiles) {
  const first = buildSylProfilePlanV1(profile, 731, 100);
  const repeat = buildSylProfilePlanV1(profile, 731, 100);
  const differentSeed = buildSylProfilePlanV1(profile, 732, 100);

  assert.deepEqual(first, repeat, `${profile}: same seed must reproduce the same plan`);
  assert.notDeepEqual(
    first.slots.map((entry) => entry.sourcePercentileSlot),
    differentSeed.slots.map((entry) => entry.sourcePercentileSlot),
    `${profile}: a different seed should change slot order`,
  );
  assert.equal(first.slots.length, 100);
  assert.deepEqual(first.familyCounts, expected[profile].families);
  assert.deepEqual(first.readinessCounts, expected[profile].readiness);
  assert.equal(first.activationPermitted, false);
  assert.ok(first.slots.every((entry) => entry.index >= 0 && entry.index < 100));
  assert.equal(new Set(first.slots.map((entry) => entry.sourcePercentileSlot)).size, 100);

  for (const slot of first.slots) {
    if (slot.readiness === "ACTIVE_CANONICAL") {
      assert.ok(slot.canonicalQlId, `${profile}/${slot.familyId}: active slot needs a canonical QL`);
      assert.ok(allowedCanonicalQlIds.has(slot.canonicalQlId));
    }
    if (slot.canonicalQlId) assert.ok(allowedCanonicalQlIds.has(slot.canonicalQlId));
  }

  const twoCycles = buildSylProfilePlanV1(profile, -19, 200);
  assert.deepEqual(
    twoCycles.familyCounts,
    Object.fromEntries(
      Object.entries(expected[profile].families).map(([key, value]) => [key, value * 2]),
    ),
  );
  assert.equal(twoCycles.slots.filter((entry) => entry.cycle === 0).length, 100);
  assert.equal(twoCycles.slots.filter((entry) => entry.cycle === 1).length, 100);

  summaries[profile] = {
    familyCounts: first.familyCounts,
    readinessCounts: first.readinessCounts,
    canonicalQlIds: [...new Set(first.slots.map((entry) => entry.canonicalQlId).filter(Boolean))],
  };
}

assert.throws(() => buildSylProfilePlanV1("SSC", 1.5, 10), /safe integer/u);
assert.throws(() => buildSylProfilePlanV1("SSC", 1, 0), /1 through 1000/u);
assert.throws(() => buildSylProfilePlanV1("SSC", 1, 1001), /1 through 1000/u);
assert.equal(SYL_PROFILE_PLAN_V1.status, "PLANNER_ONLY_NOT_CONNECTED_TO_GENERATOR");
assert.equal(SYL_PROFILE_PLAN_V1.activationPermitted, false);

console.log(JSON.stringify({
  status: "PASS_SYL_001_INACTIVE_DETERMINISTIC_PROFILE_PLAN_AUDIT",
  authority: SYL_PROFILE_PLAN_V1.authorityId,
  profiles: summaries,
  blockersExposed: {
    SSC: "10% cross-adapted practice is not mock-active",
    BANKING: "20% possibility-in-conclusion-set requires remodel",
    PUNJAB_POLICE: "plan is structurally available but source profile remains provisional",
    CROSS_EXAM_PRACTICE: "40% is explicitly practice-only",
  },
  activation: {
    status: SYL_PROFILE_PLAN_V1.status,
    permitted: SYL_PROFILE_PLAN_V1.activationPermitted,
    connectedToGenerator: false,
  },
}, null, 2));
