import assert from "node:assert/strict";
import audit from "../source-audit/geometry-source-saturation-audit-v1.json";
import { GEO_GAP_CLOSURE_COUNTS_V1, GEO_GAP_CLOSURE_LEDGER_V1 } from "../source-audit/geometry-gap-closure-ledger-v1";
import { GEO_GAP_REMEDIATION_WAVE8_PROTOTYPES } from "../source-remediation/wave8-prototypes";
import { GEO_GAP_REMEDIATION_WAVE9_PROTOTYPES } from "../source-remediation/wave9-prototypes";
import { GEO_GAP_REMEDIATION_WAVE10_PROTOTYPES } from "../source-remediation/wave10-prototypes";
import { GEO_GAP_REMEDIATION_WAVE11_PROTOTYPES } from "../source-remediation/wave11-prototypes";
import { GEO_GAP_REMEDIATION_WAVE12_PROTOTYPES } from "../source-remediation/wave12-prototypes";
import { GEO_GAP_REMEDIATION_WAVE13_PROTOTYPES } from "../source-remediation/wave13-prototypes";

const baselineGapIds = audit.chapterAudits.flatMap((chapter) => chapter.newGapCandidates.map((gap) => `${chapter.chapterId}/${gap}`)).sort();
const ledgerGapIds = GEO_GAP_CLOSURE_LEDGER_V1.map((entry) => entry.gapId).sort();
assert.equal(baselineGapIds.length, 52, "Source Saturation Audit V1 must retain the immutable 52-gap baseline");
assert.equal(new Set(ledgerGapIds).size, 52, "Closure ledger must not contain duplicate gap identities");
assert.deepEqual(ledgerGapIds, baselineGapIds, "Every original audit gap must appear exactly once in the closure ledger");
assert.deepEqual(GEO_GAP_CLOSURE_COUNTS_V1, { total: 52, implemented: 37, merged: 9, ownedOtherChapter: 1, sourceDeferred: 5 });

for (const entry of GEO_GAP_CLOSURE_LEDGER_V1) {
  assert.ok(entry.resolution.length > 40, `${entry.gapId} needs an explicit closure rationale`);
  if (entry.state === "IMPLEMENTED") assert.ok(entry.prototypeIds && entry.prototypeIds.length > 0, `${entry.gapId} implemented without prototype evidence`);
  if (entry.state === "DEFERRED_SOURCE_EVIDENCE") assert.ok(entry.revisitTrigger && entry.revisitTrigger.length > 30, `${entry.gapId} deferred without a reopen trigger`);
}

const postWave7CandidateCount = 63
  + GEO_GAP_REMEDIATION_WAVE8_PROTOTYPES.length
  + GEO_GAP_REMEDIATION_WAVE9_PROTOTYPES.length
  + GEO_GAP_REMEDIATION_WAVE10_PROTOTYPES.length
  + GEO_GAP_REMEDIATION_WAVE11_PROTOTYPES.length
  + GEO_GAP_REMEDIATION_WAVE12_PROTOTYPES.length
  + GEO_GAP_REMEDIATION_WAVE13_PROTOTYPES.length;
assert.equal(postWave7CandidateCount, 81, "Final Geometry temporary executable candidate count must be 81");

assert.equal(GEO_GAP_CLOSURE_LEDGER_V1.some((entry) => (entry.state as string) === "OPEN"), false);
assert.equal(GEO_GAP_CLOSURE_LEDGER_V1.some((entry) => (entry.state as string) === "UNCLASSIFIED"), false);

console.log("Geometry gap closure ledger V1 PASS: all 52 immutable audit gaps classified exactly once; 37 implemented, 9 merged, 1 cross-chapter owned, 5 source-deferred; 81 executable candidates; no open/unclassified gaps.");
