import assert from "node:assert/strict";
import { assessSea001DifficultyV1 } from "./difficulty-v1.ts";

const easy = assessSea001DifficultyV1({
  checkpointId: "SEA-CP-001",
  queryContractId: "SEA-QC-001",
  seatCount: 5,
  clueCount: 5,
  checkpointSkillCoverage: ["LINEAR_PERSON_RELATIVE_LEFT_RIGHT"],
  answerType: "PERSON",
});
assert.equal(easy.band, "EASY");

const medium = assessSea001DifficultyV1({
  checkpointId: "SEA-CP-003",
  queryContractId: "SEA-QC-003",
  seatCount: 8,
  clueCount: 6,
  checkpointSkillCoverage: ["ROTATION_CANONICALISATION", "CENTRE_FACING_LEFT_RIGHT"],
  answerType: "PERSON",
});
assert.equal(medium.band, "MEDIUM");

const hard = assessSea001DifficultyV1({
  checkpointId: "SEA-CP-005",
  queryContractId: "SEA-QC-022",
  seatCount: 7,
  clueCount: 9,
  checkpointSkillCoverage: ["MIXED_CIRCULAR_FACING_STATE", "CONDITIONAL_ORIENTATION", "ROTATION_CANONICALISATION"],
  answerType: "PERSON",
});
assert.equal(hard.band, "HARD");

const sameStructureSmall = assessSea001DifficultyV1({
  checkpointId: "SEA-CP-001",
  queryContractId: "SEA-QC-003",
  seatCount: 5,
  clueCount: 6,
  checkpointSkillCoverage: ["LINEAR_PERSON_RELATIVE_LEFT_RIGHT"],
  answerType: "PERSON",
});
const sameStructureLarge = assessSea001DifficultyV1({
  checkpointId: "SEA-CP-001",
  queryContractId: "SEA-QC-003",
  seatCount: 9,
  clueCount: 6,
  checkpointSkillCoverage: ["LINEAR_PERSON_RELATIVE_LEFT_RIGHT"],
  answerType: "PERSON",
});
assert.equal(sameStructureSmall.band, sameStructureLarge.band);
assert.equal(sameStructureSmall.score, sameStructureLarge.score);

const seedlessReplay = assessSea001DifficultyV1({
  checkpointId: "SEA-CP-002",
  queryContractId: "SEA-QC-005",
  seatCount: 8,
  clueCount: 7,
  checkpointSkillCoverage: ["MIXED_FACING_RESOLUTION", "REFERENCE_PERSON_LEFT_RIGHT", "INFERRED_FACING"],
  answerType: "PERSON",
});
assert.deepEqual(seedlessReplay, assessSea001DifficultyV1({
  checkpointId: "SEA-CP-002",
  queryContractId: "SEA-QC-005",
  seatCount: 8,
  clueCount: 7,
  checkpointSkillCoverage: ["MIXED_FACING_RESOLUTION", "REFERENCE_PERSON_LEFT_RIGHT", "INFERRED_FACING"],
  answerType: "PERSON",
}));

console.log(JSON.stringify({
  status: "PASS_SEA_001_STRUCTURAL_DIFFICULTY_V1",
  bands: [easy.band, medium.band, hard.band],
  seatCountAloneInflatesDifficulty: false,
  seedDriven: false,
}, null, 2));
