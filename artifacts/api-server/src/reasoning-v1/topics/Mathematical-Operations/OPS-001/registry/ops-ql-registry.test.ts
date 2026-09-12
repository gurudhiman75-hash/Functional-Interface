import assert from "node:assert/strict";
import {
  OPS_CHECKPOINT_RANGES,
  OPS_MERGED_PRESENTATION_ALIASES,
  OPS_QL_ENTRIES,
  OPS_QL_FREEZE_VERSION,
  assertApprovedCandidateCoverage,
  generateFrozenOpsQuestion,
  generateLocalizedFrozenOpsQuestion,
  type OpsQlId,
} from "./ops-ql-registry";

const EXPECTED_CHECKPOINT_COUNTS = {
  "OPS-CP-001": 2,
  "OPS-CP-002": 3,
  "OPS-CP-003": 2,
  "OPS-CP-004": 4,
  "OPS-CP-005": 6,
  "OPS-CP-006": 3,
  "OPS-CP-007": 3,
  "OPS-CP-008": 4,
  "OPS-CP-009": 4,
} as const;

assert.equal(OPS_QL_ENTRIES.length, 31);
assertApprovedCandidateCoverage();

const qlIds = OPS_QL_ENTRIES.map((entry) => entry.qlId);
const candidateIds = OPS_QL_ENTRIES.map((entry) => entry.candidateId);
assert.equal(new Set(qlIds).size, 31);
assert.equal(new Set(candidateIds).size, 31);

for (let index = 0; index < OPS_QL_ENTRIES.length; index += 1) {
  const expected = `OPS-QL-${String(index + 1).padStart(3, "0")}`;
  assert.equal(OPS_QL_ENTRIES[index]?.qlId, expected);
}

for (const [checkpointId, expectedCount] of Object.entries(EXPECTED_CHECKPOINT_COUNTS)) {
  const entries = OPS_QL_ENTRIES.filter((entry) => entry.checkpointId === checkpointId);
  const range = OPS_CHECKPOINT_RANGES[checkpointId as keyof typeof OPS_CHECKPOINT_RANGES];
  assert.equal(entries.length, expectedCount);
  assert.equal(range.count, expectedCount);
  assert.equal(entries[0]?.qlId, range.first);
  assert.equal(entries.at(-1)?.qlId, range.last);
}

assert.deepEqual(OPS_MERGED_PRESENTATION_ALIASES, {
  "OPS-CAND-002": "OPS-QL-001",
  "OPS-CAND-006": "OPS-QL-003",
  "OPS-CAND-031": "OPS-QL-028",
});

const ownedSourceFamilies = new Set(OPS_QL_ENTRIES.flatMap((entry) => entry.sourceFamilyIds));
for (let number = 1; number <= 17; number += 1) {
  const sourceFamily = `OPS-SRC-FAM-${String(number).padStart(2, "0")}`;
  assert.ok(ownedSourceFamilies.has(sourceFamily as never), `Frozen manifest does not own ${sourceFamily}.`);
}

let englishCount = 0;
let localizedCount = 0;
for (const entry of OPS_QL_ENTRIES) {
  for (let seed = 0; seed < 10; seed += 1) {
    const english = generateFrozenOpsQuestion(entry.qlId as OpsQlId, seed);
    assert.equal(english.qlId, entry.qlId);
    assert.equal(english.qlFreezeVersion, OPS_QL_FREEZE_VERSION);
    assert.equal(english.candidateId, entry.candidateId);
    assert.equal(english.checkpointId, entry.checkpointId);
    assert.equal(english.solveMode, entry.solveMode);
    assert.equal(english.options.length, 4);
    assert.equal(new Set(english.options.map((option) => option.value)).size, 4);
    assert.equal(english.options[english.correctIndex]?.value, english.answer);
    assert.equal(english.proof.unique, true);
    assert.equal(english.proof.survivingCandidateCount, 1);
    englishCount += 1;

    for (const locale of ["hi-IN", "pa-IN"] as const) {
      const localized = generateLocalizedFrozenOpsQuestion(entry.qlId as OpsQlId, seed, locale);
      assert.equal(localized.qlId, entry.qlId);
      assert.equal(localized.qlFreezeVersion, OPS_QL_FREEZE_VERSION);
      assert.equal(localized.candidateId, english.candidateId);
      assert.equal(localized.checkpointId, english.checkpointId);
      assert.equal(localized.solveMode, english.solveMode);
      assert.equal(localized.answer, english.answer);
      assert.equal(localized.correctIndex, english.correctIndex);
      assert.equal(localized.options[localized.correctIndex]?.value, localized.answer);
      assert.deepEqual(localized.proof, english.proof);
      localizedCount += 1;
    }
  }
}

assert.equal(englishCount, 310);
assert.equal(localizedCount, 620);

console.log("OPS-001 permanent QL registry passed.", {
  freezeVersion: OPS_QL_FREEZE_VERSION,
  qlCount: OPS_QL_ENTRIES.length,
  checkpointCounts: EXPECTED_CHECKPOINT_COUNTS,
  mergedPresentationAliases: OPS_MERGED_PRESENTATION_ALIASES,
  ownedSourceFamilies: ownedSourceFamilies.size,
  englishCount,
  localizedCount,
});
