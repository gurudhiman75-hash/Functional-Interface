import assert from "node:assert/strict";

import { MIS_CP001_CANDIDATE_IDS } from "./MIS-CP-001/generator";
import { MIS_CP002_CANDIDATE_IDS } from "./MIS-CP-002/generator";
import { MIS_CP003_CANDIDATE_IDS } from "./MIS-CP-003/generator";
import { MIS_CP004_CANDIDATE_IDS } from "./MIS-CP-004/generator";
import { MIS_CP005_CANDIDATE_IDS } from "./MIS-CP-005/generator";
import { MIS_CP006_CANDIDATE_IDS } from "./MIS-CP-006/generator";
import { MIS_CP007_CANDIDATE_IDS } from "./MIS-CP-007/generator";
import { MIS_CP008_CANDIDATE_IDS } from "./MIS-CP-008/generator";
import { MIS_CP009_CANDIDATE_IDS } from "./MIS-CP-009/generator";
import { MIS_CP010_CANDIDATE_IDS } from "./MIS-CP-010/generator";
import { MIS_CP011_CANDIDATE_IDS } from "./MIS-CP-011/generator";
import { MIS_CP012_CANDIDATE_IDS } from "./MIS-CP-012/generator";
import {
  MIS_001_CANDIDATE_TO_PROPOSED_SKILL_V1,
  MIS_001_EXCLUDED_CANDIDATES_V1,
  MIS_001_MERGE_SPLIT_WAVE03_V1 as audit,
  MIS_001_PROPOSED_SKILL_CONTRACTS_V1,
  MIS_001_SOURCE_THIN_HOLD_CANDIDATES_V1,
  mis001ProposedSkillForCandidateV1,
} from "./mis-001-merge-split-wave03-v1";

const runtime = [
  ...MIS_CP001_CANDIDATE_IDS,
  ...MIS_CP002_CANDIDATE_IDS,
  ...MIS_CP003_CANDIDATE_IDS,
  ...MIS_CP004_CANDIDATE_IDS,
  ...MIS_CP005_CANDIDATE_IDS,
  ...MIS_CP006_CANDIDATE_IDS,
  ...MIS_CP007_CANDIDATE_IDS,
  ...MIS_CP008_CANDIDATE_IDS,
  ...MIS_CP009_CANDIDATE_IDS,
  ...MIS_CP010_CANDIDATE_IDS,
  ...MIS_CP011_CANDIDATE_IDS,
  ...MIS_CP012_CANDIDATE_IDS,
];

assert.equal(runtime.length, 82);
assert.equal(new Set(runtime).size, 82);
assert.equal(audit.activeRuntimePatternCount, 82);
assert.equal(audit.excludedInvalidCount, 1);
assert.deepEqual(MIS_001_EXCLUDED_CANDIDATES_V1, ["MIS-CAND-078"]);
assert.equal(runtime.includes("MIS-CAND-078" as any), false);

assert.equal(MIS_001_PROPOSED_SKILL_CONTRACTS_V1.length, 9);
assert.equal(new Set(MIS_001_PROPOSED_SKILL_CONTRACTS_V1.map((x) => x.skillId)).size, 9);
assert.equal(Object.keys(MIS_001_CANDIDATE_TO_PROPOSED_SKILL_V1).length, 82);

for (const candidateId of runtime) {
  assert.match(mis001ProposedSkillForCandidateV1(candidateId), /^MIS-SKILL-00[1-9]$/u);
}

assert.deepEqual([...MIS_001_SOURCE_THIN_HOLD_CANDIDATES_V1], ["MIS-CAND-034","MIS-CAND-072"]);
for (const held of MIS_001_SOURCE_THIN_HOLD_CANDIDATES_V1) {
  assert.ok(runtime.includes(held as any));
  assert.ok(mis001ProposedSkillForCandidateV1(held));
}

const expectedDistribution = {
  "MIS-SKILL-001": 7,
  "MIS-SKILL-002": 5,
  "MIS-SKILL-003": 8,
  "MIS-SKILL-004": 16,
  "MIS-SKILL-005": 9,
  "MIS-SKILL-006": 9,
  "MIS-SKILL-007": 7,
  "MIS-SKILL-008": 15,
  "MIS-SKILL-009": 6,
};
const actualDistribution = Object.values(MIS_001_CANDIDATE_TO_PROPOSED_SKILL_V1)
  .reduce<Record<string, number>>((acc, skillId) => {
    acc[skillId] = (acc[skillId] ?? 0) + 1;
    return acc;
  }, {});
assert.deepEqual(actualDistribution, expectedDistribution);

assert.equal(audit.formulaChangeCreatesNewSkill, false);
assert.equal(audit.rendererChangeCreatesNewSkill, false);
assert.equal(audit.missingPositionCreatesNewSkill, false);
assert.equal(audit.evidenceCountCreatesNewSkill, false);
assert.equal(audit.ruleCompetitionCreatesNewSkill, false);
assert.equal(audit.permanentQlAllocationAllowed, false);
assert.equal(audit.nextWave, "LEARNER_SURFACE_EXAM_REALISM_AND_EXPLANATION_AUDIT");

console.log(JSON.stringify({
  verdict: "PASS_MIS_001_MERGE_SPLIT_WAVE03",
  activeRuntimePatterns: runtime.length,
  proposedSkillContracts: audit.proposedSkillContractCount,
  distribution: actualDistribution,
  sourceThinHolds: MIS_001_SOURCE_THIN_HOLD_CANDIDATES_V1,
  excludedInvalid: MIS_001_EXCLUDED_CANDIDATES_V1,
  nextWave: audit.nextWave,
}, null, 2));
