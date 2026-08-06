import assert from "node:assert/strict";
import { SAP_CP001_WAVE01_PROTOTYPE_IDS } from "./wave01/types";
import { SAP_CP001_WAVE02_PROTOTYPE_IDS } from "./wave02/types";
import { SAP_CP001_WAVE03_PROTOTYPE_IDS } from "./wave03/types";
import {
  SAP_CP001_AUTHORITY_MAP,
  SAP_CP001_CURRENT_DISCOVERY_STATE,
  SAP_CP001_DESIGN_SOLVE_MODES,
  SAP_CP001_MERGE_SPLIT_DECISIONS,
} from "./SAP-CP-001-AUTHORITY-MAP";

const allPrototypeIds = [
  ...SAP_CP001_WAVE01_PROTOTYPE_IDS,
  ...SAP_CP001_WAVE02_PROTOTYPE_IDS,
  ...SAP_CP001_WAVE03_PROTOTYPE_IDS,
];
const uniquePrototypeIds = new Set(allPrototypeIds);
const mappedPrototypeIds = new Set(Object.values(SAP_CP001_AUTHORITY_MAP));

assert.equal(SAP_CP001_DESIGN_SOLVE_MODES.length, 18);
assert.equal(Object.keys(SAP_CP001_AUTHORITY_MAP).length, SAP_CP001_DESIGN_SOLVE_MODES.length);
assert.equal(allPrototypeIds.length, 17);
assert.equal(uniquePrototypeIds.size, allPrototypeIds.length, "Temporary prototype IDs must be unique across waves");
assert.equal(mappedPrototypeIds.size, allPrototypeIds.length,
  "Every temporary authority should own at least one baseline solve mode");

for (const solveMode of SAP_CP001_DESIGN_SOLVE_MODES) {
  const prototypeId = SAP_CP001_AUTHORITY_MAP[solveMode];
  assert.ok(uniquePrototypeIds.has(prototypeId as never), `${solveMode} maps to an unknown prototype`);
}
for (const prototypeId of allPrototypeIds) {
  assert.ok(mappedPrototypeIds.has(prototypeId), `${prototypeId} has no mapped solve mode`);
}

assert.equal(
  SAP_CP001_AUTHORITY_MAP.evaluateNestedParenthesesExpression,
  SAP_CP001_AUTHORITY_MAP.evaluateMixedBracketExpression,
  "Bracket glyph variation must not create a duplicate learner authority",
);
assert.notEqual(
  SAP_CP001_AUTHORITY_MAP.evaluateVinculumOrFractionBarGrouping,
  SAP_CP001_AUTHORITY_MAP.evaluateNestedParenthesesExpression,
  "Fraction-bar scope remains distinct while it changes numerator/denominator ownership",
);
assert.notEqual(
  SAP_CP001_AUTHORITY_MAP.identifyFirstValidEvaluationStep,
  SAP_CP001_AUTHORITY_MAP.identifyIncorrectPrecedenceStep,
  "Valid-step selection and error diagnosis retain different answer semantics",
);

assert.equal(SAP_CP001_CURRENT_DISCOVERY_STATE.designSolveModeCount, 18);
assert.equal(SAP_CP001_CURRENT_DISCOVERY_STATE.temporaryPrototypeCount, 17);
assert.equal(SAP_CP001_CURRENT_DISCOVERY_STATE.proposedEnglishTemplateCount, 16);
assert.equal(SAP_CP001_CURRENT_DISCOVERY_STATE.approvedEnglishTemplateCount, 16);
assert.equal(SAP_CP001_CURRENT_DISCOVERY_STATE.englishManualFreezeStatus, "APPROVED");
assert.equal(SAP_CP001_CURRENT_DISCOVERY_STATE.englishReviewExportCount, 51);
assert.equal(SAP_CP001_CURRENT_DISCOVERY_STATE.permanentQlCount, 16);
assert.equal(SAP_CP001_CURRENT_DISCOVERY_STATE.permanentQlRange, "SAP-QL-001..SAP-QL-016");
assert.equal(SAP_CP001_CURRENT_DISCOVERY_STATE.nextAvailablePermanentQlId, "SAP-QL-017");
assert.equal(SAP_CP001_CURRENT_DISCOVERY_STATE.permanentRuntimeStatus, "ALLOCATED_INACTIVE");
assert.equal(SAP_CP001_CURRENT_DISCOVERY_STATE.activePackageCount, 0);
assert.equal(SAP_CP001_CURRENT_DISCOVERY_STATE.questionStudioDiscoverableCount, 0);
assert.equal(SAP_CP001_CURRENT_DISCOVERY_STATE.questionBankWritableCount, 0);
assert.equal(SAP_CP001_CURRENT_DISCOVERY_STATE.testEligibleCount, 0);
assert.equal(SAP_CP001_CURRENT_DISCOVERY_STATE.publiclyPublishableCount, 0);
assert.equal(
  SAP_CP001_MERGE_SPLIT_DECISIONS.permanentQlAllocation,
  "ALLOCATED_INACTIVE_SAP_QL_001_TO_016",
);

console.log(JSON.stringify({
  status: "PASS_SAP_CP001_SATURATION_AUTHORITY",
  designSolveModes: SAP_CP001_DESIGN_SOLVE_MODES.length,
  temporaryPrototypeCount: allPrototypeIds.length,
  approvedEnglishTemplateCount: SAP_CP001_CURRENT_DISCOVERY_STATE.approvedEnglishTemplateCount,
  englishManualFreezeStatus: SAP_CP001_CURRENT_DISCOVERY_STATE.englishManualFreezeStatus,
  uniquePrototypeCount: uniquePrototypeIds.size,
  mappedPrototypeCount: mappedPrototypeIds.size,
  permanentQlCount: SAP_CP001_CURRENT_DISCOVERY_STATE.permanentQlCount,
  permanentQlRange: SAP_CP001_CURRENT_DISCOVERY_STATE.permanentQlRange,
  nextAvailablePermanentQlId: SAP_CP001_CURRENT_DISCOVERY_STATE.nextAvailablePermanentQlId,
  activePackageCount: 0,
  mergeSplitDecisions: SAP_CP001_MERGE_SPLIT_DECISIONS,
}, null, 2));
