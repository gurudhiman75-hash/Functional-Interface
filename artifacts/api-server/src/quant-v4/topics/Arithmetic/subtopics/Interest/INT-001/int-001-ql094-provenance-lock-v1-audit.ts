import assert from "node:assert/strict";
import {
  INT_CP005_REGISTRY,
} from "./cp005-variable-growth-decay-runtime";
import {
  INT_CP005_V16_1_FREEZE_APPROVAL,
  generateIntCp005V16_1FrozenQuestion,
} from "./cp005-variable-growth-decay-v16-1-frozen";
import {
  INT_001_FINAL_CHECKPOINT_AUTHORITIES,
  INT_001_FINAL_QL_IDS,
  INT_001_INTENTIONAL_VACANCY,
  INT_001_NEXT_FREE_QL,
  INT_001_PERMANENT_QL_COUNT,
} from "./int-001-final-authority-registry-v1";
import { INT_001_QL094_PROVENANCE_LOCK_V1 } from "./int-001-ql094-provenance-lock-v1";

const ql094V1 = INT_CP005_REGISTRY.find((entry) => entry.qlId === "INT-QL-094");
assert.ok(ql094V1, "historical CP005 V1 registry no longer exposes the QL094 provenance record");
assert.equal(ql094V1.solveContract, "EXPLICIT_EVENT_ORDER_FINAL_VALUE");
assert.deepEqual([...ql094V1.legacyCoverage], ["new:explicit-growth-plus-migration-order"]);
assert.equal(ql094V1.legacyCoverage.some((entry) => !entry.startsWith("new:")), false, "QL094 unexpectedly gained a recovered legacy/source-family tag");

assert.equal(INT_001_QL094_PROVENANCE_LOCK_V1.originalV1CoverageTag, ql094V1.legacyCoverage[0]);
assert.equal(INT_001_QL094_PROVENANCE_LOCK_V1.recoveredLegacyOrExamFamily, false);
assert.equal(INT_001_QL094_PROVENANCE_LOCK_V1.originalClassification, "SYNTHETIC_DESIGN_LEAD");
assert.equal(INT_001_QL094_PROVENANCE_LOCK_V1.chapterDisposition, "INTENTIONAL_PERMANENT_VACANCY");
assert.equal(INT_001_QL094_PROVENANCE_LOCK_V1.ql094ReservedForFutureUse, false);
assert.equal(INT_001_QL094_PROVENANCE_LOCK_V1.currentDeliveryEligible, false);
assert.equal(INT_001_QL094_PROVENANCE_LOCK_V1.resurrectionRequirements.length, 4);

assert.equal(INT_CP005_V16_1_FREEZE_APPROVAL.excludedQl, "INT-QL-094");
assert.equal(INT_CP005_V16_1_FREEZE_APPROVAL.learnerQls.includes("INT-QL-094"), false);

let rejectionChecks = 0;
for (const locale of ["en-IN", "hi-IN", "pa-IN"] as const) {
  assert.throws(
    () => generateIntCp005V16_1FrozenQuestion("INT-QL-094", `ql094-provenance-lock:${locale}`, locale),
    /outside CP005 V16\.1 frozen learner authority/u,
    `QL094 should remain rejected by the V16.1 ${locale} freeze`,
  );
  rejectionChecks += 1;
}

assert.equal(INT_001_INTENTIONAL_VACANCY, "INT-QL-094");
assert.equal(INT_001_PERMANENT_QL_COUNT, 130);
assert.equal(INT_001_NEXT_FREE_QL, "INT-QL-132");
assert.equal(INT_001_FINAL_QL_IDS.length, 130);
assert.equal(INT_001_FINAL_QL_IDS.includes("INT-QL-094"), false);
assert.equal(INT_001_FINAL_QL_IDS.includes("INT-QL-132"), false);

const cp005 = INT_001_FINAL_CHECKPOINT_AUTHORITIES.find((authority) => authority.cpId === "INT-CP-005");
assert.ok(cp005, "missing CP005 final chapter authority");
assert.deepEqual(cp005.qlIds, [
  "INT-QL-086", "INT-QL-087", "INT-QL-088", "INT-QL-089", "INT-QL-090",
  "INT-QL-091", "INT-QL-092", "INT-QL-093", "INT-QL-095",
]);
assert.equal(cp005.qlIds.includes("INT-QL-094"), false);
assert.ok(cp005.notes.some((note) => note.includes("INT-QL-094 remains intentionally vacant")));

assert.equal(INT_001_QL094_PROVENANCE_LOCK_V1.protectedInterpretation.vacancyIsNotAnImplementationBug, true);
assert.equal(INT_001_QL094_PROVENANCE_LOCK_V1.protectedInterpretation.historicalV14InclusionDoesNotCreateSourceAuthority, true);
assert.equal(INT_001_QL094_PROVENANCE_LOCK_V1.protectedInterpretation.oldSyntheticRuntimeMustNotBeUsedAsSourceProof, true);
assert.equal(INT_001_QL094_PROVENANCE_LOCK_V1.protectedInterpretation.nextFreeQlMustNotMoveBecauseOfThisRecord, true);

console.log("PASS_INT_001_QL094_PROVENANCE_LOCK_V1_AUDIT");
console.log(JSON.stringify({
  qlId: INT_001_QL094_PROVENANCE_LOCK_V1.qlId,
  historicalContract: ql094V1.solveContract,
  historicalCoverageTag: ql094V1.legacyCoverage[0],
  recoveredSourceAuthority: false,
  v16_1Excluded: true,
  frozenLocaleRejectionChecks: rejectionChecks,
  currentDisposition: INT_001_QL094_PROVENANCE_LOCK_V1.chapterDisposition,
  permanentQlCount: INT_001_PERMANENT_QL_COUNT,
  nextFreeQl: INT_001_NEXT_FREE_QL,
  ql094Reserved: false,
}, null, 2));
