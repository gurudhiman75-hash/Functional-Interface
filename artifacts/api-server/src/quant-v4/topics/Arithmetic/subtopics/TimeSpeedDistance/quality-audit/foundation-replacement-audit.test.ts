import assert from "node:assert/strict";
import { TSD_CP001_FROZEN_AUTHORITIES } from "../TSD-001/cp001/freeze-registry";
import { TSD_CP002_FROZEN_AUTHORITIES } from "../TSD-001/cp002/freeze-registry";
import { TSD_FINAL_LEARNER_AUTHORITIES } from "../TSD-001/final-authority-registry";
import { generateTsdEnglishFrozenRecords } from "../TSD-001/english-frozen";

// Independently specified exceptional ownership changes; all other modes retain their names.
const replacements: Record<string, readonly string[]> = {
  distanceByProportion: ["referenceTripDistanceAtChangedConditions"],
  timeByProportion: ["referenceTripTimeAtChangedConditions"],
  totalDistanceFromAverageAndTime: ["distanceFromSpeedAndTime"],
  unknownSegmentShareFromAverage: ["unknownDistanceShareFromAverageSpeed", "unknownTimeShareFromAverageSpeed"],
  segmentRatioFromAverageAndSpeeds: ["distanceRatioFromAverageAndSpeeds", "timeRatioFromAverageAndSpeeds"],
  roundTripTimeFromOneWayDistance: ["roundTripLegTimeSum"],
};
const historical = [...TSD_CP001_FROZEN_AUTHORITIES, ...TSD_CP002_FROZEN_AUTHORITIES];
const frozen = generateTsdEnglishFrozenRecords();
assert.equal(historical.length, 37);
assert.equal(frozen.length, 153);
const covered = new Set<string>();
const table = historical.map((source, index) => {
  assert.equal(source.permanentQlId, `TSD-QL-${String(index + 1).padStart(3, "0")}`);
  const expected = replacements[source.solveMode] ?? [source.solveMode];
  const actual = TSD_FINAL_LEARNER_AUTHORITIES.filter(a => a.legacyReviewQlAliases.includes(source.permanentQlId));
  assert.deepEqual(actual.map(a => a.authorityKey).sort(), [...expected].sort(), source.permanentQlId);
  const records = frozen.filter(r => r.sourceTrace.legacyReviewQlId === source.permanentQlId);
  assert.ok(records.length >= 3, `${source.permanentQlId}: missing historical review evidence`);
  assert.ok(records.every(r => r.sourceTrace.runtimeSolveMode === source.solveMode));
  for (const authority of actual) {
    covered.add(authority.authorityKey);
    assert.ok(authority.underlyingSolveModes.includes(source.solveMode));
    assert.ok(authority.sourceCandidates.length > 0);
    assert.ok(records.some(r => r.solveMode === authority.authorityKey), `${source.permanentQlId}: replacement absent from frozen corpus`);
  }
  assert.ok(records.every(r => expected.includes(r.solveMode)));
  return `| ${source.permanentQlId} | ${source.solveMode} | ${expected.join("; ")} | ${records.length} |`;
});
assert.deepEqual([...covered].sort(), TSD_FINAL_LEARNER_AUTHORITIES.map(a => a.authorityKey).sort());
for (const row of frozen) {
  assert.equal(row.permanentQlId, null);
  assert.equal(row.lifecycle.questionBankStatus, "NOT_STORED");
  assert.equal(row.lifecycle.testEligibility, "INELIGIBLE");
  assert.equal(row.lifecycle.publiclyPublishable, false);
  assert.equal(row.englishFreezeProof.questionStudioUnlocked, false);
}
console.log(`# Foundation replacement audit — 2026-10-05

PASS: all 37 historical learning goals map to ${covered.size} remodeled learner authorities, supported by all 153 English frozen records. QL033 merges into distance from speed and time; QL029 and QL035 each split into distance/time weighting authorities. The historical QL identifiers are trace aliases, not newly allocated permanent identifiers.

This proves repository ownership and frozen corpus trace coverage. Source-candidate labels are internal discovery metadata; this does not establish external exam-paper provenance or independent mathematical verification of every foundation answer.

| Historical alias | Historical solve mode | Remodeled authority | Frozen records |
| --- | --- | --- | --- |
${table.join("\n")}

All 153 records retain null permanent QL allocation and locked Question Studio, Bank, test and public delivery.
`);
