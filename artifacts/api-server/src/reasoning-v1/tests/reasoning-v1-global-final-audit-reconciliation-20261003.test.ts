import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { REASONING_V1_CURRENT_IMPLEMENTED_AUDIT_RECONCILIATION_20261003 as reconciliation } from "../shared/reasoning-v1-global-final-audit-reconciliation-20261003";
import { REASONING_V1_NOVELTY_INVENTORY_V1 } from "../shared/reasoning-novelty-inventory-v1";
import { SPATIAL_FAMILY_FREEZE_AUTHORITY_V1 } from "../foundation/spatial/spatial-family-freeze-v1";
import { MIS_PERMANENT_QL_IDS } from "../topics/Missing-Number/MIS-001/MIS-PERMANENT-QL-REGISTRY";
import { SER_PERMANENT_QL_IDS_V4 } from "../topics/Series/SER-001/SER-PERMANENT-QL-REGISTRY-V4";

assert.equal(reconciliation.chapters.length, 27, "Expected 27 currently implemented Reasoning topic authorities.");
assert.equal(new Set(reconciliation.chapters.map((x) => x.topicDirectory)).size, 27);
assert.equal(new Set(reconciliation.chapters.map((x) => x.chapterId)).size, 27);

const reasoningRoot = resolve(process.cwd(), "src/reasoning-v1");
for (const chapter of reconciliation.chapters) {
  assert.ok(
    existsSync(resolve(reasoningRoot, chapter.closureAuthorityPath)),
    chapter.chapterId + ": closure authority path is missing: " + chapter.closureAuthorityPath,
  );
  assert.ok(
    chapter.auditState === "PASS" || chapter.auditState === "PASS_WITH_REVIEW_GATE",
    chapter.chapterId + ": current implemented audit is not reconciled.",
  );
}

const allowedNoveltyStates = new Set([
  "APPROVED_CONTROLLED_NOVEL_RUNTIME",
  "DEDICATED_NOVELTY_AUDIT_COMPLETE_NO_ADMISSIBLE_PROVIDER",
]);
for (const entry of REASONING_V1_NOVELTY_INVENTORY_V1) {
  assert.ok(
    allowedNoveltyStates.has(entry.status),
    entry.topicDirectory + ": novelty inventory still has a non-final status: " + entry.status,
  );
}

assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.freezeContract.familyFrozen, true);
assert.equal(SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.permanentQlCount, 63);
assert.equal(MIS_PERMANENT_QL_IDS.length, 73);
assert.equal(SER_PERMANENT_QL_IDS_V4.length, 29);

assert.deepEqual(
  reconciliation.knownStandaloneBlueprintFrontier,
  ["REAS-INE", "REAS-ASM", "REAS-DCS", "REAS-GAM"],
);

console.log(JSON.stringify({
  status: "PASS_REASONING_V1_CURRENT_IMPLEMENTED_GLOBAL_AUDIT_RECONCILIATION_20261003",
  implementedTopicAuthorities: reconciliation.chapters.length,
  passWithReviewGate: reconciliation.chapters
    .filter((x) => x.auditState === "PASS_WITH_REVIEW_GATE")
    .map((x) => x.chapterId),
  noveltyInventoryCount: REASONING_V1_NOVELTY_INVENTORY_V1.length,
  spatialPermanentQls: SPATIAL_FAMILY_FREEZE_AUTHORITY_V1.permanentQlCount,
  missingNumberPermanentQls: MIS_PERMANENT_QL_IDS.length,
  seriesPermanentQls: SER_PERMANENT_QL_IDS_V4.length,
  knownStandaloneBlueprintFrontier: reconciliation.knownStandaloneBlueprintFrontier,
}, null, 2));
