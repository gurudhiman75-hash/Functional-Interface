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
    `main source ledger missing: ${mainRequirement}`,
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
  "Verified source records:             36 covered/delegated/Wave-E-resolved",
  "Unresolved traced exam records:       1",
  "Unresolved record:                    DISHA-VNV item 195",
  "Wave-D probes reviewed:               8",
  "Final SATURATION_ONLY_SERIES:          7",
  "Final SATURATION_ONLY_SERIES_COLLISION: 1",
  "Unresolved Wave-D ancestry decisions:  0",
  "Post-Wave-E collision audit:          COMPLETE",
  "Mathematical saturation:              PENDING_ITEM_195_RESOLUTION",
  "Ledger completeness:                  BLOCKED",
  "English discovery freeze:             BLOCKED",
  "Permanent QLs:                         0",
  "CP-008:                               BLOCKED",
  "SER_CP007_ITEM_195_RESOLUTION_AND_SOURCE_LEDGER_CLOSE",
]) {
  assert.ok(completion.includes(state), `completion state missing: ${state}`);
}

for (const ancestryState of [
  "Wave-D source-shaped probes reviewed:       8",
  "Direct autonomous Series ancestry found:   0",
  "Final SATURATION_ONLY_SERIES decisions:     7",
  "Final SATURATION_ONLY_SERIES_COLLISION:     1",
  "Unresolved Wave-D ancestry decisions:       0",
  "Mathematical saturation:       PENDING_ITEM_195_RESOLUTION",
  "SER_CP007_ITEM_195_RESOLUTION_AND_SOURCE_LEDGER_CLOSE",
]) {
  assert.ok(ancestry.includes(ancestryState), `ancestry decision missing: ${ancestryState}`);
}

assert.doesNotMatch(completion, /Ledger completeness:\s+COMPLETE/);
assert.doesNotMatch(completion, /English discovery freeze:\s+(?:COMPLETE|FROZEN)/);
assert.doesNotMatch(ancestry, /Unresolved Wave-D ancestry decisions:\s+[1-9]/);

console.log(
  JSON.stringify(
    {
      status:
        "PASS_SER_CP007_SOURCE_LEDGER_36_VERIFIED_WAVE_D_ANCESTRY_CLOSED_ONE_EXAM_RECORD_PENDING",
      verifiedSourceRecords: 36,
      unresolvedTracedExamRecords: 1,
      unresolvedRecord: "DISHA-VNV item 195",
      waveDProbesReviewed: 8,
      finalSaturationOnlySeriesDecisions: 7,
      finalSaturationOnlySeriesCollisionDecisions: 1,
      unresolvedWaveDAncestryDecisions: 0,
      postWaveECollisionAudit: "COMPLETE",
      mathematicalSaturation: "PENDING_ITEM_195_RESOLUTION",
      ledgerCompleteness: "BLOCKED",
      englishDiscoveryFreeze: "BLOCKED",
      permanentQls: 0,
      cp008Status: "BLOCKED",
      nextAuthority: "SER_CP007_ITEM_195_RESOLUTION_AND_SOURCE_LEDGER_CLOSE",
    },
    null,
    2,
  ),
);
