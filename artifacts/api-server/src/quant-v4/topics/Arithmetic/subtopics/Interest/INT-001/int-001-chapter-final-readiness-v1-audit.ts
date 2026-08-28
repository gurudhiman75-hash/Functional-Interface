import assert from "node:assert/strict";
import {
  INT_001_CHAPTER_LIFECYCLE,
  INT_001_FINAL_AUTHORITY_REGISTRY_VERSION,
  INT_001_FINAL_CHECKPOINT_AUTHORITIES,
  INT_001_FINAL_QL_IDS,
  INT_001_INTENTIONAL_VACANCY,
  INT_001_NEXT_FREE_QL,
  INT_001_PERMANENT_QL_COUNT,
  getInt001CheckpointAuthorityByQl,
} from "./int-001-final-authority-registry-v1";
import { INT_CP002_FINAL_QL_IDS, INT_CP002_FINAL_REGISTRY } from "./cp002-final-registry";

const expectedCounts = new Map([
  ["INT-CP-001", 21], ["INT-CP-002", 31], ["INT-CP-003", 14], ["INT-CP-004", 19],
  ["INT-CP-005", 9], ["INT-CP-006", 13], ["INT-CP-007", 7], ["INT-CP-008", 9],
  ["INT-CP-009", 5], ["INT-CP-010", 2],
]);

assert.equal(INT_001_FINAL_AUTHORITY_REGISTRY_VERSION, "INT-001-FINAL-AUTHORITY-REGISTRY-v1");
assert.equal(INT_001_FINAL_CHECKPOINT_AUTHORITIES.length, 10);
assert.equal(INT_001_FINAL_QL_IDS.length, INT_001_PERMANENT_QL_COUNT);
assert.equal(new Set(INT_001_FINAL_QL_IDS).size, INT_001_PERMANENT_QL_COUNT);
assert.equal(INT_001_PERMANENT_QL_COUNT, 130);
assert.equal(INT_001_INTENTIONAL_VACANCY, "INT-QL-094");
assert.equal(INT_001_NEXT_FREE_QL, "INT-QL-132");
assert.equal(INT_001_FINAL_QL_IDS.includes("INT-QL-094"), false);
assert.equal(INT_001_FINAL_QL_IDS.includes("INT-QL-132"), false);

for (let number = 1; number <= 131; number += 1) {
  const qlId = `INT-QL-${String(number).padStart(3, "0")}`;
  if (number === 94) assert.equal(INT_001_FINAL_QL_IDS.includes(qlId), false, `${qlId} must remain intentionally vacant`);
  else assert.equal(INT_001_FINAL_QL_IDS.includes(qlId), true, `${qlId} is missing from chapter ownership`);
}

for (const authority of INT_001_FINAL_CHECKPOINT_AUTHORITIES) {
  assert.equal(authority.qlIds.length, expectedCounts.get(authority.cpId), `${authority.cpId} QL count drifted`);
  assert.equal(authority.authorityFrozen, true);
  assert.equal(authority.questionBankWritable, false);
  assert.equal(authority.testEligible, false);
  assert.equal(authority.mockTestEligible, false);
  assert.equal(authority.publiclyPublishable, false);
  assert.deepEqual(
    [...authority.currentQuestionStudioLanguages],
    [...authority.contentLanguages],
    `${authority.cpId} does not expose every currently certified content language to Question Studio`,
  );
  for (const qlId of authority.qlIds) assert.equal(getInt001CheckpointAuthorityByQl(qlId).cpId, authority.cpId);
}

// CP002 historical branch ancestry diverged, so current-file authority—not the old commit—is the proof source.
assert.equal(INT_CP002_FINAL_QL_IDS.length, 31);
assert.deepEqual([...INT_CP002_FINAL_QL_IDS], [...getInt001CheckpointAuthorityByQl("INT-QL-022").qlIds]);
assert.equal(INT_CP002_FINAL_REGISTRY.length, 31);
assert(INT_CP002_FINAL_REGISTRY.every((entry) => entry.cpId === "INT-CP-002"));

const cp002SiLedgerIds = new Set(["INT-QL-028", "INT-QL-029", "INT-QL-030", "INT-QL-031", "INT-QL-032", "INT-QL-042", "INT-QL-043", "INT-QL-044", "INT-QL-045"]);
for (const qlId of cp002SiLedgerIds) assert.equal(getInt001CheckpointAuthorityByQl(qlId).cpId, "INT-CP-002");
for (const qlId of ["INT-QL-125", "INT-QL-126", "INT-QL-127", "INT-QL-128", "INT-QL-129"]) {
  assert.equal(getInt001CheckpointAuthorityByQl(qlId).cpId, "INT-CP-009");
  assert.equal(cp002SiLedgerIds.has(qlId), false);
}

const cp002 = INT_001_FINAL_CHECKPOINT_AUTHORITIES.find((entry) => entry.cpId === "INT-CP-002")!;
assert.deepEqual(cp002.contentLanguages, ["en"]);
assert.deepEqual(cp002.currentQuestionStudioLanguages, ["en"]);
const cp004 = INT_001_FINAL_CHECKPOINT_AUTHORITIES.find((entry) => entry.cpId === "INT-CP-004")!;
assert.deepEqual(cp004.contentLanguages, ["hi", "pa"]);
assert.deepEqual(cp004.currentQuestionStudioLanguages, ["hi", "pa"]);
for (const cpId of ["INT-CP-001", "INT-CP-003", "INT-CP-005", "INT-CP-006", "INT-CP-007", "INT-CP-008", "INT-CP-009", "INT-CP-010"] as const) {
  const authority = INT_001_FINAL_CHECKPOINT_AUTHORITIES.find((entry) => entry.cpId === cpId)!;
  assert.deepEqual(authority.currentQuestionStudioLanguages, ["en", "hi", "pa"]);
}

assert.equal(INT_001_CHAPTER_LIFECYCLE.contentAuthorityComplete, true);
assert.equal(INT_001_CHAPTER_LIFECYCLE.chapterQuestionStudioIntegrationComplete, true);
assert.equal(INT_001_CHAPTER_LIFECYCLE.questionBankWritable, false);
assert.equal(INT_001_CHAPTER_LIFECYCLE.testEligible, false);
assert.equal(INT_001_CHAPTER_LIFECYCLE.mockTestEligible, false);
assert.equal(INT_001_CHAPTER_LIFECYCLE.publiclyPublishable, false);
assert.equal(INT_001_CHAPTER_LIFECYCLE.automaticStudentPublication, false);

const currentStudioQlCount = INT_001_FINAL_CHECKPOINT_AUTHORITIES
  .filter((entry) => entry.currentQuestionStudioLanguages.length > 0)
  .reduce((sum, entry) => sum + entry.qlIds.length, 0);
assert.equal(currentStudioQlCount, 130);

console.log(JSON.stringify({
  registryVersion: INT_001_FINAL_AUTHORITY_REGISTRY_VERSION,
  checkpointCount: INT_001_FINAL_CHECKPOINT_AUTHORITIES.length,
  permanentQlCount: INT_001_FINAL_QL_IDS.length,
  intentionalVacancy: INT_001_INTENTIONAL_VACANCY,
  nextFreeQl: INT_001_NEXT_FREE_QL,
  cp002CurrentRegistryQlCount: INT_CP002_FINAL_REGISTRY.length,
  currentStudioIntegratedQlCount: currentStudioQlCount,
  currentStudioIntegratedCps: INT_001_FINAL_CHECKPOINT_AUTHORITIES.filter((entry) => entry.currentQuestionStudioLanguages.length > 0).map((entry) => entry.cpId),
  chapterQuestionStudioIntegrationComplete: INT_001_CHAPTER_LIFECYCLE.chapterQuestionStudioIntegrationComplete,
  downstreamDeliveryClosed: true,
}, null, 2));
console.log("PASS_INT_001_CHAPTER_FINAL_READINESS_V1_AUDIT");
