import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const root = "src/reasoning-v1/topics/Series/SER-001/SER-CP-007-FINAL-AUDIT";
const mainLedger = readFileSync(`${root}/ser-cp-007-source-ledger-scaffold.md`, "utf8");
const completion = readFileSync(
  `${root}/ser-cp-007-source-ledger-completion-tranche.md`,
  "utf8",
);
const ancestry = readFileSync(
  `${root}/ser-cp-007-wave-d-source-ancestry-decision.md`,
  "utf8",
);
const item195 = readFileSync(`${root}/ser-cp-007-item-195-resolution.md`, "utf8");

for (const mainRequirement of [
  "`SER-SRC-007-024`",
  "item 195",
  "`CLASSIFICATION_PENDING`",
  "Post-Wave-E collision audit: COMPLETE",
  "English discovery freeze:  BLOCKED",
  "Permanent QLs:             0",
]) {
  assert.ok(
    mainLedger.includes(mainRequirement),
    `main source ledger missing historical base state: ${mainRequirement}`,
  );
}

for (const completedRecord of [
  "`SER-SRC-007-030`",
  "`SER-SRC-007-031`",
  "`SER-SRC-007-032`",
  "`SER-SRC-007-033`",
  "`SER-SRC-007-034`",
  "`SER-SRC-007-035`",
  "`SER-SRC-007-036`",
  "`SER-SRC-007-037`",
  "`SER-SRC-007-038`",
  "`SER-SRC-007-039`",
]) {
  assert.ok(
    completion.includes(completedRecord),
    `completion tranche missing record: ${completedRecord}`,
  );
}

for (const exactStem of [
  "`HBS, GDP, FFM, ?, DJG`",
  "`XMT, ENA, LOH, SPO, ?`",
  "`KOY, JPX, IQW, HRV, ?`",
  "`UKS, ZPX, EUC, JZH, ?`",
  "`THC, DIU, VJE, FKW, XLG, ?`",
  "`SAG, KSY, CKQ, ?`",
  "`EBF, JGK, OLP, ?`",
  "`PMJ, EBY, TQN, ?`",
  "`XYXYZXYXY, XYXYXYZXY, XYXYXYXYZ, ZXYXYXYXY, XYZXYXYXY, ...`",
  "`YXXXXXX, YYXXXXX, YYYXXXX, YYYYXXX, YYYYYXX, ...`",
]) {
  assert.ok(completion.includes(exactStem), `missing exact stem: ${exactStem}`);
}

for (const state of [
  "Covered/delegated/Wave-E-resolved source records: 36",
  "Rejected defective/ambiguous source records:       1",
  "Unresolved traced exam records:                     0",
  "Wave-D probes reviewed:                             8",
  "Final SATURATION_ONLY_SERIES:                        7",
  "Final SATURATION_ONLY_SERIES_COLLISION:              1",
  "Unresolved Wave-D ancestry decisions:                0",
  "Post-Wave-E collision audit:                  COMPLETE",
  "Source-ledger completeness:                   COMPLETE",
  "Page/item traceability disposition:           COMPLETE",
  "Mathematical saturation:                      PROVISIONALLY_COMPLETE_AFTER_SOURCE_CLOSE",
  "English editorial review:                     NOT_STARTED",
  "English discovery freeze:                     BLOCKED",
  "Permanent QLs:                                 0",
  "CP-008:                                       BLOCKED",
  "SER_CP007_FULL_ENGLISH_EDITORIAL_REVIEW_AND_MERGE_SPLIT_FREEZE",
]) {
  assert.ok(completion.includes(state), `completion state missing: ${state}`);
}

for (const ancestryState of [
  "Wave-D source-shaped probes reviewed:       8",
  "Direct autonomous Series ancestry found:   0",
  "Final SATURATION_ONLY_SERIES decisions:     7",
  "Final SATURATION_ONLY_SERIES_COLLISION:     1",
  "Unresolved Wave-D ancestry decisions:       0",
]) {
  assert.ok(ancestry.includes(ancestryState), `ancestry decision missing: ${ancestryState}`);
}

for (const itemResolutionState of [
  "REJECTED_SOURCE_DEFECT_AMBIGUOUS_RULE",
  "New authority justified:               NO",
  "Wave F justified:                       NO",
  "Unresolved traced exam records:                     0",
  "Source-ledger completeness:                   COMPLETE",
  "Mathematical saturation:                      PROVISIONALLY_COMPLETE_AFTER_SOURCE_CLOSE",
  "SER_CP007_FULL_ENGLISH_EDITORIAL_REVIEW_AND_MERGE_SPLIT_FREEZE",
]) {
  assert.ok(item195.includes(itemResolutionState), `item-195 resolution missing: ${itemResolutionState}`);
}

assert.doesNotMatch(completion, /Unresolved traced exam records:\s+[1-9]/);
assert.doesNotMatch(completion, /Unresolved Wave-D ancestry decisions:\s+[1-9]/);
assert.doesNotMatch(completion, /English discovery freeze:\s+(?:COMPLETE|FROZEN)/);
assert.doesNotMatch(item195, /New authority justified:\s+YES/);
assert.doesNotMatch(item195, /Wave F justified:\s+YES/);

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP007_SOURCE_LEDGER_CLOSED_36_COVERED_ONE_REJECTED",
      coveredDelegatedOrWaveEResolvedRecords: 36,
      rejectedDefectiveOrAmbiguousRecords: 1,
      unresolvedTracedExamRecords: 0,
      waveDProbesReviewed: 8,
      finalSaturationOnlySeriesDecisions: 7,
      finalSaturationOnlySeriesCollisionDecisions: 1,
      unresolvedWaveDAncestryDecisions: 0,
      postWaveECollisionAudit: "COMPLETE",
      sourceLedgerCompleteness: "COMPLETE",
      pageItemTraceabilityDisposition: "COMPLETE",
      mathematicalSaturation: "PROVISIONALLY_COMPLETE_AFTER_SOURCE_CLOSE",
      englishEditorialReview: "NOT_STARTED",
      englishDiscoveryFreeze: "BLOCKED",
      permanentQls: 0,
      cp008Status: "BLOCKED",
      nextAuthority:
        "SER_CP007_FULL_ENGLISH_EDITORIAL_REVIEW_AND_MERGE_SPLIT_FREEZE",
    },
    null,
    2,
  ),
);
