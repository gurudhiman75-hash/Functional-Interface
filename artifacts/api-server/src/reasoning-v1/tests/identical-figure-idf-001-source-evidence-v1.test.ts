import assert from "node:assert/strict";
import { IDENTICAL_FIGURE_SOURCE_EVIDENCE_V1 } from "../foundation/spatial/identical-figure-source-evidence-v1";
import { IDENTICAL_FIGURE_SOURCE_SATURATED_DISCOVERY_V1 } from "../foundation/spatial/identical-figure-source-saturated-discovery-v1";

assert.equal(IDENTICAL_FIGURE_SOURCE_EVIDENCE_V1.discoveryAuthorityId, IDENTICAL_FIGURE_SOURCE_SATURATED_DISCOVERY_V1.authorityId);
assert.equal(IDENTICAL_FIGURE_SOURCE_EVIDENCE_V1.sourceSurface.learnerTask, "USE_EACH_NUMBERED_FIGURE_ONCE_AND_FORM_THREE_GROUPS");
assert.equal(IDENTICAL_FIGURE_SOURCE_EVIDENCE_V1.observedSemanticFamilies.length, 3);
assert.equal(IDENTICAL_FIGURE_SOURCE_EVIDENCE_V1.conclusion.numberedBankGroupingIsDistinctSurface, true);
assert.equal(IDENTICAL_FIGURE_SOURCE_EVIDENCE_V1.conclusion.componentIdentityGroupingSupported, true);
assert.equal(IDENTICAL_FIGURE_SOURCE_EVIDENCE_V1.conclusion.topologyGroupingSupported, true);
assert.equal(IDENTICAL_FIGURE_SOURCE_EVIDENCE_V1.conclusion.oddOneOutMustRemainFigureClassification, true);

console.log(JSON.stringify({
  authority: IDENTICAL_FIGURE_SOURCE_EVIDENCE_V1.authorityId,
  sourceSurface: IDENTICAL_FIGURE_SOURCE_EVIDENCE_V1.sourceSurface,
  observedFamilies: IDENTICAL_FIGURE_SOURCE_EVIDENCE_V1.observedSemanticFamilies.map((row) => row.groupingBasis),
  figureClassificationBoundaryPreserved: true,
}, null, 2));
