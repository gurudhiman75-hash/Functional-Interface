import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const path =
  "src/reasoning-v1/topics/Series/SER-001/SER-CP-007-FINAL-AUDIT/ser-cp-007-item-195-resolution.md";
const resolution = readFileSync(path, "utf8");

for (const evidence of [
  "opo_ _ po_ppo_ _ pppo _ op _ p",
  "(a) opopooo",
  "(b) opoooop",
  "195. (a)",
  "opooppooppooopppoooppp",
  "o¹ p¹ o² p² o² p² o³ p³ o³ p³",
  "REJECTED_SOURCE_DEFECT_AMBIGUOUS_RULE",
]) {
  assert.ok(resolution.includes(evidence), `missing item-195 evidence: ${evidence}`);
}

for (const decision of [
  "Exact option-text evidence:            CONFLICTING",
  "Canonical mathematical rule:           NOT UNIQUELY ESTABLISHED",
  "Existing authority match:              NOT PROVEN",
  "New authority justified:               NO",
  "Wave F justified:                       NO",
]) {
  assert.ok(resolution.includes(decision), `missing item-195 decision: ${decision}`);
}

for (const state of [
  "Covered/delegated/Wave-E-resolved source records: 36",
  "Rejected defective/ambiguous source records:       1",
  "Unresolved traced exam records:                     0",
  "Wave-D final SATURATION_ONLY_SERIES decisions:       7",
  "Wave-D final SATURATION_ONLY_SERIES_COLLISION:       1",
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
  assert.ok(resolution.includes(state), `missing source-close state: ${state}`);
}

assert.doesNotMatch(resolution, /New authority justified:\s+YES/);
assert.doesNotMatch(resolution, /Wave F justified:\s+YES/);
assert.doesNotMatch(resolution, /Unresolved traced exam records:\s+[1-9]/);
assert.doesNotMatch(resolution, /English discovery freeze:\s+(?:COMPLETE|FROZEN)/);

console.log(
  JSON.stringify(
    {
      status: "PASS_SER_CP007_ITEM_195_REJECTED_SOURCE_DEFECT_AND_LEDGER_CLOSED",
      coveredDelegatedOrWaveEResolvedRecords: 36,
      rejectedDefectiveOrAmbiguousRecords: 1,
      unresolvedTracedExamRecords: 0,
      unresolvedWaveDAncestryDecisions: 0,
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
